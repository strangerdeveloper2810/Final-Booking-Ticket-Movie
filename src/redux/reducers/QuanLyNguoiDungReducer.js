import { TOKEN, USER_LOGIN } from "../../util/settings/config";
import { NGUOI_DUNG_DANG_NHAP, SET_DANH_SACH_NGUOI_DUNG, SET_FULL_INFO_NGUOI_DUNG, SET_THONG_TIN_NGUOI_DUNG } from "../actions/types/QuanLyNguoiDungType";

let user = {};
if (localStorage.getItem(USER_LOGIN)) {
    user = JSON.parse(localStorage.getItem(USER_LOGIN));
}


const initialState = {
    userLogin: user,

    thongTinNguoiDung: {

    },

    fullInfoNguoiDung: {

    },

    danhSachNguoiDung: []
}



export const QuanLyNguoiDungReducer = (state = initialState, action) => {

    switch (action.type) {

        case NGUOI_DUNG_DANG_NHAP: {
            const { thongTinDangNhap } = action;
            localStorage.setItem(USER_LOGIN, JSON.stringify(thongTinDangNhap));
            localStorage.setItem(TOKEN, thongTinDangNhap.accessToken);
            return { ...state, userLogin: thongTinDangNhap }
        }

        case SET_THONG_TIN_NGUOI_DUNG: {
            state.thongTinNguoiDung = action.thongTinNguoiDung;
            return { ...state };
        }

        case SET_FULL_INFO_NGUOI_DUNG: {
            state.fullInfoNguoiDung = action.fullInfoNguoiDung;
            return { ...state }
        }
        case SET_DANH_SACH_NGUOI_DUNG: {
            state.danhSachNguoiDung = action.danhSachNguoiDung;
        }



        default:
            return { ...state }
    }
}