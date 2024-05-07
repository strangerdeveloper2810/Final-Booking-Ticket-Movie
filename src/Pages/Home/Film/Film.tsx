import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash"
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import { RootState, AppDispatch } from "Redux/store";
import { GET_ALL_FILM } from "Redux/constant/FilmConstants";
import FilmItem from "./FilmItem/FilmItem";
import SkeletonCard from "Components/SkeletonCard";
interface ButtonSlick {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const Film: React.FC = () => {
  const filmList = useSelector(
    (state: RootState) => state.FlimListSaga.arrFilm
  );

  const { isLoading } = useSelector((state: RootState) => state.Loading);
  const dispatch = useDispatch<AppDispatch>();

  const getFilmSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_FILM,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (_.isEmpty(filmList)) {
      getFilmSaga();
    }
  }, [filmList.length, getFilmSaga]);

  const renderFilmItem = React.useCallback(() => {
    if (isLoading) {
      return <SkeletonCard />;
    }
    return _.map(filmList, (film) => (<FilmItem filmItem={film} key={film.maPhim} />))
  }, [isLoading, filmList]);

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const slidesToShow = isMobile ? 1 : 4;
  const slidesPerRow = isMobile ? 1 : 2;

  const NextArrow = ({ className, style, onClick }: ButtonSlick) => {
    return (
      <div
        className={className}
        style={{ ...style, display: "flex", right: "10px", top: "52%" }}
        onClick={onClick}
      ></div>
    );
  };

  const PrevArrow = ({ className, style, onClick }: ButtonSlick) => {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          left: "-16px",
          top: "52%",
          zIndex: 99,
        }}
        onClick={onClick}
      ></div>
    );
  };

  const settings = {
    className: "grid gap-4 my-10 m-5",
    infinite: true,
    slidesToShow: slidesToShow,
    autoPlay: true,
    autoplaySpeed: 500,
    cssEase: "linear",
    slidesPerRow: slidesPerRow,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: isMobile,
    centerPadding: "15px",
  };

  return (
    <React.Fragment>
      <Slider {...settings}>{renderFilmItem()}</Slider>
    </React.Fragment>
  );
};

export default React.memo(Film);
