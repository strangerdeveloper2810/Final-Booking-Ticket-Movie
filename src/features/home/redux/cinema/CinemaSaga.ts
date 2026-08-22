import { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_CINEMA } from "./CinemaActionTypes";
import { LoadingSagaAction } from "shared/redux/loading/Loading.reducer";
import { GROUP_ID, http } from "shared/utils/setting";
import { ListCinemaAction } from "./ListCinemaSaga.reducer";

export function* getAllCinemaSaga(): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));
    yield delay(200);
    let { data } = yield call(() => {
      return http.get(
        `/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${GROUP_ID}`
      );
    });
    yield put(ListCinemaAction.getAllListCinema(data.content));
  } catch (error) {
    console.log(error);
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionGetAllCinema() {
  yield takeLatest(GET_ALL_CINEMA, getAllCinemaSaga);
}
