import { all } from "redux-saga/effects";
import * as banner from "./BannerSaga/BannerSaga";
export function* rootSaga() {
  yield all([banner.actionGetAllBanner()]);
}
