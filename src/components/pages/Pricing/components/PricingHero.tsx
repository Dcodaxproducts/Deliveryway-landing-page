"use client";

import { useLocale } from "next-intl";
import { Hero } from "@/components/common/shared/Hero";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";
import { localizeLandingPage } from "@/lib/landing-content";

export const PricingHero = () => {
  const locale = useLocale();
  const { pages } = useLandingSettings();
  const managed = localizeLandingPage(pages.pricing, locale);

  if (!managed.eyebrow && !managed.heading && !managed.subheading) return null;

  return (
    <Hero
      showToggle={true}
      badgeText={managed.eyebrow || undefined}
      heading={<span className="text-neutral-50">{managed.heading}</span>}
      description={managed.subheading || ""}
    />
  );
};
