import { PlanCard } from "../cards/PlanCard";
import { plans } from "@/constants/pricing";
import { getPackagePlans } from "@/lib/package-plans";

export const Plans = async () => {
  const packagePlans = await getPackagePlans();
  const visiblePlans = packagePlans.length ? packagePlans : plans;

  return (
    <section className="w-full bg-slate-50 pb-20 pt-20 lg:pt-36 px-6">
      <div className="mx-auto flex flex-col md:flex-row justify-center items-stretch gap-8">
        {visiblePlans.map((plan) => (
          <PlanCard key={"id" in plan ? plan.id : plan.nameKey} plan={plan} />
        ))}
      </div>
    </section>
  );
};
