import { PlanCard } from "../cards/PlanCard";
import { plans } from "@/constants/pricing";
import type { PackagePlan } from "@/types/package-plans";

interface PlansProps {
  packagePlans: PackagePlan[];
}

export const Plans = ({ packagePlans }: PlansProps) => {
  const visiblePlans = packagePlans.length ? packagePlans : plans;
  const mostPopularIndex = Math.floor(visiblePlans.length / 2);

  return (
    <section className="w-full bg-slate-50 pb-20 pt-20 lg:pt-36 px-6">
      <div className="mx-auto flex flex-col md:flex-row justify-center items-stretch gap-8">
        {visiblePlans.map((plan, index) => (
          <PlanCard
            key={"id" in plan ? plan.id : plan.nameKey}
            plan={plan}
            isHighlighted={index === mostPopularIndex}
          />
        ))}
      </div>
    </section>
  );
};
