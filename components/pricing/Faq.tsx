"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricingFaqData } from "@/constants/faq";
import SectionHeader from "../about/SectionHeader";

const Faq = () => {
  return (
    <section className="w-full bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Header */}
         <SectionHeader
          title="Frequently Asked Questions"
          description="Got questions? We've got answers."
        />

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
        >
          {pricingFaqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl border border-slate-200 px-6"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-6 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
