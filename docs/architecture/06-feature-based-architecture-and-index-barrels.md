# 06. Feature-Based Architecture & the `index.ts` Barrel Convention

This is the doc for the question "why does almost every folder have an `index.ts`?" — answered honestly, with the real usage numbers, not the idealized textbook answer. Read this alongside actually browsing `src/` in an editor; the folder tree below is exactly what's on disk today.

## The folder tree

```
src/
├── app/                    — composition root (see below)
│   ├── routes.tsx
│   ├── store.ts
│   └── rootSaga.ts
├── features/               — one folder per business capability, self-contained
│   ├── home/
│   │   ├── index.ts          (public-API barrel — exports the Home page)
│   │   ├── pages/Home.tsx
│   │   ├── components/       (flat .tsx files: CarouselHome, Film, FilmItem, ListCinema, ListMovie, TMDBMovieSection — NOT folder+index.ts)
│   │   ├── redux/{banner,cinema,filmList}/  (per-slice: constants, reducer, saga, types)
│   │   └── types/home.types.ts
│   ├── film-detail/
│   │   ├── index.ts
│   │   ├── pages/Detail.tsx
│   │   ├── redux/types/{CalendarFilmType,FilmDetail}.ts
│   │   └── services/{FlimDetailService,ManagementMovieService}.ts
│   ├── booking/
│   │   ├── index.ts
│   │   ├── pages/BookingTicket.tsx
│   │   ├── redux/{Booking.saga,BookingTicket.reducer,BookingTicketActionTypes,BookingTicketConstants,BookingTicketType}.ts
│   │   └── services/BookingTicketService.ts
│   └── auth/
│       ├── index.ts
│       ├── pages/{Login,Register}.tsx
│       ├── components/{AuthLayout,AuthShowcase}.tsx  (flat files)
│       ├── redux/{UserConstants,UserSaga.reducer,UserSaga,UserType}.ts, UserSaga.test.ts
│       ├── schemas/auth.schema.ts
│       ├── services/Auth.services.ts
│       └── types/auth.types.ts
└── shared/                 — cross-feature building blocks, no feature-specific logic
    ├── components/          (mostly folder + Component.tsx + index.ts, see below)
    ├── constants/, i18n/, locales/, redux/loading/, services/, templates/, theme/, types/, utils/
```

## The composition root pattern (`src/app/`)

`app/` is the one place in the codebase allowed to know about *every* feature simultaneously, and to reach past each feature's public barrel into its internals (`store.ts` and `rootSaga.ts` both import each feature's concrete redux files directly, not through `features/x/index.ts`, because those barrels only export pages, not redux internals). `features/*` never imports from another `features/*` folder — verified by exhaustive grep, there are **zero** cross-feature imports anywhere in the app. `home` doesn't know `auth` exists; `booking` doesn't know `film-detail` exists.

What would break if, say, `routes.tsx` moved inside `features/home/`: it needs to import all five pages (Home, Detail, BookingTicket, Login, Register) to build one shared route table. Moving it into `home` would force `home` to import from `auth`, `booking`, and `film-detail` — turning one peer feature into a de facto orchestrator every other feature is implicitly coupled to, and breaking the "any feature can be deleted without touching another feature's code" property that currently holds.

## `shared/` vs `features/`: the rule, tested against real files

**The rule that holds up well**: something belongs in `shared/` if it's genuinely used by more than one feature (or by `app/`), or if it's feature-agnostic infrastructure (i18n bootstrapping, theming, the redux store itself). This is true for the shared UI components (`Header`, `Footer`, `LoadingNew`, the `Skeleton*` components, `Star`) — all are consumed from at least one feature or from `app/`.

