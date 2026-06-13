"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ImageIcon,
  Palette,
  Smartphone,
  Sparkles,
  Type,
} from "lucide-react";
import { FormInput } from "./form/FormInput";
import { PremiumImageDropzone } from "./form/PremiumImageDropzone";
import { validateZod } from "@/hooks/useZodValidator";
import {
  createRegisterValidationMessages,
  createRestaurantSchema,
  createTenantSchema,
} from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import type { ReactNode, RefObject } from "react";
import type { ZodTypeAny } from "zod";

type TenantSection = {
  bio?: string;
  logoFile?: File | null;
  logoPreviewUrl?: string;
  logoUrl?: string;
  name?: string;
};

type UserSection = {
  firstName?: string;
  lastName?: string;
  profilePreviewUrl?: string;
  profileUrl?: string;
};

type BrandingSection = {
  accentColor?: string;
  app?: {
    bottomNavColor?: string;
    homeLayout?: string;
    menuCardStyle?: string;
    showHeroBanner?: boolean;
    showTagline?: boolean;
    splashColor?: string;
    statusBarColor?: string;
  };
  assets?: {
    coverImage?: string;
    faviconUrl?: string;
    heroBannerUrl?: string;
    logoUrl?: string;
    logos?: {
      compactLogoUrl?: string;
      faviconUrl?: string;
      primaryLogoUrl?: string;
    };
    placeholderImage?: string;
  };
  backgroundColor?: string;
  borderRadius?: string;
  buttonStyle?: string;
  checkout?: {
    errorColor?: string;
    highlightColor?: string;
    showLogo?: boolean;
    showSupportContact?: boolean;
    successColor?: string;
    successMessage?: string;
    warningColor?: string;
  };
  dark?: {
    accentColor?: string;
    backgroundColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  };
  fontFamily?: string;
  headingFontFamily?: string;
  logo?: {
    dark?: string;
    light?: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  theme?: {
    accentColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
    buttonStyle?: string;
    dark?: BrandingSection["dark"];
    fontFamily?: string;
    headingFontFamily?: string;
    homeLayout?: string;
    menuCardStyle?: string;
    mode?: string;
    primaryColor?: string;
    secondaryColor?: string;
    showCategories?: boolean;
    showPopularItems?: boolean;
    textColor?: string;
  };
};

type RestaurantSection = {
  branding: BrandingSection;
  logoFile?: File | null;
  logoPreviewUrl?: string;
  logoUrl?: string;
  name?: string;
  slug?: string;
  supportContact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  tagline?: string;
};

interface Props {
  formData: {
    restaurant: RestaurantSection;
    tenant: TenantSection;
    user?: UserSection;
  };
  updateFormData: (section: string, data: Record<string, unknown>) => void;
  next: () => void;
  back: () => void;
}

const DEFAULT_FONT_FAMILY =
  "var(--font-onest), 'Onest', 'Onest Fallback', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const FONT_OPTIONS = [
  { label: "Onest / System Sans (Default)", value: DEFAULT_FONT_FAMILY },
  {
    label: "Poppins",
    value: "'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "Barlow",
    value: "'Barlow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "Arimo",
    value: "'Arimo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "System UI",
    value: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "Serif",
    value: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  },
];

const BUTTON_STYLE_OPTIONS = [
  { label: "Rounded", value: "rounded" },
  { label: "Soft", value: "soft" },
  { label: "Pill", value: "pill" },
  { label: "Sharp", value: "sharp" },
];

const HOME_LAYOUT_OPTIONS = [
  { label: "Hero", value: "hero" },
  { label: "Compact", value: "compact" },
  { label: "Grid", value: "grid" },
];

const MENU_CARD_STYLE_OPTIONS = [
  { label: "Image Top", value: "image-top" },
  { label: "Image Left", value: "image-left" },
  { label: "Minimal", value: "minimal" },
];

const THEME_MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const readBrandingValue = (
  branding: BrandingSection,
  path: string[],
  fallback: string
) => {
  let cursor: unknown = branding;

  for (const key of path) {
    if (!isRecord(cursor)) return fallback;
    cursor = cursor[key];
  }

  return typeof cursor === "string" && cursor.length > 0 ? cursor : fallback;
};

const readBrandingBoolean = (
  branding: BrandingSection,
  path: string[],
  fallback: boolean
) => {
  let cursor: unknown = branding;

  for (const key of path) {
    if (!isRecord(cursor)) return fallback;
    cursor = cursor[key];
  }

  return typeof cursor === "boolean" ? cursor : fallback;
};

