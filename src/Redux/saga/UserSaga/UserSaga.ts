import { takeLatest, call } from "redux-saga/effects";
import { http } from "util/setting";
import { USER_LOGIN_API } from "./../../constant/UserConstant";

function* loginSaga() {
  try {
    let { data } = yield call(() => {
      return http.get(`api/QuanLyNguoiDung/DangNhap`);
    });
    console.log(data);
    
  } catch (error) {
    console.log(error);
  }
}

export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}

/*
abcd1
hangthuy27051999@gmail.com
12345678
*/
