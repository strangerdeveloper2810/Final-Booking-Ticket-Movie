import { call, take } from "redux-saga/effects";
import { watchSeatRoom } from "./BookingHub.saga";
import BookingHubService from "../services/BookingHubService";
import { JOIN_SEAT_ROOM, LEAVE_SEAT_ROOM } from "./BookingTicketActionTypes";

jest.mock("../services/BookingHubService", () => ({
  __esModule: true,
  default: {
    joinShowtimeRoom: jest.fn(),
    onSeatMapUpdated: jest.fn(),
  },
}));

describe("watchSeatRoom", () => {
  it("joins the DatVeHub room on JOIN_SEAT_ROOM, then races the update listener against LEAVE_SEAT_ROOM", () => {
    const generator = watchSeatRoom();

    expect(generator.next().value).toEqual(take(JOIN_SEAT_ROOM));

    const joinAction = { type: JOIN_SEAT_ROOM, payload: 42 };
    expect(generator.next(joinAction).value).toEqual(
      call(BookingHubService.joinShowtimeRoom, 42)
    );

    const createChannelEffect = generator.next().value;
    expect(createChannelEffect).toMatchObject({
      type: "CALL",
      payload: { fn: expect.any(Function), args: [] },
    });

    const fakeChannel = { close: jest.fn() };
    const raceEffect = generator.next(fakeChannel).value;
    expect(raceEffect).toMatchObject({
      type: "RACE",
      payload: {
        listen: { type: "CALL", payload: { args: [fakeChannel] } },
        leave: take(LEAVE_SEAT_ROOM),
      },
    });
  });

  it("logs the error and waits for the next JOIN_SEAT_ROOM if the hub join fails", () => {
    const generator = watchSeatRoom();
    generator.next();

    const joinAction = { type: JOIN_SEAT_ROOM, payload: 42 };
    generator.next(joinAction);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const afterError = generator.throw!(new Error("hub unreachable"));

    expect(afterError.value).toEqual(take(JOIN_SEAT_ROOM));
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
