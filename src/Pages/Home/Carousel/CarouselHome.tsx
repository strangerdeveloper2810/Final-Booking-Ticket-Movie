import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from "antd";
import { RootState, AppDispatch } from "Redux/store";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
const CarouselHome: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const Banner = useSelector((state: RootState) => state.BannerSaga.arrBanner);

  const getBannerSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (Banner.length === 0) {
      getBannerSaga();
    }
  }, [Banner.length, getBannerSaga]);

  const renderCarousel = React.useCallback(() => {
    return Banner.map((banner) => {
      return (
        <div className="banner" key={banner.maBanner}>
          <div className="content-style">
            <img src={banner.hinhAnh} alt="banner" />
          </div>
        </div>
      );
    });
  }, [Banner]);

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
    <div className="carousel">
      <Carousel autoplay responsive={responsiveSettings} dots={false}>
        {renderCarousel()}
      </Carousel>
    </div>
  );
};

export default CarouselHome;
