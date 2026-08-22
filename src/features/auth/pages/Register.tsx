import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Form, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { AppDispatch } from "app/store";
import { USER_REGISTER_API } from "../redux/UserConstants";
import { UserRegister } from "../redux/UserType";
import AuthLayout from "../components/AuthLayout";
import { GROUP_ID } from "shared/utils/setting";

const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = useCallback(
    (values: Omit<UserRegister, "maNhom">) => {
      const payload: UserRegister = {
        ...values,
        maNhom: GROUP_ID || "GP01",
      };
      dispatch({
        type: USER_REGISTER_API,
        payload,
      });
    },
    [dispatch]
  );

  return (
    <AuthLayout
      title="Đăng Ký Tài Khoản"
      subtitle="Tạo tài khoản mới để trải nghiệm đầy đủ tính năng của Cinefix."
    >
      <Form
        name="register_form"
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
            placeholder="Tài khoản đăng nhập"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item
          name="matKhau"
          label={<span className="text-[#F5F6FA] font-medium">Mật khẩu</span>}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#9AA0B4]" />}
            placeholder="Mật khẩu bảo mật"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item
          name="hoTen"
          label={<span className="text-[#F5F6FA] font-medium">Họ và tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input
            prefix={<IdcardOutlined className="text-[#9AA0B4]" />}
            placeholder="Nguyễn Văn A"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="text-[#F5F6FA] font-medium">Email</span>}
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-[#9AA0B4]" />}
            placeholder="example@gmail.com"
            className="bg-[#0B0D12] text-[#F5F6FA] border-[#262B3A] hover:border-[#F2545B] focus:border-[#F2545B]"
          />
        </Form.Item>

        <Form.Item
          name="soDt"
          label={<span className="text-[#F5F6FA] font-medium">Số điện thoại</span>}
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input
            prefix={<PhoneOutlined className="text-[#9AA0B4]" />}
            placeholder="0901234567"
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
            Tạo Tài Khoản
          </Button>
        </Form.Item>

        <div className="text-center text-sm text-[#9AA0B4] pt-2 border-t border-[#262B3A]">
          Đã có tài khoản?{" "}
          <NavLink
            to="/login"
            className="text-[#F2545B] hover:text-[#FF6B72] font-semibold ml-1"
          >
            Đăng nhập
          </NavLink>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register;
