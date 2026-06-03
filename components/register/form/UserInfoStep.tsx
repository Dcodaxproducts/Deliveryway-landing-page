"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import { Upload } from "lucide-react";
import { validateZod } from "@/hooks/useZodValidator";
import { userSchema } from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";
import { API_BASE_URL } from "@/lib/constants";

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
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

export default function UserInfoStep({ formData, updateFormData, next }: Props) {
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
    setEmailCheckMessage("Checking email availability...");
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
          throw new Error(result.message || "Unable to verify email");
        }

        const exists = result.data.exists;

        const canProceed = SHOULD_ALLOW_EXISTING_EMAIL ? exists : !exists;

        setCheckedEmail(normalizedEmail);
        setEmailCheckStatus(canProceed ? "available" : "unavailable");

        if (canProceed) {
          setEmailCheckMessage(
            result.message || "Email is available for this role"
          );

          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        } else {
          const fallbackMessage = SHOULD_ALLOW_EXISTING_EMAIL
            ? "No account exists with this email for this role"
            : "This email already exists for this role";

          const message = result.message || fallbackMessage;

          setEmailCheckMessage(message);

          setErrors((prev) => ({
            ...prev,
            email: message,
          }));
        }
      } catch (error: any) {
        if (error?.name === "AbortError") return;

        setCheckedEmail(normalizedEmail);
        setEmailCheckStatus("error");
        setEmailCheckMessage(
          error?.message || "Unable to verify email right now"
        );

        setErrors((prev) => ({
          ...prev,
          email: "Unable to verify email right now. Please try again.",
        }));
      }
    }, EMAIL_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedEmail, emailLooksValid]);

  /* ---------------- FILE UPLOAD ---------------- */
const MAX_PROFILE_IMAGE_SIZE_MB = 2;
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    e.target.value = "";

    setErrors((prev) => ({
      ...prev,
      profileFile: `Profile photo must be less than ${MAX_PROFILE_IMAGE_SIZE_MB}MB.`,
      profileUrl: `Profile photo must be less than ${MAX_PROFILE_IMAGE_SIZE_MB}MB.`,
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

  const res = await uploadFile(e);

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
    const result = userSchema.safeParse(formData.user);

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
        newErrors.email = emailCheckMessage || "This email is not allowed";
        return newErrors;
      }

      if (
        field === "email" &&
        emailCheckStatus === "error" &&
        checkedEmail === normalizedEmail
      ) {
        newErrors.email =
          emailCheckMessage || "Unable to verify email right now";
        return newErrors;
      }

      delete newErrors[field];
      return newErrors;
    });
  };

  /* ---------------- VALIDATION (NEXT STEP) ---------------- */

  const handleNext = () => {
    const { success, errors } = validateZod(userSchema, formData.user);

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
        email: "Please enter a valid email address",
      }));
      inputRefs.email.current?.focus();
      return;
    }

    if (emailCheckStatus === "checking") {
      setErrors((prev) => ({
        ...prev,
        email: "Please wait while we verify this email",
      }));
      inputRefs.email.current?.focus();
      return;
    }

    if (!isCurrentEmailVerified) {
      setErrors((prev) => ({
        ...prev,
        email:
          emailCheckStatus === "error"
            ? "Unable to verify email right now. Please try again."
            : "Please use an email that is available for this role",
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
          Checking email availability...
        </p>
      );
    }

    if (emailCheckStatus === "available") {
      return (
        <p className="text-xs mt-1 text-green-600">
          {emailCheckMessage || "Email is available for this role"}
        </p>
      );
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        User Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* FIRST NAME */}
        <div>
          <FormInput
            ref={inputRefs.firstName}
            label="First Name*"
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
            label="Last Name*"
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
            label="Email*"
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
            label="Phone Number*"
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
            label="Password*"
            placeholder="StrongPassword123!"
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
          <label className="text-sm font-medium">Profile Photo (Optional)</label>

          <label className="flex items-center gap-4 cursor-pointer rounded-lg pt-1 hover:bg-gray-50 transition">
            {/* AVATAR BOX */}
            <div className="relative w-14 h-14">
              {/* shimmer while uploading */}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
              )}

              {/* image preview replaces icon */}
              {preview || user.profileUrl ? (
                <img
                  src={
                    user.profilePreviewUrl ||
                    user.profileUrl ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  }
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <div className="w-14 h-14 border border-[#909090] rounded-full flex items-center justify-center">
                  <Upload className="text-[#909090]" />
                </div>
              )}

              {/* progress overlay */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <span className="text-white text-xs font-semibold">
                    {progress}%
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium">
                {uploading
                  ? "Uploading..."
                  : user.profileUrl
                  ? "Image uploaded"
                  : "Choose File"}
              </p>

              <p className="text-xs text-[#909090]">PNG, JPG, JPEG upto 2MB</p>
            </div>

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

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
            ? "Uploading..."
            : emailCheckStatus === "checking"
            ? "Checking email..."
            : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}