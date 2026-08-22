import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import defaultTo from "lodash/defaultTo";
import {
  settings,
  USER_LOGIN,
  ACCESS_TOKEN,
} from "shared/utils/setting";
import { navigateTo } from "shared/utils/navigation";
import { APP_ROUTES } from "shared/constants/routes";
import { UserLoginResult, UserState } from "../types/auth.types";

// EN: Hydrate the logged-in user from the `USER_LOGIN` cookie on app start
// (not localStorage — cookies natively support the 30-day expiry used by
// `setCookieJson`/`setCookie` below, so the session expires on its own
// without extra cleanup code). `getCookieJson` already returns `null` when
// the cookie is missing/invalid; `defaultTo` just makes that "fall back to
// null" intent explicit for a future reader.
// VI: Khôi phục thông tin người dùng đã đăng nhập từ cookie `USER_LOGIN` khi
// app khởi động (không dùng localStorage — cookie hỗ trợ sẵn thời hạn 30
// ngày như `setCookieJson`/`setCookie` bên dưới, nên phiên đăng nhập tự hết
// hạn mà không cần dọn dẹp thêm). `getCookieJson` đã trả về `null` khi cookie
// không tồn tại/không hợp lệ; dùng `defaultTo` để thể hiện rõ ý "mặc định về
// null" cho người đọc sau này.
const initialState: UserState = {
  userLogin: defaultTo(settings?.getCookieJson(USER_LOGIN), null),
};

const UserSagaReducer = createSlice({
  name: "UserSagaReducer",
  initialState,
  reducers: {
    /**
     * EN: Stores the authenticated user in state/cookies and navigates home.
     * NOTE (side-effect ordering quirk): this reducer always redirects to
     * `HOME`, even though it's also dispatched from the register flow. That's
     * intentional — `registerSaga` (see UserSaga.ts) dispatches this action
     * and then immediately calls `navigateTo(APP_ROUTES.LOGIN)` itself,
     * right after. Since `put()` runs the reducer synchronously before the
     * saga resumes, the saga's own `navigateTo` always executes second and
     * "wins" (last write wins), overriding this reducer's HOME redirect so a
     * freshly registered user actually lands on the Login page, not HOME.
     * This is a real ordering dependency, not dead code — do not remove the
     * saga's post-register `navigateTo` call assuming this reducer handles it.
     * VI: Lưu người dùng đã xác thực vào state/cookie rồi điều hướng về
     * trang chủ.
     * GHI CHÚ (thứ tự side-effect khá "lắt léo"): reducer này luôn điều
     * hướng về `HOME`, dù cũng được gọi từ luồng đăng ký. Đây là chủ đích —
     * `registerSaga` (xem UserSaga.ts) dispatch action này rồi ngay sau đó tự
     * gọi `navigateTo(APP_ROUTES.LOGIN)`. Vì `put()` chạy reducer đồng bộ
     * trước khi saga chạy tiếp, lệnh `navigateTo` của saga luôn thực thi
     * sau và "thắng" (ghi sau cùng có hiệu lực), ghi đè điều hướng HOME của
     * reducer để người vừa đăng ký thực sự đến trang Đăng nhập, không phải
     * trang chủ. Đây là một phụ thuộc thứ tự thật sự, không phải code thừa —
     * đừng xóa lệnh `navigateTo` sau đăng ký trong saga vì nghĩ reducer này đã
     * xử lý.
     * @param state - EN: current auth slice state (Immer draft). VI: state hiện tại của slice auth (Immer draft).
     * @param action - EN: payload with the API's login/register result. VI: payload chứa kết quả đăng nhập/đăng ký từ API.
     */
    setUserInfo(state: UserState, action: PayloadAction<UserLoginResult>) {
      state.userLogin = action.payload;
      settings.setCookieJson(USER_LOGIN, action.payload, 30);
      settings.setCookie(ACCESS_TOKEN, action.payload.accessToken, 30);
      navigateTo(APP_ROUTES.HOME);
    },
  },
});

// EN: Action creators for this slice (currently just `setUserInfo`), used by
// UserSaga.ts to dispatch the result of a successful login/register call.
// VI: Action creator của slice này (hiện chỉ có `setUserInfo`), được
// UserSaga.ts dùng để dispatch kết quả đăng nhập/đăng ký thành công.
export const UserSagaAction = UserSagaReducer.actions;
export default UserSagaReducer.reducer;
