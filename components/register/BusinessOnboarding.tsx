"use client";

import { useEffect, useMemo, useState } from "react";

import { StorePublished } from "./StorePublished";
import { UserInfoStep } from "./form/UserInfoStep";
import { TenantInfoStep } from "./TenantInfoStep";
import { BranchStep } from "./BranchStep";
import { SettingsStep } from "./SettingsStep";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { PackagePlan } from "@/types/package-plans";

type PublishedResponseData = {
  branchAdminCredentials?: {
    email?: unknown;
    password?: unknown;
  };
  branchId?: unknown;
  email?: unknown;
  ownerId?: unknown;
  restaurant?: {
    id?: unknown;
    restaurantId?: unknown;
  };
  restaurantId?: unknown;
  subscription?: RegistrationSubscription;
  tenantId?: unknown;
};

type OnboardingStepConfig = {
  id: number;
  labelKey: string;
};

type PlainObject = Record<string, unknown>;

type RegistrationSubscription = {
  id?: unknown;
  packagePlanId?: unknown;
  paymentRequiredNow?: unknown;
  paymentStatus?: unknown;
  plan?: {
    billingInterval?: unknown;
    billingModel?: unknown;
    currency?: unknown;
    id?: unknown;
    name?: unknown;
    planPrice?: unknown;
    trialDays?: unknown;
  };
  status?: unknown;
};

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

const normalizeEnumValue = (value: unknown) => {
  return toStringValue(value).trim().toUpperCase();
};

const createSlug = (value: string, fallback = "restaurant") => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
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

const buildPublishedFormSummary = (formData: {
  branch: { name?: string };
  restaurant: { name?: string };
  tenant: { name?: string };
  user: { email?: string };
}) => {
  return {
    branch: {
      name: formData.branch.name,
    },
    restaurant: {
      name: formData.restaurant.name,
    },
    tenant: {
      name: formData.tenant.name,
    },
    user: {
      email: normalizeEmail(formData.user.email),
    },
  };
};

const shouldCollectPackagePayment = ({
  selectedPackagePlan,
  subscription,
}: {
  selectedPackagePlan: PackagePlan;
  subscription: PlainObject;
}) => {
  const paymentRequiredNow = subscription.paymentRequiredNow === true;
  const paymentStatus = normalizeEnumValue(subscription.paymentStatus);
  const subscriptionPlan = normalizePlainObject(subscription.plan);
  const billingModel =
    normalizeEnumValue(subscriptionPlan.billingModel) ||
    normalizeEnumValue(selectedPackagePlan.billingModel);
  const trialDays = toNumber(
    subscriptionPlan.trialDays,
    selectedPackagePlan.trialDays
  );
  const planPrice = toNumber(
    subscriptionPlan.planPrice,
    toNumber(selectedPackagePlan.planPrice)
  );
  const selectedPaidPlanRequiresPayment =
    trialDays <= 0 &&
    planPrice > 0 &&
    (billingModel === "PLAN" || billingModel === "HYBRID");

  return (
    paymentRequiredNow ||
    paymentStatus === "PENDING" ||
    selectedPaidPlanRequiresPayment
  );
};

const normalizeDeliveryMode = (mode: unknown) => {
  if (mode === "ZONE" || mode === "POSTAL_CODE" || mode === "ZONE_BANDS") {
    return mode;
  }

  return "RADIUS";
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
        minOrderAmount: toNumber(rule.minOrderAmount, 0),
        freeDeliveryThreshold: toNumber(rule.freeDeliveryThreshold, 0),
      };
    })
    .filter(
      (rule) =>
        rule.postalCode ||
        rule.deliveryFee > 0 ||
        rule.minOrderAmount > 0 ||
        rule.freeDeliveryThreshold > 0
    );
};

