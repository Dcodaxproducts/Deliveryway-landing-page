'use client';
import { Plan } from "@/constants/pricing";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  return (
    <div
      className={`relative w-full max-w-sm self-stretch px-8 py-12 bg-white rounded-2xl flex flex-col justify-start items-start ${
        plan.highlighted
          ? "outline outline-2 outline-red-600 shadow-[0px_25px_50px_-12px_rgba(242,13,13,0.10)]"
          : "outline outline-1 outline-slate-200"
      }`}
    >
      {/* Most Popular Badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600 rounded-full">
          <span className="text-white text-xs font-bold uppercase tracking-wider">Most Popular</span>
        </div>
      )}

      {/* Header */}
      <div className="w-full pb-8 flex flex-col gap-2">
        <h3 className="text-slate-900 text-xl font-bold leading-7">{plan.name}</h3>
        <p className="text-slate-500 text-sm leading-5">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="w-full pb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-slate-900 text-4xl font-bold leading-10">{plan.price}</span>
          {plan.period && <span className="text-slate-500 text-base leading-6">{plan.period}</span>}
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 pb-10 w-full">
        <div className="flex flex-col gap-4">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-600" />
              <span className="text-slate-900 text-sm leading-5">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div
        className={`w-full py-3 rounded-xl flex justify-center items-center ${
          plan.highlighted
            ? "bg-red-600 text-white shadow-[0px_4px_6px_-4px_rgba(242,13,13,0.30)] shadow-[0px_10px_15px_-3px_rgba(242,13,13,0.30)]"
            : "outline outline-2 outline-slate-200 text-slate-900"
        }`}
      >
        <span className="text-base font-bold leading-6">{plan.buttonText}</span>
      </div>
    </div>
  );
};

export default PlanCard;
