import { type FC, useState, useEffect } from "react";
import { StarFilled, SafetyCertificateOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetTrendingMoviesQuery, getTMDBImageUrl } from "shared/services/tmdbApi";
import { useGetBannersQuery } from "shared/services/movieApi";

const AuthShowcase: FC = () => {
  const { t, i18n } = useTranslation(["auth", "common"]);
  const { data: tmdbMovies = [] } = useGetTrendingMoviesQuery(i18n.language);
  const { data: banners = [] } = useGetBannersQuery();
  const [activeIndex, setActiveIndex] = useState(0);

  const fallbackQuotes = [
    { quote: t("auth:quote1"), movie: "Cinefix Cinema", year: "2026" },
    { quote: t("auth:quote2"), movie: "Premiere Showcase", year: "2026" },
    { quote: t("auth:quote3"), movie: "IMAX Experience", year: "2026" },
  ];

  const totalItems = Math.max(tmdbMovies.length, banners.length, fallbackQuotes.length);

  useEffect(() => {
    if (totalItems === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalItems]);

  const currentTMDB = tmdbMovies[activeIndex % Math.max(tmdbMovies.length, 1)];
  const currentBanner = banners[activeIndex % Math.max(banners.length, 1)]?.hinhAnh;
  const currentQuote = fallbackQuotes[activeIndex % fallbackQuotes.length];

  const backdropUrl = currentTMDB?.backdrop_path
    ? getTMDBImageUrl(currentTMDB.backdrop_path, "original")
    : currentBanner || "https://picsum.photos/1200/1600";

  const movieTitle = currentTMDB?.title || currentQuote.movie;
  const overviewText = currentTMDB?.overview
    ? currentTMDB.overview.length > 150
      ? currentTMDB.overview.substring(0, 150) + "..."
      : currentTMDB.overview
    : currentQuote.quote;
  const ratingValue = currentTMDB?.vote_average
    ? currentTMDB.vote_average.toFixed(1)
    : "9.8";

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-black text-white h-full w-full">
      {/* Background Poster Image with Dynamic Edge Bleed */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 filter brightness-75"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />

      {/* Glassmorphic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
          <PlaySquareOutlined className="text-primary text-lg" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {t("auth:showcaseBadge")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 px-3.5 py-1.5 rounded-full">
          <StarFilled className="text-yellow-400 text-xs" />
          <span className="text-xs font-extrabold text-yellow-300">
            {ratingValue} / 10 IMDb
          </span>
        </div>
      </div>

      {/* Center Showcase Content */}
      <div className="relative z-10 my-auto max-w-xl space-y-6">
        <div className="inline-block px-3.5 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
          {t("auth:showcaseTag")}
        </div>
        <h1 className="text-4xl xl:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-2xl line-clamp-2">
          {movieTitle}
        </h1>

        {/* Dynamic Quote Box */}
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-700">
          <p className="text-sm italic text-gray-200 leading-relaxed mb-3">
            "{overviewText}"
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-t border-white/10 pt-3">
            <span className="text-primary font-bold">{movieTitle}</span>
            <span>TMDB 2026</span>
          </div>
        </div>
      </div>

      {/* Bottom Features Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-primary text-base" />
          <span>{t("auth:securityBadge")}</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === activeIndex % 4 ? "w-6 bg-primary" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
