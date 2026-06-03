// src/constants/faqs.ts

export interface FaqItemType {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqItemType[] = [
  {
    id: "item-1",
    question: "Can I use the platform for both dine-in and delivery orders?",
    answer:
      "Yes, our system supports all order types — delivery, takeaway, and dine-in. Restaurants can easily manage them through a single dashboard designed for speed and efficiency.",
  },
  {
    id: "item-2",
    question: "How do I update my restaurant menu?",
    answer:
      "You can update your menu directly from the restaurant dashboard. Add or remove items, update prices, manage variations, and control availability in real time without any technical assistance.",
  },
  {
    id: "item-3",
    question: "Do you provide delivery riders?",
    answer:
      "We support both in-house and third-party delivery models. Restaurants can use their own riders or integrate with supported delivery partners depending on their business needs.",
  },
  {
    id: "item-4",
    question: "Are there any fees for joining the platform?",
    answer:
      "There are no upfront setup fees. Pricing depends on your selected plan and order volume. Full details are available during onboarding or by contacting our sales team.",
  },
  {
    id: "item-5",
    question: "Can I manage orders from multiple devices?",
    answer:
      "Yes. Your account stays synchronized across all devices, allowing you to manage orders, menus, and analytics from multiple tablets, phones, or desktops simultaneously.",
  },
];




export const pricingFaqData = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, new features become available immediately. Downgrades take effect at the end of your current billing cycle.",
  },
  {
    question: "Does Gusto work with my existing hardware?",
    answer:
      "Gusto is hardware-agnostic. We support most modern POS terminals, iPads, and Android tablets. Contact our team to verify your specific setup.",
  },
  {
    question: "What kind of support is included?",
    answer:
      "Starter plans include email support. Professional and Enterprise plans include 24/7 priority phone and chat support with guaranteed response times under 30 minutes.",
  },
  {
    question: "Are there any hidden setup fees?",
    answer:
      "No. We believe in transparent pricing. There are no mandatory implementation fees. Custom onboarding is available for Enterprise teams if needed.",
  },
];
