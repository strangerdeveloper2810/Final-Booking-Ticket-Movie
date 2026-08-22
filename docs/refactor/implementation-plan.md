# Implementation Plan — Feature-Pattern Refactor + Tailwind/antd-only Styling

Companion to `design-plan.md`. This document is written to be handed to an execution agent (or a human) with no other context beyond this repo. Two independent-but-sequenced workstreams:

- **A. Structural refactor**: page-pattern → feature-pattern folders.
- **B. Styling refactor**: retire the custom SCSS system, migrate everything to Tailwind + antd per `design-plan.md`, including the net-new Booking page UI.

**Do A before B.** B rewrites JSX/markup extensively; doing it against files that are about to move would double the diff/conflict surface. Within each stage, verify (`CI=true pnpm build` + `pnpm test`) and commit before moving to the next phase — every phase must leave the app in a working, deployable state.

---

## A. Structural refactor: feature-pattern

### A.0 Target structure

```
src/
  app/                      # composition root
    App.tsx
    store.ts                # was Redux/store.ts
    routes.tsx              # was Routes/AppRoute.tsx + constants/initialRoute.ts merged
    rootSaga.ts             # was Redux/saga/rootSaga.ts
  features/
    home/
      components/           # CarouselHome, Film, FilmItem, ListCinema, ListMovie
      redux/                 # banner + cinema + filmList: constants, reducer, saga, types (one sub-per-domain or grouped — see A.2)
      pages/Home.tsx
      index.ts               # public barrel: only what routes.tsx needs (the page)
    film-detail/
      pages/Detail.tsx
      services/              # FlimDetailService, ManagementMovieService (confirm both are detail-only — see A.1 verification step)
      redux/types/           # FilmDetail, CalendarFilmType (no redux state today, just types — keep as-is unless Booking work below changes that)
      index.ts
    booking/
      pages/BookingTicket.tsx
      redux/                 # BookingTicketConstants, BookingTicket.reducer, Booking.saga, BookingTicketType
      index.ts
    auth/
      components/AuthLayout.tsx        # new shared layout, see design-plan §4.4
      pages/Login.tsx
      pages/Register.tsx
      validation/                       # both ValidationSchema files, unify naming casing
      redux/                            # UserConstants, UserSaga.reducer, UserSaga(+test), UserType
      services/Auth.services.ts
      index.ts
  shared/
    components/               # Header, Footer, LoadingNew, SkeletonCard, SkeletonCarousel, Star
    templates/                 # HomeTemplate, ErrorTemplate
    redux/
      loading/                 # Loading.reducer.ts (cross-feature UI state)
    types/                     # IRoutes, ITemplate
    utils/                     # common.ts(+test), setting.ts
  assets/                      # img/ only after stage B removes scss/
  index.tsx
  index.css                    # only if design-plan review keeps it; otherwise deleted in stage B
  react-app-env.d.ts
  reportWebVitals.ts
  setupTests.ts
  __mocks__/
```

Each `features/<name>/index.ts` re-exports only what `app/routes.tsx` needs (the page component) — internal feature modules import each other by relative path, not through the barrel, to avoid circular-import foot-guns.

### A.1 Pre-flight verification (do this before moving anything)

Some current file placements are ambiguous and must be confirmed by grep, not assumed:
- `services/ManagementMovieService.ts` — confirm it's only imported by `Pages/Details/Detail.tsx`. If any other feature imports it, it belongs in `shared/` instead of `features/film-detail/`.
- `constants/BookingTicket.ts`, `constants/FilmList.ts`, `constants/ListCinema.ts`, `constants/banner.ts` — confirm each is only imported by its matching reducer (this was true as of the last audit; re-verify since files may have moved since).
- `Redux/reducer/Loading.reducer.ts` — confirm it's referenced from `Redux/store.ts` and read by more than one feature (Home + Film both read `state.Loading`) — this is why it's `shared/`, not feature-owned.

### A.2 Redux slice grouping for `features/home`

Home currently pulls from **three** independent Redux domains (banner, cinema, filmList) that don't share reducers/sagas today. Two acceptable approaches — pick one and apply consistently, don't mix:
1. Keep them as three sub-folders under `features/home/redux/{banner,cinema,filmList}/` (lowest-risk, mirrors current separation).
2. Consolidate into one `homeSlice`-per-concern file each, still separate saga watchers registered in `app/rootSaga.ts`.

Recommendation: **option 1** for this pass — don't couple unrelated data (banners, cinema list, film list) into a shared reducer just for the sake of fewer files; that's a premature abstraction the design/plan doesn't require.

