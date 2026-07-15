"use client";
import { comparisonSections } from "@/constants/pricing";
import {
  getPackagePlanFeatureLabels,
  getPackagePlanFeatureValue,
} from "@/lib/package-plan-display";
import type { PackagePlan, PackagePlanFeatureValue } from "@/types/package-plans";
import { useTranslations } from "next-intl";
import { RenderCell } from "./RenderCell";

interface FeatureTableProps {
  packagePlans: PackagePlan[];
}

const toComparisonValue = (value: PackagePlanFeatureValue) => {
  if (value === true || value === false) return value;
  if (value === undefined || value === null) return false;
  return String(value);
};

export const FeatureTable = ({ packagePlans }: FeatureTableProps) => {
  const t = useTranslations();
  const featureLabels = getPackagePlanFeatureLabels(packagePlans);
  const mostPopularIndex = Math.floor(packagePlans.length / 2);

  if (packagePlans.length > 0 && featureLabels.length > 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div
          className="overflow-hidden rounded-xl border border-slate-200"
          style={{
            minWidth: `${260 + packagePlans.length * 180}px`,
          }}
        >
          <div
            className="grid border-b border-slate-200 bg-white"
            style={{
              gridTemplateColumns: `260px repeat(${packagePlans.length}, minmax(180px, 1fr))`,
            }}
          >
            <div className="px-6 py-5 text-sm font-bold text-slate-900">
              {t("pricing.comparison.columns.feature")}
            </div>
            {packagePlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`px-6 py-5 text-center text-sm font-bold ${
                  index === mostPopularIndex ? "text-red-600" : "text-slate-900"
                }`}
              >
                {plan.name}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <span className="text-sm font-semibold text-slate-900">
              {t("pricing.comparison.sections.coreOperations.title")}
            </span>
          </div>

          {featureLabels.map((featureLabel) => (
            <div
              key={featureLabel}
              className="grid border-t border-slate-100"
              style={{
                gridTemplateColumns: `260px repeat(${packagePlans.length}, minmax(180px, 1fr))`,
              }}
            >
              <div className="px-6 py-5 text-sm text-slate-600">
                {featureLabel}
              </div>
              {packagePlans.map((plan) => (
                <div
                  key={`${plan.id}-${featureLabel}`}
                  className="flex items-center justify-center px-6 py-5"
                >
                  <RenderCell
                    value={toComparisonValue(
                      getPackagePlanFeatureValue(plan, featureLabel)
                    )}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
