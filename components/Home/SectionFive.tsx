"use client";

import Image from "next/image";
import { sectionFiveFeatures } from "@/constants/features";
import FeatureCard from "../cards/FeatureCard";
import { useTranslations } from "next-intl";

export function SectionFive() {
  const t = useTranslations();

  return (
    <section className="w-full bg-white py-12 md:py-15">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <h2 className="leading-tight text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-heading">
              {t("home.sectionFive.titleLineOne")} <br className="hidden sm:block" />
              {t("home.sectionFive.titleLineTwo")}
            </h2>

            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-gray-600">
              {t("home.sectionFive.descriptionLineOne")}{" "}
              {t("home.sectionFive.descriptionLineTwo")}{" "}
              {t("home.sectionFive.descriptionLineThree")}
            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-8">
              {sectionFiveFeatures.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={t(feature.titleKey)}
                  description={t(feature.descriptionKey)}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <Image
              src="/assets/sectionFive/mobile.png"
              alt="Restaurant delivery mobile app"
              width={520}
              height={720}
              priority
              className="object-contain w-[280px] sm:w-[340px] md:w-[420px] lg:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
