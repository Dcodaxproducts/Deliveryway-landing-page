import type { TranslatedTextKey } from "@/types/marketing";

interface SectionTwoStatConfig {
  icon: string;
  value: string;
  title: string;
  titleKey: TranslatedTextKey;
  iconSize: number;
}

export const sectionTwoStats: SectionTwoStatConfig[] = [
  {
    icon: "/assets/sectionTwo/users.png",
    value: "120K+",
    title:
      "A complete operating system designed to help restaurants increase revenue and run daily operations effortlessly.",
    titleKey: "home.sectionTwo.stats.operatingSystem.title",
    iconSize: 76,
  },
  {
    icon: "/assets/sectionTwo/star.png",
    value: "500+",
    title:
      "Trusted by restaurant owners for its unmatched reliability, intuitive design, and real-time order control.",
    titleKey: "home.sectionTwo.stats.trustedOwners.title",
    iconSize: 30,
  },
  {
    icon: "/assets/sectionTwo/location.png",
    value: "89+",
    title:
      "We help restaurants grow with a strong presence across multiple regions and delivery networks.",
    titleKey: "home.sectionTwo.stats.regionalGrowth.title",
    iconSize: 30,
  },
];
