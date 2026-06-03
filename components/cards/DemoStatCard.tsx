"use client";

interface StatCardProps {
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="flex-1 p-4 bg-white/5 rounded-lg outline outline-1 outline-white/10 flex flex-col items-start">
      <div className="text-red-600 text-2xl font-bold">{value}</div>
      <div className="text-slate-400 text-xs uppercase font-normal tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
