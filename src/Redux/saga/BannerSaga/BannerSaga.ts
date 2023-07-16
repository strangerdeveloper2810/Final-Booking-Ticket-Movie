import { SagaIterator } from "redux-saga";
import { call, takeLatest, put } from "redux-saga/effects";
import { http } from "util/setting";
import { GET_ALL_BANNER } from "../../constant/BannerConstants";
import { BannerSagaAction } from "Redux/reducer/BannerSagaReducer";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";

export function* getAllBannerApi(): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));
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
