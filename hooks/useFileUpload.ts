"use client";

import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";

interface UploadResult {
  key: string;
  fileUrl: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        throw new Error("Failed to get upload URL");
      }

      const presigned = await presignedRes.json();
      const uploadData = presigned?.data;

      if (!uploadData?.uploadUrl) {
        throw new Error("Invalid presigned response");
      }

      /* 🔥 STEP 2: UPLOAD WITH XHR (PROGRESS) */
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(uploadData.method || "PUT", uploadData.uploadUrl);

        /* headers */
        if (uploadData.headers) {
          Object.entries(uploadData.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value as string);
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
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.send(file);
      });

      toast.success("File uploaded");

      return {
        key: uploadData.key,
        fileUrl: uploadData.fileUrl,
      };
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};