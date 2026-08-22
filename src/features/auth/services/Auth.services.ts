import get from "lodash/get";
import { UserLogin, UserRegister } from "../redux/UserType";
import { http } from "shared/utils/setting";

const AuthServices = {
  login: async (values: UserLogin) => {
    try {
      const response = await http.post(`/QuanLyNguoiDung/DangNhap`, values);
      if (get(response, "data.statusCode") === 200) {
        return get(response, "data.content");
      }
    } catch (error: unknown) {
      return get(error, "response.data.content");
    }
  },

  register: async (values: UserRegister) => {
    try {
      const response = await http.post(`/QuanLyNguoiDung/DangKy`, values);
      if (get(response, "data.statusCode") === 200) {
        return get(response, "data.content");
      }
    } catch (error) {
      return get(error, "response.data.content");
    }
  },
};

export default AuthServices;