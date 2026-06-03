"use client";

import Image from "next/image";
import { BadgeCheck, TrendingUp } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="w-full bg-[#CE181B] flex justify-center items-center px-6 lg:px-0 pt-12 lg:pt-7 pb-14 lg:pb-8 relative">
      
      {/* Gradient Overlay at Bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-10 h-40 z-30"
        style={{
          background:
            "linear-gradient(180deg, rgba(243,243,245,0) 0%, rgba(243,243,245,0.12) 65%, rgba(243,243,245,0.18) 100%)",
        }}
      />

      <div className="w-full lg:px-31 pt-4 pb-15 flex flex-col lg:flex-row justify-between items-center gap-14 lg:gap-11 px-0 lg:px-6">
        
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">

          {/* Badge */}
          <div className="px-4 py-2 bg-neutral-50/10 rounded-full inline-flex items-center gap-3 justify-center lg:justify-start">
            <BadgeCheck className="w-4 h-4 text-white" />
            <span className="text-neutral-50 text-sm font-semibold mt-[2px]">
              Empowering Food Businesses
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight lg:leading-[72px]">
              Our Mission: To
            </h1>
            <h1 className="text-zinc-900 text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              Revolutionize
            </h1>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight lg:leading-[72px]">
              How the World Eats.
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-200 text-base sm:text-lg leading-7 max-w-xl mt-4">
            We&apos;re building the infrastructure that allows restaurants of all sizes to thrive in a digital-first world. From small cafes to global franchises, we provide the tools to manage every detail seamlessly.
          </p>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-4">
            <div className="flex -space-x-3">
              <Image
                src="/about/User1.png"
                alt="User 1"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="/about/User2.png"
                alt="User 2"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="/about/User3.png"
                alt="User 3"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
            </div>

            <div className="text-center sm:text-left">
              <div className="text-neutral-50 text-lg font-bold leading-7">120K+</div>
              <div className="text-gray-200 text-sm">Global Partners Trust Us</div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="w-full lg:w-1/2 relative flex justify-center">

          {/* Image Card */}
          <div className="relative w-full max-w-md lg:max-w-full rounded-3xl shadow-2xl overflow-hidden">
            <Image
              src="/about/food.png"
              alt="Food"
              width={600}
              height={320}
              className="w-full h-auto object-cover"
            />

            {/* Text Overlay */}
            <div className="absolute bottom-6 right-6 text-right">
              <p className="text-white text-sm font-medium opacity-80 rotate-1">
                Innovation in every dish
              </p>
              <p className="text-white text-lg sm:text-xl font-bold rotate-1">
                The Core of Our Operations
              </p>
            </div>
          </div>

          {/* Floating Growth Card */}
          <div className="absolute -left-4 sm:-left-8 bottom-[-70px] lg:bottom-[-40px] bg-white rounded-2xl shadow-xl outline outline-1 outline-slate-100 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex justify-center items-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-slate-800 text-xs font-bold uppercase tracking-wide">
                  Growth Factor
                </p>
                <p className="text-red-600 text-2xl font-black">
                  +240%
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
