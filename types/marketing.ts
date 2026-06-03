import type { LucideIcon } from "lucide-react";
import type { ElementType, ReactNode } from "react";

export type TranslatedTextKey = `${string}.${string}`;

export type MarketingIcon = ElementType;

export type MarketingIconValue = MarketingIcon | string;

export type ComparisonValue = string | boolean;

export interface IconCardConfig {
  id?: string;
  title: string;
  titleKey: TranslatedTextKey;
  description?: string;
  descriptionKey?: TranslatedTextKey;
  desc?: string;
  descKey?: TranslatedTextKey;
  icon?: MarketingIconValue;
  href?: string;
  image?: string;
}

export interface StatConfig {
  value: string;
  label?: string;
  labelKey?: TranslatedTextKey;
  title?: string;
  titleKey?: TranslatedTextKey;
  icon?: MarketingIconValue;
  iconSize?: number;
}

export interface FaqConfig {
  id: string;
  question: string;
  questionKey: TranslatedTextKey;
  answer: string;
  answerKey: TranslatedTextKey;
}

export interface PricingPlanConfig {
  name: string;
  nameKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  price: string;
  period?: string;
  features: string[];
  featureKeys: TranslatedTextKey[];
  buttonText: string;
  buttonTextKey: TranslatedTextKey;
  highlighted?: boolean;
}

export interface ComparisonFeatureConfig {
  name: string;
  nameKey: TranslatedTextKey;
  starter: ComparisonValue;
  starterKey?: TranslatedTextKey;
  professional: ComparisonValue;
  professionalKey?: TranslatedTextKey;
  enterprise: ComparisonValue;
  enterpriseKey?: TranslatedTextKey;
}

export interface TeamMemberConfig {
  name: string;
  role: string;
  roleKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  image: string;
}

export interface ContactInfoConfig {
  icon: ReactNode;
  title: string;
  titleKey: TranslatedTextKey;
  value: string;
  note: string;
  noteKey: TranslatedTextKey;
}

export interface ServiceConfig {
  id?: string;
  title: string;
  titleKey: TranslatedTextKey;
  description: string;
  descriptionKey: TranslatedTextKey;
  icon: LucideIcon;
}
