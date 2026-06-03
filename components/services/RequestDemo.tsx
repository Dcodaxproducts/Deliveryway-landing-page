"use client";

import { requestDemoConfig, stats } from "@/constants/services";
import { useTranslations } from "next-intl";
import DemoForm from "../forms/DemoForm";
import StatCard from "../cards/DemoStatCard";

export const RequestDemo = () => {
  const t = useTranslations();

  return (
    <section className="w-full bg-slate-900 py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Left: Description + Stats */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <h2 className="text-white text-3xl lg:text-5xl font-bold leading-tight">
            {t(requestDemoConfig.titleKey)}
          </h2>
          <p className="text-slate-400 text-base lg:text-lg leading-7">
            {t(requestDemoConfig.descriptionKey)}
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {stats.map((stat) => (
              <StatCard key={stat.labelKey} value={stat.value} label={t(stat.labelKey)} />
            ))}
          </div>
        </div>

        {/* Right: Demo Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 lg:p-10">
          <h3 className="text-slate-900 text-2xl font-bold text-center mb-6">
            {t(requestDemoConfig.formTitleKey)}
          </h3>
          <DemoForm />
        </div>

      </div>
    </section>
  );
};
