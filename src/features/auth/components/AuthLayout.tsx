import React, { FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background transition-colors">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-2xl mx-auto mb-3 shadow-lg shadow-primary/30">
            C
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
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
