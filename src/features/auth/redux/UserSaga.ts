import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import isEmpty from "lodash/isEmpty";
import { navigateTo } from "shared/utils/navigation";
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

/**
 * EN: Saga that performs registration and reports the outcome via toast.
 * `AuthServices.register` swallows HTTP errors and resolves with either the
 * new user object, `undefined` (falsy/unexpected shape), or a raw error
 * *string* forwarded from the Cybersoft API (e.g. "Email đã tồn tại") — the
 * API returns failures as a plain string in `content` instead of an object,
 * so both cases must be checked together (see the `isEmpty(...) ||
 * typeof ... === "string"` guard below). On success it stores the user via
 * `setUserInfo` and then explicitly redirects to Login (see the ordering
 * note on `setUserInfo` in UserSaga.reducer.ts — that reducer also redirects
 * to Home, and this line overrides it on purpose).
 * VI: Saga thực hiện đăng ký và báo kết quả qua toast.
 * `AuthServices.register` nuốt lỗi HTTP và trả về hoặc là object người dùng
 * mới, `undefined` (dữ liệu rỗng/không đúng dạng), hoặc một *chuỗi* lỗi thô
 * từ API Cybersoft (vd. "Email đã tồn tại") — API trả lỗi dưới dạng chuỗi
 * thuần trong `content` thay vì object, nên phải kiểm tra cả hai trường hợp
 * cùng lúc (xem điều kiện `isEmpty(...) || typeof ... === "string"` bên
 * dưới). Khi thành công, saga lưu người dùng qua `setUserInfo` rồi chủ động
 * điều hướng về trang Đăng nhập (xem ghi chú thứ tự tại `setUserInfo` trong
 * UserSaga.reducer.ts — reducer đó cũng điều hướng về Home, và dòng này cố
 * ý ghi đè lại).
 * @param action - EN: register action carrying the form payload. VI: action đăng ký mang theo dữ liệu form.
 */
export function* registerSaga(
  action: PayloadAction<UserRegister>
): SagaIterator {
  try {
    const { payload } = action;
    const response = yield call(() => AuthServices.register(payload));

    if (isEmpty(response) || typeof response === "string") {
      // EN: `response || fallback` here is intentionally left as `||`, not
      // `defaultTo`: an empty-string response must also fall back to the
      // translated message (defaultTo would only replace null/undefined/NaN
      // and would toast an empty message instead). This exact behavior is
      // asserted by UserSaga.test.ts, so it's left untouched.
      // VI: `response || fallback` ở đây cố ý giữ nguyên `||`, không đổi
      // sang `defaultTo`: chuỗi rỗng cũng cần rơi về thông báo đã dịch
      // (defaultTo chỉ thay thế null/undefined/NaN nên sẽ hiện toast rỗng).
      // Hành vi này được UserSaga.test.ts kiểm tra trực tiếp nên giữ nguyên.
      toast.error(response || i18n.t("auth:unknownError"));
      return;
    }

    toast.success(i18n.t("auth:registerSuccess"));
    yield put(UserSagaAction.setUserInfo(response));
    navigateTo(APP_ROUTES.LOGIN);
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(i18n.t("auth:unknownError"));
    }
  }
}

/**
 * EN: Registers the `USER_REGISTER_API` watcher; `takeLatest` cancels any
 * in-flight register call if the user submits the form again, preventing
 * duplicate-account race conditions.
 * VI: Đăng ký watcher cho `USER_REGISTER_API`; `takeLatest` hủy lệnh đăng ký
 * đang chạy dở nếu người dùng gửi form lại, tránh việc tạo trùng tài khoản
 * do race condition.
 */
export function* actionRegisterSaga() {
  yield takeLatest(USER_REGISTER_API, registerSaga);
}

/**
 * EN: Saga that performs login and reports the outcome via toast. Same
 * "string means error" contract as `registerSaga` — see the comment above.
 * On success it stores the user via `setUserInfo` (which already redirects
 * to Home) and then redirects to Home again itself; this second call is
 * redundant in effect (same route) but kept for symmetry with the register
 * flow and to make the saga's intent explicit without depending on the
 * reducer's internal behavior.
 * VI: Saga thực hiện đăng nhập và báo kết quả qua toast. Cùng quy ước "chuỗi
 * nghĩa là lỗi" như `registerSaga` — xem chú thích ở trên. Khi thành công,
 * saga lưu người dùng qua `setUserInfo` (đã tự điều hướng về Home) rồi tự
 * điều hướng về Home thêm lần nữa; lệnh gọi thứ hai này thực chất dư thừa
 * (cùng route) nhưng được giữ lại cho đối xứng với luồng đăng ký và để thể
 * hiện rõ ý định của saga mà không phụ thuộc vào hành vi nội bộ của reducer.
 * @param action - EN: login action carrying the credentials. VI: action đăng nhập mang theo thông tin tài khoản/mật khẩu.
 */
export function* loginSaga(action: PayloadAction<UserLogin>): SagaIterator {
  try {
    const { payload } = action;
    const response = yield call(() => AuthServices.login(payload));

    if (isEmpty(response) || typeof response === "string") {
      // EN/VI: see the identical note in registerSaga above — left as `||`
      // on purpose, not a lodash swap.
      toast.error(response || i18n.t("auth:unknownError"));
      return;
    }

    toast.success(i18n.t("auth:loginSuccess"));
    yield put(UserSagaAction.setUserInfo(response));
    navigateTo(APP_ROUTES.HOME);
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(i18n.t("auth:unknownError"));
    }
  }
}

/**
 * EN: Registers the `USER_LOGIN_API` watcher; `takeLatest` cancels any
 * in-flight login call if the user resubmits the form.
 * VI: Đăng ký watcher cho `USER_LOGIN_API`; `takeLatest` hủy lệnh đăng nhập
 * đang chạy dở nếu người dùng gửi lại form.
 */
export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}