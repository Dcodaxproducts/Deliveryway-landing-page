"use client";
import { FeatureValue } from "@/constants/pricing";
import type { TranslatedTextKey } from "@/types/marketing";
import { Check, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface RenderCellProps {
  value: FeatureValue;
  valueKey?: TranslatedTextKey;
}

export const RenderCell = ({ value, valueKey }: RenderCellProps) => {
  const t = useTranslations();

  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-red-600" />
    ) : (
      <Minus className="w-5 h-5 text-slate-300" />
    );
  }

  return <span className="text-sm text-slate-900 text-center">{valueKey ? t(valueKey) : value}</span>;
};
