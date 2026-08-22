import { type FC } from "react";
import { AuthLayoutProps } from "../types/auth.types";
import AuthShowcase from "./AuthShowcase";
import Logo from "shared/components/Logo/Logo";

/**
 * EN: Shared shell for the Login/Register screens: a movie showcase on the
 * left (hidden below `lg`) and the form panel (passed as `children`) on the
 * right. Keeping this layout in one place avoids duplicating the
 * card/logo/title markup between Login.tsx and Register.tsx.
 * VI: Khung dùng chung cho màn hình Đăng nhập/Đăng ký: showcase phim ở bên
 * trái (ẩn dưới breakpoint `lg`) và khung form (truyền vào qua `children`)
 * ở bên phải. Gom layout vào một nơi để tránh lặp lại markup card/logo/tiêu
 * đề giữa Login.tsx và Register.tsx.
 * @param children - EN: the form content rendered inside the card. VI: nội dung form hiển thị trong card.
 * @param title - EN: heading shown above the form. VI: tiêu đề hiển thị phía trên form.
 * @param subtitle - EN: optional supporting text under the title. VI: dòng mô tả phụ (tuỳ chọn) dưới tiêu đề.
 * @returns EN: the rendered two-column auth screen. VI: màn hình xác thực hai cột đã render.
 */
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
