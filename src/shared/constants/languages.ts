export enum LanguageCode {
  VI = "vi",
  EN = "en",
}

export interface LanguageItem {
  code: LanguageCode;
  label: string;
  flag: string;
}

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
