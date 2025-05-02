interface UserLogin {
  taiKhoan: string;
  matKhau: string;
}

interface UserRegister {
  taiKhoan: string;
  matKhau: string;
  email: string;
  soDt: string;
  maNhom: string;
  hoTen: string;
}

export type { UserLogin, UserRegister }