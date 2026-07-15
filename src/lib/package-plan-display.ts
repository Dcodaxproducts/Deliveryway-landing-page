import type {
  PackagePlan,
  PackagePlanFeatureValue,
} from "@/types/package-plans";

export interface PackagePlanFeature {
  label: string;
  value: PackagePlanFeatureValue;
}

export const formatPackagePlanLabel = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getPackagePlanFeatures = (plan: PackagePlan) => {
  const features = new Map<string, PackagePlanFeature>();

  Object.entries(plan.features).forEach(([key, value]) => {
    if (!value) return;

    const label = formatPackagePlanLabel(key);
    const existingFeature = features.get(label);

    if (!existingFeature || existingFeature.value === false) {
      features.set(label, { label, value });
    }
  });

  return Array.from(features.values());
};

export const getPackagePlanFeatureLabels = (plans: PackagePlan[]) => {
  const labels = new Set<string>();

  plans.forEach((plan) => {
    getPackagePlanFeatures(plan).forEach((feature) => {
      labels.add(feature.label);
    });
  });

  return Array.from(labels);
};

export const getPackagePlanFeatureValue = (
  plan: PackagePlan,
  label: string
) => {
  const feature = getPackagePlanFeatures(plan).find(
    (item) => item.label === label
  );

  return feature?.value || false;
};
