import { type FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Result, Button } from "antd";
import { useTranslation } from "react-i18next";
import { RootState } from "app/store";
import { APP_ROUTES } from "shared/constants/routes";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * EN: Guard component protecting Admin routes — verifies the logged-in user
 * has `maLoaiNguoiDung === "QuanTri"`. Redirects unauthenticated users to `/login`
 * and shows an access-denied screen for non-admin accounts.
 * VI: Component bảo vệ các tuyến đường Admin — xác thực người dùng đã đăng nhập
 * có `maLoaiNguoiDung === "QuanTri"`. Chuyển hướng người dùng chưa đăng nhập tới `/login`
 * và hiển thị màn hình từ chối truy cập cho tài khoản không phải Admin.
 */
const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);
  const { t } = useTranslation(["admin", "common"]);

  if (!userLogin || !userLogin.taiKhoan) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (userLogin.maLoaiNguoiDung !== "QuanTri") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-text-primary">
        <Result
          status="403"
          title={t("admin:accessDeniedTitle")}
          subTitle={t("admin:accessDeniedSub")}
          extra={
            <Button type="primary" href={APP_ROUTES.HOME}>
              {t("admin:backToHome")}
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
