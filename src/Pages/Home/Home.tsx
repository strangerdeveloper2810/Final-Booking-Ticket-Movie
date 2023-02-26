import React from "react";
import { Carousel } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
import { getAllBannerApi } from "Redux/reducer/BannerReducer";

const contentStyle: React.CSSProperties = {
  height: "100vh",
  color: "#fff",
  lineHeight: "550px",
  textAlign: "center",
  background: "#364d79",
};

export const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.Banner.arrBanner);

  const dispatch: AppDispatch = useDispatch();

  const getAllBanner = () => {
    const actionThunk = getAllBannerApi();
    dispatch(actionThunk);
  };
  React.useEffect(() => {
    getAllBanner();
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
    <React.Fragment>
      <Carousel autoplay>{renderCarousel()}</Carousel>
    </React.Fragment>
  );
};

export default Home;
