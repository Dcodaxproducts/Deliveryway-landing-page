// src/constants/features.ts
import { Building2, Zap, Headphones } from "lucide-react";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const sectionFiveFeatures: FeatureItem[] = [
  {
    id: "create-account",
    title: "Create Your Restaurant Account",
    description:
      "Set up your digital storefront in minutes. Upload your menu, define pricing, add food images, and start receiving orders instantly through our fully automated onboarding flow.",
    icon: Building2,
  },
  {
    id: "real-time-orders",
    title: "Manage Orders in Real-Time",
    description:
      "Track new orders, accepted orders, rider assignments, and delivery progress — all updated live. Everything stays synchronized across devices.",
    icon: Zap,
  },
  {
    id: "support",
    title: "24/7 Support for Restaurants",
    description:
      "Get priority assistance at any time. From technical help to menu optimization, our support team ensures your operations run smoothly.",
    icon: Headphones,
  },
];