const createRestaurantBrandingPayload = (brandingValue: unknown) => {
  const branding = normalizePlainObject(brandingValue);
  const darkInput = normalizePlainObject(branding.dark);
  const themeInput = normalizePlainObject(branding.theme);
  const themeDarkInput = normalizePlainObject(themeInput.dark);
  const appInput = normalizePlainObject(branding.app);
  const checkoutInput = normalizePlainObject(branding.checkout);
  const assetsInput = normalizePlainObject(branding.assets);
  const assetLogosInput = normalizePlainObject(assetsInput.logos);
  const logoInput = normalizePlainObject(branding.logo);
  const primaryColor = toStringValue(branding.primaryColor, "#c1000a");
  const secondaryColor = toStringValue(branding.secondaryColor, "#030401");
  const accentColor = toStringValue(branding.accentColor, "#F59E0B");
  const backgroundColor = toStringValue(branding.backgroundColor, "#F5F5F5");
  const textColor = toStringValue(branding.textColor, "#030401");
  const fontFamily = toStringValue(
    branding.fontFamily,
    "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  );
  const headingFontFamily = toStringValue(
    branding.headingFontFamily,
    fontFamily
  );
  const borderRadius = toStringValue(branding.borderRadius, "12px");
  const buttonStyle = toStringValue(branding.buttonStyle, "rounded");
  const dark = {
    primaryColor: toStringValue(
      darkInput.primaryColor ?? themeDarkInput.primaryColor,
      "#FF4D57"
    ),
    secondaryColor: toStringValue(
      darkInput.secondaryColor ?? themeDarkInput.secondaryColor,
      "#F5F5F5"
    ),
    accentColor: toStringValue(
      darkInput.accentColor ?? themeDarkInput.accentColor,
      "#FBBF24"
    ),
    backgroundColor: toStringValue(
      darkInput.backgroundColor ?? themeDarkInput.backgroundColor,
      "#030401"
    ),
    textColor: toStringValue(
      darkInput.textColor ?? themeDarkInput.textColor,
      "#F5F5F5"
    ),
  };

  return {
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    dark,
    fontFamily,
    headingFontFamily,
    borderRadius,
    buttonStyle,
    theme: {
      mode: toStringValue(themeInput.mode, "light"),
      primaryColor: toStringValue(themeInput.primaryColor, primaryColor),
      secondaryColor: toStringValue(themeInput.secondaryColor, secondaryColor),
      accentColor: toStringValue(themeInput.accentColor, accentColor),
      backgroundColor: toStringValue(themeInput.backgroundColor, backgroundColor),
      textColor: toStringValue(themeInput.textColor, textColor),
      dark,
      fontFamily: toStringValue(themeInput.fontFamily, fontFamily),
      headingFontFamily: toStringValue(themeInput.headingFontFamily, headingFontFamily),
      borderRadius: toStringValue(themeInput.borderRadius, borderRadius),
      buttonStyle: toStringValue(themeInput.buttonStyle, buttonStyle),
      homeLayout: toStringValue(themeInput.homeLayout, "hero"),
      menuCardStyle: toStringValue(themeInput.menuCardStyle, "image-top"),
      showPopularItems: Boolean(themeInput.showPopularItems ?? true),
      showCategories: Boolean(themeInput.showCategories ?? true),
    },
    app: {
      homeLayout: toStringValue(appInput.homeLayout, "hero"),
      menuCardStyle: toStringValue(appInput.menuCardStyle, "image-top"),
      showTagline: Boolean(appInput.showTagline ?? true),
      showHeroBanner: Boolean(appInput.showHeroBanner ?? true),
      splashColor: toStringValue(appInput.splashColor, primaryColor),
      statusBarColor: toStringValue(appInput.statusBarColor, secondaryColor),
      bottomNavColor: toStringValue(appInput.bottomNavColor, backgroundColor),
    },
    checkout: {
      showLogo: Boolean(checkoutInput.showLogo ?? true),
      showSupportContact: Boolean(checkoutInput.showSupportContact ?? true),
      successMessage: toStringValue(
        checkoutInput.successMessage,
        "Thank you for ordering with us."
      ),
      highlightColor: toStringValue(checkoutInput.highlightColor, primaryColor),
      successColor: toStringValue(checkoutInput.successColor, "#00A63E"),
      warningColor: toStringValue(checkoutInput.warningColor, accentColor),
      errorColor: toStringValue(checkoutInput.errorColor, primaryColor),
    },
    assets: {
      logoUrl: toStringValue(assetsInput.logoUrl),
      coverImage: toStringValue(assetsInput.coverImage),
      heroBannerUrl: toStringValue(assetsInput.heroBannerUrl),
      placeholderImage: toStringValue(assetsInput.placeholderImage),
      faviconUrl: toStringValue(assetsInput.faviconUrl),
      logos: {
        primaryLogoUrl: toStringValue(assetLogosInput.primaryLogoUrl),
        compactLogoUrl: toStringValue(assetLogosInput.compactLogoUrl),
        faviconUrl: toStringValue(assetLogosInput.faviconUrl),
      },
    },
    logo: {
      light: toStringValue(logoInput.light),
      dark: toStringValue(logoInput.dark),
    },
  };
};

const buildBranchSettingsPayload = (settingsValue: unknown) => {
  const settings = normalizePlainObject(settingsValue);
  const deliveryConfig = normalizePlainObject(settings.deliveryConfig);
  const automation = normalizePlainObject(settings.automation);
  const taxation = normalizePlainObject(settings.taxation);
  const contact = normalizePlainObject(settings.contact);
  const serviceCharge = normalizePlainObject(settings.serviceCharge);

  const allowedOrderTypes = normalizeArray(settings?.allowedOrderTypes).length
    ? normalizeArray(settings.allowedOrderTypes)
    : ["DELIVERY"];

  return {
    deliveryTime: toNumber(settings?.deliveryTime, 45),
    tableReservationsEnabled: Boolean(settings?.tableReservationsEnabled ?? false),
    tableReservationAutoAccept: Boolean(
      settings?.tableReservationAutoAccept ?? false
    ),
    tableCount: toNumber(settings?.tableCount, 0),
    allowedOrderTypes,
    allowedPaymentMethods: ["COD", "PAYPAL"],
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
    serviceCharge: {
      isEnabled: Boolean(serviceCharge?.isEnabled ?? false),
      type:
        serviceCharge?.type === "AMOUNT" || serviceCharge?.type === "PERCENTAGE"
          ? serviceCharge.type
          : "PERCENTAGE",
      value: toNumber(serviceCharge?.value, 0),
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
  const [selectedPackagePlanId, setSelectedPackagePlanId] = useState("");
  const [packagePlans, setPackagePlans] = useState<PackagePlan[]>([]);
  const [packagePlansLoading, setPackagePlansLoading] = useState(true);
  const [packagePlansError, setPackagePlansError] = useState("");

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
        primaryColor: "#c1000a",
        secondaryColor: "#030401",
        accentColor: "#F59E0B",
        backgroundColor: "#F5F5F5",
        textColor: "#030401",
        dark: {
          primaryColor: "#FF4D57",
          secondaryColor: "#F5F5F5",
          accentColor: "#FBBF24",
          backgroundColor: "#030401",
          textColor: "#F5F5F5",
        },
        fontFamily:
          "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headingFontFamily:
          "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        borderRadius: "12px",
        buttonStyle: "rounded",
        theme: {
          mode: "light",
          primaryColor: "#c1000a",
          secondaryColor: "#030401",
          accentColor: "#F59E0B",
          backgroundColor: "#F5F5F5",
          textColor: "#030401",
          dark: {
            primaryColor: "#FF4D57",
            secondaryColor: "#F5F5F5",
            accentColor: "#FBBF24",
            backgroundColor: "#030401",
            textColor: "#F5F5F5",
          },
          fontFamily:
            "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          headingFontFamily:
            "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          borderRadius: "12px",
          buttonStyle: "rounded",
          homeLayout: "hero",
          menuCardStyle: "image-top",
          showPopularItems: true,
          showCategories: true,
        },
        app: {
          homeLayout: "hero",
          menuCardStyle: "image-top",
          showTagline: true,
          showHeroBanner: true,
          splashColor: "#c1000a",
          statusBarColor: "#030401",
          bottomNavColor: "#F5F5F5",
        },
        checkout: {
          showLogo: true,
          showSupportContact: true,
          successMessage: "Thank you for ordering with us.",
          highlightColor: "#c1000a",
          successColor: "#00A63E",
          warningColor: "#F59E0B",
          errorColor: "#c1000a",
        },
        assets: {
          logoUrl: "",
          coverImage: "",
          heroBannerUrl: "",
          placeholderImage: "",
          faviconUrl: "",
          logos: {
            primaryLogoUrl: "",
            compactLogoUrl: "",
            faviconUrl: "",
          },
        },
        logo: {
          light: "",
          dark: "",
        },
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
        houseNumber: "",
        street: "",
        postalCode: "",
        city: "",
        state: "",
        country: "Pakistan",
        lat: "",
        lng: "",
      },

      settings: {
        deliveryTime: 45,
        tableReservationsEnabled: false,
        tableReservationAutoAccept: false,
        tableCount: 0,
        allowedOrderTypes: ["DELIVERY"],
        allowedPaymentMethods: ["COD", "PAYPAL"],
        deliveryConfig: {
          mode: "RADIUS",
          radiusKm: 5,
          minOrderAmount: 0,
          deliveryFee: 150,
          isFreeDelivery: false,
          freeDeliveryThreshold: 0,
          zones: [],
          zoneBands: [],
          postalCodeRules: [],
        },
        automation: {
          autoAcceptOrders: false,
          estimatedPrepTime: 30,
        },
        taxation: {
          taxPercentage: 0,
        },
        contact: {
          whatsapp: "",
          phone: "",
        },
        serviceCharge: {
          isEnabled: false,
          type: "PERCENTAGE",
          value: 0,
        },

        // Legacy fields kept for backward compatibility with older step components.
        taxPercentage: 0,
        isFreeDelivery: false,
        freeDeliveryThreshold: 0,
        deliveryFee: 150,
        minOrderAmount: 0,
        radiusKm: 5,
        autoAcceptOrders: false,
        estimatedPrepTime: 30,
      },
    },
  });
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep, showOtpVerification]);

  useEffect(() => {
    const packagePlanId = new URLSearchParams(window.location.search).get(
      "packagePlanId"
    );
    const storedPackagePlanId = localStorage.getItem("selectedPackagePlanId");
    const nextPackagePlanId = packagePlanId || storedPackagePlanId || "";

    if (!nextPackagePlanId) return;

    localStorage.setItem("selectedPackagePlanId", nextPackagePlanId);
    queueMicrotask(() => setSelectedPackagePlanId(nextPackagePlanId));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPackagePlans = async () => {
      setPackagePlansLoading(true);
      setPackagePlansError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/v1/package-plans?page=1&limit=100&includeInactive=false`
        );
        const payload: unknown = await response.json();
        const responseData = normalizePlainObject(payload);
        const plans = normalizeArray(responseData.data)
          .filter((plan): plan is PackagePlan => {
            const packagePlan = normalizePlainObject(plan);

            return (
              typeof packagePlan.id === "string" &&
              typeof packagePlan.name === "string" &&
              typeof packagePlan.billingModel === "string" &&
              typeof packagePlan.billingInterval === "string" &&
              typeof packagePlan.planPrice === "string" &&
              typeof packagePlan.currency === "string" &&
              packagePlan.isActive !== false
            );
          });

        if (!response.ok) {
          throw new Error(
            getMessageValue(responseData.message) ||
              "Unable to load package plans"
          );
        }

        if (!isMounted) return;

        setPackagePlans(plans);

        const storedPlanId = localStorage.getItem("selectedPackagePlanId");

        if (plans.length === 1 && !storedPlanId) {
          setSelectedPackagePlanId(plans[0].id);
          localStorage.setItem("selectedPackagePlanId", plans[0].id);
        }
      } catch (error: unknown) {
        if (!isMounted) return;

        setPackagePlansError(
          error instanceof Error ? error.message : "Unable to load package plans"
        );
      } finally {
        if (isMounted) {
          setPackagePlansLoading(false);
        }
      }
    };

    loadPackagePlans();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= DERIVED VALUES ================= */

  const activeIndex = ONBOARDING_STEPS.findIndex((s) => s.id === activeStep);
  const selectedPackagePlan = useMemo(() => {
    return packagePlans.find((plan) => plan.id === selectedPackagePlanId) || null;
  }, [packagePlans, selectedPackagePlanId]);
  const canSubmitRegistration = Boolean(selectedPackagePlan);

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
    if (!selectedPackagePlan) {
      toast.error(tRegister("plans.required"));
      return;
    }

    setLoading(true);

    const branchSettingsPayload = buildBranchSettingsPayload(
      formData.branch.settings
    );
    const tenantSlug = createSlug(
      formData.tenant.slug || formData.tenant.name || formData.restaurant.name,
      "tenant"
    );

    const payload = {
      packagePlanId: selectedPackagePlan.id,
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
        slug: tenantSlug,
        logoUrl: formData.tenant.logoUrl,
        bio: formData.tenant.bio,
        socialLinks: normalizePlainObject(formData.tenant.socialLinks),
        settings: normalizePlainObject(formData.tenant.settings),
      },
      restaurant: {
        name: formData.restaurant.name,
        logoUrl: formData.restaurant.logoUrl,
        coverImage:
          formData.restaurant.coverImage || formData.branch.coverImage || "",
        customDomain: formData.restaurant.customDomain || "",
        bio: formData.restaurant.bio || "",
        tagline: formData.restaurant.tagline,
        supportContact: normalizePlainObject(formData.restaurant.supportContact),
        branding: createRestaurantBrandingPayload(formData.restaurant.branding),
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
        street: [formData.branch.address.houseNumber, formData.branch.address.street]
          .filter(Boolean)
          .join(" ")
          .trim(),
        area: formData.branch.address.postalCode || "",
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
      const subscription = normalizePlainObject(nestedResponseData.subscription);
      const shouldShowPackagePayment = shouldCollectPackagePayment({
        selectedPackagePlan,
        subscription,
      });

      setPublishedData(omitAuthTokens(nestedResponseData));

      if (!token) {
        toast.error(tRegister("toasts.accessTokenMissing"));
        return;
      }

      localStorage.removeItem("selectedPackagePlanId");

      if (shouldShowPackagePayment) {
        sessionStorage.setItem(
          "deliverywayPackageSubscription",
          JSON.stringify({
            emailVerified: false,
            formData: buildPublishedFormSummary(formData),
            registration: omitAuthTokens(nestedResponseData),
            subscription,
          })
        );
        sessionStorage.setItem("deliverywayPaymentManagementToken", token);
        localStorage.setItem("tenantSignupToken", token);
        window.location.assign("/package-payment");
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
            packagePlans={packagePlans}
            packagePlansError={packagePlansError}
            packagePlansLoading={packagePlansLoading}
            formData={formData}
            updateFormData={updateFormData}
            next={handleSubmit}
            back={() => setActiveStep(3)}
            isLoading={loading || !canSubmitRegistration}
            onPackagePlanChange={(packagePlanId) => {
              setSelectedPackagePlanId(packagePlanId);
              localStorage.setItem("selectedPackagePlanId", packagePlanId);
            }}
            selectedPackagePlanId={selectedPackagePlanId}
            disabledReason={
              canSubmitRegistration ? "" : tRegister("plans.required")
            }
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
