"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import FormInput from "./form/FormInput";
import { validateZod } from "@/hooks/useZodValidator";
import { branchSchema } from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import BranchDeliveryAreaSettings from "./BranchDeliveryAreaSettings";

declare global {
  interface Window {
    google?: any;
  }
}

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
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

export default function BranchStep({
  formData,
  updateFormData,
  next,
  back,
}: Props) {
  const branch = formData.branch || {};
  const branchAdmin = formData.branchAdmin || {};
  const branchAddress = branch.address || {};
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
const MAX_BRANCH_COVER_IMAGE_SIZE_MB = 2;
const MAX_BRANCH_COVER_IMAGE_SIZE_BYTES =
  MAX_BRANCH_COVER_IMAGE_SIZE_MB * 1024 * 1024;
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstanceRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const branchAddressRef = useRef<any>(branchAddress);

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

  const composeAddress = (address: any) => {
    return [
      address?.street,
      address?.area,
      address?.city,
      address?.state,
      address?.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const hasMeaningfulAddress = (address: any) => {
    return Boolean(
      address?.street ||
        address?.area ||
        address?.city ||
        address?.state ||
        (address?.lat && address?.lng)
    );
  };

  const updateField = (field: keyof typeof branch, value: any) => {
    updateFormData("branch", { [field]: value });
    clearError(`branch.${String(field)}`);
  };

  const updateBranchAdminField = (field: keyof typeof branchAdmin, value: any) => {
    updateFormData("branchAdmin", { [field]: value });
    clearError(`branchAdmin.${String(field)}`);
  };

  const updateAddressField = (
    field: keyof typeof branchAddress,
    value: any
  ) => {
    updateFormData("branch", {
      [field]: value,
      address: { ...branchAddress, [field]: value },
    });
    clearError(`branch.address.${String(field)}`);
    clearError(`branch.${String(field)}`);
  };

  const handleBranchSettingsChange = (nextSettings: any) => {
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
    components: any[],
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

    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;
    if (!window.google?.maps || !mapInstanceRef.current) return;

    const position = { lat: nextLat, lng: nextLng };

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        draggable: true,
        title: "Branch location",
      });

      markerRef.current.addListener("dragend", () => {
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

  const applyPlaceToForm = (place: any) => {
    if (!place) return false;

    const components = Array.isArray(place.address_components)
      ? place.address_components
      : [];

    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();

    const hasCoordinates =
      Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

    if (!components.length && !hasCoordinates) {
      setLocationError("Please select a valid Google Maps address.");
      return false;
    }

    const streetNumber = getAddressComponent(components, ["street_number"]);
    const route = getAddressComponent(components, ["route"]);
    const street =
      [streetNumber, route].filter(Boolean).join(" ").trim() ||
      place.name ||
      "";

    const area =
      getAddressComponent(components, [
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "neighborhood",
        "premise",
      ]) || "";

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
      street,
      area,
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
      street: nextAddress.street,
      area: nextAddress.area,
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
      "branch.address.area",
      "branch.address.city",
      "branch.address.state",
      "branch.address.country",
      "branch.address.lat",
      "branch.address.lng",
    ].forEach(clearError);

    return true;
  };

  /* ---------------- FILE ---------------- */

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_BRANCH_COVER_IMAGE_SIZE_BYTES) {
    e.target.value = "";

    setErrors((prev) => ({
      ...prev,
      "branch.coverImageFile": `Cover image must be less than ${MAX_BRANCH_COVER_IMAGE_SIZE_MB}MB.`,
      "branch.coverImage": `Cover image must be less than ${MAX_BRANCH_COVER_IMAGE_SIZE_MB}MB.`,
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

  const res = await uploadFile(e);

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

  /* ---------------- GOOGLE MAP + AUTOCOMPLETE ---------------- */

  useEffect(() => {
    if (!mapsReady || !autocompleteInputRef.current) return;
    if (!window.google?.maps?.places?.Autocomplete) return;
    if (autocompleteInstanceRef.current) return;

    autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
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

    autocompleteInstanceRef.current.addListener("place_changed", () => {
      const place = autocompleteInstanceRef.current?.getPlace?.();

      if (!place?.geometry) {
        setLocationError("Please select an address from Google Maps suggestions.");
        return;
      }

      applyPlaceToForm(place);
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

  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current || !window.google?.maps?.Map) {
      return;
    }

    const currentCoordinates = getCurrentCoordinates();

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
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

      markerRef.current = new window.google.maps.Marker({
        position: {
          lat: currentCoordinates.lat,
          lng: currentCoordinates.lng,
        },
        map: mapInstanceRef.current,
        draggable: true,
        title: "Branch location",
      });

      markerRef.current.addListener("dragend", () => {
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

      mapInstanceRef.current.addListener("click", (event: any) => {
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
    const query = addressQuery.trim();

    if (!query) {
      setLocationError("Please enter an address to search.");
      return;
    }

    if (!window.google?.maps?.Geocoder) {
      setMapsError("Google Maps is not ready yet.");
      return;
    }

    setAddressSearching(true);
    setLocationError("");

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        address: query,
      },
      (results: any, status: string) => {
        if (status === "OK" && results?.[0]) {
          applyPlaceToForm(results[0]);
        } else {
          setLocationError("No matching address found. Try a more specific address.");
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
    if (!window.google?.maps?.Geocoder) {
      if (options?.showFallbackError) {
        setMapsError("Google Maps is not ready yet. Coordinates were saved only.");
      }

      if (options?.stopLocationLoading) {
        setGettingLocation(false);
      }

      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        location: { lat: Number(lat), lng: Number(lng) },
      },
      (results: any, status: string) => {
        if (status === "OK" && results?.[0]) {
          applyPlaceToForm(results[0]);
        } else if (options?.showFallbackError) {
          setLocationError("Location found, but address could not be resolved.");
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
      setLocationError("Geolocation is not supported in this browser.");
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
            "Location access is blocked. Please enable it in browser settings."
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

          if (mapsReady && window.google?.maps?.Geocoder) {
            reverseGeocodeCoordinates(lat, lng, {
              stopLocationLoading: true,
              showFallbackError: true,
            });
            return;
          }

          setGettingLocation(false);
          setMapsError("Google Maps is not ready yet. Coordinates were saved only.");
        },
        (geoError) => {
          setGettingLocation(false);

          if (geoError.code === geoError.PERMISSION_DENIED) {
            setLocationError("Please allow location access in your browser.");
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            setLocationError("Location unavailable.");
          } else if (geoError.code === geoError.TIMEOUT) {
            setLocationError("Request timed out.");
          } else {
            setLocationError("Unable to fetch location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      setGettingLocation(false);
      setLocationError("Permission check failed.");
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const handleNext = () => {
    const { success, errors } = validateZod(
      branchSchema,
      formData.branch,
      "branch"
    );

    if (!success) {
      setErrors(errors);
      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      {/* Branch Info */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Branch Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <FormInput
            label="Branch Name*"
            placeholder="F-6 Super Market"
            value={branch.name || ""}
            onChange={(val) => updateField("name", val)}
          />
          {error("branch.name") && (
            <p className="text-red-500 text-xs mt-1">{error("branch.name")}</p>
          )}
        </div>

        <div>
          <FormInput
            label="Description*"
            placeholder="Our flagship branch in Islamabad."
            value={branch.description || ""}
            onChange={(val) => updateField("description", val)}
          />
          {error("branch.description") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.description")}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="sm:col-span-2">
          <label className="text-[16px] mb-2 block">Cover Image</label>

          <label className="h-[190px] rounded-xl border border-dashed border-[#bbbbbb] bg-[#F5F5F5] flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
            {branch.coverImagePreviewUrl ? (
              <>
                <img
                  src={branch.coverImagePreviewUrl}
                  alt="cover preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : null}

            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
                <Loader2 className="animate-spin text-white mb-2" size={28} />
                <p className="text-white text-sm font-semibold">{progress}%</p>
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-center px-4">
              {!branch.coverImagePreviewUrl && (
                <ImageIcon className="text-gray-400 mb-2" size={30} />
              )}

              <p
                className={`text-sm font-medium mt-2 ${
                  branch.coverImagePreviewUrl ? "text-white" : ""
                }`}
              >
                <span className="text-primary">Click to upload</span>
                <span
                  className={`font-semibold ml-1 ${
                    branch.coverImagePreviewUrl
                      ? "text-white"
                      : "text-[#909090]"
                  }`}
                >
                  or drag and drop
                </span>
              </p>

              <p
                className={`text-xs mt-1 ${
                  branch.coverImagePreviewUrl ? "text-white/90" : "text-gray-400"
                }`}
              >
                JPG, JPEG, PNG less than 2MB
              </p>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {(error("branch.coverImageFile") || error("branch.coverImage")) && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.coverImageFile") || error("branch.coverImage")}
            </p>
          )}
        </div>
      </div>

      {/* Branch Admin */}
      <section className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-[20px] font-semibold text-gray-900">
            Branch Admin Account
          </h2>
          <p className="text-sm text-gray-500">
            Create the branch-level administrator who will manage this branch after registration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <FormInput
              label="First Name"
              placeholder="Branch admin first name"
              value={branchAdmin.firstName || ""}
              onChange={(val) => updateBranchAdminField("firstName", val)}
            />
            {error("branchAdmin.firstName") && (
              <p className="mt-1 text-xs text-red-500">
                {error("branchAdmin.firstName")}
              </p>
            )}
          </div>

          <div>
            <FormInput
              label="Last Name"
              placeholder="Branch admin last name"
              value={branchAdmin.lastName || ""}
              onChange={(val) => updateBranchAdminField("lastName", val)}
            />
            {error("branchAdmin.lastName") && (
              <p className="mt-1 text-xs text-red-500">
                {error("branchAdmin.lastName")}
              </p>
            )}
          </div>

          <div>
            <FormInput
              label="Email"
              placeholder="branch.admin@example.com"
              value={branchAdmin.email || ""}
              onChange={(val) => updateBranchAdminField("email", val)}
            />
            {error("branchAdmin.email") && (
              <p className="mt-1 text-xs text-red-500">
                {error("branchAdmin.email")}
              </p>
            )}
          </div>

          <div>
            <FormInput
              label="Phone"
              placeholder="+92 300 0000000"
              value={branchAdmin.phone || ""}
              onChange={(val) => updateBranchAdminField("phone", val)}
            />
            {error("branchAdmin.phone") && (
              <p className="mt-1 text-xs text-red-500">
                {error("branchAdmin.phone")}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <FormInput
              label="Password"
              placeholder="Set branch admin password"
              value={branchAdmin.password || ""}
              onChange={(val) => updateBranchAdminField("password", val)}
            />
            {error("branchAdmin.password") && (
              <p className="mt-1 text-xs text-red-500">
                {error("branchAdmin.password")}
              </p>
            )}
          </div>
        </div>
      </section>


      {/* Address */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Address
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="sm:col-span-2">
          <label className="text-[16px] mb-2 block">
            Address from Google Maps*
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
                onChange={(e) => handleAddressQueryChange(e.target.value)}
                onKeyDown={handleAddressKeyDown}
                placeholder="Search restaurant address"
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

              {!mapsLoading &&
              !gettingLocation &&
              !addressSearching &&
              mapsError ? (
                <AlertCircle
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500"
                />
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddressSearch}
              disabled={!mapsReady || addressSearching || mapsLoading}
              className="h-[52px] rounded-[10px] border-primary px-5 text-primary disabled:opacity-50"
            >
              {addressSearching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Search Map
            </Button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            {mapsReady ? (
              <>
                <div ref={mapContainerRef} className="h-[280px] w-full" />

                <div className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Select a suggestion, search the address, click the map, or
                    drag the marker to set the branch location.
                  </span>

                  <span className="shrink-0 font-medium text-gray-700">
                    {branchAddress.lat && branchAddress.lng
                      ? `${branchAddress.lat}, ${branchAddress.lng}`
                      : "Coordinates not selected"}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                {mapsLoading ? (
                  <>
                    <Loader2 className="mb-3 animate-spin text-primary" size={28} />
                    <p className="text-sm font-medium text-gray-700">
                      Loading Google Map
                    </p>
                  </>
                ) : (
                  <>
                    <MapPin className="mb-3 text-gray-400" size={30} />
                    <p className="text-sm font-medium text-gray-700">
                      Google Map preview unavailable
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env to enable map
                      search and preview.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {mapsError ? (
              <p className="text-xs text-amber-600">{mapsError}</p>
            ) : null}

            {selectedGoogleAddress ? (
              <p className="text-xs text-gray-500">
                Selected: {selectedGoogleAddress}
              </p>
            ) : null}

            {locationError ? (
              <p className="text-xs text-red-500">{locationError}</p>
            ) : null}
          </div>
        </div>

        <div>
          <FormInput
            label="Street*"
            placeholder="Shop 12, Block A"
            value={branchAddress.street || ""}
            onChange={(val) => updateAddressField("street", val)}
          />
          {error("branch.address.street") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.street")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Area*"
            placeholder="F-6 Super Market"
            value={branchAddress.area || ""}
            onChange={(val) => updateAddressField("area", val)}
          />
          {error("branch.address.area") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.area")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="City*"
            placeholder="Islamabad"
            value={branchAddress.city || ""}
            onChange={(val) => updateAddressField("city", val)}
          />
          {error("branch.address.city") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.city")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="State*"
            placeholder="ICT"
            value={branchAddress.state || ""}
            onChange={(val) => updateAddressField("state", val)}
          />
          {error("branch.address.state") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.state")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Country*"
            placeholder="Germany"
            value={branchAddress.country || ""}
            onChange={(val) => updateAddressField("country", val)}
          />
          {error("branch.address.country") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.country")}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Location
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div>
          <label className="text-[16px] mb-2 block">Get Location</label>

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
            {gettingLocation ? "Fetching Location..." : "Use Current Location"}
          </Button>
        </div>

        <div>
          <FormInput
            label="Latitude*"
            placeholder="33.7297"
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
            label="Longitude*"
            placeholder="73.0745"
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
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={uploading || gettingLocation}
          className="bg-primary hover:bg-red-800 px-16 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
