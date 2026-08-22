import { createApi } from "@reduxjs/toolkit/query/react";
import { http, DOMAIN, GROUP_ID } from "shared/utils/setting";

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: DOMAIN }) =>
  async ({ url, method, data, params, headers }: { url: string; method?: string; data?: any; params?: any; headers?: any }) => {
    try {
      const result = await http({
        url: baseUrl + url,
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
  tagTypes: ["Banners", "Films", "FilmDetail", "Cinemas", "Showtimes"],
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetBannersQuery,
  useGetFilmListQuery,
  useGetFilmDetailQuery,
  useGetCinemasQuery,
  useGetTicketBookingDetailQuery,
} = movieApi;
