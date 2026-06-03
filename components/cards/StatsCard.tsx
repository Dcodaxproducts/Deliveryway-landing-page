import Image from "next/image";

interface StatsCardProps {
  icon: string;
  value: string;
  title: string;
  iconSize: number;
}

const StatsCard = ({ icon, value, title, iconSize }: StatsCardProps) => {
  return (
    <div className="text-center md:text-left">
      {/* Icon + Value */}
      <div className="flex items-center justify-center md:justify-start gap-3">
        <Image
          src={icon}
          alt={value}
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 font-heading">
          {value}
        </h3>
      </div>

      {/* Description */}
      <p className="mt-3 max-w-sm mx-auto md:mx-0 text-sm md:text-[16px] leading-relaxed text-gray-600">
        {title}
      </p>
    </div>
  );
};

export default StatsCard;
