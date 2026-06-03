export const SUPPORTED_LOCALES = ["en", "de"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_STORAGE_KEY = "restaurant-landing-locale";

export const LANGUAGE_LABELS: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
};

export function isSupportedLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(value as AppLocale)
  );
}

export function resolveLocale(value: unknown): AppLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}
