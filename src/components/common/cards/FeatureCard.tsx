import { ElementType } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ElementType;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
        <Icon className="h-6 w-6 text-gray-900" />
      </div>

      <div className="text-left">
        <h4 className="font-[600] text-gray-900 font-heading text-[17px] sm:text-[19px]">
          {title}
        </h4>
        <p className="mt-1 max-w-md text-sm text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
