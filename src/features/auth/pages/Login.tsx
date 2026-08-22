import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "app/store";
import { USER_LOGIN_API } from "../redux/UserConstants";
import AuthLayout from "../components/AuthLayout";
import { APP_ROUTES } from "shared/constants/routes";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import SEO from "shared/components/SEO/SEO";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["auth", "common"]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch({
      type: USER_LOGIN_API,
      payload: data,
    });
  };

  return (
    <AuthLayout
      title={t("auth:loginTitle")}
      subtitle={t("auth:loginSubtitle")}
    >
      <SEO
        title="Đăng Nhập - Cinefix"
        description="Đăng nhập tài khoản Cinefix để thực hiện đặt vé phim chiếu rạp nhanh chóng."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-text-primary font-medium text-sm mb-1">
            {t("auth:account")}
          </label>
          <Controller
            name="taiKhoan"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<UserOutlined className="text-text-secondary" />}
                placeholder={t("auth:accountPlaceholder")}
                status={errors.taiKhoan ? "error" : ""}
                className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
              />
            )}
          />
          {errors.taiKhoan && (
            <p className="text-xs text-red-500 mt-1">{errors.taiKhoan.message}</p>
          )}
        </div>

        <div>
          <label className="block text-text-primary font-medium text-sm mb-1">
            {t("auth:password")}
          </label>
          <Controller
            name="matKhau"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined className="text-text-secondary" />}
                placeholder={t("auth:passwordPlaceholder")}
                status={errors.matKhau ? "error" : ""}
                className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
              />
            )}
          />
          {errors.matKhau && (
            <p className="text-xs text-red-500 mt-1">{errors.matKhau.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            className="bg-primary hover:bg-primary-hover font-semibold h-12 text-base shadow-lg shadow-primary/30 border-none"
          >
            {t("auth:loginButton")}
          </Button>
        </div>

        <div className="text-center text-sm text-text-secondary pt-2 border-t border-border">
          {t("auth:noAccount")}{" "}
          <NavLink
            to={APP_ROUTES.REGISTER}
            className="text-primary hover:text-primary-hover font-semibold ml-1"
          >
            {t("auth:registerNow")}
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
