"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricingHeaders } from "@/constants/pricing";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeader } from "@/components/pages/About/components/SectionHeader";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function Faq() {
  const t = useTranslations();
  const locale = useLocale();
  const landingSettings = useLandingSettings();
  const faqs = landingSettings.faqs
    .filter((faq) => faq.isActive)
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.id.localeCompare(right.id),
    );

  if (faqs.length === 0) return null;

  return (
    <section className="w-full bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <SectionHeader
          title={t(pricingHeaders.faqTitleKey)}
          description={t(pricingHeaders.faqDescriptionKey)}
        />

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-xl border border-slate-200 px-6"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline">
                {locale.startsWith("de") ? faq.questionDe : faq.questionEn}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-6 pb-4">
                {locale.startsWith("de") ? faq.answerDe : faq.answerEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
