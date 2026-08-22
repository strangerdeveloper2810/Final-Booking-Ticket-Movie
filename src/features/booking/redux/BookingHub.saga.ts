import { eventChannel, EventChannel, SagaIterator } from "redux-saga";
import { call, put, take, race } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import BookingHubService from "../services/BookingHubService";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { DanhSachGhe } from "./BookingTicketType";
import { JOIN_SEAT_ROOM, LEAVE_SEAT_ROOM } from "./BookingTicketActionTypes";

/**
 * Bridges the DatVeHub SignalR push channel into redux-saga's effect world
 * via `eventChannel` — the standard redux-saga technique for turning an
 * external event emitter (WebSocket, SignalR, DOM events, ...) into
 * something a saga can `take()` from just like a dispatched Redux action.
 *
 * NOTE: confirmed by live testing, `loadDanhSachGheDaDat`'s payload is a
 * PARTIAL `DanhSachGhe[]` — only the seats currently booked, not the full
 * room seat map (an earlier version of this code wrongly assumed it was the
 * full list and replaced state.bookingDetail.danhSachGhe with it wholesale,
 * which blanked the entire seat grid whenever a room had zero booked seats
 * to report). `applyRealtimeSeatUpdate` in BookingTicket.reducer.ts merges
 * this list into the existing seats by `maGhe` instead of replacing them.
 */
function createSeatUpdateChannel(): EventChannel<DanhSachGhe[]> {
  return eventChannel<DanhSachGhe[]>((emit) => {
    return BookingHubService.onSeatMapUpdated<DanhSachGhe[]>((payload) => {
      emit(payload);
    });
  });
}

function* listenForSeatUpdates(channel: EventChannel<DanhSachGhe[]>) {
  while (true) {
    const freshSeats: DanhSachGhe[] = yield take(channel);
    yield put(BookingTicketAction.applyRealtimeSeatUpdate(freshSeats));
  }
}

export function* watchSeatRoom(): SagaIterator {
  while (true) {
    const joinAction: PayloadAction<string | number> = yield take(
      JOIN_SEAT_ROOM
    );

    try {
      yield call(BookingHubService.joinShowtimeRoom, joinAction.payload);
    } catch (error) {
      // A failed hub join shouldn't break the page — the REST-backed seat
      // map (GET_TICKET_API) already loaded the initial state; the user
      // just won't get live updates until the connection recovers on its
      // own (withAutomaticReconnect is configured in BookingHubService).
      console.error("Failed to join realtime seat room", error);
      continue;
    }

    const channel: EventChannel<DanhSachGhe[]> = yield call(
      createSeatUpdateChannel
    );

    try {
      yield race({
        listen: call(listenForSeatUpdates, channel),
        leave: take(LEAVE_SEAT_ROOM),
      });
    } finally {
      channel.close();
    }
  }
}
