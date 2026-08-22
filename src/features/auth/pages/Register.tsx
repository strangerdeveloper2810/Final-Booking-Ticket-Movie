import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "app/store";
import { USER_REGISTER_API } from "../redux/UserConstants";
import { UserRegister } from "../redux/UserType";
import AuthLayout from "../components/AuthLayout";
import { GROUP_ID } from "shared/utils/setting";
import { APP_ROUTES } from "shared/constants/routes";
import { registerSchema, RegisterFormData } from "../schemas/auth.schema";
import SEO from "shared/components/SEO/SEO";

const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["auth", "common"]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDt: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const payload: UserRegister = {
      ...data,
      maNhom: GROUP_ID,
    };
    dispatch({
      type: USER_REGISTER_API,
      payload,
    });
  };

  return (
    <AuthLayout
      title={t("auth:registerTitle")}
      subtitle={t("auth:registerSubtitle")}
    >
      <SEO
        title="Đăng Ký Tài Khoản - Cinefix"
        description="Đăng ký tài khoản Cinefix để đặt vé xem phim chiếu rạp với nhiều ưu đãi hấp dẫn."
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

        <div>
          <label className="block text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-700 font-medium text-sm mb-1">
            {t("auth:fullName")}
          </label>
          <Controller
            name="hoTen"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<IdcardOutlined className="text-[#9AA0B4]" />}
                placeholder="Nguyễn Văn A"
                status={errors.hoTen ? "error" : ""}
                className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
              />
            )}
          />
          {errors.hoTen && (
            <p className="text-xs text-red-500 mt-1">{errors.hoTen.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-700 font-medium text-sm mb-1">
            {t("auth:email")}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<MailOutlined className="text-[#9AA0B4]" />}
                placeholder="example@gmail.com"
                status={errors.email ? "error" : ""}
                className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-700 font-medium text-sm mb-1">
            {t("auth:phone")}
          </label>
          <Controller
            name="soDt"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<PhoneOutlined className="text-[#9AA0B4]" />}
                placeholder="0901234567"
                status={errors.soDt ? "error" : ""}
                className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
              />
            )}
          />
          {errors.soDt && (
            <p className="text-xs text-red-500 mt-1">{errors.soDt.message}</p>
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
            {t("auth:registerButton")}
          </Button>
        </div>

        <div className="text-center text-sm text-[#9AA0B4] pt-2 border-t border-[#262B3A]">
          {t("auth:alreadyHaveAccount")}{" "}
          <NavLink
            to={APP_ROUTES.LOGIN}
            className="text-[#F2545B] hover:text-[#FF6B72] font-semibold ml-1"
          >
            {t("auth:login")}
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
