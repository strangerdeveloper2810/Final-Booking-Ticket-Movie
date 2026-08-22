import get from "lodash/get";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingTicket, DanhSachGhe } from "./BookingTicketType";
import { initialBookingTicket } from "./BookingTicketConstants";

export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
  isBooking: boolean;
};

const initialState: BookingState = {
  bookingDetail: initialBookingTicket,
  selectedSeats: [],
  isBooking: false,
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
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state: BookingState) => {
      state.selectedSeats = [];
    },
    setBookingLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isBooking = action.payload;
    },
  },
});

export const BookingTicketAction = BookingTicketReducer.actions;
export default BookingTicketReducer.reducer;
