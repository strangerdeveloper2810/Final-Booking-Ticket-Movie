import { ReactNode } from "react";

/**
 * EN: Props for the shared two-column auth screen shell (movie showcase +
 * form panel) used by both the Login and Register pages.
 * VI: Props cho khung màn hình xác thực hai cột dùng chung (showcase phim +
 * khung form), được dùng bởi cả trang Đăng nhập và Đăng ký.
 */
export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * EN: Shape of the successful login/register response from the Cybersoft
 * API. Vietnamese field names mirror the API: `taiKhoan` = username,
 * `hoTen` = full name, `soDT` = phone number, `maLoaiNguoiDung` = user
 * role/type code (e.g. admin vs. customer).
 * VI: Cấu trúc phản hồi đăng nhập/đăng ký thành công từ API Cybersoft. Tên
 * trường giữ nguyên theo API: `taiKhoan` = tài khoản, `hoTen` = họ tên,
 * `soDT` = số điện thoại, `maLoaiNguoiDung` = mã loại người dùng (vd. quản
 * trị viên hay khách hàng).
 */
export interface UserLoginResult {
  taiKhoan?: string;
  hoTen: string;
  accessToken: string;
  email?: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
}

/**
 * EN: Redux slice state for the currently authenticated user. `null` means
 * no one is logged in; this is hydrated on app start from the `USER_LOGIN`
 * cookie so a page refresh doesn't log the user out.
 * VI: State của slice Redux cho người dùng đang đăng nhập. `null` nghĩa là
 * chưa đăng nhập; giá trị này được khôi phục lúc khởi động app từ cookie
 * `USER_LOGIN` để tải lại trang không làm mất phiên đăng nhập.
 */
export interface UserState {
  userLogin: UserLoginResult | null;
}
