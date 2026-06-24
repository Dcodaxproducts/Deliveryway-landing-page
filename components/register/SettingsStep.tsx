"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bike, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BranchSettingsValue, RegisterFormData } from "@/types/register";
import type { PackagePlan } from "@/types/package-plans";

interface Props {
  packagePlans: PackagePlan[];
  packagePlansError: string;
  packagePlansLoading: boolean;
  formData: RegisterFormData;
  updateFormData: (section: string, data: Record<string, unknown>) => void;
  next: () => void;
  back: () => void;
  disabledReason?: string;
  isLoading: boolean;
  onPackagePlanChange: (packagePlanId: string) => void;
  selectedPackagePlanId: string;
}

type OrderTypeValue = "TAKEAWAY" | "DELIVERY" | "DINE_IN";

const ORDER_TYPES: {
  descriptionKey: string;
  icon: React.ReactNode;
  labelKey: string;
  value: OrderTypeValue;
}[] = [
  {
    labelKey: "settings.orderTypes.takeaway.label",
    value: "TAKEAWAY",
    descriptionKey: "settings.orderTypes.takeaway.description",
    icon: <ShoppingBag className="text-primary" size={28} />,
  },
  {
    labelKey: "settings.orderTypes.delivery.label",
    value: "DELIVERY",
    descriptionKey: "settings.orderTypes.delivery.description",
    icon: <Bike className="text-primary" size={28} />,
  },
  {
    labelKey: "settings.orderTypes.dineIn.label",
    value: "DINE_IN",
    descriptionKey: "settings.orderTypes.dineIn.description",
    icon: <UtensilsCrossed className="text-primary" size={28} />,
  },
];

const getStringArray = (value: unknown) => {
  return Array.isArray(value) ? value.map(String) : [];
};

const formatPlanPrice = (plan: PackagePlan) => {
  const amount = Number(plan.planPrice);

  if (!Number.isFinite(amount)) return `${plan.currency} ${plan.planPrice}`;

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

export function SettingsStep({
  packagePlans,
  packagePlansError,
  packagePlansLoading,
  formData,
  updateFormData,
  next,
  back,
  disabledReason,
  isLoading,
  onPackagePlanChange,
  selectedPackagePlanId,
}: Props) {
  const tCommon = useTranslations("common");
  const tRegister = useTranslations("register");
  const settings = formData.branch?.settings || {};
  const allowedOrderTypes = getStringArray(settings.allowedOrderTypes);

  const updateField = (field: keyof BranchSettingsValue, value: unknown) => {
    updateFormData("branch", { settings: { ...settings, [field]: value } });
  };

  const toggleOrderType = (type: OrderTypeValue) => {
    const updated = allowedOrderTypes.includes(type)
      ? allowedOrderTypes.filter((item) => item !== type)
      : [...allowedOrderTypes, type];
    updateField("allowedOrderTypes", updated);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      {/* ORDER TYPES */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("settings.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {ORDER_TYPES.map((type) => (
          <OrderTypeCard
            key={type.value}
            icon={type.icon}
            title={tRegister(type.labelKey)}
            description={tRegister(type.descriptionKey)}
            enabled={allowedOrderTypes.includes(type.value)}
            onToggle={() => toggleOrderType(type.value)}
          />
        ))}
      </div>

      <div className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tRegister("plans.finalStepTitle")}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {tRegister("plans.finalStepDescription")}
            </p>
          </div>

          {packagePlansLoading ? (
            <span className="text-sm font-medium text-primary">
              {tRegister("plans.loading")}
            </span>
          ) : null}
        </div>

        {packagePlansError ? (
          <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-primary">
            {packagePlansError}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {packagePlans.map((plan) => {
            const selected = selectedPackagePlanId === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => onPackagePlanChange(plan.id)}
                className={`rounded-2xl border bg-white p-4 text-left transition ${
                  selected
                    ? "border-primary shadow-[0_14px_30px_rgba(193,0,10,0.12)] ring-2 ring-primary/10"
                    : "border-gray-100 hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {plan.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.billingModel} · {plan.billingInterval}
                    </p>
                  </div>
                  <span
                    className={`h-5 w-5 rounded-full border ${
                      selected
                        ? "border-primary bg-primary shadow-[inset_0_0_0_4px_white]"
                        : "border-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-950">
                  {formatPlanPrice(plan)}
                </p>
                {plan.trialDays > 0 ? (
                  <p className="mt-2 text-sm font-medium text-green-700">
                    {plan.trialDays} day trial
                  </p>
                ) : null}
                {plan.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {plan.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <Button
          onClick={back}
          className="px-6 py-2 rounded-full bg-[#F5F5F5] text-sm text-gray-500"
        >
          {tCommon("actions.back")}
        </Button>

        <div className="flex flex-col items-end gap-2">
          {disabledReason ? (
            <p className="max-w-xs text-right text-xs text-primary">
              {disabledReason}
            </p>
          ) : null}
          <Button
            onClick={next}
            disabled={isLoading}
            className="bg-primary hover:bg-red-800 px-16 py-2.5 rounded-[10px] flex items-center justify-center min-w-[180px]"
          >
            {isLoading && !disabledReason ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {tRegister("settings.actions.publishing")}
              </>
            ) : (
              tRegister("settings.actions.publish")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderTypeCard({
  icon,
  title,
  description,
  enabled = false,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-[#F5F5F5] rounded-2xl py-10 px-12 flex flex-col items-center text-center">
      {icon}
      <h3 className="font-medium mt-4">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-6">{description}</p>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
