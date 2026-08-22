import React, { useCallback, useMemo, useEffect, FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { Carousel } from "antd";
import { RootState, AppDispatch } from "app/store";
import { GET_ALL_BANNER } from "../redux/banner/BannerActionTypes";
import SkeletonCarousel from "shared/components/SkeletonCarousel/SkeletonCarousel";

const CarouselHome: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { arrBanner } = useSelector((state: RootState) => state.Banner);
  const { isLoading } = useSelector((state: RootState) => state.Loading);

  const getBannerSaga = useCallback(() => {
    dispatch({ type: GET_ALL_BANNER });
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(arrBanner)) {
      getBannerSaga();
    }
  }, [arrBanner, getBannerSaga]);

  const renderCarousel = useMemo(() => {
    if (isLoading || isEmpty(arrBanner)) {
      return <SkeletonCarousel />;
    }
    return map(arrBanner, (banner) => (
      <div key={banner.maBanner} className="relative h-[300px] sm:h-[420px] md:h-[520px] outline-none">
        <img
          src={banner.hinhAnh}
          alt={`Banner ${banner.maBanner}`}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Cinematic Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-colors" />
      </div>
    ));
  }, [isLoading, arrBanner]);

  return (
    <div className="w-full overflow-hidden relative">
      <Carousel autoplay autoplaySpeed={4000} effect="fade">
        {renderCarousel}
      </Carousel>
    </div>
  );
};

export default CarouselHome;
