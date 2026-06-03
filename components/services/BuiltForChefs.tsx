"use client";

import { builtForChefsConfig } from "@/constants/services";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PiCheckCircleFill } from "react-icons/pi";

export const BuiltForChefs = () => {
  const t = useTranslations();

  return (
    <section className="w-full bg-slate-50 py-16 px-6 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left Image */}
<div className="flex-1 w-full">
  <div className="relative  h-[400px] sm:h-[450px] lg:h-[500px] p-0">
    <Image
      src="/services/chef.png"
      alt="Chef working"
      fill
      className="object-cover rounded-2xl "
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  </div>
</div>


        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6 -mt-7">
          
          {/* Heading */}
          <h2 className="text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t(builtForChefsConfig.titleKey)}
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-base sm:text-lg leading-7">
            {t(builtForChefsConfig.descriptionKey)}
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-4 mt-2">
            {builtForChefsConfig.featureKeys.map((featureKey) => (
              <div key={featureKey} className="flex items-center gap-3">
              <PiCheckCircleFill className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-slate-900 text-base font-medium">{t(featureKey)}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
