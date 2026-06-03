"use client";

import { contactHero } from "@/constants/contact";
import { useTranslations } from "next-intl";
import { Hero } from "../shared/Hero";

export const ContactHero = () => {
  const t = useTranslations();

  return (
    <Hero
      badgeText={t(contactHero.badgeKey)}
      heading={
        <>
          <span className="text-neutral-900">{t(contactHero.titleLineOneKey)} </span>
          <span className="text-neutral-50">{t(contactHero.titleLineTwoKey)}</span>
        </>
      }
      description={t(contactHero.descriptionKey)}
    />
  );
};
