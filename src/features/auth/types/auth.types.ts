import { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export interface UserLoginResult {
  hoTen: string;
  accessToken: string;
  email?: string;
}

export interface UserState {
  userLogin: UserLoginResult | null;
}
