import get from "lodash/get";
import { UserLogin, UserRegister } from "../redux/UserType";
import { http } from "@cinefix/utils";

/**
 * EN: Thin wrapper around the Cybersoft `QuanLyNguoiDung` (user management)
 * endpoints. Both methods intentionally swallow errors and return a value
 * instead of throwing: the calling saga (UserSaga.ts) decides how to react
 * to a bad response, and it treats a returned string as an error message.
 * `get` is used everywhere here (instead of `response.data.content` /
 * `error.response.data.content`) because axios error objects don't
 * guarantee a `response` property (e.g. on network failure), so a plain
 * chain would throw a TypeError trying to read `.data` of `undefined`.
 * VI: Lớp bọc mỏng cho các endpoint `QuanLyNguoiDung` (quản lý người dùng)
 * của Cybersoft. Cả hai hàm cố ý nuốt lỗi và trả về giá trị thay vì throw:
 * saga gọi đến (UserSaga.ts) sẽ tự quyết định xử lý phản hồi lỗi, và coi một
 * chuỗi trả về là thông báo lỗi. `get` được dùng ở khắp nơi (thay vì
 * `response.data.content` / `error.response.data.content`) vì object lỗi
 * của axios không đảm bảo luôn có thuộc tính `response` (vd. khi mất mạng),
 * nên truy cập trực tiếp `.data` của `undefined` sẽ ném TypeError.
 */
const AuthServices = {
  /**
   * EN: Logs a user in. Returns the user object on success (statusCode 200),
   * the server's error string/content on failure, or `undefined` if the
   * response shape is unexpected.
   * VI: Đăng nhập người dùng. Trả về object người dùng khi thành công
   * (statusCode 200), trả về chuỗi/nội dung lỗi từ server khi thất bại, hoặc
   * `undefined` nếu cấu trúc phản hồi không như mong đợi.
   * @param values - EN: login credentials (`taiKhoan`/`matKhau`). VI: thông tin đăng nhập (`taiKhoan`/`matKhau`).
   * @returns EN: user data, an error string, or undefined. VI: dữ liệu người dùng, chuỗi lỗi, hoặc undefined.
   */
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

  /**
   * EN: Registers a new user. Same success/failure/undefined contract as
   * `login` above.
   * VI: Đăng ký người dùng mới. Cùng quy ước thành công/thất bại/undefined
   * như `login` ở trên.
   * @param values - EN: registration form data plus `maNhom`. VI: dữ liệu form đăng ký kèm `maNhom`.
   * @returns EN: user data, an error string, or undefined. VI: dữ liệu người dùng, chuỗi lỗi, hoặc undefined.
   */
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