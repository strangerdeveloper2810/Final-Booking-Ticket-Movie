import React, { FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#0B0D12]">
      <div className="w-full max-w-md bg-[#151822] border border-[#262B3A] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#F2545B] flex items-center justify-center font-bold text-white text-2xl mx-auto mb-3 shadow-lg shadow-[#F2545B]/30">
            C
          </div>
          <h2 className="text-2xl font-extrabold text-[#F5F6FA] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#9AA0B4] mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
