import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { API_CONFIG } from "@cinefix/utils";

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

export interface TMDBMovieDetail extends TMDBMovie {
  tagline?: string;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: Array<{ id: number; name: string; logo_path: string }>;
  videos?: { results: Array<{ key: string; site: string; type: string; name: string }> };
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

const getTMDBLanguageCode = (lang?: string) => {
  if (lang === "vi" || lang === "vi-VN") return "vi-VN";
  return "en-US";
};

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
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),
    getPopularMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `movie/popular?language=${tmdbLang}&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
      transformResponse: (response: TMDBResponse) => get(response, "results", []),
    }),
    getTopRatedMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => {
        const tmdbLang = getTMDBLanguageCode(lang || undefined);
        return `movie/top_rated?language=${tmdbLang}&page=1${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
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
    getMovieDetails: builder.query<TMDBMovieDetail, { movieId: number | string; lang?: string } | number | string>({
      query: (arg) => {
        const movieId = typeof arg === "object" ? arg.movieId : arg;
        const lang = typeof arg === "object" ? arg.lang : undefined;
        const tmdbLang = getTMDBLanguageCode(lang);
        return `movie/${movieId}?language=${tmdbLang}&append_to_response=videos,credits,images${
          API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : ""
        }`;
      },
    }),

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

export const getTMDBImageUrl = (
  path?: string,
  size: "original" | "w1280" | "w500" = "w500"
) => {
  if (isEmpty(path)) return "https://picsum.photos/300/450";
  const resolvedPath = path as string;
  if (resolvedPath.startsWith("http")) return resolvedPath;
  return `https://image.tmdb.org/t/p/${size}${resolvedPath}`;
};

export const fetchTMDBMovieDetails = async (
  movieId: number | string,
  lang?: string
): Promise<TMDBMovieDetail | null> => {
  try {
    const tmdbLang = getTMDBLanguageCode(lang);
    const apiKeyParam = API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : "";
    const headers: Record<string, string> = { accept: "application/json" };
    if (API_CONFIG.TMDB_TOKEN) {
      headers["Authorization"] = `Bearer ${API_CONFIG.TMDB_TOKEN}`;
    }
    const res = await fetch(
      `${tmdbBaseUrl}movie/${movieId}?language=${tmdbLang}&append_to_response=videos,credits,images${apiKeyParam}`,
      { headers }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchTMDBMovieSearch = async (
  query: string,
  lang?: string
): Promise<TMDBMovieDetail | null> => {
  try {
    const tmdbLang = getTMDBLanguageCode(lang);
    const apiKeyParam = API_CONFIG.TMDB_API_KEY ? `&api_key=${API_CONFIG.TMDB_API_KEY}` : "";
    const headers: Record<string, string> = { accept: "application/json" };
    if (API_CONFIG.TMDB_TOKEN) {
      headers["Authorization"] = `Bearer ${API_CONFIG.TMDB_TOKEN}`;
    }
    const res = await fetch(
      `${tmdbBaseUrl}search/movie?query=${encodeURIComponent(query)}&language=${tmdbLang}${apiKeyParam}`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const firstResult = get(data, "results[0]");
    if (firstResult?.id) {
      return fetchTMDBMovieDetails(firstResult.id, lang);
    }
    return null;
  } catch (err) {
    return null;
  }
};
