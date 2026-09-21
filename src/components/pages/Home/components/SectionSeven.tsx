"use client";

import { useLocale } from "next-intl";

import { ContentWithChecklistSection } from "@/components/common/shared/ContentWithChecklistSection";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionSeven() {
  const locale = useLocale();
  const section = useLandingSettings().home.orderManagement;
  const isGerman = locale.startsWith("de");

  if (!section.isVisible || !section.imageUrl) return null;

  return (
    <ContentWithChecklistSection
      imagePosition="right"
      reverseOnMobile
      title={isGerman ? section.headingDe : section.headingEn}
      description={
        (isGerman ? section.descriptionDe : section.descriptionEn) || ""
      }
      checklist={isGerman ? section.checklistDe : section.checklistEn}
      imageSrc={section.imageUrl}
      imageAlt=""
      imageWidth={560}
      imageHeight={420}
    />
  );
}
