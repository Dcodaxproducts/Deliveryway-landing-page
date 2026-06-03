"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "./form/FormInput";
import { DeliveryMap } from "./delivery/DeliveryMap";
import { DeliveryModeSelector } from "./delivery/DeliveryModeSelector";
import { PostalCodeRules } from "./delivery/PostalCodeRules";
import { RadiusDeliverySettings } from "./delivery/RadiusDeliverySettings";
import { ZoneList } from "./delivery/ZoneList";
import {
  DEFAULT_DELIVERY_MAP_CENTER,
  createDefaultPostalCodeRule,
  createDefaultZone,
  createDefaultZoneBand,
  createPolygonAroundCenter,
  getValidPoint,
  sanitizeDecimalInput,
  toFiniteNumber,
  toInputNumber,
  toNumber,
} from "@/lib/delivery-area";
import type {
  BranchDeliveryAddress,
  BranchDeliverySettings,
  DeliveryConfig,
  DeliveryMode,
  DeliveryZone,
  DeliveryZoneBand,
  GoogleDeliveryMapsNamespace,
  GoogleMapCircle,
  GoogleMapInstance,
  GoogleMapMarker,
  GoogleMapPolygon,
  LatLngKey,
  LatLngPoint,
  PostalCodeRule,
} from "@/types/delivery";
import type { GoogleAutocomplete, GoogleGeocoderResult } from "@/types/register";
import { useTranslations } from "next-intl";

type Props = {
  branchAddress?: BranchDeliveryAddress;
  settings?: BranchDeliverySettings;
  onChange: (nextSettings: BranchDeliverySettings) => void;
};

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";
const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

const isGoogleMapsKeyConfigured = () => {
  return (
    Boolean(GOOGLE_MAPS_API_KEY) &&
    GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY"
  );
};

const getGoogleMaps = () => {
  return (window.google as { maps?: GoogleDeliveryMapsNamespace } | undefined)
    ?.maps;
};

const isMapPoint = (
  point: { lat: number; lng: number } | null
): point is { lat: number; lng: number } => point !== null;

