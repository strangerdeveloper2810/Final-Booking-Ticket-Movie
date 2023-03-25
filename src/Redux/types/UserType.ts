export const USER_LOGIN_API = "USER_LOGIN_API";

export const USER_REGISTER_API = "USER_REGISTER_API";

export interface UserLogin {
  taiKhoan: string;
  matKhau: string;
}

export interface UserRegister {
  taiKhoan: string;
  matKhau: string;
  email: string;
  soDt: string;
  maNhom: string;
  hoTen: string;
}
