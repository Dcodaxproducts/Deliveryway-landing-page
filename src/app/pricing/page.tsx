import { Plans } from "@/components/pages/Pricing/components/Plans";
import { PricingHero } from "@/components/pages/Pricing/components/PricingHero";
import { getPackagePlans } from "@/lib/package-plans";

const page = async () => {
  const packagePlans = await getPackagePlans();

  return (
    <div>
      <PricingHero />
      <Plans packagePlans={packagePlans} />
    </div>
  );
};

export default page;
