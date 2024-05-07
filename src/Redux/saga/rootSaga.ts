import { all } from "redux-saga/effects";
import * as banner from "./BannerSaga/BannerSaga";
import * as user from "./UserSaga/UserSaga";
import * as film from "./FilmSaga/FilmSaga";
import * as cinema from "./CinemaSaga/CinemaSaga";
import * as booking from "./BookingSaga/Booking.saga";
export function* rootSaga() {
  yield all([
    banner.actionGetAllBanner(),
    user.actionRegisterSaga(),
    user.actionLoginSaga(),
    film.actionGetAllFilm(),
    cinema.actionGetAllCinema(),
    booking.actionGetTicketApi(),
  ]);
}
