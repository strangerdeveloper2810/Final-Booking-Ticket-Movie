import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { API_CONFIG } from "shared/constants/appConstants";

/**
 * EN: One movie record as returned by TMDB's API (subset of fields this app
 * actually uses — TMDB's real payload has more).
 * VI: Một bản ghi phim theo định dạng trả về của API TMDB (chỉ gồm các
 * trường ứng dụng này thực sự dùng — payload thật của TMDB có nhiều trường
 * hơn).
 */
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// EN: TMDB_DOMAIN may or may not include a trailing slash depending on how
// the env var was set — normalize once so query strings below can safely
// assume `tmdbBaseUrl` always ends in "/".
// VI: TMDB_DOMAIN có thể có hoặc không có dấu "/" ở cuối tùy cách khai báo
// biến môi trường — chuẩn hóa một lần để các chuỗi query bên dưới luôn có
// thể giả định `tmdbBaseUrl` kết thúc bằng "/".
const tmdbBaseUrl = API_CONFIG.TMDB_DOMAIN.endsWith("/")
  ? API_CONFIG.TMDB_DOMAIN
  : `${API_CONFIG.TMDB_DOMAIN}/`;

/**
 * EN: Maps this app's simple language code ("vi"/"en") to the
 * region-qualified locale TMDB's API expects; anything not Vietnamese falls
 * back to US English.
 * VI: Ánh xạ mã ngôn ngữ đơn giản của ứng dụng ("vi"/"en") sang locale có
 * vùng miền mà API TMDB yêu cầu; bất kỳ ngôn ngữ nào không phải tiếng Việt
 * đều dùng mặc định tiếng Anh (Mỹ).
 * @param lang - EN: app-level language code, e.g. "vi" or "en". VI: mã ngôn ngữ cấp ứng dụng, vd. "vi" hoặc "en".
 * @returns EN: TMDB locale string ("vi-VN" or "en-US"). VI: chuỗi locale của TMDB ("vi-VN" hoặc "en-US").
 */
const getTMDBLanguageCode = (lang?: string) => {
  if (lang === "vi" || lang === "vi-VN") return "vi-VN";
  return "en-US";
};

/**
 * EN: RTK Query API slice for TMDB (The Movie Database) — an independent,
 * public movie catalog used purely to enrich the home page with
 * trending/popular/top-rated/upcoming sections; it is unrelated to the
 * Cybersoft booking backend (`movieApi.ts`) and requires no user auth.
 * Uses `fetchBaseQuery` (plain `fetch`) rather than the axios-based
 * `axiosBaseQuery` from `movieApi.ts`, since TMDB doesn't need the
 * Cybersoft cookie/token interceptor from `setting.ts`.
 * VI: API slice của RTK Query cho TMDB (The Movie Database) — một kho phim
 * công khai, độc lập, chỉ dùng để làm phong phú trang chủ với các mục
 * thịnh hành/phổ biến/đánh giá cao/sắp chiếu; không liên quan tới backend
 * đặt vé Cybersoft (`movieApi.ts`) và không cần xác thực người dùng. Dùng
 * `fetchBaseQuery` (dựa trên `fetch` thuần) thay vì `axiosBaseQuery` dựa
 * trên axios của `movieApi.ts`, vì TMDB không cần interceptor cookie/token
 * Cybersoft từ `setting.ts`.
 */
