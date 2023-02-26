import React from "react";
import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <React.Fragment>
      <header>
        <div className="header__left">
          <img src="./img/logo1.png" alt="logo" />
        </div>

        <div className="header__right">
          <div className="content">
            <nav className="header__right__item">
              <ul>
                <li>
                  <NavLink to={"home"}>Home</NavLink>
                </li>

                <li>
                  <NavLink to={""}>Contact</NavLink>
                </li>

                <li>
                  <NavLink to={""}>New</NavLink>
                </li>

                <li>
                  <NavLink to={""}>Application</NavLink>
                </li>

                <li>
                  <button className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Sign Up
                    </span>
                  </button>
                </li>

                <li>
                  <button className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Sign In
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}
