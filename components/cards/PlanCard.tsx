"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Plan, pricingHeaders } from "@/constants/pricing";
import {
  formatPackagePlanLabel,
  getPackagePlanFeatures,
} from "@/lib/package-plan-display";
import type { PackagePlan } from "@/types/package-plans";

interface PlanCardProps {
  plan: Plan | PackagePlan;
  isHighlighted?: boolean;
}

const isPackagePlan = (plan: Plan | PackagePlan): plan is PackagePlan => {
  return "id" in plan;
};

const formatPrice = (plan: PackagePlan) => {
  const amount = Number(plan.planPrice);
  const price = Number.isFinite(amount)
    ? new Intl.NumberFormat("en", {
        style: "currency",
        currency: plan.currency,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      }).format(amount)
    : `${plan.currency} ${plan.planPrice}`;

  return price;
};

const PlanCard = ({ plan, isHighlighted: highlightedOverride }: PlanCardProps) => {
  const t = useTranslations();
  const packagePlan = isPackagePlan(plan) ? plan : null;
  const staticPlan = plan as Plan;
  const isHighlighted =
    highlightedOverride ?? (packagePlan ? packagePlan.isDefault : staticPlan.highlighted);
  const features: string[] = packagePlan
    ? getPackagePlanFeatures(packagePlan)
        .map((feature) => {
          if (feature.value === true) return feature.label;
          return `${feature.label}: ${String(feature.value)}`;
        })
    : staticPlan.featureKeys;
  const href = packagePlan
    ? `/register?packagePlanId=${encodeURIComponent(packagePlan.id)}`
    : "/register";
  const buttonText = packagePlan ? "Start registration" : t(staticPlan.buttonTextKey);
  const description = packagePlan
    ? packagePlan.description || "Package plan for your restaurant operations."
    : t(staticPlan.descriptionKey);
  const period = packagePlan
    ? `/${formatPackagePlanLabel(packagePlan.billingInterval).toLowerCase()}`
    : staticPlan.period;

  return (
    <div
      className={`relative w-full max-w-sm self-stretch px-8 py-12 bg-white rounded-2xl flex flex-col justify-start items-start ${
        isHighlighted
          ? "outline outline-2 outline-red-600 shadow-[0px_25px_50px_-12px_rgba(242,13,13,0.10)]"
          : "outline outline-1 outline-slate-200"
      }`}
    >
      {/* Most Popular Badge */}
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600 rounded-full">
          <span className="text-white text-xs font-bold uppercase tracking-wider">{t(pricingHeaders.mostPopularKey)}</span>
        </div>
      )}

      {/* Header */}
      <div className="w-full pb-8 flex flex-col gap-2">
        <h3 className="text-slate-900 text-xl font-bold leading-7">
          {packagePlan ? packagePlan.name : t(staticPlan.nameKey)}
        </h3>
        <p className="text-slate-500 text-sm leading-5">{description}</p>
      </div>

      {/* Price */}
      <div className="w-full pb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-slate-900 text-4xl font-bold leading-10">
            {packagePlan ? formatPrice(packagePlan) : staticPlan.price}
          </span>
          {period && <span className="text-slate-500 text-base leading-6">{period}</span>}
        </div>
        {packagePlan && (
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
            <span>{formatPackagePlanLabel(packagePlan.billingModel)} billing</span>
            {packagePlan.commissionType && (
              <span>
                Commission: {formatPackagePlanLabel(packagePlan.commissionType)}
                {packagePlan.commissionPercentage ? ` ${packagePlan.commissionPercentage}%` : ""}
              </span>
            )}
            {packagePlan.commissionFixedAmount &&
              Number(packagePlan.commissionFixedAmount) > 0 && (
                <span>
                  Fixed commission: {packagePlan.currency}{" "}
                  {packagePlan.commissionFixedAmount}
                </span>
              )}
            {packagePlan.commissionCapAmount &&
              Number(packagePlan.commissionCapAmount) > 0 && (
                <span>
                  Commission cap: {packagePlan.currency}{" "}
                  {packagePlan.commissionCapAmount}
                </span>
              )}
            {packagePlan.vatPercentage && <span>VAT: {packagePlan.vatPercentage}%</span>}
            {packagePlan.payoutCycle && <span>Payout: {formatPackagePlanLabel(packagePlan.payoutCycle)}</span>}
            {packagePlan.trialDays > 0 && <span>{packagePlan.trialDays} day trial</span>}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 pb-10 w-full">
        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-600" />
              <span className="text-slate-900 text-sm leading-5">
                {packagePlan ? feature : t(feature)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      {packagePlan?.termsDocumentUrl && (
        <a
          href={packagePlan.termsDocumentUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          View terms
        </a>
      )}

      <Link
        href={href}
        onClick={() => {
          if (packagePlan) {
            localStorage.setItem("selectedPackagePlanId", packagePlan.id);
          }
        }}
        className={`w-full py-3 rounded-xl flex justify-center items-center ${
          isHighlighted
            ? "bg-red-600 text-white shadow-[0px_4px_6px_-4px_rgba(242,13,13,0.30)] shadow-[0px_10px_15px_-3px_rgba(242,13,13,0.30)]"
            : "outline outline-2 outline-slate-200 text-slate-900"
        }`}
      >
        <span className="text-base font-bold leading-6">{buttonText}</span>
      </Link>
    </div>
  );
};

export { PlanCard };
