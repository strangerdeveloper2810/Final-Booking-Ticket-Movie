import { type FC, useState } from "react";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import SliderComponent from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import FilmItem from "./FilmItem";
import GenreFilterBar from "./GenreFilterBar";
import { SkeletonCard } from "@cinefix/ui";
import { useGetFilmListQuery } from "@cinefix/api-client";

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
 * EN: "Now showing" section on the home page; renders the film list fetched from the API
 * as an auto-playing carousel of FilmItem cards, with a skeleton grid while loading/empty.
 * VI: Mục "Đang chiếu" ở trang chủ; hiển thị danh sách phim lấy từ API dưới dạng carousel
 * tự động chạy gồm các thẻ FilmItem, kèm lưới khung xương khi đang tải hoặc rỗng.
 */
const Film: FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const { data: filmList = [], isLoading } = useGetFilmListQuery();
  const { t } = useTranslation(["home", "common"]);

  const filteredFilms = filmList.filter((film: any) => {
    if (selectedGenre === "ALL") return true;
    if (selectedGenre === "ACTION") return film.hot || film.danhGia >= 8;
    if (selectedGenre === "HORROR") return film.maPhim % 2 === 0;
    if (selectedGenre === "COMEDY") return film.maPhim % 3 === 0;
    if (selectedGenre === "SCIFI") return film.sapChieu || film.maPhim % 5 === 0;
    return true;
  });

  const sliderSettings = {
    dots: false,
    infinite: filteredFilms.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, Math.max(1, filteredFilms.length)),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1, dots: false },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, dots: false },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: false },
      },
    ],
  };

  return (
    <section id="showtimes" className="py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            {t("home:nowShowingTitle")}
          </h2>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <GenreFilterBar
          selectedGenre={selectedGenre}
          onSelectGenre={(genreId) => setSelectedGenre(genreId)}
        />
      </div>

      {isLoading || isEmpty(filteredFilms) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="relative px-2">
          {/* @ts-ignore */}
          <SliderComponent {...sliderSettings}>
            {map(filteredFilms, (film: any) => (
              <div key={film.maPhim} className="px-2 py-2">
                <FilmItem filmItem={film} />
              </div>
            ))}
          </SliderComponent>
        </div>
      )}
    </section>
  );
};

export default Film;
