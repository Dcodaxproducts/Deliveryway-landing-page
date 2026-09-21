"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function Hero() {
  const locale = useLocale();
  const { home } = useLandingSettings();
  const isGerman = locale.startsWith("de");
  const hero = home.hero;
  const badge = isGerman ? hero.badgeDe : hero.badgeEn;
  const heading = isGerman ? hero.headingDe : hero.headingEn;
  const subheading = isGerman ? hero.subheadingDe : hero.subheadingEn;
  const primaryLabel = isGerman ? hero.primaryCtaDe : hero.primaryCtaEn;
  const secondaryLabel = isGerman ? hero.secondaryCtaDe : hero.secondaryCtaEn;

  if (!badge && !heading && !subheading && !hero.imageUrl) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#CE181B] px-4 pb-16 pt-20 text-white md:pb-24">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        {badge ? (
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/95 py-1 pl-1 pr-4 text-sm font-medium text-gray-900">
            <span className="flex size-10 items-center justify-center rounded-full bg-white">
              <ShieldCheck className="size-5 text-[#CE181B]" />
            </span>
            {badge}
          </div>
        ) : null}
        {heading ? (
          <h1 className="mx-auto max-w-5xl text-3xl font-medium leading-tight sm:text-4xl md:text-6xl">
            {heading}
          </h1>
        ) : null}
        {subheading ? (
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
            {subheading}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
          {primaryLabel && hero.primaryCtaUrl ? (
            <Button
              asChild
              className="rounded-full bg-white px-9 text-[#CE181B] hover:bg-white/90"
            >
              <a href={hero.primaryCtaUrl}>{primaryLabel}</a>
            </Button>
          ) : null}
          {secondaryLabel && hero.secondaryCtaUrl ? (
            <Button
              asChild
              className="rounded-full bg-black px-9 text-white hover:bg-black/90"
            >
              <a href={hero.secondaryCtaUrl}>{secondaryLabel}</a>
            </Button>
          ) : null}
        </div>
        {hero.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt=""
            width={1200}
            height={620}
            unoptimized
            className="mx-auto mt-12 max-h-[620px] w-full max-w-4xl object-contain"
          />
        ) : null}
      </div>
    </section>
  );
}
