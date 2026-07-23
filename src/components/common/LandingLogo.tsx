"use client";

import { useEffect, useState } from "react";

import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

const FALLBACK_LOGO = "/assets/deliveryway-logo.jpg";

type LandingLogoProps = {
  className?: string;
};

export function LandingLogo({ className }: LandingLogoProps) {
  const landingSettings = useLandingSettings();
  const source = landingSettings.logoUrl || FALLBACK_LOGO;
  const [logoSource, setLogoSource] = useState(source);

  useEffect(() => {
    setLogoSource(source);
  }, [source]);

  return (
    <img
      src={logoSource}
      alt={landingSettings.businessName}
      className={className}
      onError={() => {
        if (logoSource !== FALLBACK_LOGO) {
          setLogoSource(FALLBACK_LOGO);
        }
      }}
    />
  );
}
