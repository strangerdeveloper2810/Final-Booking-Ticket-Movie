import get from "lodash/get";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, call, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { GET_TICKET_API, BOOK_TICKET_API } from "./BookingTicketActionTypes";
import BookingTicketService, { TicketBookingPayload } from "../services/BookingTicketService";

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

export function* bookTicketSaga(action: PayloadAction<TicketBookingPayload>): SagaIterator {
  try {
    yield put(BookingTicketAction.setBookingLoading(true));
    const payload = action.payload;

    const result = yield call(() => BookingTicketService.bookTicket(payload));

    if (get(result, "status") === 200 || get(result, "data.statusCode") === 200) {
      toast.success("Đặt vé thành công!");
      yield put(BookingTicketAction.clearSelectedSeats());
      // Refresh ticket room state
      yield put({ type: GET_TICKET_API, payload: payload.maLichChieu });
    } else {
      toast.error(get(result, "data.content") || "Đặt vé thất bại!");
    }
  } catch (error: any) {
    toast.error(get(error, "response.data.content") || "Đặt vé không thành công. Vui lòng thử lại!");
  } finally {
    yield put(BookingTicketAction.setBookingLoading(false));
  }
}

export function* actionGetTicketApi() {
  yield takeLatest(GET_TICKET_API, getTicketApi);
  yield takeLatest(BOOK_TICKET_API, bookTicketSaga);
}
