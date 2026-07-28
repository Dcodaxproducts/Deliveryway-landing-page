"use client";

import { ContentWithChecklistSection } from "@/components/common/shared/ContentWithChecklistSection";
import { homeChecklistSections } from "@/constants/home";
import { useLocale, useTranslations } from "next-intl";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionSeven() {
  const t = useTranslations();
  const locale = useLocale();
  const { home } = useLandingSettings();
  const section = homeChecklistSections.orderManagement;
  const settings = home.orderManagement;
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
      imagePosition="right"
      reverseOnMobile
      title={
        heading || (
          <>
            {t("home.sectionSeven.titleLineOne")}{" "}
            <br className="hidden sm:block" />
            {t("home.sectionSeven.titleLineTwo")}{" "}
            <br className="hidden sm:block" />
            {t("home.sectionSeven.titleLineThree")}
          </>
        )
      }
      description={description}
      checklist={checklist}
      imageSrc={settings.imageUrl || "/assets/sectionSeven/map.png"}
      imageAlt="Global restaurant order management map"
      imageWidth={560}
      imageHeight={420}
    />
  );
}
