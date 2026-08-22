import get from "lodash/get";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingTicket, DanhSachGhe } from "./BookingTicketType";
import { initialBookingTicket } from "./BookingTicketConstants";
import { SEAT_HOLD_DURATION_MS } from "shared/constants/appConstants";

/**
 * EN: Redux state shape for the booking feature — the currently loaded
 * showtime/seat-map detail, the user's in-progress seat selection, booking
 * submission status, and the client-side seat-hold countdown deadline.
 * VI: Cấu trúc state Redux cho tính năng đặt vé — chi tiết lịch chiếu/sơ đồ
 * ghế đang được tải, lựa chọn ghế đang thực hiện của người dùng, trạng thái
 * gửi yêu cầu đặt vé, và thời hạn đếm ngược giữ ghế phía client.
 */
export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
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
     * EN: the user is currently in (see BookingHub.saga.ts). Per the hub's own
     * EN: naming ("load list of seats ALREADY BOOKED"), and confirmed by live
     * EN: testing, this payload is a PARTIAL list — only the seats that are
     * EN: currently booked, not the full seat map (it can legitimately be an
     * EN: empty array if nobody has booked yet). It must be MERGED into the
     * EN: existing seat list by maGhe, never used to replace state.bookingDetail
     * EN: .danhSachGhe wholesale — doing that previously wiped the entire seat
     * EN: grid blank the moment a room had zero booked seats to report.
     * VI: Được áp dụng mỗi khi DatVeHub phát (push) "loadDanhSachGheDaDat" cho
     * VI: phòng mà người dùng đang ở trong đó (xem BookingHub.saga.ts). Theo
     * VI: đúng tên gọi của hub ("tải danh sách ghế ĐÃ ĐƯỢC ĐẶT"), và đã được
     * VI: xác nhận qua kiểm thử thực tế, payload này là một danh sách KHÔNG
     * VI: ĐẦY ĐỦ — chỉ gồm các ghế hiện đang được đặt, không phải toàn bộ sơ
     * VI: đồ ghế (nó hoàn toàn có thể là một mảng rỗng nếu chưa ai đặt ghế
     * VI: nào). Danh sách này phải được HỢP NHẤT (merge) vào danh sách ghế
     * VI: hiện có theo maGhe, tuyệt đối không được dùng để thay thế toàn bộ
     * VI: state.bookingDetail.danhSachGhe — việc làm đó trước đây từng khiến
     * VI: toàn bộ sơ đồ ghế bị xóa trắng ngay khi phòng báo cáo có 0 ghế đã
     * VI: đặt.
     * @param state - EN: current booking state draft. VI: bản nháp (draft) state đặt vé hiện tại.
     * @param action - EN: action carrying the partial list of newly-booked seats. VI: action mang theo danh sách (không đầy đủ) các ghế vừa được đặt.
     */
    applyRealtimeSeatUpdate: (
      state: BookingState,
      action: PayloadAction<DanhSachGhe[]>
    ) => {
      if (!("thongTinPhim" in state.bookingDetail)) return;
      // EN: Native `Set` (not a lodash equivalent) is used deliberately here:
      // it gives true O(1) `.has()` membership checks below, which lodash has
      // no direct equivalent for (`keyBy` + `has` would build a full keyed
      // object copy of the array just to get similar lookup performance, with
      // no real readability win). For a showtime's seat list (tens of seats)
      // the perf difference is negligible either way, but `Set` best conveys
      // "unique id membership test" intent, so it's kept as-is rather than
      // swapped for a lodash helper.
      // VI: Ở đây cố ý dùng `Set` gốc của JavaScript (không dùng hàm tương
      // đương của lodash): nó cho phép kiểm tra thành viên `.has()` với độ
      // phức tạp O(1) thực sự bên dưới, mà lodash không có hàm tương đương
      // trực tiếp (`keyBy` + `has` sẽ phải tạo một bản sao object được đánh
      // khóa (keyed) từ toàn bộ mảng chỉ để đạt hiệu năng tra cứu tương tự, mà
      // không thực sự cải thiện độ dễ đọc). Với danh sách ghế của một lịch
      // chiếu (vài chục ghế), khác biệt hiệu năng là không đáng kể dù dùng
      // cách nào, nhưng `Set` thể hiện rõ nhất ý định "kiểm tra thành viên
      // theo id duy nhất", nên được giữ nguyên thay vì thay bằng hàm lodash.
      const bookedSeatIds = new Set(action.payload.map((s) => s.maGhe));
      if (bookedSeatIds.size === 0) return;

      state.bookingDetail.danhSachGhe = state.bookingDetail.danhSachGhe.map(
        (seat) => (bookedSeatIds.has(seat.maGhe) ? { ...seat, daDat: true } : seat)
      );

      if (state.selectedSeats.length) {
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
