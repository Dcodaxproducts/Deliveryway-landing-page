"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { PremiumImageDropzone } from "./PremiumImageDropzone";
import { validateZod } from "@/hooks/useZodValidator";
import {
  createRegisterValidationMessages,
  createUserSchema,
} from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import { API_BASE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";

type UserFormSection = {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  profileFile?: File | null;
  profilePreviewUrl?: string;
  profileUrl?: string;
};

interface Props {
  formData: {
    user?: UserFormSection;
  };
  updateFormData: (section: string, data: Record<string, unknown>) => void;
  next: () => void;
}

type EmailCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

interface CheckEmailRoleResponse {
  success: boolean;
  data?: {
    exists: boolean;
    email: string;
    role: string;
  };
  message?: string;
}

const EMAIL_ROLE = "BUSINESS_ADMIN";
const EMAIL_DEBOUNCE_MS = 300;
const CHECK_EMAIL_ROLE_ENDPOINT = `${API_BASE_URL}/v1/auth/check-email-role`;

/**
 * Current backend sample:
 * exists: false => "Email is available for this role"
 *
 * So this file allows NEXT only when exists === false.
 * If your backend flow needs "existing email only", change this to true.
 */
const SHOULD_ALLOW_EXISTING_EMAIL = false;

const isValidEmailFormat = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function UserInfoStep({ formData, updateFormData, next }: Props) {
  const tCommon = useTranslations("common");
  const tRegister = useTranslations("register");
  const tValidation = useTranslations("validation");
  const validationMessages = useMemo(() => {
    return createRegisterValidationMessages(tValidation);
  }, [tValidation]);
  const translatedUserSchema = useMemo(() => {
    return createUserSchema(validationMessages);
  }, [validationMessages]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const [emailCheckStatus, setEmailCheckStatus] =
    useState<EmailCheckStatus>("idle");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [checkedEmail, setCheckedEmail] = useState("");

  const { uploadFile, uploading, progress } = useFileUpload();

  const user = formData.user || {};

  const normalizedEmail = useMemo(() => {
    return String(user.email || "").trim().toLowerCase();
  }, [user.email]);

  const emailLooksValid = useMemo(() => {
    return isValidEmailFormat(normalizedEmail);
  }, [normalizedEmail]);

  const isCurrentEmailVerified =
    emailCheckStatus === "available" && checkedEmail === normalizedEmail;

  const isEmailAvailabilityBlocking =
    emailLooksValid && !isCurrentEmailVerified;

  const isNextDisabled = uploading || isEmailAvailabilityBlocking;

  /* ---------------- INPUT REFS (AUTO FOCUS) ---------------- */

  const inputRefs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  /* ---------------- EMAIL ROLE CHECK (DEBOUNCED) ---------------- */

  useEffect(() => {
    if (!normalizedEmail) {
      setEmailCheckStatus("idle");
      setEmailCheckMessage("");
      setCheckedEmail("");
      return;
    }

    if (!emailLooksValid) {
      setEmailCheckStatus("idle");
      setEmailCheckMessage("");
      setCheckedEmail("");
      return;
    }

    const controller = new AbortController();

    setEmailCheckStatus("checking");
    setEmailCheckMessage(tRegister("user.email.checking"));
    setCheckedEmail("");

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(CHECK_EMAIL_ROLE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            role: EMAIL_ROLE,
          }),
          signal: controller.signal,
        });

        const result: CheckEmailRoleResponse = await response.json();

        if (
          !response.ok ||
          !result.success ||
          typeof result.data?.exists !== "boolean"
        ) {
          throw new Error(result.message || tRegister("user.email.verifyFailed"));
        }

        const exists = result.data.exists;

        const canProceed = SHOULD_ALLOW_EXISTING_EMAIL ? exists : !exists;

        setCheckedEmail(normalizedEmail);
        setEmailCheckStatus(canProceed ? "available" : "unavailable");

        if (canProceed) {
          setEmailCheckMessage(
            result.message || tRegister("user.email.available")
          );

          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        } else {
          const fallbackMessage = SHOULD_ALLOW_EXISTING_EMAIL
            ? tRegister("user.email.noAccountForRole")
            : tRegister("user.email.existsForRole");

          const message = result.message || fallbackMessage;

          setEmailCheckMessage(message);

          setErrors((prev) => ({
            ...prev,
            email: message,
          }));
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        setCheckedEmail(normalizedEmail);
        setEmailCheckStatus("error");
        setEmailCheckMessage(
          error instanceof Error
            ? error.message
            : tRegister("user.email.verifyUnavailable")
        );

        setErrors((prev) => ({
          ...prev,
          email: tRegister("user.email.verifyUnavailableWithRetry"),
        }));
      }
    }, EMAIL_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedEmail, emailLooksValid, tRegister]);

  /* ---------------- FILE UPLOAD ---------------- */
const MAX_PROFILE_IMAGE_SIZE_MB = 20;
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;

