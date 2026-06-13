"use client";

import { FormInput } from "@/components/register/form/FormInput";
import { PremiumImageDropzone } from "@/components/register/form/PremiumImageDropzone";
import type { BranchBasicField, BranchValue } from "@/types/register";
import { useTranslations } from "next-intl";

interface BranchBasicInfoProps {
  branch: BranchValue;
  error: (path: string) => string | undefined;
  onFieldChange: (field: BranchBasicField, value: string) => void;
  onImageChange: (file: File) => void;
  progress: number;
  uploading: boolean;
}

export function BranchBasicInfo({
  branch,
  error,
  onFieldChange,
  onImageChange,
  progress,
  uploading,
}: BranchBasicInfoProps) {
  const tRegister = useTranslations("register");

  return (
    <>
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        {tRegister("branch.basic.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div data-field="branch.name">
          <FormInput
            label={tRegister("branch.fields.name.requiredLabel")}
            placeholder={tRegister("branch.fields.name.placeholder")}
            value={branch.name || ""}
            onChange={(val) => onFieldChange("name", val)}
          />
          {error("branch.name") && (
            <p className="text-red-500 text-xs mt-1">{error("branch.name")}</p>
          )}
        </div>

        <div data-field="branch.description">
          <FormInput
            label={tRegister("branch.fields.description.optionalLabel")}
            placeholder={tRegister("branch.fields.description.placeholder")}
            value={branch.description || ""}
            onChange={(val) => onFieldChange("description", val)}
          />
          {error("branch.description") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.description")}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-[16px] mb-2 block">
            {tRegister("branch.coverImage.label")}
          </label>

          <PremiumImageDropzone
            alt={tRegister("branch.coverImage.previewAlt")}
            helperText={tRegister("branch.coverImage.helper")}
            label={tRegister("branch.coverImage.label")}
            onFileSelect={onImageChange}
            progress={progress}
            selectedText={tRegister("branch.coverImage.clickToUpload")}
            uploadText={tRegister("upload.uploading")}
            uploading={uploading}
            uploadTextIdle={tRegister("branch.coverImage.dragDrop")}
            value={branch.coverImagePreviewUrl || branch.coverImage}
            variant="cover"
          />

          {(error("branch.coverImageFile") || error("branch.coverImage")) && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.coverImageFile") || error("branch.coverImage")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
