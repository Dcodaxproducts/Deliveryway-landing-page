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
  faqs: LandingPageFaq[];
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
