"use client";

import { NextIntlClientProvider } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type AppLocale,
  resolveLocale,
} from "@/config/i18n";
import { AppLocaleContext } from "@/hooks/useAppLocale";
import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";

const messagesByLocale: Record<AppLocale, typeof enMessages> = {
  en: enMessages,
  de: deMessages,
};

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookieLocale(): AppLocale {
  const cookieValue = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${LOCALE_STORAGE_KEY}=`))
    ?.split("=")[1];

  return resolveLocale(cookieValue ? decodeURIComponent(cookieValue) : null);
}

function persistLocale(locale: AppLocale): void {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_STORAGE_KEY}=${encodeURIComponent(
    locale
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      const resolvedLocale = resolveLocale(storedLocale ?? readCookieLocale());

      setLocaleState(resolvedLocale);
      persistLocale(resolvedLocale);
      setIsLocaleReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    persistLocale(nextLocale);
  }, []);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      isLocaleReady,
    }),
    [isLocaleReady, locale, setLocale]
  );

  return (
    <AppLocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesByLocale[locale]}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </AppLocaleContext.Provider>
  );
}
