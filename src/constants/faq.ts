// src/constants/faqs.ts
import type { FaqConfig } from "@/types/marketing";

export const faqs: FaqConfig[] = [
  {
    id: "item-1",
    question: "Can I use the platform for both dine-in and delivery orders?",
    questionKey: "home.faq.allOrderTypes.question",
    answer:
      "Yes, our system supports all order types — delivery, takeaway, and dine-in. Restaurants can easily manage them through a single dashboard designed for speed and efficiency.",
    answerKey: "home.faq.allOrderTypes.answer",
  },
  {
    id: "item-2",
    question: "How do I update my restaurant menu?",
    questionKey: "home.faq.updateMenu.question",
    answer:
      "You can update your menu directly from the restaurant dashboard. Add or remove items, update prices, manage variations, and control availability in real time without any technical assistance.",
    answerKey: "home.faq.updateMenu.answer",
  },
  {
    id: "item-3",
    question: "Do you provide delivery riders?",
    questionKey: "home.faq.deliveryRiders.question",
    answer:
      "We support both in-house and third-party delivery models. Restaurants can use their own riders or integrate with supported delivery partners depending on their business needs.",
    answerKey: "home.faq.deliveryRiders.answer",
  },
  {
    id: "item-4",
    question: "Are there any fees for joining the platform?",
    questionKey: "home.faq.joiningFees.question",
    answer:
      "There are no upfront setup fees. Pricing depends on your selected plan and order volume. Full details are available during onboarding or by contacting our sales team.",
    answerKey: "home.faq.joiningFees.answer",
  },
  {
    id: "item-5",
    question: "Can I manage orders from multiple devices?",
    questionKey: "home.faq.multipleDevices.question",
    answer:
      "Yes. Your account stays synchronized across all devices, allowing you to manage orders, menus, and analytics from multiple tablets, phones, or desktops simultaneously.",
    answerKey: "home.faq.multipleDevices.answer",
  },
];




export const pricingFaqData: FaqConfig[] = [
  {
    id: "pricing-switch-plans",
    question: "Can I switch plans later?",
    questionKey: "pricing.faq.switchPlans.question",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, new features become available immediately. Downgrades take effect at the end of your current billing cycle.",
    answerKey: "pricing.faq.switchPlans.answer",
  },
  {
    id: "pricing-existing-hardware",
    question: "Does Gusto work with my existing hardware?",
    questionKey: "pricing.faq.existingHardware.question",
    answer:
      "Gusto is hardware-agnostic. We support most modern POS terminals, iPads, and Android tablets. Contact our team to verify your specific setup.",
    answerKey: "pricing.faq.existingHardware.answer",
  },
  {
    id: "pricing-support-included",
    question: "What kind of support is included?",
    questionKey: "pricing.faq.supportIncluded.question",
    answer:
      "Starter plans include email support. Professional and Enterprise plans include 24/7 priority phone and chat support with guaranteed response times under 30 minutes.",
    answerKey: "pricing.faq.supportIncluded.answer",
  },
  {
    id: "pricing-hidden-fees",
    question: "Are there any hidden setup fees?",
    questionKey: "pricing.faq.hiddenFees.question",
    answer:
      "No. We believe in transparent pricing. There are no mandatory implementation fees. Custom onboarding is available for Enterprise teams if needed.",
    answerKey: "pricing.faq.hiddenFees.answer",
  },
];
