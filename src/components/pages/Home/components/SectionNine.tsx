"use client";

import { useLocale } from "next-intl";

import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionNine() {
  const locale = useLocale();
  const section = useLandingSettings().home.appDownload;
  const isGerman = locale.startsWith("de");

  if (!section.isVisible) return null;

  return (
    <section className="relative z-20 mx-auto max-w-7xl px-4">
      <div
        className="rounded-[32px] bg-black bg-cover bg-center px-6 py-14 text-center text-white md:rounded-[40px] md:px-16 md:py-20"
        style={
          section.backgroundImageUrl
            ? { backgroundImage: `url(${section.backgroundImageUrl})` }
            : undefined
        }
      >
        <h2 className="mx-auto max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {isGerman ? section.headingDe : section.headingEn}
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-gray-200 sm:text-base">
          {isGerman ? section.descriptionDe : section.descriptionEn}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {section.googlePlayUrl ? (
            <StoreLink href={section.googlePlayUrl} label="Google Play" />
          ) : null}
          {section.appStoreUrl ? (
            <StoreLink href={section.appStoreUrl} label="App Store" />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-w-44 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-100"
    >
      {label}
    </a>
  );
}
