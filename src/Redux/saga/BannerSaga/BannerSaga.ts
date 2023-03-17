import { call, takeLatest, put } from "redux-saga/effects";
import { Banner } from "Redux/types/BannerType";
import { PayloadAction } from "@reduxjs/toolkit";
import { http } from "util/setting";
import { GET_ALL_BANNER } from "../../constant/BannerConstants";
import { BannerSagaAction } from "Redux/reducer/BannerSagaReducer";

export function* getAllBannerApi(action: PayloadAction<Banner[]>) {
  try {
    let { data } = yield call(() => {
      return http.get(`/api/QuanLyPhim/LayDanhSachBanner`);
    });

    yield put(BannerSagaAction.getAllBanner(data.content));
  } catch (error) {
    console.log({ error });
  }
}

export function* actionGetAllBanner() {
  yield takeLatest(GET_ALL_BANNER, getAllBannerApi);
}
