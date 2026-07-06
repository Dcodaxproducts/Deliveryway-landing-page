import { z } from "zod";

/* ---------------- MESSAGES ---------------- */

type TranslationValues = Record<string, number | string>;

export type RegisterValidationTranslator = (
  key: string,
  values?: TranslationValues
) => string;

export type RegisterValidationMessages = {
  areaRequired: string;
  branchAdminEmailRequired: string;
  branchAdminFirstNameRequired: string;
  branchAdminLastNameRequired: string;
  branchAdminPasswordRequired: string;
  branchNameRequired: string;
  cityRequired: string;
  countryRequired: string;
  descriptionRequired: string;
  emailRequired: string;
  fileMaxSize: (size: number) => string;
  fileRequired: string;
  firstNameMin: string;
  firstNameRequired: string;
  fontFamilyRequired: string;
  imageRequired: string;
  imageTypes: string;
  invalidAmount: string;
  invalidEmail: string;
  invalidEmailFormat: string;
  invalidFile: string;
  invalidHexColor: string;
  invalidPhoneNumber: string;
  invalidPrepTime: string;
  invalidRadius: string;
  invalidTaxValue: string;
  invalidWhatsappNumber: string;
  lastNameMin: string;
  lastNameRequired: string;
  latitudeNumber: string;
  latitudeRequired: string;
  longitudeNumber: string;
  longitudeRequired: string;
  minOrderRequired: string;
  passwordMin: string;
  passwordRequired: string;
  phoneRequired: string;
  prepTimeRequired: string;
  primaryColorRequired: string;
  radiusRequired: string;
  restaurantNameRequired: string;
  secondaryColorRequired: string;
  slugInvalid: string;
  slugRequired: string;
  stateRequired: string;
  streetRequired: string;
  supportEmailRequired: string;
  supportPhoneRequired: string;
  taglineRequired: string;
  taxPercentageRequired: string;
  tenantBioRequired: string;
  tenantNameRequired: string;
  whatsappRequired: string;
};

export const DEFAULT_REGISTER_VALIDATION_MESSAGES: RegisterValidationMessages = {
  areaRequired: "Area is required",
  branchAdminEmailRequired: "Branch admin email is required",
  branchAdminFirstNameRequired: "Branch admin first name is required",
  branchAdminLastNameRequired: "Branch admin last name is required",
  branchAdminPasswordRequired: "Branch admin password is required",
  branchNameRequired: "Branch name is required",
  cityRequired: "City is required",
  countryRequired: "Country is required",
  descriptionRequired: "Description is required",
  emailRequired: "Email is required",
  fileMaxSize: (size) => `File must be less than ${size}MB`,
  fileRequired: "File is required",
  firstNameMin: "First name must be at least 2 characters",
  firstNameRequired: "First name is required",
  fontFamilyRequired: "Font family is required",
  imageRequired: "Image is required",
  imageTypes: "Only PNG, JPG, JPEG allowed",
  invalidAmount: "Invalid amount",
  invalidEmail: "Invalid email",
  invalidEmailFormat: "Invalid email format",
  invalidFile: "Invalid file",
  invalidHexColor: "Invalid hex color",
  invalidPhoneNumber: "Invalid phone number",
  invalidPrepTime: "Invalid prep time",
  invalidRadius: "Invalid radius",
  invalidTaxValue: "Invalid tax value",
  invalidWhatsappNumber: "Invalid WhatsApp number",
  lastNameMin: "Last name must be at least 2 characters",
  lastNameRequired: "Last name is required",
  latitudeNumber: "Latitude must be a number",
  latitudeRequired: "Latitude is required",
  longitudeNumber: "Longitude must be a number",
  longitudeRequired: "Longitude is required",
  minOrderRequired: "Minimum order required",
  passwordMin: "Password must be at least 8 characters",
  passwordRequired: "Password is required",
  phoneRequired: "Phone number is required",
  prepTimeRequired: "Prep time required",
  primaryColorRequired: "Primary color is required",
  radiusRequired: "Radius required",
  restaurantNameRequired: "Restaurant name is required",
  secondaryColorRequired: "Secondary color is required",
  slugInvalid: "Slug must contain lowercase letters, numbers, and hyphens only",
  slugRequired: "Slug is required",
  stateRequired: "State is required",
  streetRequired: "Street is required",
  supportEmailRequired: "Support email is required",
  supportPhoneRequired: "Support phone is required",
  taglineRequired: "Tagline is required",
  taxPercentageRequired: "Tax percentage required",
  tenantBioRequired: "Tenant bio is required",
  tenantNameRequired: "Tenant name is required",
  whatsappRequired: "WhatsApp number is required",
};

