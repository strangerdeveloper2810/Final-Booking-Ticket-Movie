import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from "antd";
import { RootState, AppDispatch } from "Redux/store";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
import SkeletonCarousel from "Components/SkeletonCarousel";
const CarouselHome: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { arrBanner } = useSelector((state: RootState) => state.BannerSaga);
  const { isLoading } = useSelector((state: RootState) => state.Loading);

  const getBannerSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (arrBanner.length === 0) {
      getBannerSaga();
    }
  }, [arrBanner.length, getBannerSaga]);

  const renderCarousel = React.useMemo(() => {
    if (isLoading) {
      return <SkeletonCarousel />;
    }
    return arrBanner.map((banner) => {
      return (
        <div className="banner" key={banner.maBanner}>
          <div className="content-style">
            <img src={banner.hinhAnh} alt="banner" />
          </div>
        </div>
      );
    });
  }, [isLoading, arrBanner]);

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
        {renderCarousel}
      </Carousel>
    </div>
  );
};

export default React.memo(CarouselHome);
