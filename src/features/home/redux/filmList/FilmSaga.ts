import { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_FILM } from "./FilmActionTypes";
import { http, GROUP_ID } from "shared/utils/setting";
import { FilmListAction } from "./FilmListSaga.reducer";
import { LoadingSagaAction } from "shared/redux/loading/Loading.reducer";

export function* getAllFilmSaga(): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));
    yield delay(200);
    let { data } = yield call(() => {
      return http.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUP_ID}`);
    });
    yield put(FilmListAction.getAllFlim(data.content));
  } catch (error) {
    console.log(error);
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionGetAllFilm() {
  yield takeLatest(GET_ALL_FILM, getAllFilmSaga);
}
