import type { NavigateFunction } from "react-router-dom";

/**
 * EN: Holds the app's single live `navigate` function once the router has
 * mounted, so code outside React components (redux-saga generators, the
 * axios response interceptor) can still trigger a real React Router
 * navigation instead of a raw `window.location`/browser history change.
 *
 * This replaces an earlier approach that created a standalone `history`
 * package instance and tried to wire it into React Router — that silently
 * did NOT work with react-router-dom v7 (its internal `History` type is no
 * longer compatible with the external `history` package, and plain
 * `BrowserRouter` owns its own private history anyway), which is exactly
 * why login/register/401-redirects previously appeared to do nothing:
 * `history.push(...)` was changing a history object React Router never
 * looked at.
 * VI: Giữ hàm `navigate` đang hoạt động duy nhất của ứng dụng sau khi router
 * đã mount, để code nằm ngoài component React (generator của redux-saga,
 * interceptor response của axios) vẫn có thể kích hoạt điều hướng React
 * Router thật sự thay vì chỉ đổi `window.location`/lịch sử trình duyệt một
 * cách thô.
 *
 * Cách này thay thế cho cách làm trước đó — tạo một instance package
 * `history` riêng rồi cố nối nó vào React Router — nhưng cách đó ÂM THẦM
 * không hoạt động với react-router-dom v7 (kiểu `History` nội bộ của nó
 * không còn tương thích với package `history` bên ngoài, hơn nữa
 * `BrowserRouter` thường vốn tự giữ riêng một history của chính nó) — đây
 * chính xác là lý do trước đây đăng nhập/đăng ký/chuyển hướng khi lỗi 401
 * nhìn như không có tác dụng gì: `history.push(...)` đã đổi một object
 * history mà React Router chưa từng theo dõi.
 */
let navigateRef: NavigateFunction | null = null;

/**
 * EN: Registers the live `navigate` function. Called exactly once, from a
 * `useEffect` inside `app/routes.tsx`'s `AppRoutes` (a descendant of the
 * router) — never called directly by feature code.
 * VI: Đăng ký hàm `navigate` đang hoạt động. Chỉ được gọi đúng một lần, từ
 * `useEffect` bên trong `AppRoutes` của `app/routes.tsx` (hậu duệ của
 * router) — không bao giờ được gọi trực tiếp bởi code của feature.
 * @param navigate - EN: the `useNavigate()` result to store. VI: kết quả của `useNavigate()` cần lưu lại.
 */
export function setNavigate(navigate: NavigateFunction): void {
  navigateRef = navigate;
}

/**
 * EN: Navigates to `path` using React Router, from anywhere — including
 * code outside the component tree, like sagas (`UserSaga.ts`,
 * `UserSaga.reducer.ts`) or the axios response interceptor
 * (`setting.ts`'s 401/403 handling). Logs a warning and no-ops if called
 * before the router has mounted, which shouldn't normally happen since the
 * whole app renders synchronously on load.
 * VI: Điều hướng tới `path` bằng React Router, từ bất kỳ đâu — kể cả code
 * nằm ngoài cây component như saga (`UserSaga.ts`, `UserSaga.reducer.ts`)
 * hay interceptor response của axios (xử lý 401/403 trong `setting.ts`).
 * Ghi cảnh báo và không làm gì nếu được gọi trước khi router mount xong —
 * điều này thường không xảy ra vì toàn bộ app render đồng bộ khi tải trang.
 * @param path - EN: the route path to navigate to. VI: đường dẫn route cần điều hướng tới.
 */
export function navigateTo(path: string): void {
  if (!navigateRef) {
    console.warn(`navigateTo("${path}") called before the router mounted — ignoring.`);
    return;
  }
  navigateRef(path);
}
