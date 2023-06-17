import React from "react";
import { Carousel, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
import FilmList from "Pages/Film";
type TabPosition = "left";

export const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.BannerSaga.arrBanner);

  const [tabPosition] = React.useState<TabPosition>("left");

  const dispatch: AppDispatch = useDispatch();

  const getBannerSaga = () => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  };
  React.useEffect(() => {
    if (Banner.length === 0) {
      getBannerSaga();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCarousel = () => {
    return Banner.map((banner) => {
      return (
        <div className="banner" key={banner.maBanner}>
          <div className="content-style">
            <img src={banner.hinhAnh} alt="banner" />
          </div>
        </div>
      );
    });
  };

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
      <div className="carousel">
        <Carousel autoplay responsive={responsiveSettings} dots={false}>
          {renderCarousel()}
        </Carousel>
      </div>
      <FilmList />
      <>
        <Tabs
          tabPosition={tabPosition}
          items={new Array(3).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: `Tab ${id}`,
              key: id,
              children: `Content of Tab ${id}`,
            };
          })}
        />
      </>
    </main>
  );
};

export default React.memo(Home);
