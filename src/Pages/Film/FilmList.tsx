import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import { RootState, AppDispatch } from "Redux/store";
import { GET_ALL_FILM } from "Redux/constant/FilmConstants";
import FilmItem from "./FilmItem";
interface ButtonSlick {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const FilmList: React.FC = () => {
  const filmList = useSelector(
    (state: RootState) => state.FlimListSaga.arrFilm
  );
  const dispatch = useDispatch<AppDispatch>();

  const getFilmSaga = () => {
    dispatch({
      type: GET_ALL_FILM,
    });
  };

  React.useEffect(() => {
    if (filmList.length === 0) {
      getFilmSaga();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFilmItem = React.useCallback(() => {
    return filmList.map((film) => {
      return <FilmItem filmItem={film} key={film.maPhim} />;
    });
  }, [filmList]);

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

export default React.memo(FilmList);
