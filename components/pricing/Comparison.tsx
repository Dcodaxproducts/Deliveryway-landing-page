import { SectionHeader } from "../about/SectionHeader";
import FeatureTable from "./comparison/FeatureTable";

export function Comparison() {
  return (
    <section className="w-full bg-white py-20 px-6 lg:px-36">
      <div className="mx-auto flex flex-col gap-16">
        <SectionHeader
          title="Detailed Feature Comparison"
          description="Everything you need to know about our capabilities."
        />

        <FeatureTable />
      </div>
    </section>
  );
}
