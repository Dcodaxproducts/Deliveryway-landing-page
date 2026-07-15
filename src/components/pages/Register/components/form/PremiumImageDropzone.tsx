"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type PremiumImageDropzoneProps = {
  accept?: string;
  alt: string;
  className?: string;
  helperText: string;
  imageClassName?: string;
  isAvatar?: boolean;
  label: string;
  onFileSelect: (file: File) => void;
  progress: number;
  selectedText: string;
  uploadText: string;
  uploading: boolean;
  uploadTextIdle: string;
  value?: string;
  variant?: "compact" | "cover";
};

export function PremiumImageDropzone({
  accept = ".png,.jpg,.jpeg",
  alt,
  className,
  helperText,
  imageClassName,
  isAvatar = false,
  label,
  onFileSelect,
  progress,
  selectedText,
  uploadText,
  uploading,
  uploadTextIdle,
  value,
  variant = "compact",
}: PremiumImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageSrc = value || "";
  const hasImage = Boolean(imageSrc);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    onFileSelect(file);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const statusText = uploading
    ? uploadText
    : hasImage
    ? selectedText
    : uploadTextIdle;

  if (variant === "cover") {
    return (
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative flex min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-[radial-gradient(circle_at_top_left,rgba(193,0,10,0.12),transparent_34%),linear-gradient(135deg,#ffffff,#f7f7f8)] p-4 shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_24px_65px_rgba(193,0,10,0.14)]",
          isDragging && "border-primary bg-primary/5 ring-4 ring-primary/10",
          className
        )}
      >
        {hasImage ? (
          <>
            <Image
              src={imageSrc}
              alt={alt}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 640px"
              className={cn("object-cover", imageClassName)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          </>
        ) : null}

        {uploading ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 text-white">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <span className="text-sm font-semibold">{progress}%</span>
          </div>
        ) : null}

        <div className="relative z-10 flex w-full flex-col items-center justify-center rounded-[18px] border border-white/60 bg-white/70 px-5 py-6 text-center backdrop-blur-sm transition group-hover:bg-white/80">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_34px_rgba(193,0,10,0.28)]">
            {hasImage ? <CheckCircle2 className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
          </span>
          <span className="text-sm font-semibold text-gray-950">{label}</span>
          <span className="mt-2 text-sm font-medium text-primary">{statusText}</span>
          <span className="mt-1 text-xs leading-5 text-gray-500">{helperText}</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </label>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group flex min-h-[92px] cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_20px_50px_rgba(193,0,10,0.12)]",
        isDragging && "border-primary bg-primary/5 ring-4 ring-primary/10",
        className
      )}
    >
      <div
        className={cn(
          "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50 shadow-inner",
          isAvatar ? "rounded-full" : "rounded-2xl"
        )}
      >
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            unoptimized
            sizes="64px"
            className={cn("object-cover", imageClassName)}
          />
        ) : (
          <UploadCloud className="h-7 w-7 text-primary" />
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <span className="text-xs font-semibold">{progress}%</span>
          </div>
        ) : null}
      </div>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-950">{label}</span>
        <span className="mt-1 block text-sm font-medium text-primary">{statusText}</span>
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {helperText}
        </span>
      </span>

      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white sm:flex">
        <UploadCloud className="h-5 w-5" />
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </label>
  );
}
