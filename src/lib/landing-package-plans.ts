import type { PackagePlan } from "@/types/package-plans";

type PackagePlansResponse = {
  data?: unknown;
};

type FetchPackagePlans = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

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

export const loadLandingPackagePlans = async (
  apiBaseUrl: string,
  fetchPackagePlans: FetchPackagePlans = fetch,
): Promise<PackagePlan[]> => {
  try {
    const endpoint =
      apiBaseUrl.replace(/\/$/, "") +
      "/v1/package-plans?page=1&limit=100&includeInactive=false&landingOnly=true";
    const response = await fetchPackagePlans(endpoint, { cache: "no-store" });

    if (!response.ok) return [];

    const payload = (await response.json()) as PackagePlansResponse;
    const plans = Array.isArray(payload.data) ? payload.data : [];

    return plans
      .filter(isPackagePlan)
      .filter((plan) => plan.isActive !== false);
  } catch {
    return [];
  }
};
