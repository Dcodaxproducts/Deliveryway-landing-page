"use client";

import React from "react";

const Cta = () => {
  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-20">
      <div className="relative max-w-7xl mx-auto bg-gradient-to-b from-red-600 to-red-700 rounded-3xl lg:rounded-[40px] px-6 sm:px-12 lg:px-20 py-14 lg:py-20 flex flex-col items-center text-center gap-8 overflow-hidden">

        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        {/* Heading */}
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-4xl leading-tight">
          Ready to Transform Your Business?
        </h2>

        {/* Description */}
        <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
          Join over 120,000+ restaurant owners who have taken their operations
          to the next level.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">

          <button className="px-8 py-4 bg-white text-red-600 font-bold text-base rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
            Get Started Now
          </button>

          <button className="px-8 py-4 bg-black/20 text-white font-bold text-base rounded-full border border-white/20 backdrop-blur-md hover:bg-black/30 transition">
            Request a Demo
          </button>

        </div>
      </div>
    </section>
  );
};

export default Cta;
