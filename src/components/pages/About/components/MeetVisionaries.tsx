"use client";

import { team } from "@/constants/about";

import { SectionHeader } from "./SectionHeader";
import { TeamCard } from "@/components/common/cards/TeamCard";
import { useTranslations } from "next-intl";

export function MeetVisionaries() {
  const t = useTranslations();

  return (
    <section className="w-full py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col gap-14">

        {/* Header */}
        <SectionHeader
          title={t("about.teamSection.title")}
          description={t("about.teamSection.description")}
        />

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              role={t(member.roleKey)}
              description={t(member.descriptionKey)}
              image={member.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
