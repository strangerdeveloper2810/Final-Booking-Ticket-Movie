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
     * Applied whenever DatVeHub pushes "loadDanhSachGheDaDat" for the room
     * the user is currently in (see BookingHub.saga.ts). Per the hub's own
     * naming ("load list of seats ALREADY BOOKED"), and confirmed by live
     * testing, this payload is a PARTIAL list — only the seats that are
     * currently booked, not the full seat map (it can legitimately be an
     * empty array if nobody has booked yet). It must be MERGED into the
     * existing seat list by maGhe, never used to replace state.bookingDetail
     * .danhSachGhe wholesale — doing that previously wiped the entire seat
     * grid blank the moment a room had zero booked seats to report.
     */
    applyRealtimeSeatUpdate: (
      state: BookingState,
      action: PayloadAction<DanhSachGhe[]>
    ) => {
      if (!("thongTinPhim" in state.bookingDetail)) return;
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
    setBookingLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isBooking = action.payload;
    },
  },
});

export const BookingTicketAction = BookingTicketReducer.actions;
export default BookingTicketReducer.reducer;
