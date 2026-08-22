import React, { Suspense, lazy, FC } from "react";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";

const CarouselHome = lazy(() => import("../components/CarouselHome"));
const Film = lazy(() => import("../components/Film"));
const ListCinema = lazy(() => import("../components/ListCinema"));

const Home: FC = () => {
  return (
    <div className="w-full min-h-screen">
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
