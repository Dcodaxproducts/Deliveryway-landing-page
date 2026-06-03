"use client";

import { useTranslations } from "next-intl";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/config/i18n";
import { useAppLocale } from "@/hooks/useAppLocale";

export function LanguageSelector() {
  const t = useTranslations("navigation");
  const { locale, setLocale, isLocaleReady } = useAppLocale();

  const handleLocaleChange = (nextLocale: AppLocale) => {
    if (nextLocale !== locale) {
      setLocale(nextLocale);
    }
  };

  return (
    <div
      aria-label={t("changeLanguage")}
      className="flex items-center rounded-full bg-white/15 p-1 text-xs font-semibold text-white"
      role="group"
    >
      {SUPPORTED_LOCALES.map((item) => {
        const isActive = item === locale;

        return (
          <button
            aria-label={LANGUAGE_LABELS[item]}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1 transition ${
              isActive
                ? "bg-white text-[#CE181B]"
                : "text-white hover:bg-white/10"
            }`}
            disabled={!isLocaleReady}
            key={item}
            onClick={() => handleLocaleChange(item)}
            type="button"
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
