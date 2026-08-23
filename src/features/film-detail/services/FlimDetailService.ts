import { http } from "@cinefix/utils";

// EN: Thin wrapper around the Cybersoft "QuanLyPhim" (film management) API. This is a plain
// class instantiated as a singleton below, not a Redux slice/thunk — Detail.tsx calls this
// directly from a component-level useEffect and stores the result in local useState. See the
// note in Detail.tsx for why this bypasses Redux despite a redux/types folder existing for this
// feature.
// VI: Lớp bọc mỏng (wrapper) cho API "QuanLyPhim" (quản lý phim) của Cybersoft. Đây là một class
// thuần, được khởi tạo thành singleton bên dưới, không phải Redux slice/thunk — Detail.tsx gọi
// trực tiếp từ useEffect của component và lưu kết quả vào useState cục bộ. Xem ghi chú trong
// Detail.tsx để biết lý do bỏ qua Redux dù đã có thư mục redux/types cho tính năng này.
class FilmDetailService {
  /**
   * EN: Fetches the detail info for a single film by its id.
   * VI: Lấy thông tin chi tiết của một phim theo mã phim.
   * @param params - EN: query params for the request; expected shape `{ maPhim: string | number }`. VI: tham số truy vấn của request; dạng dữ liệu mong đợi `{ maPhim: string | number }`.
   * @returns EN: the axios response, or `undefined` if the request throws (the error is caught and only logged, not re-thrown — callers should defensively check the result). VI: response từ axios, hoặc `undefined` nếu request lỗi (lỗi được bắt và chỉ log ra, không throw lại — nơi gọi cần tự kiểm tra kết quả trả về).
   */
  getFilmDetail = async (params: any) => {
    try {
      let res = await http.get(`/QuanLyPhim/LayThongTinPhim`, { params });
      return res;
    } catch (error) {
      console.log("request failed", error);
    }
  };
}

const filmDetailServiceInstance = new FilmDetailService();
export default filmDetailServiceInstance;
