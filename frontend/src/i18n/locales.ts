export const LOCALES = [
  { code: "fr", label: "Français", nativeLabel: "Français" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili" },
  { code: "ln", label: "Lingala", nativeLabel: "Lingála" },
  { code: "lua", label: "Tshiluba", nativeLabel: "Tshiluba" },
  { code: "kg", label: "Kikongo", nativeLabel: "Kikongo" },
  { code: "rw", label: "Kinyarwanda", nativeLabel: "Ikinyarwanda" },
  { code: "nnb", label: "Kinande", nativeLabel: "Kinande" },
  { code: "huu", label: "Kihunde", nativeLabel: "Kihunde" },
  { code: "shr", label: "Shi", nativeLabel: "Mashi" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_AI_NAMES: Record<Locale, string> = {
  fr: "français",
  en: "English",
  sw: "Kiswahili",
  ln: "Lingala",
  lua: "Tshiluba",
  kg: "Kikongo",
  rw: "Ikinyarwanda",
  nnb: "Kinande",
  huu: "Kihunde",
  shr: "Mashi (Shi)",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.some((l) => l.code === value);
}
