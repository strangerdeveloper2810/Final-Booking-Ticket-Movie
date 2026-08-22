import { all } from "redux-saga/effects";
import * as banner from "features/home/redux/banner/BannerSaga";
import * as cinema from "features/home/redux/cinema/CinemaSaga";
import * as film from "features/home/redux/filmList/FilmSaga";
import * as user from "features/auth/redux/UserSaga";
import * as booking from "features/booking/redux/Booking.saga";

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
