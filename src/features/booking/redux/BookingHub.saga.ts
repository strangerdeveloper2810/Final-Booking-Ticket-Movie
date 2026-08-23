import { eventChannel, EventChannel, SagaIterator } from "redux-saga";
import { call, put, take, race } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import BookingHubService from "../services/BookingHubService";
import { BookingTicketAction } from "./BookingTicket.reducer";
import { DanhSachGhe } from "./BookingTicketType";
import { JOIN_SEAT_ROOM, LEAVE_SEAT_ROOM } from "./BookingTicketActionTypes";

// EN: Bridges the DatVeHub SignalR push channel into redux-saga's effect world
// EN: via `eventChannel` — the standard redux-saga technique for turning an
// EN: external event emitter (WebSocket, SignalR, DOM events, ...) into
// EN: something a saga can `take()` from just like a dispatched Redux action.
// EN:
// EN: NOTE: confirmed by live testing, `loadDanhSachGheDaDat`'s payload is a
// EN: PARTIAL `DanhSachGhe[]` — only the seats currently booked, not the full
// EN: room seat map (an earlier version of this code wrongly assumed it was the
// EN: full list and replaced state.bookingDetail.danhSachGhe with it wholesale,
// EN: which blanked the entire seat grid whenever a room had zero booked seats
// EN: to report). `applyRealtimeSeatUpdate` in BookingTicket.reducer.ts merges
// EN: this list into the existing seats by `maGhe` instead of replacing them.
// VI: Kết nối kênh phát (push channel) SignalR của DatVeHub vào thế giới hiệu
// VI: ứng (effect) của redux-saga thông qua `eventChannel` — đây là kỹ thuật
// VI: chuẩn của redux-saga để biến một bộ phát sự kiện bên ngoài (WebSocket,
// VI: SignalR, DOM events, ...) thành thứ mà một saga có thể `take()` giống
// VI: hệt như một action Redux được dispatch.
// VI:
// VI: LƯU Ý: đã được xác nhận qua kiểm thử thực tế, payload của
// VI: `loadDanhSachGheDaDat` là một `DanhSachGhe[]` KHÔNG ĐẦY ĐỦ — chỉ gồm
// VI: các ghế hiện đang được đặt, không phải toàn bộ sơ đồ ghế của phòng
// VI: (một phiên bản code trước đây đã hiểu nhầm đây là danh sách đầy đủ và
// VI: thay thế toàn bộ state.bookingDetail.danhSachGhe bằng nó, khiến cả sơ
// VI: đồ ghế bị trống trơn mỗi khi phòng báo cáo có 0 ghế đã đặt).
// VI: `applyRealtimeSeatUpdate` trong BookingTicket.reducer.ts hợp nhất danh
// VI: sách này vào các ghế hiện có theo `maGhe` thay vì thay thế chúng.
/**
 * EN: Wraps `BookingHubService.onSeatMapUpdated` in a redux-saga `eventChannel`.
 * VI: Bọc `BookingHubService.onSeatMapUpdated` trong một `eventChannel` của redux-saga.
 * @returns EN: an event channel that emits each realtime partial seat-map broadcast. VI: một event channel phát ra mỗi tin cập nhật sơ đồ ghế (dạng không đầy đủ) theo thời gian thực.
 */
function createSeatUpdateChannel(): EventChannel<DanhSachGhe[]> {
  return eventChannel<DanhSachGhe[]>((emit) => {
    return BookingHubService.onSeatMapUpdated<DanhSachGhe[]>((payload) => {
      emit(payload);
    });
  });
}

/**
 * EN: Consumes the seat-update event channel forever, dispatching
 * `applyRealtimeSeatUpdate` for each broadcast received. Runs inside a
 * `race` in `watchSeatRoom` so it's cancelled the moment `LEAVE_SEAT_ROOM`
 * fires.
 * VI: Liên tục tiêu thụ (consume) event channel cập nhật ghế, dispatch
 * `applyRealtimeSeatUpdate` cho mỗi tin phát nhận được. Chạy bên trong một
 * `race` ở `watchSeatRoom` nên sẽ bị hủy ngay khi `LEAVE_SEAT_ROOM` được
 * dispatch.
 * @param channel - EN: the event channel created by `createSeatUpdateChannel`. VI: event channel được tạo bởi `createSeatUpdateChannel`.
 * @returns EN: nothing (runs until cancelled by the surrounding race). VI: không trả về gì (chạy cho đến khi bị hủy bởi race bao quanh).
 */
function* listenForSeatUpdates(channel: EventChannel<DanhSachGhe[]>) {
  while (true) {
    const freshSeats: DanhSachGhe[] = yield take(channel);
    yield put(BookingTicketAction.applyRealtimeSeatUpdate(freshSeats));
  }
}

/**
 * EN: Root saga that manages the lifecycle of the realtime seat room for
 * whichever showtime the user currently has open: joins the DatVeHub room on
 * `JOIN_SEAT_ROOM`, listens for seat-map broadcasts, and tears the listener
 * down again on `LEAVE_SEAT_ROOM` — looping so it's ready for the next
 * showtime the user navigates to.
 * VI: Saga gốc quản lý vòng đời của phòng ghế theo thời gian thực cho lịch
 * chiếu mà người dùng đang mở: tham gia phòng DatVeHub khi có `JOIN_SEAT_ROOM`,
 * lắng nghe các tin phát cập nhật sơ đồ ghế, và dọn dẹp listener khi có
 * `LEAVE_SEAT_ROOM` — lặp lại vô hạn để sẵn sàng cho lịch chiếu tiếp theo mà
 * người dùng điều hướng tới.
 * @returns EN: nothing — runs forever as a background watcher saga. VI: không trả về gì — chạy mãi mãi như một saga theo dõi nền.
 */
export function* watchSeatRoom(): SagaIterator {
  while (true) {
    const joinAction: PayloadAction<string | number> = yield take(
      JOIN_SEAT_ROOM
    );

    // EN: Create listener channel BEFORE joining the room so the initial
    // EN: broadcast pushed by the server upon room join is never missed.
    // VI: Tạo event channel lắng nghe TRƯỚC KHI tham gia phòng để không bao
    // VI: giờ bỏ lỡ tin phát đầu tiên mà server đẩy về khi vừa vào phòng.
    const channel: EventChannel<DanhSachGhe[]> = yield call(
      createSeatUpdateChannel
    );

    try {
      yield call(BookingHubService.joinShowtimeRoom, joinAction.payload);

      yield race({
        listen: call(listenForSeatUpdates, channel),
        leave: take(LEAVE_SEAT_ROOM),
      });
    } catch (error) {
      console.error("Failed to join or listen to realtime seat room", error);
    } finally {
      channel.close();
    }
  }
}
