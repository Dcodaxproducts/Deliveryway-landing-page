import { API_BASE_URL } from "@/lib/constants";
import type { PackagePlan } from "@/types/package-plans";

type PackagePlansResponse = {
  data?: unknown;
};

const isPackagePlan = (value: unknown): value is PackagePlan => {
  if (!value || typeof value !== "object") return false;

  const plan = value as Record<string, unknown>;

  return (
    typeof plan.id === "string" &&
    typeof plan.name === "string" &&
    typeof plan.billingModel === "string" &&
    typeof plan.billingInterval === "string" &&
    typeof plan.planPrice === "string" &&
    typeof plan.currency === "string"
  );
};

export const getPackagePlans = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/package-plans?page=1&limit=100&includeInactive=false`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return [];

    const payload = (await response.json()) as PackagePlansResponse;
    const plans = Array.isArray(payload.data) ? payload.data : [];

    return plans.filter(isPackagePlan).filter((plan) => plan.isActive !== false);
  } catch {
    return [];
  }
};
