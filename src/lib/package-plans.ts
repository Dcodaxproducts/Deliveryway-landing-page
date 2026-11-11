import { API_BASE_URL } from "@/lib/constants";
import { loadLandingPackagePlans } from "@/lib/landing-package-plans";

export const getPackagePlans = async () => {
  return loadLandingPackagePlans(API_BASE_URL);
};
