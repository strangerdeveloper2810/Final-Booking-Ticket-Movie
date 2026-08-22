# 🎬 Cinefix — Nền Tảng Đặt Vé Xem Phim Trực Tuyến

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Webpack 5](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design 5](https://img.shields.io/badge/Ant_Design-5-0170FE?logo=antdesign)](https://ant.design/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[**English (README.md)**](./README.md) · [**Tài Liệu Kiến Trúc Kỹ Thuật**](./docs/architecture/00-overview.md)

Cinefix là ứng dụng React render phía client (CSR) dùng để khám phá phim, tra cứu lịch chiếu tại các cụm rạp, chọn ghế trực quan và đặt vé — xây dựng trên API training tiếng Việt (Cybersoft) kết hợp tích hợp TMDB thật để mở rộng trải nghiệm khám phá phim.

---

## Tính năng

- **Khám phá phim** — trang chủ kết hợp danh mục rạp chiếu cốt lõi (phim đang chiếu, lịch chiếu theo hệ thống rạp) với khu vực duyệt phim từ TMDB (Thịnh hành / Phổ biến / Đánh giá cao / Sắp chiếu).
- **Trang chi tiết phim** — poster, phát trailer, lịch chiếu theo hệ thống rạp và cụm rạp.
- **Luồng đặt vé chọn ghế thật** — lưới ghế tương tác (trạng thái trống / đang chọn / đã đặt / VIP), tính tổng tiền trực tiếp, và luồng gửi đặt vé hoàn chỉnh có tự động làm mới sơ đồ ghế sau khi đặt thành công.
- **Xác thực (Auth)** — đăng nhập/đăng ký với validate bằng `react-hook-form` + `zod`, lưu phiên đăng nhập qua cookie.
- **Đa ngôn ngữ Anh/Việt đầy đủ** — toàn bộ chuỗi UI, định dạng ngày tháng, và truy vấn TMDB đều theo ngôn ngữ đang chọn.
- **Theme sáng/tối** — một công tắc duy nhất điều khiển cả class Tailwind lẫn theme của Ant Design thông qua một bộ token dùng chung, có cơ chế chặn hiện tượng "nhấp nháy sai theme" ở lần render đầu tiên.
- **SEO metadata + "ảnh chụp SEO" dựng sẵn lúc build** — thẻ Open Graph/Twitter/JSON-LD theo từng trang, cộng với bước pre-render HTML tĩnh (chỉ áp dụng cho trang chủ) để crawler đọc được nội dung. **Đây không phải SSR/SSG đầy đủ** — xem [tổng quan kiến trúc](./docs/architecture/00-overview.md#where-this-app-sits-on-the-rendering-spectrum-the-short-version) để hiểu chính xác cơ chế này là gì và giới hạn thật của nó.
- **React Compiler tự động memoization** — không có `useMemo`/`useCallback`/`React.memo` ở bất kỳ đâu trong codebase; một Babel plugin lo việc memoization ngay lúc build.

## Công nghệ sử dụng

React 19 · TypeScript 5 · React Router 7 · Redux Toolkit 2 + Redux-Saga + RTK Query · Ant Design 5 · Tailwind CSS 3 · `react-hook-form` + `zod` · `i18next` · Webpack 5 cấu hình thủ công (đã eject khỏi CRA/craco) · Jest + `ts-jest`.

## Cấu hình môi trường

Copy `.env.example` thành `.env` rồi điền giá trị thật:

```env
PORT=3000

# Cybersoft API (dữ liệu cốt lõi — phim, rạp, lịch chiếu, auth, đặt vé)
REACT_APP_DOMAIN=https://movienew.cybersoft.edu.vn/api
REACT_APP_TOKEN_CYBERSOFT=YOUR_CYBERSOFT_TOKEN_HERE
REACT_APP_GROUP_ID=GP01

# TMDB API (khu vực khám phá phim ở trang chủ)
REACT_APP_TMDB_DOMAIN=https://api.themoviedb.org/3
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
REACT_APP_TMDB_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN_HERE
```

> ⚠️ Không bao giờ commit token thật. `.env` đã được `.gitignore`; `.env.example` là file mẫu được commit sẵn. Xem [doc 02](./docs/architecture/02-webpack5-build-optimization.md#environment-variables-no-automatic-react_app-scanning) để biết chính xác các biến này đi vào bundle client bằng cách nào (không tự động — mỗi biến đều được khai báo tay trong config webpack).

## Bắt đầu

```bash
pnpm install       # cài dependencies
pnpm dev           # chạy dev server (http://localhost:3000, hot reload)
pnpm typecheck     # chạy type-check TypeScript — KHÔNG tự động chạy trong build, xem doc 10
pnpm test          # chạy bộ test Jest
pnpm build         # build production (webpack) + bước pre-render SEO (scripts/prerender.js)
pnpm analyze       # build production kèm báo cáo dung lượng bundle tương tác
pnpm preview       # serve thử output đã build (npx serve build)
```

## Tài liệu

Tài liệu kỹ thuật đầy đủ — mô tả kiến trúc thật, đã verify (bao gồm cả giới hạn/khiếm khuyết thật, không phải mô tả quảng cáo) — nằm tại [`docs/architecture/`](./docs/architecture/):

- [00. Tổng quan & bản đồ tài liệu](./docs/architecture/00-overview.md) — **đọc file này trước**
- [01. React 19 & React Compiler](./docs/architecture/01-react-compiler-auto-memoization.md)
- [02. Hệ thống build Webpack 5](./docs/architecture/02-webpack5-build-optimization.md)
- [03. SSG pre-rendering, SEO & i18n](./docs/architecture/03-ssg-prerendering-multilingual-seo.md)
- [04. Redux Toolkit, Redux-Saga & RTK Query](./docs/architecture/04-redux-saga-rtk-query-state-management.md)
- [05. Deploy lên Vercel](./docs/architecture/05-vercel-spa-deployment.md)
- [06. Kiến trúc feature-based & quy ước barrel `index.ts`](./docs/architecture/06-feature-based-architecture-and-index-barrels.md)
- [07. Tailwind CSS, design token & theming antd](./docs/architecture/07-styling-tailwindcss-and-design-tokens.md)
- [08. Forms: `react-hook-form` + `zod`](./docs/architecture/08-forms-react-hook-form-zod.md)
- [09. Error boundary & khả năng chịu lỗi](./docs/architecture/09-error-boundary-and-resilience.md)
- [10. Khoảng trống TypeScript & CI/CD](./docs/architecture/10-typescript-safety-and-cicd-gaps.md)

## Giấy phép

MIT.
