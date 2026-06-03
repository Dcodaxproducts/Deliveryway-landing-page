interface StatCardProps {
  value: string;
  label: string;
}

export const ContactStatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="flex-1 p-6 bg-white/5 rounded-2xl outline outline-1 outline-white/10 backdrop-blur-sm flex flex-col items-center gap-2">
    <div className="text-red-600 text-3xl font-bold">{value}</div>
    <div className="text-white/60 text-sm text-center">{label}</div>
  </div>
);
