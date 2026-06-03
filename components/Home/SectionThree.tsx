'use client'
import { useRouter } from "next/navigation";
import CategoriesCard from "../cards/CategoriesCard";
import { Button } from "../ui/button";
import { sectionThreeCategories } from "@/constants/categories";

export default function SectionThree() {
  const router = useRouter();
  return (
    <section className="w-full bg-white py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 md:mb-12 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
            Browse Popular Categories
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-[16px] text-gray-600">
            Discover the perfect course from our top-loved selections,
            designed to help you learn, grow, and succeed
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {sectionThreeCategories.map((item, index) => (
            <CategoriesCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-12 text-center">
          <Button onClick={()=>router.push('/categories')} className="w-full sm:w-auto rounded-full bg-black px-8 py-3 text-sm md:py-3.5 font-medium text-white hover:bg-black/90">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
