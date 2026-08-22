import { http } from "shared/utils/setting";

export interface TicketBookingPayload {
  maLichChieu: number;
  danhSachVe: Array<{
    maGhe: number;
    giaVe: number;
  }>;
}

const BookingTicketService = {
  getDetailBookingTicket: async (maLichChieu: string | number) => {
    return await http.get(`/QuanLyDatVe/LayDanhSachPhongVe`, {
      params: { maLichChieu },
    });
  },

  bookTicket: async (payload: TicketBookingPayload) => {
    return await http.post(`/QuanLyDatVe/DatVe`, payload);
  },
};

export default BookingTicketService;
