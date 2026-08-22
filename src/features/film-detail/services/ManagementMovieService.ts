import { http } from "shared/utils/setting";

// EN: Thin wrapper around the Cybersoft "QuanLyRap" (cinema management) API. Like
// FlimDetailService, this is a plain class/singleton called directly from Detail.tsx's
// useEffect rather than through Redux — see the note in Detail.tsx for context on this
// architectural inconsistency.
// VI: Lớp bọc mỏng (wrapper) cho API "QuanLyRap" (quản lý rạp) của Cybersoft. Giống
// FlimDetailService, đây là class/singleton thuần được gọi trực tiếp từ useEffect trong
// Detail.tsx thay vì qua Redux — xem ghi chú trong Detail.tsx để biết thêm về điểm không nhất
// quán trong kiến trúc này.
class ManagementMovieService {
  /**
   * EN: Fetches the full cinema/showtime schedule for a single film by its id.
   * VI: Lấy toàn bộ lịch chiếu (theo hệ thống rạp/cụm rạp) của một phim theo mã phim.
   * @param params - EN: query params for the request; expected shape `{ maPhim: string | number }`. VI: tham số truy vấn của request; dạng dữ liệu mong đợi `{ maPhim: string | number }`.
   * @returns EN: the axios response, or `undefined` if the request throws (the error is caught and only logged, not re-thrown — callers should defensively check the result). VI: response từ axios, hoặc `undefined` nếu request lỗi (lỗi được bắt và chỉ log ra, không throw lại — nơi gọi cần tự kiểm tra kết quả trả về).
   */
  getInfoCanlendarFilm = async (params: any) => {
    try {
      let res = await http.get(`/QuanLyRap/LayThongTinLichChieuPhim`, {
        params,
      });
      return res;
    } catch (error) {
      console.log("request failed", error);
    }
  };
}

const managementServiceInstance = new ManagementMovieService();
export default managementServiceInstance;
