import { type FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { settings, USER_LOGIN, APP_ROUTES } from "@cinefix/utils";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const userLoginState = useSelector((state: any) => state.UserSaga?.userLogin);
  const userCookie = settings.getCookieJson(USER_LOGIN);
  const user = userLoginState || userCookie;

  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (user.maLoaiNguoiDung !== "QuanTri") {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