const setBrandingPath = (
  branding: BrandingSection,
  path: string[],
  value: string | boolean
) => {
  const next = { ...branding } as Record<string, unknown>;
  let cursor = next;

  path.slice(0, -1).forEach((key) => {
    const current = cursor[key];
    const nested = isRecord(current) ? { ...current } : {};
    cursor[key] = nested;
    cursor = nested;
  });

  cursor[path[path.length - 1]] = value;

  return next as BrandingSection;
};

type BrandingControlProps = {
  description?: string;
  label: string;
};

type ColorControlProps = BrandingControlProps & {
  onChange: (value: string) => void;
  value: string;
};

function ColorControl({
  description,
  label,
  onChange,
  value,
}: ColorControlProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-950">{label}</p>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
          ) : null}
        </div>
        <input
          aria-label={label}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
        />
      </div>
      <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3">
        <span
          aria-hidden="true"
          className="h-6 w-6 rounded-lg border border-black/10 shadow-inner"
          style={{ backgroundColor: value }}
        />
        <Input
          aria-label={`${label} hex value`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 border-0 bg-transparent px-0 font-mono text-sm shadow-none focus:ring-0"
        />
      </div>
    </div>
  );
}

type SelectControlProps = BrandingControlProps & {
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
};

function SelectControl({
  description,
  label,
  onChange,
  options,
  value,
}: SelectControlProps) {
  return (
    <label className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <span className="block text-sm font-semibold text-gray-950">{label}</span>
      {description ? (
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {description}
        </span>
      ) : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextControlProps = BrandingControlProps & {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

function TextControl({
  description,
  label,
  onChange,
  placeholder,
  value,
}: TextControlProps) {
  return (
    <label className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <span className="block text-sm font-semibold text-gray-950">{label}</span>
      {description ? (
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {description}
        </span>
      ) : null}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 h-11 rounded-xl border-gray-200 bg-gray-50 text-sm"
      />
    </label>
  );
}

type ToggleControlProps = BrandingControlProps & {
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleControl({
  checked,
  description,
  label,
  onChange,
}: ToggleControlProps) {
  return (
    <label className="flex min-h-[92px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:border-primary/30">
      <span>
        <span className="block text-sm font-semibold text-gray-950">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-gray-500">
            {description}
          </span>
        ) : null}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

type AdvancedPanelProps = {
  children: ReactNode;
  icon: ReactNode;
  summary: string;
  title: string;
};

function AdvancedPanel({ children, icon, summary, title }: AdvancedPanelProps) {
  return (
    <Collapsible className="rounded-2xl border border-gray-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-950">
              {title}
            </span>
            <span className="mt-1 block text-xs text-gray-500">{summary}</span>
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-gray-100 px-5 pb-5 pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function TenantInfoStep({
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
  const translatedTenantSchema = useMemo(() => {
    return createTenantSchema(validationMessages);
  }, [validationMessages]);
  const translatedRestaurantSchema = useMemo(() => {
    return createRestaurantSchema(validationMessages);
  }, [validationMessages]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenantSameAsOwner, setTenantSameAsOwner] = useState(false);
const { uploadFile, uploading, progress } = useFileUpload();
  const branding = formData.restaurant.branding;

  const updateBranding = (path: string[], value: string | boolean) => {
    updateFormData("restaurant", {
      branding: setBrandingPath(branding, path, value),
    });
  };

  const updateBrandingMany = (
    updates: Array<{ path: string[]; value: string | boolean }>
  ) => {
    const nextBranding = updates.reduce((next, update) => {
      return setBrandingPath(next, update.path, update.value);
    }, branding);

    updateFormData("restaurant", {
      branding: nextBranding,
    });
  };

  const getBrandingString = (path: string[], fallback: string) => {
    return readBrandingValue(branding, path, fallback);
  };

  const getBrandingBoolean = (path: string[], fallback: boolean) => {
    return readBrandingBoolean(branding, path, fallback);
  };

const MAX_LOGO_IMAGE_SIZE_MB = 2;
const MAX_LOGO_IMAGE_SIZE_BYTES = MAX_LOGO_IMAGE_SIZE_MB * 1024 * 1024;

const scrollToInput = (input: HTMLInputElement | null) => {
  input?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  window.setTimeout(() => input?.focus(), 250);
};

const getOwnerDisplayName = () => {
  return [formData.user?.firstName, formData.user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

useEffect(() => {
  if (!tenantSameAsOwner) return;

  const ownerName = getOwnerDisplayName();

  updateFormData("tenant", {
    name: ownerName,
    logoPreviewUrl: formData.user?.profilePreviewUrl || "",
    logoUrl: formData.user?.profileUrl || "",
  });
  setErrors((prev) => {
    const updated = { ...prev };
    delete updated["tenant.name"];
    return updated;
  });
  // updateFormData is provided by the parent form and intentionally omitted to avoid a copy loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  tenantSameAsOwner,
  formData.user?.firstName,
  formData.user?.lastName,
  formData.user?.profilePreviewUrl,
  formData.user?.profileUrl,
]);
  /* ---------------- REFS FOR UX ---------------- */

  const refs: Record<string, RefObject<HTMLInputElement | null>> = {
    tenantName: useRef<HTMLInputElement>(null),
    tenantBio: useRef<HTMLInputElement>(null),

    restaurantName: useRef<HTMLInputElement>(null),
    tagline: useRef<HTMLInputElement>(null),

    supportEmail: useRef<HTMLInputElement>(null),
    supportPhone: useRef<HTMLInputElement>(null),
    supportWhatsapp: useRef<HTMLInputElement>(null),

    primaryColor: useRef<HTMLInputElement>(null),
    secondaryColor: useRef<HTMLInputElement>(null),
    accentColor: useRef<HTMLInputElement>(null),
    backgroundColor: useRef<HTMLInputElement>(null),
    textColor: useRef<HTMLInputElement>(null),
    borderRadius: useRef<HTMLInputElement>(null),
  };

  /* ---------------- ERROR HELPERS ---------------- */

  const clearError = (field: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validateField = (schema: ZodTypeAny, data: unknown, path: string) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path.join(".") === path
      );

      if (issue) {
        setErrors((prev) => ({
          ...prev,
          [path]: issue.message,
        }));
      }
    }
  };

  /* ---------------- FILE HANDLERS ---------------- */
const handleTenantLogoSelect = async (file: File) => {
  if (!file) return;

  if (file.size > MAX_LOGO_IMAGE_SIZE_BYTES) {
    setErrors((prev) => ({
      ...prev,
      "tenant.logoFile": tValidation("register.tenantLogoMaxSize", {
        size: MAX_LOGO_IMAGE_SIZE_MB,
      }),
      "tenant.logoUrl": tValidation("register.tenantLogoMaxSize", {
        size: MAX_LOGO_IMAGE_SIZE_MB,
      }),
    }));

    updateFormData("tenant", {
      logoFile: null,
      logoPreviewUrl: "",
      logoUrl: "",
    });

    return;
  }

  const blobUrl = URL.createObjectURL(file);

  updateFormData("tenant", {
    logoFile: file,
    logoPreviewUrl: blobUrl,
  });

  setErrors((prev) => {
    const updated = { ...prev };
    delete updated["tenant.logoUrl"];
    delete updated["tenant.logoFile"];
    return updated;
  });

  const res = await uploadFile(file);

  if (res?.fileUrl) {
    updateFormData("tenant", {
      logoUrl: res.fileUrl,
    });
  }
};


const handleRestaurantLogoSelect = async (file: File) => {
  if (!file) return;

  if (file.size > MAX_LOGO_IMAGE_SIZE_BYTES) {
    setErrors((prev) => ({
      ...prev,
      "restaurant.logoFile": tValidation("register.restaurantLogoMaxSize", {
        size: MAX_LOGO_IMAGE_SIZE_MB,
      }),
      "restaurant.logoUrl": tValidation("register.restaurantLogoMaxSize", {
        size: MAX_LOGO_IMAGE_SIZE_MB,
      }),
    }));

    updateFormData("restaurant", {
      logoFile: null,
      logoPreviewUrl: "",
      logoUrl: "",
    });

    return;
  }

  const blobUrl = URL.createObjectURL(file);

  updateFormData("restaurant", {
    logoFile: file,
    logoPreviewUrl: blobUrl,
  });

  setErrors((prev) => {
    const updated = { ...prev };
    delete updated["restaurant.logoUrl"];
    delete updated["restaurant.logoFile"];
    return updated;
  });

  const res = await uploadFile(file);

  if (res?.fileUrl) {
    updateFormData("restaurant", {
      logoUrl: res.fileUrl,
    });
  }
};

  /* ---------------- NEXT VALIDATION ---------------- */

  const handleNext = () => {
    const tenant = validateZod(
      translatedTenantSchema,
      formData.tenant,
      "tenant"
    );
    const restaurant = validateZod(
      translatedRestaurantSchema,
      formData.restaurant,
      "restaurant"
    );

    const mergedErrors = {
      ...tenant.errors,
      ...restaurant.errors,
    };

    if (Object.keys(mergedErrors).length > 0) {
      setErrors(mergedErrors);

      const firstError = Object.keys(mergedErrors)[0];

      const focusMap: Record<string, RefObject<HTMLInputElement | null>> = {
        "tenant.name": refs.tenantName,
        "tenant.bio": refs.tenantBio,

        "restaurant.name": refs.restaurantName,
        "restaurant.tagline": refs.tagline,

        "restaurant.supportContact.email": refs.supportEmail,
        "restaurant.supportContact.phone": refs.supportPhone,
        "restaurant.supportContact.whatsapp": refs.supportWhatsapp,

        "restaurant.branding.primaryColor": refs.primaryColor,
        "restaurant.branding.secondaryColor": refs.secondaryColor,
        "restaurant.branding.accentColor": refs.accentColor,
        "restaurant.branding.backgroundColor": refs.backgroundColor,
        "restaurant.branding.textColor": refs.textColor,
        "restaurant.branding.borderRadius": refs.borderRadius,
      };

      scrollToInput(focusMap[firstError]?.current || null);

      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      {/* Tenant Info */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">
            {tRegister("tenant.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {tRegister("tenant.sameAsOwner.description")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:min-w-[280px]">
          <span className="text-sm font-medium text-gray-800">
            {tRegister("tenant.sameAsOwner.label")}
          </span>
          <Switch
            checked={tenantSameAsOwner}
            onCheckedChange={setTenantSameAsOwner}
            aria-label={tRegister("tenant.sameAsOwner.label")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <FormInput
            ref={refs.tenantName}
            label={tRegister("fields.tenantName.requiredLabel")}
            placeholder="Indus Foods Group"
            value={formData.tenant.name || ""}
            onChange={(val: string) => {
              setTenantSameAsOwner(false);
              updateFormData("tenant", { name: val });
              clearError("tenant.name");
            }}
            onBlur={() =>
              validateField(translatedTenantSchema, formData.tenant, "name")
            }
          />
          {errors["tenant.name"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["tenant.name"]}
            </p>
          )}
        </div>

        {/* Tenant Logo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {tRegister("tenant.logo.label")}
          </label>

          <PremiumImageDropzone
            alt="tenant logo preview"
            helperText={tRegister("upload.helper2Mb")}
            label={tRegister("tenant.logo.label")}
            onFileSelect={handleTenantLogoSelect}
            progress={progress}
            selectedText={tRegister("upload.imageSelected")}
            uploadText={tRegister("upload.uploading")}
            uploading={uploading}
            uploadTextIdle={tRegister("upload.chooseFile")}
            value={formData.tenant.logoPreviewUrl || formData.tenant.logoUrl}
          />

       {(errors["tenant.logoFile"] || errors["tenant.logoUrl"]) && (
  <p className="text-red-500 text-xs">
    {errors["tenant.logoFile"] || errors["tenant.logoUrl"]}
  </p>
)}
        </div>

        <div className="sm:col-span-2">
          <FormInput
            ref={refs.tenantBio}
            label={tRegister("fields.tenantBio.optionalLabel")}
            placeholder="Leading hospitality group in South Asia."
            value={formData.tenant.bio || ""}
            onChange={(val: string) => {
              updateFormData("tenant", { bio: val });
              clearError("tenant.bio");
            }}
            onBlur={() =>
              validateField(translatedTenantSchema, formData.tenant, "bio")
            }
          />
          {errors["tenant.bio"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["tenant.bio"]}
            </p>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("restaurant.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <FormInput
            ref={refs.restaurantName}
            label={tRegister("fields.restaurantName.requiredLabel")}
            placeholder="KFC Pakistan"
            value={formData.restaurant.name || ""}
          onChange={(val: string) => {
            updateFormData("restaurant", { name: val });
            clearError("restaurant.name");
          }}
            onBlur={() =>
              validateField(
                translatedRestaurantSchema,
                formData.restaurant,
                "name"
              )
            }
          />
          {errors["restaurant.name"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.name"]}
            </p>
          )}
        </div>

        {/* Restaurant Logo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {tRegister("restaurant.logo.label")}
          </label>

          <PremiumImageDropzone
            alt="restaurant logo preview"
            helperText={tRegister("upload.helper2Mb")}
            label={tRegister("restaurant.logo.label")}
            onFileSelect={handleRestaurantLogoSelect}
            progress={progress}
            selectedText={tRegister("upload.imageSelected")}
            uploadText={tRegister("upload.uploading")}
            uploading={uploading}
            uploadTextIdle={tRegister("upload.chooseFile")}
            value={
              formData.restaurant.logoPreviewUrl || formData.restaurant.logoUrl
            }
          />

        {(errors["restaurant.logoFile"] || errors["restaurant.logoUrl"]) && (
  <p className="text-red-500 text-xs">
    {errors["restaurant.logoFile"] || errors["restaurant.logoUrl"]}
  </p>
)}
        </div>

        <div>
          <FormInput
            ref={refs.tagline}
            label={tRegister("fields.tagline.optionalLabel")}
            placeholder="It's Finger Lickin' Good"
            value={formData.restaurant.tagline || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", { tagline: val });
              clearError("restaurant.tagline");
            }}
            onBlur={() =>
              validateField(
                translatedRestaurantSchema,
                formData.restaurant,
                "tagline"
              )
            }
          />
          {errors["restaurant.tagline"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.tagline"]}
            </p>
          )}
        </div>
      </div>

      {/* Support Contact */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("support.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <FormInput
            ref={refs.supportEmail}
            label={tRegister("fields.supportEmail.optionalLabel")}
            placeholder="support@kfc.com.pk"
            value={formData.restaurant.supportContact.email || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                supportContact: {
                  ...formData.restaurant.supportContact,
                  email: val,
                },
              });
              clearError("restaurant.supportContact.email");
            }}
          />
          {errors["restaurant.supportContact.email"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.supportContact.email"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.supportPhone}
            label={tRegister("fields.supportPhone.optionalLabel")}
            placeholder="111-532-532"
            value={formData.restaurant.supportContact.phone || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                supportContact: {
                  ...formData.restaurant.supportContact,
                  phone: val,
                },
              });
              clearError("restaurant.supportContact.phone");
            }}
          />
          {errors["restaurant.supportContact.phone"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.supportContact.phone"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.supportWhatsapp}
            label={tRegister("fields.supportWhatsapp.optionalLabel")}
            placeholder="+923000000000"
            value={formData.restaurant.supportContact.whatsapp || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                supportContact: {
                  ...formData.restaurant.supportContact,
                  whatsapp: val,
                },
              });
              clearError("restaurant.supportContact.whatsapp");
            }}
          />
          {errors["restaurant.supportContact.whatsapp"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.supportContact.whatsapp"]}
            </p>
          )}
        </div>
      </div>

      {/* Branding */}
      <section className="mb-8 overflow-hidden rounded-[28px] border border-gray-100 bg-gradient-to-br from-white via-[#fff7f7] to-white shadow-[0_24px_70px_rgba(193,0,10,0.08)]">
        <div className="grid gap-6 border-b border-white/70 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <Palette className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-[22px] font-semibold text-gray-950">
                  {tRegister("branding.title")}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Admin-panel branding defaults are prefilled. Open advanced groups
                  only when you want deeper control.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Primary",
                  value: getBrandingString(["primaryColor"], "#c1000a"),
                },
                {
                  label: "Accent",
                  value: getBrandingString(["accentColor"], "#F59E0B"),
                },
                {
                  label: "Background",
                  value: getBrandingString(["backgroundColor"], "#F5F5F5"),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm"
                >
                  <span
                    className="mb-3 block h-9 rounded-xl border border-black/10"
                    style={{ backgroundColor: item.value }}
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            style={{
              color: getBrandingString(["textColor"], "#030401"),
              fontFamily: getBrandingString(["fontFamily"], DEFAULT_FONT_FAMILY),
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-12 w-12 rounded-2xl"
                style={{
                  backgroundColor: getBrandingString(
                    ["primaryColor"],
                    "#c1000a"
                  ),
                }}
              />
              <div>
                <p className="text-lg font-bold">
                  {formData.restaurant.name || "Restaurant preview"}
                </p>
                <p className="text-xs text-gray-500">
                  {formData.restaurant.tagline ||
                    "A branded storefront preview for customers."}
                </p>
              </div>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: getBrandingString(
                  ["backgroundColor"],
                  "#F5F5F5"
                ),
                borderRadius: getBrandingString(["borderRadius"], "12px"),
              }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                Storefront sample
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white"
                  style={{
                    backgroundColor: getBrandingString(
                      ["primaryColor"],
                      "#c1000a"
                    ),
                  }}
                >
                  Featured
                </span>
                <span
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white"
                  style={{
                    backgroundColor: getBrandingString(
                      ["accentColor"],
                      "#F59E0B"
                    ),
                  }}
                >
                  New
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ColorControl
              description="Buttons, active states, and checkout highlights."
              label="Primary Brand Color"
              value={getBrandingString(["primaryColor"], "#c1000a")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["primaryColor"], value },
                  { path: ["theme", "primaryColor"], value },
                  { path: ["app", "splashColor"], value },
                  { path: ["checkout", "highlightColor"], value },
                  { path: ["checkout", "errorColor"], value },
                ]);
                clearError("restaurant.branding.primaryColor");
              }}
            />
            <ColorControl
              description="Supporting typography and dark accents."
              label="Secondary Color"
              value={getBrandingString(["secondaryColor"], "#030401")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["secondaryColor"], value },
                  { path: ["theme", "secondaryColor"], value },
                  { path: ["app", "statusBarColor"], value },
                ]);
                clearError("restaurant.branding.secondaryColor");
              }}
            />
            <ColorControl
              description="Badges, promos, warnings, and secondary CTAs."
              label="Accent Color"
              value={getBrandingString(["accentColor"], "#F59E0B")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["accentColor"], value },
                  { path: ["theme", "accentColor"], value },
                  { path: ["checkout", "warningColor"], value },
                ]);
                clearError("restaurant.branding.accentColor");
              }}
            />
            <ColorControl
              description="Default storefront and app background."
              label="Background Color"
              value={getBrandingString(["backgroundColor"], "#F5F5F5")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["backgroundColor"], value },
                  { path: ["theme", "backgroundColor"], value },
                  { path: ["app", "bottomNavColor"], value },
                ]);
                clearError("restaurant.branding.backgroundColor");
              }}
            />
            <ColorControl
              description="Readable body text color for light theme."
              label="Text Color"
              value={getBrandingString(["textColor"], "#030401")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["textColor"], value },
                  { path: ["theme", "textColor"], value },
                ]);
                clearError("restaurant.branding.textColor");
              }}
            />
            <TextControl
              description="Use px values like 12px to match admin defaults."
              label="Border Radius"
              placeholder="12px"
              value={getBrandingString(["borderRadius"], "12px")}
              onChange={(value) => {
                updateBrandingMany([
                  { path: ["borderRadius"], value },
                  { path: ["theme", "borderRadius"], value },
                ]);
                clearError("restaurant.branding.borderRadius");
              }}
            />
          </div>

          <AdvancedPanel
            icon={<Sparkles className="h-5 w-5" />}
            summary="Open this panel to tune typography, dark theme, app, checkout, and brand assets."
            title="Advanced Branding Options"
          >
            <div className="space-y-5">
              <section className="rounded-2xl border border-white bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Type className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Typography & Layout
                    </h3>
                    <p className="text-xs text-gray-500">
                      Font families, button style, and card/list rendering.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <SelectControl
                    description="Body font used across storefront surfaces."
                    label="Body Font Family"
                    options={FONT_OPTIONS}
                    value={getBrandingString(["fontFamily"], DEFAULT_FONT_FAMILY)}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["fontFamily"], value },
                        { path: ["theme", "fontFamily"], value },
                      ]);
                    }}
                  />
                  <SelectControl
                    description="Heading font for storefront titles."
                    label="Heading Font Family"
                    options={FONT_OPTIONS}
                    value={getBrandingString(
                      ["headingFontFamily"],
                      DEFAULT_FONT_FAMILY
                    )}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["headingFontFamily"], value },
                        { path: ["theme", "headingFontFamily"], value },
                      ]);
                    }}
                  />
                  <SelectControl
                    description="Primary button shape preference."
                    label="Button Style"
                    options={BUTTON_STYLE_OPTIONS}
                    value={getBrandingString(["buttonStyle"], "rounded")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["buttonStyle"], value },
                        { path: ["theme", "buttonStyle"], value },
                      ]);
                    }}
                  />
                  <SelectControl
                    description="Default storefront color mode."
                    label="Theme Mode"
                    options={THEME_MODE_OPTIONS}
                    value={getBrandingString(["theme", "mode"], "light")}
                    onChange={(value) => updateBranding(["theme", "mode"], value)}
                  />
                  <SelectControl
                    description="Main storefront landing layout."
                    label="Home Layout"
                    options={HOME_LAYOUT_OPTIONS}
                    value={getBrandingString(["theme", "homeLayout"], "hero")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["theme", "homeLayout"], value },
                        { path: ["app", "homeLayout"], value },
                      ]);
                    }}
                  />
                  <SelectControl
                    description="Menu item presentation style."
                    label="Menu Card Style"
                    options={MENU_CARD_STYLE_OPTIONS}
                    value={getBrandingString(["theme", "menuCardStyle"], "image-top")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["theme", "menuCardStyle"], value },
                        { path: ["app", "menuCardStyle"], value },
                      ]);
                    }}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Dark Theme Palette
                    </h3>
                    <p className="text-xs text-gray-500">
                      Colors for system/dark mode and alternate storefront contrast.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ColorControl
                    label="Dark Primary Brand Color"
                    value={getBrandingString(["dark", "primaryColor"], "#FF4D57")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["dark", "primaryColor"], value },
                        { path: ["theme", "dark", "primaryColor"], value },
                      ]);
                    }}
                  />
                  <ColorControl
                    label="Dark Secondary Color"
                    value={getBrandingString(["dark", "secondaryColor"], "#F5F5F5")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["dark", "secondaryColor"], value },
                        { path: ["theme", "dark", "secondaryColor"], value },
                      ]);
                    }}
                  />
                  <ColorControl
                    label="Dark Accent Color"
                    value={getBrandingString(["dark", "accentColor"], "#FBBF24")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["dark", "accentColor"], value },
                        { path: ["theme", "dark", "accentColor"], value },
                      ]);
                    }}
                  />
                  <ColorControl
                    label="Dark Background Color"
                    value={getBrandingString(["dark", "backgroundColor"], "#030401")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["dark", "backgroundColor"], value },
                        { path: ["theme", "dark", "backgroundColor"], value },
                      ]);
                    }}
                  />
                  <ColorControl
                    label="Dark Text Color"
                    value={getBrandingString(["dark", "textColor"], "#F5F5F5")}
                    onChange={(value) => {
                      updateBrandingMany([
                        { path: ["dark", "textColor"], value },
                        { path: ["theme", "dark", "textColor"], value },
                      ]);
                    }}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Smartphone className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      App & Checkout
                    </h3>
                    <p className="text-xs text-gray-500">
                      Configure storefront behavior, labels, and checkout visuals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ToggleControl
                    checked={getBrandingBoolean(["app", "showTagline"], true)}
                    description="Show restaurant tagline in app/storefront."
                    label="Show Tagline"
                    onChange={(value) =>
                      updateBranding(["app", "showTagline"], value)
                    }
                  />
                  <ToggleControl
                    checked={getBrandingBoolean(["app", "showHeroBanner"], true)}
                    description="Show hero banner on customer home."
                    label="Show Hero Banner"
                    onChange={(value) =>
                      updateBranding(["app", "showHeroBanner"], value)
                    }
                  />
                  <ColorControl
                    label="App Splash Color"
                    value={getBrandingString(["app", "splashColor"], "#c1000a")}
                    onChange={(value) => updateBranding(["app", "splashColor"], value)}
                  />
                  <ColorControl
                    label="Status Bar Color"
                    value={getBrandingString(["app", "statusBarColor"], "#030401")}
                    onChange={(value) =>
                      updateBranding(["app", "statusBarColor"], value)
                    }
                  />
                  <ColorControl
                    label="Bottom Nav Color"
                    value={getBrandingString(["app", "bottomNavColor"], "#F5F5F5")}
                    onChange={(value) =>
                      updateBranding(["app", "bottomNavColor"], value)
                    }
                  />
                  <ToggleControl
                    checked={getBrandingBoolean(["checkout", "showLogo"], true)}
                    description="Show brand logo during checkout."
                    label="Checkout Logo"
                    onChange={(value) =>
                      updateBranding(["checkout", "showLogo"], value)
                    }
                  />
                  <ToggleControl
                    checked={getBrandingBoolean(
                      ["checkout", "showSupportContact"],
                      true
                    )}
                    description="Show support contact during checkout."
                    label="Checkout Support Contact"
                    onChange={(value) =>
                      updateBranding(["checkout", "showSupportContact"], value)
                    }
                  />
                  <TextControl
                    description="Message shown after a successful order."
                    label="Checkout Success Message"
                    placeholder="Thank you for ordering with us."
                    value={getBrandingString(
                      ["checkout", "successMessage"],
                      "Thank you for ordering with us."
                    )}
                    onChange={(value) =>
                      updateBranding(["checkout", "successMessage"], value)
                    }
                  />
                  <ColorControl
                    label="Checkout Highlight Color"
                    value={getBrandingString(
                      ["checkout", "highlightColor"],
                      "#c1000a"
                    )}
                    onChange={(value) =>
                      updateBranding(["checkout", "highlightColor"], value)
                    }
                  />
                  <ColorControl
                    label="Checkout Success Color"
                    value={getBrandingString(["checkout", "successColor"], "#00A63E")}
                    onChange={(value) =>
                      updateBranding(["checkout", "successColor"], value)
                    }
                  />
                  <ColorControl
                    label="Checkout Warning Color"
                    value={getBrandingString(["checkout", "warningColor"], "#F59E0B")}
                    onChange={(value) =>
                      updateBranding(["checkout", "warningColor"], value)
                    }
                  />
                  <ColorControl
                    label="Checkout Error Color"
                    value={getBrandingString(["checkout", "errorColor"], "#c1000a")}
                    onChange={(value) =>
                      updateBranding(["checkout", "errorColor"], value)
                    }
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ImageIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Brand Assets
                    </h3>
                    <p className="text-xs text-gray-500">
                      Add brand assets and logos for complete storefront branding.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextControl
                    label="Restaurant Logo URL"
                    placeholder="https://cdn.example.com/logo.png"
                    value={getBrandingString(["assets", "logoUrl"], "")}
                    onChange={(value) => updateBranding(["assets", "logoUrl"], value)}
                  />
                  <TextControl
                    label="Cover Image URL"
                    placeholder="https://cdn.example.com/cover.png"
                    value={getBrandingString(["assets", "coverImage"], "")}
                    onChange={(value) =>
                      updateBranding(["assets", "coverImage"], value)
                    }
                  />
                  <TextControl
                    label="Hero Banner URL"
                    placeholder="https://cdn.example.com/hero.png"
                    value={getBrandingString(["assets", "heroBannerUrl"], "")}
                    onChange={(value) =>
                      updateBranding(["assets", "heroBannerUrl"], value)
                    }
                  />
                  <TextControl
                    label="Placeholder Image URL"
                    placeholder="https://cdn.example.com/placeholder.png"
                    value={getBrandingString(["assets", "placeholderImage"], "")}
                    onChange={(value) =>
                      updateBranding(["assets", "placeholderImage"], value)
                    }
                  />
                  <TextControl
                    label="Favicon URL"
                    placeholder="/favicon.ico"
                    value={getBrandingString(["assets", "faviconUrl"], "")}
                    onChange={(value) =>
                      updateBranding(["assets", "faviconUrl"], value)
                    }
                  />
                  <TextControl
                    label="Primary Logo URL"
                    placeholder="https://cdn.example.com/logo-primary.png"
                    value={getBrandingString(
                      ["assets", "logos", "primaryLogoUrl"],
                      ""
                    )}
                    onChange={(value) =>
                      updateBranding(["assets", "logos", "primaryLogoUrl"], value)
                    }
                  />
                  <TextControl
                    label="Compact Logo URL"
                    placeholder="https://cdn.example.com/logo-compact.png"
                    value={getBrandingString(
                      ["assets", "logos", "compactLogoUrl"],
                      ""
                    )}
                    onChange={(value) =>
                      updateBranding(["assets", "logos", "compactLogoUrl"], value)
                    }
                  />
                  <TextControl
                    label="Asset Favicon URL"
                    placeholder="/favicon.ico"
                    value={getBrandingString(["assets", "logos", "faviconUrl"], "")}
                    onChange={(value) =>
                      updateBranding(["assets", "logos", "faviconUrl"], value)
                    }
                  />
                  <TextControl
                    label="Logo for Light Backgrounds"
                    placeholder="https://cdn.example.com/logo-light.png"
                    value={getBrandingString(["logo", "light"], "")}
                    onChange={(value) => updateBranding(["logo", "light"], value)}
                  />
                  <TextControl
                    label="Logo for Dark Backgrounds"
                    placeholder="https://cdn.example.com/logo-dark.png"
                    value={getBrandingString(["logo", "dark"], "")}
                    onChange={(value) => updateBranding(["logo", "dark"], value)}
                  />
                </div>
              </section>
            </div>
          </AdvancedPanel>
        </div>
      </section>

      {/* Footer */}
      <div className="flex justify-between mt-10">
        <Button
          onClick={back}
          className="bg-gray-300 hover:bg-gray-400 px-6 py-2.5 rounded-[10px]"
        >
          {tCommon("actions.back")}
        </Button>

    <Button
  onClick={handleNext}
  disabled={uploading}
  className="bg-primary hover:bg-red-800 px-6 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
>
  {uploading ? tRegister("upload.uploading") : tCommon("actions.saveContinue")}
</Button>
      </div>
    </div>
  );
}
