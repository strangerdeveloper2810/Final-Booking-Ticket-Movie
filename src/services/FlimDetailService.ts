import { http } from "util/setting";
class FilmDetailService {
  getFilmDetail = async (params: any) => {
    try {
      let res = await http.get(
        `/api/QuanLyPhim/LayThongTinPhim?MaPhim=${params}`
      );
      return res;
    } catch (error) {
      console.log("request failed", error);
    }
  };
}

const filmDetailServiceInstance = new FilmDetailService();

export default filmDetailServiceInstance;
