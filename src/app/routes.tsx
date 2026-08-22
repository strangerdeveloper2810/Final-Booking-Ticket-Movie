import { type FC, lazy, Suspense, useEffect } from "react";
import { useRoutes, useNavigate, RouteObject } from "react-router-dom";
import HomeTemplate from "shared/templates/HomeTemplate";
import ErrorTemplate from "shared/templates/ErrorTemplate";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import { PATHS } from "shared/constants/routes";
import { setNavigate } from "shared/utils/navigation";

// EN: This file is a "composition root": its sole purpose is to wire every
// feature's page component into one route table. That's why it's allowed to
// import from every feature (`features/home`, `features/film-detail`,
// `features/booking`, `features/auth`) in a single place — a privilege
// feature files never get (feature code never imports from another feature,
// or from `app/`, to keep features independently maintainable/removable).
// Pages are lazy-loaded so each feature's bundle is only fetched when its
// route is actually visited (code-splitting).
// VI: File này là một "composition root" (gốc kết hợp): mục đích duy nhất là
// gắn kết component trang của từng feature vào một bảng route. Vì vậy nó
// được phép import từ mọi feature (`features/home`, `features/film-detail`,
// `features/booking`, `features/auth`) tại một nơi duy nhất — một đặc quyền
// mà file feature không bao giờ có (code feature không bao giờ import từ
// feature khác, hay từ `app/`, để mỗi feature luôn độc lập, dễ bảo trì/gỡ
// bỏ). Các trang được lazy-load để bundle của mỗi feature chỉ được tải khi
// route tương ứng thực sự được truy cập (code-splitting).
const Home = lazy(() => import("features/home/pages/Home"));
const Detail = lazy(() => import("features/film-detail/pages/Detail"));
const BookingTicket = lazy(() => import("features/booking/pages/BookingTicket"));
const Login = lazy(() => import("features/auth/pages/Login"));
const Register = lazy(() => import("features/auth/pages/Register"));

/**
 * EN: Declarative route table consumed by `useRoutes()` below. Each entry
 * pairs a path from `shared/constants/routes.ts` with a page wrapped in the
 * shared `HomeTemplate` layout (header/footer chrome shared by every page).
 * This is a fixed literal array (not derived via `.map()` from a smaller
 * config), since each route pairs a distinct lazy-loaded component with its
 * path — there's no repeated shape to factor out without losing clarity.
 * VI: Bảng route khai báo được `useRoutes()` bên dưới sử dụng. Mỗi mục ghép
 * một đường dẫn từ `shared/constants/routes.ts` với một trang được bọc
 * trong layout dùng chung `HomeTemplate` (phần header/footer chung cho mọi
 * trang). Đây là một mảng literal cố định (không dựng bằng `.map()` từ cấu
 * hình nhỏ hơn), vì mỗi route ghép một component lazy-load riêng biệt với
 * đường dẫn của nó — không có khuôn mẫu lặp lại nào đáng để tách ra mà
 * không làm mất đi sự rõ ràng.
 */
export const routesConfig: RouteObject[] = [
  {
    path: PATHS.HOME,
    element: (
      <HomeTemplate>
        <Home />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.HOME_ALIAS,
    element: (
      <HomeTemplate>
        <Home />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.DETAIL,
    element: (
      <HomeTemplate>
        <Detail />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.BOOKING,
    element: (
      <HomeTemplate>
        <BookingTicket />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.LOGIN,
    element: (
      <HomeTemplate>
        <Login />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.REGISTER,
    element: (
      <HomeTemplate>
        <Register />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.NOT_FOUND,
    element: (
      <HomeTemplate>
        <ErrorTemplate />
      </HomeTemplate>
    ),
  },
];

/**
 * EN: Renders the matched route from `routesConfig`. Wrapped in `Suspense`
 * because every page component above is lazy-loaded — `LoadingNew` is shown
 * while a route's JS chunk is still being fetched.
 * VI: Render route khớp với `routesConfig`. Được bọc trong `Suspense` vì mọi
 * component trang ở trên đều lazy-load — `LoadingNew` hiển thị trong lúc
 * chunk JS của route đó vẫn đang được tải.
 * @returns EN: the routed page, wrapped in a Suspense boundary. VI: trang tương ứng với route, được bọc trong Suspense boundary.
 */
const AppRoutes: FC = () => {
  const element = useRoutes(routesConfig);
  const navigate = useNavigate();

  // EN: Registers this router's `navigate` so non-component code (sagas,
  // the axios interceptor) can navigate imperatively too — see
  // shared/utils/navigation.ts for why this replaced an older, silently
  // broken `history` package + BrowserRouter combo.
  // VI: Đăng ký hàm `navigate` của router này để code không phải component
  // (saga, interceptor axios) cũng có thể điều hướng theo cách mệnh lệnh —
  // xem shared/utils/navigation.ts để biết vì sao điều này thay thế cho tổ
  // hợp package `history` + BrowserRouter cũ vốn đã âm thầm bị hỏng.
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Suspense fallback={<LoadingNew />}>{element}</Suspense>;
};

export default AppRoutes;
