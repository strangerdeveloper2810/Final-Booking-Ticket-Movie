import { type FC } from "react";
import isEmpty from "lodash/isEmpty";
import SliderComponent from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import FilmItem from "./FilmItem";
import SkeletonCard from "shared/components/SkeletonCard/SkeletonCard";
import { useGetFilmListQuery } from "shared/services/movieApi";

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

const Film: FC = () => {
  const { data: filmList = [], isLoading } = useGetFilmListQuery();
  const { t } = useTranslation(["home", "common"]);

  const sliderSettings = {
    dots: false,
    infinite: filmList.length > 4,
    speed: 500,
    slidesToShow: 4,
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
    <section id="now-showing" className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            {t("home:nowShowingTitle")}
          </h2>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>
      </div>

      {isLoading || isEmpty(filmList) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="relative px-2">
          {/* @ts-ignore */}
          <SliderComponent {...sliderSettings}>
            {filmList.map((film: any) => (
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
