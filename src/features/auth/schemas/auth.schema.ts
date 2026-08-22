import { z } from "zod";

export const loginSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

export const registerSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự!"),
  hoTen: z.string().min(1, "Vui lòng nhập họ và tên!"),
  email: z.string().min(1, "Vui lòng nhập email!").email("Email không đúng định dạng!"),
  soDt: z.string().min(1, "Vui lòng nhập số điện thoại!"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
