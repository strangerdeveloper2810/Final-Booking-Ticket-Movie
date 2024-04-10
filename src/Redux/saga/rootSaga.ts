import { all } from "redux-saga/effects";
import * as banner from "./BannerSaga/BannerSaga";
import * as user from "./UserSaga/UserSaga";
import * as film from "./FilmSaga/FilmSaga";
import * as filmDetail from "./FilmSaga/GetFilmDetailSaga";
import * as cinema from "./CinemaSaga/CinemaSaga";
export function* rootSaga() {
  yield all([
    banner.actionGetAllBanner(),
    user.actionRegisterSaga(),
    user.actionLoginSaga(),
    film.actionGetAllFilm(),
    filmDetail.actionGetFilmDetail(),
    cinema.actionGetAllCinema(),
  ]);
}
