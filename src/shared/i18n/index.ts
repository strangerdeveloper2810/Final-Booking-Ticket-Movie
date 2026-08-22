import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import viCommon from "../locales/vi/common.json";
import viHeader from "../locales/vi/header.json";
import viHome from "../locales/vi/home.json";
import viBooking from "../locales/vi/booking.json";
import viAuth from "../locales/vi/auth.json";
import viDetail from "../locales/vi/detail.json";
import viFooter from "../locales/vi/footer.json";

import enCommon from "../locales/en/common.json";
import enHeader from "../locales/en/header.json";
import enHome from "../locales/en/home.json";
import enBooking from "../locales/en/booking.json";
import enAuth from "../locales/en/auth.json";
import enDetail from "../locales/en/detail.json";
import enFooter from "../locales/en/footer.json";

/**
 * EN: The i18next namespace used when a component calls `useTranslation()`
 * without specifying a namespace explicitly. Keeping a single default avoids
 * having to pass a namespace string at every call site for the common cases.
 * VI: Namespace i18next mặc định khi component gọi `useTranslation()` mà
 * không truyền namespace cụ thể. Có một namespace mặc định giúp không phải
 * truyền chuỗi namespace ở mọi nơi gọi cho các trường hợp phổ biến.
 */
export const defaultNS = "common";

/**
 * EN: Translation resource bundle for both supported locales, split into
 * per-feature namespaces (common/header/home/booking/auth/detail/footer) so
 * each feature only loads the JSON it needs instead of one giant file.
 * VI: Bộ tài nguyên dịch cho cả hai ngôn ngữ được hỗ trợ, chia theo namespace
 * từng feature (common/header/home/booking/auth/detail/footer) để mỗi
 * feature chỉ tải đúng phần JSON cần dùng thay vì một file khổng lồ duy nhất.
 */
export const resources = {
  vi: {
    common: viCommon,
    header: viHeader,
    home: viHome,
    booking: viBooking,
    auth: viAuth,
    detail: viDetail,
    footer: viFooter,
  },
  en: {
    common: enCommon,
    header: enHeader,
    home: enHome,
    booking: enBooking,
    auth: enAuth,
    detail: enDetail,
    footer: enFooter,
  },
} as const;

// EN: Wire up i18next once at app startup: LanguageDetector picks the user's
// language from browser/localStorage, initReactI18next exposes the `useTranslation`
// hook, and `fallbackLng: "vi"` means Vietnamese is used whenever the detected
// language (or a missing key) isn't available.
// VI: Khởi tạo i18next một lần khi ứng dụng chạy: LanguageDetector tự phát
// hiện ngôn ngữ người dùng (từ trình duyệt/localStorage), initReactI18next
// cung cấp hook `useTranslation`, và `fallbackLng: "vi"` nghĩa là dùng tiếng
// Việt khi không phát hiện được ngôn ngữ (hoặc thiếu khóa dịch).
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    defaultNS,
    interpolation: {
      // EN: React already escapes output, so let i18next skip its own
      // HTML-escaping to avoid double-escaping interpolated values.
      // VI: React đã tự escape khi render, nên tắt escape của i18next để
      // tránh escape hai lần đối với các giá trị được nội suy.
      escapeValue: false,
    },
  });

export default i18n;
