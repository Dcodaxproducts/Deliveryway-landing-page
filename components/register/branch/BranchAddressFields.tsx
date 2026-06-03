"use client";

import FormInput from "@/components/register/form/FormInput";
import type { BranchAddressField, BranchAddressValue } from "@/types/register";
import { useTranslations } from "next-intl";

interface BranchAddressFieldsProps {
  address: BranchAddressValue;
  error: (path: string) => string | undefined;
  onFieldChange: (field: BranchAddressField, value: string) => void;
}

export function BranchAddressFields({
  address,
  error,
  onFieldChange,
}: BranchAddressFieldsProps) {
  const tRegister = useTranslations("register");

  return (
    <>
      <div>
        <FormInput
          label={tRegister("branch.address.fields.street.requiredLabel")}
          placeholder={tRegister("branch.address.fields.street.placeholder")}
          value={address.street || ""}
          onChange={(val) => onFieldChange("street", val)}
        />
        {error("branch.address.street") && (
          <p className="text-red-500 text-xs mt-1">
            {error("branch.address.street")}
          </p>
        )}
      </div>

      <div>
        <FormInput
          label={tRegister("branch.address.fields.area.requiredLabel")}
          placeholder={tRegister("branch.address.fields.area.placeholder")}
          value={address.area || ""}
          onChange={(val) => onFieldChange("area", val)}
        />
        {error("branch.address.area") && (
          <p className="text-red-500 text-xs mt-1">
            {error("branch.address.area")}
          </p>
        )}
      </div>

      <div>
        <FormInput
          label={tRegister("branch.address.fields.city.requiredLabel")}
          placeholder={tRegister("branch.address.fields.city.placeholder")}
          value={address.city || ""}
          onChange={(val) => onFieldChange("city", val)}
        />
        {error("branch.address.city") && (
          <p className="text-red-500 text-xs mt-1">
            {error("branch.address.city")}
          </p>
        )}
      </div>

      <div>
        <FormInput
          label={tRegister("branch.address.fields.state.requiredLabel")}
          placeholder={tRegister("branch.address.fields.state.placeholder")}
          value={address.state || ""}
          onChange={(val) => onFieldChange("state", val)}
        />
        {error("branch.address.state") && (
          <p className="text-red-500 text-xs mt-1">
            {error("branch.address.state")}
          </p>
        )}
      </div>

      <div>
        <FormInput
          label={tRegister("branch.address.fields.country.requiredLabel")}
          placeholder={tRegister("branch.address.fields.country.placeholder")}
          value={address.country || ""}
          onChange={(val) => onFieldChange("country", val)}
        />
        {error("branch.address.country") && (
          <p className="text-red-500 text-xs mt-1">
            {error("branch.address.country")}
          </p>
        )}
      </div>
    </>
  );
}
