// EN: Models a cinema system (chain), e.g. CGV, Lotte Cinema — Cybersoft's top-level
// grouping of cinema clusters. Field names are Vietnamese, mirroring the API.
// VI: Mô tả một hệ thống rạp (chuỗi rạp), VD: CGV, Lotte Cinema — cấp nhóm cao nhất
// của Cybersoft cho các cụm rạp. Tên trường là tiếng Việt, giữ nguyên theo API.
export interface ListCinema {
  lstCumRap: LstCumRap[]; // EN: list of cinema clusters in this system. VI: danh sách cụm rạp thuộc hệ thống này.
  maHeThongRap: string; // EN: cinema-system code. VI: mã hệ thống rạp.
  tenHeThongRap: string; // EN: cinema-system name. VI: tên hệ thống rạp.
  logo: string; // EN: cinema-system logo URL. VI: đường dẫn logo hệ thống rạp.
  mahom: string; // EN: group code (as returned by the API, note the API's own field name). VI: mã nhóm (theo tên trường của API).
}

// EN: Models a single cinema cluster (physical location) belonging to a cinema system.
// VI: Mô tả một cụm rạp (địa điểm vật lý) thuộc một hệ thống rạp.
export interface LstCumRap {
  danhSachPhim: DanhSachPhim[]; // EN: films currently scheduled at this cluster. VI: danh sách phim đang có lịch chiếu tại cụm rạp này.
  maCumRap: string; // EN: cinema-cluster code. VI: mã cụm rạp.
  tenCumRap: string; // EN: cinema-cluster name. VI: tên cụm rạp.
  hinhAnh: string; // EN: cinema-cluster image URL. VI: đường dẫn hình ảnh cụm rạp.
  diaChi: string; // EN: cinema-cluster address. VI: địa chỉ cụm rạp.
}

// EN: Models a film and its showtimes within a given cinema cluster.
// VI: Mô tả một phim và các suất chiếu của phim đó trong một cụm rạp.
export interface DanhSachPhim {
  lstLichChieuTheoPhim: LstLichChieuTheoPhim[]; // EN: showtimes for this film at this cluster. VI: danh sách suất chiếu của phim tại cụm rạp này.
  maPhim: number; // EN: film code. VI: mã phim.
  tenPhim: string; // EN: film title. VI: tên phim.
  hinhAnh: string; // EN: film poster image URL. VI: đường dẫn hình ảnh phim.
  hot: boolean; // EN: whether the film is flagged "hot". VI: cờ đánh dấu phim "hot".
  dangChieu: boolean; // EN: whether the film is currently showing. VI: cờ đánh dấu phim đang chiếu.
  sapChieu: boolean; // EN: whether the film is upcoming. VI: cờ đánh dấu phim sắp chiếu.
}

// EN: Models a single showtime for a film at a specific cinema room.
// VI: Mô tả một suất chiếu của phim tại một phòng rạp cụ thể.
export interface LstLichChieuTheoPhim {
  maLichChieu: number; // EN: showtime code. VI: mã lịch chiếu.
  maRap: string; // EN: cinema room code. VI: mã rạp (phòng chiếu).
  tenRap: string; // EN: cinema room name. VI: tên rạp (phòng chiếu).
  ngayChieuGioChieu: string; // EN: combined show date/time string, e.g. "10/08/2026 20:00:00". VI: chuỗi ngày giờ chiếu, VD: "10/08/2026 20:00:00".
  giaVe: number; // EN: ticket price. VI: giá vé.
}
