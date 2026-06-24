"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";

const getMessageValue = (value: unknown) => {
  return typeof value === "string" ? value : "";
};

const normalizeResponse = (value: unknown) => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

export const ContactForm = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pageParams = new URLSearchParams(window.location.search);
    const restaurantId =
      pageParams.get("restaurantId") ||
      process.env.NEXT_PUBLIC_CONTACT_RESTAURANT_ID ||
      "";
    const branchId =
      pageParams.get("branchId") ||
      process.env.NEXT_PUBLIC_CONTACT_BRANCH_ID ||
      "";

    if (!restaurantId) {
      toast.error(t("forms.status.missingRestaurant"));
      return;
    }

    setLoading(true);

    try {
      const query = new URLSearchParams({ restaurantId });

      if (branchId) {
        query.set("branchId", branchId);
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/public-content/contact-form?${query.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim(),
          }),
        }
      );
      const payload: unknown = await response.json();
      const responseData = normalizeResponse(payload);
      const submittedData = normalizeResponse(responseData.data);

      if (!response.ok || submittedData.submitted !== true) {
        throw new Error(
          getMessageValue(responseData.message) || t("forms.status.submitError")
        );
      }

      event.currentTarget.reset();
      toast.success(t("forms.status.submitSuccess"));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : t("forms.status.submitError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="fullName">{t("forms.fields.fullName.label")}</Label>
          <Input
            id="fullName"
            name="name"
            maxLength={120}
            required
            placeholder={t("forms.fields.fullName.placeholder")}
            className="mt-1 border border-slate-200"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="email">{t("forms.fields.workEmail.label")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            maxLength={254}
            required
            placeholder={t("forms.fields.workEmail.placeholder")}
            className="mt-1 border border-slate-200"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="subject">{t("forms.fields.subject.label")}</Label>
        <Input
          id="subject"
          name="subject"
          maxLength={160}
          required
          placeholder={t("forms.fields.subject.placeholder")}
          className="mt-1 border border-slate-200"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="message">{t("forms.fields.message.label")}</Label>
        <Textarea
          id="message"
          name="message"
          maxLength={4000}
          required
          placeholder={t("forms.fields.message.placeholder")}
          className="mt-1 h-32 border border-slate-200"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3"
      >
        {loading ? t("forms.actions.submitting") : t("forms.actions.sendMessage")}
      </Button>

      {/* FAQ Link */}
      <div className="text-center mt-2 text-sm text-slate-500">
        {t("forms.contact.needInstantAnswers")}{" "}
        <span className="text-red-600 font-bold cursor-pointer">{t("forms.contact.checkFaq")}</span>
      </div>
    </form>
  );
};
