export type BranchAddressField =
  | "city"
  | "country"
  | "houseNumber"
  | "lat"
  | "lng"
  | "postalCode"
  | "state"
  | "street";

export type BranchAddressValue = Partial<Record<BranchAddressField, string>>;

export type BranchAdminField =
  | "email"
  | "firstName"
  | "lastName"
  | "password"
  | "phone";

export type BranchAdminValue = Partial<Record<BranchAdminField, string>>;

export type BranchBasicField = "description" | "name";

export type BranchSettingsValue = Record<string, unknown>;

export type BranchValue = {
  address?: BranchAddressValue;
  coverImage?: string;
  coverImageFile?: File | null;
  coverImagePreviewUrl?: string;
  description?: string;
  name?: string;
  settings?: BranchSettingsValue;
};

export type RegisterFormData = {
  branch?: BranchValue;
  branchAdmin?: BranchAdminValue;
  restaurant?: {
    logoPreviewUrl?: string;
    logoUrl?: string;
    name?: string;
  };
  tenant?: {
    bio?: string;
    logoPreviewUrl?: string;
    logoUrl?: string;
    name?: string;
  };
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phone?: string;
    profilePreviewUrl?: string;
    profileUrl?: string;
  };
};

export type GoogleAddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

export type GoogleLocation = {
  lat?: () => number;
  lng?: () => number;
};

export type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location?: GoogleLocation;
  };
  name?: string;
  place_id?: string;
};

export type GoogleGeocoderResult = GooglePlaceResult;

export type GoogleAutocomplete = {
  addListener: (eventName: string, handler: () => void) => void;
  getPlace: () => GooglePlaceResult | undefined;
};

export type GoogleAutocompleteConstructor = new (
  input: HTMLInputElement,
  options: {
    fields: string[];
    types: string[];
  }
) => GoogleAutocomplete;

export type GoogleMapClickEvent = {
  latLng?: GoogleLocation;
};

export type GoogleMapInstance = {
  addListener: (
    eventName: string,
    handler: (event: GoogleMapClickEvent) => void
  ) => void;
  panTo: (position: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
};

export type GoogleMapConstructor = new (
  element: HTMLElement,
  options: {
    center: { lat: number; lng: number };
    clickableIcons: boolean;
    fullscreenControl: boolean;
    mapTypeControl: boolean;
    streetViewControl: boolean;
    zoom: number;
  }
) => GoogleMapInstance;

export type GoogleMarkerInstance = {
  addListener: (eventName: string, handler: () => void) => void;
  getPosition: () => GoogleLocation | undefined;
  setPosition: (position: { lat: number; lng: number }) => void;
};

export type GoogleMarkerConstructor = new (options: {
  draggable: boolean;
  map: GoogleMapInstance;
  position: { lat: number; lng: number };
  title: string;
}) => GoogleMarkerInstance;

export type GoogleGeocoder = {
  geocode: (
    request:
      | { address: string }
      | { location: { lat: number; lng: number } },
    callback: (
      results: GoogleGeocoderResult[] | null,
      status: string
    ) => void
  ) => void;
};

export type GoogleGeocoderConstructor = new () => GoogleGeocoder;

export type GoogleMapsNamespace = {
  event?: {
    clearInstanceListeners: (instance: object) => void;
  };
  Geocoder?: GoogleGeocoderConstructor;
  Map?: GoogleMapConstructor;
  Marker?: GoogleMarkerConstructor;
  places?: {
    Autocomplete?: GoogleAutocompleteConstructor;
  };
};

export type GoogleNamespace = {
  maps?: GoogleMapsNamespace;
};
