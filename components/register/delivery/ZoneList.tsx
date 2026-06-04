"use client";

import { FormInput } from "@/components/register/form/FormInput";
import { toInputNumber } from "@/lib/delivery-area";
import type { DeliveryZone, LatLngKey, LatLngPoint } from "@/types/delivery";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ZoneListProps {
  activeZoneIndex: number;
  onActiveZoneChange: (index: number) => void;
  onAddPoint: (zoneIndex: number, point?: LatLngPoint | null) => void;
  onAddZone: () => void;
  onDuplicateZone: (index: number) => void;
  onRemovePoint: (zoneIndex: number, pointIndex: number) => void;
  onRemoveZone: (index: number) => void;
  onUpdatePoint: (
    zoneIndex: number,
    pointIndex: number,
    key: LatLngKey,
    value: string | number
  ) => void;
  onUpdateZone: (
    index: number,
    key: keyof DeliveryZone,
    value: number | string | LatLngPoint[]
  ) => void;
  zones: DeliveryZone[];
}

export function ZoneList({
  activeZoneIndex,
  onActiveZoneChange,
  onAddPoint,
  onAddZone,
  onDuplicateZone,
  onRemovePoint,
  onRemoveZone,
  onUpdatePoint,
  onUpdateZone,
  zones,
}: ZoneListProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {tRegister("branch.delivery.zones.title")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {tRegister("branch.delivery.zones.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddZone}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <Plus size={15} />
          {tRegister("branch.delivery.zones.add")}
        </button>
      </div>

      {zones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
          {tRegister("branch.delivery.zones.empty")}
        </div>
      ) : (
        zones.map((zone, zoneIndex) => {
          const polygon = Array.isArray(zone.polygon) ? zone.polygon : [];

          return (
            <div
              key={`delivery-zone-${zoneIndex}`}
              className={`rounded-2xl border bg-white p-4 transition ${
                zoneIndex === activeZoneIndex
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-gray-200"
              }`}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onActiveZoneChange(zoneIndex)}
                  className="text-left"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {tRegister("branch.delivery.zones.zoneLabel", {
                      number: zoneIndex + 1,
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {zoneIndex === activeZoneIndex
                      ? tRegister("branch.delivery.zones.activePointCount", {
                          count: polygon.length,
                        })
                      : tRegister("branch.delivery.zones.clickToEdit")}
                  </p>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDuplicateZone(zoneIndex)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Copy size={13} />
                    {tRegister("branch.delivery.actions.duplicate")}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveZone(zoneIndex)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={13} />
                    {tRegister("branch.delivery.actions.remove")}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FormInput
                  label={tRegister("branch.delivery.fields.zoneName.label")}
                  placeholder={tRegister(
                    "branch.delivery.fields.zoneName.placeholder"
                  )}
                  value={zone.name || ""}
                  onChange={(val) => onUpdateZone(zoneIndex, "name", val)}
                />

                <FormInput
                  label={tRegister(
                    "branch.delivery.fields.zoneDeliveryFee.label"
                  )}
                  placeholder={tRegister(
                    "branch.delivery.fields.zoneDeliveryFee.placeholder"
                  )}
                  value={toInputNumber(zone.deliveryFee)}
                  onChange={(val) =>
                    onUpdateZone(zoneIndex, "deliveryFee", val ? Number(val) : 0)
                  }
                />

                <FormInput
                  label={tRegister("branch.delivery.fields.zoneMinOrder.label")}
                  placeholder={tRegister(
                    "branch.delivery.fields.minOrderAmount.placeholder"
                  )}
                  value={toInputNumber(zone.minOrderAmount)}
                  onChange={(val) =>
                    onUpdateZone(
                      zoneIndex,
                      "minOrderAmount",
                      val ? Number(val) : 0
                    )
                  }
                />

                <FormInput
                  label={tRegister(
                    "branch.delivery.fields.zoneFreeDeliveryFrom.label"
                  )}
                  placeholder={tRegister(
                    "branch.delivery.fields.freeDeliveryThreshold.placeholder"
                  )}
                  value={toInputNumber(zone.freeDeliveryThreshold)}
                  onChange={(val) =>
                    onUpdateZone(
                      zoneIndex,
                      "freeDeliveryThreshold",
                      val ? Number(val) : 0
                    )
                  }
                />
              </div>

              <div className="mt-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {tRegister("branch.delivery.zones.polygonPoints")}
                  </p>

                  <button
                    type="button"
                    onClick={() => onAddPoint(zoneIndex)}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                  >
                    <Plus size={13} />
                    {tRegister("branch.delivery.zones.addEmptyPoint")}
                  </button>
                </div>

                <div className="space-y-2">
                  {polygon.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                      {tRegister("branch.delivery.zones.noPoints")}
                    </div>
                  ) : (
                    polygon.map((point, pointIndex) => (
                      <div
                        key={`zone-${zoneIndex}-point-${pointIndex}`}
                        className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-[80px_1fr_1fr_auto]"
                      >
                        <div className="flex items-center text-xs font-medium text-gray-500">
                          {tRegister("branch.delivery.zones.pointLabel", {
                            number: pointIndex + 1,
                          })}
                        </div>

                        <input
                          type="text"
                          inputMode="decimal"
                          value={point.lat ?? ""}
                          onChange={(event) =>
                            onUpdatePoint(
                              zoneIndex,
                              pointIndex,
                              "lat",
                              event.target.value
                            )
                          }
                          placeholder={tRegister(
                            "branch.address.fields.latitude.requiredLabel"
                          )}
                          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                        />

                        <input
                          type="text"
                          inputMode="decimal"
                          value={point.lng ?? ""}
                          onChange={(event) =>
                            onUpdatePoint(
                              zoneIndex,
                              pointIndex,
                              "lng",
                              event.target.value
                            )
                          }
                          placeholder={tRegister(
                            "branch.address.fields.longitude.requiredLabel"
                          )}
                          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                        />

                        <button
                          type="button"
                          onClick={() => onRemovePoint(zoneIndex, pointIndex)}
                          disabled={polygon.length <= 3}
                          className="inline-flex h-10 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={tRegister(
                            "branch.delivery.zones.removePoint"
                          )}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
