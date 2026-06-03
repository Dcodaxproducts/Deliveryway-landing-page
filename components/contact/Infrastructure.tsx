"use client";

import { statsData } from "@/constants/contact";
import { ContactStatCard } from "../cards/ContactStatCard";


const Infrastructure = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#0F172AE5] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-white text-4xl font-bold leading-tight max-w-2xl">
            Global Support Infrastructure
          </h2>
          <p className="text-white/70 text-base max-w-xl leading-6">
            Providing seamless restaurant management solutions across 50+ countries with
            localized support teams.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <ContactStatCard key={idx} value={stat.value} label={stat.label} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Infrastructure;
