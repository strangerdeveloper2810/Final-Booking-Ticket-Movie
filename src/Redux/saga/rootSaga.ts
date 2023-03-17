import { all } from "redux-saga/effects";
import * as banner from "./BannerSaga/BannerSaga";
import * as user from "./UserSaga/UserSaga";
export function* rootSaga() {
  yield all([banner.actionGetAllBanner(), user.actionLoginSaga()]);
}
