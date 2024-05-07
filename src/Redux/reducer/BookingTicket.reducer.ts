import _ from "lodash";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingTicket } from "../types/BookingTicketType";
import { initialBookingTicket } from "constants/BookingTicket";

type BookingState = {
  bookingDetail: BookingTicket | {};
};

const initialState: BookingState = {
  bookingDetail: initialBookingTicket,
};

const BookingTicketReducer = createSlice({
  name: "Booking",
  initialState,
  reducers: {
    getDetailBookingTicket: (
      state: BookingState,
      action: PayloadAction<BookingTicket>
    ) => {
      state.bookingDetail = _.get(action, "payload");
    },
    removeDetailBookingTicket: (state: BookingState) => {
      state.bookingDetail = {};
    },
  },
});

export const BookingTicketAction = BookingTicketReducer.actions;

export default BookingTicketReducer.reducer;
