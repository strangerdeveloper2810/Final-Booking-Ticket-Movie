import get from "lodash/get";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingTicket, DanhSachGhe } from "./BookingTicketType";
import { initialBookingTicket } from "./BookingTicketConstants";
import { SEAT_HOLD_DURATION_MS } from "shared/constants/appConstants";

export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
  isBooking: boolean;
  /** Epoch ms the current seat selection auto-releases at; null while nothing is held. */
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
    getDetailBookingTicket: (
      state: BookingState,
      action: PayloadAction<BookingTicket>
    ) => {
      state.bookingDetail = get(action, "payload");
    },
    removeDetailBookingTicket: (state: BookingState) => {
      state.bookingDetail = {};
      state.selectedSeats = [];
      state.isBooking = false;
      state.selectionExpiresAt = null;
    },
    toggleSelectSeat: (
      state: BookingState,
      action: PayloadAction<DanhSachGhe>
    ) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex((s) => s.maGhe === seat.maGhe);
      if (index !== -1) {
        state.selectedSeats.splice(index, 1);
      } else {
        // Start (or resume) the hold timer from the first seat in this
        // selection — picking additional seats doesn't push the deadline
        // back, matching how most real ticketing platforms hold a seat.
        if (state.selectedSeats.length === 0) {
          state.selectionExpiresAt = Date.now() + SEAT_HOLD_DURATION_MS;
        }
        state.selectedSeats.push(seat);
      }
      if (state.selectedSeats.length === 0) {
        state.selectionExpiresAt = null;
      }
    },
    clearSelectedSeats: (state: BookingState) => {
      state.selectedSeats = [];
      state.selectionExpiresAt = null;
    },
    /**
     * Applied whenever the DatVeHub SignalR connection pushes a fresh seat
     * map for the room the user is currently in (see BookingHub.saga.ts).
     * Mirrors getDetailBookingTicket's reconciliation: any seat the current
     * user had selected that another client just booked is dropped from
     * the local selection the moment the realtime update arrives.
     */
    applyRealtimeSeatUpdate: (
      state: BookingState,
      action: PayloadAction<DanhSachGhe[]>
    ) => {
      if (!("thongTinPhim" in state.bookingDetail)) return;
      const freshSeats = action.payload;
      state.bookingDetail.danhSachGhe = freshSeats;
      if (state.selectedSeats.length) {
        state.selectedSeats = state.selectedSeats.filter((selected) => {
          const match = freshSeats.find((s) => s.maGhe === selected.maGhe);
          return !match || !match.daDat;
        });
        if (state.selectedSeats.length === 0) {
          state.selectionExpiresAt = null;
        }
      }
    },
    setBookingLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isBooking = action.payload;
    },
  },
});

export const BookingTicketAction = BookingTicketReducer.actions;
export default BookingTicketReducer.reducer;
