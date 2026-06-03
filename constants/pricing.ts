import type {
  ComparisonFeatureConfig,
  ComparisonValue,
  PricingPlanConfig,
  TranslatedTextKey,
} from "@/types/marketing";

export type FeatureValue = ComparisonValue;

export type FeatureRow = ComparisonFeatureConfig;

export interface FeatureSection {
  title: string;
  titleKey: TranslatedTextKey;
  rows: FeatureRow[];
}

export const comparisonSections: FeatureSection[] = [
  {
    title: "Core Operations",
    titleKey: "pricing.comparison.sections.coreOperations.title",
    rows: [
      {
        name: "Cloud POS Integration",
        nameKey: "pricing.comparison.features.cloudPosIntegration.name",
        starter: true,
        professional: true,
        enterprise: true,
      },
      {
        name: "Inventory Tracking",
        nameKey: "pricing.comparison.features.inventoryTracking.name",
        starter: "Basic",
        starterKey: "pricing.comparison.values.basic",
        professional: "Advanced",
        professionalKey: "pricing.comparison.values.advanced",
        enterprise: "Advanced + API",
        enterpriseKey: "pricing.comparison.values.advancedApi",
      },
      {
        name: "Kitchen Display System",
        nameKey: "pricing.comparison.features.kitchenDisplaySystem.name",
        starter: false,
        professional: true,
        enterprise: true,
      },
    ],
  },
  {
    title: "Management Tools",
    titleKey: "pricing.comparison.sections.managementTools.title",
    rows: [
      {
        name: "Staff Scheduling",
        nameKey: "pricing.comparison.features.staffScheduling.name",
        starter: false,
        professional: true,
        enterprise: true,
      },
      {
        name: "Mobile Management App",
        nameKey: "pricing.comparison.features.mobileManagementApp.name",
        starter: true,
        professional: true,
        enterprise: true,
      },
      {
        name: "Financial Reporting",
        nameKey: "pricing.comparison.features.financialReporting.name",
        starter: "Weekly",
        starterKey: "pricing.comparison.values.weekly",
        professional: "Real-time",
        professionalKey: "pricing.comparison.values.realTime",
        enterprise: "Real-time + Custom",
        enterpriseKey: "pricing.comparison.values.realTimeCustom",
      },
    ],
  },
];


export type Plan = PricingPlanConfig;

export const plans: Plan[] = [
  {
    name: "Starter",
    nameKey: "pricing.plans.starter.name",
    description: "Perfect for single locations and small cafes.",
    descriptionKey: "pricing.plans.starter.description",
    price: "$79",
    period: "/mo",
    features: ["Single Location", "Core POS Features", "Basic Inventory Tracking", "Email Support"],
    featureKeys: [
      "pricing.plans.starter.features.singleLocation",
      "pricing.plans.starter.features.corePosFeatures",
      "pricing.plans.starter.features.basicInventoryTracking",
      "pricing.plans.starter.features.emailSupport",
    ],
    buttonText: "Choose Starter",
    buttonTextKey: "pricing.plans.starter.buttonText",
  },
  {
    name: "Professional",
    nameKey: "pricing.plans.professional.name",
    description: "Optimized for growing full-service restaurants.",
    descriptionKey: "pricing.plans.professional.description",
    price: "$149",
    period: "/mo",
    features: [
      "Up to 3 Locations",
      "Advanced Labor Management",
      "Real-time Cost Analytics",
      "Smart Inventory Forecasts",
      "24/7 Priority Support",
    ],
    featureKeys: [
      "pricing.plans.professional.features.upToThreeLocations",
      "pricing.plans.professional.features.advancedLaborManagement",
      "pricing.plans.professional.features.realTimeCostAnalytics",
      "pricing.plans.professional.features.smartInventoryForecasts",
      "pricing.plans.professional.features.prioritySupport",
    ],
    buttonText: "Start Free Trial",
    buttonTextKey: "pricing.plans.professional.buttonText",
    highlighted: true,
  },
  {
    name: "Enterprise",
    nameKey: "pricing.plans.enterprise.name",
    description: "Custom solutions for large chains and franchises.",
    descriptionKey: "pricing.plans.enterprise.description",
    price: "Custom",
    features: ["Unlimited Locations", "Custom API Access", "Dedicated Account Manager", "On-site Implementation"],
    featureKeys: [
      "pricing.plans.enterprise.features.unlimitedLocations",
      "pricing.plans.enterprise.features.customApiAccess",
      "pricing.plans.enterprise.features.dedicatedAccountManager",
      "pricing.plans.enterprise.features.onsiteImplementation",
    ],
    buttonText: "Contact Sales",
    buttonTextKey: "pricing.plans.enterprise.buttonText",
  },
];
