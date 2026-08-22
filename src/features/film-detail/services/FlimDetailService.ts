import { http } from "shared/utils/setting";

class FilmDetailService {
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
