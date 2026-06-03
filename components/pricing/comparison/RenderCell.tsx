'use client';
import { FeatureValue } from "@/constants/pricing";
import { Check, Minus } from "lucide-react";

interface RenderCellProps {
  value: FeatureValue;
}

const RenderCell = ({ value }: RenderCellProps) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-red-600" />
    ) : (
      <Minus className="w-5 h-5 text-slate-300" />
    );
  }

  return <span className="text-sm text-slate-900 text-center">{value}</span>;
};

export default RenderCell;
