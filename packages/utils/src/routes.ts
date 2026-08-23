export const PATHS = {
  HOME: "/",
  HOME_ALIAS: "/home",
  DETAIL: "/detail/:id",
  BOOKING: "/booking/:maLichChieu",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  ADMIN: "/admin",
  ADMIN_FILMS: "/admin/films",
  ADMIN_USERS: "/admin/users",
  ADMIN_SHOWTIMES: "/admin/showtimes",
  NOT_FOUND: "*",
} as const;

export const APP_ROUTES = {
  HOME: PATHS.HOME,
  HOME_ALIAS: PATHS.HOME_ALIAS,
  LOGIN: PATHS.LOGIN,
  REGISTER: PATHS.REGISTER,
  PROFILE: PATHS.PROFILE,
  ADMIN: PATHS.ADMIN,
  ADMIN_FILMS: PATHS.ADMIN_FILMS,
  ADMIN_USERS: PATHS.ADMIN_USERS,
  ADMIN_SHOWTIMES: PATHS.ADMIN_SHOWTIMES,
  NOT_FOUND: PATHS.NOT_FOUND,
  DETAIL: (id: string | number) => `/detail/${id}`,
  BOOKING: (maLichChieu: string | number) => `/booking/${maLichChieu}`,
} as const;
