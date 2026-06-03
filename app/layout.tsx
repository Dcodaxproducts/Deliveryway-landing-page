"use client";

import type { Metadata } from "next";
import "./globals.css";
import { onest } from "@/lib/fonts";
import { Navbar } from "@/components/navbar/navbar";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer/Footer";
import { Toaster } from "sonner";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // routes where layout should be hidden
  const hideLayout = ["/register"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${onest.className}`}>
        <I18nProvider>
          {!hideLayout && <Navbar />}
          <Toaster position="top-right" richColors />

          <div>{children}</div>
          {!hideLayout &&  <Footer />}
        </I18nProvider>
      </body>
    </html>
  );
}
