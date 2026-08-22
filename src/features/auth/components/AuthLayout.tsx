import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#151822] border border-[#262B3A] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Branding Side Panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#F2545B]/20 via-[#151822] to-[#0B0D12] border-r border-[#262B3A] overflow-hidden">
          <div className="relative z-10">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#F2545B] flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-[#F2545B]/40 group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="text-2xl font-extrabold text-[#F5F6FA] tracking-wide">
                Cinefix
              </span>
            </NavLink>
          </div>

          <div className="relative z-10 space-y-4 my-auto">
            <h2 className="text-4xl font-extrabold text-[#F5F6FA] leading-tight">
              Khám Phá Thế Giới Điện Ảnh Đỉnh Cao
            </h2>
            <p className="text-[#9AA0B4] text-base leading-relaxed">
              Đặt vé nhanh chóng, dễ dàng chỉ trong vài bước. Trải nghiệm rạp chiếu chuẩn quốc tế cùng Cinefix.
            </p>
          </div>

          <div className="relative z-10 text-xs text-[#9AA0B4]">
            © {new Date().getFullYear()} Cinefix. All rights reserved.
          </div>

          {/* Glowing Background Orbs */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#F2545B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FFC857]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Form Card Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F6FA] mb-2">
              {title}
            </h1>
            <p className="text-sm text-[#9AA0B4]">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
