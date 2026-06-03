"use client";

interface ValueCardProps {
  title: string;
  description: string;
  Icon: React.ElementType;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, Icon }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center bg-red-600/10 rounded-2xl mb-6 group-hover:bg-red-600/20 transition">
        <Icon className="text-red-600 text-2xl" />
      </div>

      {/* Title */}
      <h3 className="text-slate-900 text-xl font-bold">{title}</h3>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-6 mt-3">{description}</p>
    </div>
  );
};

export default ValueCard;
