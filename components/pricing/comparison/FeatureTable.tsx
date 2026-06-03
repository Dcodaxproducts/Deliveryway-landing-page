"use client";
import { comparisonSections } from "@/constants/pricing";
import { useTranslations } from "next-intl";
import { RenderCell } from "./RenderCell";

export const FeatureTable = () => {
  const t = useTranslations();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] border border-slate-200 rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-4 bg-white border-b border-slate-200">
          <div className="px-6 py-5 text-sm font-bold text-slate-900">{t("pricing.comparison.columns.feature")}</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-slate-900">{t("pricing.plans.starter.name")}</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-red-600">{t("pricing.plans.professional.name")}</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-slate-900">{t("pricing.plans.enterprise.name")}</div>
        </div>

        {/* Sections */}
        {comparisonSections.map((section) => (
          <div key={section.titleKey}>
            
            {/* Section Title */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-900">{t(section.titleKey)}</span>
            </div>

            {/* Rows */}
            {section.rows.map((row) => (
              <div key={row.nameKey} className="grid grid-cols-4 border-t border-slate-100">
                <div className="px-6 py-5 text-sm text-slate-600">{t(row.nameKey)}</div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.starter} valueKey={row.starterKey} /></div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.professional} valueKey={row.professionalKey} /></div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.enterprise} valueKey={row.enterpriseKey} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
