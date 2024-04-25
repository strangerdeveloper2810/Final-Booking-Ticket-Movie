import { http } from "util/setting";
class ManagementMovieService {
  getInfoCanlendarFilm = async (params: any) => {
    try {
      let res = await http.get(`/api/QuanLyRap/LayThongTinLichChieuPhim`, {
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
