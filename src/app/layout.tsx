import type { Metadata } from "next";
import "./globals.css";
import { onest } from "@/lib/fonts";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: {
    default: "DeliveryWay | Lieferplattform für Restaurants",
    template: "%s | DeliveryWay",
  },
  applicationName: "DeliveryWay",
  description:
    "DeliveryWay bietet Restaurants alle Werkzeuge, um Bestellungen, Lieferungen, Kunden und Abläufe auf einer Plattform zu verwalten.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${onest.className}`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
