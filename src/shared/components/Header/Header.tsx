import { type FC, useState, useCallback } from "react";
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
import { SUPPORTED_LANGUAGES, LanguageCode } from "shared/constants/languages";
import Logo from "shared/components/Logo/Logo";

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

  const languageMenuItems = SUPPORTED_LANGUAGES.map((lang) => ({
    key: lang.code,
    label: (
      <span className="flex items-center gap-2">
        <span>{lang.flag}</span>
        <span>{lang.label}</span>
      </span>
    ),
    onClick: () => changeLanguage(lang.code),
  }));

  const navLinks = [
    { label: t("header:home"), path: APP_ROUTES.HOME },
    { label: t("header:showtimes"), path: `${APP_ROUTES.HOME}#showtimes` },
    { label: t("header:cinemas"), path: `${APP_ROUTES.HOME}#cinemas` },
  ];

  const isDark = themeMode === "dark";
  const currentLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (i18n.language || LanguageCode.VI)
  ) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to={APP_ROUTES.HOME}>
          <Logo size="md" />
        </NavLink>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-text-secondary"
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
            icon={isDark ? <SunOutlined className="text-secondary" /> : <MoonOutlined className="text-text-primary" />}
            onClick={toggleTheme}
            className="hover:bg-surface-hover rounded-lg"
            title={isDark ? "Light Mode" : "Dark Mode"}
          />

          {/* Language Switcher Dropdown */}
          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={<GlobalOutlined className="text-text-secondary" />}
              className="hover:bg-surface-hover font-medium text-xs text-text-primary flex items-center gap-1.5"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </Button>
          </Dropdown>

          {/* User Auth Info */}
          {userLogin ? (
            <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border border-border">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-primary"
              />
              <span className="text-sm font-medium text-text-primary">
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
                className="border-border text-text-primary hover:text-primary hover:border-primary"
              >
                {t("header:login")}
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(APP_ROUTES.REGISTER)}
                className="bg-primary hover:bg-primary-hover border-none font-semibold"
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
            icon={isDark ? <SunOutlined className="text-secondary" /> : <MoonOutlined className="text-text-primary" />}
            onClick={toggleTheme}
          />
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl text-text-primary" />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  size="small"
                  onClick={() => changeLanguage(lang.code)}
                  type={i18n.language === lang.code ? "primary" : "default"}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="bg-surface text-text-primary"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-primary py-2 border-b border-border"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            {userLogin ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar icon={<UserOutlined />} className="bg-primary" />
                  <div>
                    <p className="font-medium text-text-primary">
                      {userLogin.hoTen}
                    </p>
                    <p className="text-xs text-text-secondary">{userLogin.email}</p>
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
                  className="bg-primary hover:bg-primary-hover border-none font-semibold"
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
