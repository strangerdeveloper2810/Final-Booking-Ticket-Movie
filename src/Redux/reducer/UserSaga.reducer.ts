import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  history,
  settings,
  USER_LOGIN,
  ACCESS_TOKEN,
} from "../../util/setting";

export interface UserLoginResult {
  hoTen: string;
  accessToken: string;
}

export interface UserState {
  userLogin: UserLoginResult;
}

const initialState: UserState = {
  userLogin: settings.getStorageJson(USER_LOGIN)
    ? settings.getCookieJson(USER_LOGIN)
    : null,
};
const UserSagaReducer = createSlice({
  name: "UserSagaReducer",
  initialState,
  reducers: {
    setUserInfo(state: UserState, action: PayloadAction<UserLoginResult>) {
      state.userLogin = action.payload;
      settings.setStorageJson(USER_LOGIN, action.payload);
      settings.setCookieJson(USER_LOGIN, action.payload, 30);
      settings.setStorageJson(ACCESS_TOKEN, action.payload.accessToken);
      settings.setCookieJson(ACCESS_TOKEN, action.payload.accessToken, 30);
      history.push("/");
    },
  },
});

export const UserSagaAction = UserSagaReducer.actions;

export default UserSagaReducer.reducer;
