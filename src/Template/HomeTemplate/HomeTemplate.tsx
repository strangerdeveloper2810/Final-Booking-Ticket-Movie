import Footer from "Pages/Footer";
import Header from "Pages/Header";
import React from "react";
import { Outlet } from "react-router-dom";
export default function HomeTemplate() {
  return (
    <div className="container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
