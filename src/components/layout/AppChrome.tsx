"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { I18nProvider } from "@/components/providers/I18nProvider";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/register";

  return (
    <I18nProvider>
      {!hideLayout && <Navbar />}
      <Toaster position="top-right" richColors />
      <div>{children}</div>
      {!hideLayout && <Footer />}
    </I18nProvider>
  );
}
