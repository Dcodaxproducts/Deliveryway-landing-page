"use client";

import { team } from "@/constants/about";

import SectionHeader from "./SectionHeader";
import TeamCard from "../cards/TeamCard";

const MeetVisionaries = () => {
  return (
    <section className="w-full py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col gap-14">

        {/* Header */}
        <SectionHeader
          title="Meet the Visionaries"
          description="Leading the charge in redefining the food industry landscape."
        />

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
              image={member.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MeetVisionaries;
