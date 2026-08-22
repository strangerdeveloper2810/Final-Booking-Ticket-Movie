import React, { FC, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import SliderComponent from "react-slick";
import { RootState, AppDispatch } from "app/store";
import { GET_ALL_FILM } from "../redux/filmList/FilmActionTypes";
import FilmItem from "./FilmItem";
import SkeletonCard from "shared/components/SkeletonCard/SkeletonCard";

const Film: FC = () => {
  const filmList = useSelector((state: RootState) =>
    get(state, "FlimList.arrFilm", [])
  );
  const { isLoading } = useSelector((state: RootState) => state.Loading);
  const dispatch = useDispatch<AppDispatch>();

  const getFilmSaga = useCallback(() => {
    dispatch({ type: GET_ALL_FILM });
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(filmList)) {
      getFilmSaga();
    }
  }, [filmList, getFilmSaga]);

  const sliderSettings = {
    dots: true,
    infinite: filmList.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section id="now-showing" className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#F5F6FA] tracking-tight">
            Phim Đang Chiếu
          </h2>
          <div className="h-1 w-16 bg-[#F2545B] rounded-full mt-2" />
        </div>
      </div>

      {isLoading || isEmpty(filmList) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="px-2">
          {/* @ts-ignore */}
          <SliderComponent {...sliderSettings}>
            {filmList.map((film) => (
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
