"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricingFaqData } from "@/constants/faq";
import { pricingHeaders } from "@/constants/pricing";
import { useTranslations } from "next-intl";
import { SectionHeader } from "../about/SectionHeader";

export function Faq() {
  const t = useTranslations();

  return (
    <section className="w-full bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Header */}
         <SectionHeader
          title={t(pricingHeaders.faqTitleKey)}
          description={t(pricingHeaders.faqDescriptionKey)}
        />

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
        >
          {pricingFaqData.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-xl border border-slate-200 px-6"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline">
                {t(faq.questionKey)}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-6 pb-4">
                {t(faq.answerKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
