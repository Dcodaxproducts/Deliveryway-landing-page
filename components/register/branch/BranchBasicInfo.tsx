"use client";

import FormInput from "@/components/register/form/FormInput";
import type { BranchBasicField, BranchValue } from "@/types/register";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface BranchBasicInfoProps {
  branch: BranchValue;
  error: (path: string) => string | undefined;
  onFieldChange: (field: BranchBasicField, value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
        <div>
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

        <div>
          <FormInput
            label={tRegister("branch.fields.description.requiredLabel")}
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

          <label className="h-[190px] rounded-xl border border-dashed border-[#bbbbbb] bg-[#F5F5F5] flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
            {branch.coverImagePreviewUrl ? (
              <>
                <img
                  src={branch.coverImagePreviewUrl}
                  alt={tRegister("branch.coverImage.previewAlt")}
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
                <span className="text-primary">
                  {tRegister("branch.coverImage.clickToUpload")}
                </span>
                <span
                  className={`font-semibold ml-1 ${
                    branch.coverImagePreviewUrl
                      ? "text-white"
                      : "text-[#909090]"
                  }`}
                >
                  {tRegister("branch.coverImage.dragDrop")}
                </span>
              </p>

              <p
                className={`text-xs mt-1 ${
                  branch.coverImagePreviewUrl ? "text-white/90" : "text-gray-400"
                }`}
              >
                {tRegister("branch.coverImage.helper")}
              </p>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={onImageChange}
            />
          </label>

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
