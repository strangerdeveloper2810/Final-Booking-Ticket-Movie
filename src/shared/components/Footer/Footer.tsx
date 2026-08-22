import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "shared/constants/routes";

const Footer: FC = () => {
  const { t } = useTranslation(["footer", "common"]);

  return (
    <footer className="bg-surface border-t border-border text-text-secondary py-8 mt-12 transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-lg">
                C
              </div>
              <span className="text-lg font-bold text-text-primary">Cinefix</span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              {t("footer:aboutText")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">
              {t("footer:navigation")}
            </h4>
            <NavLink to={APP_ROUTES.HOME} className="text-sm hover:text-primary transition-colors">
              {t("footer:home")}
            </NavLink>
            <NavLink to={`${APP_ROUTES.HOME}#showtimes`} className="text-sm hover:text-primary transition-colors">
              {t("footer:showtimes")}
            </NavLink>
            <NavLink to={`${APP_ROUTES.HOME}#cinemas`} className="text-sm hover:text-primary transition-colors">
              {t("footer:cinemas")}
            </NavLink>
          </div>

          {/* Policy & Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">
              {t("footer:information")}
            </h4>
            <span className="text-sm text-text-secondary cursor-pointer hover:text-primary transition-colors">
              {t("footer:terms")}
            </span>
            <span className="text-sm text-text-secondary cursor-pointer hover:text-primary transition-colors">
              {t("footer:privacy")}
            </span>
            <span className="text-sm text-text-secondary cursor-pointer hover:text-primary transition-colors">
              {t("footer:support")}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs gap-4">
          <p>{t("footer:copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-text-secondary">Designed by Stranger Developer</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
