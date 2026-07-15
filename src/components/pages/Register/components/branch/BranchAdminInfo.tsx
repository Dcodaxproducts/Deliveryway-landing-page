"use client";

import { FormInput } from "@/components/pages/Register/components/form/FormInput";
import { Switch } from "@/components/ui/switch";
import type { BranchAdminField, BranchAdminValue } from "@/types/register";
import { useTranslations } from "next-intl";

interface BranchAdminInfoProps {
  branchAdmin: BranchAdminValue;
  error: (path: string) => string | undefined;
  isSameAsOwner: boolean;
  onFieldChange: (field: BranchAdminField, value: string) => void;
  onSameAsOwnerChange: (checked: boolean) => void;
}

export function BranchAdminInfo({
  branchAdmin,
  error,
  isSameAsOwner,
  onFieldChange,
  onSameAsOwnerChange,
}: BranchAdminInfoProps) {
  const tRegister = useTranslations("register");

  return (
    <section className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">
            {tRegister("branch.admin.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {tRegister("branch.admin.description")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:min-w-[280px]">
          <span className="text-sm font-medium text-gray-800">
            {tRegister("branch.admin.sameAsOwner")}
          </span>
          <Switch
            checked={isSameAsOwner}
            onCheckedChange={onSameAsOwnerChange}
            aria-label={tRegister("branch.admin.sameAsOwner")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div data-field="branchAdmin.firstName">
          <FormInput
            label={tRegister("branch.admin.fields.firstName.label")}
            placeholder={tRegister("branch.admin.fields.firstName.placeholder")}
            value={branchAdmin.firstName || ""}
            onChange={(val) => onFieldChange("firstName", val)}
          />
          {error("branchAdmin.firstName") && (
            <p className="mt-1 text-xs text-red-500">
              {error("branchAdmin.firstName")}
            </p>
          )}
        </div>

        <div data-field="branchAdmin.lastName">
          <FormInput
            label={tRegister("branch.admin.fields.lastName.label")}
            placeholder={tRegister("branch.admin.fields.lastName.placeholder")}
            value={branchAdmin.lastName || ""}
            onChange={(val) => onFieldChange("lastName", val)}
          />
          {error("branchAdmin.lastName") && (
            <p className="mt-1 text-xs text-red-500">
              {error("branchAdmin.lastName")}
            </p>
          )}
        </div>

        <div data-field="branchAdmin.email">
          <FormInput
            label={tRegister("branch.admin.fields.email.label")}
            placeholder={tRegister("branch.admin.fields.email.placeholder")}
            value={branchAdmin.email || ""}
            onChange={(val) => onFieldChange("email", val)}
          />
          {error("branchAdmin.email") && (
            <p className="mt-1 text-xs text-red-500">
              {error("branchAdmin.email")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label={tRegister("branch.admin.fields.phone.label")}
            placeholder={tRegister("branch.admin.fields.phone.placeholder")}
            value={branchAdmin.phone || ""}
            onChange={(val) => onFieldChange("phone", val)}
          />
          {error("branchAdmin.phone") && (
            <p className="mt-1 text-xs text-red-500">
              {error("branchAdmin.phone")}
            </p>
          )}
        </div>

        <div className="sm:col-span-2" data-field="branchAdmin.password">
          <FormInput
            label={tRegister("branch.admin.fields.password.label")}
            placeholder={tRegister("branch.admin.fields.password.placeholder")}
            value={branchAdmin.password || ""}
            onChange={(val) => onFieldChange("password", val)}
            showPasswordToggle
          />
          {error("branchAdmin.password") && (
            <p className="mt-1 text-xs text-red-500">
              {error("branchAdmin.password")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
