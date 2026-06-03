"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const ContactForm = () => {
  const t = useTranslations();

  return (
    <form className="flex flex-col gap-6 w-full">

      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="fullName">{t("forms.fields.fullName.label")}</Label>
          <Input
            id="fullName"
            placeholder={t("forms.fields.fullName.placeholder")}
            className="mt-1 border border-slate-200"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="email">{t("forms.fields.workEmail.label")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("forms.fields.workEmail.placeholder")}
            className="mt-1 border border-slate-200"
          />
        </div>
      </div>

      {/* Restaurant Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="restaurantName">{t("forms.fields.restaurantName.label")}</Label>
        <Input
          id="restaurantName"
          placeholder={t("forms.fields.restaurantName.placeholder")}
          className="mt-1 border border-slate-200"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="message">{t("forms.fields.message.label")}</Label>
        <Textarea
          id="message"
          placeholder={t("forms.fields.message.placeholder")}
          className="mt-1 h-32 border border-slate-200"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3">
        {t("forms.actions.sendMessage")}
      </Button>

      {/* FAQ Link */}
      <div className="text-center mt-2 text-sm text-slate-500">
        {t("forms.contact.needInstantAnswers")}{" "}
        <span className="text-red-600 font-bold cursor-pointer">{t("forms.contact.checkFaq")}</span>
      </div>
    </form>
  );
};
