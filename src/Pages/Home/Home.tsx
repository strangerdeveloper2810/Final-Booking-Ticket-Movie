import React from "react";
import { Carousel } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
// import { getAllBannerApi } from "Redux/reducer/BannerReducer";
import { GET_ALL_BANNER } from "Redux/constant/BannerConstants";
import FilmList from "Pages/Film";

const contentStyle: React.CSSProperties = {
  height: "100vh",
  color: "#fff",
  lineHeight: "100vh",
  textAlign: "center",
  background: "#364d79",
};

export const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.BannerSaga.arrBanner);

  const dispatch: AppDispatch = useDispatch();

  // const getAllBanner = () => {
  //   const actionThunk = getAllBannerApi();
  //   dispatch(actionThunk);
  // };

  const getBannerSaga = () => {
    dispatch({
      type: GET_ALL_BANNER,
    });
  };
  React.useEffect(() => {
    // getAllBanner();
    getBannerSaga();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCarousel = () => {
    return Banner.map((banner, key) => {
      return (
        <div className="banner" key={banner.maBanner}>
          <h3 style={contentStyle}>
            <img src={banner.hinhAnh} alt="banner" />
          </h3>
        </div>
      );
    });
  };
  return (
    <main className="w-screen">
      <Carousel autoplay>{renderCarousel()}</Carousel>
      <FilmList />
    </main>
  );
};

export default React.memo(Home);
