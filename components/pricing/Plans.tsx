import { plans } from "@/constants/pricing";
import { PlanCard } from "../cards/PlanCard";


export const Plans = () => {
  return (
    <section className="w-full bg-slate-50 pb-20 pt-20 lg:pt-36 px-6">
      <div className="mx-auto flex flex-col md:flex-row justify-center items-stretch gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.nameKey} plan={plan} />
        ))}
      </div>
    </section>
  );
};
