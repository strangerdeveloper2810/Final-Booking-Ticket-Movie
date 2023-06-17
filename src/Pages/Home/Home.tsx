import React from "react";
import { Carousel } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
// import { getAllBannerApi } from "Redux/reducer/BannerReducer";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
import FilmList from "Pages/Film";

export const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.BannerSaga.arrBanner);

  const dispatch: AppDispatch = useDispatch();

  const getBannerSaga = () => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  };
  React.useEffect(() => {
    if (Banner.length === 0) {
      getBannerSaga();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCarousel = () => {
    return Banner.map((banner) => {
      return (
        <div className="banner" key={banner.maBanner}>
          <div className="content-style">
            <img src={banner.hinhAnh} alt="banner" />
          </div>
        </div>
      );
    });
  };

  const responsiveSettings = [
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        dots: true, // Show pagination dots on small screens
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
        dots: true, // Show pagination dots on medium screens
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        dots: false, // Hide pagination dots on larger screens
      },
    },
  ];

  return (
    <main className="w-screen">
      <div className="carousel">
        <Carousel autoplay responsive={responsiveSettings} dots={false}>
          {renderCarousel()}
        </Carousel>
      </div>
      <FilmList />
    </main>
  );
};

export default React.memo(Home);
