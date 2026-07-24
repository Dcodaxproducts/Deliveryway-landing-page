"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LandingLogo } from "@/components/common/LandingLogo";
import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

const QUICK_LINKS = ["home", "about", "services", "contact"] as const;

const PRODUCT_LINKS = [
  "superAdminDashboard",
  "restaurantAdminDashboard",
  "customerApp",
  "driverApp",
  "merchantRestaurantApp",
] as const;

const COMPANY_LINKS = [
  { key: "about", href: "/about" },
  { key: "privacyPolicy", href: "/privacy-policy" },
  { key: "support", href: "/support" },
  { key: "termsOfService", href: "/terms-of-service" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const landingSettings = useLandingSettings();

  return (
    <footer className="relative bg-gray-100 pt-20">
      {/* FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {/* GRID WITH SPACE-BETWEEN BEHAVIOR */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr_1fr_auto]">
          {/* LOGO + SUBSCRIBE (LEFT) */}
          <div className="max-w-[400px]">
            <div className="flex items-center gap-2">
              <LandingLogo className="h-[72px] w-[190px] rounded-xl bg-white object-contain" />
            </div>

            {landingSettings.footerDescription ? (
              <p className="mt-4 text-[15px] text-gray-600">
                {landingSettings.footerDescription}
              </p>
            ) : null}

            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {landingSettings.supportEmail ? (
                <p>{landingSettings.supportEmail}</p>
              ) : null}
              {landingSettings.supportPhone ? (
                <p>{landingSettings.supportPhone}</p>
              ) : null}
              {landingSettings.address ? (
                <p>{landingSettings.address}</p>
              ) : null}
            </div>

            <h4 className="mt-6 font-heading font-semibold text-gray-900">
              {t("subscribe")}
            </h4>
            <p className="mt-2 text-[15px] text-gray-600">
              {t("newsletterText")}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-white p-2 shadow-sm">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full bg-transparent px-3 text-sm outline-none"
              />
              <button className="rounded-full bg-black px-5 py-2 text-sm text-white">
                {t("subscribe")}
              </button>
            </div>

            <p className="mt-3.5 text-[13px] text-gray-500">
              {t("privacyAgreement")}{" "}
              <Link href="/privacy-policy" className="underline">
                {t("privacyPolicy")}
              </Link>
            </p>
          </div>

          {/* QUICK LINKS (CENTER LEFT) */}
          <div>
            <h4 className="font-heading font-bold text-gray-900">
              {t("quickLinks")}
            </h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              {QUICK_LINKS.map((link) => (
                <li key={link}>{t(link)}</li>
              ))}
            </ul>
          </div>

          {/* PRODUCTS (CENTER RIGHT) */}
          <div>
            <h4 className="font-medium text-gray-900">{t("products")}</h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              {PRODUCT_LINKS.map((link) => (
                <li key={link}>{t(link)}</li>
              ))}
            </ul>
          </div>

          {/* COMPANY (RIGHT) */}
          <div className="md:text-left">
            <h4 className="font-medium text-gray-900">{t("company")}</h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="hover:text-black">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-gray-300" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            {landingSettings.copyrightText || t("copyright")}
          </p>

          <div className="flex items-center gap-4">
            <SocialLink
              href={landingSettings.socialLinks.facebook}
              label="Facebook"
            >
              <FaFacebookF className="h-4 w-4" />
            </SocialLink>
            <SocialLink
              href={landingSettings.socialLinks.twitter}
              label="Twitter"
            >
              <FaTwitter className="h-4 w-4" />
            </SocialLink>
            <SocialLink
              href={landingSettings.socialLinks.instagram}
              label="Instagram"
            >
              <FaInstagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink
              href={landingSettings.socialLinks.youtube}
              label="YouTube"
            >
              <FaYoutube className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-gray-600 hover:text-black"
    >
      {children}
    </a>
  );
}
