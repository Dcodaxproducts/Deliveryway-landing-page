"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { ContactForm } from "@/components/forms/ContactForm";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export const Contact = () => {
  const t = useTranslations("contact");
  const settings = useLandingSettings();
  const contactDetails = [
    settings.supportEmail
      ? {
          id: "email",
          label: t("info.salesEmail.title"),
          value: settings.supportEmail,
          href: `mailto:${settings.supportEmail}`,
          icon: Mail,
        }
      : null,
    settings.supportPhone
      ? {
          id: "phone",
          label: t("info.supportPhone.title"),
          value: settings.supportPhone,
          href: `tel:${settings.supportPhone}`,
          icon: Phone,
        }
      : null,
    settings.address
      ? {
          id: "address",
          label: t("sections.officeLocations"),
          value: settings.address,
          href: null,
          icon: MapPin,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="w-full bg-slate-50 px-6 py-16 lg:px-24 lg:py-20">
      <div
        className={`mx-auto grid max-w-7xl gap-10 ${
          contactDetails.length ? "lg:grid-cols-[1.2fr_0.8fr]" : ""
        }`}
      >
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-10">
          <ContactForm />
        </div>

        {contactDetails.length ? (
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">
              {t("sections.contactInformation")}
            </h2>
            <div className="mt-7 space-y-5">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                const content = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-950">
                        {detail.label}
                      </span>
                      <span className="mt-1 block break-words text-sm leading-6 text-slate-600">
                        {detail.value}
                      </span>
                    </span>
                  </>
                );

                return detail.href ? (
                  <a
                    key={detail.id}
                    href={detail.href}
                    className="flex gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-red-200 hover:bg-red-50/40"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={detail.id}
                    className="flex gap-4 rounded-2xl border border-slate-100 p-4"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
};
