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

  // Structured JSON-LD Schema for Google Rich Results
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("home:seoTitle"),
    description: t("home:seoDescription"),
    itemListElement: trendingMovies.slice(0, 10).map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Movie",
        name: movie.title,
        description: movie.overview,
        datePublished: movie.release_date,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          bestRating: "10",
        },
      },
    })),
  };

  return (
    <main className="w-full min-h-screen bg-background text-text-primary transition-colors pb-16">
      <SEO
        title={t("home:seoTitle")}
        description={t("home:seoDescription")}
        keywords={t("home:seoKeywords")}
        jsonLd={homeJsonLd}
      />
      <Suspense fallback={<LoadingNew />}>
        {/* Hidden SEO h1 heading */}
        <h1 className="sr-only">{t("home:seoTitle")}</h1>

        {/* Hero Banner Showcase */}
        <section aria-label="Hero Banners">
          <CarouselHome />
        </section>

        {/* Core Cinema Section Container */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 space-y-16 mt-8">
          {/* 1. Core Feature: Now Showing Cinema Movies */}
          <Film />

          {/* 2. Core Feature: Cinema Clusters & Showtimes */}
          <ListCinema />

          {/* 3. TMDB Trending Showcase */}
          <TMDBMovieSection
            title={t("home:tmdbTrending")}
            movies={trendingMovies}
            isLoading={loadingTrending}
          />

          {/* 4. TMDB Top Rated Hall of Fame */}
          <TMDBMovieSection
            title={t("home:tmdbTopRated")}
            movies={topRatedMovies}
            isLoading={loadingTopRated}
          />

          {/* 5. TMDB Upcoming Releases */}
          <TMDBMovieSection
            title={t("home:tmdbUpcoming")}
            movies={upcomingMovies}
            isLoading={loadingUpcoming}
          />

          {/* 6. TMDB Popular Hit Movies */}
          <TMDBMovieSection
            title={t("home:tmdbPopular")}
            movies={popularMovies}
            isLoading={loadingPopular}
          />
        </div>
      </Suspense>
    </main>
  );
};

export default Home;
