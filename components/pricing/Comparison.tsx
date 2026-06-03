"use client";

import { pricingHeaders } from "@/constants/pricing";
import { useTranslations } from "next-intl";
import { SectionHeader } from "../about/SectionHeader";
import { FeatureTable } from "./comparison/FeatureTable";

export function Comparison() {
  const t = useTranslations();

  return (
    <section className="w-full bg-white py-20 px-6 lg:px-36">
      <div className="mx-auto flex flex-col gap-16">
        <SectionHeader
          title={t(pricingHeaders.comparisonTitleKey)}
          description={t(pricingHeaders.comparisonDescriptionKey)}
        />

        <FeatureTable />
      </div>
    </section>
  );
}
