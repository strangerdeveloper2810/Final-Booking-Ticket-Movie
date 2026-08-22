import React, { FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";
import Logo from "shared/components/Logo/Logo";

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background transition-colors">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showText={false} />
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
