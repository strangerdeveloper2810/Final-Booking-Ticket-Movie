import { type FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";
import AuthShowcase from "./AuthShowcase";
import Logo from "shared/components/Logo/Logo";

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-full h-screen min-h-screen overflow-hidden bg-background grid grid-cols-1 lg:grid-cols-2 items-stretch transition-colors">
      {/* Left Column: Full-Height Edge-to-Edge TMDB Movie Showcase */}
      <div className="hidden lg:block h-full w-full">
        <AuthShowcase />
      </div>

      {/* Right Column: Auth Form Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 w-full h-full overflow-y-auto">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors">
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
