"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { FormInput } from "./form/FormInput";
import { validateZod } from "@/hooks/useZodValidator";
import {
  createBranchSchema,
  createRegisterValidationMessages,
} from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import { BranchDeliveryAreaSettings } from "./BranchDeliveryAreaSettings";
import { BranchAddressFields } from "./branch/BranchAddressFields";
import { BranchAdminInfo } from "./branch/BranchAdminInfo";
import { BranchBasicInfo } from "./branch/BranchBasicInfo";
import { BranchLocationSearch } from "./branch/BranchLocationSearch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type {
  BranchAddressField,
  BranchAddressValue,
  BranchAdminField,
  BranchBasicField,
  BranchSettingsValue,
  BranchValue,
  GoogleAddressComponent,
  GoogleAutocomplete,
  GoogleGeocoderResult,
  GoogleMapInstance,
  GoogleMapsNamespace,
  GoogleMarkerInstance,
  GooglePlaceResult,
  RegisterFormData,
} from "@/types/register";

interface Props {
  formData: RegisterFormData;
  updateFormData: (section: string, data: Record<string, unknown>) => void;
  next: () => void;
  back: () => void;
}

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";
const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

const DEFAULT_MAP_CENTER = {
  lat: 33.6844,
  lng: 73.0479,
};

const MAX_BRANCH_COVER_IMAGE_SIZE_MB = 20;
const MAX_BRANCH_COVER_IMAGE_SIZE_BYTES =
  MAX_BRANCH_COVER_IMAGE_SIZE_MB * 1024 * 1024;

const isGoogleMapsKeyConfigured = () => {
  return (
    Boolean(GOOGLE_MAPS_API_KEY) &&
    GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY"
  );
};

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getGoogleMaps = () => {
  return (window.google as { maps?: GoogleMapsNamespace } | undefined)?.maps;
};

