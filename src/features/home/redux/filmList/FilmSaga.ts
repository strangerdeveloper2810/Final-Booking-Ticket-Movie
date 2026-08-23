import { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_FILM } from "./FilmActionTypes";
import { http, GROUP_ID } from "@cinefix/utils";
import { FilmListAction } from "./FilmListSaga.reducer";

/**
 * EN: Saga worker that fetches the full film list for the configured group from the
 * Cybersoft API, toggling the global loading indicator while the request is in flight.
 * VI: Saga worker gọi API Cybersoft để lấy toàn bộ danh sách phim của nhóm đã cấu hình,
 * đồng thời bật/tắt chỉ báo loading toàn cục trong lúc chờ request.
 */
export function* getAllFilmSaga(): SagaIterator {
  try {
    yield delay(200);
    let { data } = yield call(() => {
      return http.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUP_ID}`);
    });
    yield put(FilmListAction.getAllFlim(data.content));
  } catch (error) {
    console.log(error);
  }
}

/**
 * EN: Saga watcher that listens for GET_ALL_FILM actions and runs `getAllFilmSaga`,
 * cancelling any in-flight run if a new request comes in (takeLatest).
 * VI: Saga watcher lắng nghe action GET_ALL_FILM và chạy `getAllFilmSaga`, hủy lần chạy
 * đang xử lý nếu có request mới tới (takeLatest).
 */
export function* actionGetAllFilm() {
  yield takeLatest(GET_ALL_FILM, getAllFilmSaga);
}
