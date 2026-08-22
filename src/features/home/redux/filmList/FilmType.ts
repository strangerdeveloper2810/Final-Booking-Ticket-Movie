// EN: Models a film as returned by Cybersoft's LayDanhSachPhim endpoint. Field names are
// Vietnamese, mirroring the API.
// VI: Mô tả một phim được trả về từ API LayDanhSachPhim của Cybersoft. Tên trường là
// tiếng Việt, giữ nguyên theo API.
export interface Film {
  maPhim: number; // EN: film code. VI: mã phim.
  tenPhim: string; // EN: film title. VI: tên phim.
  biDanh: string; // EN: film slug/alias used in URLs. VI: biệt danh (slug) của phim dùng trong URL.
  trailer: string; // EN: trailer video URL. VI: đường dẫn video trailer.
  hinhAnh: string; // EN: poster image URL. VI: đường dẫn hình ảnh poster.
  moTa: string; // EN: description/synopsis. VI: mô tả nội dung phim.
  maNhom: string; // EN: group code (Cybersoft class/group identifier). VI: mã nhóm (định danh lớp/nhóm của Cybersoft).
  ngayKhoiChieu: string; // EN: release date. VI: ngày khởi chiếu.
  danhGia: number; // EN: rating score. VI: điểm đánh giá.
  hot: boolean; // EN: whether the film is flagged "hot". VI: cờ đánh dấu phim "hot".
  dangChieu: boolean; // EN: whether the film is currently showing. VI: cờ đánh dấu phim đang chiếu.
  sapChieu: boolean; // EN: whether the film is upcoming. VI: cờ đánh dấu phim sắp chiếu.
}
