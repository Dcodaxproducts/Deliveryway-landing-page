"use client";

import { Accordion } from "@/components/ui/accordion";
import { FaqItem } from "@/components/common/cards/FaqItem";
import { faqs as fallbackFaqs } from "@/constants/faq";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";
import { useLocale, useTranslations } from "next-intl";

export function SectionEight() {
  const t = useTranslations();
  const locale = useLocale();
  const landingSettings = useLandingSettings();
  const hasManagedFaqs = landingSettings.faqs.length > 0;
  const managedFaqs = landingSettings.faqs
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
  const displayFaqs = hasManagedFaqs
    ? managedFaqs
    : fallbackFaqs.map((faq) => ({
        id: faq.id,
        question: t(faq.questionKey),
        answer: t(faq.answerKey),
      }));

  return (
    <section className="w-full bg-white pt-12 md:pt-15 pb-30 md:pb-30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <span className="text-sm sm:text-[16px] text-gray-500">{t("home.sectionEight.eyebrow")}</span>

            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 font-heading">
              {t("home.sectionEight.titleLineOne")}{" "}
              {t("home.sectionEight.titleLineTwo")}{" "}
              {t("home.sectionEight.titleLineThree")}
            </h2>

            <p className="mt-6 sm:mt-8 text-sm sm:text-[16px] text-gray-600">
              {t("home.sectionEight.description")}
            </p>

            <a
              href="mailto:support@yourfoodsaas.com"
              className="mt-2 inline-block text-base sm:text-xl font-medium text-blue-600 hover:underline break-all"
            >
              support@yourfoodsaas.com
            </a>
          </div>

          {/* RIGHT FAQ ACCORDION */}
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue={displayFaqs[0]?.id}
              className="w-full"
            >
              {displayFaqs.map((faq) => (
                <FaqItem
                  key={faq.id}
                  id={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
