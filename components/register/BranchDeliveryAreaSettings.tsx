"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  Copy,
  Crosshair,
  Loader2,
  MapPin,
  Maximize2,
  Plus,
  Search,
  Trash2,
  Undo2,
} from "lucide-react";
import FormInput from "./form/FormInput";

declare global {
  interface Window {
    google?: any;
  }
}

type DeliveryMode = "RADIUS" | "ZONE" | "POSTAL_CODE";
type LatLngKey = "lat" | "lng";

type LatLngPoint = {
  lat: string | number;
  lng: string | number;
};

type Props = {
  branchAddress?: any;
  settings?: any;
  onChange: (nextSettings: any) => void;
};

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";
const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

const DEFAULT_MAP_CENTER = {
  lat: 33.6844,
  lng: 73.0479,
};

const DELIVERY_MODES: {
  value: DeliveryMode;
  label: string;
  description: string;
}[] = [
  {
    value: "RADIUS",
    label: "Radius",
    description: "Use straight-line distance from the branch location.",
  },
  {
    value: "ZONE",
    label: "Polygon zones",
    description: "Draw multiple delivery areas directly on Google Maps.",
  },
  {
    value: "POSTAL_CODE",
    label: "Postal codes",
    description: "Charge delivery by one or more postal-code rules.",
  },
];

const isGoogleMapsKeyConfigured = () => {
  return (
    Boolean(GOOGLE_MAPS_API_KEY) &&
    GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY"
  );
};

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const toInputNumber = (value: unknown) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "";
  }

  return String(value);
};

const sanitizeDecimalInput = (value: string) => {
  return value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1");
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getValidPoint = (point: any) => {
  const lat = toFiniteNumber(point?.lat);
  const lng = toFiniteNumber(point?.lng);

  if (lat === null || lng === null) return null;

  return { lat, lng };
};

const createPolygonAroundCenter = (center: LatLngPoint, radiusKm = 1) => {
  const lat = toNumber(center.lat, DEFAULT_MAP_CENTER.lat);
  const lng = toNumber(center.lng, DEFAULT_MAP_CENTER.lng);
  const safeRadiusKm = Math.max(0.3, Math.min(8, radiusKm));
  const latOffset = safeRadiusKm / 111;
  const lngOffset =
    safeRadiusKm / (111 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));

  return [
    { lat: (lat - latOffset).toFixed(6), lng: (lng - lngOffset).toFixed(6) },
    { lat: (lat + latOffset).toFixed(6), lng: (lng - lngOffset).toFixed(6) },
    { lat: (lat + latOffset).toFixed(6), lng: (lng + lngOffset).toFixed(6) },
    { lat: (lat - latOffset).toFixed(6), lng: (lng + lngOffset).toFixed(6) },
  ];
};

const createDefaultZone = (deliveryFee = 0, center?: LatLngPoint | null) => ({
  name: "",
  deliveryFee,
  minOrderAmount: 0,
  freeDeliveryThreshold: 0,
  polygon: center ? createPolygonAroundCenter(center) : [],
});

const createDefaultZoneBand = () => ({
  fromKm: 0,
  toKm: 0,
  deliveryFee: 0,
  minOrderAmount: 0,
  freeDeliveryThreshold: 0,
});

const createDefaultPostalCodeRule = (deliveryFee = 0) => ({
  postalCode: "",
  deliveryFee,
});

