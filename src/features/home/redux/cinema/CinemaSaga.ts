import { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_CINEMA } from "./CinemaActionTypes";
import { GROUP_ID, http } from "@cinefix/utils";
import { ListCinemaAction } from "./ListCinemaSaga.reducer";

/**
 * EN: Saga worker that fetches all cinema systems (with their clusters and showtimes) for
 * the configured group from the Cybersoft API, toggling the global loading indicator while
 * the request is in flight.
 * VI: Saga worker gọi API Cybersoft để lấy toàn bộ hệ thống rạp (kèm cụm rạp và lịch chiếu)
 * của nhóm đã cấu hình, đồng thời bật/tắt chỉ báo loading toàn cục trong lúc chờ request.
 */
export function* getAllCinemaSaga(): SagaIterator {
  try {
    yield delay(200);
    let { data } = yield call(() => {
      return http.get(
        `/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${GROUP_ID}`
      );
    });
    yield put(ListCinemaAction.getAllListCinema(data.content));
  } catch (error) {
    console.log(error);
  }
}

/**
 * EN: Saga watcher that listens for GET_ALL_CINEMA actions and runs `getAllCinemaSaga`,
 * cancelling any in-flight run if a new request comes in (takeLatest).
 * VI: Saga watcher lắng nghe action GET_ALL_CINEMA và chạy `getAllCinemaSaga`, hủy lần
 * chạy đang xử lý nếu có request mới tới (takeLatest).
 */
export function* actionGetAllCinema() {
  yield takeLatest(GET_ALL_CINEMA, getAllCinemaSaga);
}
