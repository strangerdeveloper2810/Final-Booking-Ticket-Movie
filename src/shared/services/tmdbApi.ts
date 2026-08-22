import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "shared/constants/appConstants";

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

const tmdbBaseUrl = API_CONFIG.TMDB_DOMAIN.endsWith("/")
  ? API_CONFIG.TMDB_DOMAIN
  : `${API_CONFIG.TMDB_DOMAIN}/`;

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
    getTrendingMovies: builder.query<TMDBMovie[], void>({
      query: () =>
        `trending/movie/day?language=vi-VN${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`,
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
    getPopularMovies: builder.query<TMDBMovie[], void>({
      query: () =>
        `movie/popular?language=vi-VN&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`,
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
    getTopRatedMovies: builder.query<TMDBMovie[], void>({
      query: () =>
        `movie/top_rated?language=vi-VN&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`,
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
    getUpcomingMovies: builder.query<TMDBMovie[], void>({
      query: () =>
        `movie/upcoming?language=vi-VN&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`,
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} = tmdbApi;

export const getTMDBImageUrl = (
  path?: string,
  size: "original" | "w1280" | "w500" = "w500"
) => {
  if (!path) return "https://picsum.photos/300/450";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
