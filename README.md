# 🎬 Cinefix — Movie Ticket Booking Platform

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Webpack 5](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design 5](https://img.shields.io/badge/Ant_Design-5-0170FE?logo=antdesign)](https://ant.design/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**Tiếng Việt (README.vi.md)**](./README.vi.md) · [**Technical Architecture Docs**](./docs/architecture/00-overview.md)

Cinefix is a client-side-rendered React application for browsing movies, checking cinema showtimes, selecting seats, and booking tickets — built against a Vietnamese training API (Cybersoft) plus a live TMDB integration for an expanded movie-discovery experience.

---

## Features

- **Movie discovery** — a homepage combining the core cinema catalog (now-showing films, showtimes by cinema chain) with a TMDB-powered "trending / popular / top rated / upcoming" browsing section.
- **Film detail pages** — poster, trailer playback, and showtimes grouped by cinema chain and cluster.
- **Real seat-selection booking flow** — an interactive seat grid (available / selected / occupied / VIP states), a live-computed price summary, and an end-to-end submit-booking flow with post-submit seat-map refresh.
- **Auth** — login/register with `react-hook-form` + `zod` validation, cookie-based session persistence.
- **Full EN/VI internationalization** — UI strings, localized date formatting, and TMDB queries all respect the active language.
- **Dark/light theming** — a single toggle drives both Tailwind's utility classes and Ant Design's component theming via a shared token set, with a flash-of-wrong-theme guard on first paint.
- **SEO metadata + a build-time "SEO snapshot"** — per-page Open Graph/Twitter/JSON-LD tags, plus a homepage-only static HTML pre-render step for crawler visibility. **This is not full SSR/SSG** — see the [architecture overview](./docs/architecture/00-overview.md#where-this-app-sits-on-the-rendering-spectrum-the-short-version) for exactly what it is and its real limitations.
- **React Compiler auto-memoization** — no `useMemo`/`useCallback`/`React.memo` anywhere in the codebase; a Babel plugin handles memoization at build time.

## Tech stack

React 19 · TypeScript 5 · React Router 7 · Redux Toolkit 2 + Redux-Saga + RTK Query · Ant Design 5 · Tailwind CSS 3 · `react-hook-form` + `zod` · `i18next` · hand-rolled Webpack 5 (ejected from CRA/craco) · Jest + `ts-jest`.

## Environment setup

Copy `.env.example` to `.env` and fill in real values:

```env
PORT=3000

# Cybersoft API (core product data — films, cinemas, showtimes, auth, booking)
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# TMDB API (homepage movie-discovery section)
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

> ⚠️ Never commit real tokens. `.env` is git-ignored; `.env.example` is the checked-in placeholder template. See [doc 02](./docs/architecture/02-webpack5-build-optimization.md#environment-variables-no-automatic-react_app-scanning) for exactly how these reach the client bundle (it's not automatic — each one is explicitly wired into the webpack config).

## Getting started

```bash
pnpm install       # install dependencies
pnpm dev           # start the dev server (http://localhost:3000, hot reload)
pnpm typecheck     # run TypeScript's type-checker — NOT run automatically by build, see doc 10
pnpm test          # run the Jest test suite
pnpm build         # production build (webpack) + build-time SEO snapshot (scripts/prerender.js)
pnpm analyze       # production build with an interactive bundle-size report
pnpm preview       # serve the built output locally (npx serve build)
```

## Documentation

Full engineering documentation — the real, verified architecture (including honest known limitations, not a marketing description) — lives in [`docs/architecture/`](./docs/architecture/):

- [00. Overview & doc map](./docs/architecture/00-overview.md) — **start here**
- [01. React 19 & React Compiler](./docs/architecture/01-react-compiler-auto-memoization.md)
- [02. Webpack 5 build system](./docs/architecture/02-webpack5-build-optimization.md)
- [03. SSG pre-rendering, SEO & i18n](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- [04. Redux Toolkit, Redux-Saga & RTK Query](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- [05. Vercel deployment](./docs/architecture/05-vercel-spa-deployment.md)
- [06. Feature-based architecture & the `index.ts` barrel convention](./docs/architecture/06-feature-based-architecture-and-index-barrels.md)
- [07. Tailwind CSS, design tokens & antd theming](./docs/architecture/07-styling-tailwindcss-and-design-tokens.md)
- [08. Forms: `react-hook-form` + `zod`](./docs/architecture/08-forms-react-hook-form-zod.md)
- [09. Error boundaries & crash resilience](./docs/architecture/09-error-boundary-and-resilience.md)
- [10. TypeScript & CI/CD gaps](./docs/architecture/10-typescript-safety-and-cicd-gaps.md)

## License

MIT.
