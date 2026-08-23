import { type FC, useState } from "react";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { useNavigate } from "react-router-dom";
import SliderComponent from "react-slick";
import { LeftOutlined, RightOutlined, StarFilled, EyeOutlined } from "@ant-design/icons";
import { Modal, Tag, Button } from "antd";
import { useTranslation } from "react-i18next";
import { SkeletonCard } from "@cinefix/ui";
import { TMDBMovie, getTMDBImageUrl } from "@cinefix/api-client";
import { formatLocalizedDate, APP_ROUTES } from "@cinefix/utils";

interface TMDBMovieSectionProps {
  title: string;
  subtitle?: string;
  movies: TMDBMovie[];
  isLoading: boolean;
}

// EN: react-slick injects `onClick` (and other nav props) into the component passed as
// `nextArrow`; we only need to forward that click handler to a custom-styled button.
// VI: react-slick tự bơm prop `onClick` (và các prop điều hướng khác) vào component được
// truyền cho `nextArrow`; ta chỉ cần chuyển tiếp handler click đó cho nút bấm tùy chỉnh.
const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      aria-label="Next slide"
      className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#F2545B] hover:bg-[#FF6B72] text-white shadow-xl shadow-[#F2545B]/40 flex items-center justify-center transition-all hover:scale-110 border-2 border-white/20"
    >
      <RightOutlined className="text-base font-bold" />
    </button>
  );
};

const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      aria-label="Previous slide"
      className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#F2545B] hover:bg-[#FF6B72] text-white shadow-xl shadow-[#F2545B]/40 flex items-center justify-center transition-all hover:scale-110 border-2 border-white/20"
    >
      <LeftOutlined className="text-base font-bold" />
    </button>
  );
};

/**
 * EN: Reusable horizontal-carousel section for a list of TMDB movies (used for trending,
 * popular, top-rated, upcoming sections on the home page); clicking a card opens a detail
 * modal populated from TMDB data.
 * VI: Mục carousel ngang dùng lại được cho một danh sách phim TMDB (dùng cho các mục
 * thịnh hành, phổ biến, đánh giá cao, sắp chiếu ở trang chủ); nhấn vào thẻ phim sẽ mở
 * modal chi tiết lấy dữ liệu từ TMDB.
 * @param title - EN: section heading text. VI: tiêu đề của mục.
 * @param subtitle - EN: optional section subheading text. VI: phụ đề tùy chọn của mục.
 * @param movies - EN: TMDB movies to render. VI: danh sách phim TMDB cần hiển thị.
 * @param isLoading - EN: whether the movie list is still being fetched. VI: cho biết
 * danh sách phim có đang được tải hay không.
 */
const TMDBMovieSection: FC<TMDBMovieSectionProps> = ({
  title,
  subtitle,
  movies,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["home", "common"]);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  const sliderSettings = {
    dots: false,
    // EN: Disable infinite looping when there are 4 or fewer movies — react-slick's
    // infinite mode duplicates slides and can render oddly when the count doesn't
    // exceed slidesToShow.
    // VI: Tắt chế độ lặp vô hạn khi có từ 4 phim trở xuống — chế độ infinite của
    // react-slick sẽ nhân bản slide và hiển thị bất thường khi số lượng không
    // vượt quá slidesToShow.
    infinite: movies.length > 4,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 1, dots: false },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1, dots: false },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: false },
      },
    ],
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>
      </div>

      {isLoading || isEmpty(movies) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="relative px-2">
          {/* @ts-ignore */}
          <SliderComponent {...sliderSettings}>
            {map(movies, (movie) => (
              <div key={movie.id} className="px-2 py-2">
                <article
                  onClick={() => navigate(APP_ROUTES.DETAIL(movie.id))}
                  className="group relative bg-surface border border-border rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 cursor-pointer h-full flex flex-col justify-between"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={getTMDBImageUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://picsum.photos/300/450";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        className="bg-primary hover:bg-primary-hover border-none font-semibold shadow-lg"
                      >
                        Chi Tiết
                      </Button>
                    </div>

                    <div className="absolute top-3 right-3">
                      <Tag color="#FFC857" className="font-bold text-black flex items-center gap-1">
                        <StarFilled className="text-black text-xs" />
                        {movie.vote_average ? movie.vote_average.toFixed(1) : "8.0"}
                      </Tag>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                        {movie.overview || t("home:noDescription")}
                      </p>
                    </div>
                    {movie.release_date && (
                      <span className="text-xs text-secondary font-medium mt-3 block">
                        📅 {formatLocalizedDate(movie.release_date, i18n.language)}
                      </span>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </SliderComponent>
        </div>
      )}

      {/* TMDB Movie Detail Modal */}
      <Modal
        title={selectedMovie?.title}
        open={Boolean(selectedMovie)}
        onCancel={() => setSelectedMovie(null)}
        footer={null}
        width={700}
        centered
      >
        {selectedMovie && (
          <div className="space-y-4 pt-2">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={getTMDBImageUrl(selectedMovie.backdrop_path || selectedMovie.poster_path, "w1280")}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold">{selectedMovie.title}</h3>
                <p className="text-xs text-gray-300 italic">{selectedMovie.original_title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag color="#FFC857" className="font-bold text-black text-sm py-0.5 px-2">
                ⭐ {selectedMovie.vote_average.toFixed(1)} / 10
              </Tag>
              <span className="text-xs text-text-secondary font-semibold">
                📅 Khởi chiếu: {formatLocalizedDate(selectedMovie.release_date, i18n.language)}
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {selectedMovie.overview || t("home:noDescription")}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default TMDBMovieSection;
