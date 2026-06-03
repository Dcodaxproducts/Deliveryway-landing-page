
import type { TranslatedTextKey } from "@/types/marketing";

interface CategoryConfig {
  title: string;
  titleKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  icon: string;
}

export const sectionThreeCategories: CategoryConfig[] = [
  {
    title: "Menu Management",
    titleKey: "categories.sectionThree.menuManagement.title",
    description: "Easily update dishes, variations, prices & stock levels.",
    descriptionKey: "categories.sectionThree.menuManagement.description",
    icon: "/assets/sectionThree/menu.png",
  },
  {
    title: "Order & Delivery Flow",
    titleKey: "categories.sectionThree.orderDelivery.title",
    description: "Easily update dishes, variations, prices & stock levels.",
    descriptionKey: "categories.sectionThree.orderDelivery.description",
    icon: "/assets/sectionThree/order.png",
  },
  {
    title: "Sales & Analytics",
    titleKey: "categories.sectionThree.salesAnalytics.title",
    description:
      "Monitor revenue, popular items, peak hours & performance insights.",
    descriptionKey: "categories.sectionThree.salesAnalytics.description",
    icon: "/assets/sectionThree/analytics.png",
  },
  {
    title: "Customer Feedback",
    titleKey: "categories.sectionThree.customerFeedback.title",
    description:
      "View ratings, respond to reviews & boost your reputation.",
    descriptionKey: "categories.sectionThree.customerFeedback.description",
    icon: "/assets/sectionThree/feedback.png",
  },
  {
    title: "Promotions & Discounts",
    titleKey: "categories.sectionThree.promotions.title",
    description:
      "Create offers, promo codes & highlight best-selling meals.",
    descriptionKey: "categories.sectionThree.promotions.description",
    icon: "/assets/sectionThree/discount.png",
  },
  {
    title: "Staff & Role Control",
    titleKey: "categories.sectionThree.staffRoles.title",
    description:
      "Manage staff accounts, access levels & activity logs.",
    descriptionKey: "categories.sectionThree.staffRoles.description",
    icon: "/assets/sectionThree/staff.png",
  },
];
