import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/i18n/locales";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        if (!isLocale(locale)) return;
        set({ locale });
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: "chunguza-locale",
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
