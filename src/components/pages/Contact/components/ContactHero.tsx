"use client";

import { useLocale } from "next-intl";

import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";
import { localizeLandingPage } from "@/lib/landing-content";

export const ContactHero = () => {
  const locale = useLocale();
  const settings = useLandingSettings();
  const page = localizeLandingPage(settings.pages.contact, locale);

  if (!page.eyebrow && !page.heading && !page.subheading) return null;

  return (
    <section className="bg-[linear-gradient(135deg,#d6151c_0%,#be1118_62%,#8f0d13_100%)] px-6 py-20 text-center text-white lg:py-28">
      <div className="mx-auto max-w-4xl">
        {page.eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
            {page.eyebrow}
          </p>
        ) : null}
        {page.heading ? (
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {page.heading}
          </h1>
        ) : null}
        {page.subheading ? (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            {page.subheading}
          </p>
        ) : null}
      </div>
    </section>
  );
};
