"use client";

import { values } from "@/constants/about";
import SectionHeader from "./SectionHeader";
import ValueCard from "../cards/ValueCard";


const Values = () => {
  return (
    <section className="w-full py-16 lg:py-20 bg-slate-50">
      <div className="mx-auto px-6 lg:px-30 flex flex-col gap-14">

        {/* Header */}
        <SectionHeader
          title="Values That Drive Us"
          description="The core principles behind every line of code we write."
          align="left"
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <ValueCard
              key={index}
              title={item.title}
              description={item.description}
              Icon={item.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Values;
