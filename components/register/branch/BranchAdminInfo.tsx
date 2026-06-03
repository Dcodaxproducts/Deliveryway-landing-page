"use client";

import FormInput from "@/components/register/form/FormInput";
import type { BranchAdminField, BranchAdminValue } from "@/types/register";
import { useTranslations } from "next-intl";

interface BranchAdminInfoProps {
  branchAdmin: BranchAdminValue;
  error: (path: string) => string | undefined;
  onFieldChange: (field: BranchAdminField, value: string) => void;
}

export function BranchAdminInfo({
  branchAdmin,
  error,
  onFieldChange,
}: BranchAdminInfoProps) {
  const tRegister = useTranslations("register");

  return (
    <section className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-[20px] font-semibold text-gray-900">
          {tRegister("branch.admin.title")}
        </h2>
        <p className="text-sm text-gray-500">
          {tRegister("branch.admin.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
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

        <div>
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

        <div>
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

        <div className="sm:col-span-2">
          <FormInput
            label={tRegister("branch.admin.fields.password.label")}
            placeholder={tRegister("branch.admin.fields.password.placeholder")}
            value={branchAdmin.password || ""}
            onChange={(val) => onFieldChange("password", val)}
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