export default function BranchDeliveryAreaSettings({
  branchAddress,
  settings = {},
  onChange,
}: Props) {
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
  const autocompleteInstanceRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const branchMarkerRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const polygonMarkersRef = useRef<any[]>([]);

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

  const zones = delivery.zones;
  const zoneBands = delivery.zoneBands;
  const postalCodeRules = delivery.postalCodeRules;

  const branchCoordinates = useMemo(() => {
    const lat = toFiniteNumber(branchAddress?.lat);
    const lng = toFiniteNumber(branchAddress?.lng);

    if (lat === null || lng === null) return null;

    return { lat, lng };
  }, [branchAddress?.lat, branchAddress?.lng]);

  const fallbackCenter = selectedMapCenter || branchCoordinates || DEFAULT_MAP_CENTER;
  const shouldShowMap = deliveryMode === "RADIUS" || deliveryMode === "ZONE";

  const emitSettings = (nextSettings: any) => {
    onChange(nextSettings);
  };

  const updateDeliveryConfig = (key: string, value: any) => {
    const nextDeliveryConfig = {
      ...deliveryConfig,
      mode: deliveryMode,
      zones,
      zoneBands,
      postalCodeRules,
      [key]: value,
    };

    const nextSettings: any = {
      ...settings,
      deliveryConfig: nextDeliveryConfig,
    };

    // Backward compatibility for existing registration schema/older payloads.
    if (key === "radiusKm") nextSettings.radiusKm = value;
    if (key === "minOrderAmount") nextSettings.minOrderAmount = value;

    emitSettings(nextSettings);
  };


  const updateAutomation = (key: string, value: any) => {
    const nextAutomation = {
      ...(settings?.automation || {}),
      [key]: value,
    };

    const nextSettings: any = {
      ...settings,
      automation: nextAutomation,
    };

    if (key === "estimatedPrepTime") {
      nextSettings.estimatedPrepTime = value;
    }

    emitSettings(nextSettings);
  };


  const updateZone = (index: number, key: string, value: any) => {
    const nextZones = zones.map((zone: any, zoneIndex: number) =>
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
        ? source.polygon.map((point: any) => ({ ...point }))
        : [],
    };

    const nextZones = [...zones];
    nextZones.splice(index + 1, 0, clonedZone);
    updateDeliveryConfig("zones", nextZones);
    setActiveZoneIndex(index + 1);
  };

  const removeZone = (index: number) => {
    const nextZones = zones.filter((_: any, zoneIndex: number) => zoneIndex !== index);

    updateDeliveryConfig("zones", nextZones);
    setActiveZoneIndex((prev) => Math.max(0, Math.min(prev, nextZones.length - 1)));
  };

  const updateZonePoint = (
    zoneIndex: number,
    pointIndex: number,
    key: LatLngKey,
    value: string | number
  ) => {
    const nextZones = zones.map((zone: any, currentZoneIndex: number) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.map((point: any, currentPointIndex: number) =>
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
    const nextZones = zones.map((zone: any, currentZoneIndex: number) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.map((point: any, currentPointIndex: number) =>
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
    const nextZones = zones.map((zone: any, currentZoneIndex: number) => {
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
    const nextZones = zones.map((zone: any, currentZoneIndex: number) => {
      if (currentZoneIndex !== zoneIndex) return zone;

      const polygon = Array.isArray(zone?.polygon) ? zone.polygon : [];

      return {
        ...zone,
        polygon: polygon.filter(
          (_: any, currentPointIndex: number) => currentPointIndex !== pointIndex
        ),
      };
    });

    updateDeliveryConfig("zones", nextZones);
  };

  const clearZonePoints = (zoneIndex: number) => {
    const nextZones = zones.map((zone: any, currentZoneIndex: number) => {
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


  const updateZoneBand = (index: number, key: string, value: any) => {
    const nextBands = zoneBands.map((band: any, bandIndex: number) =>
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
      zoneBands.filter((_: any, bandIndex: number) => bandIndex !== index)
    );
  };

  const updatePostalRule = (index: number, key: string, value: any) => {
    const nextRules = postalCodeRules.map((rule: any, ruleIndex: number) =>
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
      postalCodeRules.filter((_: any, ruleIndex: number) => ruleIndex !== index)
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
    if (!window.google?.maps || !mapInstanceRef.current || !branchCoordinates) {
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
      branchMarkerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: "Branch location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
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
    if (!window.google?.maps || !mapInstanceRef.current || !selectedMapCenter) {
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = null;
      }
      return;
    }

    if (!searchMarkerRef.current) {
      searchMarkerRef.current = new window.google.maps.Marker({
        position: selectedMapCenter,
        map: mapInstanceRef.current,
        title: "Searched area center",
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
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
    if (!window.google?.maps || !mapInstanceRef.current) return;

    const center = branchCoordinates || selectedMapCenter || DEFAULT_MAP_CENTER;
    const radiusMeters = Math.max(0.1, toNumber(delivery.radiusKm, 1)) * 1000;

    circleRef.current = new window.google.maps.Circle({
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
    if (!window.google?.maps || !mapInstanceRef.current) return;

    const zone = zones[activeZoneIndex];
    const points = Array.isArray(zone?.polygon)
      ? zone.polygon.map(getValidPoint).filter(Boolean)
      : [];

    if (!points.length) {
      mapInstanceRef.current.panTo(selectedMapCenter || branchCoordinates || DEFAULT_MAP_CENTER);
      mapInstanceRef.current.setZoom(branchCoordinates || selectedMapCenter ? 14 : 12);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((point: any) => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds);
  };

  const renderZoneOverlay = () => {
    if (!window.google?.maps || !mapInstanceRef.current) return;

    const zone = zones[activeZoneIndex];
    const points = Array.isArray(zone?.polygon)
      ? zone.polygon.map(getValidPoint).filter(Boolean)
      : [];

    if (!points.length) {
      mapInstanceRef.current.panTo(selectedMapCenter || branchCoordinates || DEFAULT_MAP_CENTER);
      mapInstanceRef.current.setZoom(branchCoordinates || selectedMapCenter ? 14 : 12);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    points.forEach((point: any, pointIndex: number) => {
      bounds.extend(point);

      const marker = new window.google.maps.Marker({
        position: point,
        map: mapInstanceRef.current,
        draggable: true,
        label: String(pointIndex + 1),
        title: `Point ${pointIndex + 1}`,
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

    if (points.length >= 3) {
      polygonRef.current = new window.google.maps.Polygon({
        paths: points,
        map: mapInstanceRef.current,
        fillColor: "#2563eb",
        fillOpacity: 0.12,
        strokeColor: "#2563eb",
        strokeOpacity: 0.85,
        strokeWeight: 2,
      });
    }

    mapInstanceRef.current.fitBounds(bounds);
  };

  const applyMapSearchResult = (result: any) => {
    const lat = result?.geometry?.location?.lat?.();
    const lng = result?.geometry?.location?.lng?.();

    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
      setMapsError("Selected map result does not include coordinates.");
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
      setMapsError("Please enter an area, city, street, or landmark to search.");
      return;
    }

    if (!window.google?.maps?.Geocoder) {
      setMapsError("Google Maps is not ready yet.");
      return;
    }

    setMapSearching(true);
    setMapsError("");

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: query }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]) {
        applyMapSearchResult(results[0]);
      } else {
        setMapsError("No matching area found. Try a more specific search.");
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

    if (window.google?.maps?.places) {
      setMapsReady(true);
      setMapsLoading(false);
      setMapsError("");
      return;
    }

    if (!isGoogleMapsKeyConfigured()) {
      setMapsReady(false);
      setMapsLoading(false);
      setMapsError(
        "Google Maps API key is missing. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env."
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
      setMapsError("Failed to load Google Maps. Please verify the API key.");
    };

    setMapsLoading(true);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      if (window.google?.maps?.places) {
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
  }, []);

  /* ---------------- AUTOCOMPLETE ---------------- */

  useEffect(() => {
    if (!mapsReady || !searchInputRef.current) return;
    if (!window.google?.maps?.places?.Autocomplete) return;
    if (autocompleteInstanceRef.current) return;

    autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        fields: ["formatted_address", "geometry", "name", "place_id"],
        types: ["geocode"],
      }
    );

    autocompleteInstanceRef.current.addListener("place_changed", () => {
      const place = autocompleteInstanceRef.current?.getPlace?.();

      if (!place?.geometry) {
        setMapsError("Please select an area from Google Maps suggestions.");
        return;
      }

      applyMapSearchResult(place);
    });

    return () => {
      if (window.google?.maps?.event && autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteInstanceRef.current
        );
      }

      autocompleteInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsReady]);

  /* ---------------- GOOGLE MAP INIT ---------------- */

  useEffect(() => {
    if (!shouldShowMap) {
      clearMapOverlays();
      mapInstanceRef.current = null;
      return;
    }

    if (!mapsReady || !mapContainerRef.current) return;
    if (!window.google?.maps?.Map) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: fallbackCenter,
        zoom: branchCoordinates || selectedMapCenter ? 14 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        draggableCursor: deliveryMode === "ZONE" ? "crosshair" : undefined,
      });
    }

    window.google.maps.event.trigger(mapInstanceRef.current, "resize");
  }, [mapsReady, shouldShowMap, deliveryMode, fallbackCenter, branchCoordinates, selectedMapCenter]);

  /* ---------------- GOOGLE MAP OVERLAYS ---------------- */

  useEffect(() => {
    if (!mapsReady || !shouldShowMap || !mapInstanceRef.current) return;
    if (!window.google?.maps) return;

    clearMapOverlays();
    renderBranchMarker();
    renderSearchMarker();

    mapInstanceRef.current.setOptions({
      draggableCursor: deliveryMode === "ZONE" ? "crosshair" : undefined,
    });

    window.google.maps.event.clearListeners(mapInstanceRef.current, "click");

    if (deliveryMode === "RADIUS") {
      renderRadiusOverlay();
      return;
    }

    renderZoneOverlay();

    mapInstanceRef.current.addListener("click", (event: any) => {
      const lat = event?.latLng?.lat?.();
      const lng = event?.latLng?.lng?.();

      if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;

      if (!zones.length) {
        updateDeliveryConfig("zones", [
          {
            name: "Delivery Zone 1",
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
      if (window.google?.maps?.event && mapInstanceRef.current) {
        window.google.maps.event.clearListeners(mapInstanceRef.current, "click");
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
  ]);

  useEffect(() => {
    if (activeZoneIndex <= zones.length - 1) return;
    setActiveZoneIndex(Math.max(0, zones.length - 1));
  }, [activeZoneIndex, zones.length]);

  const activeZone = zones[activeZoneIndex];
  const activeZonePoints = Array.isArray(activeZone?.polygon)
    ? activeZone.polygon
    : [];

  const renderDeliveryMap = () => {
    if (!shouldShowMap) return null;

    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {deliveryMode === "RADIUS" ? "Radius map preview" : "Polygon zone builder"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {deliveryMode === "RADIUS"
                  ? "Preview the straight-line delivery radius from branch latitude/longitude."
                  : "Search an area first, generate a starter zone, then fine-tune points by dragging markers."}
              </p>
            </div>

            {deliveryMode === "ZONE" && zones.length > 0 ? (
              <select
                value={activeZoneIndex}
                onChange={(event) => setActiveZoneIndex(Number(event.target.value))}
                className="h-10 rounded-full border border-gray-200 bg-white px-4 text-sm outline-none focus:border-primary"
              >
                {zones.map((zone: any, index: number) => (
                  <option key={`zone-select-${index}`} value={index}>
                    {zone?.name || `Zone ${index + 1}`}
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
                    onChange={(event) => {
                      setMapSearch(event.target.value);
                      setSelectedSearchLabel("");
                    }}
                    onKeyDown={handleMapSearchKeyDown}
                    placeholder="Search area, street, city, or landmark"
                    className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMapSearch}
                  disabled={!mapsReady || mapSearching || mapsLoading}
                  className="h-11 rounded-full border-primary px-5 text-primary disabled:opacity-50"
                >
                  {mapSearching ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  Search Map
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={generateStarterZone}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
                >
                  <Crosshair size={14} />
                  Generate Starter Zone
                </button>

                <button
                  type="button"
                  onClick={addCenterPoint}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <MapPin size={14} />
                  Add Center Point
                </button>

                <button
                  type="button"
                  onClick={undoLastPoint}
                  disabled={!activeZonePoints.length}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Undo2 size={14} />
                  Undo Last Point
                </button>

                <button
                  type="button"
                  onClick={fitActiveZone}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Maximize2 size={14} />
                  Fit Active Zone
                </button>

                <button
                  type="button"
                  onClick={() => clearZonePoints(activeZoneIndex)}
                  disabled={!zones.length}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Clear Active Zone
                </button>
              </div>

              {selectedSearchLabel ? (
                <p className="text-xs text-gray-500">
                  Selected map area: {selectedSearchLabel}
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
                  {activeZone?.name || `Zone ${activeZoneIndex + 1}`}
                </p>
                <p className="mt-1 text-gray-500">
                  {activeZonePoints.length} point{activeZonePoints.length === 1 ? "" : "s"} selected
                </p>
                <p className="mt-1 text-gray-400">
                  Click map to add · drag markers to adjust
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            {mapsLoading ? (
              <>
                <Loader2 className="mb-3 animate-spin text-primary" size={28} />
                <p className="text-sm font-medium text-gray-700">Loading Google Map</p>
              </>
            ) : (
              <>
                <MapPin className="mb-3 text-gray-400" size={30} />
                <p className="text-sm font-medium text-gray-700">
                  Google Map preview unavailable
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env to enable map selection.
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {deliveryMode === "RADIUS"
              ? "Branch location comes from the address latitude/longitude above."
              : "For faster setup: search area → generate starter zone → drag points if needed."}
          </span>

          <span className="shrink-0 font-medium text-gray-700">
            {branchCoordinates
              ? `${branchCoordinates.lat}, ${branchCoordinates.lng}`
              : "Branch coordinates not selected"}
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
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-[20px] font-semibold text-gray-900">
            Order & Delivery Area Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure customer-facing delivery charges, radius, polygon zones, radius bands, or postal-code based delivery rules.
          </p>
        </div>

        <div className="space-y-6">

          <div>
            <p className="mb-3 text-sm font-medium text-gray-900">
              Delivery area calculation mode
            </p>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {DELIVERY_MODES.map((mode) => {
                const active = deliveryMode === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => updateDeliveryConfig("mode", mode.value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {mode.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormInput
              label="Base Delivery Fee"
              placeholder="Enter Base Delivery Fee"
              value={toInputNumber(delivery.deliveryFee)}
              onChange={(val) =>
                updateDeliveryConfig("deliveryFee", val ? Number(val) : 0)
              }
            />

            <FormInput
              label="Radius (km)"
              value={toInputNumber(delivery.radiusKm)}
              placeholder="Enter radius, e.g. 7.5"
              onChange={(val) => {
                const sanitized = sanitizeDecimalInput(val);
                updateDeliveryConfig("radiusKm", sanitized);
              }}
            />

            <FormInput
              label="Minimum Order Amount"
              placeholder="Min order amount"
              value={toInputNumber(delivery.minOrderAmount)}
              onChange={(val) =>
                updateDeliveryConfig("minOrderAmount", val ? Number(val) : 0)
              }
            />

            <FormInput
              label="Free Delivery Threshold"
              placeholder="Enter free delivery threshold"
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
            <span className="text-sm">Enable Free Delivery</span>
          </label>

          {renderDeliveryMap()}

          {deliveryMode === "RADIUS" ? (
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Radius Fee Bands
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Optional distance bands for radius-based delivery. Use decimal values like 2.5 or 7.5 km.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addZoneBand}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                  <Plus size={15} />
                  Add Band
                </button>
              </div>

              {zoneBands.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
                  No radius fee band configured. The base delivery fee will be used for the configured radius.
                </div>
              ) : (
                <div className="space-y-3">
                  {zoneBands.map((band: any, index: number) => (
                    <div
                      key={`zone-band-${index}`}
                      className="rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Band {index + 1}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {toInputNumber(band?.fromKm) || "0"} km → {toInputNumber(band?.toKm) || "0"} km
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateZoneBand(index)}
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Copy size={13} />
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => removeZoneBand(index)}
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                        <FormInput
                          label="From Km"
                          placeholder="0"
                          value={toInputNumber(band?.fromKm)}
                          onChange={(val) =>
                            updateZoneBand(index, "fromKm", sanitizeDecimalInput(val))
                          }
                        />

                        <FormInput
                          label="To Km"
                          placeholder="7.5"
                          value={toInputNumber(band?.toKm)}
                          onChange={(val) =>
                            updateZoneBand(index, "toKm", sanitizeDecimalInput(val))
                          }
                        />

                        <FormInput
                          label="Delivery Fee"
                          placeholder="Fee"
                          value={toInputNumber(band?.deliveryFee)}
                          onChange={(val) =>
                            updateZoneBand(index, "deliveryFee", val ? Number(val) : 0)
                          }
                        />

                        <FormInput
                          label="Min Order"
                          placeholder="Min order"
                          value={toInputNumber(band?.minOrderAmount)}
                          onChange={(val) =>
                            updateZoneBand(index, "minOrderAmount", val ? Number(val) : 0)
                          }
                        />

                        <FormInput
                          label="Free Delivery From"
                          placeholder="Threshold"
                          value={toInputNumber(band?.freeDeliveryThreshold)}
                          onChange={(val) =>
                            updateZoneBand(
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
          ) : null}


          {deliveryMode === "ZONE" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Polygon Delivery Zones
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add multiple zones. Search the area and use starter-zone generation for faster point selection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addZone}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                  <Plus size={15} />
                  Add Zone
                </button>
              </div>

              {zones.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                  No delivery zone configured yet. Search an area and generate a starter zone, or click the map to start drawing one.
                </div>
              ) : (
                zones.map((zone: any, zoneIndex: number) => {
                  const polygon = Array.isArray(zone?.polygon)
                    ? zone.polygon
                    : [];

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
                          onClick={() => setActiveZoneIndex(zoneIndex)}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            Zone {zoneIndex + 1}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {zoneIndex === activeZoneIndex
                              ? `${polygon.length} point${polygon.length === 1 ? "" : "s"} · Active on map`
                              : "Click to edit on map"}
                          </p>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateZone(zoneIndex)}
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Copy size={13} />
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => removeZone(zoneIndex)}
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormInput
                          label="Zone Name"
                          placeholder="Enter zone name"
                          value={zone?.name || ""}
                          onChange={(val) => updateZone(zoneIndex, "name", val)}
                        />

                        <FormInput
                          label="Zone Delivery Fee"
                          placeholder="Zone delivery fee"
                          value={toInputNumber(zone?.deliveryFee)}
                          onChange={(val) =>
                            updateZone(
                              zoneIndex,
                              "deliveryFee",
                              val ? Number(val) : 0
                            )
                          }
                        />

                        <FormInput
                          label="Zone Min Order"
                          placeholder="Minimum order amount"
                          value={toInputNumber(zone?.minOrderAmount)}
                          onChange={(val) =>
                            updateZone(
                              zoneIndex,
                              "minOrderAmount",
                              val ? Number(val) : 0
                            )
                          }
                        />

                        <FormInput
                          label="Zone Free Delivery From"
                          placeholder="Free delivery threshold"
                          value={toInputNumber(zone?.freeDeliveryThreshold)}
                          onChange={(val) =>
                            updateZone(
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
                            Polygon points
                          </p>

                          <button
                            type="button"
                            onClick={() => addZonePoint(zoneIndex)}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                          >
                            <Plus size={13} />
                            Add Empty Point
                          </button>
                        </div>

                        <div className="space-y-2">
                          {polygon.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                              No points yet. Select this zone and click on the map, add center point, or generate a starter zone.
                            </div>
                          ) : (
                            polygon.map((point: any, pointIndex: number) => (
                              <div
                                key={`zone-${zoneIndex}-point-${pointIndex}`}
                                className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-[80px_1fr_1fr_auto]"
                              >
                                <div className="flex items-center text-xs font-medium text-gray-500">
                                  Point {pointIndex + 1}
                                </div>

                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={point?.lat ?? ""}
                                  onChange={(event) =>
                                    updateZonePoint(
                                      zoneIndex,
                                      pointIndex,
                                      "lat",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Latitude"
                                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                                />

                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={point?.lng ?? ""}
                                  onChange={(event) =>
                                    updateZonePoint(
                                      zoneIndex,
                                      pointIndex,
                                      "lng",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Longitude"
                                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeZonePoint(zoneIndex, pointIndex)
                                  }
                                  disabled={polygon.length <= 3}
                                  className="inline-flex h-10 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
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
          ) : null}

          {deliveryMode === "POSTAL_CODE" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Postal Code Rules
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add one or more postal codes with separate delivery fees.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addPostalRule}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                  <Plus size={15} />
                  Add Postal Code
                </button>
              </div>

              {postalCodeRules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                  No postal code rule configured yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {postalCodeRules.map((rule: any, index: number) => (
                    <div
                      key={`postal-rule-${index}`}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 lg:grid-cols-[1fr_1fr_auto]"
                    >
                      <FormInput
                        label="Postal Code"
                        placeholder="Postal code"
                        value={rule?.postalCode || ""}
                        onChange={(val) =>
                          updatePostalRule(index, "postalCode", val)
                        }
                      />

                      <FormInput
                        label="Delivery Fee"
                        placeholder="Delivery fee"
                        value={toInputNumber(rule?.deliveryFee)}
                        onChange={(val) =>
                          updatePostalRule(
                            index,
                            "deliveryFee",
                            val ? Number(val) : 0
                          )
                        }
                      />

                      <div className="flex items-end gap-2">
                        <button
                          type="button"
                          onClick={() => duplicatePostalRule(index)}
                          className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Copy size={14} />
                          Duplicate
                        </button>

                        <button
                          type="button"
                          onClick={() => removePostalRule(index)}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-red-100 bg-red-50 px-4 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
  <h2 className="mb-5 text-[20px] font-semibold text-gray-900">
    Automation
  </h2>

  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
    <div>
      <label className="mb-2 block text-[16px] font-medium text-gray-900">
        Auto Accept Orders
      </label>

      <label className="flex h-[52px] cursor-pointer items-center justify-between rounded-[10px] border border-[#bbbbbb] bg-white px-4 transition hover:border-primary/40">
        <span className="text-sm text-gray-700">
          Automatically accept incoming orders
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
        label="Estimated Preparation Time (Minutes)"
        placeholder="Preparation time"
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
