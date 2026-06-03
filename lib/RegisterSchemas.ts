import { z } from "zod";

/* ---------------- FILE HELPERS ---------------- */

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"] as const;

const createRequiredImageSchema = (maxSizeInMB: number, requiredMessage: string) =>
  z
    .custom<File>((file) => file instanceof File, {
      message: requiredMessage,
    })
    .refine(
      (file) => file.size <= maxSizeInMB * 1024 * 1024,
      `File must be less than ${maxSizeInMB}MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
      "Only PNG, JPG, JPEG allowed"
    );

const createOptionalImageSchema = (maxSizeInMB: number) =>
  z
    .custom<File | undefined>((file) => file === undefined || file instanceof File, {
      message: "Invalid file",
    })
    .refine(
      (file) => !file || file.size <= maxSizeInMB * 1024 * 1024,
      `File must be less than ${maxSizeInMB}MB`
    )
    .refine(
      (file) =>
        !file ||
        ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
      "Only PNG, JPG, JPEG allowed"
    );

/* ---------------- FILE SCHEMAS ---------------- */

export const image2MB = createRequiredImageSchema(2, "File is required");
export const image1MB = createRequiredImageSchema(1, "Image is required");

export const image2MBOptional = createOptionalImageSchema(2);
export const image1MBOptional = createOptionalImageSchema(1);

/* ---------------- COMMON ---------------- */

const optionalString = z.string().optional().or(z.literal(""));

const requiredUploadedImageSchema = (fileSchema: z.ZodTypeAny, urlFieldLabel: string) =>
  z
    .object({
      file: fileSchema,
      url: optionalString,
      previewUrl: optionalString,
    })
    .superRefine((data, ctx) => {
      // valid if either a new file is selected OR an uploaded URL already exists
      if (!data.file && !data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: `${urlFieldLabel} is required`,
        });
      }
    });

/* ---------------- USER ---------------- */

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  profileUrl: optionalString,
  profilePreviewUrl: optionalString,
  profileFile: image2MBOptional.optional(),
});

/* ---------------- TENANT ---------------- */

export const tenantSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  bio: z.string().min(1, "Tenant bio is required"),

  logoUrl: optionalString,
  logoPreviewUrl: optionalString,
  logoFile: image2MBOptional.optional(),
});
/* ---------------- RESTAURANT ---------------- */

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),

  logoUrl: optionalString,
  logoPreviewUrl: optionalString,
  logoFile: image2MBOptional.optional(),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only"),

  tagline: z.string().min(1, "Tagline is required"),

  supportContact: z.object({
    email: z.string().min(1, "Support email is required").email("Invalid email"),
    phone: z.string().min(1, "Support phone is required"),
    whatsapp: z
      .string()
      .min(1, "WhatsApp number is required")
      .regex(/^\+?[0-9]{10,15}$/, "Invalid WhatsApp number"),
  }),

  branding: z.object({
    primaryColor: z
      .string()
      .min(1, "Primary color is required")
      .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Invalid hex color"),

    secondaryColor: z
      .string()
      .min(1, "Secondary color is required")
      .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Invalid hex color"),

    fontFamily: z.string().min(1, "Font family is required"),
  }),
});
/* ---------------- BRANCH ---------------- */

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),

  description: z.string().min(1, "Description is required"),

  coverImageUrl: optionalString,
  coverImagePreviewUrl: optionalString,
  coverImageFile: image1MBOptional.optional(),

  address: z.object({
    street: z.string().min(1, "Street is required"),
    area: z.string().min(1, "Area is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),

    lat: z
      .string()
      .min(1, "Latitude is required")
      .refine((val) => !isNaN(Number(val)), "Latitude must be a number"),

    lng: z
      .string()
      .min(1, "Longitude is required")
      .refine((val) => !isNaN(Number(val)), "Longitude must be a number"),
  }),

  settings: z.object({
    taxPercentage: z
      .number({ invalid_type_error: "Tax percentage required" })
      .min(0, "Invalid tax value"),

    minOrderAmount: z
      .number({ invalid_type_error: "Minimum order required" })
      .min(0, "Invalid amount"),

    radiusKm: z.coerce
      .number({ invalid_type_error: "Radius required" })
      .min(0, "Invalid radius"),

    estimatedPrepTime: z
      .number({ invalid_type_error: "Prep time required" })
      .min(0, "Invalid prep time"),
  }),
});
/* ---------------- TYPES ---------------- */

export type UserFormValues = z.infer<typeof userSchema>;
export type TenantFormValues = z.infer<typeof tenantSchema>;
export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export type BranchFormValues = z.infer<typeof branchSchema>;