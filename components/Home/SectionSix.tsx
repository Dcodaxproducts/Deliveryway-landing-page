import ContentWithChecklistSection from "../shared/ContentWithChecklistSection";

export default function SectionSix() {
  return (
    <ContentWithChecklistSection
      reverseOnMobile
      imagePosition="left"
      title={
        <>
          Transforming <br className="hidden sm:block" />
          Restaurant Growth, <br className="hidden sm:block" />
          One Order at a Time.
        </>
      }
      description="Our platform empowers restaurants to operate smarter, serve faster, and scale effortlessly. Designed with advanced automation and real-time insights, we help food businesses stay ahead in a competitive delivery market."
      checklist={[
        "Manage all incoming orders instantly",
        "Smart tools to boost restaurant performance",
        "Faster deliveries, happier customers",
      ]}
      imageSrc="/assets/sectionSix/dining.png"
      imageAlt="Restaurant dining experience"
      imageWidth={520}
      imageHeight={620}
    />
  );
}
