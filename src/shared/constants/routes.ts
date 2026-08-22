/**
 * EN: Raw react-router path patterns (with `:param` placeholders). This is
 * the single source of truth consumed by `app/routes.tsx` when building the
 * route table, so a path never has to be retyped/duplicated across files.
 * VI: Các mẫu đường dẫn thô của react-router (có placeholder `:param`). Đây
 * là nguồn dữ liệu duy nhất được `app/routes.tsx` dùng để dựng bảng route,
 * nhờ đó không phải gõ lại/trùng lặp đường dẫn ở nhiều file.
 */
export const PATHS = {
  HOME: "/",
  HOME_ALIAS: "/home",
  DETAIL: "/detail/:id",
  BOOKING: "/booking/:maLichChieu",
  LOGIN: "/login",
  REGISTER: "/register",
  NOT_FOUND: "*",
} as const;

/**
 * EN: Navigation helpers used by UI code (links, `navigate()` calls) to build
 * concrete URLs. Static routes just re-export the pattern from `PATHS`;
 * `DETAIL`/`BOOKING` are functions that interpolate the real id so callers
 * never hand-build a template string themselves.
 * VI: Các hàm tiện ích điều hướng dùng trong UI (link, gọi `navigate()`) để
 * dựng URL cụ thể. Route tĩnh chỉ export lại mẫu từ `PATHS`; `DETAIL`/`BOOKING`
 * là hàm nội suy id thực tế để nơi gọi không phải tự ghép chuỗi template.
 * @param id - EN: film id used to build the detail page URL. VI: mã phim dùng để dựng URL trang chi tiết.
 * @param maLichChieu - EN: showtime id used to build the booking page URL. VI: mã lịch chiếu dùng để dựng URL trang đặt vé.
 */
export const APP_ROUTES = {
  HOME: PATHS.HOME,
  HOME_ALIAS: PATHS.HOME_ALIAS,
  LOGIN: PATHS.LOGIN,
  REGISTER: PATHS.REGISTER,
  NOT_FOUND: PATHS.NOT_FOUND,
  DETAIL: (id: string | number) => `/detail/${id}`,
  BOOKING: (maLichChieu: string | number) => `/booking/${maLichChieu}`,
} as const;
