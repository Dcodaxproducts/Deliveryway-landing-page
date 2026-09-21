"use client";

import { useLocale } from "next-intl";
import Image from "next/image";

import { useLandingSettings } from "@/components/providers/LandingSettingsProvider";

export function SectionFour() {
  const locale = useLocale();
  const section = useLandingSettings().home.featuredRestaurants;
  const heading = locale.startsWith("de")
    ? section.headingDe
    : section.headingEn;

  if (!section.isVisible || section.items.length === 0) return null;

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        {heading ? (
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            {heading}
          </h2>
        ) : null}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex min-h-32 items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              {restaurant.logoUrl ? (
                <Image
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  width={240}
                  height={64}
                  unoptimized
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="font-semibold text-gray-900">
                  {restaurant.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
