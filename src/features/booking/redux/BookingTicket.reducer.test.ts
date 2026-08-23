import bookingReducer, { BookingState, BookingTicketAction } from "./BookingTicket.reducer";
import { DanhSachGhe } from "./BookingTicketType";

const seat = (maGhe: number, overrides: Partial<DanhSachGhe> = {}): DanhSachGhe => ({
  maGhe,
  tenGhe: `A${maGhe}`,
  maRap: 1,
  loaiGhe: "Thuong",
  stt: String(maGhe),
  giaVe: 75000,
  daDat: false,
  taiKhoanNguoiDat: null,
  ...overrides,
});

const baseState = (overrides: Partial<BookingState> = {}): BookingState => ({
  bookingDetail: {
    thongTinPhim: {
      maLichChieu: 44209,
      tenCumRap: "MegaGS",
      tenRap: "Rạp 7",
      diaChi: "Cao Thắng",
      tenPhim: "Lừa đảo gặp lừa đảo",
      hinhAnh: "poster.jpg",
      ngayChieu: "30/08/2021",
      gioChieu: "08:08",
    },
    danhSachGhe: [seat(1), seat(2), seat(3)],
  },
  selectedSeats: [],
  danhSachGheDangDat: [],
  isBooking: false,
  selectionExpiresAt: null,
  ...overrides,
});

describe("BookingTicket.reducer — applyRealtimeSeatUpdate", () => {
  it("merges a partial booked-seats broadcast by maGhe instead of replacing the whole seat map", () => {
    const state = baseState();

    const next = bookingReducer(
      state,
      BookingTicketAction.applyRealtimeSeatUpdate([seat(2, { daDat: true })])
    );

    expect(next.bookingDetail.danhSachGhe).toHaveLength(3);
    expect(next.bookingDetail.danhSachGhe.find((s) => s.maGhe === 2)?.daDat).toBe(true);
    expect(next.bookingDetail.danhSachGhe.find((s) => s.maGhe === 1)?.daDat).toBe(false);
    expect(next.bookingDetail.danhSachGhe.find((s) => s.maGhe === 3)?.daDat).toBe(false);
  });

  it("does NOT blank the seat grid when the hub reports zero currently-booked seats (the regression this fix addresses)", () => {
    const state = baseState();

    const next = bookingReducer(state, BookingTicketAction.applyRealtimeSeatUpdate([]));

    expect(next.bookingDetail.danhSachGhe).toHaveLength(3);
    expect(next.bookingDetail.danhSachGhe).toEqual(state.bookingDetail.danhSachGhe);
  });

  it("drops a locally-selected seat (and clears the hold timer) once the hub reports it as booked", () => {
    const state = baseState({
      selectedSeats: [seat(2)],
      selectionExpiresAt: Date.now() + 60_000,
    });

    const next = bookingReducer(
      state,
      BookingTicketAction.applyRealtimeSeatUpdate([seat(2, { daDat: true })])
    );

    expect(next.selectedSeats).toEqual([]);
    expect(next.selectionExpiresAt).toBeNull();
  });

  it("leaves other selected seats untouched if the booked seat isn't one of them", () => {
    const state = baseState({
      selectedSeats: [seat(1), seat(3)],
      selectionExpiresAt: 123,
    });

    const next = bookingReducer(
      state,
      BookingTicketAction.applyRealtimeSeatUpdate([seat(2, { daDat: true })])
    );

    expect(next.selectedSeats.map((s) => s.maGhe)).toEqual([1, 3]);
    expect(next.selectionExpiresAt).toBe(123);
  });

  it("is a no-op before the initial seat map has loaded", () => {
    const state: BookingState = {
      bookingDetail: {},
      selectedSeats: [],
      danhSachGheDangDat: [],
      isBooking: false,
      selectionExpiresAt: null,
    };

    const next = bookingReducer(
      state,
      BookingTicketAction.applyRealtimeSeatUpdate([seat(2, { daDat: true })])
    );

    expect(next.bookingDetail).toEqual({});
  });
});
