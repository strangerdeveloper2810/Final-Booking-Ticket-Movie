import get from "lodash/get";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingTicket, DanhSachGhe } from "./BookingTicketType";
import { initialBookingTicket } from "./BookingTicketConstants";
import { SEAT_HOLD_DURATION_MS } from "@cinefix/utils";

/**
 * EN: Redux state shape for the booking feature — the currently loaded
 * showtime/seat-map detail, the user's in-progress seat selection, booking
 * submission status, and the client-side seat-hold countdown deadline.
 * VI: Cấu trúc state Redux cho tính năng đặt vé — chi tiết lịch chiếu/sơ đồ
 * ghế đang được tải, lựa chọn ghế đang thực hiện của người dùng, trạng thái
 * gửi yêu cầu đặt vé, và thời hạn đếm ngược giữ ghế phía client.
 */
export type DanhSachGheDangDatItem = {
  taiKhoan: string;
  danhSachGhe: DanhSachGhe[];
  maLichChieu?: number | string;
};

export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
  danhSachGheDangDat: DanhSachGheDangDatItem[];
  isBooking: boolean;
  /**
   * EN: Epoch ms the current seat selection auto-releases at; null while nothing is held.
   * VI: Thời điểm (epoch ms) mà lựa chọn ghế hiện tại sẽ tự động được giải phóng; giá trị null khi không có ghế nào đang được giữ.
   */
  selectionExpiresAt: number | null;
};

const initialState: BookingState = {
  bookingDetail: initialBookingTicket,
  selectedSeats: [],
  danhSachGheDangDat: [],
  isBooking: false,
  selectionExpiresAt: null,
};

