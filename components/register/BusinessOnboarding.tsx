"use client";

import { useEffect, useMemo, useState } from "react";

import { StorePublished } from "./StorePublished";
import UserInfoStep from "./form/UserInfoStep";
import TenantInfoStep from "./TenantInfoStep";
import { BranchStep } from "./BranchStep";
import { SettingsStep } from "./SettingsStep";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type PublishedResponseData = {
  branchId?: unknown;
  ownerId?: unknown;
  restaurant?: {
    id?: unknown;
    restaurantId?: unknown;
  };
  restaurantId?: unknown;
  tenantId?: unknown;
};

type OnboardingStepConfig = {
  id: number;
  labelKey: string;
};

type PlainObject = Record<string, unknown>;

const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  { id: 1, labelKey: "steps.account" },
  { id: 2, labelKey: "steps.tenantRestaurant" },
  { id: 3, labelKey: "steps.branch" },
  { id: 4, labelKey: "steps.type" },
  { id: 5, labelKey: "steps.published" },
];

const normalizeEmail = (email?: string) => {
  return String(email || "").trim().toLowerCase();
};

const isPlainObject = (value: unknown): value is PlainObject => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const getMessageValue = (value: unknown) => {
  return typeof value === "string" ? value : "";
};

const isUserAlreadyExistsError = (data: unknown) => {
  const response = normalizePlainObject(data);
  const error = normalizePlainObject(response.error);
  const message = [
    response.message,
    error.message,
    error.code,
  ]
    .map(getMessageValue)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return message.includes("user already exists");
};

