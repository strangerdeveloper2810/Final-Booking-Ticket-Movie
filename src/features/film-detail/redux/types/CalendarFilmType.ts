// EN: These interfaces mirror the shape of Cybersoft's "LayThongTinLichChieuPhim" API response
// (Vietnamese-named fields), modeling a film's full showtime schedule as a 3-level hierarchy:
// cinema chain (HeThongRapChieu) -> cinema cluster/location (CumRapChieu) -> individual showtime
// (LichChieuPhim). Field names are kept as-is (not translated) to match the API contract exactly.
// VI: Các interface này phản ánh đúng cấu trúc dữ liệu trả về từ API "LayThongTinLichChieuPhim"
// của Cybersoft (tên trường bằng tiếng Việt), mô hình hóa lịch chiếu đầy đủ của một phim theo 3
// cấp: hệ thống rạp (HeThongRapChieu) -> cụm rạp/chi nhánh (CumRapChieu) -> suất chiếu cụ thể
// (LichChieuPhim). Tên trường được giữ nguyên (không dịch) để khớp chính xác với hợp đồng API.
export interface CalendarMovieTheaterFilm {
  heThongRapChieu: HeThongRapChieu[]; // EN: list of cinema chains showing this film. VI: danh sách hệ thống rạp đang chiếu phim này.
  maPhim: number; // EN: film id. VI: mã phim.
  tenPhim: string; // EN: film name. VI: tên phim.
  biDanh: string; // EN: URL-friendly slug of the film name. VI: bí danh (slug) của phim, dùng cho URL.
  trailer: string; // EN: trailer video URL. VI: đường dẫn video trailer.
  hinhAnh: string; // EN: poster/thumbnail image URL. VI: đường dẫn hình ảnh/poster phim.
  moTa: string; // EN: film synopsis/description. VI: mô tả nội dung phim.
  maNhom: string; // EN: group id assigned by Cybersoft (multi-tenant API key grouping). VI: mã nhóm do Cybersoft cấp (dùng phân nhóm theo API key).
  hot: boolean; // EN: whether the film is flagged as trending/hot. VI: phim có đang là phim "hot" hay không.
  dangChieu: boolean; // EN: whether the film is currently showing. VI: phim có đang chiếu hay không.
  sapChieu: boolean; // EN: whether the film is upcoming/not yet released. VI: phim có sắp chiếu hay không.
  ngayKhoiChieu: string; // EN: release date. VI: ngày khởi chiếu.
  danhGia: number; // EN: rating score (out of 10). VI: điểm đánh giá (thang điểm 10).
}

// EN: One cinema chain/brand (e.g. CGV, Lotte) and all of its clusters showing the film.
// VI: Một hệ thống/thương hiệu rạp (vd: CGV, Lotte) cùng toàn bộ cụm rạp đang chiếu phim.
export interface HeThongRapChieu {
  cumRapChieu: CumRapChieu[]; // EN: cinema clusters/locations belonging to this chain. VI: các cụm rạp thuộc hệ thống rạp này.
  maHeThongRap: string; // EN: cinema chain id. VI: mã hệ thống rạp.
  tenHeThongRap: string; // EN: cinema chain name. VI: tên hệ thống rạp.
  logo: string; // EN: chain logo image URL. VI: đường dẫn logo hệ thống rạp.
}

// EN: One physical cinema cluster/location and its showtimes for the film.
// VI: Một cụm rạp/chi nhánh vật lý cùng các suất chiếu của phim tại đó.
export interface CumRapChieu {
  lichChieuPhim: LichChieuPhim[]; // EN: showtimes available at this cluster. VI: các suất chiếu tại cụm rạp này.
  maCumRap: string; // EN: cluster id. VI: mã cụm rạp.
  tenCumRap: string; // EN: cluster/location name. VI: tên cụm rạp.
  hinhAnh: string; // EN: cluster image URL (falls back to chain logo in the UI when empty). VI: đường dẫn hình ảnh cụm rạp (giao diện dùng logo hệ thống rạp khi trống).
  diaChi: string; // EN: cluster address. VI: địa chỉ cụm rạp.
}

// EN: A single bookable showtime.
// VI: Một suất chiếu cụ thể có thể đặt vé.
export interface LichChieuPhim {
  maLichChieu: string; // EN: showtime id, used to start the booking flow. VI: mã lịch chiếu, dùng để bắt đầu luồng đặt vé.
  maRap: string; // EN: screen/room id. VI: mã rạp (phòng chiếu).
  tenRap: string; // EN: screen/room name. VI: tên rạp (phòng chiếu).
  ngayChieuGioChieu: string; // EN: raw "date + time" string from the API, parsed via parseScheduleMovie(). VI: chuỗi "ngày giờ chiếu" thô từ API, được xử lý qua parseScheduleMovie().
  giaVe: number; // EN: ticket price. VI: giá vé.
  thoiLuong: number; // EN: film duration in minutes. VI: thời lượng phim (phút).
}