### A.3 Migration mechanics
1. `git mv` each file/folder to its new home (preserves history — don't recreate files with Write).
2. Update every import path repo-wide. Because `tsconfig.json` sets `baseUrl: "src"`, absolute imports like `Redux/store`, `Components`, `services/...`, `constants/...`, `util/...`, `Template` are used everywhere — grep for each old root segment (`Redux/`, `Components/`, `Pages/`, `Routes/`, `Template/`, `services/`, `constants/`, `util/`, `types/`) across `src/**/*.ts(x)` and rewrite to the new absolute path (e.g. `Redux/store` → `app/store`, `Components` → `shared/components`, `util/common` → `shared/utils/common`).
3. Update the two existing test files' relative imports if their target moved (`src/Redux/saga/BannerSaga/BannerSaga.test.ts`, `src/Redux/saga/UserSaga/UserSaga.test.ts`) — they currently import relatively from their own folder, so this only matters if the saga file's *neighbors* change.
4. Update `jest.config.js`'s `moduleNameMapper` only if `src/__mocks__` moves (plan above keeps it at `src/__mocks__`, so likely no change needed) — verify path still resolves.
5. `craco.config.js` has no hardcoded `src` file paths — no change expected, but re-run the build to confirm the swc-loader/eslint-webpack-plugin config still applies (it targets by file extension, not path, so it should be unaffected).
6. Delete now-empty old directories (`Pages/`, `Routes/`, `Template/` at top level, old `Redux/` if fully absorbed, old `constants/`, `services/` if fully absorbed, `types/` if fully absorbed).

### A.4 Verification gate for stage A
- `rm -rf build && CI=true pnpm build` → must print "Compiled successfully." (no unresolved-import errors, no new eslint warnings).
- `pnpm test` → same 3 suites / 7 tests must still pass, from their new locations.
- `pnpm exec tsc --noEmit` clean.
- Manually diff `git diff --stat` against pre-refactor to confirm no file content changed unintentionally during the move (only import-path lines should differ, aside from any files intentionally merged like `routes.tsx`).

---

## B. Styling refactor: Tailwind + antd only

Do this **after** A is merged, operating on the new feature-based paths.

### B.0 Token setup (do first, once)
1. Create a single source of truth for design tokens, e.g. `src/shared/theme/tokens.ts`, exporting the palette from `design-plan.md` §2 as plain constants.
2. Wire it into `tailwind.config.js` (`theme.extend.colors`) by importing the same constants (a `.js`/`.cjs` config can `require()` a `.ts` file only via `ts-node`/build step — simplest is to keep the raw hex values duplicated in both `tailwind.config.js` and a small `tokens.ts`, with a comment in each pointing at the other, OR define the palette in a `.js` tokens file that both `tailwind.config.js` and the antd `ConfigProvider` import — prefer this second option since it avoids the TS-in-CJS friction and gives an actual single source of truth).
3. Wrap the app root (`src/App.tsx` or `src/index.tsx`) in antd's `<ConfigProvider theme={{ token: { colorPrimary: tokens.primary, colorBgBase: tokens.background, borderRadius: 8, ... } }}>`.
4. `pnpm build` and eyeball that antd defaults (buttons, tabs) already pick up the new primary color before touching any individual page — this de-risks the rest of the migration.

### B.1 Retire the SCSS system
1. Inventory every remaining selector in `src/assets/scss/**` against the components that use them (post stage-A move) — for each, either (a) port to Tailwind utility classes on the element, or (b) if it's a genuinely reusable pattern (e.g. the sticky-footer flex trick currently in `index.css`), express it as a small reusable Tailwind class combo or a `@apply`-based utility in `src/index.css` kept minimal, or a tiny reusable React wrapper component — prefer plain Tailwind classes over `@apply` where practical, since `@apply` is exactly the kind of "custom CSS layer" this migration is trying to eliminate.
2. Delete `src/assets/scss/` entirely once every selector is accounted for.
3. Remove `sass` and `sass-loader` from `package.json` devDependencies/dependencies and re-run `pnpm install` to update the lockfile.
4. Remove the `import "assets/scss/style.scss"` line from `src/index.tsx`.
5. Re-check `src/index.css` per design-plan — likely reduced to a handful of Tailwind `@layer base`/`@apply` rules for the sticky-footer layout, or removed if that layout is achieved with plain flex/grid utility classes instead (preferred).

### B.2 Per-page rebuild (in this order, easiest→hardest, matching `design-plan.md` §4)
1. **Shared shell**: `Header`, `Footer`, `LoadingNew` (→ antd `Spin`), `ErrorTemplate`, `HomeTemplate`.
2. **Home**: hero carousel, film cards (`FilmItem` → antd `Card`), cinema tabs restyle.
3. **Auth**: build the shared `AuthLayout`, migrate `Login`/`Register` to antd `Form`.
4. **Film Detail**: hero section, showtime tabs.
5. **Booking**: this is the only page needing *new* functionality, not just re-skinning:
   - Extend `features/booking/redux/BookingTicketType.ts` with the seat-map shape actually returned by `GET_TICKET_API` (`/api/QuanLyDatVe/LayDanhSachPhongVe`) — inspect the real API response shape first (don't guess field names), then model `selectedSeats: string[]` (or seat IDs) in the reducer plus `SELECT_SEAT`/`DESELECT_SEAT` action types (client-side only, no new saga needed unless a submit-booking endpoint also needs wiring — check whether the CyberSoft training API this project targets has a "đặt vé" submit endpoint; if yes, wire a new saga watcher for it under `features/booking/redux/`).
   - Build the seat-grid + summary UI per `design-plan.md` §4.3.

### B.3 Recommended (optional) follow-on: drop formik+yup for antd Form validation
`Login`/`Register` currently use `formik` + `yup`. Once both are rebuilt with antd `Form`, antd's own `rules`-based validation covers the same cases (required, email format, min length) without a second form-state library. This is optional — flag it as a separate decision point, don't bundle it silently into the styling PR, since it's a dependency removal with its own blast radius (check no other page uses `formik`/`yup` before removing — as of this writing, only `Login`/`Register`/their validation-schema files do).

### B.4 Verification gate for stage B
- `rm -rf build && CI=true pnpm build` → "Compiled successfully."
- `pnpm test` → still green (note: Booking's new Redux logic should get new unit tests added here, matching the existing saga-test pattern in `BannerSaga.test.ts`/`UserSaga.test.ts` — coverage config in `jest.config.js` requires 100% branches/functions/lines/statements when run with `--coverage`, so new code must be tested, not just built).
- No `.scss` files remain anywhere in `src/`; `sass`/`sass-loader` are gone from `package.json`.
- Bundle size check: `build/bundle-report.html` should show no regression vs. the pre-refactor baseline (antd was already the largest dependency pre-refactor — this pass shouldn't add new heavy libraries; specifically don't add a second UI kit or a CSS-in-JS runtime, which would contradict "Tailwind + antd only").

---

## Risk register

| Risk | Mitigation |
|---|---|
| Import-path rewrite misses a file, breaks build | Rely on `CI=true pnpm build` (fails loudly on unresolved modules) after every phase, not just at the end |
| Booking page scope creep (it's a real feature build, not a re-skin) | Time-box it separately from the rest of stage B; if the real submit-booking API isn't confirmed, ship the seat-selection UI with a stubbed/disabled submit and flag it explicitly rather than guessing an endpoint |
| antd `ConfigProvider` token names don't map 1:1 to every component's default styling | Verify visually (or via the built CSS) after B.0 before proceeding — don't assume token propagation, check it |
| Removing `sass`/`formik`/`yup` breaks something not caught by the 7 existing tests (coverage is real but narrow — only 2 sagas + 1 util fn are tested) | Manual smoke-test checklist per page before merging stage B (see below), since automated coverage doesn't reach the UI layer at all today |

## Manual smoke-test checklist (run after each stage, before merging)
- [ ] Home loads: banner autoplays, film list scrolls, cinema tabs switch and show showtimes
- [ ] Detail page loads for a real `maPhim`, trailer opens, showtimes tabs work, clicking a showtime navigates to `/booking/:maLichChieu`
- [ ] Booking page loads for a real `maLichChieu`, seat grid renders, selecting seats updates the summary/total
- [ ] Login: validation errors show, successful login updates Header (name + logout button)
- [ ] Register: validation errors show, successful register redirects/behaves as today
- [ ] Mobile viewport (< 640px): Header drawer opens/closes, all pages remain usable without horizontal scroll
- [ ] 404 route still renders `ErrorTemplate`

## Suggested ownership if split across multiple execution agents
- **Agent 1**: Stage A only (structural move). Must finish and pass its verification gate before Stage B starts — Stage B agents should assume the target structure in A.0 already exists.
- **Agent 2**: Stage B.0–B.1 (tokens + SCSS retirement) — foundational, blocks B.2.
- **Agent 3**: Stage B.2 pages 1–4 (shell, Home, Auth, Detail) — mechanical re-skin, no new logic.
- **Agent 4** (most senior/careful): Stage B.2 page 5 (Booking) — the only workstream involving new Redux state and unverified API shape; keep isolated from the others since it's the highest-uncertainty piece.
