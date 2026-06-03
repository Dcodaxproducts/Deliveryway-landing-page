"use client";

import { timelineData } from "@/constants/about";
import SectionHeader from "./SectionHeader";

const OurJourney = () => {
  return (
    <section className="w-full bg-slate-50 py-14 lg:py-20 px-5 lg:px-20 flex flex-col items-center gap-12 lg:gap-14">
      
      {/* Header */}
    <SectionHeader
        title="Our Journey"
        description="From a small startup in a garage to a global leader in restaurant technology. Here’s how we got here."
      />

      {/* Timeline Wrapper */}
      <div className="relative w-full max-w-5xl">

        {/* Desktop Center Line */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-1 bg-red-600/20 h-full" />

        {/* Mobile Left Line */}
        <div className="lg:hidden absolute left-5 top-0 w-1 bg-red-600/20 h-full" />

        <div className="flex flex-col gap-14 lg:gap-16 pt-8">
          {timelineData.map((item, index) => (
            <div
              key={index}
              className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start"
            >

              {/* LEFT (Desktop only content) */}
              <div
                className={`hidden lg:block ${
                  item.align === "left"
                    ? "lg:pr-8 text-right"
                    : ""
                }`}
              >
                {item.align === "left" && (
                  <>
                    <h3 className="text-slate-900 text-xl sm:text-2xl font-bold">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-6 mt-2 max-w-md ml-auto">
                      {item.description}
                    </p>
                  </>
                )}
              </div>

              {/* CENTER DOT */}
              <div className="flex lg:justify-center relative z-10">

                {/* Mobile positioning */}
                <div className="lg:hidden absolute left-5 -translate-x-1/2">
                  <div className="w-10 h-10 bg-red-600 rounded-full shadow-lg outline outline-4 outline-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* Desktop positioning */}
                <div className="hidden lg:flex justify-center px-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full shadow-lg outline outline-4 outline-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {item.year}
                    </span>
                  </div>
                </div>

              </div>

              {/* RIGHT CONTENT */}
              <div
                className={`w-full pl-16 lg:pl-8 ${
                  item.align === "right"
                    ? "lg:text-left"
                    : ""
                }`}
              >
                {/* Mobile always shows content here */}
                <div className="lg:hidden">
                  <h3 className="text-slate-900 text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-6 mt-2">
                    {item.description}
                  </p>
                </div>

                {/* Desktop right-aligned content */}
                {item.align === "right" && (
                  <div className="hidden lg:block">
                    <h3 className="text-slate-900 text-xl sm:text-2xl font-bold">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-6 mt-2 max-w-md">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
