import { call, take } from "redux-saga/effects";
import { watchSeatRoom } from "./BookingHub.saga";
import { BookingHubService } from "@cinefix/realtime";
import { JOIN_SEAT_ROOM, LEAVE_SEAT_ROOM } from "./BookingTicketActionTypes";

jest.mock("@cinefix/realtime", () => ({
  __esModule: true,
  BookingHubService: {
    joinShowtimeRoom: jest.fn(),
    onSeatMapUpdated: jest.fn(),
  },
}));

describe("watchSeatRoom", () => {
  it("creates update listener channel, joins the DatVeHub room on JOIN_SEAT_ROOM, then races update listener against LEAVE_SEAT_ROOM", () => {
    const generator = watchSeatRoom();

    expect(generator.next().value).toEqual(take(JOIN_SEAT_ROOM));

    const joinAction = { type: JOIN_SEAT_ROOM, payload: 42 };
    const createChannelEffect = generator.next(joinAction).value;
    expect(createChannelEffect).toMatchObject({
      type: "CALL",
      payload: { fn: expect.any(Function), args: [] },
    });

    const fakeChannel = { close: jest.fn() };
    expect(generator.next(fakeChannel).value).toMatchObject({
      type: "CALL",
      payload: { args: [42] },
    });

    const raceEffect = generator.next().value;
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

    const fakeChannel = { close: jest.fn() };
    generator.next(fakeChannel);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const afterError = generator.throw!(new Error("hub unreachable"));

    expect(afterError.value).toEqual(take(JOIN_SEAT_ROOM));
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
