import { quanLyPhimService } from "../../services/QuanLyPhimService";
import { SET_CHI_TIET_FILM, SET_DANH_SACH_PHIM, SET_LICH_CHIEU_FILM, SET_THONG_TIN_PHIM_CHINH_SUA } from "./types/QuanLyPhimType";
import { history } from '../../App'
import { DOMAIN, TOKEN, TOKENCYBERSOFT } from "../../util/settings/config";
import axios from "axios";

export const layThongTinChiTietFilmAction = (id) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: 'https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayThongTinPhim',
                method: 'GET',
                params: {
                    MaPhim: id,
                },
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                }
            })
            dispatch({
                type: SET_CHI_TIET_FILM,
                filmDetail: result.data.content,
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}

export const layThongTinLichChieuTheoFilmAction = (id) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: 'https://movienew.cybersoft.edu.vn/api/QuanLyRap/LayThongTinLichChieuPhim',
                method: 'GET',
                params: {
                    MaPhim: id,
                },
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                }
            })
            dispatch({
                type: SET_LICH_CHIEU_FILM,
                filmSchedule: result.data.content
            })
            // console.log(result.data.content)
        }
        catch (err) {
            console.log(err.response?.data);
        }
    }
}


export const layDanhSachPhimAction = (tenPhim = '') => {


    return async (dispatch) => {
        try {
            //Sử dụng tham số thamSo
            const result = await quanLyPhimService.layDanhSachPhim(tenPhim);

            //Sau khi lấy dữ liệu từ api về => redux (reducer)
            dispatch({
                type: SET_DANH_SACH_PHIM,
                arrFilm: result.data.content
            })
        } catch (errors) {
            console.log('errors', errors)
        }
    };
}

export const themPhimUploadHinhAction = (formData) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyPhim/ThemPhimUploadHinh`,
                method: "POST",
                data: formData,
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                }
            })
            alert('Thêm phim thành công');

        }
        catch (err) {
            console.log(err.response?.data);
        }
    }
}

export const layThongTinPhimChinhSuaAction = (maPhim) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyPhim/LayThongTinPhim`,
                method: "GET",
                params: {
                    MaPhim: maPhim,
                },
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                },
            })
            dispatch({
                type: SET_THONG_TIN_PHIM_CHINH_SUA,
                thongTinPhimChinhSua: result.data.content
            })
        }
        catch (err) {
            console.log(err.response?.data)
        };
    }
}


export const capNhatPhimAction = (formData) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyPhim/CapNhatPhimUpload`,
                method: "POST",
                data: formData,
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT,
                    Authorization: "Bearer " + localStorage.getItem(TOKEN),
                }
            })
            alert('Cập nhật Phim thành công')

            dispatch(layDanhSachPhimAction());
            history.push('/admin/films');

        }
        catch (err) {
            console.log(err.response?.data);
        }
    }
}


export const xoaPhimAction = (maPhim) => {
    return async dispatch => {
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyPhim/XoaPhim`,
                method: 'DELETE',
                params: {
                    MaPhim: maPhim
                },
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT,
                    Authorization: "Bearer " + localStorage.getItem(TOKEN),
                }
            })
            console.log(result.data.content);
            alert("Xoá phim thành công");
            dispatch(layDanhSachPhimAction());

        }
        catch (err) {
            console.log(err.response?.data);
        }
    }
}