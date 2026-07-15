"use client";

import { categoriesHero } from "@/constants/categories";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/common/shared/Hero";

export const CategoriesHero = () => {
  const t = useTranslations();

  return (
    <Hero
      badgeText={t(categoriesHero.badgeKey)}
      heading={
        <>
          <span className="text-neutral-900">{t(categoriesHero.titleLineOneKey)} </span>
          <span className="text-neutral-50">{t(categoriesHero.titleLineTwoKey)}</span>
        </>
      }
      description={t(categoriesHero.descriptionKey)}
      secondaryButton={{ label: t(categoriesHero.secondaryCtaKey) }}
    />
  );
};
