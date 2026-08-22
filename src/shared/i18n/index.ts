import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import viCommon from "../locales/vi/common.json";
import viHeader from "../locales/vi/header.json";
import viHome from "../locales/vi/home.json";
import viBooking from "../locales/vi/booking.json";
import viAuth from "../locales/vi/auth.json";

import enCommon from "../locales/en/common.json";
import enHeader from "../locales/en/header.json";
import enHome from "../locales/en/home.json";
import enBooking from "../locales/en/booking.json";
import enAuth from "../locales/en/auth.json";

export const defaultNS = "common";

export const resources = {
  vi: {
    common: viCommon,
    header: viHeader,
    home: viHome,
    booking: viBooking,
    auth: viAuth,
  },
  en: {
    common: enCommon,
    header: enHeader,
    home: enHome,
    booking: enBooking,
    auth: enAuth,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
