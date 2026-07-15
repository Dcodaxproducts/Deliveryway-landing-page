import type { IconCardConfig, TranslatedTextKey } from "@/types/marketing";

export const features: IconCardConfig[] = [
  {
    title: "Multi-Channel Sync",
    titleKey: "home.sectionSix.features.multiChannelSync.title",
    desc: "Aggregated orders from UberEats, DoorDash, and your website.",
    descKey: "home.sectionSix.features.multiChannelSync.description",
  },
  {
    title: "Kitchen Display System (KDS)",
    titleKey: "home.sectionSix.features.kitchenDisplay.title",
    desc: "Direct paperless communication between FOH and kitchen.",
    descKey: "home.sectionSix.features.kitchenDisplay.description",
  },
  {
    title: "Real-time Dispatch",
    titleKey: "home.sectionSix.features.realTimeDispatch.title",
    desc: "Coordinate with local drivers or 3PL delivery partners instantly.",
    descKey: "home.sectionSix.features.realTimeDispatch.description",
  },
];

interface ChecklistSectionConfig {
  descriptionKey: TranslatedTextKey;
  checklistKeys: TranslatedTextKey[];
}

interface HomeCategoryCopyConfig {
  titleKey: TranslatedTextKey;
  descriptionKey: TranslatedTextKey;
}

export const homeSectionThreeCategoryCopy: HomeCategoryCopyConfig[] = [
  {
    titleKey: "home.sectionThree.categories.menuManagement.title",
    descriptionKey: "home.sectionThree.categories.menuManagement.description",
  },
  {
    titleKey: "home.sectionThree.categories.orderDelivery.title",
    descriptionKey: "home.sectionThree.categories.orderDelivery.description",
  },
  {
    titleKey: "home.sectionThree.categories.salesAnalytics.title",
    descriptionKey: "home.sectionThree.categories.salesAnalytics.description",
  },
  {
    titleKey: "home.sectionThree.categories.customerFeedback.title",
    descriptionKey: "home.sectionThree.categories.customerFeedback.description",
  },
  {
    titleKey: "home.sectionThree.categories.promotions.title",
    descriptionKey: "home.sectionThree.categories.promotions.description",
  },
  {
    titleKey: "home.sectionThree.categories.staffRoles.title",
    descriptionKey: "home.sectionThree.categories.staffRoles.description",
  },
] as const;

export const homeChecklistSections = {
  growth: {
    descriptionKey: "home.sectionSix.description",
    checklistKeys: [
      "home.sectionSix.checklist.manageOrders",
      "home.sectionSix.checklist.performanceTools",
      "home.sectionSix.checklist.fasterDeliveries",
    ],
  },
  orderManagement: {
    descriptionKey: "home.sectionSeven.description",
    checklistKeys: [
      "home.sectionSeven.checklist.orderFlow",
      "home.sectionSeven.checklist.menuControls",
    ],
  },
} satisfies Record<string, ChecklistSectionConfig>;

export const appStoreButtons = [
  {
    href: "#",
    imageSrc: "/assets/sectionNine/google_store.png",
    imageAltKey: "home.sectionNine.store.googlePlayAlt",
    eyebrowKey: "home.sectionNine.store.googlePlayEyebrow",
    labelKey: "home.sectionNine.store.googlePlay",
  },
  {
    href: "#",
    imageSrc: "/assets/sectionNine/apple_store.png",
    imageAltKey: "home.sectionNine.store.appStoreAlt",
    eyebrowKey: "home.sectionNine.store.appStoreEyebrow",
    labelKey: "home.sectionNine.store.appStore",
  },
] as const;
