import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import isEmpty from "lodash/isEmpty";
import { history } from "shared/utils/setting";
import { toast } from "react-toastify";
import i18n from "shared/i18n";
import { UserRegister, UserLogin } from "./UserType";
import {
  USER_REGISTER_API,
  USER_LOGIN_API,
} from "./UserConstants";
import { UserSagaAction } from "./UserSaga.reducer";
import AuthServices from "../services/Auth.services";
import { APP_ROUTES } from "shared/constants/routes";

export function* registerSaga(
  action: PayloadAction<UserRegister>
): SagaIterator {
  try {
    const { payload } = action;
    const response = yield call(() => AuthServices.register(payload));

    if (isEmpty(response) || typeof response === "string") {
      toast.error(response || i18n.t("auth:unknownError"));
      return;
    }

    toast.success(i18n.t("auth:registerSuccess"));
    yield put(UserSagaAction.setUserInfo(response));
    history.push(APP_ROUTES.LOGIN);
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(i18n.t("auth:unknownError"));
    }
  }
}

export function* actionRegisterSaga() {
  yield takeLatest(USER_REGISTER_API, registerSaga);
}

export function* loginSaga(action: PayloadAction<UserLogin>): SagaIterator {
  try {
    const { payload } = action;
    const response = yield call(() => AuthServices.login(payload));

    if (isEmpty(response) || typeof response === "string") {
      toast.error(response || i18n.t("auth:unknownError"));
      return;
    }

    toast.success(i18n.t("auth:loginSuccess"));
    yield put(UserSagaAction.setUserInfo(response));
    history.push(APP_ROUTES.HOME);
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(i18n.t("auth:unknownError"));
    }
  }
}

export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}