import { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_FILM } from "../../constant/FilmConstants";
import { http, GROUP_ID } from "util/setting";
import { FilmListAction } from "Redux/reducer/FilmListSagaReducer";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";
export function* getAllFilmSaga(): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));
    yield delay(2000);
    let { data } = yield call(() => {
      return http.get(`/api/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUP_ID}`);
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
