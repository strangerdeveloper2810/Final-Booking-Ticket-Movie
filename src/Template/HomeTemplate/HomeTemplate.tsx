import React from "react";
import Header from "Components/Header";
import Footer from "Components/Footer";
import { Outlet } from "react-router-dom";

const HomeTemplate: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default React.memo(HomeTemplate);
