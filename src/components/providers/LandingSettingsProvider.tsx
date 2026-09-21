"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { API_BASE_URL } from "@/lib/constants";

export type LandingSettings = {
  businessName: string;
  logoUrl: string | null;
  footerDescription: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  address: string | null;
  copyrightText: string;
  socialLinks: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    youtube: string | null;
  };
  home: LandingHomeSettings;
  pages: LandingPagePages;
  faqs: LandingPageFaq[];
};

export type LandingHomeContentBlock = {
  headingEn: string | null;
  headingDe: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  checklistEn: string[];
  checklistDe: string[];
  imageUrl: string | null;
  isVisible: boolean;
};

export type LandingHomeSettings = {
  hero: {
    badgeEn: string | null;
    badgeDe: string | null;
    headingEn: string | null;
    headingDe: string | null;
    subheadingEn: string | null;
    subheadingDe: string | null;
    imageUrl: string | null;
    primaryCtaEn: string | null;
    primaryCtaDe: string | null;
    primaryCtaUrl: string | null;
    secondaryCtaEn: string | null;
    secondaryCtaDe: string | null;
    secondaryCtaUrl: string | null;
  };
  featuredRestaurants: {
    headingEn: string | null;
    headingDe: string | null;
    restaurantIds: string[];
    items: Array<{ id: string; name: string; logoUrl: string | null }>;
    isVisible: boolean;
  };
  growth: LandingHomeContentBlock;
  orderManagement: LandingHomeContentBlock;
  appDownload: {
    headingEn: string | null;
    headingDe: string | null;
    descriptionEn: string | null;
    descriptionDe: string | null;
    backgroundImageUrl: string | null;
    googlePlayUrl: string | null;
    appStoreUrl: string | null;
    isVisible: boolean;
  };
};

export type LandingPageHero = {
  eyebrowEn: string | null;
  eyebrowDe: string | null;
  headingEn: string | null;
  headingDe: string | null;
  subheadingEn: string | null;
  subheadingDe: string | null;
};

export type LandingPageContent = {
  hero: LandingPageHero;
  contentEn: string | null;
  contentDe: string | null;
};

export type LandingPagePages = {
  services: LandingPageContent;
  pricing: LandingPageContent;
  about: LandingPageContent;
  privacyPolicy: LandingPageContent;
  support: LandingPageContent;
  termsOfService: LandingPageContent;
  contact: LandingPageContent;
};

export type LandingPageFaq = {
  id: string;
  questionEn: string;
  answerEn: string;
  questionDe: string;
  answerDe: string;
  isActive: boolean;
  sortOrder: number;
};

const createEmptyPage = (): LandingPageContent => ({
  hero: {
    eyebrowEn: null,
    eyebrowDe: null,
    headingEn: null,
    headingDe: null,
    subheadingEn: null,
    subheadingDe: null,
  },
  contentEn: null,
  contentDe: null,
});

const DEFAULT_SETTINGS: LandingSettings = {
  businessName: "DeliveryWay",
  logoUrl: null,
  footerDescription: null,
  supportEmail: null,
  supportPhone: null,
  address: null,
  copyrightText: `© ${new Date().getFullYear()} DeliveryWay. All rights reserved.`,
  socialLinks: {
    facebook: null,
    twitter: null,
    instagram: null,
    youtube: null,
  },
  home: {
    hero: {
      badgeEn: null,
      badgeDe: null,
      headingEn: null,
      headingDe: null,
      subheadingEn: null,
      subheadingDe: null,
      imageUrl: null,
      primaryCtaEn: null,
      primaryCtaDe: null,
      primaryCtaUrl: null,
      secondaryCtaEn: null,
      secondaryCtaDe: null,
      secondaryCtaUrl: null,
    },
    featuredRestaurants: {
      headingEn: null,
      headingDe: null,
      restaurantIds: [],
      items: [],
      isVisible: false,
    },
    growth: {
      headingEn: null,
      headingDe: null,
      descriptionEn: null,
      descriptionDe: null,
      checklistEn: [],
      checklistDe: [],
      imageUrl: null,
      isVisible: false,
    },
    orderManagement: {
      headingEn: null,
      headingDe: null,
      descriptionEn: null,
      descriptionDe: null,
      checklistEn: [],
      checklistDe: [],
      imageUrl: null,
      isVisible: false,
    },
    appDownload: {
      headingEn: null,
      headingDe: null,
      descriptionEn: null,
      descriptionDe: null,
      backgroundImageUrl: null,
      googlePlayUrl: null,
      appStoreUrl: null,
      isVisible: false,
    },
  },
  pages: {
    services: createEmptyPage(),
    pricing: createEmptyPage(),
    about: createEmptyPage(),
    privacyPolicy: createEmptyPage(),
    support: createEmptyPage(),
    termsOfService: createEmptyPage(),
    contact: createEmptyPage(),
  },
  faqs: [],
};

const LandingSettingsContext = createContext(DEFAULT_SETTINGS);

export function LandingSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const controller = new AbortController();
    const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/v1/admin/global-settings/public/landing-page`;

    void fetch(endpoint, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        const data = response?.data;
        if (!data) return;

        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          socialLinks: {
            ...DEFAULT_SETTINGS.socialLinks,
            ...(data.socialLinks || {}),
          },
          home: normalizeHome(data.home),
          pages: {
            services: normalizePage(data.pages?.services),
            pricing: normalizePage(data.pages?.pricing),
            about: normalizePage(data.pages?.about),
            privacyPolicy: normalizePage(data.pages?.privacyPolicy),
            support: normalizePage(data.pages?.support),
            termsOfService: normalizePage(data.pages?.termsOfService),
            contact: normalizePage(data.pages?.contact),
          },
          faqs: Array.isArray(data.faqs) ? data.faqs : [],
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = `${settings.businessName} | Restaurant delivery platform`;
  }, [settings.businessName]);

  return (
    <LandingSettingsContext.Provider value={settings}>
      {children}
    </LandingSettingsContext.Provider>
  );
}

export const useLandingSettings = () => useContext(LandingSettingsContext);

const normalizePage = (
  page: Partial<LandingPageContent> | null | undefined,
): LandingPageContent => {
  const empty = createEmptyPage();
  return {
    ...empty,
    ...page,
    hero: {
      ...empty.hero,
      ...(page?.hero || {}),
    },
  };
};

const normalizeHome = (
  home: Partial<LandingHomeSettings> | null | undefined,
): LandingHomeSettings => ({
  hero: { ...DEFAULT_SETTINGS.home.hero, ...(home?.hero || {}) },
  featuredRestaurants: {
    ...DEFAULT_SETTINGS.home.featuredRestaurants,
    ...(home?.featuredRestaurants || {}),
    restaurantIds: Array.isArray(home?.featuredRestaurants?.restaurantIds)
      ? home.featuredRestaurants.restaurantIds
      : [],
    items: Array.isArray(home?.featuredRestaurants?.items)
      ? home.featuredRestaurants.items
      : [],
  },
  growth: { ...DEFAULT_SETTINGS.home.growth, ...(home?.growth || {}) },
  orderManagement: {
    ...DEFAULT_SETTINGS.home.orderManagement,
    ...(home?.orderManagement || {}),
  },
  appDownload: {
    ...DEFAULT_SETTINGS.home.appDownload,
    ...(home?.appDownload || {}),
  },
});
