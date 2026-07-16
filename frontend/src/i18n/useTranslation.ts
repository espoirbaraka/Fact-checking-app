"use client";

import { useCallback } from "react";
import { translate, type MessageKey } from "@/i18n/messages";
import { useLocaleStore } from "@/store/locale.store";
import type { Locale } from "@/i18n/locales";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale]
  );

  return { t, locale, setLocale } as {
    t: (key: MessageKey, params?: Record<string, string | number>) => string;
    locale: Locale;
    setLocale: (locale: Locale) => void;
  };
}
