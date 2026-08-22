import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomeTemplate from "shared/templates/HomeTemplate";
import ErrorTemplate from "shared/templates/ErrorTemplate";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";

const Home = lazy(() => import("features/home/pages/Home"));
const Detail = lazy(() => import("features/film-detail/pages/Detail"));
const BookingTicket = lazy(() => import("features/booking/pages/BookingTicket"));
const Login = lazy(() => import("features/auth/pages/Login"));
const Register = lazy(() => import("features/auth/pages/Register"));

export const initialRoutes = [
  {
    path: "/",
    Component: Home,
    Layout: HomeTemplate,
  },
  {
    path: "/home",
    Component: Home,
    Layout: HomeTemplate,
  },
  {
    path: "/detail/:id",
    Component: Detail,
    Layout: HomeTemplate,
  },
  {
    path: "/booking/:maLichChieu",
    Component: BookingTicket,
    Layout: HomeTemplate,
  },
  {
    path: "/login",
    Component: Login,
    Layout: HomeTemplate,
  },
  {
    path: "/register",
    Component: Register,
    Layout: HomeTemplate,
  },
  {
    path: "*",
    Component: ErrorTemplate,
    Layout: HomeTemplate,
  },
];

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingNew />}>
      <Routes>
        {initialRoutes.map((route, index) => {
          const { Component, Layout, path } = route;
          return (
            <Route
              key={index}
              path={path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
