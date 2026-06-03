import { sectionTwoStats } from "@/constants/stats";
import StatsCard from "../cards/StatsCard";

export default function SectionTwo() {
  return (
    <section className="w-full bg-white py-8 pt-20 md:py-10 md:pt-35">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-20">
          {sectionTwoStats.map((item, index) => (
            <StatsCard
              key={index}
              icon={item.icon}
              value={item.value}
              title={item.title}
              iconSize={item.iconSize}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
