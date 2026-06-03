
import type { IconCardConfig, StatConfig, TranslatedTextKey } from "@/types/marketing";

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

interface CategoryFeatureBlockConfig {
  badgeKey: TranslatedTextKey;
  titleKey: TranslatedTextKey;
  descriptionKey: TranslatedTextKey;
  buttonKey: TranslatedTextKey;
  imageAltKey: TranslatedTextKey;
  features: IconCardConfig[];
}

interface SalesAnalyticsChartConfig {
  titleKey: TranslatedTextKey;
  subtitleKey: TranslatedTextKey;
}

interface CategoryStatConfig extends StatConfig {
  labelKey: TranslatedTextKey;
}

export const categoriesHero = {
  badgeKey: "categories.hero.badge",
  titleLineOneKey: "categories.hero.titleLineOne",
  titleLineTwoKey: "categories.hero.titleLineTwo",
  descriptionKey: "categories.hero.description",
  secondaryCtaKey: "categories.hero.secondaryCta",
} as const;

export const digitalFirstBlock = {
  badgeKey: "categories.digitalFirst.badge",
  titleKey: "categories.digitalFirst.title",
  descriptionKey: "categories.digitalFirst.description",
  buttonKey: "categories.digitalFirst.button",
  imageAltKey: "categories.digitalFirst.imageAlt",
  features: [
    {
      id: "qr-code-integration",
      title: "QR Code Integration",
      titleKey: "categories.digitalFirst.features.qrCode.title",
      desc: "Instant QR generation for contact-less tableside ordering.",
      descKey: "categories.digitalFirst.features.qrCode.description",
    },
    {
      id: "inventory-sync",
      title: "Inventory Sync",
      titleKey: "categories.digitalFirst.features.inventorySync.title",
      desc: "Automatically hide out-of-stock items across all platforms.",
      descKey: "categories.digitalFirst.features.inventorySync.description",
    },
    {
      id: "dietary-tagging",
      title: "Dietary Tagging",
      titleKey: "categories.digitalFirst.features.dietaryTagging.title",
      desc: "Easily mark allergens and special diet options (GF, Vegan, etc).",
      descKey: "categories.digitalFirst.features.dietaryTagging.description",
    },
  ],
} satisfies CategoryFeatureBlockConfig;

export const operationalExcellenceBlock = {
  badgeKey: "categories.operationalExcellence.badge",
  titleKey: "categories.operationalExcellence.title",
  descriptionKey: "categories.operationalExcellence.description",
  buttonKey: "categories.operationalExcellence.button",
  imageAltKey: "categories.operationalExcellence.imageAlt",
  features: [
    {
      id: "multi-channel-sync",
      title: "Multi-Channel Sync",
      titleKey: "categories.operationalExcellence.features.multiChannelSync.title",
      desc: "Aggregated orders from UberEats, DoorDash, and your website.",
      descKey: "categories.operationalExcellence.features.multiChannelSync.description",
    },
    {
      id: "kitchen-display",
      title: "Kitchen Display System (KDS)",
      titleKey: "categories.operationalExcellence.features.kitchenDisplay.title",
      desc: "Direct paperless communication between FOH and kitchen.",
      descKey: "categories.operationalExcellence.features.kitchenDisplay.description",
    },
    {
      id: "real-time-dispatch",
      title: "Real-time Dispatch",
      titleKey: "categories.operationalExcellence.features.realTimeDispatch.title",
      desc: "Coordinate with local drivers or 3PL delivery partners instantly.",
      descKey: "categories.operationalExcellence.features.realTimeDispatch.description",
    },
  ],
} satisfies CategoryFeatureBlockConfig;

export const salesAnalyticsStats: CategoryStatConfig[] = [
  { value: "18%", label: "Revenue Growth", labelKey: "categories.salesAnalytics.stats.revenueGrowth.label" },
  { value: "32s", label: "Avg Order Speed", labelKey: "categories.salesAnalytics.stats.avgOrderSpeed.label" },
];

export const salesAnalyticsFeatures: IconCardConfig[] = [
  {
    id: "profit-heatmaps",
    title: "Profit Heatmaps",
    titleKey: "categories.salesAnalytics.features.profitHeatmaps.title",
    desc: "Identify high-margin items vs volume sellers.",
    descKey: "categories.salesAnalytics.features.profitHeatmaps.description",
  },
  {
    id: "labor-cost-analysis",
    title: "Labor Cost Analysis",
    titleKey: "categories.salesAnalytics.features.laborCostAnalysis.title",
    desc: "Optimize staffing based on historical sales trends.",
    descKey: "categories.salesAnalytics.features.laborCostAnalysis.description",
  },
];

export const salesAnalyticsChart = {
  titleKey: "categories.salesAnalytics.chart.title",
  subtitleKey: "categories.salesAnalytics.chart.subtitle",
} satisfies SalesAnalyticsChartConfig;
