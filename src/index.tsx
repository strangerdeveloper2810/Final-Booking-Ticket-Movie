// EN: Application entry point — the outermost composition root. Mounts the
// React tree once into `#root` and wraps it with every app-wide provider,
// from outside in: a top-level `ErrorBoundary` (catches crashes even before
// Redux/Router exist), the Redux `Provider` (makes `store` — saga slices +
// both RTK Query APIs — available everywhere), and `BrowserRouter` (enables
// `App.tsx`/`app/routes.tsx` to use React Router). Non-component code that
// needs to navigate (sagas, the axios interceptor) does NOT use a separate
// `history` package instance — react-router-dom v7's internal `History`
// type is no longer compatible with that package, and `BrowserRouter` owns
// its own private history anyway, so such code goes through the
// `navigateTo()` helper in `shared/utils/navigation.ts` instead, which is
// registered from inside this same router tree (see `app/routes.tsx`).
// Global stylesheets for third-party UI libraries (antd, react-toastify,
// slick-carousel) are imported here once so every feature can rely on them
// being loaded.
// VI: Điểm khởi đầu của ứng dụng — composition root ngoài cùng. Mount cây
// React một lần vào `#root` và bọc nó bằng mọi provider cấp ứng dụng, từ
// ngoài vào trong: `ErrorBoundary` cấp cao nhất (bắt lỗi crash kể cả trước
// khi Redux/Router tồn tại), `Provider` của Redux (giúp `store` — các slice
// saga + cả hai API RTK Query — khả dụng ở mọi nơi), và `BrowserRouter`
// (cho phép `App.tsx`/`app/routes.tsx` dùng React Router). Code không phải
// component cần điều hướng (saga, interceptor axios) KHÔNG dùng một instance
// package `history` riêng — kiểu `History` nội bộ của react-router-dom v7
// không còn tương thích với package đó nữa, hơn nữa `BrowserRouter` vốn tự
// giữ riêng history của chính nó — nên các đoạn code đó đi qua helper
// `navigateTo()` trong `shared/utils/navigation.ts`, được đăng ký từ chính
// bên trong cây router này (xem `app/routes.tsx`). Các stylesheet toàn cục
// của thư viện UI bên thứ ba (antd, react-toastify, slick-carousel) được
// import một lần ở đây để mọi feature đều có thể dùng được.
import "@ant-design/v5-patch-for-react-19";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from "app/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// EN: Sends Core Web Vitals metrics (CLS/FID/LCP/etc.) to the callback
// passed in — currently a no-op unless a reporting function is provided,
// see `reportWebVitals.ts`.
// VI: Gửi các chỉ số Core Web Vitals (CLS/FID/LCP/v.v.) tới callback được
// truyền vào — hiện không làm gì nếu không truyền hàm báo cáo, xem
// `reportWebVitals.ts`.
reportWebVitals();
