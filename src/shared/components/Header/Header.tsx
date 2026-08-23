import { type FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button, Drawer, Avatar, Dropdown } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import find from "lodash/find";
import { RootState } from "app/store";
import { settings, ACCESS_TOKEN, USER_LOGIN } from "shared/utils/setting";
import { APP_ROUTES } from "shared/constants/routes";
import { useTheme } from "shared/theme/ThemeContext";
import { SUPPORTED_LANGUAGES, LanguageCode } from "shared/constants/languages";
import Logo from "shared/components/Logo/Logo";

/**
 * EN: Global site header/navbar shown on every page via `HomeTemplate`. Handles desktop nav
 * links (with hash-scroll behaviour), the language-switcher dropdown, theme toggle, auth
 * state (login/register vs. user info + logout), and a mobile drawer mirroring the same
 * controls for small screens.
 * VI: Header/navbar chung của trang, hiển thị ở mọi trang qua `HomeTemplate`. Xử lý các liên kết
 * điều hướng trên desktop (có cuộn tới id/hash), dropdown đổi ngôn ngữ, nút chuyển theme, trạng thái
 * đăng nhập (đăng nhập/đăng ký hoặc thông tin người dùng + đăng xuất), và một drawer cho di động
 * chứa các control tương tự.
 * @returns EN: the header JSX element. VI: phần tử JSX của header.
 */
const Header: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);
  const { themeMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation(["header", "common"]);

  const scrollToHash = (hash: string) => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        scrollToHash(location.hash);
      }, 200);
    }
  }, [location.hash, location.pathname]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path.includes("#")) {
      e.preventDefault();
      const hash = path.substring(path.indexOf("#"));
      if (location.pathname === APP_ROUTES.HOME) {
        scrollToHash(hash);
      } else {
        navigate(APP_ROUTES.HOME);
        setTimeout(() => {
          scrollToHash(hash);
        }, 300);
      }
    } else {
      if (location.pathname === APP_ROUTES.HOME) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(path);
      }
    }
  };

  const handleLogOut = () => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);
    window.location.reload();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // EN: Build the antd Dropdown `menu.items` shape from the static language list.
  // VI: Dựng dữ liệu `menu.items` cho Dropdown của antd từ danh sách ngôn ngữ tĩnh.
  const languageMenuItems = map(SUPPORTED_LANGUAGES, (lang) => ({
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
  // EN: Look up the active language's metadata (flag/label) for display; fall back to the
  // first supported language if the i18n language code isn't in our list.
  // VI: Tìm thông tin (cờ/tên) của ngôn ngữ đang dùng để hiển thị; nếu mã ngôn ngữ của i18n
  // không có trong danh sách hỗ trợ thì dùng ngôn ngữ đầu tiên làm mặc định.
  const currentLang =
    find(SUPPORTED_LANGUAGES, (l) => l.code === (i18n.language || LanguageCode.VI)) ||
    SUPPORTED_LANGUAGES[0];

  const userDropdownMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("header:profile"),
      onClick: () => navigate(APP_ROUTES.PROFILE),
    },
    ...(userLogin?.maLoaiNguoiDung === "QuanTri"
      ? [
          {
            key: "admin",
            icon: <DashboardOutlined className="text-red-500" />,
            label: t("header:admin"),
            onClick: () => navigate(APP_ROUTES.ADMIN),
          },
        ]
      : []),
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      label: t("header:logout"),
      danger: true,
      onClick: handleLogOut,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to={APP_ROUTES.HOME} onClick={(e) => handleNavClick(e, APP_ROUTES.HOME)}>
          <Logo size="md" />
        </NavLink>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {map(navLinks, (link) => {
            const isHashLink = link.path.includes("#");
            const hash = isHashLink ? link.path.substring(link.path.indexOf("#")) : "";
            const isActive = isHashLink
              ? location.hash === hash
              : location.pathname === APP_ROUTES.HOME && !location.hash;

            return (
              <a
                key={link.label}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-text-secondary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
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
            <Dropdown menu={{ items: userDropdownMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-2.5 bg-background px-3 py-1.5 rounded-lg border border-border cursor-pointer hover:border-primary transition-all shadow-sm">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-primary"
                />
                <span className="text-sm font-semibold text-text-primary">
                  {userLogin.hoTen || userLogin.taiKhoan}
                </span>
              </div>
            </Dropdown>
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
              {map(SUPPORTED_LANGUAGES, (lang) => (
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
            {map(navLinks, (link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={(e) => {
                  setDrawerOpen(false);
                  handleNavClick(e, link.path);
                }}
                className="text-base font-medium text-text-secondary hover:text-primary py-2 border-b border-border"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            {userLogin ? (
              <div className="flex flex-col gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-background border border-border"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(APP_ROUTES.PROFILE);
                  }}
                >
                  <Avatar icon={<UserOutlined />} className="bg-primary" />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {userLogin.hoTen || userLogin.taiKhoan}
                    </p>
                    <p className="text-xs text-text-secondary">{t("header:profile")}</p>
                  </div>
                </div>

                {userLogin.maLoaiNguoiDung === "QuanTri" && (
                  <Button
                    type="primary"
                    danger
                    block
                    icon={<DashboardOutlined />}
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate(APP_ROUTES.ADMIN);
                    }}
                  >
                    {t("header:admin")}
                  </Button>
                )}

                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogOut();
                  }}
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
