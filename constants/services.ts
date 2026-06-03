
import { Calendar, CreditCard, Factory } from "lucide-react";
import type {
  IconCardConfig,
  ServiceConfig,
  StatConfig,
  TranslatedTextKey,
} from "@/types/marketing";

interface ServicesBlockConfig {
  titleKey: TranslatedTextKey;
  descriptionKey: TranslatedTextKey;
  featureKeys: TranslatedTextKey[];
}

interface DemoRequestConfig {
  titleKey: TranslatedTextKey;
  descriptionKey: TranslatedTextKey;
  formTitleKey: TranslatedTextKey;
}

interface ServiceStatConfig extends StatConfig {
  labelKey: TranslatedTextKey;
}

export const services: ServiceConfig[] = [
  {
    id: "inventory-management",
    icon: Factory,
    title: "Inventory Management",
    titleKey: "services.items.inventoryManagement.title",
    description:
      "Real-time tracking of ingredients, waste monitoring, and automated reordering to keep your costs down and kitchen running smoothly.",
    descriptionKey: "services.items.inventoryManagement.description",
  },
  {
    id: "staff-scheduling",
    icon: Calendar,
    title: "Staff Scheduling",
    titleKey: "services.items.staffScheduling.title",
    description:
      "Easily manage shifts, monitor labor costs, and streamline employee communication with our intuitive drag-and-drop scheduling tool.",
    descriptionKey: "services.items.staffScheduling.description",
  },
  {
    id: "pos-integration",
    icon: CreditCard,
    title: "POS Integration",
    titleKey: "services.items.posIntegration.title",
    description:
      "Connect your existing hardware seamlessly. Sync orders, payments, and kitchen displays in real-time for zero friction service.",
    descriptionKey: "services.items.posIntegration.description",
  },
];

export const builtForChefsConfig = {
  titleKey: "services.builtForChefs.title",
  descriptionKey: "services.builtForChefs.description",
  featureKeys: [
    "services.builtForChefs.features.uptime",
    "services.builtForChefs.features.prioritySupport",
    "services.builtForChefs.features.mobileFirst",
  ],
} satisfies ServicesBlockConfig;

export const stats: ServiceStatConfig[] = [
  { value: "500+", label: "Locations Supported", labelKey: "services.stats.locationsSupported.label" },
  { value: "99%", label: "Customer Satisfaction", labelKey: "services.stats.customerSatisfaction.label" },
];

export const requestDemoConfig = {
  titleKey: "services.requestDemo.title",
  descriptionKey: "services.requestDemo.description",
  formTitleKey: "services.requestDemo.formTitle",
} satisfies DemoRequestConfig;

export const servicesHero = {
  badgeKey: "services.hero.badge",
  titleLineOneKey: "services.hero.titleLineOne",
  titleLineTwoKey: "services.hero.titleLineTwo",
  descriptionKey: "services.hero.description",
  secondaryCtaKey: "services.hero.secondaryCta",
} as const;

export const serviceCardAction = {
  learnMoreKey: "services.actions.learnMore",
} as const;

export const operationalFeatures: IconCardConfig[] = [
  {
    id: "multi-channel-sync",
    title: "Multi-Channel Sync",
    titleKey: "services.operationalExcellence.features.multiChannelSync.title",
    desc: "Aggregated orders from UberEats, DoorDash, and your website.",
    descKey: "services.operationalExcellence.features.multiChannelSync.description",
  },
  {
    id: "kitchen-display",
    title: "Kitchen Display System (KDS)",
    titleKey: "services.operationalExcellence.features.kitchenDisplay.title",
    desc: "Direct paperless communication between FOH and kitchen.",
    descKey: "services.operationalExcellence.features.kitchenDisplay.description",
  },
  {
    id: "real-time-dispatch",
    title: "Real-time Dispatch",
    titleKey: "services.operationalExcellence.features.realTimeDispatch.title",
    desc: "Coordinate with local drivers or 3PL delivery partners instantly.",
    descKey: "services.operationalExcellence.features.realTimeDispatch.description",
  },
];
