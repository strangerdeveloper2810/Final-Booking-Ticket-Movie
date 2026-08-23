import get from "lodash/get";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, call, select, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import i18n from "@cinefix/locales";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { GET_TICKET_API, BOOK_TICKET_API } from "./BookingTicketActionTypes";
import BookingTicketService, { TicketBookingPayload } from "../services/BookingTicketService";
import { BookingHubService } from "@cinefix/realtime";

/**
 * EN: Saga that fetches the seat map + showtime info for a showtime via REST
 * and stores it in Redux. Triggered by `GET_TICKET_API` (dispatched both on
 * page mount and again after a successful booking to refresh this client's
 * own view of the seat map).
 * VI: Saga tải sơ đồ ghế + thông tin lịch chiếu qua REST và lưu vào Redux.
 * Được kích hoạt bởi `GET_TICKET_API` (dispatch cả khi trang được mount lẫn
 * sau khi đặt vé thành công để làm mới lại sơ đồ ghế phía client này).
 * @param action - EN: Redux action carrying the showtime id (`maLichChieu`) to fetch. VI: action Redux mang theo mã lịch chiếu (`maLichChieu`) cần tải.
 * @returns EN: nothing (side-effect saga). VI: không trả về gì (saga tác dụng phụ).
 */
export function* getTicketApi(action: PayloadAction<string | number>): SagaIterator {
  const maLichChieu = action.payload;

  try {
    const result = yield call(() =>
      BookingTicketService.getDetailBookingTicket(maLichChieu)
    );

    if (get(result, "status") === 200) {
      yield put(
        BookingTicketAction.getDetailBookingTicket(
          get(result, "data.content", {})
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * EN: Saga that submits the currently selected seats to the booking REST
 * endpoint, then (on success) clears the local selection, refreshes this
 * client's own seat map, and re-invokes the DatVeHub room so every OTHER
 * connected client gets a realtime seat-map update too.
 * VI: Saga gửi danh sách ghế đang được chọn tới API đặt vé, sau đó (khi
 * thành công) xóa lựa chọn ghế cục bộ, làm mới sơ đồ ghế của chính client
 * này, và gọi lại phòng DatVeHub để mọi client khác đang kết nối cũng nhận
 * được cập nhật sơ đồ ghế theo thời gian thực.
 * @param action - EN: Redux action carrying the booking payload (showtime + selected seats). VI: action Redux mang theo dữ liệu đặt vé (lịch chiếu + ghế đã chọn).
 * @returns EN: nothing (side-effect saga). VI: không trả về gì (saga tác dụng phụ).
 */
export function* bookTicketSaga(action: PayloadAction<TicketBookingPayload>): SagaIterator {
  try {
    yield put(BookingTicketAction.setBookingLoading(true));
    const payload = action.payload;

    const result = yield call(() => BookingTicketService.bookTicket(payload));

    if (get(result, "status") === 200 || get(result, "data.statusCode") === 200) {
      toast.success(i18n.t("booking:bookingSuccess"));
      yield put(BookingTicketAction.clearSelectedSeats());

      // EN: Clear this user's real-time held seats on the SignalR server
      // VI: Xóa danh sách giữ ghế theo thời gian thực của người dùng này trên server SignalR
      try {
        const userState = yield select((state: any) => state.UserSaga?.userLogin);
        const taiKhoan = userState?.taiKhoan || "guest";
        yield call(BookingHubService.sendSelectedSeats, taiKhoan, [], payload.maLichChieu);
      } catch (err) {
        console.error("Failed to release SignalR held seats after booking", err);
      }

      // EN: Refresh this client's own seat map via REST.
      // VI: Làm mới sơ đồ ghế của chính client này thông qua REST.
      yield put({ type: GET_TICKET_API, payload: payload.maLichChieu });

      try {
        yield call(BookingHubService.joinShowtimeRoom, payload.maLichChieu);
      } catch (hubError) {
        console.error("Failed to trigger realtime seat rebroadcast", hubError);
      }
    } else {
      toast.error(get(result, "data.content") || i18n.t("booking:bookingError"));
    }
  } catch (error: any) {
    toast.error(get(error, "response.data.content") || i18n.t("booking:bookingError"));
  } finally {
    yield put(BookingTicketAction.setBookingLoading(false));
  }
}

/**
 * EN: Root watcher saga for the booking feature's REST actions — wires
 * `GET_TICKET_API` and `BOOK_TICKET_API` to their respective saga handlers.
 * VI: Saga theo dõi (watcher) gốc cho các action REST của tính năng đặt vé —
 * nối `GET_TICKET_API` và `BOOK_TICKET_API` với các saga xử lý tương ứng.
 * @returns EN: nothing (registers watchers for the saga middleware). VI: không trả về gì (đăng ký các watcher cho saga middleware).
 */
export function* actionGetTicketApi() {
  yield takeLatest(GET_TICKET_API, getTicketApi);
  yield takeLatest(BOOK_TICKET_API, bookTicketSaga);
}
