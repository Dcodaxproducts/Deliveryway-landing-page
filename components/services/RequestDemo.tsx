"use client";

import { stats } from "@/constants/services";
import DemoForm from "../forms/DemoForm";
import StatCard from "../cards/DemoStatCard";

const RequestDemo = () => {
  return (
    <section className="w-full bg-slate-900 py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Left: Description + Stats */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <h2 className="text-white text-3xl lg:text-5xl font-bold leading-tight">
            Custom Enterprise Solutions
          </h2>
          <p className="text-slate-400 text-base lg:text-lg leading-7">
            Running a restaurant group or a national chain? We provide tailored
            workflows, multi-location consolidation, and advanced reporting tools
            designed to scale with your business growth.
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>

        {/* Right: Demo Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 lg:p-10">
          <h3 className="text-slate-900 text-2xl font-bold text-center mb-6">
            Request a Custom Demo
          </h3>
          <DemoForm />
        </div>

      </div>
    </section>
  );
};

export default RequestDemo;
