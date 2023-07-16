import React from "react";
import { NavLink } from "react-router-dom";

export const Login: React.FC = () => {
  const idAccount = React.useId();
  const idPassword = React.useId();
  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://source.unsplash.com/random"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="bg-white w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
      >
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Log in to your account
          </h1>
          <form className="mt-6">
            <div>
              <label htmlFor={idAccount} className="block text-gray-700">
                Your account
              </label>
              <input
                type="text"
                placeholder="Enter your account"
                id={idAccount}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor={idPassword} className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                id={idPassword}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full block text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 mt-6"
            >
              Log In
            </button>
          </form>
          <hr className="my-6 border-gray-300 w-full" />

          <p className="mt-8">
            Need an account?{" "}
            <NavLink to="/register">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Create account
                </span>
              </button>
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Login);
