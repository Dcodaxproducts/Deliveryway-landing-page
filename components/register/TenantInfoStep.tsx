"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { FormInput } from "./form/FormInput";
import { validateZod } from "@/hooks/useZodValidator";
import {
  createRegisterValidationMessages,
  createRestaurantSchema,
  createTenantSchema,
} from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
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

type RestaurantSection = {
  branding: {
    accentColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
    buttonStyle?: string;
    fontFamily?: string;
    headingFontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  };
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
const handleTenantLogoChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_LOGO_IMAGE_SIZE_BYTES) {
    e.target.value = "";

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

  const res = await uploadFile(e);

  if (res?.fileUrl) {
    updateFormData("tenant", {
      logoUrl: res.fileUrl,
    });
  }
};


const handleRestaurantLogoChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_LOGO_IMAGE_SIZE_BYTES) {
    e.target.value = "";

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

  const res = await uploadFile(e);

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

          <label className="flex items-center gap-4 cursor-pointer rounded-lg hover:bg-gray-50 transition">
         <div className="relative w-14 h-14">
  {uploading && (
    <div className="absolute inset-0 rounded-lg bg-gray-200 animate-pulse" />
  )}

  {formData.tenant.logoPreviewUrl ? (
    <img
      src={formData.tenant.logoPreviewUrl}
      alt="tenant logo preview"
      className="w-14 h-14 rounded-lg object-cover border"
    />
  ) : (
    <div className="w-14 h-14 border border-[#909090] rounded-lg flex items-center justify-center">
      <Upload className="text-[#909090]" />
    </div>
  )}

  {uploading && formData.tenant.logoPreviewUrl && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
      <span className="text-white text-xs font-semibold">{progress}%</span>
    </div>
  )}
</div>

<div>
  <p className="text-sm font-medium">
    {uploading
      ? tRegister("upload.uploading")
      : formData.tenant.logoPreviewUrl
      ? tRegister("upload.imageSelected")
      : tRegister("upload.chooseFile")}
  </p>
  <p className="text-xs text-[#909090]">
    {tRegister("upload.helper2Mb")}
  </p>
</div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleTenantLogoChange}
            />
          </label>

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

          <label className="flex items-center gap-4 cursor-pointer rounded-lg hover:bg-gray-50 transition">
           <div className="relative w-14 h-14">
  {uploading && (
    <div className="absolute inset-0 rounded-lg bg-gray-200 animate-pulse" />
  )}

  {formData.restaurant.logoPreviewUrl ? (
    <img
      src={formData.restaurant.logoPreviewUrl}
      alt="restaurant logo preview"
      className="w-14 h-14 rounded-lg object-cover border"
    />
  ) : (
    <div className="w-14 h-14 border border-[#909090] rounded-lg flex items-center justify-center">
      <Upload className="text-[#909090]" />
    </div>
  )}

  {uploading && formData.restaurant.logoPreviewUrl && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
      <span className="text-white text-xs font-semibold">{progress}%</span>
    </div>
  )}
</div>

<div>
  <p className="text-sm font-medium">
    {uploading
      ? tRegister("upload.uploading")
      : formData.restaurant.logoPreviewUrl
      ? tRegister("upload.imageSelected")
      : tRegister("upload.chooseFile")}
  </p>
  <p className="text-xs text-[#909090]">
    {tRegister("upload.helper2Mb")}
  </p>
</div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleRestaurantLogoChange}
            />
          </label>

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
      <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <div className="mb-5">
          <h2 className="text-[20px] font-semibold text-gray-900">
            {tRegister("branding.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Premium theme defaults from the admin panel. Customize only what you need.
          </p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormInput
            ref={refs.primaryColor}
            type="color"
            label={tRegister("fields.primaryColor.optionalLabel")}
            placeholder="#e4002b"
            value={formData.restaurant.branding.primaryColor || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  primaryColor: val,
                },
              });
              clearError("restaurant.branding.primaryColor");
            }}
          />
          {errors["restaurant.branding.primaryColor"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.primaryColor"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.secondaryColor}
            type="color"
            label={tRegister("fields.secondaryColor.optionalLabel")}
            placeholder="#ffffff"
            value={formData.restaurant.branding.secondaryColor || ""}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  secondaryColor: val,
                },
              });
              clearError("restaurant.branding.secondaryColor");
            }}
          />
          {errors["restaurant.branding.secondaryColor"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.secondaryColor"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.accentColor}
            type="color"
            label="Accent Color (Optional)"
            placeholder="#F59E0B"
            value={formData.restaurant.branding.accentColor || "#F59E0B"}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  accentColor: val,
                },
              });
              clearError("restaurant.branding.accentColor");
            }}
          />
          {errors["restaurant.branding.accentColor"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.accentColor"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.backgroundColor}
            type="color"
            label="Background Color (Optional)"
            placeholder="#F5F5F5"
            value={formData.restaurant.branding.backgroundColor || "#F5F5F5"}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  backgroundColor: val,
                },
              });
              clearError("restaurant.branding.backgroundColor");
            }}
          />
          {errors["restaurant.branding.backgroundColor"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.backgroundColor"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.textColor}
            type="color"
            label="Text Color (Optional)"
            placeholder="#030401"
            value={formData.restaurant.branding.textColor || "#030401"}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  textColor: val,
                },
              });
              clearError("restaurant.branding.textColor");
            }}
          />
          {errors["restaurant.branding.textColor"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.textColor"]}
            </p>
          )}
        </div>

        <div>
          <FormInput
            ref={refs.borderRadius}
            label="Border Radius (Optional)"
            placeholder="12px"
            value={formData.restaurant.branding.borderRadius || "12px"}
            onChange={(val: string) => {
              updateFormData("restaurant", {
                branding: {
                  ...formData.restaurant.branding,
                  borderRadius: val,
                },
              });
              clearError("restaurant.branding.borderRadius");
            }}
          />
          {errors["restaurant.branding.borderRadius"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["restaurant.branding.borderRadius"]}
            </p>
          )}
        </div>
      </div>
      </div>

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
