"use client";

import { FormInput } from "@/components/register/form/FormInput";
import { toInputNumber } from "@/lib/delivery-area";
import type { PostalCodeRule } from "@/types/delivery";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface PostalCodeRulesProps {
  onAddRule: () => void;
  onDuplicateRule: (index: number) => void;
  onRemoveRule: (index: number) => void;
  onUpdateRule: (
    index: number,
    key: keyof PostalCodeRule,
    value: number | string
  ) => void;
  postalCodeRules: PostalCodeRule[];
}

export function PostalCodeRules({
  onAddRule,
  onDuplicateRule,
  onRemoveRule,
  onUpdateRule,
  postalCodeRules,
}: PostalCodeRulesProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {tRegister("branch.delivery.postalRules.title")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {tRegister("branch.delivery.postalRules.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRule}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <Plus size={15} />
          {tRegister("branch.delivery.postalRules.add")}
        </button>
      </div>

      {postalCodeRules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
          {tRegister("branch.delivery.postalRules.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {postalCodeRules.map((rule, index) => (
            <div
              key={`postal-rule-${index}`}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]"
            >
              <FormInput
                label={tRegister("branch.delivery.fields.postalCode.label")}
                placeholder={tRegister(
                  "branch.delivery.fields.postalCode.placeholder"
                )}
                value={rule.postalCode || ""}
                onChange={(val) => onUpdateRule(index, "postalCode", val)}
              />

              <FormInput
                label={tRegister("branch.delivery.fields.deliveryFee.label")}
                placeholder={tRegister(
                  "branch.delivery.fields.deliveryFee.placeholder"
                )}
                value={toInputNumber(rule.deliveryFee)}
                onChange={(val) =>
                  onUpdateRule(index, "deliveryFee", val ? Number(val) : 0)
                }
              />

              <FormInput
                label={tRegister("branch.delivery.fields.minOrder.label")}
                placeholder={tRegister(
                  "branch.delivery.fields.minOrder.placeholder"
                )}
                value={toInputNumber(rule.minOrderAmount)}
                onChange={(val) =>
                  onUpdateRule(index, "minOrderAmount", val ? Number(val) : 0)
                }
              />

              <FormInput
                label={tRegister(
                  "branch.delivery.fields.freeDeliveryFrom.label"
                )}
                placeholder={tRegister(
                  "branch.delivery.fields.freeDeliveryFrom.placeholder"
                )}
                value={toInputNumber(rule.freeDeliveryThreshold)}
                onChange={(val) =>
                  onUpdateRule(
                    index,
                    "freeDeliveryThreshold",
                    val ? Number(val) : 0
                  )
                }
              />

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => onDuplicateRule(index)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Copy size={14} />
                  {tRegister("branch.delivery.actions.duplicate")}
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveRule(index)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-red-100 bg-red-50 px-4 text-red-600 hover:bg-red-100"
                  aria-label={tRegister("branch.delivery.postalRules.remove")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
