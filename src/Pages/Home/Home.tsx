import React from "react";
import { Carousel } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "Redux/store";

const contentStyle: React.CSSProperties = {
  height: "100vh",
  color: "#fff",
  lineHeight: "550px",
  textAlign: "center",
  background: "#364d79",
};

export const Home: React.FC = () => {
  const Banner = useSelector((state: RootState) => state.Banner.arrBanner);

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
