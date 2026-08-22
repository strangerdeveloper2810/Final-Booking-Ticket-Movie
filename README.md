# 🎬 Cinefix — Premier Online Movie Ticket Booking Platform

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![Webpack 5](https://img.shields.io/badge/Webpack-5.90.2-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.1.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.14.0-0170FE?logo=antdesign)](https://ant.design/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**Tiếng Việt Document (README.vi.md)**](./README.vi.md) | [**Technical Architecture Docs**](./docs/architecture/)

Cinefix is a modern, high-performance Web application for movie exploration, cinema showtime tracking, seat selection, and online movie ticket booking. Built with React 19, Redux Toolkit, Redux Saga, RTK Query, and TMDB integration.

---

## 🌟 Key Features

- **🎬 Full-Screen Edge-to-Edge Auth UI:** Split-screen authentication with cinematic backdrops and modern responsive form validation.
- **⚡ Ultra-Fast Build Speed:** Optimized Webpack 5 filesystem caching and multi-threaded minification (build compilation in **1.1 seconds**).
- **🤖 React Compiler (Auto-Memoization):** Built with `babel-plugin-react-compiler` for automatic memoization without manual `useCallback`, `useMemo`, or `React.memo`.
- **🌐 Multilingual Support (EN / VI):** Full i18n localization for UI labels, date formatting (`dayjs`), and TMDB API queries.
- **🔎 Comprehensive SEO & SSG Pre-rendering:** Multi-language OpenGraph tags, JSON-LD Schema (`Movie`, `MovieTheater`), `hreflang` alternate links, and build-time SSG static pre-rendering.
- **🍿 TMDB Integration:** Multi-collection movie sliders for Trending, Popular, Top Rated, and Upcoming movies with interactive preview modals.
- **🚀 Vercel SPA Production Ready:** Pre-configured `vercel.json` SPA client-side routing rewrites and static asset caching.

---

## 🛠️ Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
PORT=3000

# Cybersoft API Configuration
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_CYBER_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# TMDB (The Movie Database) API Configuration
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

> ⚠️ **Security Note:** Never commit actual API keys or Bearer tokens to public version control. Always retrieve keys from environment variables.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

### 3. Run Unit Tests
```bash
pnpm test
```

### 4. Build for Production (with SSG Pre-rendering)
```bash
pnpm build
```

### 5. Analyze Bundle Size
```bash
pnpm analyze
```

---

## 📚 Technical Architecture Documentation

Detailed engineering documentation, theoretical background, full code examples, and rationale behind our architectural decisions are available in the [`docs/architecture/`](./docs/architecture/) directory:

- 📖 [**01. React 19 & React Compiler Auto-Memoization**](./docs/architecture/01-react-compiler-auto-memoization.md)
- 📖 [**02. Webpack 5 Build Performance & Vendor Splitting**](./docs/architecture/02-webpack5-build-optimization.md)
- 📖 [**03. Static Site Generation (SSG) & Multilingual SEO**](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- 📖 [**04. Redux Saga & RTK Query Dual State Architecture**](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- 📖 [**05. Vercel SPA Deployment & Header Caching**](./docs/architecture/05-vercel-spa-deployment.md)

---

## 📝 License

This project is open-source under the MIT License.