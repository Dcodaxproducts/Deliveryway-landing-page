"use client";

import { ContentWithChecklistSection } from "../shared/ContentWithChecklistSection";
import { homeChecklistSections } from "@/constants/home";
import { useTranslations } from "next-intl";

export function SectionSeven() {
  const t = useTranslations();
  const section = homeChecklistSections.orderManagement;

  return (
    <ContentWithChecklistSection
      imagePosition="right" 
       reverseOnMobile
      title={
        <>
          {t("home.sectionSeven.titleLineOne")} <br className="hidden sm:block" />
          {t("home.sectionSeven.titleLineTwo")} <br className="hidden sm:block" />
          {t("home.sectionSeven.titleLineThree")}
        </>
      }
      description={t(section.descriptionKey)}
      checklist={section.checklistKeys.map((key) => t(key))}
      imageSrc="/assets/sectionSeven/map.png"
      imageAlt="Global restaurant order management map"
      imageWidth={560}
      imageHeight={420}
    />
  );
}
