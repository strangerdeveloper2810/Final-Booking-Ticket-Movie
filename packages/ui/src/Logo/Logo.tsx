import { type FC } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo: FC<LogoProps> = ({ size = "md", showText = true, className = "" }) => {
  const dimensions = {
    sm: { container: "w-8 h-8 rounded-lg", svg: "w-4 h-4", text: "text-lg" },
    md: { container: "w-10 h-10 rounded-xl", svg: "w-5 h-5", text: "text-xl" },
    lg: { container: "w-14 h-14 rounded-2xl", svg: "w-7 h-7", text: "text-3xl" },
  }[size];

  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div
        className={`${dimensions.container} relative p-[1.5px] bg-gradient-to-tr from-[#F2545B] via-[#FF6B72] to-[#FFC857] shadow-lg shadow-[#F2545B]/30 group-hover:shadow-[#F2545B]/50 group-hover:scale-105 transition-all duration-300`}
      >
        <div className="w-full h-full bg-[#151822] rounded-[inherit] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F2545B]/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          
          <svg
            className={`${dimensions.svg} text-[#F2545B] relative z-10 transition-transform duration-500 group-hover:rotate-12`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM8 17H5v-2h3v2zm0-4H5v-2h3v2zm0-4H5V7h3v2zm11 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2z" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`${dimensions.text} font-black tracking-tight text-text-primary group-hover:text-primary transition-colors`}>
          Cine<span className="text-primary">fix</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
