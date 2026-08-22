import { SagaIterator } from "redux-saga";
import { call, takeLatest, put } from "redux-saga/effects";
import BannerServices from "./Banner.services";
import { GET_ALL_BANNER } from "./BannerActionTypes";
import { BannerSagaAction } from "./BannerSaga.reducer";
import isEmpty from "lodash/isEmpty";

/**
 * EN: Saga worker that fetches all banners via BannerServices and dispatches the result
 * into the store, falling back to an empty array when the service returns no data (e.g.
 * request failed or API returned a non-200 status).
 * VI: Saga worker gọi BannerServices để lấy toàn bộ banner và dispatch kết quả vào store,
 * dùng mảng rỗng làm giá trị dự phòng khi service không trả về dữ liệu (VD: request lỗi
 * hoặc API trả về status khác 200).
 */
export function* getAllBannerApi(): SagaIterator {
  try {
    const response = yield call(() => BannerServices.getAllBanner());
    if (!isEmpty(response)) {
      yield put(BannerSagaAction.getAllBanner(response));
      return;
    }
    yield put(BannerSagaAction.getAllBanner([]));
    return;
  } catch (error) {
    console.log({ error });
  }
}

/**
 * EN: Saga watcher that listens for GET_ALL_BANNER actions and runs `getAllBannerApi`,
 * cancelling any in-flight run if a new request comes in (takeLatest).
 * VI: Saga watcher lắng nghe action GET_ALL_BANNER và chạy `getAllBannerApi`, hủy lần chạy
 * đang xử lý nếu có request mới tới (takeLatest).
 */
export function* actionGetAllBanner() {
  yield takeLatest(GET_ALL_BANNER, getAllBannerApi);
}
