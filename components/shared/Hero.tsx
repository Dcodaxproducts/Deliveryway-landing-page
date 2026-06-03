"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import BillingToggle from "../pricing/BillingToggle";

interface HeroProps {
  badgeText?: string; // Top badge, optional
  heading: React.ReactNode; // Can be spans, colors, etc.
  description: string;
  primaryButton?: {
    label: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick?: () => void;
  };
  showBackground?: boolean; // Default true
  className?: string; // extra wrapper classes
  showToggle?: boolean;

}

const Hero: React.FC<HeroProps> = ({
  badgeText,
  heading,
  description,
  primaryButton,
  secondaryButton,
  showBackground = true,
  showToggle = false,
  className = "",
}) => {
  return (
    <section
      className={`w-full relative bg-[#CE181B] flex flex-col items-center overflow-hidden pt-20 pb-24 px-6 lg:px-0 ${className}`}
    >
      {/* Background and Blurs */}
          {/* Gradient Overlay at Bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-7 h-40 z-30"
            style={{
              background:
                "linear-gradient(180deg, rgba(243,243,245,0) 0%, rgba(243,243,245,0.12) 65%, rgba(243,243,245,0.18) 100%)",
            }}
          />
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute bg-red-600 rounded-full blur-3xl opacity-20 w-96 h-96 top-[-20%] right-[-10%]" />
            <div className="absolute bg-red-600 rounded-full blur-3xl opacity-20 w-96 h-96 bottom-[-20%] left-[-10%]" />
          </div>
      
      {/* Content */}
      <div className="relative w-full max-w-5xl flex flex-col items-center gap-4 text-center">
        {/* Badge */}
        {badgeText  && (
          <div className={`px-4 py-1 rounded-full inline-flex justify-center items-center ${showBackground ? "bg-neutral-50/10":""}`}>
            <span className="text-neutral-50 text-xs font-bold uppercase tracking-wider">
              {badgeText}
            </span>
          </div>
        )}

        {/* Heading */}
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-slate-900`}>
          {heading}
        </h1>

        {/* Description */}
        <p className={`text-base sm:text-lg leading-7 text-gray-200 max-w-2xl`}>
          {description}
        </p>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && showBackground && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
            {primaryButton && (
              <button
                onClick={primaryButton.onClick}
                className="flex items-center gap-2 px-8 py-4 bg-red-600 rounded-xl text-white font-bold text-lg hover:bg-red-700 transition"
              >
                {primaryButton.label}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {secondaryButton && (
              <button
                onClick={secondaryButton.onClick}
                className="px-8 py-4 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-100 transition"
              >
                {secondaryButton.label}
              </button>
            )}
          </div>
        )}
      </div>
     {showToggle && <BillingToggle />}

    </section>
  );
};

export default Hero;
