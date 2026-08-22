import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AppDispatch } from "app/store";
import { USER_LOGIN_API } from "../redux/UserConstants";
import { UserLogin } from "../redux/UserType";
import AuthLayout from "../components/AuthLayout";
import { APP_ROUTES } from "shared/constants/routes";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = useCallback(
    (values: UserLogin) => {
      dispatch({
        type: USER_LOGIN_API,
        payload: values,
      });
    },
    [dispatch]
  );

  return (
    <AuthLayout
      title="Đăng Nhập"
      subtitle="Chào mừng bạn trở lại! Nhập thông tin đăng nhập để tiếp tục."
    >
      <Form
        name="login_form"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="taiKhoan"
          label={<span className="text-[#F5F6FA] font-medium">Tài khoản</span>}
          rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-[#9AA0B4]" />}
            placeholder="Nhập tài khoản"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item
          name="matKhau"
          label={<span className="text-[#F5F6FA] font-medium">Mật khẩu</span>}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#9AA0B4]" />}
            placeholder="Nhập mật khẩu"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item className="mt-6 mb-4">
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-[#F2545B] hover:bg-[#FF6B72] font-semibold h-12 text-base shadow-lg shadow-[#F2545B]/30"
          >
            Đăng Nhập
          </Button>
        </Form.Item>

        <div className="text-center text-sm text-[#9AA0B4] pt-2 border-t border-[#262B3A]">
          Chưa có tài khoản?{" "}
          <NavLink
            to={APP_ROUTES.REGISTER}
            className="text-[#F2545B] hover:text-[#FF6B72] font-semibold ml-1"
          >
            Đăng ký ngay
          </NavLink>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;
