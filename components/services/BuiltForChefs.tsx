"use client";

import Image from "next/image";
import { PiCheckCircleFill } from "react-icons/pi";

const features = [
  "99.9% Uptime reliability",
  "24/7 Priority support line",
  "Mobile-first design for on-the-go management",
];

const BuiltForChefs = () => {
  return (
    <section className="w-full bg-slate-50 py-16 px-6 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left Image */}
<div className="flex-1 w-full">
  <div className="relative  h-[400px] sm:h-[450px] lg:h-[500px] p-0">
    <Image
      src="/services/chef.png"
      alt="Chef working"
      fill
      className="object-cover rounded-2xl "
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  </div>
</div>


        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6 -mt-7">
          
          {/* Heading */}
          <h2 className="text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Built by Chefs, for Chefs.
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-base sm:text-lg leading-7">
            We understand the heat of the kitchen. That&apos;s why we&apos;ve
            designed our interface to be lightning-fast, highly visible, and
            incredibly simple to use—even during the busiest dinner rushes.
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-4 mt-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
              <PiCheckCircleFill className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-slate-900 text-base font-medium">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BuiltForChefs;
