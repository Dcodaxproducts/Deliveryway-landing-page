import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface CategoriesCardProps {
  title: string;
  description: string;
  icon: string;
}

const CategoriesCard = ({
  title,
  description,
  icon,
}: CategoriesCardProps) => {
  return (
    <Card className="rounded-[20px] md:rounded-[24px] border-none bg-[#F7F7F7] shadow-none">
      <CardContent className="flex items-center gap-3 md:gap-4 px-4 md:py-0">
        {/* Icon */}
        <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Image
            src={icon}
            alt={title}
            width={26}
            height={26}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesCard;
