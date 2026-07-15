"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { BranchMapSelector } from "./BranchMapSelector";

interface BranchLocationSearchProps {
  addressQuery: string;
  addressSearching: boolean;
  autocompleteInputRef: React.RefObject<HTMLInputElement | null>;
  coordinatesLabel: string;
  locationError: string;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  mapsError: string;
  mapsLoading: boolean;
  mapsReady: boolean;
  onAddressKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddressQueryChange: (value: string) => void;
  onAddressSearch: () => void;
  selectedGoogleAddress: string;
  gettingLocation: boolean;
}

export function BranchLocationSearch({
  addressQuery,
  addressSearching,
  autocompleteInputRef,
  coordinatesLabel,
  gettingLocation,
  locationError,
  mapContainerRef,
  mapsError,
  mapsLoading,
  mapsReady,
  onAddressKeyDown,
  onAddressQueryChange,
  onAddressSearch,
  selectedGoogleAddress,
}: BranchLocationSearchProps) {
  const tRegister = useTranslations("register");

  return (
    <div className="sm:col-span-2">
      <label className="text-[16px] mb-2 block">
        {tRegister("branch.map.addressFromGoogle")}
      </label>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            ref={autocompleteInputRef}
            type="text"
            value={addressQuery}
            onChange={(event) => onAddressQueryChange(event.target.value)}
            onKeyDown={onAddressKeyDown}
            placeholder={tRegister("branch.map.searchPlaceholder")}
            className="h-[52px] w-full rounded-[10px] border border-[#bbbbbb] bg-white pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          {(mapsLoading || gettingLocation || addressSearching) && (
            <Loader2
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary"
            />
          )}

          {!mapsLoading &&
          !gettingLocation &&
          !addressSearching &&
          mapsReady &&
          selectedGoogleAddress ? (
            <CheckCircle2
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
            />
          ) : null}

          {!mapsLoading && !gettingLocation && !addressSearching && mapsError ? (
            <AlertCircle
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500"
            />
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onAddressSearch}
          disabled={!mapsReady || addressSearching || mapsLoading}
          className="h-[52px] rounded-[10px] border-primary px-5 text-primary disabled:opacity-50"
        >
          {addressSearching ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          {tRegister("branch.map.searchButton")}
        </Button>
      </div>

      <BranchMapSelector
        coordinatesLabel={coordinatesLabel}
        mapContainerRef={mapContainerRef}
        mapsLoading={mapsLoading}
        mapsReady={mapsReady}
      />

      <div className="mt-2 space-y-1">
        {mapsError ? <p className="text-xs text-amber-600">{mapsError}</p> : null}

        {selectedGoogleAddress ? (
          <p className="text-xs text-gray-500">
            {tRegister("branch.map.selectedAddress", {
              address: selectedGoogleAddress,
            })}
          </p>
        ) : null}

        {locationError ? (
          <p className="text-xs text-red-500">{locationError}</p>
        ) : null}
      </div>
    </div>
  );
}
