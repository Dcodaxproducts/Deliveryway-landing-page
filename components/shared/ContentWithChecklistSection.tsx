import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChecklistItem from "./ChecklistItem";

interface ContentWithChecklistSectionProps {
  title: React.ReactNode;
  description: string;
  checklist: string[];
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  reverseOnMobile?: boolean;
  imagePosition?: "left" | "right"; // ✅ NEW
}

const ContentWithChecklistSection = ({
  title,
  description,
  checklist,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  reverseOnMobile = false,
  imagePosition = "left", // default keeps backward compatibility
}: ContentWithChecklistSectionProps) => {
  return (
    <section className="w-full bg-white py-12 md:py-15">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`
            items-center gap-12
            flex
            ${reverseOnMobile ? "flex-col-reverse" : "flex-col"}
            lg:grid lg:grid-cols-2 lg:gap-16
          `}
        >
          {/* IMAGE */}
          <div
            className={`flex justify-center ${
              imagePosition === "right"
                ? "lg:justify-end lg:order-2"
                : "lg:justify-start lg:order-1"
            }`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              priority
              className="object-contain w-[280px] sm:w-[340px] md:w-[420px] lg:w-auto"
            />
          </div>

          {/* CONTENT */}
          <div
            className={`text-center lg:text-left ${
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 font-heading">
              {title}
            </h2>

            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-gray-600">
              {description}
            </p>

            <ul className="mt-8 space-y-4">
              {checklist.map((item, index) => (
                <ChecklistItem key={index} text={item} />
              ))}
            </ul>

            <div className="mt-10 flex justify-center lg:justify-start">
              <Button className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-black/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWithChecklistSection;
