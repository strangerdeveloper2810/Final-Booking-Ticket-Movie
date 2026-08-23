import { createApi } from "@reduxjs/toolkit/query/react";
import { http, GROUP_ID } from "shared/utils/setting";

/**
 * EN: Adapts the shared axios instance (`http`, which already carries the
 * Cybersoft auth interceptor from `setting.ts`) into RTK Query's
 * `BaseQueryFn` shape, so `createApi` below can use axios instead of the
 * default `fetch`-based `fetchBaseQuery`. Every request/response still goes
 * through the same interceptors as the legacy Redux-Saga services.
 * VI: Chuyển đổi instance axios dùng chung (`http`, vốn đã có interceptor
 * xác thực Cybersoft từ `setting.ts`) sang đúng khuôn dạng `BaseQueryFn` của
 * RTK Query, để `createApi` bên dưới dùng axios thay vì `fetchBaseQuery`
 * mặc định dựa trên `fetch`. Mọi request/response vẫn đi qua cùng các
 * interceptor như các service Redux-Saga cũ.
 * @returns EN: a `BaseQueryFn` compatible query function for `createApi`. VI: một hàm query tương thích `BaseQueryFn` cho `createApi`.
 */
const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
    headers,
  }: {
    url: string;
    method?: string;
    data?: any;
    params?: any;
    headers?: any;
  }) => {
    try {
      const result = await http({
        url,
        method: method || "GET",
        data,
        params,
        headers,
      });
      // EN: The Cybersoft API always wraps the real payload in a
      // `{ content, message, ... }` envelope — unwrap it here once so every
      // endpoint below gets the plain data, matching its declared type.
      // VI: API Cybersoft luôn bọc dữ liệu thật trong khung `{ content,
      // message, ... }` — bóc tách một lần ở đây để mỗi endpoint bên dưới
      // nhận được dữ liệu thuần, khớp với kiểu đã khai báo.
      return { data: result.data.content };
    } catch (axiosError: any) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

/**
 * EN: RTK Query API slice for the Cybersoft movie-booking backend (movies,
 * banners, cinemas, showtimes, user management). Note: this coexists with
 * an older Redux-Saga-driven fetch path (`features/home/redux/**Saga*`) that
 * targets some of the *same* Cybersoft endpoints (banners/films/cinemas) —
 * see `app/store.ts` for why those saga slices are effectively legacy/dead
 * code today, with this RTK Query API being the actively consumed path.
 * VI: API slice của RTK Query cho backend đặt vé phim Cybersoft (phim,
 * banner, rạp, lịch chiếu, quản lý người dùng). Lưu ý: file này tồn tại
 * song song với luồng fetch cũ dùng Redux-Saga (`features/home/redux/**Saga*`)
 * vốn cũng gọi tới CÙNG một số endpoint Cybersoft (banner/phim/rạp) — xem
 * `app/store.ts` để biết vì sao các slice saga đó hiện là code cũ/không còn
 * dùng, trong khi API RTK Query này mới là luồng đang được sử dụng thực sự.
 */
export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Banners", "Films", "FilmDetail", "Cinemas", "Showtimes", "UserProfile", "UserList", "UserTypes"],
  endpoints: (builder) => ({
    // Movies & Banners
    getBanners: builder.query<any[], void>({
      query: () => ({
        url: "/QuanLyPhim/LayDanhSachBanner",
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
    getFilmList: builder.query<any[], string | void>({
      query: (maNhom = GROUP_ID) => ({
        url: "/QuanLyPhim/LayDanhSachPhim",
        method: "GET",
        params: { maNhom },
      }),
      providesTags: ["Films"],
    }),
    getFilmDetail: builder.query<any, string>({
      query: (maPhim: string) => ({
        url: "/QuanLyPhim/LayThongTinPhim",
        method: "GET",
        params: { maPhim },
      }),
      providesTags: (_result, _error, id) => [{ type: "FilmDetail" as const, id }],
    }),
    getCinemas: builder.query<any[], string | void>({
      query: (maNhom = GROUP_ID) => ({
        url: "/QuanLyRap/LayThongTinLichChieuHeThongRap",
        method: "GET",
        params: { maNhom },
      }),
      providesTags: ["Cinemas"],
    }),
    getTicketBookingDetail: builder.query<any, string>({
      query: (maLichChieu: string) => ({
        url: "/QuanLyDatVe/LayDanhSachPhongVe",
        method: "GET",
        params: { MaLichChieu: maLichChieu },
      }),
      providesTags: (_result, _error, id) => [{ type: "Showtimes" as const, id }],
    }),

    // QuanLyNguoiDung User APIs (Swagger)
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/QuanLyNguoiDung/ThongTinTaiKhoan",
        method: "POST",
      }),
      providesTags: ["UserProfile"],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (userPayload) => ({
        url: "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        method: "PUT",
        data: userPayload,
      }),
      invalidatesTags: ["UserProfile", "UserList"],
    }),
    getUserTypes: builder.query<any[], void>({
      query: () => ({
        url: "/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung",
        method: "GET",
      }),
      providesTags: ["UserTypes"],
    }),
    getUserList: builder.query<any[], { maNhom?: string; tuKhoa?: string } | void>({
      query: (params) => ({
        url: "/QuanLyNguoiDung/LayDanhSachNguoiDung",
        method: "GET",
        params: { maNhom: params?.maNhom || GROUP_ID, tuKhoa: params?.tuKhoa },
      }),
      providesTags: ["UserList"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (taiKhoan: string) => ({
        url: "/QuanLyNguoiDung/XoaNguoiDung",
        method: "DELETE",
        params: { TaiKhoan: taiKhoan },
      }),
      invalidatesTags: ["UserList"],
    }),
    addUser: builder.mutation<any, any>({
      query: (userPayload) => ({
        url: "/QuanLyNguoiDung/ThemNguoiDung",
        method: "POST",
        data: userPayload,
      }),
      invalidatesTags: ["UserList"],
    }),

    // Admin Film Management APIs
    addFilmUpload: builder.mutation<any, FormData>({
      query: (formData: FormData) => ({
        url: "/QuanLyPhim/ThemPhimUploadHinh",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Films"],
    }),
    updateFilmUpload: builder.mutation<any, FormData>({
      query: (formData: FormData) => ({
        url: "/QuanLyPhim/CapNhatPhimUpload",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Films", "FilmDetail"],
    }),
    deleteFilm: builder.mutation<any, number | string>({
      query: (maPhim: number | string) => ({
        url: "/QuanLyPhim/XoaPhim",
        method: "DELETE",
        params: { MaPhim: maPhim },
      }),
      invalidatesTags: ["Films"],
    }),

    // Admin Showtime Creation APIs
    createShowtime: builder.mutation<any, { maPhim: number; ngayChieuGioChieu: string; maRap: string; giaVe: number }>({
      query: (payload) => ({
        url: "/QuanLyDatVe/TaoLichChieu",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Cinemas", "Showtimes"],
    }),
    getCinemaSystems: builder.query<any[], void>({
      query: () => ({
        url: "/QuanLyRap/LayThongTinHeThongRap",
        method: "GET",
      }),
    }),
    getCinemaClusters: builder.query<any[], string>({
      query: (maHeThongRap: string) => ({
        url: "/QuanLyRap/LayThongTinCumRapTheoHeThong",
        method: "GET",
        params: { maHeThongRap },
      }),
    }),
  }),
});

/**
 * EN: Auto-generated React hooks (one per endpoint above) — this is the
 * actual public surface most components import from this file.
 * VI: Các hook React được RTK Query tự sinh (mỗi endpoint ở trên một hook)
 * — đây mới là phần công khai mà hầu hết component import từ file này.
 */
export const {
  useGetBannersQuery,
  useGetFilmListQuery,
  useGetFilmDetailQuery,
  useGetCinemasQuery,
  useGetTicketBookingDetailQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserTypesQuery,
  useGetUserListQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useAddFilmUploadMutation,
  useUpdateFilmUploadMutation,
  useDeleteFilmMutation,
  useCreateShowtimeMutation,
  useGetCinemaSystemsQuery,
  useGetCinemaClustersQuery,
} = movieApi;