export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: tmdbBaseUrl,
    prepareHeaders: (headers) => {
      if (API_CONFIG.TMDB_TOKEN) {
        headers.set("Authorization", `Bearer ${API_CONFIG.TMDB_TOKEN}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `trending/movie/day?language=${tmdbLang}${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
      // EN: `results` is only ever missing/undefined on a malformed/empty
      // TMDB response — fall back to `[]` so consumers always get an array.
      // VI: `results` chỉ thiếu/undefined khi response TMDB bị lỗi/rỗng —
      // trả về `[]` mặc định để nơi dùng luôn nhận được một mảng.
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),
    getPopularMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `movie/popular?language=${tmdbLang}&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
      // EN: `results` is only ever missing/undefined on a malformed/empty
      // TMDB response — fall back to `[]` so consumers always get an array.
      // VI: `results` chỉ thiếu/undefined khi response TMDB bị lỗi/rỗng —
      // trả về `[]` mặc định để nơi dùng luôn nhận được một mảng.
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),
    getTopRatedMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `movie/top_rated?language=${tmdbLang}&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
      // EN: `results` is only ever missing/undefined on a malformed/empty
      // TMDB response — fall back to `[]` so consumers always get an array.
      // VI: `results` chỉ thiếu/undefined khi response TMDB bị lỗi/rỗng —
      // trả về `[]` mặc định để nơi dùng luôn nhận được một mảng.
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),
    getUpcomingMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `movie/upcoming?language=${tmdbLang}&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),

    // EN: Additional TMDB endpoints for enriched movie detail features
    // VI: Các endpoint TMDB bổ sung cho các tính năng chi tiết phim phong phú
    getMovieCredits: builder.query<any, number | string>({
      query: (movieId) => ({
        url: `movie/${movieId}/credits`,
        params: API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {},
      }),
    }),
    getMovieVideos: builder.query<any[], number | string>({
      query: (movieId) => ({
        url: `movie/${movieId}/videos`,
        params: API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {},
      }),
      transformResponse: (response: any) => get(response, "results", []),
    }),
    getMovieImages: builder.query<any, number | string>({
      query: (movieId) => ({
        url: `movie/${movieId}/images`,
        params: API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {},
      }),
    }),
    getMovieReviews: builder.query<any[], number | string>({
      query: (movieId) => ({
        url: `movie/${movieId}/reviews`,
        params: API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {},
      }),
      transformResponse: (response: any) => get(response, "results", []),
    }),
    getSimilarMovies: builder.query<TMDBMovie[], number | string>({
      query: (movieId) => ({
        url: `movie/${movieId}/similar`,
        params: API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {},
      }),
      transformResponse: (response: any) => get(response, "results", []),
    }),
    searchTMDBMovies: builder.query<TMDBMovie[], string>({
      query: (query) => ({
        url: `search/movie`,
        params: {
          query,
          ...(API_CONFIG.TMDB_API_KEY ? { api_key: API_CONFIG.TMDB_API_KEY } : {}),
        },
      }),
      transformResponse: (response: any) => get(response, "results", []),
    }),
  }),
});

/**
 * EN: Auto-generated React hooks (one per TMDB endpoint above) — the actual
 * public surface components import to read trending/popular/top-rated/
 * upcoming movie lists.
 * VI: Các hook React được RTK Query tự sinh (mỗi endpoint TMDB ở trên một
 * hook) — đây là phần công khai mà component import để đọc danh sách phim
 * thịnh hành/phổ biến/đánh giá cao/sắp chiếu.
 */
export const {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetMovieImagesQuery,
  useGetMovieReviewsQuery,
  useGetSimilarMoviesQuery,
  useSearchTMDBMoviesQuery,
} = tmdbApi;

/**
 * EN: Builds a displayable TMDB image URL from the raw poster/backdrop
 * path TMDB returns. Falls back to a placeholder image when no path is
 * given (e.g. a movie with no poster), and passes absolute URLs through
 * unchanged (useful for non-TMDB fallback images from elsewhere).
 * VI: Dựng URL ảnh TMDB có thể hiển thị từ đường dẫn poster/backdrop thô mà
 * TMDB trả về. Trả về ảnh placeholder khi không có đường dẫn (vd. phim
 * không có poster), và giữ nguyên các URL tuyệt đối (hữu ích cho ảnh dự
 * phòng không phải từ TMDB).
 * @param path - EN: raw TMDB image path (or absolute URL), optional. VI: đường dẫn ảnh TMDB thô (hoặc URL tuyệt đối), tùy chọn.
 * @param size - EN: TMDB image size variant, defaults to "w500". VI: kích thước ảnh TMDB, mặc định là "w500".
 * @returns EN: a ready-to-use image URL. VI: URL ảnh sẵn sàng sử dụng.
 */
export const getTMDBImageUrl = (
  path?: string,
  size: "original" | "w1280" | "w500" = "w500"
) => {
  if (isEmpty(path)) return "https://picsum.photos/300/450";
  // EN: `isEmpty` (unlike a `!path` truthy check) isn't a TS type guard, so
  // narrow explicitly here to keep the string-only branch type-safe below.
  // VI: `isEmpty` (khác với kiểm tra truthy `!path`) không phải type guard
  // của TS, nên thu hẹp kiểu rõ ràng ở đây để nhánh chỉ-string bên dưới an
  // toàn về kiểu.
  const resolvedPath = path as string;
  if (resolvedPath.startsWith("http")) return resolvedPath;
  return `https://image.tmdb.org/t/p/${size}${resolvedPath}`;
};