**Where the rule gets fuzzier, with real evidence:**
- `shared/redux/loading/Loading.reducer.ts` (a single `isLoading` boolean) is only ever *written to* by two sagas inside `features/home/` — and never *read* by any `useSelector` anywhere in the app. It's registered in the store and dispatched to, but nothing displays it. It lives in `shared/` on the assumption that a global loading flag *could* be used by multiple features, not because it demonstrably is today — write-only dead state, filed by intent rather than actual usage.
- `shared/types/IRoutes.ts` (an `IRoute` interface) is never imported anywhere except its own declaration — `app/routes.tsx` actually types its route table with react-router's own `RouteObject` instead. This looks like an early-draft type that was superseded and never deleted.
- `shared/types/ITemplate.ts` has exactly one consumer (`shared/templates/HomeTemplate.tsx`) — not really "shared" by the multi-consumer test, but filed in `shared/types/` because the team's practical convention is "typed interfaces live in `shared/types/`," a rule based on *file kind* more than *actual sharing need*.
- `ErrorBoundary` lives in `shared/components/` but both of its real usages (`App.tsx`, `index.tsx`) are in composition-root files, not inside any feature — no feature currently wraps its own sub-tree in it. See [doc 09](./09-error-boundary-and-resilience.md) for the full picture.

**Honest summary**: the `shared`/`features` split is real and well-applied for *code* that's demonstrably reused, but for *types* and for a few composition-root-adjacent pieces, the actual organizing principle is closer to "this kind of file always goes here" than "this specific file is proven to need sharing" — and at least one file (`IRoutes.ts`) is outright dead, and one slice (`Loading.reducer.ts`) is write-only dead state. Naming this precisely is more useful for training purposes than presenting the split as perfectly principled.

## Now, the `index.ts` question

There are **13** `index.ts`/`index.tsx` files under `src/` (excluding the app entry point `src/index.tsx` itself). Here's what each one actually does, and — critically — **who actually imports through it** versus who bypasses it and reaches for the concrete file directly.

### Feature-level "public API" barrels — 4 files, 0 real consumers

```typescript
// src/features/auth/index.ts — representative example
export { default as Login } from "./pages/Login";
export { default as Register } from "./pages/Register";
export { default as AuthLayout } from "./components/AuthLayout";
```
Every one of `features/{home,film-detail,booking,auth}/index.ts` follows this shape: re-export the feature's page component(s) (and, for `auth`, one shared component). **Grepped exhaustively for `from "features/x"` (and the single-quote variant) across all of `src/`: zero matches, for all four.** Every real consumer reaches directly for the concrete file instead:
```typescript
// src/app/routes.tsx — actual usage
const Login = lazy(() => import("features/auth/pages/Login"));
```
This isn't carelessness — it's mechanically necessary. `React.lazy(() => import(...))` needs a dynamic import whose specifier resolves to exactly the module you want in its own chunk. If `routes.tsx` imported `{ Login, Register }` from the `features/auth` barrel instead, it would pull `Login.tsx`, `Register.tsx`, *and* `AuthLayout.tsx` into one shared module graph node — defeating per-route code splitting entirely. This is a live, concrete example of the classic "barrel files can hurt code-splitting" caveat, not a hypothetical.

### Component-level barrels — 7 files, 1 actually used

| Folder | Barrel used? |
|---|---|
| `shared/components/ErrorBoundary/` | **Yes** — both consumers (`App.tsx`, `index.tsx`) import `from "shared/components/ErrorBoundary"` |
| `shared/components/Footer/` | No — consumer imports `from "shared/components/Footer/Footer"` directly |
| `shared/components/Header/` | No — same pattern |
| `shared/components/LoadingNew/` | No — all 3 consumers import the concrete file |
| `shared/components/SkeletonCard/` | No |
| `shared/components/SkeletonCarousel/` | No |
| `shared/components/Star/` | No |

**1 out of 11 total re-export barrels (4 feature-level + 7 component-level) is ever actually imported through its folder path.** Every real import statement in this codebase, with one exception, spells out the concrete file.

### Why `ErrorBoundary` is the one that works — proof from git history

This isn't a guess — the repo's own commit history shows it happening:
- One commit created `shared/components/ErrorBoundary/index.tsx` (the component itself, 198 lines, implemented directly inside a file literally named `index.tsx`).
- The very next commit renamed it: `index.tsx` → `ErrorBoundary.tsx`, and added a one-line `index.ts`: `export { default } from "./ErrorBoundary";`.

