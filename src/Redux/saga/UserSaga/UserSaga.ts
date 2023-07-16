import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { http, history } from "util/setting";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";
import { UserRegister } from "Redux/types/UserType";
import { USER_REGISTER_API } from "Redux/constant/UserConstants";
export function* signupSaga(action: PayloadAction<UserRegister>): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));

    const { payload } = action; // Lấy thông tin đăng kí từ action

    const response = yield call(() => {
      return http.post(`/api/QuanLyNguoiDung/DangKy`, payload);
    });

    if (response.status === 200) {
      toast.success("Register Success");
      history.push("/login");
    } else {
      // Xử lý thông báo lỗi chi tiết hoặc các trường hợp lỗi khác
      console.log("Registration failed:", response.data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionSignupSaga() {
  yield takeLatest(USER_REGISTER_API, signupSaga);
}

export function* signinSaga(): SagaIterator {}

export function* actionSigninSaga() {}
