# 🎬 Cinefix — Modern Movie Ticket Booking Application

[![React Version](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Webpack](https://img.shields.io/badge/Webpack-v5-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, responsive web application for booking movie theater tickets built with **React 19**, **React Compiler**, **TypeScript**, **Redux Toolkit 2 (RTK Query + Redux Saga)**, **TMDB API**, **Webpack 5**, **Ant Design v5**, and **TailwindCSS**.

---

## ✨ Features & Architecture Highlights

- ⚡ **React Compiler & Webpack 5:** Powered by **React 19 Compiler (`babel-plugin-react-compiler`)** for automatic compile-time memoization, zero manual `memo`/`useCallback`/`useMemo` boilerplates, Webpack 5 split chunk optimization, and interactive bundle analysis (`pnpm run analyze`).
- 🎬 **TMDB & Movie API Integration:** Dynamically fetches live trending Vietnamese & international movies, posters, and cinematic backdrops directly from **TMDB (The Movie Database)** and Cybersoft Movie API.
- 🎨 **Dynamic Dark & Light Theme Engine:** Native theme switching powered by CSS custom properties and Ant Design `ConfigProvider` (`darkAlgorithm` vs `defaultAlgorithm`).
- 🌐 **Full i18n Multilingual Support:** Domain-split JSON translation files (`common`, `header`, `home`, `booking`, `auth`, `detail`, `footer`) supporting **Vietnamese 🇻🇳** and **English 🇬🇧**.
- 🚀 **Redux Toolkit Query (RTK Query) + Redux Saga:** Declarative data fetching, background caching, and tag invalidation via RTK Query (`movieApi` + `tmdbApi`) alongside Redux Saga for complex authentication & booking side-effects.
- 🛡️ **Cookie-Based Auth & Axios Interceptors:** Persistent authentication using HTTP cookies only (no `localStorage`) with automatic HTTP 401/403 token expiration handling.
- 📝 **React Hook Form + Zod Validation:** High-performance form handling with type-safe Zod validation schemas.
- 🔍 **SEO & OpenGraph Optimization:** Dynamic title tags, OpenGraph meta properties, canonical URLs, and structured `Movie` JSON-LD schema using `react-helmet-async`.
- 🎟️ **Interactive Seat Selection & Booking Room:** Curved screen visualizer, seat status indicators (VIP, Standard, Selected, Occupied), and real-time total price calculations.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, React Compiler (`babel-plugin-react-compiler`), TypeScript 5.9 |
| **Routing** | React Router DOM v7 (`useRoutes` hook architecture) |
| **State Management** | Redux Toolkit 2, RTK Query (`movieApi` & `tmdbApi`), Redux Saga |
| **External APIs** | TMDB API (`api.themoviedb.org/3`), Cybersoft Movie API |
| **Styling & UI** | TailwindCSS v3, Ant Design v5, `@ant-design/icons` |
| **Form Management** | React Hook Form, `@hookform/resolvers`, Zod |
| **Build & Bundling** | Webpack 5, Babel (`babel-loader`), `WebpackBundleAnalyzer`, `MiniCssExtractPlugin` |
| **Internationalization** | `i18next`, `react-i18next`, `i18next-browser-languagedetector` |

---

## 📁 Folder Structure

```
src/
├── app/                  # Application routing (useRoutes) & Redux store setup
├── features/             # Feature-based domain modules
│   ├── auth/             # Login, Register, Auth Showcase & Split Layout
│   ├── booking/          # Seat map grid, booking summary panel & Sagas
│   ├── film-detail/      # Movie showtimes tabs & trailer modals
│   └── home/             # Hero banner carousel, now showing slider, cinema clusters
└── shared/               # Shared cross-cutting components & utilities
    ├── components/       # Header, Footer, Logo, SEO, Loading, Skeletons
    ├── constants/        # Routes, HTTP Status, Storage Keys, Languages
    ├── i18n/             # i18next initialization
    ├── locales/          # Domain-split translation JSON files (vi / en)
    ├── services/         # RTK Query movieApi & tmdbApi slices
    ├── theme/            # Theme context & design tokens
    └── utils/            # Cookie helpers, Day.js formatters, Axios instance
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0`
- **pnpm** `>= 8.0.0` (or `npm` / `yarn`)

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1OCIsIkhldEhhblN0cmluZyI6IjExLzA2LzIwMzAiLCJIZXRIYW5UaW1lIjoiMTkwNzQ1Mjc5OSIsIm5iZiI6MTkwNzQ1Mjc5OSwiZXhwIjoxOTA3NDUyNzk5fQ.631rl3EwTQfz6CuufNTJlys36XLVmoxo29kP-F_PDKU
REACT_APP_GROUP_ID=GP01

# TMDB (The Movie Database) API Configuration
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=626eb9e5f6865b22f6c5e5c9ce5a220f
REACT_APP_TMDB_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjNlYjllNWYyODY1YjJjZjNWU1YzVjZlVbM2l5ZjZiMTYzNTc3NzlyOC4xMjk5OTk5LCJzdWIiOiI2MTdmZmFjM2YzYnNDAWOTM4ZWY5ZjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7BgVAZAH7zatioQHeG81Pey2tVrflVUZBEoqc___dpo
```

### Installation

```bash
# Clone the repository
git clone https://github.com/strangerdeveloper2810/Final-Booking-Ticket-Movie.git

# Navigate into directory
cd Final-Booking-Ticket-Movie

# Install dependencies
pnpm install
```

### Available Package Scripts

```bash
# Start local development server (Webpack Dev Server)
pnpm dev

# Typecheck TypeScript files
pnpm run typecheck

# Run unit tests with Jest
pnpm test

# Build production bundle with Webpack 5 & React Compiler
pnpm run build

# Analyze production bundle size with Webpack Bundle Analyzer
pnpm run analyze

# Preview production build locally
pnpm run preview
```

---

## 👥 Authors & Collaborators

- **Nguyen Hai Trinh (Strangerdeveloper)** — Lead Developer & Maintainer
- **Dieu Linh (nguyendieulinh1117)** — Collaborator
- **Ha Mi (gerichilli)** — Collaborator

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).