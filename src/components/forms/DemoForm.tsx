"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export const DemoForm = () => {
  const t = useTranslations();

  return (
    <form className="flex flex-col gap-4 w-full">

      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="firstName" className="text-slate-900 text-sm font-semibold">
            {t("forms.fields.firstName.label")}
          </Label>
          <Input
            id="firstName"
            placeholder={t("forms.fields.firstName.placeholder")}
            className="h-10 bg-white border border-slate-200 rounded-lg"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="lastName" className="text-slate-900 text-sm font-semibold">
            {t("forms.fields.lastName.label")}
          </Label>
          <Input
            id="lastName"
            placeholder={t("forms.fields.lastName.placeholder")}
            className="h-10 bg-white border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Work Email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">
          {t("forms.fields.workEmail.label")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("forms.fields.workEmail.shortPlaceholder")}
          className="h-10 bg-white border border-slate-200 rounded-lg"
        />
      </div>

      {/* Company Size */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="companySize" className="text-slate-900 text-sm font-semibold">
          {t("forms.fields.companySize.label")}
        </Label>
        <Select>
          <SelectTrigger className="h-10 bg-white border border-slate-200 rounded-lg w-full">
            <SelectValue placeholder={t("forms.fields.companySize.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10-50">{t("forms.companySizeOptions.tenToFifty")}</SelectItem>
            <SelectItem value="51-200">{t("forms.companySizeOptions.fiftyOneToTwoHundred")}</SelectItem>
            <SelectItem value="201-500">{t("forms.companySizeOptions.twoHundredOneToFiveHundred")}</SelectItem>
            <SelectItem value="500+">{t("forms.companySizeOptions.fiveHundredPlus")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-4">
        {t("forms.actions.bookDemo")}
      </Button>
    </form>
  );
};
