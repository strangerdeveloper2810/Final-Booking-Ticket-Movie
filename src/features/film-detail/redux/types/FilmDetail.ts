// EN: Mirrors Cybersoft's "LayThongTinPhim" API response for a single film (Vietnamese-named
// fields kept as-is to match the API contract). Used to render the film-detail page's hero
// section (poster, title, rating, synopsis, trailer) independently from the showtime schedule
// data in CalendarFilmType.ts.
// VI: Phản ánh đúng dữ liệu trả về từ API "LayThongTinPhim" của Cybersoft cho một phim (tên
// trường tiếng Việt được giữ nguyên để khớp với API). Dùng để hiển thị phần đầu trang chi tiết
// phim (poster, tên phim, đánh giá, mô tả, trailer), tách biệt với dữ liệu lịch chiếu ở
// CalendarFilmType.ts.
export interface FilmDetail {
  maPhim: number; // EN: film id. VI: mã phim.
  tenPhim: string; // EN: film name. VI: tên phim.
  biDanh: string; // EN: URL-friendly slug of the film name. VI: bí danh (slug) của phim, dùng cho URL.
  trailer: string; // EN: trailer video URL (a standard "watch?v=" YouTube link, converted to an "embed/" link for the modal player). VI: đường dẫn video trailer (link YouTube dạng "watch?v=", được chuyển thành link "embed/" khi hiển thị trong modal).
  hinhAnh: string; // EN: poster/backdrop image URL. VI: đường dẫn hình ảnh/poster phim.
  moTa: string; // EN: film synopsis/description. VI: mô tả nội dung phim.
  maNhom: string; // EN: group id assigned by Cybersoft (multi-tenant API key grouping). VI: mã nhóm do Cybersoft cấp (dùng phân nhóm theo API key).
  hot: boolean; // EN: whether the film is flagged as trending/hot. VI: phim có đang là phim "hot" hay không.
  dangChieu: boolean; // EN: whether the film is currently showing. VI: phim có đang chiếu hay không.
  sapChieu: boolean; // EN: whether the film is upcoming/not yet released. VI: phim có sắp chiếu hay không.
  ngayKhoiChieu: string; // EN: release date. VI: ngày khởi chiếu.
  danhGia: number; // EN: rating score (out of 10) — note there is no separate "number of votes" field from this API. VI: điểm đánh giá (thang điểm 10) — lưu ý API này không có trường "số lượt đánh giá" riêng.
}
