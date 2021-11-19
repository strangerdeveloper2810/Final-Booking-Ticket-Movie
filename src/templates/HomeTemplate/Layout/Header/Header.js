import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { history } from "../../../../App";
import { Select } from "antd";
import Flag from "react-flagpack";
//Hook đa ngôn ngữ
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import _ from "lodash";
import { TOKEN, USER_LOGIN } from "../../../../util/settings/config";
import { Avatar } from 'antd';

const { Option } = Select;


export default function Header(props) {
  const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);
  const { t, i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };
  const renderLogin = () => {
    if (_.isEmpty(userLogin)) {
      return (
        <Fragment>
          <button
            onClick={() => {
              history.push("/login");
            }}
            className="self-center px-8 py-3 rounded"
          >
            {t("Signin")}
          </button>
          <button
            onClick={() => {
              history.push("/register");
            }}
            className="self-center px-8 py-3 font-semibold rounded bg-violet-600 text-coolGray-50"
          >
            {t("Register")}
          </button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        {" "}
        <button
          onClick={() => {
            history.push('/profile');
          }}
          className="self-center px-8 py-3 rounded"
        >
          <Avatar src="https://joeschmoe.io/api/v1/random" /> {userLogin.hoTen}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(USER_LOGIN);
            localStorage.removeItem(TOKEN);
            history.push("/home");
            window.location.reload();
          }}
          className="text-yellow-500 mr-5"
        >
          Đăng xuất 
        </button>
      </Fragment>
    );
  };
  return (
    <header className="p-4 bg-coolGray-100 text-coolGray-800 bg-gray-700 bg-opacity-40 text-white fixed w-full z-10">
      <div className="container flex justify-between h-16 mx-auto">
        <NavLink
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <img src="https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-movie-cinema-icongeek26-linear-colour-icongeek26.png"
          alt="icon"/>
        </NavLink>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <NavLink
              to="/home"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-violet-600 border-violet-600 text-white"
              activeClassName="border-b-2 border-white"
            >
              Home
            </NavLink>
          </li>
          <li className="flex">
            <a
              href="#hethongrap"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-white"
              activeClassName="border-b-2 border-white"
            >
              Cụm rạp
            </a>
          </li>
          <li className="flex">
            <a
              href="#phim"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-white"
              activeClassName="border-b-2 border-white"
            >
              Phim
            </a>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          {renderLogin()}
          <Select
            defaultValue="Vi"
            style={{ width: 100 }}
            onChange={handleChange}
          >
            <Option value="en">
              <Flag code="USA" gradient="real-linear" size="m" hasDropShadow />
              <span className="text-center text-red-700"> US</span>
            </Option>
            <Option value="Vi">
              <Flag code="VN" gradient="real-linear" size="m" hasDropShadow />
              <span className="text-center text-red-700"> VN</span>
            </Option>
            <Option value="Chi">
              <Flag code="CN" gradient="real-linear" size="m" hasDropShadow />
              <span className="text-center text-red-700"> CN</span>
            </Option>
          </Select>
        </div>
        <button className="p-4 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-coolGray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
