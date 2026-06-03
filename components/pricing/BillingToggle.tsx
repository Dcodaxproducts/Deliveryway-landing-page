'use client';
import { useState } from "react";

const BillingToggle = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 text-center">
      
      {/* Monthly Label */}
      <span
        className={`text-sm font-semibold transition-colors ${
          !isAnnual ? "text-white" : "text-white/60"
        }`}
      >
        Monthly Billing
      </span>

      {/* Toggle */}
      <button
        type="button"
        aria-pressed={isAnnual}
        onClick={() => setIsAnnual(!isAnnual)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          isAnnual ? "bg-red-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            isAnnual ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>

      {/* Annual */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span
          className={`text-sm font-semibold transition-colors ${
            isAnnual ? "text-white" : "text-white/60"
          }`}
        >
          Annual Billing
        </span>

        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white bg-white/10 rounded-full border border-white/20 whitespace-nowrap">
          Save 20%
        </span>
      </div>
    </div>
  );
};

export default BillingToggle;
