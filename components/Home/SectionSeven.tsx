import ContentWithChecklistSection from "../shared/ContentWithChecklistSection";

export default function SectionSeven() {
  return (
    <ContentWithChecklistSection
      imagePosition="right" 
       reverseOnMobile
      title={
        <>
          Smooth and Easy <br className="hidden sm:block" />
          Restaurant Order <br className="hidden sm:block" />
          Management
        </>
      }
      description="With user-friendly features, competitive exchange rates, and robust security measures, our platform simplifies international transactions."
      checklist={[
        "Seamless order flow from customers to your kitchen",
        "Smart menu, pricing, and inventory controls",
      ]}
      imageSrc="/assets/sectionSeven/map.png"
      imageAlt="Global restaurant order management map"
      imageWidth={560}
      imageHeight={420}
    />
  );
}
