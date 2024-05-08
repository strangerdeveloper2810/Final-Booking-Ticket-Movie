import { SagaIterator } from "redux-saga";
import { call, takeLatest, put, delay } from "redux-saga/effects";
import { http } from "util/setting";
import { GET_ALL_BANNER } from "../../constant/BannerConstants";
import { BannerSagaAction } from "Redux/reducer/BannerSaga.reducer";
import { LoadingSagaAction } from "Redux/reducer/Loading.reducer";

export function* getAllBannerApi(): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));
    yield delay(200);
    let { data } = yield call(() => {
      return http.get(`/api/QuanLyPhim/LayDanhSachBanner`);
    });

    yield put(BannerSagaAction.getAllBanner(data.content));
  } catch (error) {
    console.log({ error });
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionGetAllBanner() {
  yield takeLatest(GET_ALL_BANNER, getAllBannerApi);
}
