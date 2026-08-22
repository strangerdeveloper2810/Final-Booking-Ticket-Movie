import { type FC } from "react";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { Carousel } from "antd";
import SkeletonCarousel from "shared/components/SkeletonCarousel/SkeletonCarousel";
import { useGetBannersQuery } from "shared/services/movieApi";

/**
 * EN: Hero carousel shown at the top of the home page; it auto-rotates promotional banners
 * fetched from the API and falls back to a skeleton placeholder while loading or when no
 * banner data is available.
 * VI: Carousel banner chính hiển thị ở đầu trang chủ; tự động xoay các banner quảng cáo lấy
 * từ API, hiển thị khung xương (skeleton) khi đang tải hoặc khi không có dữ liệu banner.
 */
const CarouselHome: FC = () => {
  const { data: arrBanner, isLoading } = useGetBannersQuery();

  const renderCarousel = () => {
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
  };

  return (
    <div className="w-full overflow-hidden relative">
      <Carousel autoplay autoplaySpeed={4000} effect="fade">
        {renderCarousel()}
      </Carousel>
    </div>
  );
};

export default CarouselHome;
