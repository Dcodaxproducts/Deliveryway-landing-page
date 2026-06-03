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

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<UploadResult | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;

    try {
      setUploading(true);
      setProgress(0);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      /* 🔥 STEP 1: PRESIGNED URL */
      const presignedRes = await fetch(
        `${API_BASE_URL}/v1/storage/presigned-upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
        }
      );

      if (!presignedRes.ok) {
        throw new Error(tErrors("uploadUrlFailed"));
      }

      const presigned = (await presignedRes.json()) as PresignedUploadResponse;
      const uploadData = presigned?.data;

      if (!uploadData?.uploadUrl) {
        throw new Error(tErrors("invalidPresignedResponse"));
      }

      const uploadUrl = uploadData.uploadUrl;

      /* 🔥 STEP 2: UPLOAD WITH XHR (PROGRESS) */
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(uploadData.method || "PUT", uploadUrl);

        /* headers */
        if (uploadData.headers) {
          Object.entries(uploadData.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        /* 🔥 PROGRESS TRACK */
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(tErrors("uploadFailed")));
          }
        };

        xhr.onerror = () => reject(new Error(tErrors("uploadFailed")));

        xhr.send(file);
      });

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
          : tErrors("uploadFailed")
      );
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};
