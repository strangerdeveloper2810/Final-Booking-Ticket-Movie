import { type FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";
import AuthShowcase from "./AuthShowcase";
import Logo from "shared/components/Logo/Logo";

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[90vh] bg-background grid grid-cols-1 lg:grid-cols-2 items-center justify-center transition-colors">
      {/* Left Column: Dynamic Movie Showcase Poster Panel */}
      <AuthShowcase />

      {/* Right Column: Auth Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors my-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={true} />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
