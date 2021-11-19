import axios from "axios";
import { quanLyNguoiDungService } from "../../services/QuanLyNguoiDung";
import {
   NGUOI_DUNG_DANG_KY,NGUOI_DUNG_DANG_NHAP,SET_DANH_SACH_NGUOI_DUNG,SET_FULL_INFO_NGUOI_DUNG,SET_THONG_TIN_NGUOI_DUNG
} from "./types/QuanLyNguoiDungType";
import { history } from "../../App";
import {DOMAIN,TOKENCYBERSOFT,TOKEN,GROUPID} from "../../util/settings/config"
import swal from "sweetalert";

export const dangNhapAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangNhap(thongTinDangNhap);

      if (result.data.statusCode === 200) {
        dispatch({
          type: NGUOI_DUNG_DANG_NHAP,
          thongTinDangNhap: result.data.content,
        });
        swal({
          title: "Đăng nhập thành công",
          icon: "success",
          button: "OK",
        });
        //Chuyển hướng đăng nhập về trang trước đó
        history.push('/home');
      }

      console.log("result", result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const dangKyAction = (thongTinDangKy) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangKy(thongTinDangKy);
      if (result.data.statusCode === 200) {
        dispatch({
          type: NGUOI_DUNG_DANG_KY,
          thongTinDangNhap: result.data.content,
        });
        swal({
          title: "Đăng ký thành công",
          icon: "success",
          button: "OK",
        });
        history.push('/login');
        
      }
    } catch (error) {
      console.log(error?.response.data);
      swal({
        title: "Đăng ký thất bại",
        text: error?.response.data.content,
        icon: "warning",
        button: "OK",
      });
    }
  };
};

export const layThongTinNguoiDungAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.layThongTinNguoiDung();

      if (result.data.statusCode === 200) {
        dispatch({
          type: SET_THONG_TIN_NGUOI_DUNG,
          thongTinNguoiDung: result.data.content,
        });
      }

      console.log("result", result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};


export const layFullInfoNguoiDungAction = (taiKhoan) => {
  return async dispatch => {
      try {
          const result = await axios({
              url: `${DOMAIN}/api/QuanLyNguoiDung/LayThongTinNguoiDung`,
              method: 'POST',
              params: {
                  taiKhoan: taiKhoan,
              },
              headers: {
                  TokenCybersoft: TOKENCYBERSOFT,
                  Authorization: "Bearer " + localStorage.getItem(TOKEN),
              }
          })
          dispatch({
              type: SET_FULL_INFO_NGUOI_DUNG,
              fullInfoNguoiDung: result.data.content,
          })

      } catch (err) {
          console.log(err.response?.data);
      }
  }
}


export const capNhatNguoiDungAction = (thongTinNguoiDung) => {
  return async dispatch => {
      try {
          const result = await axios({
              url: `${DOMAIN}/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
              method: 'POST',
              data: thongTinNguoiDung,
              headers: {
                  TokenCybersoft: TOKENCYBERSOFT,
                  Authorization: "Bearer " + localStorage.getItem(TOKEN),
              }
          })
          if (result.data.statusCode === 200) {
              alert('Cập nhật thành công');
              history.push('/admin/users');
              dispatch(layDanhSachListNguoiDungAction);
          }
          console.log({ result });
      }
      catch (err) {
          console.log(err.response?.data);
      }
  }
}


export const layDanhSachListNguoiDungAction = (tuKhoa = '') => {
  return async dispatch => {
      if (tuKhoa.trim() !== '') {
          try {
              const result = await axios({
                  url: `https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/LayDanhSachNguoiDung`,
                  method: 'GET',
                  params: {
                      MaNhom: GROUPID,
                      tuKhoa: tuKhoa,
                  },

                  headers: {
                      TokenCybersoft: TOKENCYBERSOFT,
                  }
              })
              console.log(result);
              if (result.data.statusCode === 200) {
                  dispatch({
                      type: SET_DANH_SACH_NGUOI_DUNG,
                      danhSachNguoiDung: result.data.content,
                  })
              }
          }
          catch (err) {
              console.log(err.response?.data);
          }
      }
      else {
          try {
              const result = await axios({
                  url: `https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/LayDanhSachNguoiDung`,
                  method: 'GET',
                  params: {
                      MaNhom: GROUPID
                  },
                  headers: {
                      TokenCybersoft: TOKENCYBERSOFT,
                  }
              })

              if (result.data.statusCode === 200) {
                  dispatch({
                      type: SET_DANH_SACH_NGUOI_DUNG,
                      danhSachNguoiDung: result.data.content,
                  })
              }
          }
          catch (err) {
              console.log(err.response?.data);
          }
      }

  }
}

export const xoaNguoiDungAction = (taiKhoan) => {
  return async dispatch => {
      try {
          const result = await axios({
              url: `${DOMAIN}/api/QuanLyNguoiDung/XoaNguoiDung`,
              method: 'DELETE',
              params: {
                  TaiKhoan: taiKhoan
              },
              headers: {
                  TokenCybersoft: TOKENCYBERSOFT,
                  Authorization: "Bearer " + localStorage.getItem(TOKEN),
              }
          })
          console.log({ result });
          if (result.data.statusCode === 200) {
              alert("Xoá User thành công");
              history.push('/admin/users')
              dispatch(layDanhSachListNguoiDungAction());
          }
      }
      catch (err) {
          const error = { ...err }
          // console.log(err.response?.data);
          alert(error.response?.data.content);
      }
  }
}