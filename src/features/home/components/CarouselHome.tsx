import React, { useMemo, FC } from "react";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { Carousel } from "antd";
import SkeletonCarousel from "shared/components/SkeletonCarousel/SkeletonCarousel";
import { useGetBannersQuery } from "shared/services/movieApi";

const CarouselHome: FC = () => {
  const { data: arrBanner, isLoading } = useGetBannersQuery();

  const renderCarousel = useMemo(() => {
    if (isLoading || isEmpty(arrBanner)) {
      return <SkeletonCarousel />;
    }
    return map(arrBanner, (banner: any) => (
      <div key={banner.maBanner} className="relative h-[320px] sm:h-[440px] md:h-[540px] outline-none">
        <img
          src={banner.hinhAnh}
          alt={`Banner ${banner.maBanner}`}
          className="w-full h-full object-cover"
        />
        {/* Cinematic Gradient Overlay (Dark bottom gradient for visual contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
