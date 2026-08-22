import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "shared/constants/routes";

const Footer: FC = () => {
  return (
    <footer className="bg-[#151822] border-t border-[#262B3A] text-[#9AA0B4] py-8 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F2545B] flex items-center justify-center font-bold text-white text-lg">
                C
              </div>
              <span className="text-lg font-bold text-[#F5F6FA]">Cinefix</span>
            </div>
            <p className="text-sm leading-relaxed text-[#9AA0B4]">
              Hệ thống đặt vé phim chiếu rạp hàng đầu. Trải nghiệm điện ảnh đỉnh cao cùng Cinefix.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-[#F5F6FA] uppercase tracking-wider mb-2">
              Điều hướng
            </h4>
            <NavLink to={APP_ROUTES.HOME} className="text-sm hover:text-[#F2545B] transition-colors">
              Trang chủ
            </NavLink>
            <NavLink to={`${APP_ROUTES.HOME}#showtimes`} className="text-sm hover:text-[#F2545B] transition-colors">
              Lịch chiếu phim
            </NavLink>
            <NavLink to={`${APP_ROUTES.HOME}#cinemas`} className="text-sm hover:text-[#F2545B] transition-colors">
              Hệ thống cụm rạp
            </NavLink>
          </div>

          {/* Policy & Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-[#F5F6FA] uppercase tracking-wider mb-2">
              Thông tin
            </h4>
            <span className="text-sm text-[#9AA0B4]">Điều khoản sử dụng</span>
            <span className="text-sm text-[#9AA0B4]">Chính sách bảo mật</span>
            <span className="text-sm text-[#9AA0B4]">Chăm sóc khách hàng</span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#262B3A] flex flex-col md:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Cinefix. Built with React, Tailwind & Ant Design.</p>
          <p className="text-[#9AA0B4]">Designed by Stranger Developer</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