export function BranchStep({
  formData,
  updateFormData,
  next,
  back,
}: Props) {
  const tCommon = useTranslations("common");
  const tRegister = useTranslations("register");
  const tValidation = useTranslations("validation");
  const validationMessages = useMemo(() => {
    return createRegisterValidationMessages(tValidation);
  }, [tValidation]);
  const translatedBranchSchema = useMemo(() => {
    return createBranchSchema(validationMessages);
  }, [validationMessages]);
  const branch: BranchValue = formData.branch || {};
  const branchAdmin = formData.branchAdmin || {};
  const branchAddress: BranchAddressValue = branch.address || {};
  const branchSettings = branch.settings || {};

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const [selectedGoogleAddress, setSelectedGoogleAddress] = useState("");
  const [addressSearching, setAddressSearching] = useState(false);
  const [branchAdminSameAsOwner, setBranchAdminSameAsOwner] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstanceRef = useRef<GoogleAutocomplete | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const markerRef = useRef<GoogleMarkerInstance | null>(null);
  const branchAddressRef = useRef<BranchAddressValue>(branchAddress);

  useEffect(() => {
    branchAddressRef.current = branchAddress;
  }, [branchAddress]);

  const { uploadFile, uploading, progress } = useFileUpload();

  /* ---------------- HELPERS ---------------- */

  const clearError = (path: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
  };

  const error = (path: string) => errors[path];

  const composeAddress = (address: BranchAddressValue) => {
    return [
      address?.houseNumber,
      address?.street,
      address?.postalCode,
      address?.city,
      address?.state,
      address?.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const hasMeaningfulAddress = (address: BranchAddressValue) => {
    return Boolean(
      address?.street ||
        address?.postalCode ||
        address?.city ||
        address?.state ||
        (address?.lat && address?.lng)
    );
  };

  const updateField = (field: BranchBasicField, value: string) => {
    updateFormData("branch", { [field]: value });
    clearError(`branch.${String(field)}`);
  };

  const updateBranchAdminField = (field: BranchAdminField, value: string) => {
    setBranchAdminSameAsOwner(false);
    updateFormData("branchAdmin", { [field]: value });
    clearError(`branchAdmin.${String(field)}`);
  };

  const copyOwnerToBranchAdmin = () => {
    updateFormData("branchAdmin", {
      email: formData.user?.email || "",
      firstName: formData.user?.firstName || "",
      lastName: formData.user?.lastName || "",
      password: formData.user?.password || "",
      phone: formData.user?.phone || "",
    });

    [
      "branchAdmin.email",
      "branchAdmin.firstName",
      "branchAdmin.lastName",
      "branchAdmin.password",
      "branchAdmin.phone",
    ].forEach(clearError);
  };

  const handleBranchAdminSameAsOwnerChange = (checked: boolean) => {
    setBranchAdminSameAsOwner(checked);

    if (checked) {
      copyOwnerToBranchAdmin();
    }
  };

  const updateAddressField = (
    field: BranchAddressField,
    value: string
  ) => {
    updateFormData("branch", {
      [field]: value,
      address: { ...branchAddress, [field]: value },
    });
    clearError(`branch.address.${String(field)}`);
    clearError(`branch.${String(field)}`);
  };

  const handleBranchSettingsChange = (nextSettings: BranchSettingsValue) => {
    updateFormData("branch", {
      settings: nextSettings,
    });

    [
      "branch.settings.minOrderAmount",
      "branch.settings.radiusKm",
      "branch.settings.estimatedPrepTime",
    ].forEach(clearError);
  };

  const getAddressComponent = (
    components: GoogleAddressComponent[],
    types: string[],
    mode: "long_name" | "short_name" = "long_name"
  ) => {
    const component = components.find((item) =>
      types.some((type) => item.types?.includes(type))
    );

    return component?.[mode] || "";
  };

  const getCurrentCoordinates = () => {
    const lat = toFiniteNumber(branchAddress.lat);
    const lng = toFiniteNumber(branchAddress.lng);

    if (lat !== null && lng !== null) {
      return { lat, lng, hasSavedCoordinates: true };
    }

    return {
      ...DEFAULT_MAP_CENTER,
      hasSavedCoordinates: false,
    };
  };

  const updateMapMarker = (
    lat: number | string,
    lng: number | string,
    shouldCenter = true
  ) => {
    const nextLat = Number(lat);
    const nextLng = Number(lng);
    const maps = getGoogleMaps();

    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;
    if (!maps?.Marker || !mapInstanceRef.current) return;

    const position = { lat: nextLat, lng: nextLng };

    if (!markerRef.current) {
      const marker = new maps.Marker({
        position,
        map: mapInstanceRef.current,
        draggable: true,
        title: tRegister("branch.map.markerTitle"),
      });

      marker.addListener("dragend", () => {
        const markerPosition = markerRef.current?.getPosition?.();
        const markerLat = markerPosition?.lat?.();
        const markerLng = markerPosition?.lng?.();

        if (
          Number.isFinite(Number(markerLat)) &&
          Number.isFinite(Number(markerLng))
        ) {
          applyCoordinatesToForm(String(markerLat), String(markerLng));
          reverseGeocodeCoordinates(String(markerLat), String(markerLng), {
            stopLocationLoading: false,
            showFallbackError: true,
          });
        }
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setPosition(position);
    }

    if (shouldCenter) {
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(16);
    }
  };

  const applyCoordinatesToForm = (lat: string, lng: string) => {
    const latestAddress = branchAddressRef.current || {};

    updateFormData("branch", {
      lat,
      lng,
      address: {
        ...latestAddress,
        lat,
        lng,
      },
    });

    clearError("branch.address.lat");
    clearError("branch.address.lng");
  };

  const applyPlaceToForm = (place: GooglePlaceResult) => {
    if (!place) return false;

    const components = Array.isArray(place.address_components)
      ? place.address_components
      : [];

    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();

    const hasCoordinates =
      Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

    if (!components.length && !hasCoordinates) {
      setLocationError(tRegister("branch.map.selectValidAddress"));
      return false;
    }

    const houseNumber = getAddressComponent(components, ["street_number"]);
    const route = getAddressComponent(components, ["route"]);
    const street = route || place.name || "";
    const postalCode = getAddressComponent(components, ["postal_code"]);

    const city =
      getAddressComponent(components, ["locality"]) ||
      getAddressComponent(components, ["postal_town"]) ||
      getAddressComponent(components, ["administrative_area_level_2"]) ||
      "";

    const state =
      getAddressComponent(
        components,
        ["administrative_area_level_1"],
        "short_name"
      ) ||
      getAddressComponent(components, ["administrative_area_level_1"]) ||
      "";

    const country =
      getAddressComponent(components, ["country"]) ||
      branchAddressRef.current?.country ||
      branchAddress.country ||
      "";

    const nextAddress = {
      ...(branchAddressRef.current || branchAddress),
      houseNumber,
      street,
      postalCode,
      city,
      state,
      country,
      lat: hasCoordinates
        ? String(lat)
        : branchAddressRef.current?.lat || branchAddress.lat,
      lng: hasCoordinates
        ? String(lng)
        : branchAddressRef.current?.lng || branchAddress.lng,
    };

    const formattedAddress =
      place.formatted_address || composeAddress(nextAddress) || "";

    updateFormData("branch", {
      houseNumber: nextAddress.houseNumber,
      street: nextAddress.street,
      postalCode: nextAddress.postalCode,
      city: nextAddress.city,
      state: nextAddress.state,
      country: nextAddress.country,
      lat: nextAddress.lat,
      lng: nextAddress.lng,
      address: nextAddress,
    });

    if (hasCoordinates) {
      updateMapMarker(String(lat), String(lng));
    }

    setAddressQuery(formattedAddress);
    setSelectedGoogleAddress(formattedAddress);
    setLocationError("");
    setMapsError("");

    [
      "branch.address.street",
      "branch.address.houseNumber",
      "branch.address.postalCode",
      "branch.address.city",
      "branch.address.state",
      "branch.address.country",
      "branch.address.lat",
      "branch.address.lng",
    ].forEach(clearError);

    return true;
  };

  /* ---------------- FILE ---------------- */

  const handleImageSelect = async (file: File) => {
  if (!file) return;

  if (file.size > MAX_BRANCH_COVER_IMAGE_SIZE_BYTES) {
    setErrors((prev) => ({
      ...prev,
      "branch.coverImageFile": tValidation("register.branchCoverImageMaxSize", {
        size: MAX_BRANCH_COVER_IMAGE_SIZE_MB,
      }),
      "branch.coverImage": tValidation("register.branchCoverImageMaxSize", {
        size: MAX_BRANCH_COVER_IMAGE_SIZE_MB,
      }),
    }));

    updateFormData("branch", {
      coverImageFile: null,
      coverImagePreviewUrl: "",
      coverImage: "",
    });

    return;
  }

  const blobUrl = URL.createObjectURL(file);

  updateFormData("branch", {
    coverImageFile: file,
    coverImagePreviewUrl: blobUrl,
  });

  setErrors((prev) => {
    const updated = { ...prev };
    delete updated["branch.coverImage"];
    delete updated["branch.coverImageFile"];
    return updated;
  });

  const res = await uploadFile(file);

  if (res?.fileUrl) {
    updateFormData("branch", {
      coverImage: res.fileUrl,
    });
  }
};

  /* ---------------- GOOGLE MAPS SCRIPT ---------------- */

  useEffect(() => {
    const composed = composeAddress(branchAddress);

    if (!addressQuery && composed && hasMeaningfulAddress(branchAddress)) {
      setAddressQuery(composed);
    }
    // intentionally only on mount/revisit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, []);

  /* ---------------- GOOGLE MAP + AUTOCOMPLETE ---------------- */

  useEffect(() => {
    const maps = getGoogleMaps();

    if (!mapsReady || !autocompleteInputRef.current) return;
    if (!maps?.places?.Autocomplete) return;
    if (autocompleteInstanceRef.current) return;

    const autocomplete = new maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        fields: [
          "address_components",
          "formatted_address",
          "geometry",
          "name",
          "place_id",
        ],
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocompleteInstanceRef.current?.getPlace?.();

      if (!place?.geometry) {
        setLocationError(tRegister("branch.map.selectSuggestion"));
        return;
      }

      applyPlaceToForm(place);
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
  }, [mapsReady]);

  useEffect(() => {
    const maps = getGoogleMaps();

    if (!mapsReady || !mapContainerRef.current || !maps?.Map || !maps.Marker) {
      return;
    }

    const currentCoordinates = getCurrentCoordinates();

    if (!mapInstanceRef.current) {
      const map = new maps.Map(mapContainerRef.current, {
        center: {
          lat: currentCoordinates.lat,
          lng: currentCoordinates.lng,
        },
        zoom: currentCoordinates.hasSavedCoordinates ? 16 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
      });

      mapInstanceRef.current = map;

      const marker = new maps.Marker({
        position: {
          lat: currentCoordinates.lat,
          lng: currentCoordinates.lng,
        },
        map,
        draggable: true,
        title: tRegister("branch.map.markerTitle"),
      });

      marker.addListener("dragend", () => {
        const position = markerRef.current?.getPosition?.();
        const lat = position?.lat?.();
        const lng = position?.lng?.();

        if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
          applyCoordinatesToForm(String(lat), String(lng));
          reverseGeocodeCoordinates(String(lat), String(lng), {
            stopLocationLoading: false,
            showFallbackError: true,
          });
        }
      });

      markerRef.current = marker;

      map.addListener("click", (event) => {
        const lat = event?.latLng?.lat?.();
        const lng = event?.latLng?.lng?.();

        if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
          updateMapMarker(String(lat), String(lng), false);
          applyCoordinatesToForm(String(lat), String(lng));
          reverseGeocodeCoordinates(String(lat), String(lng), {
            stopLocationLoading: false,
            showFallbackError: true,
          });
        }
      });

      return;
    }

    if (currentCoordinates.hasSavedCoordinates) {
      updateMapMarker(currentCoordinates.lat, currentCoordinates.lng, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsReady]);

  useEffect(() => {
    const lat = toFiniteNumber(branchAddress.lat);
    const lng = toFiniteNumber(branchAddress.lng);

    if (lat === null || lng === null) return;

    updateMapMarker(lat, lng, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchAddress.lat, branchAddress.lng]);

  const handleAddressQueryChange = (value: string) => {
    setAddressQuery(value);
    setLocationError("");

    if (value !== selectedGoogleAddress) {
      setSelectedGoogleAddress("");
    }
  };

  const handleAddressSearch = () => {
    const maps = getGoogleMaps();
    const query = addressQuery.trim();

    if (!query) {
      setLocationError(tRegister("branch.map.enterAddress"));
      return;
    }

    if (!maps?.Geocoder) {
      setMapsError(tRegister("branch.map.notReady"));
      return;
    }

    setAddressSearching(true);
    setLocationError("");

    const geocoder = new maps.Geocoder();

    geocoder.geocode(
      {
        address: query,
      },
      (results: GoogleGeocoderResult[] | null, status: string) => {
        if (status === "OK" && results?.[0]) {
          applyPlaceToForm(results[0]);
        } else {
          setLocationError(tRegister("branch.map.noMatch"));
        }

        setAddressSearching(false);
      }
    );
  };

  const handleAddressKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    handleAddressSearch();
  };

  /* ---------------- CURRENT LOCATION ---------------- */

  const reverseGeocodeCoordinates = (
    lat: string,
    lng: string,
    options?: {
      stopLocationLoading?: boolean;
      showFallbackError?: boolean;
    }
  ) => {
    const maps = getGoogleMaps();

    if (!maps?.Geocoder) {
      if (options?.showFallbackError) {
        setMapsError(tRegister("branch.map.coordinatesSavedOnly"));
      }

      if (options?.stopLocationLoading) {
        setGettingLocation(false);
      }

      return;
    }

    const geocoder = new maps.Geocoder();

    geocoder.geocode(
      {
        location: { lat: Number(lat), lng: Number(lng) },
      },
      (results: GoogleGeocoderResult[] | null, status: string) => {
        if (status === "OK" && results?.[0]) {
          applyPlaceToForm(results[0]);
        } else if (options?.showFallbackError) {
          setLocationError(tRegister("branch.map.addressNotResolved"));
        }

        if (options?.stopLocationLoading) {
          setGettingLocation(false);
        }
      }
    );
  };

  const handleGetCurrentLocation = async () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(tRegister("branch.location.unsupported"));
      return;
    }

    setGettingLocation(true);

    try {
      if (navigator.permissions?.query) {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (permission.state === "denied") {
          setGettingLocation(false);
          setLocationError(
            tRegister("branch.location.blocked")
          );
          return;
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = String(position.coords.latitude);
          const lng = String(position.coords.longitude);

          applyCoordinatesToForm(lat, lng);
          updateMapMarker(lat, lng, true);

          if (mapsReady && getGoogleMaps()?.Geocoder) {
            reverseGeocodeCoordinates(lat, lng, {
              stopLocationLoading: true,
              showFallbackError: true,
            });
            return;
          }

          setGettingLocation(false);
          setMapsError(tRegister("branch.map.coordinatesSavedOnly"));
        },
        (geoError) => {
          setGettingLocation(false);

          if (geoError.code === geoError.PERMISSION_DENIED) {
            setLocationError(tRegister("branch.location.permissionDenied"));
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            setLocationError(tRegister("branch.location.unavailable"));
          } else if (geoError.code === geoError.TIMEOUT) {
            setLocationError(tRegister("branch.location.timeout"));
          } else {
            setLocationError(tRegister("branch.location.fetchFailed"));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch {
      setGettingLocation(false);
      setLocationError(tRegister("branch.location.permissionCheckFailed"));
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const scrollToFirstError = (fieldErrors: Record<string, string>) => {
    const firstError = Object.keys(fieldErrors)[0];
    if (!firstError) return;

    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(
        `[data-field="${firstError}"]`
      );
      const input = target?.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
      >("input, textarea, button");

      (target || input)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      window.setTimeout(() => input?.focus(), 250);
    }, 50);
  };

  const validateBranchAdmin = () => {
    const nextErrors: Record<string, string> = {};

    if (!branchAdmin.firstName?.trim()) {
      nextErrors["branchAdmin.firstName"] = tValidation(
        "register.branchAdminFirstNameRequired"
      );
    }

    if (!branchAdmin.lastName?.trim()) {
      nextErrors["branchAdmin.lastName"] = tValidation(
        "register.branchAdminLastNameRequired"
      );
    }

    if (!branchAdmin.email?.trim()) {
      nextErrors["branchAdmin.email"] = tValidation(
        "register.branchAdminEmailRequired"
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(branchAdmin.email)) {
      nextErrors["branchAdmin.email"] = tValidation("register.invalidEmailFormat");
    }

    if (!branchAdmin.password?.trim()) {
      nextErrors["branchAdmin.password"] = tValidation(
        "register.branchAdminPasswordRequired"
      );
    } else if (branchAdmin.password.length < 8) {
      nextErrors["branchAdmin.password"] = tValidation("register.passwordMin");
    }

    return nextErrors;
  };

  const validateDeliverySettings = () => {
    const deliveryConfig = branchSettings.deliveryConfig;

    if (!deliveryConfig || typeof deliveryConfig !== "object") return true;

    const config = deliveryConfig as {
      mode?: string;
      postalCodeRules?: {
        deliveryFee?: number | string;
        postalCode?: string;
      }[];
      zoneBands?: {
        deliveryFee?: number | string;
        fromKm?: number | string;
        toKm?: number | string;
      }[];
      zones?: {
        deliveryFee?: number | string;
        name?: string;
        polygon?: unknown[];
      }[];
    };

    if (config.mode === "POSTAL_CODE") {
      const rules = Array.isArray(config.postalCodeRules)
        ? config.postalCodeRules
        : [];
      const postalCodes = rules
        .map((rule) => String(rule.postalCode || "").trim())
        .filter(Boolean);

      if (!rules.length || rules.some((rule) => !rule.postalCode || rule.deliveryFee === "")) {
        toast.error("Add at least one postal code rule with postal code and delivery fee.");
        return false;
      }

      if (new Set(postalCodes).size !== postalCodes.length) {
        toast.error("Postal code rules cannot contain duplicate postal codes.");
        return false;
      }
    }

    if (config.mode === "ZONE_BANDS") {
      const bands = Array.isArray(config.zoneBands) ? config.zoneBands : [];
      const normalizedBands = bands.map((band) => ({
        fromKm: toNumber(band.fromKm, NaN),
        toKm: toNumber(band.toKm, NaN),
        deliveryFee: toNumber(band.deliveryFee, NaN),
      }));

      if (
        !normalizedBands.length ||
        normalizedBands.some(
          (band) =>
            !Number.isFinite(band.fromKm) ||
            !Number.isFinite(band.toKm) ||
            !Number.isFinite(band.deliveryFee) ||
            band.fromKm < 0 ||
            band.toKm <= band.fromKm
        )
      ) {
        toast.error("Add valid distance bands with from/to km and delivery fee.");
        return false;
      }

      const sortedBands = [...normalizedBands].sort((a, b) => a.fromKm - b.fromKm);
      const hasOverlap = sortedBands.some((band, index) => {
        const previous = sortedBands[index - 1];
        return previous ? band.fromKm < previous.toKm : false;
      });

      if (hasOverlap) {
        toast.error("Distance bands cannot overlap.");
        return false;
      }
    }

    if (config.mode === "ZONE") {
      const zones = Array.isArray(config.zones) ? config.zones : [];

      if (
        !zones.length ||
        zones.some(
          (zone) =>
            !zone.name ||
            zone.deliveryFee === "" ||
            !Array.isArray(zone.polygon) ||
            zone.polygon.length < 3
        )
      ) {
        toast.error("Add at least one delivery zone with a name, fee, and three map points.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    const { success, errors } = validateZod(
      translatedBranchSchema,
      formData.branch,
      "branch"
    );

    const branchAdminErrors = validateBranchAdmin();
    const mergedErrors = {
      ...errors,
      ...branchAdminErrors,
    };

    if (!success || Object.keys(branchAdminErrors).length > 0) {
      setErrors(mergedErrors);
      scrollToFirstError(mergedErrors);
      return;
    }

    if (!validateDeliverySettings()) {
      document
        .querySelector<HTMLElement>('[data-field="branch.settings.deliveryConfig"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      <BranchBasicInfo
        branch={branch}
        error={error}
        onFieldChange={(field, value) => updateField(field, value)}
        onImageChange={handleImageSelect}
        progress={progress}
        uploading={uploading}
      />

      <BranchAdminInfo
        branchAdmin={branchAdmin}
        error={error}
        isSameAsOwner={branchAdminSameAsOwner}
        onFieldChange={(field, value) => updateBranchAdminField(field, value)}
        onSameAsOwnerChange={handleBranchAdminSameAsOwnerChange}
      />

      {/* Address */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("branch.address.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <BranchLocationSearch
          addressQuery={addressQuery}
          addressSearching={addressSearching}
          autocompleteInputRef={autocompleteInputRef}
          coordinatesLabel={
            branchAddress.lat && branchAddress.lng
              ? `${branchAddress.lat}, ${branchAddress.lng}`
              : tRegister("branch.map.coordinatesNotSelected")
          }
          gettingLocation={gettingLocation}
          locationError={locationError}
          mapContainerRef={mapContainerRef}
          mapsError={mapsError}
          mapsLoading={mapsLoading}
          mapsReady={mapsReady}
          onAddressKeyDown={handleAddressKeyDown}
          onAddressQueryChange={handleAddressQueryChange}
          onAddressSearch={handleAddressSearch}
          selectedGoogleAddress={selectedGoogleAddress}
        />

        <BranchAddressFields
          address={branchAddress}
          error={error}
          onFieldChange={(field, value) => updateAddressField(field, value)}
        />
      </div>

      {/* Location */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("branch.location.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div>
          <label className="text-[16px] mb-2 block">
            {tRegister("branch.location.getLocation")}
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={gettingLocation}
            className="w-full justify-start gap-2 border-primary text-[#030401] rounded-[10px] py-6 disabled:opacity-50"
          >
            {gettingLocation ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            {gettingLocation
              ? tRegister("branch.location.fetching")
              : tRegister("branch.location.useCurrent")}
          </Button>
        </div>

        <div>
          <FormInput
            label={tRegister("branch.address.fields.latitude.requiredLabel")}
            placeholder={tRegister("branch.address.fields.latitude.placeholder")}
            value={branchAddress.lat || ""}
            onChange={(val) => updateAddressField("lat", val)}
          />
          {error("branch.address.lat") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.lat")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label={tRegister("branch.address.fields.longitude.requiredLabel")}
            placeholder={tRegister("branch.address.fields.longitude.placeholder")}
            value={branchAddress.lng || ""}
            onChange={(val) => updateAddressField("lng", val)}
          />
          {error("branch.address.lng") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.lng")}
            </p>
          )}
        </div>
      </div>

      {/* Delivery Area & Order Settings */}
      <BranchDeliveryAreaSettings
        branchAddress={branchAddress}
        settings={branchSettings}
        onChange={handleBranchSettingsChange}
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-10">
        <Button
          onClick={back}
          className="px-6 py-2 rounded-full bg-[#F5F5F5] text-sm text-gray-500"
        >
          {tCommon("actions.back")}
        </Button>

        <Button
          onClick={handleNext}
          disabled={uploading || gettingLocation}
          className="bg-primary hover:bg-red-800 px-16 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? tRegister("upload.uploading")
            : tCommon("actions.saveContinue")}
        </Button>
      </div>
    </div>
  );
}
