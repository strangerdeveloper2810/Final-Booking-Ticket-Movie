import {SET_CHI_TIET_FILM,SET_DANH_SACH_PHIM,SET_FILM_DANG_CHIEU,SET_FILM_SAP_CHIEU,SET_LICH_CHIEU_FILM,SET_THONG_TIN_PHIM_CHINH_SUA} from "../actions/types/QuanLyPhimType"




const initialState = {
    arrFilm: [
        {
            "maPhim": 7822,
            "tenPhim": "Wonder Woman 2",
            "biDanh": "wonder-woman-2",
            "trailer": "Wonder Woman 2",
            "hinhAnh": "https://movienew.cybersoft.edu.vn/hinhanh/wonder-woman-2_gp01.jpg",
            "moTa": "GGretel & Hansel là một bộ phim kinh dị giả tưởng đen tối năm 2020 dựa trên câu chuyện dân gian Đức \"Hansel và Gretel\" của Anh em nhà Grimm. Phim do Oz Perkins đạo diễn, Fred Berger, Brian Kavanaugh-Jones và Dan Kagan sản xuất, với kịch bản của Rob Hayes.",
            "maNhom": "GP01",
            "ngayKhoiChieu": "2021-10-31T16:36:56.65",
            "danhGia": 10,
            "hot": false,
            "dangChieu": false,
            "sapChieu": true
        },

    ],
    dangChieu: true,
    sapChieu: true,
    arrFilmDefault: [],

    filmDetail: {},
    filmSchedule: [],

    thongTinPhimChinhSua: {},
}


export const QuanLyPhimReducer = (state=initialState,action ) => {
    switch (action.type) {
        case SET_DANH_SACH_PHIM: {
            state.arrFilm = action.arrFilm;
            state.arrFilmDefault = state.arrFilm;
            return { ...state };
        }

        case SET_FILM_DANG_CHIEU: {
            state.dangChieu = !state.dangChieu
            state.arrFilm = state.arrFilmDefault
                .filter(film => film.dangChieu === state.dangChieu)
            return { ...state }
        }
        case SET_FILM_SAP_CHIEU: {
            state.sapChieu = !state.sapChieu
            state.arrFilm = state.arrFilmDefault
                .filter(film => film.sapChieu === state.sapChieu)
            return { ...state }
        }
        case SET_CHI_TIET_FILM: {
            state.filmDetail = action.filmDetail
            return { ...state }
        }
        case SET_LICH_CHIEU_FILM: {
            state.filmSchedule = action.filmSchedule;
            return { ...state };
        }
        case SET_THONG_TIN_PHIM_CHINH_SUA: {
            state.thongTinPhimChinhSua = action.thongTinPhimChinhSua
            return { ...state }
        }
        default:
            return { ...state };
    }
}