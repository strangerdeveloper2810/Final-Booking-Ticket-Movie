import React, { FC, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Drawer, Avatar } from "antd";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { RootState } from "app/store";
import { settings, ACCESS_TOKEN, USER_LOGIN } from "shared/utils/setting";

const Header: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);

  const handleLogOut = useCallback(() => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);
    settings.clearStorage(ACCESS_TOKEN);
    settings.clearStorage(USER_LOGIN);
    window.location.reload();
  }, []);

  const navLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Lịch chiếu", path: "/#showtimes" },
    { label: "Cụm rạp", path: "/#cinemas" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#151822]/90 backdrop-blur-md border-b border-[#262B3A]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#F2545B] flex items-center justify-center font-bold text-white text-xl shadow-md shadow-[#F2545B]/30 group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="text-xl font-bold text-[#F5F6FA] tracking-wide">
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
                  isActive ? "text-[#F2545B]" : "text-[#9AA0B4]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {userLogin ? (
            <div className="flex items-center gap-3 bg-[#0B0D12]/60 px-3 py-1.5 rounded-lg border border-[#262B3A]">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-[#F2545B]"
              />
              <span className="text-sm font-medium text-[#F5F6FA]">
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
                Đăng xuất
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="default"
                onClick={() => navigate("/login")}
                className="border-[#262B3A] text-[#F5F6FA] hover:text-[#F2545B] hover:border-[#F2545B]"
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/register")}
                className="bg-[#F2545B] hover:bg-[#FF6B72]"
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined className="text-xl text-[#F5F6FA]" />}
          onClick={() => setDrawerOpen(true)}
          className="md:hidden"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#F2545B] flex items-center justify-center font-bold text-white">
              C
            </div>
            <span className="font-bold text-[#F5F6FA]">Cinefix</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="bg-[#151822] text-[#F5F6FA]"
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
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button
                  block
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/login");
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/register");
                  }}
                  className="bg-[#F2545B] hover:bg-[#FF6B72]"
                >
                  Đăng ký
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
