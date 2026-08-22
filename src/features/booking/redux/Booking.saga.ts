import get from "lodash/get";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, call, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import i18n from "shared/i18n";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { GET_TICKET_API, BOOK_TICKET_API } from "./BookingTicketActionTypes";
import BookingTicketService, { TicketBookingPayload } from "../services/BookingTicketService";
import BookingHubService from "../services/BookingHubService";

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
      toast.success(i18n.t("booking:bookingSuccess"));
      yield put(BookingTicketAction.clearSelectedSeats());
      // Refresh this client's own seat map via REST.
      yield put({ type: GET_TICKET_API, payload: payload.maLichChieu });

      // DatVeHub only broadcasts loadDanhSachGheDaDat to a room when
      // someone invokes loadDanhSachGhe — the REST DatVe endpoint does NOT
      // trigger that broadcast on its own (the REST API and the hub are
      // separate on this server). So the client that just booked has to
      // re-invoke loadDanhSachGhe itself to make the server recompute and
      // push the fresh seat map to every OTHER client in the room.
      try {
        yield call(BookingHubService.joinShowtimeRoom, payload.maLichChieu);
      } catch (hubError) {
        // A failed rebroadcast trigger must never surface as a booking
        // failure — the REST booking already succeeded. Other clients will
        // simply stay stale until their own next hub interaction.
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

export function* actionGetTicketApi() {
  yield takeLatest(GET_TICKET_API, getTicketApi);
  yield takeLatest(BOOK_TICKET_API, bookTicketSaga);
}
