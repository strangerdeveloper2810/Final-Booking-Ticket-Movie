import React from "react";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
import { GET_ALL_CINEMA } from "Redux/constant/CinemaConstants";
import LoadingNew from "Components/LoadingNew";

type TabPosition = "left";
const { TabPane } = Tabs;

const LazyCarousel = React.lazy(() =>
  import("antd").then((module) => ({ default: module.Carousel }))
);
const LazyFilmList = React.lazy(() => import("Pages/Film"));

const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.BannerSaga.arrBanner);
  const ListCinema = useSelector(
    (state: RootState) => state.ListCinema.arrListCinema
  );
  const [tabPosition] = React.useState<TabPosition>("left");

  const dispatch: AppDispatch = useDispatch();

  const getBannerSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  }, [dispatch]);

  const getListCinemaSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_CINEMA,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (Banner.length === 0) {
      getBannerSaga();
    }

    if (ListCinema.length === 0) {
      getListCinemaSaga();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const renderCinema = React.useCallback(() => {
    return ListCinema.map((cinemaSystem, index) => (
      <Tabs tabPosition={tabPosition}>
        <TabPane
          tab={
            <img
              src={cinemaSystem.logo}
              alt={cinemaSystem.tenHeThongRap}
              className="rounded-full"
              width={50}
            />
          }
          key={cinemaSystem.maHeThongRap}
        ></TabPane>
      </Tabs>
    ));
  }, [ListCinema, tabPosition]);

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
      <React.Suspense fallback={<LoadingNew />}>
        <div className="carousel">
          <LazyCarousel autoplay responsive={responsiveSettings} dots={false}>
            {renderCarousel()}
          </LazyCarousel>
        </div>
        <LazyFilmList />
        <>{renderCinema()}</>
      </React.Suspense>
    </main>
  );
};

export default React.memo(Home);
