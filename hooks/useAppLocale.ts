"use client";

import { createContext, useContext } from "react";
import type { AppLocale } from "@/config/i18n";

export type AppLocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  isLocaleReady: boolean;
};

export const AppLocaleContext =
  createContext<AppLocaleContextValue | null>(null);

export function useAppLocale(): AppLocaleContextValue {
  const context = useContext(AppLocaleContext);

  if (!context) {
    throw new Error("useAppLocale must be used inside I18nProvider.");
  }

  return context;
}
