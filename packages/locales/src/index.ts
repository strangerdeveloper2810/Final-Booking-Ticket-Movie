import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import viHeader from "./vi/header.json";
import viHome from "./vi/home.json";
import viDetail from "./vi/detail.json";
import viBooking from "./vi/booking.json";
import viProfile from "./vi/profile.json";
import viAdmin from "./vi/admin.json";
import viCommon from "./vi/common.json";
import viAuth from "./vi/auth.json";

import enHeader from "./en/header.json";
import enHome from "./en/home.json";
import enDetail from "./en/detail.json";
import enBooking from "./en/booking.json";
import enProfile from "./en/profile.json";
import enAdmin from "./en/admin.json";
import enCommon from "./en/common.json";
import enAuth from "./en/auth.json";

export const resources = {
  vi: {
    header: viHeader,
    home: viHome,
    detail: viDetail,
    booking: viBooking,
    profile: viProfile,
    admin: viAdmin,
    common: viCommon,
    auth: viAuth,
  },
  en: {
    header: enHeader,
    home: enHome,
    detail: enDetail,
    booking: enBooking,
    profile: enProfile,
    admin: enAdmin,
    common: enCommon,
    auth: enAuth,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
