import { SagaIterator } from "redux-saga";
import { call, takeLatest, put } from "redux-saga/effects";
import { BannerServices } from "services"
import { GET_ALL_BANNER } from "../../constant/BannerConstants";
import { BannerSagaAction } from "Redux/reducer/BannerSaga.reducer";
import { isEmpty } from "lodash";

export function* getAllBannerApi(): SagaIterator {
  try {
    const response = yield call(() => BannerServices.getAllBanner());
    if (!isEmpty(response)) {
      yield put(BannerSagaAction.getAllBanner(response));
      return
    }
    yield put(BannerSagaAction.getAllBanner([]));
    return

  } catch (error) {
    console.log({ error });
  }
}

export function* actionGetAllBanner() {
  yield takeLatest(GET_ALL_BANNER, getAllBannerApi);
}
