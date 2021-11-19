import React  from 'react'
import { useFormik } from 'formik';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { capNhatNguoiDungAction } from '../../../redux/actions/QuanLyNguoiDungAction';

const EditProFile = (props) => {

    const { userLogin } = useSelector(state => state.QuanLyNguoiDungReducer);

    const { fullInfoNguoiDung } = useSelector(state => state.QuanLyNguoiDungReducer)


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            taiKhoan: fullInfoNguoiDung.taiKhoan,
            matKhau: fullInfoNguoiDung.matKhau,
            hoTen: fullInfoNguoiDung.hoTen,
            email: fullInfoNguoiDung.email,
            soDT: fullInfoNguoiDung.soDT,
        },

        onSubmit: values => {
            dispatch(capNhatNguoiDungAction(values));
        }
    })


    const dispatch = useDispatch();
    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            formik.handleSubmit(event);
        }} className="lg:w-1/2 xl:max-w-screen-sm">
            <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
                <div className="cursor-pointer flex items-center">
                    <div>
                        <NavLink to="/">
                           
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
                <h2 className="text-center text-4xl text-red-500 font-display font-semibold lg:text-left xl:text-5xl
              xl:text-bold">Chỉnh sửa Tài khoản</h2>
                <div className="mt-12">
                    <div>
                        <div>
                            <div className="text-sm font-bold text-gray-700 tracking-wide">Tài khoản</div>
                            <input value={formik.values.taiKhoan} name="taiKhoan" onChange={formik.handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type />
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Họ và Tên
                                </div>
                            </div>
                            <input value={formik.values.hoTen} type name="hoTen" onChange={formik.handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Mật Khẩu
                                </div>
                            </div>
                            <input value={formik.values.matKhau} type="password" name="matKhau" onChange={formik.handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Email
                                </div>
                            </div>
                            <input value={formik.values.email} type name="email" onChange={formik.handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Số Điện Thoại
                                </div>
                            </div>
                            <input value={formik.values.soDT} type name="soDT" onChange={formik.handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className="mt-10">
                            <button className="bg-red-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:text-yellow-300
                          shadow-lg">
                                Cập nhật
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    )
}

export default EditProFile