Both of `ErrorBoundary`'s consumers (`App.tsx`, `index.tsx`) needed **zero changes** across that rename, because they'd always imported the folder (`shared/components/ErrorBoundary`), not a specific filename inside it. That's the barrel pattern's real, demonstrated payoff, captured in this exact repo's history — and it's also almost certainly *why* the same `folder/Component.tsx + index.ts` shape got mechanically copied onto every other `shared/components/*` folder afterward, whether or not those folders had ever been renamed or needed the insulation.

### The honest verdict

The *idea* behind these barrels is sound — it maps onto a genuinely-respected module boundary (zero cross-feature imports were found; nothing outside `app/` reaches into a feature's redux internals). But the *execution* is almost entirely ceremonial: 10 of 11 barrels have never been imported by anyone, ever, and the two clearest reasons they're bypassed are mechanical, not stylistic (lazy-loading needs a concrete leaf module; the composition root needs internals no barrel exposes). The lesson for future work in this codebase: **a barrel file is aspirational infrastructure that only pays for itself once something actually imports through it.** Adding one "because that's the pattern here" without an actual multi-file-internals-to-hide situation is pure ceremony. Two folders break even the shared-components half of the convention outright — `shared/components/Logo/Logo.tsx` and `shared/components/SEO/SEO.tsx` are flat files with no `index.ts` at all, and nothing seems to have broken because of it.

### A real, latent risk worth naming

`package.json` has no `"sideEffects"` field. This means webpack's production build cannot safely assume any of this project's own modules — including a barrel that does `export { default as Home } from "./pages/Home"` — are side-effect-free at the package-boundary level, which matters for aggressive tree-shaking. Today this costs nothing in practice, precisely because the barrels are never imported (dead code that's never reached from an entry point is never bundled, full stop) — but if someone starts using the feature barrels as originally intended without adding a `sideEffects` declaration, there's a real, unmeasured bundle-size question waiting.

## How the absolute imports (`"features/home/..."`, `"shared/components/Header"`) actually resolve

Two independent, uncoordinated mechanisms happen to agree, which is worth understanding precisely rather than assuming there's a shared alias config:

- **TypeScript side**: `tsconfig.json` sets `baseUrl: "src"` and has **no `paths` map at all**. Under plain `moduleResolution: "node"` + `baseUrl`, TypeScript tries `<baseUrl>/<specifier>` for any non-relative import — that's the entire mechanism `tsc --noEmit` uses to accept `features/home/pages/Home`.
- **Webpack side**: there is **no `tsconfig-paths-webpack-plugin`** (confirmed absent from `package.json` and `node_modules`). Instead, `config/webpack.common.js` does:
  ```javascript
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    alias: { src: path.resolve(__dirname, "../src") },
  },
  ```
  `resolve.modules` tells webpack to treat `src/` as **another root to search bare specifiers in, exactly like `node_modules`.** When webpack sees `import Home from "features/home/pages/Home"`, it tries `node_modules/features/...` (fails), then falls back to `src/features/...` (succeeds) — because `src` was prepended to the search-root list. This is coarser than a real path-alias plugin: it adds one extra search root rather than mapping named aliases.

**These two mechanisms agree only because `baseUrl: "src"` and `resolve.modules: [".../src", ...]` happen to point at the same physical folder** — there's no shared source of truth enforcing that. If someone later added a `paths` entry to `tsconfig.json` (e.g. `"@features/*": ["features/*"]`) without a matching webpack change, TypeScript would accept it fine while webpack would fail to bundle it. Worth knowing if you ever wonder why an import "type-checks but won't build," or vice versa.

## Component-folder conventions, precisely

The `folder + Component.tsx + index.ts` shape is **not applied universally** — only to most of `shared/components/*`. Every component and page *inside* a feature (`features/*/components/*.tsx`, `features/*/pages/*.tsx`) is a flat file with no folder and no barrel — none of them have their own `index.ts`. So the practical rule, as actually followed: *reusable, standalone `shared/` UI atoms get a folder + barrel; feature-internal components and pages, however numerous, stay flat.* `Logo` and `SEO` are unexplained exceptions to even that half of the rule.
