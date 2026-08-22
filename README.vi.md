# 🎬 Cinefix — Nền Tảng Đặt Vé Xem Phim Rạp Trực Tuyến Hàng Đầu

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![Webpack 5](https://img.shields.io/badge/Webpack-5.90.2-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.1.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.14.0-0170FE?logo=antdesign)](https://ant.design/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**English Document (README.md)**](./README.md) | [**Tài Liệu Kiến Trúc Kĩ Thuật (Technical Docs)**](./docs/architecture/)

Cinefix là ứng dụng Web hiện đại, hiệu năng cao giúp người dùng khám phá điện ảnh, tra cứu lịch chiếu tại các cụm rạp lớn (CGV, BHD, Galaxy, Lotte Cinema), chọn ghế ngồi trực quan và đặt vé xem phim online. Dự án sử dụng React 19, Redux Toolkit, Redux Saga, RTK Query và tích hợp API TMDB.

---

## 🌟 Các Tính Năng Nổi Bật

- **🎬 Giao diện Auth Tràn Màn Hình:** Giao diện Đăng ký / Đăng nhập full-screen 100% không thừa viền trắng, sử dụng backdrop phim sống động.
- **⚡ Tốc Độ Biên Dịch Webpack Siêu Tốc:** Cấu hình Webpack 5 Filesystem Caching và biên dịch đa luồng Terser (Thời gian build giảm từ **13.6 giây xuống chỉ còn 1.1 giây**).
- **🤖 React Compiler (Tự Động Memoization):** Sử dụng `babel-plugin-react-compiler` giúp tự động memoization các component mà không cần dùng `useCallback`, `useMemo` hay `React.memo` thủ công.
- **🌐 Hỗ Trợ Đa Ngôn Ngữ (Anh / Việt):** Tích hợp i18n toàn diện cho UI, định dạng ngày tháng (`dayjs`) và truy vấn API TMDB theo ngôn ngữ.
- **🔎 SEO Đa Ngôn Ngữ & SSG Pre-rendering:** Tích hợp thẻ OpenGraph, JSON-LD Schema (`Movie`, `MovieTheater`), `hreflang` alternate links và kịch bản SSG tiền biên dịch HTML tại thời điểm build.
- **🍿 Tích Hợp API TMDB:** Render các danh mục phim Phổ biến, Thịnh hành, Đánh giá cao và Sắp chiếu kèm Modal xem thông tin chi tiết.
- **🚀 Chuẩn Bị Sẵn Cho Deployment Vercel:** Cấu hình file `vercel.json` xử lý điều hướng SPA Client-Side Routing và caching static assets.

---

## 🛠️ Cấu Hình Biến Môi Trường (`.env`)

Tạo file `.env` tại thư mục gốc của dự án:

```env
PORT=3000

# Cấu Hình API Cybersoft
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# Cấu Hình API TMDB (The Movie Database)
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

> ⚠️ **Lưu ý Bảo Mật:** Không bao giờ push trực tiếp các token bí mật lên GitHub công khai. Luôn sử dụng biến môi trường `.env`.

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

### 1. Cài Đặt Dependencies
```bash
pnpm install
```

### 2. Chạy Môi Trường Development
```bash
pnpm dev
```

### 3. Chạy Unit Test
```bash
pnpm test
```

### 4. Build Production (Kèm SSG Static Pre-rendering)
```bash
pnpm build
```

### 5. Phân Tích Dung Lượng Bundle
```bash
pnpm analyze
```

---

## 📚 Tài Liệu Kĩ Thuật & Kiến Trúc Dự Án

Toàn bộ lý thuyết, bài giải thích chuyên sâu, mã nguồn mẫu (full code) và lý do áp dụng các công nghệ trong dự án được ghi chép đầy đủ tại thư mục [`docs/architecture/`](./docs/architecture/):

- 📖 [**01. React 19 & React Compiler Auto-Memoization**](./docs/architecture/01-react-compiler-auto-memoization.md)
- 📖 [**02. Webpack 5 Build Performance & Tách Vendor Chunk**](./docs/architecture/02-webpack5-build-optimization.md)
- 📖 [**03. Static Site Generation (SSG) & SEO Đa Ngôn Ngữ**](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- 📖 [**04. Kiến Trúc Song Song Redux Saga & RTK Query**](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- 📖 [**05. Vercel SPA Deployment & Header Caching**](./docs/architecture/05-vercel-spa-deployment.md)

---

## 📝 Giấy Phép (License)

Dự án được phát hành dưới mã nguồn mở MIT License.
