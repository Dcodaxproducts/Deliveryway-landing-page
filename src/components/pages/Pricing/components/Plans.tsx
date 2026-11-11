import { PlanCard } from "@/components/common/cards/PlanCard";
import type { PackagePlan } from "@/types/package-plans";

interface PlansProps {
  packagePlans: PackagePlan[];
}

export const Plans = ({ packagePlans }: PlansProps) => {
  const mostPopularIndex = Math.floor(packagePlans.length / 2);

  if (packagePlans.length === 0) return null;

  return (
    <section className="w-full bg-slate-50 pb-20 pt-20 lg:pt-36 px-6">
      <div className="mx-auto flex flex-col md:flex-row justify-center items-stretch gap-8">
        {packagePlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isHighlighted={index === mostPopularIndex}
          />
        ))}
      </div>
    </section>
  );
};
