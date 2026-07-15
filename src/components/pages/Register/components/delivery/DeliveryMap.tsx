"use client";

import { Button } from "@/components/ui/button";
import type { DeliveryMode, DeliveryZone } from "@/types/delivery";
import {
  AlertCircle,
  Crosshair,
  Loader2,
  MapPin,
  Maximize2,
  Search,
  Trash2,
  Undo2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DeliveryMapProps {
  activeZone: DeliveryZone | undefined;
  activeZoneIndex: number;
  activeZonePointsCount: number;
  branchCoordinates: { lat: number; lng: number } | null;
  deliveryMode: DeliveryMode;
  fitActiveZone: () => void;
  generateStarterZone: () => void;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  mapSearch: string;
  mapSearching: boolean;
  mapsError: string;
  mapsLoading: boolean;
  mapsReady: boolean;
  mapsReadyForSearch: boolean;
  onAddCenterPoint: () => void;
  onClearActiveZone: () => void;
  onMapSearch: () => void;
  onMapSearchChange: (value: string) => void;
  onMapSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onUndoLastPoint: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  selectedSearchLabel: string;
  setActiveZoneIndex: (index: number) => void;
  zones: DeliveryZone[];
}

export function DeliveryMap({
  activeZone,
  activeZoneIndex,
  activeZonePointsCount,
  branchCoordinates,
  deliveryMode,
  fitActiveZone,
  generateStarterZone,
  mapContainerRef,
  mapSearch,
  mapSearching,
  mapsError,
  mapsLoading,
  mapsReady,
  mapsReadyForSearch,
  onAddCenterPoint,
  onClearActiveZone,
  onMapSearch,
  onMapSearchChange,
  onMapSearchKeyDown,
  onUndoLastPoint,
  searchInputRef,
  selectedSearchLabel,
  setActiveZoneIndex,
  zones,
}: DeliveryMapProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {deliveryMode === "RADIUS"
                ? tRegister("branch.delivery.map.radiusTitle")
                : tRegister("branch.delivery.map.zoneTitle")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {deliveryMode === "RADIUS"
                ? tRegister("branch.delivery.map.radiusDescription")
                : tRegister("branch.delivery.map.zoneDescription")}
            </p>
          </div>

          {deliveryMode === "ZONE" && zones.length > 0 ? (
            <select
              value={activeZoneIndex}
              onChange={(event) => setActiveZoneIndex(Number(event.target.value))}
              className="h-10 rounded-full border border-gray-200 bg-white px-4 text-sm outline-none focus:border-primary"
            >
              {zones.map((zone, index) => (
                <option key={`zone-select-${index}`} value={index}>
                  {zone.name ||
                    tRegister("branch.delivery.zones.zoneLabel", {
                      number: index + 1,
                    })}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {deliveryMode === "ZONE" ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  value={mapSearch}
                  onChange={(event) => onMapSearchChange(event.target.value)}
                  onKeyDown={onMapSearchKeyDown}
                  placeholder={tRegister("branch.delivery.map.searchPlaceholder")}
                  className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={onMapSearch}
                disabled={!mapsReadyForSearch || mapSearching || mapsLoading}
                className="h-11 rounded-full border-primary px-5 text-primary disabled:opacity-50"
              >
                {mapSearching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                {tRegister("branch.delivery.map.searchButton")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generateStarterZone}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
              >
                <Crosshair size={14} />
                {tRegister("branch.delivery.map.generateStarterZone")}
              </button>

              <button
                type="button"
                onClick={onAddCenterPoint}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <MapPin size={14} />
                {tRegister("branch.delivery.map.addCenterPoint")}
              </button>

              <button
                type="button"
                onClick={onUndoLastPoint}
                disabled={!activeZonePointsCount}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Undo2 size={14} />
                {tRegister("branch.delivery.map.undoLastPoint")}
              </button>

              <button
                type="button"
                onClick={fitActiveZone}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Maximize2 size={14} />
                {tRegister("branch.delivery.map.fitActiveZone")}
              </button>

              <button
                type="button"
                onClick={onClearActiveZone}
                disabled={!zones.length}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />
                {tRegister("branch.delivery.map.clearActiveZone")}
              </button>
            </div>

            {selectedSearchLabel ? (
              <p className="text-xs text-gray-500">
                {tRegister("branch.delivery.map.selectedMapArea", {
                  area: selectedSearchLabel,
                })}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {mapsReady ? (
        <div className="relative">
          <div ref={mapContainerRef} className="h-[440px] w-full" />

          {deliveryMode === "ZONE" ? (
            <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-3 text-xs shadow-md ring-1 ring-gray-100">
              <p className="font-semibold text-gray-900">
                {activeZone?.name ||
                  tRegister("branch.delivery.zones.zoneLabel", {
                    number: activeZoneIndex + 1,
                  })}
              </p>
              <p className="mt-1 text-gray-500">
                {tRegister("branch.delivery.map.pointCount", {
                  count: activeZonePointsCount,
                })}
              </p>
              <p className="mt-1 text-gray-400">
                {tRegister("branch.delivery.map.clickDragHelp")}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
          {mapsLoading ? (
            <>
              <Loader2 className="mb-3 animate-spin text-primary" size={28} />
              <p className="text-sm font-medium text-gray-700">
                {tRegister("branch.map.loading")}
              </p>
            </>
          ) : (
            <>
              <MapPin className="mb-3 text-gray-400" size={30} />
              <p className="text-sm font-medium text-gray-700">
                {tRegister("branch.map.previewUnavailable")}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {tRegister("branch.delivery.map.enableMapHelp")}
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {deliveryMode === "RADIUS"
            ? tRegister("branch.delivery.map.radiusFooter")
            : tRegister("branch.delivery.map.zoneFooter")}
        </span>

        <span className="shrink-0 font-medium text-gray-700">
          {branchCoordinates
            ? `${branchCoordinates.lat}, ${branchCoordinates.lng}`
            : tRegister("branch.delivery.map.branchCoordinatesNotSelected")}
        </span>
      </div>

      {mapsError ? (
        <div className="flex items-start gap-2 border-t border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{mapsError}</span>
        </div>
      ) : null}
    </div>
  );
}
