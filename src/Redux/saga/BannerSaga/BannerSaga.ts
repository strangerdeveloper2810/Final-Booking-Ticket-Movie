import { call, takeLatest, put, delay } from "redux-saga/effects";
import { Banner } from "Redux/types/BannerType";
import { PayloadAction } from "@reduxjs/toolkit";
import { http } from "util/setting";
import { GET_ALL_BANNER } from "../../constant/BannerConstants";
import { BannerSagaAction } from "Redux/reducer/BannerSagaReducer";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";

export function* getAllBannerApi(action: PayloadAction<Banner[]>) {
  try {
    yield put(LoadingSagaAction.setLoading(true));

    yield delay(2000);

    let { data } = yield call(() => {
      return http.get(`/api/QuanLyPhim/LayDanhSachBanner`);
    });

    yield put(BannerSagaAction.getAllBanner(data.content));
  } catch (error) {
    console.log({ error });
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionGetAllBanner() {
  yield takeLatest(GET_ALL_BANNER, getAllBannerApi);
}
