"use client";

import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";

interface UploadResult {
  key: string;
  fileUrl: string;
}

type PresignedUploadData = {
  uploadUrl?: string;
  method?: string;
  headers?: Record<string, string>;
  key: string;
  fileUrl: string;
};

type PresignedUploadResponse = {
  data?: PresignedUploadData;
};

export const MAX_UPLOAD_FILE_SIZE_MB = 20;
export const MAX_UPLOAD_FILE_SIZE_BYTES = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tValidation = useTranslations("validation.register");

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;

    try {
      setUploading(true);
      setProgress(0);

      if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
        throw new Error(
          tValidation("fileMaxSize", { size: MAX_UPLOAD_FILE_SIZE_MB }),
        );
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", "logo");
      const uploadData = await new Promise<PresignedUploadData>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.open("POST", `${API_BASE_URL}/v1/storage/upload-image`);
          if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

          /* 🔥 PROGRESS TRACK */
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(
                  xhr.responseText,
                ) as PresignedUploadResponse;
                if (!response.data?.fileUrl || !response.data.key) {
                  reject(new Error(tErrors("invalidPresignedResponse")));
                  return;
                }
                resolve(response.data);
              } catch {
                reject(new Error(tErrors("invalidPresignedResponse")));
              }
            } else {
              reject(new Error(tErrors("uploadFailed")));
            }
          };

          xhr.onerror = () => reject(new Error(tErrors("uploadFailed")));

          xhr.send(formData);
        },
      );

      toast.success(tCommon("fileUploaded"));

      return {
        key: uploadData.key,
        fileUrl: uploadData.fileUrl,
      };
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : tErrors("uploadFailed"),
      );
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};
