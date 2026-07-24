"use client";

import { servicesHero } from "@/constants/services";
import { useLocale, useTranslations } from "next-intl";
import { Hero } from "@/components/common/shared/Hero";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";
import { localizeLandingPage } from "@/lib/landing-content";

export const ServicesHero = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { pages } = useLandingSettings();
  const managed = localizeLandingPage(pages.services, locale);

  return (
    <Hero
      badgeText={managed.eyebrow || t(servicesHero.badgeKey)}
      heading={
        managed.heading ? (
          <span className="text-neutral-50">{managed.heading}</span>
        ) : (
          <>
            <span className="text-neutral-900">
              {t(servicesHero.titleLineOneKey)}{" "}
            </span>
            <span className="text-neutral-50">
              {t(servicesHero.titleLineTwoKey)}
            </span>
          </>
        )
      }
      description={managed.subheading || t(servicesHero.descriptionKey)}
      secondaryButton={{ label: t(servicesHero.secondaryCtaKey) }}
    />
  );
};
