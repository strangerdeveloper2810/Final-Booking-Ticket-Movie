/**
 * EN: The full seat-booking detail for one showtime, as returned by the
 * `LayDanhSachPhongVe` REST endpoint — pairs the showtime/movie metadata with
 * the current seat map.
 * VI: Toàn bộ thông tin đặt vé cho một lịch chiếu, được trả về từ API REST
 * `LayDanhSachPhongVe` — gồm thông tin lịch chiếu/phim đi kèm với sơ đồ ghế
 * hiện tại.
 */
export interface BookingTicket {
  /** EN: Movie/showtime/cinema metadata for this booking screen. VI: Thông tin phim/lịch chiếu/rạp cho màn hình đặt vé này. */
  thongTinPhim: ThongTinPhim;
  /** EN: The current seat map for this showtime. VI: Sơ đồ ghế hiện tại của lịch chiếu này. */
  danhSachGhe: DanhSachGhe[];
}

/**
 * EN: A single seat in a showtime's seat map — models both static seat info
 * (code, name, type, price) and its live occupancy state (whether it's
 * already booked, and by whom).
 * VI: Một ghế trong sơ đồ ghế của lịch chiếu — mô tả cả thông tin tĩnh của
 * ghế (mã, tên, loại, giá) lẫn trạng thái đang chiếm chỗ theo thời gian thực
 * (đã được đặt hay chưa, và ai đã đặt).
 */
export interface DanhSachGhe {
  /** EN: Unique seat code/id, used as the merge key for realtime updates. VI: Mã ghế duy nhất, dùng làm khóa để hợp nhất dữ liệu khi cập nhật theo thời gian thực. */
  maGhe: number;
  /** EN: Human-readable seat label shown on the seat button (e.g. "A1"). VI: Tên ghế hiển thị trên nút bấm chọn ghế (ví dụ: "A1"). */
  tenGhe: string;
  /** EN: Id of the theater/room ("rạp") this seat belongs to. VI: Mã rạp/phòng chiếu mà ghế này thuộc về. */
  maRap: number;
  /** EN: Seat type/tier (e.g. "Thuong" standard, "Vip"), drives seat styling and pricing. VI: Loại/hạng ghế (ví dụ: "Thuong" là ghế thường, "Vip" là ghế VIP), quyết định màu sắc hiển thị và giá vé. */
  loaiGhe: string;
  /** EN: Sequence/order number for the seat as a string, as provided by the API. VI: Số thứ tự của ghế dưới dạng chuỗi, theo đúng định dạng API trả về. */
  stt: string;
  /** EN: Ticket price for this seat, in VNĐ. VI: Giá vé của ghế này, tính bằng VNĐ. */
  giaVe: number;
  /** EN: Whether this seat is already booked (by anyone) — true seats are rendered as occupied and are not selectable. VI: Ghế này đã được đặt hay chưa (bởi bất kỳ ai) — ghế có giá trị true sẽ hiển thị là đã có người đặt và không thể chọn. */
  daDat: boolean;
  /** EN: Username of whoever booked this seat, or null if it's still free. VI: Tên tài khoản của người đã đặt ghế này, hoặc null nếu ghế vẫn còn trống. */
  taiKhoanNguoiDat: string | null;
}

/**
 * EN: Movie + showtime + cinema metadata shown on the booking page header and summary card.
 * VI: Thông tin phim + lịch chiếu + rạp chiếu, hiển thị ở phần đầu trang và thẻ tóm tắt của trang đặt vé.
 */
export interface ThongTinPhim {
  /** EN: Id of the showtime being booked. VI: Mã lịch chiếu đang được đặt vé. */
  maLichChieu: number;
  /** EN: Name of the cinema complex (e.g. "CGV", "BHD Star"). VI: Tên cụm rạp (ví dụ: "CGV", "BHD Star"). */
  tenCumRap: string;
  /** EN: Name of the specific theater/room within the complex. VI: Tên rạp/phòng chiếu cụ thể trong cụm rạp. */
  tenRap: string;
  /** EN: Street address of the cinema complex. VI: Địa chỉ của cụm rạp. */
  diaChi: string;
  /** EN: Movie title. VI: Tên phim. */
  tenPhim: string;
  /** EN: URL of the movie poster image. VI: Đường dẫn hình ảnh poster phim. */
  hinhAnh: string;
  /** EN: Show date, as formatted by the API. VI: Ngày chiếu, theo định dạng do API trả về. */
  ngayChieu: string;
  /** EN: Show time, as formatted by the API. VI: Giờ chiếu, theo định dạng do API trả về. */
  gioChieu: string;
}
