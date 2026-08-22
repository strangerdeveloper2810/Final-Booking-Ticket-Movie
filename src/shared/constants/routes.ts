export const PATHS = {
  HOME: "/",
  HOME_ALIAS: "/home",
  DETAIL: "/detail/:id",
  BOOKING: "/booking/:maLichChieu",
  LOGIN: "/login",
  REGISTER: "/register",
  NOT_FOUND: "*",
} as const;

export const APP_ROUTES = {
  HOME: PATHS.HOME,
  HOME_ALIAS: PATHS.HOME_ALIAS,
  LOGIN: PATHS.LOGIN,
  REGISTER: PATHS.REGISTER,
  NOT_FOUND: PATHS.NOT_FOUND,
  DETAIL: (id: string | number) => `/detail/${id}`,
  BOOKING: (maLichChieu: string | number) => `/booking/${maLichChieu}`,
} as const;