export function BranchDeliveryAreaSettings({
  branchAddress,
  settings = {},
  onChange,
}: Props) {
  const tRegister = useTranslations("register");
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const [mapSearch, setMapSearch] = useState("");
  const [mapSearching, setMapSearching] = useState(false);
  const [selectedSearchLabel, setSelectedSearchLabel] = useState("");
  const [selectedMapCenter, setSelectedMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstanceRef = useRef<GoogleAutocomplete | null>(null);
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const branchMarkerRef = useRef<GoogleMapMarker | null>(null);
  const searchMarkerRef = useRef<GoogleMapMarker | null>(null);
  const circleRef = useRef<GoogleMapCircle | null>(null);
  const polygonRef = useRef<GoogleMapPolygon | null>(null);
  const polygonMarkersRef = useRef<GoogleMapMarker[]>([]);

  const deliveryConfig = settings?.deliveryConfig || {};
  const deliveryMode: DeliveryMode =
    deliveryConfig.mode === "ZONE" || deliveryConfig.mode === "POSTAL_CODE"
      ? deliveryConfig.mode
      : "RADIUS";

  const delivery = {
    mode: deliveryMode,
    radiusKm: deliveryConfig.radiusKm ?? settings?.radiusKm ?? "",
    minOrderAmount:
      deliveryConfig.minOrderAmount ?? settings?.minOrderAmount ?? "",
    deliveryFee: deliveryConfig.deliveryFee ?? settings?.deliveryFee ?? "",
    isFreeDelivery: Boolean(deliveryConfig.isFreeDelivery),
    freeDeliveryThreshold: deliveryConfig.freeDeliveryThreshold ?? 0,
    zones: Array.isArray(deliveryConfig.zones) ? deliveryConfig.zones : [],
    zoneBands: Array.isArray(deliveryConfig.zoneBands)
      ? deliveryConfig.zoneBands
      : [],
    postalCodeRules: Array.isArray(deliveryConfig.postalCodeRules)
      ? deliveryConfig.postalCodeRules
      : [],
  };

  const zones: DeliveryZone[] = delivery.zones;
  const zoneBands: DeliveryZoneBand[] = delivery.zoneBands;
  const postalCodeRules: PostalCodeRule[] = delivery.postalCodeRules;

  const branchCoordinates = useMemo(() => {
    const lat = toFiniteNumber(branchAddress?.lat);
    const lng = toFiniteNumber(branchAddress?.lng);

    if (lat === null || lng === null) return null;

    return { lat, lng };
  }, [branchAddress?.lat, branchAddress?.lng]);

  const fallbackCenter =
    selectedMapCenter || branchCoordinates || DEFAULT_DELIVERY_MAP_CENTER;
  const shouldShowMap = deliveryMode === "RADIUS" || deliveryMode === "ZONE";

  const emitSettings = (nextSettings: BranchDeliverySettings) => {
    onChange(nextSettings);
  };

  const updateDeliveryConfig = <Key extends keyof DeliveryConfig>(
    key: Key,
    value: DeliveryConfig[Key]
  ) => {
    const nextDeliveryConfig = {
      ...deliveryConfig,
      mode: deliveryMode,
      zones,
      zoneBands,
      postalCodeRules,
      [key]: value,
    };

    const nextSettings: BranchDeliverySettings = {
      ...settings,
      deliveryConfig: nextDeliveryConfig,
    };

    // Backward compatibility for existing registration schema/older payloads.
    if (
      key === "radiusKm" &&
      (typeof value === "string" || typeof value === "number")
    ) {
      nextSettings.radiusKm = value;
    }

    if (
      key === "minOrderAmount" &&
      (typeof value === "string" || typeof value === "number")
    ) {
      nextSettings.minOrderAmount = value;
    }

    emitSettings(nextSettings);
  };


  const updateAutomation = (
    key: "autoAcceptOrders" | "estimatedPrepTime",
    value: boolean | number
  ) => {
    const nextAutomation = {
      ...(settings?.automation || {}),
      [key]: value,
    };

    const nextSettings: BranchDeliverySettings = {
      ...settings,
      automation: nextAutomation,
    };

    if (key === "estimatedPrepTime" && typeof value === "number") {
      nextSettings.estimatedPrepTime = value;
    }

    emitSettings(nextSettings);
  };


  const updateZone = (
    index: number,
    key: keyof DeliveryZone,
    value: number | string | LatLngPoint[]
  ) => {
    const nextZones = zones.map((zone, zoneIndex) =>
      zoneIndex === index
        ? {
            ...zone,
            [key]: value,
          }
        : zone
    );

    updateDeliveryConfig("zones", nextZones);
  };

  const addZone = () => {
    const nextZones = [
      ...zones,
      createDefaultZone(toNumber(delivery.deliveryFee, 0), fallbackCenter),
    ];

    updateDeliveryConfig("zones", nextZones);
    setActiveZoneIndex(nextZones.length - 1);
  };

  const duplicateZone = (index: number) => {
    const source = zones[index];
    if (!source) return;

    const clonedZone = {
      ...source,
      name: source?.name ? `${source.name} Copy` : "Zone Copy",
      polygon: Array.isArray(source?.polygon)
        ? source.polygon.map((point) => ({ ...point }))
        : [],
    };

    const nextZones = [...zones];
    nextZones.splice(index + 1, 0, clonedZone);
    updateDeliveryConfig("zones", nextZones);
    setActiveZoneIndex(index + 1);
  };

  const removeZone = (index: number) => {
    const nextZones = zones.filter((_, zoneIndex) => zoneIndex !== index);

    updateDeliveryConfig("zones", nextZones);
    setActiveZoneIndex((prev) => Math.max(0, Math.min(prev, nextZones.length - 1)));
  };

  const updateZonePoint = (
    zoneIndex: number,
    pointIndex: number,
    key: LatLngKey,
    value: string | number
  ) => {
    const nextZones = zones.map((zone, currentZoneIndex) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.map((point, currentPointIndex) =>
          currentPointIndex === pointIndex
            ? {
                ...point,
                [key]: String(value),
              }
            : point
        ),
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const updateZonePointCoordinates = (
    zoneIndex: number,
    pointIndex: number,
    lat: string | number,
    lng: string | number
  ) => {
    const nextZones = zones.map((zone, currentZoneIndex) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.map((point, currentPointIndex) =>
          currentPointIndex === pointIndex
            ? {
                ...point,
                lat: String(lat),
                lng: String(lng),
              }
            : point
        ),
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const addZonePoint = (zoneIndex: number, point?: LatLngPoint | null) => {
    const nextZones = zones.map((zone, currentZoneIndex) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];
      const nextPoint = point
        ? {
            lat: String(point.lat),
            lng: String(point.lng),
          }
        : {
            lat: "",
            lng: "",
          };

      return {
        ...zone,
        polygon: [...polygon, nextPoint],
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const removeZonePoint = (zoneIndex: number, pointIndex: number) => {
    const nextZones = zones.map((zone, currentZoneIndex) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.filter(
          (_, currentPointIndex) => currentPointIndex !== pointIndex
        ),
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const clearZonePoints = (zoneIndex: number) => {
    const nextZones = zones.map((zone, currentZoneIndex) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      return {
        ...zone,
        polygon: [],
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const undoLastPoint = () => {
    const zone = zones[activeZoneIndex];
    const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];
    if (!polygon.length) return;

    removeZonePoint(activeZoneIndex, polygon.length - 1);
  };


  const updateZoneBand = (
    index: number,
    key: keyof DeliveryZoneBand,
    value: number | string
  ) => {
    const nextBands = zoneBands.map((band, bandIndex) =>
      bandIndex === index
        ? {
            ...band,
            [key]: value,
          }
        : band
    );

    updateDeliveryConfig("zoneBands", nextBands);
  };

  const addZoneBand = () => {
    const lastBand = zoneBands[zoneBands.length - 1];
    const nextFromKm = lastBand?.toKm !== undefined ? toNumber(lastBand.toKm, 0) : 0;

    updateDeliveryConfig("zoneBands", [
      ...zoneBands,
      {
        ...createDefaultZoneBand(),
        fromKm: nextFromKm,
        toKm: nextFromKm ? nextFromKm + 2.5 : 2.5,
        deliveryFee: toNumber(delivery.deliveryFee, 0),
        minOrderAmount: toNumber(delivery.minOrderAmount, 0),
        freeDeliveryThreshold: toNumber(delivery.freeDeliveryThreshold, 0),
      },
    ]);
  };

  const duplicateZoneBand = (index: number) => {
    const source = zoneBands[index];
    if (!source) return;

    const nextBands = [...zoneBands];
    nextBands.splice(index + 1, 0, { ...source });
    updateDeliveryConfig("zoneBands", nextBands);
  };

  const removeZoneBand = (index: number) => {
    updateDeliveryConfig(
      "zoneBands",
      zoneBands.filter((_, bandIndex) => bandIndex !== index)
    );
  };

  const updatePostalRule = (
    index: number,
    key: keyof PostalCodeRule,
    value: number | string
  ) => {
    const nextRules = postalCodeRules.map((rule, ruleIndex) =>
      ruleIndex === index
        ? {
            ...rule,
            [key]: value,
          }
        : rule
    );

    updateDeliveryConfig("postalCodeRules", nextRules);
  };

  const addPostalRule = () => {
    updateDeliveryConfig("postalCodeRules", [
      ...postalCodeRules,
      createDefaultPostalCodeRule(toNumber(delivery.deliveryFee, 0)),
    ]);
  };

  const duplicatePostalRule = (index: number) => {
    const source = postalCodeRules[index];
    if (!source) return;

    const nextRules = [...postalCodeRules];
    nextRules.splice(index + 1, 0, {
      ...source,
      postalCode: "",
    });

    updateDeliveryConfig("postalCodeRules", nextRules);
  };

  const removePostalRule = (index: number) => {
    updateDeliveryConfig(
      "postalCodeRules",
      postalCodeRules.filter((_, ruleIndex) => ruleIndex !== index)
    );
  };

  const getMapCenter = () => {
    const center = mapInstanceRef.current?.getCenter?.();
    const lat = center?.lat?.();
    const lng = center?.lng?.();

    if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      return { lat: Number(lat), lng: Number(lng) };
    }

    return fallbackCenter;
  };

  const generateStarterZone = () => {
    const center = selectedMapCenter || getMapCenter();
    const polygon = createPolygonAroundCenter(
      center,
      Math.max(0.8, Math.min(4, toNumber(delivery.radiusKm, 2) / 2 || 1))
    );

    if (!zones.length) {
      updateDeliveryConfig("zones", [
        {
          name: "Delivery Zone 1",
          deliveryFee: toNumber(delivery.deliveryFee, 0),
          polygon,
        },
      ]);
      setActiveZoneIndex(0);
      return;
    }

    updateZone(activeZoneIndex, "polygon", polygon);
  };

  const addCenterPoint = () => {
    const center = selectedMapCenter || getMapCenter();

    if (!zones.length) {
      updateDeliveryConfig("zones", [
        {
          name: "Delivery Zone 1",
          deliveryFee: toNumber(delivery.deliveryFee, 0),
          polygon: [
            {
              lat: center.lat.toFixed(6),
              lng: center.lng.toFixed(6),
            },
          ],
        },
      ]);
      setActiveZoneIndex(0);
      return;
    }

    addZonePoint(activeZoneIndex, {
      lat: center.lat.toFixed(6),
      lng: center.lng.toFixed(6),
    });
  };

  const clearMapOverlays = () => {
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    polygonMarkersRef.current.forEach((marker) => marker.setMap(null));
    polygonMarkersRef.current = [];
  };

  const renderBranchMarker = () => {
    const maps = getGoogleMaps();

    if (!maps?.Marker || !maps.SymbolPath || !mapInstanceRef.current || !branchCoordinates) {
      if (branchMarkerRef.current) {
        branchMarkerRef.current.setMap(null);
        branchMarkerRef.current = null;
      }
      return;
    }

    const position = {
      lat: branchCoordinates.lat,
      lng: branchCoordinates.lng,
    };

    if (!branchMarkerRef.current) {
      branchMarkerRef.current = new maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: tRegister("branch.map.markerTitle"),
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#111827",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    } else {
      branchMarkerRef.current.setPosition(position);
      branchMarkerRef.current.setMap(mapInstanceRef.current);
    }
  };

  const renderSearchMarker = () => {
    const maps = getGoogleMaps();

    if (!maps?.Marker || !maps.SymbolPath || !mapInstanceRef.current || !selectedMapCenter) {
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = null;
      }
      return;
    }

    if (!searchMarkerRef.current) {
      searchMarkerRef.current = new maps.Marker({
        position: selectedMapCenter,
        map: mapInstanceRef.current,
        title: tRegister("branch.delivery.map.searchedAreaMarker"),
        icon: {
          path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    } else {
      searchMarkerRef.current.setPosition(selectedMapCenter);
      searchMarkerRef.current.setMap(mapInstanceRef.current);
    }
  };

  const renderRadiusOverlay = () => {
    const maps = getGoogleMaps();
    if (!maps?.Circle || !mapInstanceRef.current) return;

    const center =
      branchCoordinates || selectedMapCenter || DEFAULT_DELIVERY_MAP_CENTER;
    const radiusMeters = Math.max(0.1, toNumber(delivery.radiusKm, 1)) * 1000;

    circleRef.current = new maps.Circle({
      map: mapInstanceRef.current,
      center,
      radius: radiusMeters,
      fillColor: "#2563eb",
      fillOpacity: 0.12,
      strokeColor: "#2563eb",
      strokeOpacity: 0.7,
      strokeWeight: 2,
    });

    mapInstanceRef.current.panTo(center);

    const bounds = circleRef.current.getBounds?.();
    if (bounds) mapInstanceRef.current.fitBounds(bounds);
  };

  const fitActiveZone = () => {
    const maps = getGoogleMaps();
    if (!maps?.LatLngBounds || !mapInstanceRef.current) return;

    const zone = zones[activeZoneIndex];
    const points = Array.isArray(zone?.polygon)
      ? zone.polygon.map(getValidPoint).filter(isMapPoint)
      : [];

    if (!points.length) {
      mapInstanceRef.current.panTo(
        selectedMapCenter || branchCoordinates || DEFAULT_DELIVERY_MAP_CENTER
      );
      mapInstanceRef.current.setZoom(branchCoordinates || selectedMapCenter ? 14 : 12);
      return;
    }

    const bounds = new maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds);
  };

  const renderZoneOverlay = () => {
    const maps = getGoogleMaps();
    if (!maps?.LatLngBounds || !maps.Marker || !mapInstanceRef.current) return;

    const Marker = maps.Marker;
    const map = mapInstanceRef.current;

    const zone = zones[activeZoneIndex];
    const points = Array.isArray(zone?.polygon)
      ? zone.polygon.map(getValidPoint).filter(isMapPoint)
      : [];

    if (!points.length) {
      map.panTo(
        selectedMapCenter || branchCoordinates || DEFAULT_DELIVERY_MAP_CENTER
      );
      map.setZoom(branchCoordinates || selectedMapCenter ? 14 : 12);
      return;
    }

    const bounds = new maps.LatLngBounds();

    points.forEach((point, pointIndex) => {
      bounds.extend(point);

      const marker = new Marker({
        position: point,
        map,
        draggable: true,
        label: String(pointIndex + 1),
        title: tRegister("branch.delivery.zones.pointLabel", {
          number: pointIndex + 1,
        }),
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition?.();
        const lat = position?.lat?.();
        const lng = position?.lng?.();

        if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
          updateZonePointCoordinates(
            activeZoneIndex,
            pointIndex,
            Number(lat).toFixed(6),
            Number(lng).toFixed(6)
          );
        }
      });

      polygonMarkersRef.current.push(marker);
    });

    if (points.length >= 3 && maps.Polygon) {
      polygonRef.current = new maps.Polygon({
        paths: points,
        map: mapInstanceRef.current,
        fillColor: "#2563eb",
        fillOpacity: 0.12,
        strokeColor: "#2563eb",
        strokeOpacity: 0.85,
        strokeWeight: 2,
      });
    }

    map.fitBounds(bounds);
  };

  const applyMapSearchResult = (result: GoogleGeocoderResult) => {
    const lat = result?.geometry?.location?.lat?.();
    const lng = result?.geometry?.location?.lng?.();

    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
      setMapsError(tRegister("branch.delivery.map.invalidSelectedCoordinates"));
      return;
    }

    const center = {
      lat: Number(lat),
      lng: Number(lng),
    };

    setSelectedMapCenter(center);
    setSelectedSearchLabel(result?.formatted_address || result?.name || mapSearch);
    setMapSearch(result?.formatted_address || result?.name || mapSearch);
    setMapsError("");

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(14);
    }
  };

  const handleMapSearch = () => {
    const query = mapSearch.trim();

    if (!query) {
      setMapsError(tRegister("branch.delivery.map.enterSearch"));
      return;
    }

    const maps = getGoogleMaps();

    if (!maps?.Geocoder) {
      setMapsError(tRegister("branch.map.notReady"));
      return;
    }

    setMapSearching(true);
    setMapsError("");

    const geocoder = new maps.Geocoder();

    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        applyMapSearchResult(results[0]);
      } else {
        setMapsError(tRegister("branch.delivery.map.noMatchingArea"));
      }

      setMapSearching(false);
    });
  };

  const handleMapSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    handleMapSearch();
  };

  /* ---------------- GOOGLE MAPS SCRIPT ---------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (getGoogleMaps()?.places) {
      setMapsReady(true);
      setMapsLoading(false);
      setMapsError("");
      return;
    }

    if (!isGoogleMapsKeyConfigured()) {
      setMapsReady(false);
      setMapsLoading(false);
      setMapsError(
        tRegister("branch.map.missingApiKey")
      );
      return;
    }

    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      setMapsReady(true);
      setMapsLoading(false);
      setMapsError("");
    };

    const handleError = () => {
      setMapsReady(false);
      setMapsLoading(false);
      setMapsError(tRegister("branch.map.loadFailed"));
    };

    setMapsLoading(true);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      if (getGoogleMaps()?.places) {
        handleLoad();
      }

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY
    )}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [tRegister]);

  /* ---------------- AUTOCOMPLETE ---------------- */

  useEffect(() => {
    const maps = getGoogleMaps();

    if (!mapsReady || !searchInputRef.current) return;
    if (!maps?.places?.Autocomplete) return;
    if (autocompleteInstanceRef.current) return;

    const autocomplete = new maps.places.Autocomplete(
      searchInputRef.current,
      {
        fields: ["formatted_address", "geometry", "name", "place_id"],
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocompleteInstanceRef.current?.getPlace?.();

      if (!place?.geometry) {
        setMapsError(tRegister("branch.delivery.map.selectSuggestion"));
        return;
      }

      applyMapSearchResult(place);
    });

    autocompleteInstanceRef.current = autocomplete;

    return () => {
      const currentMaps = getGoogleMaps();

      if (currentMaps?.event && autocompleteInstanceRef.current) {
        currentMaps.event.clearInstanceListeners(
          autocompleteInstanceRef.current
        );
      }

      autocompleteInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsReady, tRegister]);

  /* ---------------- GOOGLE MAP INIT ---------------- */

  useEffect(() => {
    if (!shouldShowMap) {
      clearMapOverlays();
      mapInstanceRef.current = null;
      return;
    }

    const maps = getGoogleMaps();

    if (!mapsReady || !mapContainerRef.current) return;
    if (!maps?.Map || !maps.event) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new maps.Map(mapContainerRef.current, {
        center: fallbackCenter,
        zoom: branchCoordinates || selectedMapCenter ? 14 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        draggableCursor: deliveryMode === "ZONE" ? "crosshair" : undefined,
      });
    }

    maps.event.trigger(mapInstanceRef.current, "resize");
  }, [mapsReady, shouldShowMap, deliveryMode, fallbackCenter, branchCoordinates, selectedMapCenter]);

  /* ---------------- GOOGLE MAP OVERLAYS ---------------- */

  useEffect(() => {
    if (!mapsReady || !shouldShowMap || !mapInstanceRef.current) return;
    const maps = getGoogleMaps();
    if (!maps?.event) return;

    clearMapOverlays();
    renderBranchMarker();
    renderSearchMarker();

    mapInstanceRef.current.setOptions({
      draggableCursor: deliveryMode === "ZONE" ? "crosshair" : undefined,
    });

    maps.event.clearListeners(mapInstanceRef.current, "click");

    if (deliveryMode === "RADIUS") {
      renderRadiusOverlay();
      return;
    }

    renderZoneOverlay();

    mapInstanceRef.current.addListener("click", (event) => {
      const lat = event?.latLng?.lat?.();
      const lng = event?.latLng?.lng?.();

      if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;

      if (!zones.length) {
        updateDeliveryConfig("zones", [
          {
            name: tRegister("branch.delivery.zones.defaultName", {
              number: 1,
            }),
            deliveryFee: toNumber(delivery.deliveryFee, 0),
            minOrderAmount: toNumber(delivery.minOrderAmount, 0),
            freeDeliveryThreshold: toNumber(delivery.freeDeliveryThreshold, 0),
            polygon: [
              {
                lat: Number(lat).toFixed(6),
                lng: Number(lng).toFixed(6),
              },
            ],
          },
        ]);
        setActiveZoneIndex(0);
        return;
      }

      const safeZoneIndex = Math.min(activeZoneIndex, zones.length - 1);
      addZonePoint(safeZoneIndex, {
        lat: Number(lat).toFixed(6),
        lng: Number(lng).toFixed(6),
      });
    });

    return () => {
      const currentMaps = getGoogleMaps();

      if (currentMaps?.event && mapInstanceRef.current) {
        currentMaps.event.clearListeners(mapInstanceRef.current, "click");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapsReady,
    shouldShowMap,
    deliveryMode,
    delivery.radiusKm,
    activeZoneIndex,
    zones,
    branchCoordinates,
    selectedMapCenter,
    tRegister,
  ]);

  useEffect(() => {
    if (activeZoneIndex <= zones.length - 1) return;
    setActiveZoneIndex(Math.max(0, zones.length - 1));
  }, [activeZoneIndex, zones.length]);

  const activeZone = zones[activeZoneIndex];
  const activeZonePoints = Array.isArray(activeZone?.polygon)
    ? activeZone.polygon
    : [];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-[20px] font-semibold text-gray-900">
            {tRegister("branch.delivery.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {tRegister("branch.delivery.description")}
          </p>
        </div>

        <div className="space-y-6">
          <DeliveryModeSelector
            deliveryMode={deliveryMode}
            onModeChange={(mode) => updateDeliveryConfig("mode", mode)}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormInput
              label={tRegister("branch.delivery.fields.baseDeliveryFee.label")}
              placeholder={tRegister(
                "branch.delivery.fields.baseDeliveryFee.placeholder"
              )}
              value={toInputNumber(delivery.deliveryFee)}
              onChange={(val) =>
                updateDeliveryConfig("deliveryFee", val ? Number(val) : 0)
              }
            />

            <FormInput
              label={tRegister("branch.delivery.fields.radiusKm.label")}
              value={toInputNumber(delivery.radiusKm)}
              placeholder={tRegister(
                "branch.delivery.fields.radiusKm.placeholder"
              )}
              onChange={(val) => {
                const sanitized = sanitizeDecimalInput(val);
                updateDeliveryConfig("radiusKm", sanitized);
              }}
            />

            <FormInput
              label={tRegister("branch.delivery.fields.minOrderAmount.label")}
              placeholder={tRegister(
                "branch.delivery.fields.minOrderAmount.placeholder"
              )}
              value={toInputNumber(delivery.minOrderAmount)}
              onChange={(val) =>
                updateDeliveryConfig("minOrderAmount", val ? Number(val) : 0)
              }
            />

            <FormInput
              label={tRegister(
                "branch.delivery.fields.freeDeliveryThreshold.label"
              )}
              placeholder={tRegister(
                "branch.delivery.fields.freeDeliveryThreshold.placeholder"
              )}
              value={toInputNumber(delivery.freeDeliveryThreshold)}
              onChange={(val) =>
                updateDeliveryConfig(
                  "freeDeliveryThreshold",
                  val ? Number(val) : 0
                )
              }
            />
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <Checkbox
              checked={Boolean(delivery.isFreeDelivery)}
              onCheckedChange={(val) =>
                updateDeliveryConfig("isFreeDelivery", val === true)
              }
            />
            <span className="text-sm">
              {tRegister("branch.delivery.fields.enableFreeDelivery")}
            </span>
          </label>

          {shouldShowMap ? (
            <DeliveryMap
              activeZone={activeZone}
              activeZoneIndex={activeZoneIndex}
              activeZonePointsCount={activeZonePoints.length}
              branchCoordinates={branchCoordinates}
              deliveryMode={deliveryMode}
              fitActiveZone={fitActiveZone}
              generateStarterZone={generateStarterZone}
              mapContainerRef={mapContainerRef}
              mapSearch={mapSearch}
              mapSearching={mapSearching}
              mapsError={mapsError}
              mapsLoading={mapsLoading}
              mapsReady={mapsReady}
              mapsReadyForSearch={mapsReady}
              onAddCenterPoint={addCenterPoint}
              onClearActiveZone={() => clearZonePoints(activeZoneIndex)}
              onMapSearch={handleMapSearch}
              onMapSearchChange={(value) => {
                setMapSearch(value);
                setSelectedSearchLabel("");
              }}
              onMapSearchKeyDown={handleMapSearchKeyDown}
              onUndoLastPoint={undoLastPoint}
              searchInputRef={searchInputRef}
              selectedSearchLabel={selectedSearchLabel}
              setActiveZoneIndex={setActiveZoneIndex}
              zones={zones}
            />
          ) : null}

          {deliveryMode === "RADIUS" ? (
            <RadiusDeliverySettings
              onAddBand={addZoneBand}
              onDuplicateBand={duplicateZoneBand}
              onRemoveBand={removeZoneBand}
              onUpdateBand={updateZoneBand}
              sanitizeDecimalInput={sanitizeDecimalInput}
              zoneBands={zoneBands}
            />
          ) : null}


          {deliveryMode === "ZONE" ? (
            <ZoneList
              activeZoneIndex={activeZoneIndex}
              onActiveZoneChange={setActiveZoneIndex}
              onAddPoint={addZonePoint}
              onAddZone={addZone}
              onDuplicateZone={duplicateZone}
              onRemovePoint={removeZonePoint}
              onRemoveZone={removeZone}
              onUpdatePoint={updateZonePoint}
              onUpdateZone={updateZone}
              zones={zones}
            />
          ) : null}

          {deliveryMode === "POSTAL_CODE" ? (
            <PostalCodeRules
              onAddRule={addPostalRule}
              onDuplicateRule={duplicatePostalRule}
              onRemoveRule={removePostalRule}
              onUpdateRule={updatePostalRule}
              postalCodeRules={postalCodeRules}
            />
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-[20px] font-semibold text-gray-900">
          {tRegister("branch.delivery.automation.title")}
        </h2>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          <div>
            <label className="mb-2 block text-[16px] font-medium text-gray-900">
              {tRegister("branch.delivery.automation.autoAcceptLabel")}
            </label>

            <label className="flex h-[52px] cursor-pointer items-center justify-between rounded-[10px] border border-[#bbbbbb] bg-white px-4 transition hover:border-primary/40">
              <span className="text-sm text-gray-700">
                {tRegister("branch.delivery.automation.autoAcceptDescription")}
              </span>

              <Checkbox
                checked={Boolean(settings.automation?.autoAcceptOrders)}
                onCheckedChange={(val) =>
                  updateAutomation("autoAcceptOrders", val === true)
                }
              />
            </label>
          </div>

          <div>
            <FormInput
              label={tRegister(
                "branch.delivery.automation.estimatedPrepTimeLabel"
              )}
              placeholder={tRegister(
                "branch.delivery.automation.estimatedPrepTimePlaceholder"
              )}
              value={toInputNumber(
                settings.automation?.estimatedPrepTime ??
                  settings.estimatedPrepTime
              )}
              onChange={(val) =>
                updateAutomation(
                  "estimatedPrepTime",
                  val === "" ? 0 : Number(val)
                )
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
