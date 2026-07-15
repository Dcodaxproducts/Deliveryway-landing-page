import { SectionTwo } from "@/components/pages/Home/components/SectionTwo";
import Container from "@/components/common/container";
import { SectionThree } from "@/components/pages/Home/components/SectionThree";
import { SectionFour } from "@/components/pages/Home/components/SectionFour";
import { SectionFive } from "@/components/pages/Home/components/SectionFive";
import { SectionSix } from "@/components/pages/Home/components/SectionSix";
import { SectionSeven } from "@/components/pages/Home/components/SectionSeven";
import { SectionEight } from "@/components/pages/Home/components/SectionEight";
import { Hero } from "@/components/pages/Home/components/Hero";
import { SectionNine } from "@/components/pages/Home/components/SectionNine";

export default function Home() {
    return (
        <Container>
          <Hero />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
          <SectionFive />
          <SectionSix />
          <SectionSeven />
          <SectionEight />
        <div className="relative">
  <SectionNine />
  <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gray-100" />
</div>

        </Container>
    )
}
