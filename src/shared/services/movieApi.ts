import { createApi } from "@reduxjs/toolkit/query/react";
import { http, GROUP_ID } from "shared/utils/setting";

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
  }),
});

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
} = movieApi;
