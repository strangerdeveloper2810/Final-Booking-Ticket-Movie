/**
 * EN: The two locale codes the app supports, matching the i18next language
 * keys registered in `shared/i18n/index.ts` (`resources.vi` / `resources.en`).
 * VI: Hai mã ngôn ngữ mà ứng dụng hỗ trợ, khớp với các khóa ngôn ngữ i18next
 * đã đăng ký trong `shared/i18n/index.ts` (`resources.vi` / `resources.en`).
 */
export enum LanguageCode {
  VI = "vi",
  EN = "en",
}

/**
 * EN: Shape of one entry in the language switcher UI (code to pass to
 * i18next, human-readable label, and flag emoji shown next to it).
 * VI: Cấu trúc của một mục trong UI chuyển đổi ngôn ngữ (mã truyền cho
 * i18next, nhãn hiển thị cho người dùng, và emoji cờ hiển thị kèm theo).
 */
export interface LanguageItem {
  code: LanguageCode;
  label: string;
  flag: string;
}

/**
 * EN: Ordered list of languages rendered in the header's language switcher.
 * Add a new entry here (plus the matching locale JSON files) to support an
 * additional language — no other file needs to change for the list itself.
 * VI: Danh sách ngôn ngữ theo thứ tự hiển thị trong bộ chuyển đổi ngôn ngữ ở
 * header. Muốn thêm ngôn ngữ mới chỉ cần thêm một mục ở đây (cùng các file
 * JSON locale tương ứng) — không cần sửa file nào khác cho riêng danh sách này.
 */
export const SUPPORTED_LANGUAGES: readonly LanguageItem[] = [
  {
    code: LanguageCode.VI,
    label: "Tiếng Việt",
    flag: "🇻🇳",
  },
  {
    code: LanguageCode.EN,
    label: "English",
    flag: "🇬🇧",
  },
] as const;
