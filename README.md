# 🎬 Cinefix — Modern Movie Ticket Booking Platform

[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange?logo=pnpm)](https://pnpm.io/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![SignalR Realtime](https://img.shields.io/badge/SignalR-Realtime-512BD4?logo=dotnet)](https://dotnet.microsoft.com/en-us/apps/aspnet/signalr)
[![Webpack 5](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design 5](https://img.shields.io/badge/Ant_Design-5-0170FE?logo=antdesign)](https://ant.design/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**Tiếng Việt (README.vi.md)**](./README.vi.md) · [**Technical Architecture Docs**](./docs/architecture/00-overview.md)

Cinefix is an enterprise-grade React 19 monorepo application for browsing movies, checking cinema showtimes, real-time seat holding via SignalR, and booking tickets — powered by a Vietnamese cinema backend (Cybersoft) alongside TMDB integration for global movie discovery.

---

## 🚀 Key Features

- **Physical Monorepo Architecture (`packages/*`)** — modularized into 6 decoupled pnpm workspace packages (`@cinefix/types`, `@cinefix/utils`, `@cinefix/locales`, `@cinefix/api-client`, `@cinefix/realtime`, `@cinefix/ui`).
- **Realtime WebSocket Seat Booking (`@cinefix/realtime`)** — live seat locking and automatic seat map updates across concurrent users via SignalR (`DatVeHub`).
- **Movie Discovery & TMDB Integration** — rich homepage featuring current cinema showtimes combined with TMDB trending, top-rated, and upcoming movies.
- **Interactive Seat Selection & Booking** — visual seat map (available, selected, reserved, VIP), live price calculation, and real-time seat holding.
- **Full EN/VI Internationalization (`@cinefix/locales`)** — self-contained multi-language i18n resources, localized date formatting, and language-aware API queries.
- **Dark/Light Theme System (`@cinefix/ui`)** — seamless toggle driving both Tailwind CSS utilities and Ant Design 5 tokens with a first-paint flash guard.
- **Core Web Vitals Monitoring (`web-vitals` v3)** — built-in tracking for LCP, INP, CLS, FCP, and TTFB performance metrics.
- **Build-time SSG Pre-rendering & SEO** — Open Graph / Twitter / JSON-LD metadata snapshots generated during Webpack production build.
- **React Compiler Auto-memoization** — zero manual `useMemo`/`useCallback` boilerplate; memoized at build-time via Babel plugin.

---

## 🏗️ Monorepo Package Structure

The codebase is organized into standalone workspace packages under `packages/`:

| Package | Path | Description |
| :--- | :--- | :--- |
| **`@cinefix/types`** | `packages/types` | Standardized TypeScript interfaces (`FilmDetail`, `BookingTicketType`, `SeatType`, etc.) |
| **`@cinefix/utils`** | `packages/utils` | Axios HTTP client, app constants, route definitions, and navigation helpers |
| **`@cinefix/locales`** | `packages/locales` | Self-contained Vietnamese & English i18n translation resources |
| **`@cinefix/api-client`** | `packages/api-client` | RTK Query API slices (`movieApi` for Cybersoft & `tmdbApi` for TMDB) |
| **`@cinefix/realtime`** | `packages/realtime` | SignalR WebSocket client service for real-time seat room state |
| **`@cinefix/ui`** | `packages/ui` | Design system UI components, templates (`HomeTemplate`, `AdminTemplate`), and theme tokens |

---

## 🛠️ Environment Setup

Copy `.env.example` to `.env` and configure your API tokens:

```env
PORT=3000

# Cybersoft Cinema API (movies, cinemas, showtimes, auth, booking)
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# TMDB API (global movie discovery)
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

---

## 💻 Available Scripts

```bash
pnpm install             # Install dependencies and link pnpm workspace packages
pnpm dev                 # Start Webpack dev server (http://localhost:3000 with HMR)
pnpm typecheck           # Run TypeScript check across main app & all @cinefix/* packages
pnpm packages:typecheck  # Run TypeScript check specifically across packages/
pnpm test                # Run Jest test suite (100% passing across 8 suites / 23 unit tests)
pnpm build               # Production build + SSG static pre-rendering (scripts/prerender.js)
pnpm analyze             # Production build with Webpack Bundle Analyzer report
pnpm preview             # Preview production build locally (npx serve build)
```

---

## 📚 Technical Documentation

Comprehensive engineering documentation is available in [`docs/architecture/`](./docs/architecture/):

- [00. Overview & Doc Map](./docs/architecture/00-overview.md)
- [01. React 19 & React Compiler](./docs/architecture/01-react-compiler-auto-memoization.md)
- [02. Webpack 5 Build System](./docs/architecture/02-webpack5-build-optimization.md)
- [03. SSG Pre-rendering, SEO & i18n](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- [04. Redux Toolkit, Redux-Saga & RTK Query](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- [05. Vercel SPA Deployment](./docs/architecture/05-vercel-spa-deployment.md)
- [06. Monorepo & Feature Architecture](./docs/architecture/06-feature-based-architecture-and-index-barrels.md)
- [07. Styling, Tailwind CSS & Antd Tokens](./docs/architecture/07-styling-tailwindcss-and-design-tokens.md)
- [08. Forms & Validation (`react-hook-form` + `zod`)](./docs/architecture/08-forms-react-hook-form-zod.md)
- [09. Error Boundaries & Crash Resilience](./docs/architecture/09-error-boundary-and-resilience.md)
- [10. Type Safety & CI/CD](./docs/architecture/10-typescript-safety-and-cicd-gaps.md)

---

## 📄 License

MIT.
