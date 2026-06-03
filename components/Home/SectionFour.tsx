import Image from "next/image";
import { Button } from "@/components/ui/button";

const topLogos = [
  { name: "Brand One", src: "/assets/sectionFour/brand1.png" },
  { name: "Bone’s", src: "/assets/sectionFour/brand2.png" },
  { name: "Red Lobster", src: "/assets/sectionFour/brand3.png" },
];

const bottomLogos = [
  { name: "Alexandre", src: "/assets/sectionFour/brand4.png" },
  { name: "The Grill", src: "/assets/sectionFour/brand5.png" },
  { name: "Chefscraft", src: "/assets/sectionFour/brand6.png" },
  { name: "The Backside", src: "/assets/sectionFour/brand7.png" },
];

export default function SectionFour() {
  return (
    <section className="w-full bg-white py-12 md:py-15">
      <div className="mx-auto max-w-7xl px-4 text-center">
        {/* Heading */}
        <h2 className="text-xl font-medium text-gray-900 font-heading">
          Trusted by Over <span className="font-bold">5,500+</span> Industry
          Leaders
        </h2>

        {/* ================= MOBILE GRID (2 logos per row) ================= */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:hidden">
          {[...topLogos, ...bottomLogos].map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <Image
                src={logo.src}
                alt={logo.name}
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* ================= DESKTOP (ORIGINAL LAYOUT) ================= */}
        <div className="hidden md:block">
          {/* Top Logos */}
          <div className="mt-10 flex items-center justify-center gap-16">
            {topLogos.map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.name}
                width={180}
                height={60}
                className="object-contain"
              />
            ))}
          </div>

          {/* Bottom Logos */}
          <div className="mt-8 flex items-center justify-center gap-14">
            {bottomLogos.map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.name}
                width={150}
                height={45}
                className="object-contain"
              />
            ))}
          </div>
        </div>

     
      </div>
    </section>
  );
}
