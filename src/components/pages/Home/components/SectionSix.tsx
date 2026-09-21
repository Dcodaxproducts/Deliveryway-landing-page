"use client";

import { useLocale } from "next-intl";

import { ContentWithChecklistSection } from "@/components/common/shared/ContentWithChecklistSection";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionSix() {
  const locale = useLocale();
  const section = useLandingSettings().home.growth;
  const isGerman = locale.startsWith("de");

  if (!section.isVisible || !section.imageUrl) return null;

  return (
    <ContentWithChecklistSection
      reverseOnMobile
      imagePosition="left"
      title={isGerman ? section.headingDe : section.headingEn}
      description={
        (isGerman ? section.descriptionDe : section.descriptionEn) || ""
      }
      checklist={isGerman ? section.checklistDe : section.checklistEn}
      imageSrc={section.imageUrl}
      imageAlt=""
      imageWidth={520}
      imageHeight={620}
    />
  );
}
