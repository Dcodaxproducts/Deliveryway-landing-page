"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

interface FormInputProps
  extends Omit<ComponentPropsWithoutRef<typeof Input>, "onChange" | "value"> {
  error?: boolean;
  errorText?: ReactNode;
  label: ReactNode;
  onChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      required,
      error,
      errorText,
      showPasswordToggle,
      className,
      ...inputProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <Label className="mb-2 text-[16px]">
          {label}
          {required && <span className="text-primary"> *</span>}
        </Label>

        <div className="relative">
          <Input
            ref={ref}
            type={showPasswordToggle ? (showPassword ? "text" : "password") : "text"}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cn(
              "border-[#BBBBBB] placeholder-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary pr-10",
              error && "border-primary bg-primary/5",
              className
            )}
            {...inputProps}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && errorText && (
          <p className="text-xs text-primary mt-1">{errorText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
