import { type FC } from "react";
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

/**
 * EN: Registration page. Same `Controller`-per-field pattern as Login.tsx
 * and for the same reason: antd's `Input`/`Input.Password` are controlled
 * components, so `react-hook-form`'s uncontrolled `register()` API doesn't
 * fit them directly — `Controller` supplies the `value`/`onChange` pair via
 * `field`. `maNhom` (the Cybersoft group/cohort code) isn't a form field —
 * it's appended to the validated form data at submit time from `GROUP_ID`,
 * since every account created by this app must belong to the same group.
 * VI: Trang Đăng ký. Cùng kiểu bọc `Controller` cho từng trường như
 * Login.tsx và cùng lý do: `Input`/`Input.Password` của antd là component
 * có kiểm soát nên API `register()` không kiểm soát của `react-hook-form`
 * không dùng trực tiếp được — `Controller` cung cấp cặp `value`/`onChange`
 * qua `field`. `maNhom` (mã nhóm Cybersoft) không phải là trường nhập liệu
 * — nó được thêm vào dữ liệu form đã validate lúc submit, lấy từ
 * `GROUP_ID`, vì mọi tài khoản tạo bởi app này phải thuộc cùng một nhóm.
 * @returns EN: the rendered registration form inside `AuthLayout`. VI: form đăng ký đã render bên trong `AuthLayout`.
 */
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
        title={t("auth:registerSeoTitle")}
        description={t("auth:registerSeoDesc")}
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

        <div>
          <label className="block text-text-primary font-medium text-sm mb-1">
            {t("auth:fullName")}
          </label>
          <Controller
            name="hoTen"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<IdcardOutlined className="text-text-secondary" />}
                placeholder="Nguyễn Văn A"
                status={errors.hoTen ? "error" : ""}
                className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
              />
            )}
          />
          {errors.hoTen && (
            <p className="text-xs text-red-500 mt-1">{errors.hoTen.message}</p>
          )}
        </div>

        <div>
          <label className="block text-text-primary font-medium text-sm mb-1">
            {t("auth:email")}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<MailOutlined className="text-text-secondary" />}
                placeholder="example@gmail.com"
                status={errors.email ? "error" : ""}
                className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-text-primary font-medium text-sm mb-1">
            {t("auth:phone")}
          </label>
          <Controller
            name="soDt"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<PhoneOutlined className="text-text-secondary" />}
                placeholder="0901234567"
                status={errors.soDt ? "error" : ""}
                className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
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
            className="bg-primary hover:bg-primary-hover font-semibold h-12 text-base shadow-lg shadow-primary/30 border-none"
          >
            {t("auth:registerButton")}
          </Button>
        </div>

        <div className="text-center text-sm text-text-secondary pt-2 border-t border-border">
          {t("auth:alreadyHaveAccount")}{" "}
          <NavLink
            to={APP_ROUTES.LOGIN}
            className="text-primary hover:text-primary-hover font-semibold ml-1"
          >
            {t("auth:login")}
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