export const createRegisterValidationMessages = (
  t: RegisterValidationTranslator
): RegisterValidationMessages => ({
  areaRequired: t("register.areaRequired"),
  branchAdminEmailRequired: t("register.branchAdminEmailRequired"),
  branchAdminFirstNameRequired: t("register.branchAdminFirstNameRequired"),
  branchAdminLastNameRequired: t("register.branchAdminLastNameRequired"),
  branchAdminPasswordRequired: t("register.branchAdminPasswordRequired"),
  branchNameRequired: t("register.branchNameRequired"),
  cityRequired: t("register.cityRequired"),
  countryRequired: t("register.countryRequired"),
  descriptionRequired: t("register.descriptionRequired"),
  emailRequired: t("register.emailRequired"),
  fileMaxSize: (size) => t("register.fileMaxSize", { size }),
  fileRequired: t("register.fileRequired"),
  firstNameMin: t("register.firstNameMin"),
  firstNameRequired: t("register.firstNameRequired"),
  fontFamilyRequired: t("register.fontFamilyRequired"),
  imageRequired: t("register.imageRequired"),
  imageTypes: t("register.imageTypes"),
  invalidAmount: t("register.invalidAmount"),
  invalidEmail: t("register.invalidEmail"),
  invalidEmailFormat: t("register.invalidEmailFormat"),
  invalidFile: t("register.invalidFile"),
  invalidHexColor: t("register.invalidHexColor"),
  invalidPhoneNumber: t("register.invalidPhoneNumber"),
  invalidPrepTime: t("register.invalidPrepTime"),
  invalidRadius: t("register.invalidRadius"),
  invalidTaxValue: t("register.invalidTaxValue"),
  invalidWhatsappNumber: t("register.invalidWhatsappNumber"),
  lastNameMin: t("register.lastNameMin"),
  lastNameRequired: t("register.lastNameRequired"),
  latitudeNumber: t("register.latitudeNumber"),
  latitudeRequired: t("register.latitudeRequired"),
  longitudeNumber: t("register.longitudeNumber"),
  longitudeRequired: t("register.longitudeRequired"),
  minOrderRequired: t("register.minOrderRequired"),
  passwordMin: t("register.passwordMin"),
  passwordRequired: t("register.passwordRequired"),
  phoneRequired: t("register.phoneRequired"),
  prepTimeRequired: t("register.prepTimeRequired"),
  primaryColorRequired: t("register.primaryColorRequired"),
  radiusRequired: t("register.radiusRequired"),
  restaurantNameRequired: t("register.restaurantNameRequired"),
  secondaryColorRequired: t("register.secondaryColorRequired"),
  slugInvalid: t("register.slugInvalid"),
  slugRequired: t("register.slugRequired"),
  stateRequired: t("register.stateRequired"),
  streetRequired: t("register.streetRequired"),
  supportEmailRequired: t("register.supportEmailRequired"),
  supportPhoneRequired: t("register.supportPhoneRequired"),
  taglineRequired: t("register.taglineRequired"),
  taxPercentageRequired: t("register.taxPercentageRequired"),
  tenantBioRequired: t("register.tenantBioRequired"),
  tenantNameRequired: t("register.tenantNameRequired"),
  whatsappRequired: t("register.whatsappRequired"),
});

/* ---------------- FILE HELPERS ---------------- */

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"] as const;

