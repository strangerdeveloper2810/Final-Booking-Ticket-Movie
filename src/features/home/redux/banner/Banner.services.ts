import { http } from "shared/utils/setting";
import get from "lodash/get";

const BannerServices = {
  getAllBanner: async () => {
    try {
      const response = await http.get(`/api/QuanLyPhim/LayDanhSachBanner`);

      if (get(response, "data.statusCode") === 200) {
        return get(response, "data.content", []);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  },
};

export default BannerServices;