"use client";

interface SectionHeaderProps {
  title: string;
  description: string;
  align?: "center" | "left" | "right";
  maxWidth?: string; // optional custom max width
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  align = "center",
}) => {
  const textAlignClass =
    align === "center" ? "text-center" : align === "left" ? "text-left" : "text-right";

  return (
    <div className={` ${textAlignClass} flex flex-col gap-4`}>
      <h2 className="text-slate-900 text-2xl sm:text-4xl font-extrabold">{title}</h2>
      <p className="text-slate-600 text-sm sm:text-base leading-6">{description}</p>
    </div>
  );
};

export default SectionHeader;
