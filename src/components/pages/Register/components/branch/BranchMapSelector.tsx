"use client";

import { Loader2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface BranchMapSelectorProps {
  coordinatesLabel: string;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  mapsLoading: boolean;
  mapsReady: boolean;
}

export function BranchMapSelector({
  coordinatesLabel,
  mapContainerRef,
  mapsLoading,
  mapsReady,
}: BranchMapSelectorProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      {mapsReady ? (
        <>
          <div ref={mapContainerRef} className="h-[280px] w-full" />

          <div className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span>{tRegister("branch.map.helper")}</span>

            <span className="shrink-0 font-medium text-gray-700">
              {coordinatesLabel}
            </span>
          </div>
        </>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
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
                {tRegister("branch.map.enableMapHelp")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
