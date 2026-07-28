"use client";

import { ContentWithChecklistSection } from "@/components/common/shared/ContentWithChecklistSection";
import { homeChecklistSections } from "@/constants/home";
import { useLocale, useTranslations } from "next-intl";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionSix() {
  const t = useTranslations();
  const locale = useLocale();
  const { home } = useLandingSettings();
  const section = homeChecklistSections.growth;
  const settings = home.growth;
  const heading =
    (locale === "de" ? settings.headingDe : settings.headingEn) || null;
  const description =
    (locale === "de" ? settings.descriptionDe : settings.descriptionEn) ||
    t(section.descriptionKey);
  const managedChecklist =
    locale === "de" ? settings.checklistDe : settings.checklistEn;
  const checklist =
    managedChecklist.length > 0
      ? managedChecklist
      : section.checklistKeys.map((key) => t(key));

  if (!settings.isVisible) return null;

  return (
    <ContentWithChecklistSection
      reverseOnMobile
      imagePosition="left"
      title={
        heading || (
          <>
            {t("home.sectionSix.titleLineOne")}{" "}
            <br className="hidden sm:block" />
            {t("home.sectionSix.titleLineTwo")}{" "}
            <br className="hidden sm:block" />
            {t("home.sectionSix.titleLineThree")}
          </>
        )
      }
      description={description}
      checklist={checklist}
      imageSrc={settings.imageUrl || "/assets/sectionSix/dining.png"}
      imageAlt="Restaurant dining experience"
      imageWidth={520}
      imageHeight={620}
    />
  );
}
