# 00. Architecture Overview & Map

This is the entry point into Cinefix's technical documentation. Read this first — it tells you what the app actually is today, where every other doc fits, and gives you the honest, verified state of the codebase (including the parts that are unfinished or inconsistent). Every claim in this document set was verified by reading the real source files on `maintain`, not inferred from intent — where the implementation diverged from what was originally planned, that's called out explicitly rather than smoothed over. This is training material, not marketing copy.

## What this app is

Cinefix is a client-side-rendered (CSR) React 19 single-page application for browsing movies, checking cinema showtimes, and booking seats, built against two real backends:

- **Cybersoft** (`movienew.cybersoft.edu.vn`) — a Vietnamese-language training API providing films, cinemas, showtimes, seat maps, and a full auth (login/register) flow. This is the app's actual product domain.
- **TMDB** (The Movie Database) — a public third-party REST API bolted on for a richer "trending / popular / top rated / upcoming" movie browsing experience on the homepage.

It is **not** server-rendered and **not** a real SSG framework output (see [03](./03-ssg-prerendering-multilingual-seo.md) for exactly what it is instead: a homemade build-time HTML snapshot on one route). It deploys as a static bundle to Vercel, with Firebase Hosting configured as a legacy/alternate target (see [05](./05-vercel-spa-deployment.md)).

## Doc map

| Doc | Covers | Read this if you want to know... |
|---|---|---|
| [01. React Compiler](./01-react-compiler-auto-memoization.md) | `babel-plugin-react-compiler`, why there's no `useMemo`/`useCallback` anywhere | ...why components look "naive" but are supposedly fast anyway |
| [02. Webpack 5 Build](./02-webpack5-build-optimization.md) | The ejected, hand-rolled webpack config; CSS/Babel/TS pipeline; env vars; bundle analysis | ...why this isn't CRA anymore, and exactly how a `.tsx` file becomes a browser-loadable chunk |
| [03. SSG/SEO/i18n](./03-ssg-prerendering-multilingual-seo.md) | `scripts/prerender.js`, `SEO.tsx`, hreflang, i18next | ...what "SSG" really means here (spoiler: less than the name implies) and its real SEO limitations |
| [04. State management](./04-redux-saga-rtk-query-state-management.md) | Redux Saga vs RTK Query, the real (not idealized) dividing line, dead code | ...why there are three different ways to fetch the same data in this codebase |
| [05. Vercel deployment](./05-vercel-spa-deployment.md) | `vercel.json`, SPA rewrites, env var checklist | ...how to actually deploy this and not get a 404 on refresh |
| [06. Feature architecture & barrels](./06-feature-based-architecture-and-index-barrels.md) | `src/features/*` vs `src/shared/` vs `src/app/`, and **why almost every folder has an `index.ts`** | ...the folder structure rationale, and the honest truth about how much of the `index.ts` convention is actually load-bearing |
| [07. Design tokens & theming](./07-design-tokens-and-theming.md) | `tokens.ts`, `ThemeContext.tsx`, antd `ConfigProvider`, Tailwind CSS variables | ...how dark/light theming works, and why the "one token source" plan didn't fully survive implementation |
| [08. Forms](./08-forms-react-hook-form-zod.md) | `react-hook-form` + `zod`, the `Controller` pattern | ...how form validation works now, and why it looks different from the classic `formik` shape |
| [09. Error boundaries](./09-error-boundary-and-resilience.md) | `ErrorBoundary`, the two-layer strategy | ...what happens when a component throws, and why there are two boundaries not one |
| [10. TypeScript & CI gaps](./10-typescript-safety-and-cicd-gaps.md) | Babel-strips-types vs real type-checking, no CI | ...a real, honest gap: type errors do not block your build or your deploy today |

## The stack, accurately

