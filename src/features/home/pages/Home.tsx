import { type FC, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import SEO from "shared/components/SEO/SEO";
import {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} from "shared/services/tmdbApi";
import TMDBMovieSection from "../components/TMDBMovieSection";

const CarouselHome = lazy(() => import("../components/CarouselHome"));
const Film = lazy(() => import("../components/Film"));
const ListCinema = lazy(() => import("../components/ListCinema"));

const Home: FC = () => {
  const { t } = useTranslation(["home", "common"]);

  const { data: trendingMovies = [], isLoading: loadingTrending } = useGetTrendingMoviesQuery();
  const { data: popularMovies = [], isLoading: loadingPopular } = useGetPopularMoviesQuery();
  const { data: topRatedMovies = [], isLoading: loadingTopRated } = useGetTopRatedMoviesQuery();
  const { data: upcomingMovies = [], isLoading: loadingUpcoming } = useGetUpcomingMoviesQuery();

  return (
    <div className="w-full min-h-screen">
      <SEO
        title={t("home:seoTitle")}
        description={t("home:seoDescription")}
        keywords={t("home:seoKeywords")}
      />
      <Suspense fallback={<LoadingNew />}>
        {/* Full bleed Hero Banner */}
        <CarouselHome />

        {/* Main Content Container */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 space-y-12">
          {/* TMDB Trending Movies Carousel */}
          <TMDBMovieSection
            title={t("home:tmdbTrending")}
            movies={trendingMovies}
            isLoading={loadingTrending}
          />

          {/* Cybersoft Now Showing Slider */}
          <Film />

          {/* TMDB Top Rated Movies Collection */}
          <TMDBMovieSection
            title={t("home:tmdbTopRated")}
            movies={topRatedMovies}
            isLoading={loadingTopRated}
          />

          {/* Cinema Clusters & Showtimes */}
          <ListCinema />

          {/* TMDB Popular Hits */}
          <TMDBMovieSection
            title={t("home:tmdbPopular")}
            movies={popularMovies}
            isLoading={loadingPopular}
          />

          {/* TMDB Upcoming Releases */}
          <TMDBMovieSection
            title={t("home:tmdbUpcoming")}
            movies={upcomingMovies}
            isLoading={loadingUpcoming}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
