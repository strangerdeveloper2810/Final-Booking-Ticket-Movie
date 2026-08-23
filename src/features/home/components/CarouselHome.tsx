import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { Carousel, Button, Tag, Rate, Modal } from "antd";
import { PlayCircleOutlined, StarFilled, VideoCameraOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetTrendingMoviesQuery, useGetMovieVideosQuery, getTMDBImageUrl, useGetBannersQuery } from "@cinefix/api-client";
import { APP_ROUTES } from "@cinefix/utils";

/**
 * EN: Ultra-rich Hero Carousel powered by TMDB Trending movies API — renders full-bleed
 * HD backdrops, ratings, synopsis, interactive trailer modal, and direct booking CTA buttons.
 * VI: Carousel Banner chính cao cấp sử dụng API Phim Thịnh Hành từ TMDB — hiển thị ảnh nền
 * chất lượng cao, đánh giá, tóm tắt, modal xem trailer YouTube và nút Đặt Vé Ngay.
 */
const CarouselHome: FC = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation(["home", "common"]);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const { data: tmdbMovies = [], isLoading: loadingTMDB } = useGetTrendingMoviesQuery(i18n.language);
  const { data: cybersoftBanners = [], isLoading: loadingCybersoft } = useGetBannersQuery();

  const isLoading = loadingTMDB && loadingCybersoft;

  if (isLoading) {
    return <div className="w-full h-[450px] bg-surface animate-pulse rounded-2xl border border-border" />;
  }

  // Use TMDB movies if available, else fall back to Cybersoft banner objects
  const bannerList = !isEmpty(tmdbMovies) ? tmdbMovies.slice(0, 6) : cybersoftBanners;

  return (
    <div className="w-full overflow-hidden relative">
      <Carousel autoplay autoplaySpeed={5000} effect="fade">
        {map(bannerList, (item: any, idx: number) => {
          const isTMDB = !!item.backdrop_path || !!item.title;
          const backdropUrl = isTMDB
            ? getTMDBImageUrl(item.backdrop_path || item.poster_path, "original")
            : item.hinhAnh;
          const title = item.title || item.original_title || `Phim hot #${idx + 1}`;
          const overview = item.overview || "Trải nghiệm điện ảnh đỉnh cao tại Cinefix với chất lượng hình ảnh & âm thanh sống động.";
          const rating = item.vote_average ? (item.vote_average / 2).toFixed(1) : "4.5";
          const movieId = item.id || item.maPhim || 1234;

          return (
            <div key={item.id || item.maBanner || idx} className="relative h-[480px] sm:h-[580px] md:h-[680px] outline-none">
              {/* Wallpaper Backdrop Image */}
              <img
                src={backdropUrl}
                alt={title}
                className="w-full h-full object-cover object-center"
              />

              {/* Multi-stage Gradient Overlays for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent max-w-screen-xl mx-auto" />

              {/* Banner Content Container */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
                  <div className="max-w-2xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag color="red" className="font-extrabold uppercase px-3 py-0.5 text-xs tracking-wider border-none shadow-md">
                        🔥 HOT TRENDING
                      </Tag>
                      <div className="bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1 border border-yellow-500/30">
                        <StarFilled /> {rating} / 5
                      </div>
                      <span className="text-xs text-white/80 font-medium">
                        {item.release_date ? item.release_date.substring(0, 4) : "2024"}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight line-clamp-2">
                      {title}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed drop-shadow max-w-xl">
                      {overview}
                    </p>

                    <div className="pt-3 flex flex-wrap items-center gap-4">
                      <Button
                        type="primary"
                        size="large"
                        icon={<VideoCameraOutlined />}
                        onClick={() => navigate(APP_ROUTES.DETAIL(movieId))}
                        className="bg-primary hover:bg-primary-hover font-bold h-12 px-7 rounded-xl shadow-lg shadow-primary/40 border-none text-base transition-all hover:scale-105"
                      >
                        {t("common:bookTicket", { defaultValue: "Đặt Vé Ngay" })}
                      </Button>

                      <Button
                        type="default"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(APP_ROUTES.DETAIL(movieId))}
                        className="bg-surface/80 hover:bg-surface border-border text-text-primary font-semibold h-12 px-6 rounded-xl backdrop-blur transition-all"
                      >
                        {t("common:watchTrailer", { defaultValue: "Xem Chi Tiết" })}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default CarouselHome;
