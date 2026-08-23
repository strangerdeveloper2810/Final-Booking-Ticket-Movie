import { type FC } from "react";
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
import { APP_ROUTES } from "@cinefix/utils";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { SEO } from "@cinefix/ui";

/**
 * EN: Login page. Uses `react-hook-form` + zod (`loginSchema`) for
 * validation, but wraps every field in `Controller` instead of calling
 * `register()` directly: antd's `Input`/`Input.Password` are controlled
 * components (they need a `value`/`onChange` pair driven by React state),
 * whereas `register()` is built for uncontrolled/ref-based native
 * `<input>` elements. `Controller` bridges the two by handing antd's props
 * through `field`. Submitting doesn't call an API directly — it dispatches
 * a plain `{ type: USER_LOGIN_API, payload }` action that `actionLoginSaga`
 * (see UserSaga.ts) is watching for via `takeLatest`.
 * VI: Trang Đăng nhập. Dùng `react-hook-form` + zod (`loginSchema`) để
 * validate, nhưng bọc mỗi trường trong `Controller` thay vì gọi `register()`
 * trực tiếp: `Input`/`Input.Password` của antd là component có kiểm soát
 * (controlled — cần cặp `value`/`onChange` do state React điều khiển),
 * trong khi `register()` được thiết kế cho `<input>` gốc không kiểm soát
 * (uncontrolled, dùng ref). `Controller` là cầu nối, truyền props của antd
 * qua đối tượng `field`. Việc submit không gọi API trực tiếp — nó dispatch
 * một action thuần `{ type: USER_LOGIN_API, payload }` mà `actionLoginSaga`
 * (xem UserSaga.ts) đang lắng nghe qua `takeLatest`.
 * @returns EN: the rendered login form inside `AuthLayout`. VI: form đăng nhập đã render bên trong `AuthLayout`.
 */
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
        title={t("auth:loginSeoTitle")}
        description={t("auth:loginSeoDesc")}
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
