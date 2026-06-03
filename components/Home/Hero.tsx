"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#CE181B] pt-20 text-white">
      {/* ================= TEXT CONTENT ================= */}
      <div className="relative z-10 mx-auto px-4 text-center">
        {/* SUBTITLE */}
        <div className="pr-4 font-heading mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-[#E9E9E9] text-sm sm:text-[14px] font-medium text-gray-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <ShieldCheck />
          </span>
          Powering Food Businesses
        </div>

        {/* TITLE */}
      <h1 className="mx-auto max-w-6xl text-2xl sm:text-3xl md:text-6xl font-[500] leading-tight font-sans px-4 sm:px-0">
  The Complete Restaurant Management
  System That Handles Everything.
</h1>


        {/* DESCRIPTION */}
       <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-white/90 px-4 sm:px-0">
  Empower Your Brand, Control Your Revenue. Launch Your Own Branded Food
  Ordering App in Days, Not Months.
</p>


        {/* ACTION BUTTONS */}
       <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
  <Button className="w-full sm:w-auto rounded-full bg-white px-9 py-3 sm:py-4 text-sm font-medium text-[#CE181B] hover:bg-white/90">
    Get Started
  </Button>

  <Button className="w-full sm:w-auto rounded-full bg-black px-9 py-3 sm:py-4 text-sm font-medium text-white hover:bg-black/90">
    Request a demo
  </Button>
</div>

      </div>

      {/* ================= VISUAL AREA ================= */}
      <div className="relative mx-auto mt-16 flex justify-center">
        {/* BOTTOM GRADIENT BLUR OVERLAY */}
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-12 z-30 h-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(243,243,245,0) 0%, rgba(243,243,245,0.12) 65%, rgba(243,243,245,0.18) 100%)",
          }}
        />

        {/* IPHONE (ALWAYS VISIBLE) */}
        <div className="relative z-10">
          <Image
            src="/assets/hero/iphone.png"
            alt="Mobile App"
            width={378}
            height={760}
            priority
            className="object-contain"
          />

          {/* USERS BADGE (DESKTOP ONLY) */}
          <div className="absolute -right-20 bottom-20 hidden md:flex items-center gap-2 rounded-full bg-white px-3 py-2 text-gray-900 shadow-lg">
            <Image
              src="/assets/hero/users.png"
              alt="Users"
              width={160}
              height={33}
            />
          </div>
        </div>

        {/* TOTAL INCOME CARD (DESKTOP ONLY) */}
        <div className="absolute right-90 top-20 z-20 hidden md:block rounded-2xl bg-white px-6 py-4 text-gray-900 shadow-xl">
          <p className="text-m text-gray-500">Total Income</p>
          <p className="mt-1 text-3xl font-bold">$567.34K</p>
        </div>

        {/* MENU ITEM CARD (DESKTOP ONLY) */}
        <Image
          src="/assets/hero/menu_item.png"
          alt="Menu Item"
          width={220}
          height={260}
          className="absolute left-70 bottom-17 z-20 hidden md:block "
        />

        {/* FOOD ICONS (DESKTOP ONLY) */}
    <div className="absolute left-55 -top-28 hidden md:flex flex-col items-center">
  {/* White circular container */}
  <div className="relative flex h-17 w-17 items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
    <img
      src="/assets/hero/plain/hotdog.png"
      alt="Hotdog"
      className="h-14 w-14 object-contain"
    />
  </div>

  {/* Label */}
  <span className="mt-0.5 -rotate-22 text-[12px] font-medium text-white -mr-9">
    Hot Dog
  </span>
</div>

        <img
          src="/assets/hero/pizza.png"
          alt="Pizza"
          className="absolute right-106 -top-25 hidden md:block object-contain"
        />
       <div className="absolute right-60 -top-28 hidden md:flex flex-col items-center">
  {/* White circular container */}
  <div className="relative flex h-17 w-17 items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
    <img
      src="/assets/hero/plain/pasta.png"
      alt="Pasta"
      className="h-14 w-14 object-contain"
    />
  </div>

  {/* Label */}
  <span className="mt-1 text-[12px] font-medium text-white">
    Pasta
  </span>
</div>

       <div className="absolute right-54 bottom-20 hidden md:flex flex-col items-center">
  {/* White circular container */}
  <div className="relative flex h-17 w-17 items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
    <img
      src="/assets/hero/plain/donuts.png"
      alt="Donuts"
      className="h-14 w-14 object-contain"
    />
  </div>

  {/* Label */}
  <span className="-mt-2 -rotate-40 text-[12px] font-medium text-white -mr-14">
    Donuts
  </span>
</div>

      <div className="absolute left-35 bottom-25 hidden md:flex flex-col items-center">
  {/* White circular container */}
  <div className="flex h-17 w-17 items-center justify-center rounded-full bg-white shadow-lg overflow-hidden">
    <img
      src="/assets/hero/plain/burger.png"
      alt="Burger"
      className="h-14 w-14 object-contain"
    />
  </div>

  {/* Label */}
  <span className="mt-0 rotate-22 text-[12px] font-medium text-white -ml-8">
    Burger
  </span>
</div>


        {/* ARROW (DESKTOP ONLY) */}
        <img
          src="/assets/hero/arrow.png"
          alt="Arrow"
          className="absolute right-90 bottom-12 hidden md:block object-contain"
        />
      </div>
    </section>
  );
}
