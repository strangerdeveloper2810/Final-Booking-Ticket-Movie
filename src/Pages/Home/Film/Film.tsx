import {
  FC,
  JSX,
  useEffect,
  useCallback,
  CSSProperties,
  MouseEventHandler,
  ComponentType,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import { RootState, AppDispatch } from "Redux/store";
import { GET_ALL_FILM } from "Redux/constant/FilmConstants";
import FilmItem from "./FilmItem/FilmItem";
import SkeletonCard from "Components/SkeletonCard";
interface ButtonSlick {
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
const Film: FC = (): JSX.Element => {
  const filmList = useSelector((state: RootState) =>
    get(state, "FlimList.arrFilm", [])
  );

  const { isLoading } = useSelector((state: RootState) => state.Loading);
  const dispatch = useDispatch<AppDispatch>();

  const getFilmSaga = useCallback(() => {
    dispatch({
      type: GET_ALL_FILM,
    });
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(filmList)) {
      getFilmSaga();
    }
  }, [filmList, getFilmSaga]);

  const renderFilmItem = useCallback(() => {
    if (isLoading) {
      return <SkeletonCard />;
    }
    return filmList.map((film) => {
      return <FilmItem filmItem={film} key={film.maPhim} />;
    });
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

  const SlickSlider = Slider as unknown as ComponentType<any>;

  return (
    <>
      <SlickSlider {...settings}>{renderFilmItem()}</SlickSlider>
    </>
  );
};

export default Film;