const handleProfileFileSelect = async (file: File) => {
  if (!file) return;

  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    setErrors((prev) => ({
      ...prev,
      profileFile: tValidation("register.profilePhotoMaxSize", {
        size: MAX_PROFILE_IMAGE_SIZE_MB,
      }),
      profileUrl: tValidation("register.profilePhotoMaxSize", {
        size: MAX_PROFILE_IMAGE_SIZE_MB,
      }),
    }));

    return;
  }

  const blobUrl = URL.createObjectURL(file);

  updateFormData("user", {
    profileFile: file,
    profilePreviewUrl: blobUrl,
  });

  setPreview(blobUrl);

  setErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors.profileUrl;
    delete newErrors.profileFile;
    return newErrors;
  });

  const res = await uploadFile(file);

  if (res?.fileUrl) {
    updateFormData("user", {
      profileUrl: res.fileUrl,
    });
  }
};
  /* ---------------- CLEAR ERROR WHILE TYPING ---------------- */

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  /* ---------------- VALIDATE SINGLE FIELD (BLUR) ---------------- */

  const validateField = (field: string) => {
    const result = translatedUserSchema.safeParse(formData.user);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (err) => err.path[0] === field
      );

      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError.message,
        }));
        return;
      }
    }

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (
        field === "email" &&
        emailCheckStatus === "unavailable" &&
        checkedEmail === normalizedEmail
      ) {
        newErrors.email = emailCheckMessage || tRegister("user.email.notAllowed");
        return newErrors;
      }

      if (
        field === "email" &&
        emailCheckStatus === "error" &&
        checkedEmail === normalizedEmail
      ) {
        newErrors.email =
          emailCheckMessage || tRegister("user.email.verifyUnavailable");
        return newErrors;
      }

      delete newErrors[field];
      return newErrors;
    });
  };

  /* ---------------- VALIDATION (NEXT STEP) ---------------- */

  const handleNext = () => {
    const { success, errors } = validateZod(
      translatedUserSchema,
      formData.user
    );

    if (!success) {
      setErrors(errors);

      const firstErrorField = Object.keys(errors)[0];

      if (
        firstErrorField &&
        inputRefs[firstErrorField as keyof typeof inputRefs]
      ) {
        inputRefs[
          firstErrorField as keyof typeof inputRefs
        ].current?.focus();
      }

      return;
    }

    if (!emailLooksValid) {
      setErrors((prev) => ({
        ...prev,
        email: tValidation("register.validEmail"),
      }));
      inputRefs.email.current?.focus();
      return;
    }

    if (emailCheckStatus === "checking") {
      setErrors((prev) => ({
        ...prev,
        email: tRegister("user.email.waitForVerification"),
      }));
      inputRefs.email.current?.focus();
      return;
    }

    if (!isCurrentEmailVerified) {
      setErrors((prev) => ({
        ...prev,
        email:
          emailCheckStatus === "error"
            ? tRegister("user.email.verifyUnavailableWithRetry")
            : tRegister("user.email.useAvailable"),
      }));
      inputRefs.email.current?.focus();
      return;
    }

    setErrors({});
    next();
  };

  const renderEmailHelper = () => {
    if (!normalizedEmail || !emailLooksValid || errors.email) return null;

    if (emailCheckStatus === "checking") {
      return (
        <p className="text-xs mt-1 text-gray-500">
          {tRegister("user.email.checking")}
        </p>
      );
    }

    if (emailCheckStatus === "available") {
      return (
        <p className="text-xs mt-1 text-green-600">
          {emailCheckMessage || tRegister("user.email.available")}
        </p>
      );
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("user.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* FIRST NAME */}
        <div>
          <FormInput
            ref={inputRefs.firstName}
            label={tRegister("fields.firstName.requiredLabel")}
            placeholder="Ahmed"
            value={user.firstName || ""}
            onChange={(val: string) => {
              updateFormData("user", { firstName: val });
              clearError("firstName");
            }}
            onBlur={() => validateField("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* LAST NAME */}
        <div>
          <FormInput
            ref={inputRefs.lastName}
            label={tRegister("fields.lastName.requiredLabel")}
            placeholder="Ali"
            value={user.lastName || ""}
            onChange={(val: string) => {
              updateFormData("user", { lastName: val });
              clearError("lastName");
            }}
            onBlur={() => validateField("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <FormInput
            ref={inputRefs.email}
            label={tRegister("fields.email.requiredLabel")}
            placeholder="owner@indusfoods.com"
            value={user.email || ""}
            onChange={(val: string) => {
              updateFormData("user", { email: val });
              clearError("email");

              setEmailCheckStatus("idle");
              setEmailCheckMessage("");
              setCheckedEmail("");
            }}
            onBlur={() => validateField("email")}
          />

          {errors.email ? (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          ) : (
            renderEmailHelper()
          )}
        </div>

        {/* PHONE */}
        <div>
          <FormInput
            ref={inputRefs.phone}
            label={tRegister("fields.phone.requiredLabel")}
            placeholder="+923001234567"
            value={user.phone || ""}
            onChange={(val: string) => {
              updateFormData("user", { phone: val });
              clearError("phone");
            }}
            onBlur={() => validateField("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <FormInput
            ref={inputRefs.password}
            label={tRegister("fields.password.requiredLabel")}
            placeholder="StrongPassword123!"
            showPasswordToggle
            value={user.password || ""}
            onChange={(val: string) => {
              updateFormData("user", { password: val });
              clearError("password");
            }}
            onBlur={() => validateField("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* FILE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {tRegister("user.profilePhoto.optionalLabel")}
          </label>

          <PremiumImageDropzone
            alt="profile"
            helperText={tRegister("upload.helper2Mb")}
            isAvatar
            label={tRegister("user.profilePhoto.optionalLabel")}
            onFileSelect={handleProfileFileSelect}
            progress={progress}
            selectedText={tRegister("upload.imageUploaded")}
            uploadText={tRegister("upload.uploading")}
            uploading={uploading}
            uploadTextIdle={tRegister("upload.chooseFile")}
            value={user.profilePreviewUrl || user.profileUrl || preview || ""}
          />

        {(errors.profileFile || errors.profileUrl) && (
  <p className="text-red-500 text-xs">
    {errors.profileFile || errors.profileUrl}
  </p>
)}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="bg-primary hover:bg-red-800 px-6 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? tRegister("upload.uploading")
            : emailCheckStatus === "checking"
            ? tRegister("user.email.checkingShort")
            : tCommon("actions.saveContinue")}
        </Button>
      </div>
    </div>
  );
}
