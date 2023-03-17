import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLogin } from "../types/UserLogin";
import { settings, USER_LOGIN } from "util/setting";

export interface UserLoginResult {
  email: string;
  accessToken: string;
}

export interface UserState {
  userLogin: UserLogin;
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
    loginApi(state: UserState, action: PayloadAction<UserLoginResult>) {
        
    },
  },
});

export const userSagaAction = UserSagaReducer.actions;

export default UserSagaReducer.reducer;
