"use client";

import { ContentWithChecklistSection } from "@/components/common/shared/ContentWithChecklistSection";
import { homeChecklistSections } from "@/constants/home";
import { useTranslations } from "next-intl";

export function SectionSix() {
  const t = useTranslations();
  const section = homeChecklistSections.growth;

  return (
    <ContentWithChecklistSection
      reverseOnMobile
      imagePosition="left"
      title={
        <>
          {t("home.sectionSix.titleLineOne")} <br className="hidden sm:block" />
          {t("home.sectionSix.titleLineTwo")} <br className="hidden sm:block" />
          {t("home.sectionSix.titleLineThree")}
        </>
      }
      description={t(section.descriptionKey)}
      checklist={section.checklistKeys.map((key) => t(key))}
      imageSrc="/assets/sectionSix/dining.png"
      imageAlt="Restaurant dining experience"
      imageWidth={520}
      imageHeight={620}
    />
  );
}
