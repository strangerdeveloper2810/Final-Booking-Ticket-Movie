import { type FC, Suspense, lazy } from "react";
import map from "lodash/map";
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

/**
 * EN: Home page: composes the hero banner carousel, the "now showing" film section, the
 * cinema/showtime listing, and several TMDB-powered movie showcase sections; also emits
 * SEO metadata and JSON-LD structured data for the page.
 * VI: Trang chủ: ghép các phần carousel banner chính, mục phim "đang chiếu", danh sách
 * rạp/lịch chiếu và nhiều mục giới thiệu phim từ TMDB; đồng thời phát ra metadata SEO và
 * dữ liệu có cấu trúc JSON-LD cho trang.
 */
const Home: FC = () => {
  const { t, i18n } = useTranslation(["home", "common"]);

  const { data: trendingMovies = [], isLoading: loadingTrending } = useGetTrendingMoviesQuery(i18n.language);
  const { data: popularMovies = [], isLoading: loadingPopular } = useGetPopularMoviesQuery(i18n.language);
  const { data: topRatedMovies = [], isLoading: loadingTopRated } = useGetTopRatedMoviesQuery(i18n.language);
  const { data: upcomingMovies = [], isLoading: loadingUpcoming } = useGetUpcomingMoviesQuery(i18n.language);

  // EN: Structured JSON-LD Schema for Google Rich Results — top 10 trending movies only,
  // matching Google's recommended list size for ItemList rich results.
  // VI: Dữ liệu có cấu trúc JSON-LD cho Google Rich Results — chỉ lấy 10 phim thịnh hành
  // đầu tiên, theo khuyến nghị của Google về kích thước danh sách cho ItemList rich results.
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("home:seoTitle"),
    description: t("home:seoDescription"),
    itemListElement: map(trendingMovies.slice(0, 10), (movie, index) => ({
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
