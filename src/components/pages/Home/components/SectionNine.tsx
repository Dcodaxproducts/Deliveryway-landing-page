"use client";

import Image from "next/image";
import { appStoreButtons } from "@/constants/home";
import { useTranslations } from "next-intl";

export function SectionNine() {
  const t = useTranslations();

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-4 bg-[#000000] rounded-[32px] md:rounded-[40px]">
      <div
        className="rounded-2xl md:rounded-3xl bg-cover bg-center px-4 sm:px-6 py-14 sm:py-18 md:py-21 text-center text-white md:px-16"
        style={{
          backgroundImage: "url('/assets/sectionNine/background.png')",
        }}
      >
        <h2 className="mx-auto max-w-3xl text-2xl sm:text-3xl md:text-4xl font-bold leading-tight font-heading">
          {t("home.sectionNine.titleLineOne")} <br className="hidden sm:block" />
          {t("home.sectionNine.titleLineTwo")}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-[16px] leading-relaxed text-gray-200">
          {t("home.sectionNine.descriptionLineOne")}{" "}
          {t("home.sectionNine.descriptionLineTwo")}{" "}
          {t("home.sectionNine.descriptionLineThree")}
          <br className="hidden sm:block" />
          {t("home.sectionNine.descriptionLineFour")}{" "}
          {t("home.sectionNine.descriptionLineFive")}
        </p>

        {/* STORE BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {appStoreButtons.map((button) => (
            <a
              key={button.labelKey}
              href={button.href}
              className="w-full sm:w-[180px] flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-md transition hover:scale-105"
            >
              <Image
                src={button.imageSrc}
                alt={t(button.imageAltKey)}
                width={23}
                height={23}
                className="object-contain"
              />
              <span className="text-[13px] font-medium text-black text-left leading-tight">
                {t(button.eyebrowKey)} <br />
                <span className="text-[16px] font-bold font-google">
                  {t(button.labelKey)}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
