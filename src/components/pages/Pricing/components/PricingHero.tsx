"use client";

import { pricingHero } from "@/constants/pricing";
import { useLocale, useTranslations } from "next-intl";
import { Hero } from "@/components/common/shared/Hero";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";
import { localizeLandingPage } from "@/lib/landing-content";

export const PricingHero = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { pages } = useLandingSettings();
  const managed = localizeLandingPage(pages.pricing, locale);

  return (
    <Hero
      showToggle={true}
      badgeText={managed.eyebrow || undefined}
      heading={
        managed.heading ? (
          <span className="text-neutral-50">{managed.heading}</span>
        ) : (
          <>
            <span className="text-neutral-900">
              {t(pricingHero.titleLineOneKey)}{" "}
            </span>
            <span className="text-neutral-50">
              {t(pricingHero.titleLineTwoKey)}
            </span>
          </>
        )
      }
      description={managed.subheading || t(pricingHero.descriptionKey)}
    />
  );
};
