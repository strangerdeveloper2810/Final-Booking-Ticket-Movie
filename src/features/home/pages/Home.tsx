import React, { Suspense, lazy, FC } from "react";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import SEO from "shared/components/SEO/SEO";

const CarouselHome = lazy(() => import("../components/CarouselHome"));
const Film = lazy(() => import("../components/Film"));
const ListCinema = lazy(() => import("../components/ListCinema"));

const Home: FC = () => {
  return (
    <div className="w-full min-h-screen">
      <SEO
        title="Cinefix - Đặt Vé Xem Phim Rạp Trực Tuyến Hàng Đầu"
        description="Trải nghiệm điện ảnh đỉnh cao. Đặt vé xem phim chiếu rạp nhanh chóng, chọn vị trí ngồi đẹp nhất tại Cinefix."
        keywords="đặt vé xem phim, lịch chiếu phim, rạp chiếu phim, cinefix, rạp chiếu phim tphcm"
      />
      <Suspense fallback={<LoadingNew />}>
        {/* Full bleed Hero Banner */}
        <CarouselHome />

        {/* Content Shell Container */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 space-y-12">
          <Film />
          <ListCinema />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
