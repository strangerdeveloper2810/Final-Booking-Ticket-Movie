import { GET_ALL_FILM, GET_FILM_DETAIL } from "Redux/constant/FilmConstants";
import {GetFilmDetailAction} from "Redux/reducer/FilmDetailReducer";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { http } from "util/setting";
type Action = {
  type:string,
  maPhim:number,
}
export function* getFilmDetailSaga(action:Action): SagaIterator {
      console.log("action",action);
     
    try {
      let  {data} = yield call(()=>{
        return http.get(`/api/QuanLyPhim/LayThongTinPhim?MaPhim=${action.maPhim}`)
      })

      console.log("data",data.content);
      yield put(GetFilmDetailAction.getFilmDetail(data.content))
    } catch (error) {
      console.log(error);
    } finally {
      yield put(LoadingSagaAction.setLoading(false));
    }
  }
  
  export function* actionGetFilmDetail() {
    yield takeLatest(GET_FILM_DETAIL, getFilmDetailSaga);
  }