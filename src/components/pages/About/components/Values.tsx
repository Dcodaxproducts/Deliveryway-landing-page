"use client";

import { values } from "@/constants/about";
import { SectionHeader } from "./SectionHeader";
import { ValueCard } from "@/components/common/cards/ValueCard";
import { useTranslations } from "next-intl";


export function Values() {
  const t = useTranslations();

  return (
    <section className="w-full py-16 lg:py-20 bg-slate-50">
      <div className="mx-auto px-6 lg:px-30 flex flex-col gap-14">

        {/* Header */}
        <SectionHeader
          title={t("about.valuesSection.title")}
          description={t("about.valuesSection.description")}
          align="left"
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <ValueCard
              key={index}
              title={t(item.titleKey)}
              description={t(item.descriptionKey)}
              Icon={item.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
