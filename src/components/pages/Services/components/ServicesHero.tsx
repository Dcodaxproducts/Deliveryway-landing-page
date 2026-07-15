"use client";

import { servicesHero } from "@/constants/services";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/common/shared/Hero";

export const ServicesHero = () => {
  const t = useTranslations();

  return (
    <Hero
      badgeText={t(servicesHero.badgeKey)}
      heading={
        <>
          <span className="text-neutral-900">{t(servicesHero.titleLineOneKey)} </span>
          <span className="text-neutral-50">{t(servicesHero.titleLineTwoKey)}</span>
        </>
      }
      description={t(servicesHero.descriptionKey)}
      secondaryButton={{ label: t(servicesHero.secondaryCtaKey) }}
    />
  );
};
