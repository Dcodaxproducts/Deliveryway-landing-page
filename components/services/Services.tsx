"use client";

import { services } from "@/constants/services";
import { useTranslations } from "next-intl";
import { ServiceCard } from "../cards/ServiceCard";

export const Services = () => {
  const t = useTranslations();

  return (
    <section className="w-full bg-white py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            title={t(service.titleKey)}
            description={t(service.descriptionKey)}
          />
        ))}
      </div>
    </section>
  );
};
