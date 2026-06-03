"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: string;
  placeholder: string;
  options: string[] | FormSelectOption[];
  value?: string;
  onChange?: (val: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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

export default function FormSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  open,
  onOpenChange,
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
        <SelectTrigger className="border-[#BBBBBB] focus:ring-1 focus:ring-primary focus:border-primary h-[53px] rounded-[10px] px-3 text-sm">
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
    </div>
  );
}
