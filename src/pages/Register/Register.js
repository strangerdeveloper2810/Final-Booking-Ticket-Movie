import React from "react";
import { NavLink } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { dangKyAction } from "../../redux/actions/QuanLyNguoiDungAction";
import { GROUPID } from "../../util/settings/config";

const validationSchema = yup.object().shape({
  taiKhoan: yup.string().required("Yêu cầu nhập tên tài khoản"),
  matKhau: yup.string().required("Yêu cầu nhập mật khẩu"),
  hoTen: yup.string().required("Yêu cầu nhập họ tên"),
  email: yup
    .string()
    .required("Yêu cầu nhập email")
    .email("Email không hợp lệ"),
  soDt: yup
    .string()
    .required("Yêu cầu nhập số điện thoại")
    .matches(/^[0-9]+$/g, "Số điện thoại không hợp lệ"),
});
export default function Register(props) {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      hoTen: "",
      soDt: "",
      maNhom: GROUPID,
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      setAllTouched();
      console.log(values);
      dispatch(dangKyAction(values));
    },
  });
  const setAllTouched = useCallback(() => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldTouched(key);
    });
  }, [formik]);

  return (
    <form className="lg:w-1/2 xl:max-w-screen-sm" onSubmit={formik.handleSubmit}>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            <div>
              <input
                className="block border border-grey-light w-full p-3 rounded mb-4"
                placeholder="User Name"
                name="taiKhoan"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.taiKhoan ? (
                <p className="text-red-800">{formik.errors.taiKhoan}</p>
              ) : null}
            </div>

            <div>
              <input
                className="block border border-grey-light w-full p-3 rounded mb-4"
                placeholder="PassWord"
                name="matKhau"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.matKhau ? (
                <p className="text-danger">{formik.errors.matKhau}</p>
              ) : null}
            </div>

            <div>
              <input
                className="block border border-grey-light w-full p-3 rounded mb-4"
                placeholder="Email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email ? (
                <p className="text-danger">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <input
                className="block border border-grey-light w-full p-3 rounded mb-4"
                placeholder="Phone"
                name="soDt"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.soDt ? (
                <p className="text-danger">{formik.errors.soDt}</p>
              ) : null}
            </div>

            <div>
              <input
                className="block border border-grey-light w-full p-3 rounded mb-4"
                placeholder="Full Name"
                name="hoTen"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.hoTen ? (
                <p className="text-danger">{formik.errors.hoTen}</p>
              ) : null}
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
              font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
              shadow-lg"
            >
              Create Account
            </button>
          </div>

          <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
            Already have an account?{" "}
            <NavLink
              to="login"
              className="cursor-pointer text-indigo-600 hover:text-indigo-800"
            >
              Log in
            </NavLink>
          </div>
        </div>
      </div>
    </form>
  );
}
