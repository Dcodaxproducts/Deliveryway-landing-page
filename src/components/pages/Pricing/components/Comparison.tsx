"use client";

import { pricingHeaders } from "@/constants/pricing";
import type { PackagePlan } from "@/types/package-plans";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/pages/About/components/SectionHeader";
import { FeatureTable } from "./comparison/FeatureTable";

interface ComparisonProps {
  packagePlans: PackagePlan[];
}

export function Comparison({ packagePlans }: ComparisonProps) {
  const t = useTranslations();

  return (
    <section className="w-full bg-white py-20 px-6 lg:px-36">
      <div className="mx-auto flex flex-col gap-16">
        <SectionHeader
          title={t(pricingHeaders.comparisonTitleKey)}
          description={t(pricingHeaders.comparisonDescriptionKey)}
        />

        <FeatureTable packagePlans={packagePlans} />
      </div>
    </section>
  );
}
