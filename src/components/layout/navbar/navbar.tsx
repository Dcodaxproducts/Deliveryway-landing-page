"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LanguageSelector } from "@/components/layout/navbar/LanguageSelector";
import { useTranslations } from "next-intl";

const NAVIGATION_LINKS = [
  { href: "/about", labelKey: "about" },
  { href: "/services", labelKey: "services" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/contact", labelKey: "contact" },
] as const;

const MOBILE_NAVIGATION_LINKS = [
  { href: "#", labelKey: "about" },
  { href: "#", labelKey: "services" },
  { href: "#", labelKey: "pricing" },
  { href: "#", labelKey: "contact" },
] as const;

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("navigation");

  return (
    <>
      {/* OUTER BAR */}
      <nav className="w-full bg-[#CE181B] px-4 py-4 relative z-30">
        {/* INNER CONTAINER */}
        <div className="mx-auto max-w-7xl">
          <div className="flex h-[64px] items-center justify-between rounded-full bg-[rgba(255,255,255,0.09)] pl-7 pr-3">
            {/* LEFT: LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push('/')}>
              <Image
                src="/assets/deliveryway-logo.jpg"
                alt="DeliveryWay"
                width={686}
                height={541}
                className="h-[52px] w-[148px] rounded-xl bg-white object-contain"
                priority
              />
            </div>

            {/* CENTER: LINKS (DESKTOP) */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-sans text-white ml-20">
              {NAVIGATION_LINKS.map((link) => (
                <Link href={link.href} className="hover:opacity-80" key={link.href}>
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>

            {/* RIGHT: CTA + MOBILE MENU */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              <Button
                className="hidden md:inline-flex rounded-full bg-white px-7 py-3 text-[15px] font-sans font-medium text-[#CE181B] hover:bg-white/90"
              onClick={()=>router.push("/register")}
              >
                {t("registration")}
              </Button>

              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 text-white md:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label={t("openMenu")}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="relative ml-auto h-full w-72 bg-white shadow-xl">
            {/* CLOSE */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg bg-gray-100 p-2"
                aria-label={t("closeMenu")}
              >
                <X size={18} />
              </button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-6 px-6 text-sm font-medium text-gray-800">
              {MOBILE_NAVIGATION_LINKS.map((link) => (
                <Link href={link.href} key={link.labelKey}>
                  {t(link.labelKey)}
                </Link>
              ))}

              <div className="w-fit rounded-full bg-[#CE181B]">
                <LanguageSelector />
              </div>

              <Button className="mt-4 py-3 rounded-full bg-[#CE181B] text-white hover:bg-[#b51619]" onClick={()=>router.push("/register")}>
                {t("registrationSignIn")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
