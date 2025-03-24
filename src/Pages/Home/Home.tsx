import { Suspense, lazy, FC, JSX } from "react";
import { LoadingNew } from "Components";
const LazyCarousel = lazy(() => import("./Carousel"));
const LazyListCinema = lazy(() => import("./ListCinema"));
const LazyFilm = lazy(() => import("./Film"));

const Home: FC = (): JSX.Element => {
  return (
    <main className="w-screen">
      <Suspense fallback={<LoadingNew />}>
        <LazyCarousel />
        <LazyFilm />
        <LazyListCinema />
      </Suspense>
    </main>
  );
};

export default Home;
