import { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export interface UserLoginResult {
  taiKhoan?: string;
  hoTen: string;
  accessToken: string;
  email?: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
}

export interface UserState {
  userLogin: UserLoginResult | null;
}
