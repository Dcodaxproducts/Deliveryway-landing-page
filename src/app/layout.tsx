import type { Metadata } from "next";
import "./globals.css";
import { onest } from "@/lib/fonts";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: {
    default: "DeliveryWay | Restaurant delivery platform",
    template: "%s | DeliveryWay",
  },
  applicationName: "DeliveryWay",
  description:
    "DeliveryWay gives restaurants the tools to manage ordering, delivery, customers, and operations from one platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${onest.className}`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
