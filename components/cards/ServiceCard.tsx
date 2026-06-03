"use client";

import { ArrowRight, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300">
      
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center bg-red-600/10 rounded-xl">
        <Icon className="text-red-600 w-7 h-7" />
      </div>

      {/* Title */}
      <h3 className="text-slate-900 text-xl font-bold">{title}</h3>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-6">{description}</p>

      {/* Learn More */}
      <button className="mt-auto flex items-center gap-1 text-red-600 font-bold hover:underline">
        Learn More
        <span className="flex items-center">
          <ArrowRight className="w-4 h-4 text-red-600" />
        </span>
      </button>
    </div>
  );
};

export default ServiceCard;