const BookingTicketReducer = createSlice({
  name: "Booking",
  initialState,
  reducers: {
    /**
     * EN: Stores the freshly fetched showtime + seat-map detail (from
     * `GET_TICKET_API`) into state.
     * VI: Lưu chi tiết lịch chiếu + sơ đồ ghế vừa tải xong (từ
     * `GET_TICKET_API`) vào state.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     * @param action - EN: action carrying the loaded `BookingTicket` detail. VI: action mang theo chi tiết `BookingTicket` vừa tải được.
     */
    getDetailBookingTicket: (
      state: BookingState,
      action: PayloadAction<BookingTicket>
    ) => {
      state.bookingDetail = get(action, "payload");
    },
    /**
     * EN: Resets all booking state back to its initial, empty shape. Called
     * when the user navigates away from the booking page so a stale
     * showtime/selection can't leak into the next visit.
     * VI: Đặt lại toàn bộ state đặt vé về trạng thái ban đầu, rỗng. Được gọi
     * khi người dùng rời khỏi trang đặt vé để tránh dữ liệu lịch chiếu/lựa
     * chọn cũ bị rò rỉ sang lượt truy cập tiếp theo.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     */
    removeDetailBookingTicket: (state: BookingState) => {
      state.bookingDetail = {};
      state.selectedSeats = [];
      state.danhSachGheDangDat = [];
      state.isBooking = false;
      state.selectionExpiresAt = null;
    },
    /**
     * EN: Adds a seat to (or removes it from) the user's current selection,
     * and manages the client-side seat-hold countdown that goes with it.
     * VI: Thêm một ghế vào (hoặc bỏ khỏi) lựa chọn hiện tại của người dùng,
     * đồng thời quản lý bộ đếm ngược giữ ghế phía client đi kèm.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     * @param action - EN: action carrying the seat being toggled. VI: action mang theo ghế đang được bật/tắt chọn.
     */
    toggleSelectSeat: (
      state: BookingState,
      action: PayloadAction<DanhSachGhe>
    ) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex((s) => s.maGhe === seat.maGhe);
      if (index !== -1) {
        state.selectedSeats.splice(index, 1);
      } else {
        // EN: Start (or resume) the hold timer from the first seat in this
        // EN: selection — picking additional seats doesn't push the deadline
        // EN: back, matching how most real ticketing platforms hold a seat.
        // VI: Bắt đầu (hoặc tiếp tục) bộ đếm giờ giữ ghế tính từ ghế đầu tiên
        // VI: trong lượt chọn này — việc chọn thêm ghế không đẩy lùi thời hạn,
        // VI: giống với cách hầu hết các nền tảng đặt vé thực tế giữ ghế.
        if (state.selectedSeats.length === 0) {
          state.selectionExpiresAt = Date.now() + SEAT_HOLD_DURATION_MS;
        }
        state.selectedSeats.push(seat);
      }
      if (state.selectedSeats.length === 0) {
        state.selectionExpiresAt = null;
      }
    },
    /**
     * EN: Clears the entire seat selection and cancels the hold countdown —
     * used after a successful booking and when the hold timer expires.
     * VI: Xóa toàn bộ lựa chọn ghế và hủy bộ đếm ngược giữ ghế — được dùng
     * sau khi đặt vé thành công và khi bộ đếm giờ giữ ghế hết hạn.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     */
    clearSelectedSeats: (state: BookingState) => {
      state.selectedSeats = [];
      state.selectionExpiresAt = null;
    },
    /**
     * EN: Applied whenever DatVeHub pushes "loadDanhSachGheDaDat" for the room
     * EN: the user is currently in (see BookingHub.saga.ts). Parses both the
     * EN: raw SignalR user array (`Array<{ taiKhoan, danhSachGhe, maLichChieu }>`)
     * EN: and standard seat object arrays, storing real-time held seats in
     * EN: `danhSachGheDangDat` and updating booked seat statuses.
     * VI: Được áp dụng mỗi khi DatVeHub phát (push) "loadDanhSachGheDaDat" cho
     * VI: phòng mà người dùng đang ở trong đó (xem BookingHub.saga.ts). Phân
     * VI: tích cả mảng người dùng SignalR thô (`Array<{ taiKhoan, danhSachGhe, maLichChieu }>`)
     * VI: lẫn mảng đối tượng ghế chuẩn, lưu các ghế đang giữ theo thời gian thực
     * VI: vào `danhSachGheDangDat` và cập nhật trạng thái ghế đã đặt.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     * @param action - EN: action carrying the SignalR realtime update payload. VI: action mang theo dữ liệu cập nhật theo thời gian thực từ SignalR.
     */
    applyRealtimeSeatUpdate: (
      state: BookingState,
      action: PayloadAction<any>
    ) => {
      const rawPayload = action.payload;
      if (!Array.isArray(rawPayload)) return;

      const parsedItems: DanhSachGheDangDatItem[] = [];
      const bookedSeatIds = new Set<number>();

      rawPayload.forEach((item) => {
        if (!item) return;
        // Direct seat object (e.g. from test or direct seat array payload)
        if ("maGhe" in item && typeof item.maGhe === "number") {
          bookedSeatIds.add(item.maGhe);
          return;
        }

        // SignalR loadDanhSachGheDaDat user broadcast payload object
        let seats: DanhSachGhe[] = [];
        if (typeof item.danhSachGhe === "string") {
          try {
            seats = JSON.parse(item.danhSachGhe);
          } catch {
            seats = [];
          }
        } else if (Array.isArray(item.danhSachGhe)) {
          seats = item.danhSachGhe;
        }

        if (Array.isArray(seats)) {
          parsedItems.push({
            taiKhoan: item.taiKhoan || "guest",
            danhSachGhe: seats,
            maLichChieu: item.maLichChieu,
          });
        }
      });

      state.danhSachGheDangDat = parsedItems;

      if (bookedSeatIds.size > 0 && "thongTinPhim" in state.bookingDetail) {
        state.bookingDetail.danhSachGhe = state.bookingDetail.danhSachGhe.map(
          (seat) => (bookedSeatIds.has(seat.maGhe) ? { ...seat, daDat: true } : seat)
        );
      }

      if (state.selectedSeats.length > 0 && bookedSeatIds.size > 0) {
        state.selectedSeats = state.selectedSeats.filter(
          (selected) => !bookedSeatIds.has(selected.maGhe)
        );
        if (state.selectedSeats.length === 0) {
          state.selectionExpiresAt = null;
        }
      }
    },
    /**
     * EN: Sets whether a booking submission is currently in flight, driving
     * the confirm button's loading spinner.
     * VI: Đặt trạng thái đang có yêu cầu đặt vé đang được gửi hay không, điều
     * khiển biểu tượng loading của nút xác nhận đặt vé.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     * @param action - EN: action carrying the new loading flag. VI: action mang theo cờ (flag) loading mới.
     */
    setBookingLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isBooking = action.payload;
    },
  },
});

/**
 * EN: Action creators for the booking slice (`getDetailBookingTicket`,
 * `toggleSelectSeat`, `applyRealtimeSeatUpdate`, etc.), dispatched from
 * `BookingTicket.tsx` and the booking sagas.
 * VI: Các action creator của slice đặt vé (`getDetailBookingTicket`,
 * `toggleSelectSeat`, `applyRealtimeSeatUpdate`, v.v.), được dispatch từ
 * `BookingTicket.tsx` và các saga đặt vé.
 */
export const BookingTicketAction = BookingTicketReducer.actions;
/**
 * EN: The booking feature's reducer, registered under the `Booking` key in the root store.
 * VI: Reducer của tính năng đặt vé, được đăng ký dưới khóa `Booking` trong store gốc.
 */
export default BookingTicketReducer.reducer;
