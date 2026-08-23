import { type FC, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Drawer, Dropdown, MenuProps, Avatar, Tag } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  DashboardOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import find from "lodash/find";
import { settings, ACCESS_TOKEN, USER_LOGIN, APP_ROUTES, SUPPORTED_LANGUAGES, LanguageCode } from "@cinefix/utils";
import Logo from "../Logo/Logo";
import SearchModal from "../SearchModal/SearchModal";
import { useTheme } from "../Theme/ThemeContext";

const Header: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userLogin = useSelector((state: any) => state.UserSaga?.userLogin);
  const { themeMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation(["header", "common"]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToHash = (hash: string) => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: t("header:home"), href: APP_ROUTES.HOME, hash: null },
    { label: t("header:schedule"), href: `${APP_ROUTES.HOME}#schedule`, hash: "#schedule" },
    { label: t("header:cinemas"), href: `${APP_ROUTES.HOME}#cinemas`, hash: "#cinemas" },
  ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setDrawerOpen(false);
    if (link.hash && location.pathname === APP_ROUTES.HOME) {
      scrollToHash(link.hash);
    } else {
      navigate(link.href);
    }
  };

  const handleLogout = () => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);
    window.location.reload();
  };

  const currentLang =
    find(SUPPORTED_LANGUAGES, (item) => item.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
  };

  const languageMenuItems: MenuProps["items"] = map(
    SUPPORTED_LANGUAGES,
    (item) => ({
      key: item.code,
      label: (
        <div className="flex items-center gap-2 py-1 px-2">
          <span className="text-base">{item.flag}</span>
          <span className="font-medium text-xs text-text-primary">{item.label}</span>
        </div>
      ),
      onClick: () => changeLanguage(item.code),
    })
  );

  const isAdmin = userLogin?.maLoaiNguoiDung === "QuanTri";

  const userDropdownMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("header:profile"),
      onClick: () => navigate(APP_ROUTES.PROFILE),
    },
    ...(isAdmin
      ? [
          {
            key: "admin",
            icon: <DashboardOutlined className="text-secondary" />,
            label: (
              <span className="font-bold text-secondary flex items-center justify-between gap-2">
                Trang Admin <Tag color="gold" className="m-0 text-[10px]">ADMIN</Tag>
              </span>
            ),
            onClick: () => navigate(APP_ROUTES.ADMIN),
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-primary" />,
      label: <span className="text-primary font-semibold">{t("header:logout")}</span>,
      onClick: handleLogout,
    },
  ];

  const isDark = themeMode === "dark";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-border transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={APP_ROUTES.HOME} className="flex items-center">
          <Logo size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {map(navLinks, (link) => {
            const isActive =
              location.pathname === link.href ||
              (link.hash && location.hash === link.hash);
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            type="default"
            icon={<SearchOutlined className="text-primary" />}
            onClick={() => setSearchModalOpen(true)}
            className="bg-background border-border text-text-secondary hover:text-primary hover:border-primary/50 text-xs rounded-xl flex items-center gap-2 py-1 px-3 shadow-sm"
          >
            <span>{t("common:search", { defaultValue: "Tìm Phim..." })}</span>
            <span className="bg-surface px-1.5 py-0.5 rounded text-[10px] font-mono border border-border text-text-secondary">
              ⌘K
            </span>
          </Button>

          <Button
            type="text"
            icon={isDark ? <SunOutlined className="text-secondary" /> : <MoonOutlined className="text-text-primary" />}
            onClick={toggleTheme}
            className="hover:bg-surface-hover rounded-lg"
            title={isDark ? "Light Mode" : "Dark Mode"}
          />

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
            <div className="flex items-center gap-2">
              <Button
                type="text"
                onClick={() => navigate(APP_ROUTES.LOGIN)}
                className="text-text-primary hover:text-primary font-semibold text-sm"
              >
                {t("header:login")}
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(APP_ROUTES.REGISTER)}
                className="bg-primary hover:bg-primary-hover border-none font-semibold text-sm shadow-md shadow-primary/20"
              >
                {t("header:register")}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="text"
            icon={isDark ? <SunOutlined className="text-secondary" /> : <MoonOutlined className="text-text-primary" />}
            onClick={toggleTheme}
            className="rounded-lg"
          />

          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <Button type="text" className="px-2 font-semibold text-xs">
              {currentLang.flag}
            </Button>
          </Dropdown>

          <Button
            type="text"
            icon={<MenuOutlined className="text-text-primary text-lg" />}
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg"
          />
        </div>
      </div>

      <Drawer
        title={
          <div className="flex items-center justify-between pr-4">
            <Logo size="sm" />
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="bg-surface border-l border-border text-text-primary md:hidden"
        width={280}
      >
        <div className="flex flex-col gap-6 pt-2">
          <nav className="flex flex-col gap-3">
            {map(navLinks, (link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className="text-left py-2.5 px-3 rounded-lg font-semibold text-text-primary hover:bg-surface-hover transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-border pt-6">
            {userLogin ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                  <Avatar icon={<UserOutlined />} className="bg-primary" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-text-primary truncate">
                      {userLogin.hoTen}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      @{userLogin.taiKhoan}
                    </p>
                  </div>
                </div>
                <Button
                  block
                  icon={<UserOutlined />}
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(APP_ROUTES.PROFILE);
                  }}
                  className="bg-background border-border text-text-primary font-semibold"
                >
                  {t("header:profile")}
                </Button>
                {isAdmin && (
                  <Button
                    block
                    icon={<DashboardOutlined />}
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate(APP_ROUTES.ADMIN);
                    }}
                    className="bg-secondary text-black font-bold border-none"
                  >
                    Trang Admin
                  </Button>
                )}
                <Button
                  block
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="font-semibold"
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

      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
};

export default Header;
