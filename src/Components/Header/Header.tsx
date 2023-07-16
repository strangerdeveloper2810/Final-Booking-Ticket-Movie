import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "Redux/store";
import { settings, ACCESS_TOKEN, USER_LOGIN } from "../../util/setting";
const Header: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  const { userLogin } = useSelector((state: RootState) => state.UserSaga);

  const handleLogOut = React.useCallback(() => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);

    settings.clearStorage(ACCESS_TOKEN);
    settings.clearStorage(USER_LOGIN);

    window.location.reload();
  }, []);

  const renderLoginUI = React.useMemo(() => {
    return userLogin ? (
      <>
        <div>
          <p className="py-6 pr-4 text-lg">Hello {userLogin.hoTen}</p>
        </div>
        <div className="relative top-5">
          <button
            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </>
    ) : (
      <>
        <li>
          <NavLink to={"/login"} className="block py-2 pl-3 pr-4 ">
            Login
          </NavLink>
        </li>

        <li>
          <NavLink to={"/register"} className="block py-2 pl-3 pr-4">
            Register
          </NavLink>
        </li>
      </>
    );
  }, [userLogin, handleLogOut]);
  return (
    <React.Fragment>
      <header>
        <nav className="border-gray-200">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
            <NavLink to={"/"} className="flex items-center">
              <img src="./img/Movie.png" className="h-8 mr-3" alt="Cinefix" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Cinefix
              </span>
            </NavLink>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={`${
                isMenuOpen ? "block" : "hidden"
              } w-full md:block md:w-auto mt-4`}
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
                <li>
                  <NavLink
                    to={"/"}
                    className="block py-2 pl-3 pr-4"
                    aria-current="page"
                  >
                    Home
                  </NavLink>
                </li>

                <li>
                  <NavLink to={"/"} className="block py-2 pl-3 pr-4">
                    Contact
                  </NavLink>
                </li>

                <li>
                  <NavLink to={"/"} className="block py-2 pl-3 pr-4">
                    New
                  </NavLink>
                </li>
                {renderLoginUI}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </React.Fragment>
  );
};
export default React.memo(Header);
