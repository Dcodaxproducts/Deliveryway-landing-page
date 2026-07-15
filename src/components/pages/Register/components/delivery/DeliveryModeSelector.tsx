"use client";

import { DELIVERY_MODES } from "@/lib/delivery-area";
import type { DeliveryMode } from "@/types/delivery";
import { useTranslations } from "next-intl";

interface DeliveryModeSelectorProps {
  deliveryMode: DeliveryMode;
  onModeChange: (mode: DeliveryMode) => void;
}

export function DeliveryModeSelector({
  deliveryMode,
  onModeChange,
}: DeliveryModeSelectorProps) {
  const tRegister = useTranslations("register");

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-gray-900">
        {tRegister("branch.delivery.modeLabel")}
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {DELIVERY_MODES.map((mode) => {
          const active = deliveryMode === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onModeChange(mode.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/40"
              }`}
            >
              <span className="block text-sm font-semibold">
                {tRegister(mode.labelKey)}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                {tRegister(mode.descriptionKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
