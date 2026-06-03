"use client";

import Image from "next/image";

interface TeamCardProps {
  name: string;
  role: string;
  description: string;
  image: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, role, description, image }) => {
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Image Wrapper */}
      <div className="relative w-44 h-44 mb-6">
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 176px, 176px"
        />
      </div>

      {/* Name */}
      <h3 className="text-slate-900 text-lg font-bold">{name}</h3>

      {/* Role */}
      <p className="text-red-600 text-sm font-semibold mt-1">{role}</p>

      {/* Description */}
      <p className="text-slate-600 text-sm mt-3 max-w-xs leading-5">{description}</p>
    </div>
  );
};

export default TeamCard;