const createRequiredImageSchema = (
  maxSizeInMB: number,
  requiredMessage: string,
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z
    .custom<File>((file) => file instanceof File, {
      message: requiredMessage,
    })
    .refine(
      (file) => file.size <= maxSizeInMB * 1024 * 1024,
      messages.fileMaxSize(maxSizeInMB)
    )
    .refine(
      (file) =>
        ACCEPTED_IMAGE_TYPES.includes(
          file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
        ),
      messages.imageTypes
    );

const createOptionalImageSchema = (
  maxSizeInMB: number,
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z
    .custom<File | undefined>((file) => file === undefined || file instanceof File, {
      message: messages.invalidFile,
    })
    .refine(
      (file) => !file || file.size <= maxSizeInMB * 1024 * 1024,
      messages.fileMaxSize(maxSizeInMB)
    )
    .refine(
      (file) =>
        !file ||
        ACCEPTED_IMAGE_TYPES.includes(
          file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
        ),
      messages.imageTypes
    );

/* ---------------- FILE SCHEMAS ---------------- */

export const image2MB = createRequiredImageSchema(
  20,
  DEFAULT_REGISTER_VALIDATION_MESSAGES.fileRequired
);
export const image1MB = createRequiredImageSchema(
  20,
  DEFAULT_REGISTER_VALIDATION_MESSAGES.imageRequired
);

export const image2MBOptional = createOptionalImageSchema(20);
export const image1MBOptional = createOptionalImageSchema(20);

/* ---------------- COMMON ---------------- */

const optionalString = z.string().optional().or(z.literal(""));

const requiredUploadedImageSchema = (
  fileSchema: z.ZodTypeAny,
  urlFieldLabel: string
) =>
  z
    .object({
      file: fileSchema,
      previewUrl: optionalString,
      url: optionalString,
    })
    .superRefine((data, ctx) => {
      // valid if either a new file is selected OR an uploaded URL already exists
      if (!data.file && !data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${urlFieldLabel} is required`,
          path: ["file"],
        });
      }
    });

void requiredUploadedImageSchema;

/* ---------------- USER ---------------- */

export const createUserSchema = (
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.invalidEmailFormat),

    firstName: z
      .string()
      .min(1, messages.firstNameRequired)
      .min(2, messages.firstNameMin),

    lastName: z
      .string()
      .min(1, messages.lastNameRequired)
      .min(2, messages.lastNameMin),

    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMin),

    phone: z
      .string()
      .min(1, messages.phoneRequired)
      .regex(/^\+?[0-9]{10,15}$/, messages.invalidPhoneNumber),

    profileFile: createOptionalImageSchema(2, messages).optional(),
    profilePreviewUrl: optionalString,
    profileUrl: optionalString,
  });

/* ---------------- TENANT ---------------- */

export const createTenantSchema = (
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z.object({
    bio: optionalString,
    logoFile: createOptionalImageSchema(2, messages).optional(),
    logoPreviewUrl: optionalString,
    logoUrl: optionalString,
    name: z.string().min(1, messages.tenantNameRequired),
  });

/* ---------------- RESTAURANT ---------------- */

export const createRestaurantSchema = (
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z.object({
    branding: z
      .object({
        accentColor: z
          .string()
          .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, messages.invalidHexColor)
          .optional()
          .or(z.literal("")),
        backgroundColor: z
          .string()
          .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, messages.invalidHexColor)
          .optional()
          .or(z.literal("")),
        borderRadius: optionalString,
        buttonStyle: optionalString,
        fontFamily: optionalString,
        headingFontFamily: optionalString,
        primaryColor: z
          .string()
          .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, messages.invalidHexColor)
          .optional()
          .or(z.literal("")),
        secondaryColor: z
          .string()
          .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, messages.invalidHexColor)
          .optional()
          .or(z.literal("")),
        textColor: z
          .string()
          .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, messages.invalidHexColor)
          .optional()
          .or(z.literal("")),
      })
      .optional(),

    logoFile: createOptionalImageSchema(2, messages).optional(),
    logoPreviewUrl: optionalString,
    logoUrl: optionalString,

    name: z.string().min(1, messages.restaurantNameRequired),

    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, messages.slugInvalid)
      .optional()
      .or(z.literal("")),

    supportContact: z.object({
      email: z
        .string()
        .email(messages.invalidEmail)
        .optional()
        .or(z.literal("")),
      phone: optionalString,
      whatsapp: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, messages.invalidWhatsappNumber)
        .optional()
        .or(z.literal("")),
    }),

    tagline: optionalString,
  });

/* ---------------- BRANCH ---------------- */

export const createSettingsSchema = (
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z.object({
    estimatedPrepTime: z
      .number({ invalid_type_error: messages.prepTimeRequired })
      .min(0, messages.invalidPrepTime),

    minOrderAmount: z
      .number({ invalid_type_error: messages.minOrderRequired })
      .min(0, messages.invalidAmount),

    radiusKm: z.coerce
      .number({ invalid_type_error: messages.radiusRequired })
      .min(0, messages.invalidRadius),

    taxPercentage: z
      .number({ invalid_type_error: messages.taxPercentageRequired })
      .min(0, messages.invalidTaxValue),
  });

export const createBranchSchema = (
  messages = DEFAULT_REGISTER_VALIDATION_MESSAGES
) =>
  z.object({
    address: z.object({
      city: z.string().min(1, messages.cityRequired),
      country: z.string().min(1, messages.countryRequired),
      houseNumber: optionalString,

      lat: z
        .string()
        .min(1, messages.latitudeRequired)
        .refine((value) => !Number.isNaN(Number(value)), messages.latitudeNumber),

      lng: z
        .string()
        .min(1, messages.longitudeRequired)
        .refine(
          (value) => !Number.isNaN(Number(value)),
          messages.longitudeNumber
        ),

      state: z.string().min(1, messages.stateRequired),
      street: z.string().min(1, messages.streetRequired),
      postalCode: optionalString,
    }),

    coverImageFile: createOptionalImageSchema(1, messages).optional(),
    coverImagePreviewUrl: optionalString,
    coverImageUrl: optionalString,

    description: optionalString,

    name: z.string().min(1, messages.branchNameRequired),

    settings: createSettingsSchema(messages),
  });

/* ---------------- DEFAULT SCHEMAS ---------------- */

export const userSchema = createUserSchema();
export const tenantSchema = createTenantSchema();
export const restaurantSchema = createRestaurantSchema();
export const branchSchema = createBranchSchema();

/* ---------------- TYPES ---------------- */

export type UserFormValues = z.infer<typeof userSchema>;
export type TenantFormValues = z.infer<typeof tenantSchema>;
export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export type BranchFormValues = z.infer<typeof branchSchema>;
