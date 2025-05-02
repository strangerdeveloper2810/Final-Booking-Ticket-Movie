import { call, put } from "redux-saga/effects";
import { registerSaga, loginSaga } from "./UserSaga";
import { UserSagaAction } from "../../reducer/UserSaga.reducer";
import { toast } from "react-toastify";
import { history } from "../../../util/setting";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserLogin, UserRegister } from "../../types/UserType";

// Mock toast + history
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("../../../util/setting.ts", () => ({
    history: {
        push: jest.fn(),
    },
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

    // ----- REGISTER SAGA -----
    it("should handle register success", () => {
        const action: PayloadAction<UserRegister> = {
            type: "USER_REGISTER_API",
            payload: mockRegister,
        };

        const generator = registerSaga(action);

        // Step 1: call AuthServices.register
        expect(generator.next().value).toMatchObject({
            type: "CALL",
            payload: {
                fn: expect.any(Function),
                args: [],
            },
        });

        // Step 2: put action
        const nextStep = generator.next(mockUser);
        expect(nextStep.value).toEqual(
            put(UserSagaAction.setUserInfo(mockUser))
        );

        // Step 3: tiến thêm 1 bước để thực thi side-effect ngoài yield
        generator.next();

        // Bây giờ mới kiểm tra history.push
        expect(history.push).toHaveBeenCalledWith("/login");
        expect(generator.next().done).toBe(true);

    });

    it("should handle register with string error", () => {
        const action: PayloadAction<UserRegister> = {
            type: "USER_REGISTER_API",
            payload: mockRegister,
        };

        const generator = registerSaga(action);

        generator.next(); // call effect
        const errorMsg = "Email đã tồn tại";
        generator.next(errorMsg); // trả về lỗi dạng string

        expect(toast.error).toHaveBeenCalledWith(errorMsg);
    });

    // ----- LOGIN SAGA -----
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

        // Step 2: dispatch user info
        generator.next(mockUser);

        // Step 3: thực thi push("/")
        generator.next();

        expect(history.push).toHaveBeenCalledWith("/");

    });

    it("should handle login with string error", () => {
        const action: PayloadAction<UserLogin> = {
            type: "USER_LOGIN_API",
            payload: mockLogin,
        };

        const generator = loginSaga(action);
        generator.next(); // call effect

        const errorMsg = "Sai tài khoản hoặc mật khẩu";
        generator.next(errorMsg); // trả về lỗi dạng string

        expect(toast.error).toHaveBeenCalledWith(errorMsg);
    });

    // it("should handle login error thrown", () => {
    //     const action: PayloadAction<UserLogin> = {
    //         type: "USER_LOGIN_API",
    //         payload: mockLogin,
    //     };

    //     const generator = loginSaga(action);
    //     generator.next(); // call effect

    //     const error = new Error("Lỗi mạng");
    //     generator.throw(error); // giả lập lỗi bị throw

    //     expect(toast.error).toHaveBeenCalledWith("Lỗi mạng");
    // });
});
