"use client";

import { contactSectionLabels, statsData } from "@/constants/contact";
import { useTranslations } from "next-intl";
import { ContactStatCard } from "@/components/common/cards/ContactStatCard";


export const Infrastructure = () => {
  const t = useTranslations();

  return (
    <section className="w-full py-20 px-6 bg-[#0F172AE5] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-white text-4xl font-bold leading-tight max-w-2xl">
            {t(contactSectionLabels.infrastructureTitleKey)}
          </h2>
          <p className="text-white/70 text-base max-w-xl leading-6">
            {t(contactSectionLabels.infrastructureDescriptionKey)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <ContactStatCard key={stat.labelKey} value={stat.value} label={t(stat.labelKey)} />
          ))}
        </div>

      </div>
    </section>
  );
};
