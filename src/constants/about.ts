
import { FiZap, FiHeart, FiShield } from "react-icons/fi";
import type { MarketingIcon, TeamMemberConfig, TranslatedTextKey } from "@/types/marketing";

interface TimelineItemConfig {
  year: string;
  title: string;
  titleKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  align: "left" | "right";
}

interface ValueConfig {
  title: string;
  titleKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  icon: MarketingIcon;
}

export const timelineData: TimelineItemConfig[] = [
  {
    year: "2023",
    title: "Founded with Vision",
    titleKey: "about.timeline.founded.title",
    description:
      "Our founders identified the friction between kitchen operations and digital ordering systems.",
    descriptionKey: "about.timeline.founded.description",
    align: "left",
  },
  {
    year: "2024",
    title: "The Great Pivot",
    titleKey: "about.timeline.pivot.title",
    description:
      "During the global pandemic, we helped over 10,000 restaurants transition to digital-only formats overnight.",
    descriptionKey: "about.timeline.pivot.description",
    align: "right",
  },
  {
    year: "2022",
    title: "Global Expansion",
    titleKey: "about.timeline.globalExpansion.title",
    description:
      "Opened offices in London, Singapore, and New York to better serve our growing international client base.",
    descriptionKey: "about.timeline.globalExpansion.description",
    align: "left",
  },
];



export const team: TeamMemberConfig[] = [
  {
    name: "Marcus Chen",
    role: "CEO & Co-Founder",
    roleKey: "about.team.marcus.role",
    description:
      "Ex-Google engineer with a passion for streamlining complex logistics.",
    descriptionKey: "about.team.marcus.description",
    image: "/about/CEO.png",
  },
  {
    name: "Sarah Jenkins",
    role: "CTO",
    roleKey: "about.team.sarah.role",
    description:
      "Leading our architecture to support 1M+ transactions per second.",
    descriptionKey: "about.team.sarah.description",
    image: "/about/COO.png",
  },
  {
    name: "David Rivera",
    role: "COO",
    roleKey: "about.team.david.role",
    description:
      "Focused on expanding our global footprint and operational excellence.",
    descriptionKey: "about.team.david.description",
    image: "/about/CTO.png",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Product",
    roleKey: "about.team.elena.role",
    description:
      "Designing intuitive experiences for both chefs and customers.",
    descriptionKey: "about.team.elena.description",
    image: "/about/head.png",
  },
];



export const values: ValueConfig[] = [
  {
    title: "Speed & Agility",
    titleKey: "about.values.speed.title",
    description:
      "The food industry moves fast. Our platform moves faster to keep you ahead of the curve.",
    descriptionKey: "about.values.speed.description",
    icon: FiZap,
  },
  {
    title: "Restaurant First",
    titleKey: "about.values.restaurantFirst.title",
    description:
      "Every feature we build starts with a conversation with a chef or restaurant owner.",
    descriptionKey: "about.values.restaurantFirst.description",
    icon: FiHeart,
  },
  {
    title: "Ironclad Trust",
    titleKey: "about.values.trust.title",
    description:
      "Your data and your revenue are safe with our enterprise-grade security protocols.",
    descriptionKey: "about.values.trust.description",
    icon: FiShield,
  },
];
