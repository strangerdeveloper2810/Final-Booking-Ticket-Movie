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
          <label className="block text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-700 font-medium text-sm mb-1">
            {t("auth:account")}
          </label>
          <Controller
            name="taiKhoan"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<UserOutlined className="text-[#9AA0B4]" />}
                placeholder={t("auth:accountPlaceholder")}
                status={errors.taiKhoan ? "error" : ""}
                className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
              />
            )}
          />
          {errors.taiKhoan && (
            <p className="text-xs text-red-500 mt-1">{errors.taiKhoan.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-700 font-medium text-sm mb-1">
            {t("auth:password")}
          </label>
          <Controller
            name="matKhau"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined className="text-[#9AA0B4]" />}
                placeholder={t("auth:passwordPlaceholder")}
                status={errors.matKhau ? "error" : ""}
                className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
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
            className="bg-[#F2545B] hover:bg-[#FF6B72] font-semibold h-12 text-base shadow-lg shadow-[#F2545B]/30"
          >
            {t("auth:loginButton")}
          </Button>
        </div>

        <div className="text-center text-sm text-[#9AA0B4] pt-2 border-t border-[#262B3A]">
          {t("auth:noAccount")}{" "}
          <NavLink
            to={APP_ROUTES.REGISTER}
            className="text-[#F2545B] hover:text-[#FF6B72] font-semibold ml-1"
          >
            {t("auth:registerNow")}
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
