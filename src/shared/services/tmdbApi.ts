import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const TMDB_READ_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTQ0NjViYmRjNjcxODAzYzI2NmQ4ZjQ4ZjA5NWVlOCIsInN1YiI6IjY1ZDZkYWYxYTI5NmVlMDE2Mzg4OWI0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4YxXJ8sI0Jg5J16n74158145185";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${TMDB_READ_ACCESS_TOKEN}`);
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<TMDBMovie[], void>({
      query: () => "trending/movie/day?language=vi-VN",
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
    getPopularMovies: builder.query<TMDBMovie[], void>({
      query: () => "movie/popular?language=vi-VN&page=1",
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetPopularMoviesQuery } = tmdbApi;

export const getTMDBImageUrl = (path?: string, size: "original" | "w1280" | "w500" = "w1280") => {
  if (!path) return "https://picsum.photos/1200/800";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
