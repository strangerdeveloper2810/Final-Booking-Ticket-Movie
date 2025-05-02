import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { isEmpty } from "lodash";
import { history } from "../../../util/setting";
import { toast } from "react-toastify";
import { UserRegister, UserLogin } from "../../types/UserType";
import {
  USER_REGISTER_API,
  USER_LOGIN_API,
} from "../../constant/UserConstants";
import { UserSagaAction } from "../../reducer/UserSaga.reducer";
import { AuthServices } from '../../../services'

export function* registerSaga(
  action: PayloadAction<UserRegister>
): SagaIterator {
  try {
    const { payload } = action;
    const response = yield call(() => AuthServices.register(payload));

    if (isEmpty(response) || typeof response === "string") {
      toast.error(response)
      return;
    }

    toast.success("Register Success");
    yield put(UserSagaAction.setUserInfo(response));
    history.push("/login");

  }
  catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
  }
}

export function* actionRegisterSaga() {
  yield takeLatest(USER_REGISTER_API, registerSaga);
}


export function* loginSaga(action: PayloadAction<UserLogin>): SagaIterator {
  try {
    const { payload } = action;

    const response = yield call(() => AuthServices.login(payload))

    if (isEmpty(response) || typeof response === "string") {
      toast.error(response)
      return;
    }

    toast.success("Login Success");
    yield put(UserSagaAction.setUserInfo(response));
    history.push("/");

  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }

  }
}

export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}