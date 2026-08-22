import { http } from "shared/utils/setting";

/**
 * EN: Request body shape for the `DatVe` (book ticket) REST endpoint — the
 * showtime being booked plus the list of seats (id + price) selected by the
 * user.
 * VI: Cấu trúc dữ liệu gửi lên API `DatVe` (đặt vé) — gồm lịch chiếu đang
 * được đặt và danh sách ghế (mã ghế + giá vé) mà người dùng đã chọn.
 */
export interface TicketBookingPayload {
  /** EN: Id of the showtime being booked. VI: Mã lịch chiếu đang được đặt vé. */
  maLichChieu: number;
  /** EN: The seats being booked, as minimal (id, price) pairs expected by the API. VI: Danh sách ghế được đặt, ở dạng tối giản (mã ghế, giá vé) theo đúng yêu cầu của API. */
  danhSachVe: Array<{
    maGhe: number;
    giaVe: number;
  }>;
}

/**
 * EN: REST client for the booking feature — thin wrappers around the
 * `QuanLyDatVe` (ticket management) endpoints on the Cybersoft API.
 * VI: Client gọi REST cho tính năng đặt vé — các hàm bọc mỏng (thin wrapper)
 * xung quanh các endpoint `QuanLyDatVe` (quản lý đặt vé) của API Cybersoft.
 */
const BookingTicketService = {
  /**
   * EN: Fetches the seat map and showtime/movie metadata for a given showtime.
   * VI: Lấy sơ đồ ghế và thông tin lịch chiếu/phim cho một lịch chiếu cụ thể.
   * @param maLichChieu - EN: the showtime id to fetch seats for. VI: mã lịch chiếu cần lấy thông tin ghế.
   * @returns EN: the raw HTTP response containing the booking detail payload. VI: phản hồi HTTP thô chứa dữ liệu chi tiết đặt vé.
   */
  getDetailBookingTicket: async (maLichChieu: string | number) => {
    return await http.get(`/QuanLyDatVe/LayDanhSachPhongVe`, {
      params: { maLichChieu },
    });
  },

  /**
   * EN: Submits a booking request for the selected seats.
   * VI: Gửi yêu cầu đặt vé cho các ghế đã chọn.
   * @param payload - EN: the showtime and seats being booked. VI: lịch chiếu và danh sách ghế đang được đặt.
   * @returns EN: the raw HTTP response from the booking endpoint. VI: phản hồi HTTP thô từ endpoint đặt vé.
   */
  bookTicket: async (payload: TicketBookingPayload) => {
    return await http.post(`/QuanLyDatVe/DatVe`, payload);
  },
};

export default BookingTicketService;
