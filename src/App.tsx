import { type FC, type JSX } from "react";
import { App as AntdApp } from "antd";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./app/routes";
import { CustomThemeProvider } from "shared/theme/ThemeContext";
import ErrorBoundary from "shared/components/ErrorBoundary";
import "shared/i18n";

/**
 * EN: Top-level application shell. Sets up the provider stack every screen
 * needs — Helmet (document head/meta), the custom dark/light theme, antd's
 * app-level context, and a route-level error boundary — before rendering
 * `AppRoutes`. This file (plus `index.tsx`) is a composition root: it's
 * expected to import from `app/` and `shared/` broadly, unlike feature code.
 * VI: Khung ứng dụng cấp cao nhất. Thiết lập chồng provider mà mọi màn hình
 * cần — Helmet (thẻ head/meta của trang), theme sáng/tối tùy chỉnh, context
 * cấp ứng dụng của antd, và error boundary cấp route — trước khi render
 * `AppRoutes`. File này (cùng `index.tsx`) là composition root: được phép
 * import rộng rãi từ `app/` và `shared/`, khác với code feature.
 * @returns EN: the fully-wrapped application tree. VI: cây ứng dụng đã được bọc đầy đủ.
 */
const App: FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <CustomThemeProvider>
        {/*
          antd's <App> component must sit inside ConfigProvider (which
          CustomThemeProvider renders) — it's what lets Modal.useModal() /
          message.useMessage() / notification.useNotification() actually
          consume the dynamic dark/light theme algorithm and tokens. The
          static Modal.confirm()/message.success() functions do NOT read
          this context at all (a documented antd v5 limitation), so any
          screen that needs a confirm/warning dialog must pull it from
          App.useApp() instead — see BookingTicket.tsx for the pattern.
        */}
        <AntdApp>
          {/*
            EN: Mounts react-toastify's rendering portal once, app-wide.
            Without this, every `toast.success()`/`toast.error()` call in
            the sagas (auth, booking, ...) silently no-ops — there was
            nothing in the tree to actually render the toast into, which is
            exactly why login/register previously showed no feedback at all.
            VI: Mount cổng (portal) render của react-toastify một lần duy
            nhất cho toàn ứng dụng. Nếu thiếu dòng này, mọi lệnh gọi
            `toast.success()`/`toast.error()` trong các saga (auth, booking,
            ...) sẽ âm thầm không làm gì cả — vì không có gì trong cây
            component để thực sự render toast vào, đây chính xác là lý do
            trước đây đăng nhập/đăng ký không hiển thị phản hồi nào.
          */}
          <ToastContainer position="top-right" autoClose={4000} theme="colored" />
          {/* Route-level boundary: isolate page crashes from theme/helmet context */}
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AntdApp>
      </CustomThemeProvider>
    </HelmetProvider>
  );
};

export default App;
