"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  error?: boolean;
  errorText?: ReactNode;
  label?: ReactNode;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  options: string[] | FormSelectOption[];
  placeholder: string;
  value?: string;
}

const resolveOption = (option: string | FormSelectOption): FormSelectOption => {
  if (typeof option === "string") {
    return {
      label: option,
      value: option.toLowerCase(),
    };
  }

  return option;
};

export function FormSelect({
  error,
  errorText,
  label,
  onChange,
  onOpenChange,
  open,
  options,
  placeholder,
  value,
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      {label && <Label className="text-[16px]">{label}</Label>}

      <Select
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={onOpenChange}
      >
        <SelectTrigger
          className={cn(
            "border-[#BBBBBB] focus:ring-1 focus:ring-primary focus:border-primary h-[53px] rounded-[10px] px-3 text-sm",
            error && "border-primary bg-primary/5"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => {
            const resolvedOption = resolveOption(option);

            return (
              <SelectItem key={resolvedOption.value} value={resolvedOption.value}>
                {resolvedOption.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {error && errorText && (
        <p className="text-xs text-primary mt-1">{errorText}</p>
      )}
    </div>
  );
}
