// src/constants/features.ts
import { Building2, Zap, Headphones } from "lucide-react";
import type { ServiceConfig } from "@/types/marketing";

export const sectionFiveFeatures: ServiceConfig[] = [
  {
    id: "create-account",
    title: "Create Your Restaurant Account",
    titleKey: "home.sectionFive.features.createAccount.title",
    description:
      "Set up your digital storefront in minutes. Upload your menu, define pricing, add food images, and start receiving orders instantly through our fully automated onboarding flow.",
    descriptionKey: "home.sectionFive.features.createAccount.description",
    icon: Building2,
  },
  {
    id: "real-time-orders",
    title: "Manage Orders in Real-Time",
    titleKey: "home.sectionFive.features.realTimeOrders.title",
    description:
      "Track new orders, accepted orders, rider assignments, and delivery progress — all updated live. Everything stays synchronized across devices.",
    descriptionKey: "home.sectionFive.features.realTimeOrders.description",
    icon: Zap,
  },
  {
    id: "support",
    title: "24/7 Support for Restaurants",
    titleKey: "home.sectionFive.features.support.title",
    description:
      "Get priority assistance at any time. From technical help to menu optimization, our support team ensures your operations run smoothly.",
    descriptionKey: "home.sectionFive.features.support.description",
    icon: Headphones,
  },
];
