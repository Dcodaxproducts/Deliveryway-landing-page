"use client";

import { operationalExcellenceBlock } from "@/constants/categories";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";

export function OperationalExcellenceBlock() {
  const t = useTranslations();

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-16 px-4 lg:px-0">
      
      {/* Right Image */}
      <div className="flex-1 relative w-full sm:h-[300px] md:h-[350px] lg:h-[400px]">
        {/* Background visible only on lg screens */}
        <div className="hidden lg:block absolute -top-5 left-5 w-[570px] h-full bg-red-600/5 rounded-2xl z-0" />
        <Image
          src="/assets/categories/two.png"
          alt={t(operationalExcellenceBlock.imageAltKey)}
          className="rounded-xl relative z-10 w-full h-full object-cover"
          width={584}
          height={400}
        />
      </div>

      {/* Left Content */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        {/* Badge */}
        <div className="px-3 py-1 bg-red-600/10 rounded-full inline-flex items-center w-fit">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
            {t(operationalExcellenceBlock.badgeKey)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-snug sm:leading-10">
          {t(operationalExcellenceBlock.titleKey)}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-stone-700 leading-6 sm:leading-7">
          {t(operationalExcellenceBlock.descriptionKey)}
        </p>

        {/* Features List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {operationalExcellenceBlock.features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-2 sm:gap-3">
              {/* Tick Icon */}
              <div className="p-1 bg-red-600/10 rounded-full flex items-center justify-center">
                <FiCheck className="text-red-600 w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base font-bold text-neutral-900">{t(feature.titleKey)}</span>
                <span className="text-xs sm:text-sm text-stone-700">{t(feature.descKey)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="mt-4 px-6 py-3 bg-neutral-900 text-white font-bold rounded-lg w-fit">
          {t(operationalExcellenceBlock.buttonKey)}
        </button>
      </div>
    </div>
  );
}
