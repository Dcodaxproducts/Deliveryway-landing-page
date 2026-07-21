"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LandingSettingsProvider } from "@/components/providers/LandingSettingsProvider";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/register";

  return (
    <I18nProvider>
      <LandingSettingsProvider>
        {!hideLayout && <Navbar />}
        <Toaster position="top-right" richColors />
        <div>{children}</div>
        {!hideLayout && <Footer />}
      </LandingSettingsProvider>
    </I18nProvider>
  );
}