| Layer | Technology | Notes |
|---|---|---|
| UI framework | React 19 | With `babel-plugin-react-compiler` (beta) for auto-memoization — see [01](./01-react-compiler-auto-memoization.md) |
| Routing | `react-router-dom` v7 (`useRoutes` object API) | Route-level code splitting via `React.lazy` |
| State (business logic + side effects) | Redux Toolkit 2 + `redux-saga` | Auth, booking (seat select + submit) — see [04](./04-redux-saga-rtk-query-state-management.md) |
| State (server-cache reads) | RTK Query | `movieApi` (Cybersoft reads) + `tmdbApi` (TMDB reads) |
| Forms | `react-hook-form` + `zod` | See [08](./08-forms-react-hook-form-zod.md) |
| UI components | Ant Design 5 | Theming via `ConfigProvider` — see [07](./07-design-tokens-and-theming.md) |
| Styling | Tailwind CSS 3 + a handful of CSS custom properties | `darkMode: "class"` |
| i18n | `i18next` + `react-i18next` + `i18next-browser-languagedetector` | EN/VI, 7 namespaces each — see [03](./03-ssg-prerendering-multilingual-seo.md) |
| Build | Hand-rolled Webpack 5 (`webpack.config.js` + `config/webpack.{common,dev,prod}.js`) | Ejected from CRA/craco — see [02](./02-webpack5-build-optimization.md) |
| Type checking | TypeScript 5, but **only via a manual `pnpm typecheck` script** | Not wired into `build` or any CI — see [10](./10-typescript-safety-and-cicd-gaps.md) |
| Testing | Jest + `ts-jest` | 3 suites, 7 tests total (saga generator tests + one util test) — real but narrow coverage |
| Deployment | Vercel (static) | Firebase Hosting config also present, legacy — see [05](./05-vercel-spa-deployment.md) |

## Where this app sits on the rendering spectrum (the short version)

If you take nothing else from this doc set, take this: **this is a CSR (client-side rendered) app**, full stop. There is no server that renders per-request (no SSR), and there is no real per-route static generation (no true SSG). What it *does* have is a single, homemade Node script (`scripts/prerender.js`) that runs once after `webpack build` and string-injects a hand-built HTML snapshot of "now showing" movies into the **home route only**, purely so a JS-less crawler has something to read. Every other route (`/detail/:id`, `/booking/:id`, `/login`, ...) serves that exact same home-page snapshot to a non-JS crawler, because Vercel's SPA rewrite (`vercel.json`) sends every path to the same `index.html`. [Doc 03](./03-ssg-prerendering-multilingual-seo.md) walks through this in full, including why it's a genuinely useful teaching example of *why* real frameworks (Next.js, Remix, Astro) build hydration and per-route generation as first-class primitives instead of leaving teams to reinvent a fragile 10% of it by hand.

## Honest known-issue list (as of this doc's writing)

Two real bugs were found and fixed as part of this documentation pass (both already merged to `maintain`):
- `webpack-merge` was missing from `package.json`, so **every** webpack-driven script (`dev`, `start`, `build`, `build:dev`, `analyze`) — and therefore every Vercel deploy — failed immediately. Fixed by adding the dependency.
- Production builds were shipping an unminified `index.html` (a regression from splitting the webpack config into common/dev/prod modules). Fixed by moving `HtmlWebpackPlugin` into mode-specific configs with a real `minify` block in production.

Everything below is **not** a build-breaking bug — it's real, current architectural debt worth knowing about rather than a reason to panic:
- Several Redux Saga slices (`Banner`, `FlimList`, `ListCinema`, `Loading`) are registered in the store and their watchers are forked in `rootSaga`, but nothing dispatches or reads them anymore — the home page's actual data now comes from RTK Query's `movieApi` instead. See [04](./04-redux-saga-rtk-query-state-management.md).
- Of 11 `index.ts` barrel files under `src/`, only 1 (`ErrorBoundary`) is ever actually imported through its folder path — the rest are bypassed by every real consumer. See [06](./06-feature-based-architecture-and-index-barrels.md).
- Design tokens are defined in three places (`shared/theme/tokens.ts`, `src/index.css` CSS variables, and hardcoded hex in `tailwind.config.js`) instead of one, contrary to the original design plan. See [07](./07-design-tokens-and-theming.md).
- The SEO `hreflang`/`canonical` setup has a real technical inconsistency (canonical doesn't vary by language while hreflang alternates claim it does) and language differentiation relies on a `?lng=` query param that most crawlers will collapse away. See [03](./03-ssg-prerendering-multilingual-seo.md).
- `tsc --noEmit` is not part of `build` or any CI pipeline (there is no CI pipeline at all — no `.github/workflows`). See [10](./10-typescript-safety-and-cicd-gaps.md).

None of this is presented to embarrass anyone — it's exactly the kind of mid-migration, partially-applied-convention state every real, actively-developed codebase ends up in, and it's much more useful as training material to see it named precisely than to pretend the architecture is cleaner than it is.
