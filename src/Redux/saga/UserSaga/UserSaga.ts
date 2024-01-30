import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { http, history } from "util/setting";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSagaAction } from "Redux/reducer/LoadingReducer";
import { UserRegister, UserLogin } from "Redux/types/UserType";
import {
  USER_REGISTER_API,
  USER_LOGIN_API,
} from "Redux/constant/UserConstants";
import { UserSagaAction } from "Redux/reducer/UserSagaReducer";
export function* registerSaga(
  action: PayloadAction<UserRegister>
): SagaIterator {
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
  } catch (error: any) {
    console.log(error);
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionRegisterSaga() {
  yield takeLatest(USER_REGISTER_API, registerSaga);
}

export function* loginSaga(action: PayloadAction<UserLogin>): SagaIterator {
  try {
    yield put(LoadingSagaAction.setLoading(true));

    const { payload } = action; // Lấy thông tin đăng kí từ action

    const { data, status } = yield call(() => {
      return http.post(`/api/QuanLyNguoiDung/DangNhap`, payload);
    });

    if (status === 200) {
      toast.success("Login Success");
      yield put(UserSagaAction.setUserInfo(data.content));
      history.push("/");
    } else {
      // Xử lý thông báo lỗi chi tiết hoặc các trường hợp lỗi khác
      console.log("Registration failed:", data.content);
    }
  } catch (error) {
    toast.error("Tài khoản hoặc mật khẩu không đúng!");
    console.log(error);
  } finally {
    yield put(LoadingSagaAction.setLoading(false));
  }
}

export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}
