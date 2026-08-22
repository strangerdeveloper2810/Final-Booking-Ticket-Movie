import { put } from "redux-saga/effects";
import { registerSaga, loginSaga } from "./UserSaga";
import { UserSagaAction } from "./UserSaga.reducer";
import { toast } from "react-toastify";
import { navigateTo } from "shared/utils/navigation";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserLogin, UserRegister } from "./UserType";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// EN: UserSaga.ts navigates via the shared `navigateTo` helper (see
// shared/utils/navigation.ts) instead of the old, silently-disconnected
// `history` package instance — mock that module instead.
// VI: UserSaga.ts điều hướng qua helper `navigateTo` dùng chung (xem
// shared/utils/navigation.ts) thay vì instance package `history` cũ vốn đã
// âm thầm bị ngắt kết nối — mock module đó thay thế.
jest.mock("shared/utils/navigation", () => ({
  navigateTo: jest.fn(),
}));

describe("User Saga", () => {
  const mockRegister: UserRegister = {
    taiKhoan: "trinhnguyen",
    matKhau: "123456",
    email: "trinh@example.com",
    soDt: "0987654321",
    maNhom: "GP01",
    hoTen: "Nguyễn Trinh",
  };

  const mockLogin: UserLogin = {
    taiKhoan: "trinhnguyen",
    matKhau: "123456",
  };

  const mockUser = {
    taiKhoan: "trinhnguyen",
    hoTen: "Nguyễn Trinh",
    email: "trinh@example.com",
    soDt: "0987654321",
    maNhom: "GP01",
    accessToken: "abc123",
  };

  it("should handle register success", () => {
    const action: PayloadAction<UserRegister> = {
      type: "USER_REGISTER_API",
      payload: mockRegister,
    };

    const generator = registerSaga(action);

    expect(generator.next().value).toMatchObject({
      type: "CALL",
      payload: {
        fn: expect.any(Function),
        args: [],
      },
    });

    const nextStep = generator.next(mockUser);
    expect(nextStep.value).toEqual(put(UserSagaAction.setUserInfo(mockUser)));

    generator.next();
    expect(navigateTo).toHaveBeenCalledWith("/login");
    expect(generator.next().done).toBe(true);
  });

  it("should handle register with string error", () => {
    const action: PayloadAction<UserRegister> = {
      type: "USER_REGISTER_API",
      payload: mockRegister,
    };

    const generator = registerSaga(action);
    generator.next();
    const errorMsg = "Email đã tồn tại";
    generator.next(errorMsg);

    expect(toast.error).toHaveBeenCalledWith(errorMsg);
  });

  it("should handle login success", () => {
    const action: PayloadAction<UserLogin> = {
      type: "USER_LOGIN_API",
      payload: mockLogin,
    };

    const generator = loginSaga(action);

    expect(generator.next().value).toMatchObject({
      type: "CALL",
      payload: {
        fn: expect.any(Function),
        args: [],
      },
    });

    generator.next(mockUser);
    generator.next();
    expect(navigateTo).toHaveBeenCalledWith("/");
  });

  it("should handle login with string error", () => {
    const action: PayloadAction<UserLogin> = {
      type: "USER_LOGIN_API",
      payload: mockLogin,
    };

    const generator = loginSaga(action);
    generator.next();

    const errorMsg = "Sai tài khoản hoặc mật khẩu";
    generator.next(errorMsg);

    expect(toast.error).toHaveBeenCalledWith(errorMsg);
  });
});
