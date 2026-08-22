// EN: Public barrel export for the film-detail feature — re-exports the page component so other
// features/routes can import it from "features/film-detail" without reaching into internal paths.
// VI: Điểm export công khai (barrel) cho tính năng film-detail — export lại component trang để các
// tính năng/route khác có thể import từ "features/film-detail" mà không cần biết đường dẫn nội bộ.
export { default as Detail } from "./pages/Detail";
