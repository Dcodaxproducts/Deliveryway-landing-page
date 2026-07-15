"use client";

import { FormInput } from "@/components/pages/Register/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { toInputNumber } from "@/lib/delivery-area";
import type { DeliveryZoneBand } from "@/types/delivery";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface RadiusDeliverySettingsProps {
  onAddBand: () => void;
  onDuplicateBand: (index: number) => void;
  onRemoveBand: (index: number) => void;
  onUpdateBand: (
    index: number,
    key: keyof DeliveryZoneBand,
    value: number | string
  ) => void;
  sanitizeDecimalInput: (value: string) => string;
  zoneBands: DeliveryZoneBand[];
}

export function RadiusDeliverySettings({
  onAddBand,
  onDuplicateBand,
  onRemoveBand,
  onUpdateBand,
  sanitizeDecimalInput,
  zoneBands,
}: RadiusDeliverySettingsProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {tRegister("branch.delivery.radiusBands.title")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {tRegister("branch.delivery.radiusBands.description")}
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddBand}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <Plus size={15} />
          {tRegister("branch.delivery.radiusBands.addBand")}
        </Button>
      </div>

      {zoneBands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
          {tRegister("branch.delivery.radiusBands.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {zoneBands.map((band, index) => (
            <div
              key={`zone-band-${index}`}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {tRegister("branch.delivery.radiusBands.bandLabel", {
                      number: index + 1,
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {toInputNumber(band.fromKm) || "0"} km →{" "}
                    {toInputNumber(band.toKm) || "0"} km
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDuplicateBand(index)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Copy size={13} />
                    {tRegister("branch.delivery.actions.duplicate")}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveBand(index)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={13} />
                    {tRegister("branch.delivery.actions.remove")}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <FormInput
                  label={tRegister("branch.delivery.fields.fromKm.label")}
                  placeholder="0"
                  value={toInputNumber(band.fromKm)}
                  onChange={(val) =>
                    onUpdateBand(index, "fromKm", sanitizeDecimalInput(val))
                  }
                />

                <FormInput
                  label={tRegister("branch.delivery.fields.toKm.label")}
                  placeholder="7.5"
                  value={toInputNumber(band.toKm)}
                  onChange={(val) =>
                    onUpdateBand(index, "toKm", sanitizeDecimalInput(val))
                  }
                />

                <FormInput
                  label={tRegister("branch.delivery.fields.deliveryFee.label")}
                  placeholder={tRegister(
                    "branch.delivery.fields.deliveryFee.placeholder"
                  )}
                  value={toInputNumber(band.deliveryFee)}
                  onChange={(val) =>
                    onUpdateBand(index, "deliveryFee", val ? Number(val) : 0)
                  }
                />

                <FormInput
                  label={tRegister("branch.delivery.fields.minOrder.label")}
                  placeholder={tRegister(
                    "branch.delivery.fields.minOrder.placeholder"
                  )}
                  value={toInputNumber(band.minOrderAmount)}
                  onChange={(val) =>
                    onUpdateBand(index, "minOrderAmount", val ? Number(val) : 0)
                  }
                />

                <FormInput
                  label={tRegister(
                    "branch.delivery.fields.freeDeliveryFrom.label"
                  )}
                  placeholder={tRegister(
                    "branch.delivery.fields.freeDeliveryFrom.placeholder"
                  )}
                  value={toInputNumber(band.freeDeliveryThreshold)}
                  onChange={(val) =>
                    onUpdateBand(
                      index,
                      "freeDeliveryThreshold",
                      val ? Number(val) : 0
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
