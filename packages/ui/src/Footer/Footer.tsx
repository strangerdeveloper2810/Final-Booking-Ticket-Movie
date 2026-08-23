import { type FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import Logo from "../Logo/Logo";
import { APP_ROUTES } from "@cinefix/utils";

const Footer: FC = () => {
  const { t } = useTranslation(["header", "common"]);

  const cinemaPartners = [
    { name: "CGV Cinema", logo: "https://movienew.cybersoft.edu.vn/hinhanh/cgv.png" },
    { name: "BHD Star", logo: "https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png" },
    { name: "Galaxy Cinema", logo: "https://movienew.cybersoft.edu.vn/hinhanh/galaxy-cinema.png" },
    { name: "Lotte Cinema", logo: "https://movienew.cybersoft.edu.vn/hinhanh/lotte-cinema.png" },
    { name: "CineStar", logo: "https://movienew.cybersoft.edu.vn/hinhanh/cinestar.png" },
    { name: "MegaGS", logo: "https://movienew.cybersoft.edu.vn/hinhanh/megags.png" },
  ];

  return (
    <footer className="bg-surface border-t border-border text-text-secondary pt-12 pb-8 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-xs leading-relaxed text-text-secondary">
              {t("common:appDescription", {
                defaultValue: "Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam.",
              })}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
              {t("header:navigation", { defaultValue: "Điều Hướng" })}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={APP_ROUTES.HOME} className="hover:text-primary transition-colors">
                  {t("header:home")}
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.PROFILE} className="hover:text-primary transition-colors">
                  {t("header:profile")}
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.LOGIN} className="hover:text-primary transition-colors">
                  {t("header:login")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
              Đối Tác Rạp Phim
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {map(cinemaPartners, (partner, idx) => (
                <img
                  key={idx}
                  src={partner.logo}
                  alt={partner.name}
                  className="w-8 h-8 rounded-full bg-white p-0.5 object-contain shadow-sm border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
              Bảo Mật & Thanh Toán
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Thanh toán an toàn 100% qua cổng kết nối bảo mật SSL. Hỗ trợ VISA, MasterCard, Momo, ZaloPay.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-text-secondary">
          <p>© 2026 Cinefix Movie Booking System. Designed for High Performance.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
