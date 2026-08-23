# 🎬 Cinefix — Nền Tảng Đặt Vé Xem Phim Trực Tuyến Hiện Đại

[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange?logo=pnpm)](https://pnpm.io/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![SignalR Realtime](https://img.shields.io/badge/SignalR-Realtime-512BD4?logo=dotnet)](https://dotnet.microsoft.com/en-us/apps/aspnet/signalr)
[![Webpack 5](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design 5](https://img.shields.io/badge/Ant_Design-5-0170FE?logo=antdesign)](https://ant.design/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**English (README.md)**](./README.md) · [**Tài Liệu Kiến Trúc Kỹ Thuật**](./docs/architecture/00-overview.md)

Cinefix là ứng dụng React 19 chuẩn Enterprise Monorepo dùng để khám phá phim, tra cứu lịch chiếu rạp, giữ ghế theo thời gian thực (Realtime SignalR) và đặt vé xem phim — tích hợp hệ thống API rạp phim Cybersoft cùng kết nối TMDB toàn cầu.

---

## 🚀 Các Tính Năng Nổi Bật

- **Kiến Trúc Physical Monorepo (`packages/*`)** — được tách thành 6 workspace packages độc lập (`@cinefix/types`, `@cinefix/utils`, `@cinefix/locales`, `@cinefix/api-client`, `@cinefix/realtime`, `@cinefix/ui`).
- **Đặt Ghế Realtime Qua WebSockets (`@cinefix/realtime`)** — giữ ghế thời gian thực và đồng bộ sơ đồ ghế giữa nhiều trình duyệt/người dùng đồng thời bằng SignalR (`DatVeHub`).
- **Khám Phá Phim Đa Dạng & Tích Hợp TMDB** — trang chủ kết hợp phim đang chiếu tại các cụm rạp với khu vực phim Thịnh hành / Đánh giá cao / Sắp chiếu từ TMDB.
- **Sơ Đồ Ghế & Luồng Đặt Vé Trực Quan** — chọn ghế tương tác (ghế trống, đang chọn, đã đặt, ghế VIP), tính tổng tiền trực tiếp và đồng bộ trạng thái đặt vé.
- **Đa Ngôn Ngữ Anh/Việt Đầy Đủ (`@cinefix/locales`)** — bộ tài nguyên i18n tự chứa, định dạng ngày tháng localized và tự động điều chỉnh ngôn ngữ truy vấn API.
- **Theme Sáng/Tối Linh Hoạt (`@cinefix/ui`)** — công tắc chuyển đổi giao diện điều khiển cả Tailwind CSS và Ant Design 5 token, có sẵn guard chống nhấp nháy theme (flash guard).
- **Đo Lường Hiệu Năng Core Web Vitals (`web-vitals` v3)** — tích hợp sẵn bộ đo lường chỉ số LCP, INP, CLS, FCP, TTFB chuẩn Google.
- **SSG Pre-rendering & SEO** — tự động tạo ảnh chụp tĩnh HTML cho các thẻ Open Graph / Twitter / JSON-LD ở bước Webpack Production Build.
- **React Compiler Tự Động Memoization** — không cần viết `useMemo`/`useCallback` thủ công; Babel plugin tự động tối ưu memoization khi build.

---

## 🏗️ Cấu Trúc Monorepo Packages

Mã nguồn được tổ chức thành các workspace packages độc lập nằm trong `packages/`:

| Package | Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| **`@cinefix/types`** | `packages/types` | Chuẩn hóa interfaces & domain types (`FilmDetail`, `BookingTicketType`, `SeatType`, ...) |
| **`@cinefix/utils`** | `packages/utils` | Axios HTTP client, hằng số ứng dụng, định nghĩa routes và helpers chuyển trang |
| **`@cinefix/locales`** | `packages/locales` | Tài nguyên dịch thuật đa ngôn ngữ Tiếng Việt & Tiếng Anh |
| **`@cinefix/api-client`** | `packages/api-client` | RTK Query API slices (`movieApi` Cybersoft & `tmdbApi` TMDB) |
| **`@cinefix/realtime`** | `packages/realtime` | SignalR WebSocket client service xử lý giữ ghế & đồng bộ realtime |
| **`@cinefix/ui`** | `packages/ui` | Design system UI components, templates (`HomeTemplate`, `AdminTemplate`) và design tokens |

---

## 🛠️ Cấu Hình Môi Trường

Copy `.env.example` thành `.env` và điền token API:

```env
PORT=3000

# Cybersoft API (dữ liệu rạp, lịch chiếu, auth, đặt vé)
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# TMDB API (khám phá phim toàn cầu)
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

---

## 💻 Các Lệnh Lập Trình (Scripts)

```bash
pnpm install             # Cài đặt dependencies & liên kết symlinks các workspace packages
pnpm dev                 # Chạy Webpack dev server (http://localhost:3000 kèm HMR)
pnpm typecheck           # Kiểm tra lỗi TypeScript toàn bộ App & tất cả packages @cinefix/*
pnpm packages:typecheck  # Kiểm tra lỗi TypeScript riêng cho thư mục packages/
pnpm test                # Chạy bộ test Jest (100% PASS 8 suites / 23 unit tests)
pnpm build               # Build production Webpack + tạo pre-render SSG HTML tĩnh
pnpm analyze             # Build production kèm báo cáo dung lượng bundle tương tác
pnpm preview             # Khởi chạy ứng dụng production ở máy local (npx serve build)
```

---

## 📚 Tài Liệu Kỹ Thuật

Tài liệu chi tiết về kiến trúc hệ thống nằm tại [`docs/architecture/`](./docs/architecture/):

- [00. Tổng quan & Bản đồ tài liệu](./docs/architecture/00-overview.md)
- [01. React 19 & React Compiler](./docs/architecture/01-react-compiler-auto-memoization.md)
- [02. Hệ thống build Webpack 5](./docs/architecture/02-webpack5-build-optimization.md)
- [03. SSG Pre-rendering, SEO & i18n](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- [04. Redux Toolkit, Redux-Saga & RTK Query](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- [05. Deploy lên Vercel](./docs/architecture/05-vercel-spa-deployment.md)
- [06. Kiến trúc Monorepo & Feature-based](./docs/architecture/06-feature-based-architecture-and-index-barrels.md)
- [07. Styling, Tailwind CSS & Antd Tokens](./docs/architecture/07-styling-tailwindcss-and-design-tokens.md)
- [08. Forms & Validation (`react-hook-form` + `zod`)](./docs/architecture/08-forms-react-hook-form-zod.md)
- [09. Error Boundaries & Khả năng chịu lỗi](./docs/architecture/09-error-boundary-and-resilience.md)
- [10. An Toàn Type Safety & CI/CD](./docs/architecture/10-typescript-safety-and-cicd-gaps.md)

---

## 📄 Giấy Phép

MIT.