const extractAccessToken = (data: unknown) => {
  const response = normalizePlainObject(data);
  const responseData = normalizePlainObject(response.data);
  return toStringValue(
    responseData.accessToken ||
      responseData.token ||
      response.accessToken ||
      response.token
  );
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toStringValue = (value: unknown, fallback = "") => {
  if (value === undefined || value === null) return fallback;
  return String(value);
};

const normalizeArray = (value: unknown) => {
  return Array.isArray(value) ? value : [];
};

const normalizePlainObject = (value: unknown): PlainObject => {
  return isPlainObject(value) ? value : {};
};

const omitAuthTokens = (value: PlainObject): PublishedResponseData => {
  const { accessToken, token, ...rest } = value;
  void accessToken;
  void token;
  return rest;
};

const normalizeDeliveryMode = (mode: unknown) => {
  return mode === "ZONE" || mode === "POSTAL_CODE" ? mode : "RADIUS";
};

const normalizeDeliveryZones = (zones: unknown) => {
  return normalizeArray(zones)
    .map((zoneValue) => {
      const zone = normalizePlainObject(zoneValue);

      return {
        name: toStringValue(zone.name).trim(),
        deliveryFee: toNumber(zone.deliveryFee, 0),
        minOrderAmount: toNumber(zone.minOrderAmount, 0),
        freeDeliveryThreshold: toNumber(zone.freeDeliveryThreshold, 0),
        polygon: normalizeArray(zone.polygon)
        .map((pointValue) => {
          const point = normalizePlainObject(pointValue);

          return {
          lat: toNumber(point?.lat, NaN),
          lng: toNumber(point?.lng, NaN),
          };
        })
        .filter(
          (point) =>
            Number.isFinite(point.lat) && Number.isFinite(point.lng)
        ),
      };
    })
    .filter(
      (zone) =>
        zone.name ||
        zone.deliveryFee > 0 ||
        zone.minOrderAmount > 0 ||
        zone.freeDeliveryThreshold > 0 ||
        zone.polygon.length > 0
    );
};

const normalizeZoneBands = (bands: unknown) => {
  return normalizeArray(bands)
    .map((bandValue) => {
      const band = normalizePlainObject(bandValue);

      return {
        fromKm: toNumber(band.fromKm, 0),
        toKm: toNumber(band.toKm, 0),
        deliveryFee: toNumber(band.deliveryFee, 0),
        minOrderAmount: toNumber(band.minOrderAmount, 0),
        freeDeliveryThreshold: toNumber(band.freeDeliveryThreshold, 0),
      };
    })
    .filter(
      (band) =>
        band.fromKm > 0 ||
        band.toKm > 0 ||
        band.deliveryFee > 0 ||
        band.minOrderAmount > 0 ||
        band.freeDeliveryThreshold > 0
    );
};

const normalizePostalCodeRules = (rules: unknown) => {
  return normalizeArray(rules)
    .map((ruleValue) => {
      const rule = normalizePlainObject(ruleValue);

      return {
        postalCode: toStringValue(rule.postalCode).trim(),
        deliveryFee: toNumber(rule.deliveryFee, 0),
      };
    })
    .filter((rule) => rule.postalCode || rule.deliveryFee > 0);
};

const buildBranchSettingsPayload = (settingsValue: unknown) => {
  const settings = normalizePlainObject(settingsValue);
  const deliveryConfig = normalizePlainObject(settings.deliveryConfig);
  const automation = normalizePlainObject(settings.automation);
  const taxation = normalizePlainObject(settings.taxation);
  const contact = normalizePlainObject(settings.contact);

  const allowedOrderTypes = normalizeArray(settings?.allowedOrderTypes).length
    ? normalizeArray(settings.allowedOrderTypes)
    : ["DELIVERY"];

  const allowedPaymentMethods = normalizeArray(settings?.allowedPaymentMethods)
    .length
    ? normalizeArray(settings.allowedPaymentMethods)
    : ["COD"];

  return {
    deliveryTime: toNumber(settings?.deliveryTime, 45),
    tableReservationsEnabled: Boolean(settings?.tableReservationsEnabled ?? false),
    allowedOrderTypes,
    allowedPaymentMethods,
    deliveryConfig: {
      mode: normalizeDeliveryMode(deliveryConfig?.mode),
      radiusKm: toNumber(deliveryConfig?.radiusKm ?? settings?.radiusKm, 0),
      minOrderAmount: toNumber(
        deliveryConfig?.minOrderAmount ?? settings?.minOrderAmount,
        0
      ),
      deliveryFee: toNumber(deliveryConfig?.deliveryFee ?? settings?.deliveryFee, 0),
      isFreeDelivery: Boolean(
        deliveryConfig?.isFreeDelivery ?? settings?.isFreeDelivery ?? false
      ),
      freeDeliveryThreshold: toNumber(
        deliveryConfig?.freeDeliveryThreshold ?? settings?.freeDeliveryThreshold,
        0
      ),
      zones: normalizeDeliveryZones(deliveryConfig?.zones),
      zoneBands: normalizeZoneBands(deliveryConfig?.zoneBands),
      postalCodeRules: normalizePostalCodeRules(deliveryConfig?.postalCodeRules),
    },
    automation: {
      autoAcceptOrders: Boolean(
        automation?.autoAcceptOrders ?? settings?.autoAcceptOrders ?? false
      ),
      estimatedPrepTime: toNumber(
        automation?.estimatedPrepTime ?? settings?.estimatedPrepTime,
        0
      ),
    },
    taxation: {
      taxPercentage: toNumber(taxation?.taxPercentage ?? settings?.taxPercentage, 0),
    },
    contact: {
      whatsapp: toStringValue(contact?.whatsapp),
      phone: toStringValue(contact?.phone),
    },
  };
};

export function BusinessOnboarding() {
  const tRegister = useTranslations("register");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [publishedData, setPublishedData] = useState<PublishedResponseData | null>(null);

  /* ================= OTP STATES ================= */

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  /* ================= GLOBAL FORM DATA ================= */

  const [formData, setFormData] = useState({
    user: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      profileUrl: "",
      profilePreviewUrl: "",
      profileFile: undefined as File | undefined,
    },

    branchAdmin: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },

    tenant: {
      name: "",
      slug: "",
      bio: "",
      logoUrl: "",
      logoPreviewUrl: "",
      logoFile: undefined as File | undefined,
      socialLinks: {},
      settings: {},
    },

    restaurant: {
      name: "",
      slug: "",
      tagline: "",
      logoUrl: "",
      coverImage: "",
      customDomain: "",
      bio: "",
      logoPreviewUrl: "",
      logoFile: undefined as File | undefined,
      supportContact: {
        email: "",
        whatsapp: "",
        phone: "",
      },
      branding: {
        primaryColor: "#e4002b",
        secondaryColor: "#ffffff",
        fontFamily: "Poppins",
      },
      socialMedia: {},
    },

    branch: {
      name: "",
      logoUrl: "",
      coverImage: "",
      coverImagePreviewUrl: "",
      coverImageFile: undefined as File | undefined,
      description: "",
      address: {
        street: "",
        area: "",
        city: "",
        state: "",
        country: "Pakistan",
        lat: "",
        lng: "",
      },

      settings: {
        deliveryTime: 45,
        tableReservationsEnabled: false,
        allowedOrderTypes: ["DELIVERY"],
        allowedPaymentMethods: ["COD"],
        deliveryConfig: {
          mode: "RADIUS",
          radiusKm: 0,
          minOrderAmount: 0,
          deliveryFee: 0,
          isFreeDelivery: false,
          freeDeliveryThreshold: 0,
          zones: [],
          zoneBands: [],
          postalCodeRules: [],
        },
        automation: {
          autoAcceptOrders: false,
          estimatedPrepTime: 0,
        },
        taxation: {
          taxPercentage: 0,
        },
        contact: {
          whatsapp: "",
          phone: "",
        },

        // Legacy fields kept for backward compatibility with older step components.
        taxPercentage: 0,
        isFreeDelivery: false,
        freeDeliveryThreshold: 0,
        deliveryFee: 0,
        minOrderAmount: 0,
        radiusKm: 0,
        autoAcceptOrders: false,
        estimatedPrepTime: 0,
      },
    },
  });
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep, showOtpVerification]);

  /* ================= DERIVED VALUES ================= */

  const activeIndex = ONBOARDING_STEPS.findIndex((s) => s.id === activeStep);

  const verificationEmail = useMemo(() => {
    return normalizeEmail(otpEmail || formData.user.email);
  }, [otpEmail, formData.user.email]);

  const cleanedOtp = useMemo(() => {
    return otp.replace(/\D/g, "").slice(0, 6);
  }, [otp]);

  const isOtpValid = cleanedOtp.length >= 4;

  /* ================= UPDATE HELPER ================= */

  const updateFormData = (section: string, data: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...normalizePlainObject(prev[section as keyof typeof prev]),
        ...data,
      },
    }));
  };

  const startOtpVerification = ({
    email,
    token,
    step = 4,
  }: {
    email: string;
    token?: string;
    step?: number;
  }) => {
    const normalized = normalizeEmail(email);

    setOtp("");
    setOtpEmail(normalized);
    setShowOtpVerification(true);
    setActiveStep(step);

    if (token) {
      setAccessToken(token);
      localStorage.setItem("tenantSignupToken", token);
    }
  };

  const resetOtpVerification = () => {
    setOtp("");
    setOtpEmail("");
    setAccessToken("");
    setShowOtpVerification(false);
    localStorage.removeItem("tenantSignupToken");
    setActiveStep(1);
  };

  /* ================= API SUBMISSION ================= */

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const branchSettingsPayload = buildBranchSettingsPayload(
      formData.branch.settings
    );

    const payload = {
      user: {
        email: normalizeEmail(formData.user.email),
        password: formData.user.password,
        firstName: formData.user.firstName,
        lastName: formData.user.lastName,
        avatarUrl: formData.user.profileUrl,
        bio: "",
      },
      branchAdmin: {
        email: normalizeEmail(formData.branchAdmin?.email),
        password: formData.branchAdmin?.password || "",
        firstName: formData.branchAdmin?.firstName || "",
        lastName: formData.branchAdmin?.lastName || "",
        phone: formData.branchAdmin?.phone || "",
      },
      tenant: {
        name: formData.tenant.name,
        slug: formData.tenant.slug || formData.restaurant.slug,
        logoUrl: formData.tenant.logoUrl,
        bio: formData.tenant.bio,
        socialLinks: normalizePlainObject(formData.tenant.socialLinks),
        settings: normalizePlainObject(formData.tenant.settings),
      },
      restaurant: {
        name: formData.restaurant.name,
        slug: formData.restaurant.slug,
        logoUrl: formData.restaurant.logoUrl,
        coverImage:
          formData.restaurant.coverImage || formData.branch.coverImage || "",
        customDomain: formData.restaurant.customDomain || "",
        bio: formData.restaurant.bio || "",
        tagline: formData.restaurant.tagline,
        supportContact: normalizePlainObject(formData.restaurant.supportContact),
        branding: normalizePlainObject(formData.restaurant.branding),
        socialMedia: normalizePlainObject(formData.restaurant.socialMedia),
      },
      branch: {
        name: formData.branch.name,
        logoUrl:
          formData.branch.logoUrl ||
          formData.restaurant.logoUrl ||
          formData.tenant.logoUrl ||
          "",
        coverImage: formData.branch.coverImage,
        description: formData.branch.description,
        settings: branchSettingsPayload,
        street: formData.branch.address.street,
        area: formData.branch.address.area,
        city: formData.branch.address.city,
        state: formData.branch.address.state,
        country: formData.branch.address.country,
        lat: formData.branch.address.lat
          ? String(formData.branch.address.lat)
          : "0",
        lng: formData.branch.address.lng
          ? String(formData.branch.address.lng)
          : "0",
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/register-tenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json();
      const responseData = normalizePlainObject(data);
      const nestedResponseData = normalizePlainObject(responseData.data);

      if (!response.ok) {
        if (isUserAlreadyExistsError(data)) {
          const tokenFromError = extractAccessToken(data);

          startOtpVerification({
            email: formData.user.email,
            token: tokenFromError,
            step: 1,
          });

          toast.info(tRegister("toasts.userAlreadyExists"));
          return;
        }

        toast.error(
          getMessageValue(responseData.message) ||
            tRegister("toasts.registrationFailed")
        );
        return;
      }

      const token = extractAccessToken(data);

      setPublishedData(omitAuthTokens(nestedResponseData));

      if (!token) {
        toast.error(tRegister("toasts.accessTokenMissing"));
        return;
      }

      startOtpVerification({
        email: formData.user.email,
        token,
        step: 4,
      });

      toast.success(tRegister("toasts.registrationSuccessful"));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : tRegister("toasts.genericError")
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY EMAIL ================= */

  const handleVerifyOtp = async () => {
    if (!cleanedOtp) {
      toast.error(tRegister("otp.enterOtpError"));
      return;
    }

    if (!isOtpValid) {
      toast.error(tRegister("otp.validOtpError"));
      return;
    }

    const token = accessToken || localStorage.getItem("tenantSignupToken");

    setOtpLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/v1/auth/verify-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          otp: cleanedOtp,
        }),
      });

      const data: unknown = await res.json();
      const responseData = normalizePlainObject(data);
      const responseError = normalizePlainObject(responseData.error);

      if (!res.ok) {
        throw new Error(
            getMessageValue(responseData.message) ||
            getMessageValue(responseError.message) ||
            tRegister("otp.verificationFailed")
        );
      }

      toast.success(tRegister("otp.emailVerified"));

      localStorage.removeItem("tenantSignupToken");

      setShowOtpVerification(false);
      setOtp("");
      setOtpEmail("");
      setAccessToken("");

      setActiveStep(5);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : tRegister("otp.verificationFailed")
      );
    } finally {
      setOtpLoading(false);
    }
  };

  /* ================= OTP VIEW ================= */

  const renderOtpVerification = () => {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary text-2xl font-semibold">@</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            {tRegister("otp.title")}
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            {tRegister("otp.description")}
          </p>

          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">
              {tRegister("otp.sentTo")}
            </p>
            <p className="text-sm font-semibold text-gray-900 break-all mt-1">
              {verificationEmail || tRegister("otp.fallbackEmail")}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800">
              {tRegister("otp.fieldLabel")}
            </label>

            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={tRegister("otp.placeholder")}
              value={cleanedOtp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !otpLoading && isOtpValid) {
                  handleVerifyOtp();
                }
              }}
              className="mt-2 text-center tracking-[0.35em] font-semibold"
            />

            <p className="text-xs text-gray-500 mt-2">
              {tRegister("otp.helper")}
            </p>
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={otpLoading || !isOtpValid}
            className="w-full py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {otpLoading ? tRegister("otp.verifying") : tRegister("otp.verify")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetOtpVerification}
            disabled={otpLoading}
            className="w-full py-5 rounded-xl"
          >
            {tRegister("otp.changeEmail")}
          </Button>
        </div>
      </div>
    );
  };

  /* ================= RENDER STEP ================= */

  const renderStepContent = () => {
    if (showOtpVerification) {
      return renderOtpVerification();
    }

    switch (activeStep) {
      case 1:
        return (
          <UserInfoStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(2)}
          />
        );

      case 2:
        return (
          <TenantInfoStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(3)}
            back={() => setActiveStep(1)}
          />
        );

      case 3:
        return (
          <BranchStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(4)}
            back={() => setActiveStep(2)}
          />
        );

      case 4:
        return (
          <SettingsStep
            formData={formData}
            updateFormData={updateFormData}
            next={handleSubmit}
            back={() => setActiveStep(3)}
            isLoading={loading}
          />
        );

      case 5:
        return (
          <StorePublished formData={formData} publishedData={publishedData} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-10">
      {/* HEADER */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {tRegister("title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {tRegister("subtitle")}
        </p>
      </div>

      {/* STEPPER */}
      <div className="max-w-5xl mx-auto mb-10 relative overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[500px] sm:min-w-full">
          <div className="absolute top-5 left-0 w-full border-t border-dashed border-[#909090]" />

          <div
            className="absolute top-5 left-0 border-t border-dashed border-primary z-0"
            style={{
              width: `${((activeIndex + 0.5) / ONBOARDING_STEPS.length) * 100}%`,
            }}
          />

          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = step.id === activeStep;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center flex-1 min-w-[60px]"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted || isActive
                      ? "bg-primary text-white"
                      : "bg-white border border-[#909090] text-[#909090]"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>

                <span
                  className={`mt-2 text-[9px] sm:text-xs text-center
                  ${isActive ? "text-primary font-medium" : "text-[#909090]"}`}
                >
                  {tRegister(step.labelKey)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
}
