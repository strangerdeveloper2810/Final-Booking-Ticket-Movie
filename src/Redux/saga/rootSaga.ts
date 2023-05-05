import { all } from "redux-saga/effects";
import * as banner from "./BannerSaga/BannerSaga";
import * as user from "./UserSaga/UserSaga";
import * as film from "./FilmSaga/FilmSaga";
export function* rootSaga() {
  yield all([
    banner.actionGetAllBanner(),
    user.actionSignupSaga(),
    user.actionSigninSaga(),
    film.actionGetAllFilm(),
  ]);
}
