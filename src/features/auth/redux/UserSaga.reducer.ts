import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  history,
  settings,
  USER_LOGIN,
  ACCESS_TOKEN,
} from "shared/utils/setting";
import { APP_ROUTES } from "shared/constants/routes";
import { UserLoginResult, UserState } from "../types/auth.types";

const initialState: UserState = {
  userLogin: settings?.getCookieJson(USER_LOGIN) || null,
};

const UserSagaReducer = createSlice({
  name: "UserSagaReducer",
  initialState,
  reducers: {
    setUserInfo(state: UserState, action: PayloadAction<UserLoginResult>) {
      state.userLogin = action.payload;
      settings.setCookieJson(USER_LOGIN, action.payload, 30);
      settings.setCookie(ACCESS_TOKEN, action.payload.accessToken, 30);
      history.push(APP_ROUTES.HOME);
    },
  },
});

export const UserSagaAction = UserSagaReducer.actions;
export default UserSagaReducer.reducer;
