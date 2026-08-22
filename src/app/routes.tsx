import React, { lazy, Suspense } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import HomeTemplate from "shared/templates/HomeTemplate";
import ErrorTemplate from "shared/templates/ErrorTemplate";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import { PATHS } from "shared/constants/routes";

const Home = lazy(() => import("features/home/pages/Home"));
const Detail = lazy(() => import("features/film-detail/pages/Detail"));
const BookingTicket = lazy(() => import("features/booking/pages/BookingTicket"));
const Login = lazy(() => import("features/auth/pages/Login"));
const Register = lazy(() => import("features/auth/pages/Register"));

export const routesConfig: RouteObject[] = [
  {
    path: PATHS.HOME,
    element: (
      <HomeTemplate>
        <Home />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.HOME_ALIAS,
    element: (
      <HomeTemplate>
        <Home />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.DETAIL,
    element: (
      <HomeTemplate>
        <Detail />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.BOOKING,
    element: (
      <HomeTemplate>
        <BookingTicket />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.LOGIN,
    element: (
      <HomeTemplate>
        <Login />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.REGISTER,
    element: (
      <HomeTemplate>
        <Register />
      </HomeTemplate>
    ),
  },
  {
    path: PATHS.NOT_FOUND,
    element: (
      <HomeTemplate>
        <ErrorTemplate />
      </HomeTemplate>
    ),
  },
];

const AppRoutes: React.FC = () => {
  const element = useRoutes(routesConfig);
  return <Suspense fallback={<LoadingNew />}>{element}</Suspense>;
};

export default AppRoutes;
