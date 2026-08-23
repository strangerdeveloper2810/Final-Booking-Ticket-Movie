import { put, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getTicketApi, bookTicketSaga } from "./Booking.saga";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { GET_TICKET_API } from "./BookingTicketActionTypes";
import { BookingHubService } from "@cinefix/realtime";
import { TicketBookingPayload } from "../services/BookingTicketService";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@cinefix/locales", () => ({
  __esModule: true,
  default: { t: (key: string) => key },
}));

jest.mock("@cinefix/realtime", () => ({
  __esModule: true,
  BookingHubService: {
    joinShowtimeRoom: jest.fn(),
    sendSelectedSeats: jest.fn(),
  },
}));

const mockBookingDetail = {
  thongTinPhim: {
    maLichChieu: 1,
    tenCumRap: "BHD Star",
    tenRap: "Rạp 1",
    diaChi: "123 Đường ABC",
    tenPhim: "Test Movie",
    hinhAnh: "poster.jpg",
    ngayChieu: "20/08/2026",
    gioChieu: "20:00",
  },
  danhSachGhe: [],
};

describe("getTicketApi Saga", () => {
  it("fetches the seat map and stores it", () => {
    const action: PayloadAction<string | number> = {
      type: GET_TICKET_API,
      payload: 1,
    };
    const generator = getTicketApi(action);

    expect(generator.next().value).toMatchObject({
      type: "CALL",
      payload: { fn: expect.any(Function), args: [] },
    });

    const result = generator.next({ status: 200, data: { content: mockBookingDetail } });
    expect(result.value).toEqual(
      put(BookingTicketAction.getDetailBookingTicket(mockBookingDetail))
    );

    expect(generator.next().done).toBe(true);
  });
});

describe("bookTicketSaga", () => {
  const payload: TicketBookingPayload = {
    maLichChieu: 1,
    danhSachVe: [{ maGhe: 101, giaVe: 75000 }],
  };
  const action: PayloadAction<TicketBookingPayload> = {
    type: "BOOK_TICKET_API",
    payload,
  };

  it("submits seats, re-fetches its own seat map, and re-invokes the hub so OTHER clients get the realtime update", () => {
    const generator = bookTicketSaga(action);

    expect(generator.next().value).toEqual(
      put(BookingTicketAction.setBookingLoading(true))
    );

    expect(generator.next().value).toMatchObject({
      type: "CALL",
      payload: { fn: expect.any(Function), args: [] },
    });

    const afterBook = generator.next({ status: 200 });
    expect(afterBook.value).toEqual(put(BookingTicketAction.clearSelectedSeats()));

    // Select userLogin state
    generator.next();

    // Release real-time seats via SignalR
    const afterRelease = generator.next({ taiKhoan: "testUser" });
    expect(afterRelease.value).toMatchObject({
      type: "CALL",
      payload: { args: ["testUser", [], payload.maLichChieu] },
    });

    const afterRefresh = generator.next();
    expect(afterRefresh.value).toEqual(
      put({ type: GET_TICKET_API, payload: payload.maLichChieu })
    );

    const afterHubTrigger = generator.next();
    expect(afterHubTrigger.value).toMatchObject({
      type: "CALL",
      payload: { args: [payload.maLichChieu] },
    });

    const afterFinally = generator.next();
    expect(afterFinally.value).toEqual(
      put(BookingTicketAction.setBookingLoading(false))
    );

    expect(toast.success).toHaveBeenCalledWith("booking:bookingSuccess");
    expect(generator.next().done).toBe(true);
  });

  it("still reports booking success even if the hub rebroadcast trigger fails", () => {
    const generator = bookTicketSaga(action);
    generator.next();
    generator.next();
    generator.next({ status: 200 });
    generator.next();
    generator.next("testUser");
    generator.next();
    generator.next();

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const afterHubError = generator.throw!(new Error("hub unreachable"));

    expect(afterHubError.value).toEqual(
      put(BookingTicketAction.setBookingLoading(false))
    );
    expect(consoleSpy).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("booking:bookingSuccess");
    consoleSpy.mockRestore();
  });
});
