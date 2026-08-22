/**
 * EN: Login credentials sent to the Cybersoft API. Field names mirror the API's
 * Vietnamese naming: `taiKhoan` = username/account, `matKhau` = password.
 * VI: Thông tin đăng nhập gửi lên API Cybersoft. Tên trường theo đúng API gốc:
 * `taiKhoan` = tài khoản, `matKhau` = mật khẩu.
 */
interface UserLogin {
  taiKhoan: string;
  matKhau: string;
}

/**
 * EN: Registration payload sent to the Cybersoft API. `soDt` = phone number,
 * `maNhom` = group/cohort code (required by the API to associate the new
 * account with this app's student group), `hoTen` = full name.
 * VI: Dữ liệu đăng ký gửi lên API Cybersoft. `soDt` = số điện thoại,
 * `maNhom` = mã nhóm (API yêu cầu để gắn tài khoản mới vào nhóm học viên của
 * ứng dụng này), `hoTen` = họ và tên.
 */
interface UserRegister {
  taiKhoan: string;
  matKhau: string;
  email: string;
  soDt: string;
  maNhom: string;
  hoTen: string;
}

export type { UserLogin, UserRegister }