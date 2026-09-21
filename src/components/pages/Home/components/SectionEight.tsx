"use client";

import { useLocale } from "next-intl";

import { Accordion } from "@/components/ui/accordion";
import { FaqItem } from "@/components/common/cards/FaqItem";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionEight() {
  const locale = useLocale();
  const { faqs } = useLandingSettings();
  const managedFaqs = faqs
    .filter((faq) => faq.isActive)
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.id.localeCompare(right.id),
    )
    .map((faq) => ({
      id: faq.id,
      question: locale.startsWith("de") ? faq.questionDe : faq.questionEn,
      answer: locale.startsWith("de") ? faq.answerDe : faq.answerEn,
    }));

  if (managedFaqs.length === 0) return null;

  return (
    <section id="faqs" className="w-full bg-white pb-28 pt-14 md:pt-20">
      <div className="mx-auto max-w-4xl px-4">
        <Accordion
          type="single"
          collapsible
          defaultValue={managedFaqs[0]?.id}
          className="w-full"
        >
          {managedFaqs.map((faq) => (
            <FaqItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
