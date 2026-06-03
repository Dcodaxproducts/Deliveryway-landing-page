export type FeatureValue = string | boolean;

export interface FeatureRow {
  name: string;
  starter: FeatureValue;
  professional: FeatureValue;
  enterprise: FeatureValue;
}

export interface FeatureSection {
  title: string;
  rows: FeatureRow[];
}

export const comparisonSections: FeatureSection[] = [
  {
    title: "Core Operations",
    rows: [
      { name: "Cloud POS Integration", starter: true, professional: true, enterprise: true },
      { name: "Inventory Tracking", starter: "Basic", professional: "Advanced", enterprise: "Advanced + API" },
      { name: "Kitchen Display System", starter: false, professional: true, enterprise: true },
    ],
  },
  {
    title: "Management Tools",
    rows: [
      { name: "Staff Scheduling", starter: false, professional: true, enterprise: true },
      { name: "Mobile Management App", starter: true, professional: true, enterprise: true },
      { name: "Financial Reporting", starter: "Weekly", professional: "Real-time", enterprise: "Real-time + Custom" },
    ],
  },
];


export interface Plan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "Perfect for single locations and small cafes.",
    price: "$79",
    period: "/mo",
    features: ["Single Location", "Core POS Features", "Basic Inventory Tracking", "Email Support"],
    buttonText: "Choose Starter",
  },
  {
    name: "Professional",
    description: "Optimized for growing full-service restaurants.",
    price: "$149",
    period: "/mo",
    features: [
      "Up to 3 Locations",
      "Advanced Labor Management",
      "Real-time Cost Analytics",
      "Smart Inventory Forecasts",
      "24/7 Priority Support",
    ],
    buttonText: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large chains and franchises.",
    price: "Custom",
    features: ["Unlimited Locations", "Custom API Access", "Dedicated Account Manager", "On-site Implementation"],
    buttonText: "Contact Sales",
  },
];
