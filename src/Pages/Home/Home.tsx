import React from "react";
import LoadingNew from "Components/LoadingNew";
const LazyCarousel = React.lazy(() => import("./Carousel"));
const LazyListCinema = React.lazy(() => import("./ListCinema"));
const LazyFilm = React.lazy(() => import("./Film"));

const Home: React.FC = () => {
  return (
    <main className="w-screen">
      <React.Suspense fallback={<LoadingNew />}>
        <LazyCarousel />
        <LazyFilm />
        <LazyListCinema />
      </React.Suspense>
    </main>
  );
};

export default React.memo(Home);
