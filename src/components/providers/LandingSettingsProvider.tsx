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
  home: {
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
};

type LandingHomeContentBlock = {
  headingEn: string | null;
  headingDe: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  checklistEn: string[];
  checklistDe: string[];
  imageUrl: string | null;
  isVisible: boolean;
};

const emptyHomeBlock = (): LandingHomeContentBlock => ({
  headingEn: null,
  headingDe: null,
  descriptionEn: null,
  descriptionDe: null,
  checklistEn: [],
  checklistDe: [],
  imageUrl: null,
  isVisible: true,
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
      isVisible: true,
    },
    growth: emptyHomeBlock(),
    orderManagement: emptyHomeBlock(),
    appDownload: {
      headingEn: null,
      headingDe: null,
      descriptionEn: null,
      descriptionDe: null,
      backgroundImageUrl: null,
      googlePlayUrl: null,
      appStoreUrl: null,
      isVisible: true,
    },
  },
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
          home: {
            ...DEFAULT_SETTINGS.home,
            ...(data.home || {}),
            hero: {
              ...DEFAULT_SETTINGS.home.hero,
              ...(data.home?.hero || {}),
            },
            featuredRestaurants: {
              ...DEFAULT_SETTINGS.home.featuredRestaurants,
              ...(data.home?.featuredRestaurants || {}),
            },
            growth: {
              ...DEFAULT_SETTINGS.home.growth,
              ...(data.home?.growth || {}),
            },
            orderManagement: {
              ...DEFAULT_SETTINGS.home.orderManagement,
              ...(data.home?.orderManagement || {}),
            },
            appDownload: {
              ...DEFAULT_SETTINGS.home.appDownload,
              ...(data.home?.appDownload || {}),
            },
          },
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
