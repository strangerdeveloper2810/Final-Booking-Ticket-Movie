import React, { FC, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Drawer, Avatar, Dropdown } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { RootState } from "app/store";
import { settings, ACCESS_TOKEN, USER_LOGIN } from "shared/utils/setting";
import { APP_ROUTES } from "shared/constants/routes";
import { useTheme } from "shared/theme/ThemeContext";

const Header: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);
  const { themeMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation(["header", "common"]);

  const handleLogOut = useCallback(() => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);
    window.location.reload();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageMenuItems = [
    {
      key: "vi",
      label: (
        <span className="flex items-center gap-2">
          <span>🇻🇳</span>
          <span>Tiếng Việt</span>
        </span>
      ),
      onClick: () => changeLanguage("vi"),
    },
    {
      key: "en",
      label: (
        <span className="flex items-center gap-2">
          <span>🇬🇧</span>
          <span>English</span>
        </span>
      ),
      onClick: () => changeLanguage("en"),
    },
  ];

  const navLinks = [
    { label: t("header:home"), path: APP_ROUTES.HOME },
    { label: t("header:showtimes"), path: `${APP_ROUTES.HOME}#showtimes` },
    { label: t("header:cinemas"), path: `${APP_ROUTES.HOME}#cinemas` },
  ];

  const isDark = themeMode === "dark";

  return (
    <header className="sticky top-0 z-50 bg-[#151822]/90 dark:bg-[#151822]/90 bg-white/90 backdrop-blur-md border-b border-[#262B3A] dark:border-[#262B3A] border-gray-200 transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to={APP_ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#F2545B] flex items-center justify-center font-bold text-white text-xl shadow-md shadow-[#F2545B]/30 group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="text-xl font-bold text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-900 tracking-wide">
            Cinefix
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[#F2545B] ${
                  isActive ? "text-[#F2545B]" : "text-[#9AA0B4] dark:text-[#9AA0B4] text-gray-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Controls (Theme + Language + Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <Button
            type="text"
            icon={isDark ? <SunOutlined className="text-[#FFC857]" /> : <MoonOutlined className="text-gray-700" />}
            onClick={toggleTheme}
            className="hover:bg-white/10 dark:hover:bg-white/10 rounded-lg"
            title={isDark ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
          />

          {/* Language Switcher Dropdown with Country Flags */}
          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={<GlobalOutlined className="text-[#9AA0B4] dark:text-[#9AA0B4] text-gray-700" />}
              className="hover:bg-white/10 font-medium uppercase text-xs text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-800 flex items-center gap-1"
            >
              <span>{i18n.language === "en" ? "🇬🇧 EN" : "🇻🇳 VI"}</span>
            </Button>
          </Dropdown>

          {/* User Auth Info */}
          {userLogin ? (
            <div className="flex items-center gap-3 bg-[#0B0D12]/60 dark:bg-[#0B0D12]/60 bg-gray-100 px-3 py-1.5 rounded-lg border border-[#262B3A] dark:border-[#262B3A] border-gray-300">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-[#F2545B]"
              />
              <span className="text-sm font-medium text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-800">
                {userLogin.hoTen}
              </span>
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                size="small"
                onClick={handleLogOut}
                className="hover:bg-red-500/10"
              >
                {t("header:logout")}
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="default"
                onClick={() => navigate(APP_ROUTES.LOGIN)}
                className="border-[#262B3A] dark:border-[#262B3A] border-gray-300 text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-800 hover:text-[#F2545B] hover:border-[#F2545B]"
              >
                {t("header:login")}
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(APP_ROUTES.REGISTER)}
                className="bg-[#F2545B] hover:bg-[#FF6B72]"
              >
                {t("header:register")}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Controls & Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="text"
            icon={isDark ? <SunOutlined className="text-[#FFC857]" /> : <MoonOutlined className="text-gray-700" />}
            onClick={toggleTheme}
          />
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl text-[#F5F6FA] dark:text-[#F5F6FA] text-gray-800" />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#F2545B] flex items-center justify-center font-bold text-white">
                C
              </div>
              <span className="font-bold text-[#F5F6FA] dark:text-[#F5F6FA]">Cinefix</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="small"
                onClick={() => changeLanguage("vi")}
                type={i18n.language === "vi" ? "primary" : "default"}
              >
                🇻🇳 VI
              </Button>
              <Button
                size="small"
                onClick={() => changeLanguage("en")}
                type={i18n.language === "en" ? "primary" : "default"}
              >
                🇬🇧 EN
              </Button>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="bg-[#151822] dark:bg-[#151822] text-[#F5F6FA]"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                className="text-base font-medium text-[#9AA0B4] hover:text-[#F2545B] py-2 border-b border-[#262B3A]"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-[#262B3A]">
            {userLogin ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar icon={<UserOutlined />} className="bg-[#F2545B]" />
                  <div>
                    <p className="font-medium text-[#F5F6FA]">
                      {userLogin.hoTen}
                    </p>
                    <p className="text-xs text-[#9AA0B4]">{userLogin.email}</p>
                  </div>
                </div>
                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogOut();
                  }}
                  className="mt-2"
                >
                  {t("header:logout")}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button
                  block
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(APP_ROUTES.LOGIN);
                  }}
                >
                  {t("header:login")}
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(APP_ROUTES.REGISTER);
                  }}
                  className="bg-[#F2545B] hover:bg-[#FF6B72]"
                >
                  {t("header:register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
