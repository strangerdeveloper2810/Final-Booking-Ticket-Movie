import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingNew from "Components/LoadingNew";
import Home from "Pages/Home";
import Login from "Pages/Login";
import Register from "Pages/Register";
import HomeTemplate from "Template/HomeTemplate";
import Detail from "Pages/Details";
import BookingTicket from "Pages/BookingTicket";
import ErrorTemplate from "Template/ErrorTemplate";
import { ToastContainer } from "react-toastify";
const App: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingNew />}>
      <ToastContainer />
      <div className="w-screen">
        <Routes>
          <Route path="" element={<HomeTemplate />}>
            <Route index element={<Home />} />
            <Route path="detail">
              <Route path=":id" element={<Detail />}></Route>
            </Route>
            <Route path="booking/:maLichChieu" element={<BookingTicket />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="404" element={<ErrorTemplate />} />
          <Route path="*" element={<Navigate to={"/404"} replace />} />
        </Routes>
        <ToastContainer />
      </div>
    </React.Suspense>
  );
};

export default App;
