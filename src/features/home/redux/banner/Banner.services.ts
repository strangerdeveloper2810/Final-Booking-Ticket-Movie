import { http } from "@cinefix/utils";
import get from "lodash/get";

const BannerServices = {
  /**
   * EN: Fetches the promotional banner list from the Cybersoft API. Returns the response's
   * `content` array on success (status code 200), or `undefined` on any error/non-200 case
   * so the saga can decide how to handle the missing data.
   * VI: Lấy danh sách banner quảng cáo từ API Cybersoft. Trả về mảng `content` của response
   * khi thành công (statusCode 200), hoặc `undefined` khi lỗi/không phải 200 để saga tự
   * quyết định cách xử lý khi thiếu dữ liệu.
   * @returns EN: array of banners, or undefined. VI: mảng banner, hoặc undefined.
   */
  getAllBanner: async () => {
    try {
      const response = await http.get(`/QuanLyPhim/LayDanhSachBanner`);

      if (get(response, "data.statusCode") === 200) {
        return get(response, "data.content", []);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  },
};

export default BannerServices;