"use client";

import { pricingHero } from "@/constants/pricing";
import { useTranslations } from "next-intl";
import { Hero } from "../shared/Hero";

export const PricingHero = () => {
  const t = useTranslations();

  return (
    <Hero
      showToggle={true}
      heading={
        <>
          <span className="text-neutral-900">{t(pricingHero.titleLineOneKey)} </span>
          <span className="text-neutral-50">{t(pricingHero.titleLineTwoKey)}</span>
        </>
      }
      description={t(pricingHero.descriptionKey)}
    />
  );
};
