import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchema } from "./validation/validationSchema";
import { UserRegister } from "Redux/types/UserType";
import { AppDispatch } from "Redux/store";
import { USER_REGISTER_API } from "Redux/constant/UserConstants";
export const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleSubmitRegister = React.useCallback(
    (values: UserRegister) => {
      dispatch({
        type: USER_REGISTER_API,
        payload: values,
      });
    },
    [dispatch]
  );
  const formikBag = useFormik<UserRegister>({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      maNhom: "GP00",
      hoTen: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmitRegister,
  });

  return (
    <div className="register">
      <form
        className="lg:w-1/2 xl:max-w-screen-sm"
        onSubmit={formikBag.handleSubmit}
      >
        <div className="bg-transparent min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-violet-800 px-6 py-8 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-3xl text-center">Sign up</h1>
              <div>
                <input
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                  placeholder="User Name"
                  name="taiKhoan"
                  value={formikBag.values.taiKhoan}
                  onBlur={formikBag.handleBlur}
                  onChange={formikBag.handleChange}
                />
                {formikBag.errors.taiKhoan && (
                  <div className="text-red-700 font-semibold">
                    {formikBag.errors.taiKhoan}
                  </div>
                )}
              </div>

              <div>
                <input
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                  placeholder="Password"
                  name="matKhau"
                  type="password"
                  value={formikBag.values.matKhau}
                  onBlur={formikBag.handleBlur}
                  onChange={formikBag.handleChange}
                />
                {formikBag.errors.matKhau && (
                  <div className="text-red-700 font-semibold">
                    {formikBag.errors.matKhau}
                  </div>
                )}
              </div>

              <div>
                <input
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={formikBag.values.email}
                  onBlur={formikBag.handleBlur}
                  onChange={formikBag.handleChange}
                />
                {formikBag.errors.email && (
                  <div className="text-red-700 font-semibold">
                    {formikBag.errors.email}
                  </div>
                )}
              </div>

              <div>
                <input
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                  placeholder="Phone"
                  name="soDt"
                  type="text"
                  value={formikBag.values.soDt}
                  onBlur={formikBag.handleBlur}
                  onChange={formikBag.handleChange}
                />
                {formikBag.errors.soDt && (
                  <div className="text-red-700 font-semibold">
                    {formikBag.errors.soDt}
                  </div>
                )}
              </div>

              <div>
                <input
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                  placeholder="Full Name"
                  name="hoTen"
                  type="text"
                  value={formikBag.values.hoTen}
                  onBlur={formikBag.handleBlur}
                  onChange={formikBag.handleChange}
                />
                {formikBag.errors.hoTen && (
                  <div className="text-red-700 font-semibold">
                    {formikBag.errors.hoTen}
                  </div>
                )}
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

            <div className="mt-12 text-sm font-display font-extrabold text-gray-700 text-center">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="cursor-pointer text-indigo-600 hover:text-indigo-800"
              >
                Log in
              </NavLink>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default React.memo(Register);
