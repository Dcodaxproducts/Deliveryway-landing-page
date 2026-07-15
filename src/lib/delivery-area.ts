import type {
  DeliveryModeConfig,
  DeliveryZone,
  DeliveryZoneBand,
  LatLngPoint,
  PostalCodeRule,
} from "@/types/delivery";

export const DEFAULT_DELIVERY_MAP_CENTER = {
  lat: 33.6844,
  lng: 73.0479,
};

export const DELIVERY_MODES: DeliveryModeConfig[] = [
  {
    value: "RADIUS",
    labelKey: "branch.delivery.modes.radius.label",
    descriptionKey: "branch.delivery.modes.radius.description",
  },
  {
    value: "ZONE",
    labelKey: "branch.delivery.modes.zone.label",
    descriptionKey: "branch.delivery.modes.zone.description",
  },
  {
    value: "ZONE_BANDS",
    labelKey: "branch.delivery.modes.zoneBands.label",
    descriptionKey: "branch.delivery.modes.zoneBands.description",
  },
  {
    value: "POSTAL_CODE",
    labelKey: "branch.delivery.modes.postalCode.label",
    descriptionKey: "branch.delivery.modes.postalCode.description",
  },
];

export const toInputNumber = (value: unknown) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "";
  }

  return String(value);
};

export const sanitizeDecimalInput = (value: string) => {
  return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
};

export const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getValidPoint = (point: Partial<LatLngPoint> | undefined) => {
  const lat = toFiniteNumber(point?.lat);
  const lng = toFiniteNumber(point?.lng);

  if (lat === null || lng === null) return null;

  return { lat, lng };
};

export const createPolygonAroundCenter = (
  center: LatLngPoint,
  radiusKm = 1
) => {
  const lat = toNumber(center.lat, DEFAULT_DELIVERY_MAP_CENTER.lat);
  const lng = toNumber(center.lng, DEFAULT_DELIVERY_MAP_CENTER.lng);
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

export const createDefaultZone = (
  deliveryFee = 0,
  center?: LatLngPoint | null
): DeliveryZone => ({
  name: "",
  deliveryFee,
  minOrderAmount: 0,
  freeDeliveryThreshold: 0,
  polygon: center ? createPolygonAroundCenter(center) : [],
});

export const createDefaultZoneBand = (): DeliveryZoneBand => ({
  fromKm: 0,
  toKm: 0,
  deliveryFee: 0,
  minOrderAmount: 0,
  freeDeliveryThreshold: 0,
});

export const createDefaultPostalCodeRule = (
  deliveryFee = 0
): PostalCodeRule => ({
  postalCode: "",
  deliveryFee,
  minOrderAmount: 0,
  freeDeliveryThreshold: 0,
});
