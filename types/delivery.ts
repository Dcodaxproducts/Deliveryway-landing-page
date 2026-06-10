import type { GoogleAutocomplete, GoogleGeocoderResult } from "@/types/register";

export type DeliveryMode = "POSTAL_CODE" | "RADIUS" | "ZONE" | "ZONE_BANDS";

export type LatLngKey = "lat" | "lng";

export type LatLngPoint = {
  lat: string | number;
  lng: string | number;
};

export type DeliveryZonePoint = LatLngPoint;

export type DeliveryZone = {
  deliveryFee?: number | string;
  freeDeliveryThreshold?: number | string;
  minOrderAmount?: number | string;
  name?: string;
  polygon?: DeliveryZonePoint[];
};

export type DeliveryZoneBand = {
  deliveryFee?: number | string;
  freeDeliveryThreshold?: number | string;
  fromKm?: number | string;
  minOrderAmount?: number | string;
  toKm?: number | string;
};

export type PostalCodeRule = {
  deliveryFee?: number | string;
  freeDeliveryThreshold?: number | string;
  minOrderAmount?: number | string;
  postalCode?: string;
};

export type DeliveryConfig = {
  deliveryFee?: number | string;
  freeDeliveryThreshold?: number | string;
  isFreeDelivery?: boolean;
  minOrderAmount?: number | string;
  mode?: DeliveryMode;
  postalCodeRules?: PostalCodeRule[];
  radiusKm?: number | string;
  zoneBands?: DeliveryZoneBand[];
  zones?: DeliveryZone[];
};

export type AutomationSettings = {
  autoAcceptOrders?: boolean;
  estimatedPrepTime?: number | string;
};

export type ServiceChargeSettings = {
  isEnabled?: boolean;
  type?: "AMOUNT" | "PERCENTAGE";
  value?: number | string;
};

export type BranchContactSettings = {
  phone?: string;
  whatsapp?: string;
};

export type BranchDeliverySettings = {
  automation?: AutomationSettings;
  contact?: BranchContactSettings;
  deliveryConfig?: DeliveryConfig;
  deliveryFee?: number | string;
  deliveryTime?: number | string;
  estimatedPrepTime?: number | string;
  freeDeliveryThreshold?: number | string;
  isFreeDelivery?: boolean;
  minOrderAmount?: number | string;
  radiusKm?: number | string;
  serviceCharge?: ServiceChargeSettings;
  tableCount?: number | string;
  tableReservationAutoAccept?: boolean;
  tableReservationsEnabled?: boolean;
};

export type BranchDeliveryAddress = {
  lat?: number | string;
  lng?: number | string;
};

export type DeliveryModeConfig = {
  descriptionKey: string;
  labelKey: string;
  value: DeliveryMode;
};

export type GoogleMapBounds = {
  extend: (point: { lat: number; lng: number }) => void;
};

export type GoogleMapCircle = {
  getBounds?: () => GoogleMapBounds | undefined;
  setMap: (map: GoogleMapInstance | null) => void;
};

export type GoogleMapPolygon = {
  setMap: (map: GoogleMapInstance | null) => void;
};

export type GoogleMapMarker = {
  addListener: (eventName: string, handler: () => void) => void;
  getPosition?: () => { lat?: () => number; lng?: () => number } | undefined;
  setMap: (map: GoogleMapInstance | null) => void;
  setPosition: (position: { lat: number; lng: number }) => void;
};

export type GoogleMapClickEvent = {
  latLng?: {
    lat?: () => number;
    lng?: () => number;
  };
};

export type GoogleMapCenter = {
  lat?: () => number;
  lng?: () => number;
};

export type GoogleMapInstance = {
  addListener: (
    eventName: string,
    handler: (event: GoogleMapClickEvent) => void
  ) => void;
  fitBounds: (bounds: GoogleMapBounds) => void;
  getCenter?: () => GoogleMapCenter | undefined;
  panTo: (position: { lat: number; lng: number }) => void;
  setOptions: (options: { draggableCursor?: string }) => void;
  setZoom: (zoom: number) => void;
};

export type GoogleDeliveryMapsNamespace = {
  Circle?: new (options: {
    center: { lat: number; lng: number };
    fillColor: string;
    fillOpacity: number;
    map: GoogleMapInstance;
    radius: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
  }) => GoogleMapCircle;
  event?: {
    clearInstanceListeners: (instance: object) => void;
    clearListeners: (instance: object, eventName: string) => void;
    trigger: (instance: object, eventName: string) => void;
  };
  Geocoder?: new () => {
    geocode: (
      request: { address: string },
      callback: (
        results: GoogleGeocoderResult[] | null,
        status: string
      ) => void
    ) => void;
  };
  LatLngBounds?: new () => GoogleMapBounds;
  Map?: new (
    element: HTMLElement,
    options: {
      center: { lat: number; lng: number };
      clickableIcons: boolean;
      draggableCursor?: string;
      fullscreenControl: boolean;
      mapTypeControl: boolean;
      streetViewControl: boolean;
      zoom: number;
    }
  ) => GoogleMapInstance;
  Marker?: new (options: {
    draggable?: boolean;
    icon?: {
      fillColor: string;
      fillOpacity: number;
      path: unknown;
      scale: number;
      strokeColor: string;
      strokeWeight: number;
    };
    label?: string;
    map: GoogleMapInstance;
    position: { lat: number; lng: number };
    title: string;
  }) => GoogleMapMarker;
  places?: {
    Autocomplete?: new (
      input: HTMLInputElement,
      options: { fields: string[]; types: string[] }
    ) => GoogleAutocomplete;
  };
  Polygon?: new (options: {
    fillColor: string;
    fillOpacity: number;
    map: GoogleMapInstance;
    paths: { lat: number; lng: number }[];
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
  }) => GoogleMapPolygon;
  SymbolPath?: {
    BACKWARD_CLOSED_ARROW: unknown;
    CIRCLE: unknown;
  };
};
