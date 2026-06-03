import OptimizedFeatures from '@/components/categories/DigitalFirstBlock'
import OperationalExcellenceBlock from '@/components/categories/OperationalExcellenceBlock'
import SalesAnalyticsBlock from '@/components/categories/SalesAnalyticsBlock'
import SectionNine from '@/components/Home/SectionNine'
import Hero from '@/components/shared/Hero'

const page = () => {
  return (
    <div>
     <Hero
  badgeText="The Complete Platform"
  heading={
    <>
      <span className="text-neutral-900">Full Suite of </span>
      <span className="text-neutral-50">Restaurant Solutions</span>
    </>
  }
  description="Streamline your operations, boost your sales, and delight your
customers with our all-in-one management platform built for
modern dining."
  secondaryButton={{ label: "Watch Video" }}
/>
 <div className="w-full flex flex-col gap-24 px-6 lg:px-30 py-20">
      <OptimizedFeatures />
      <OperationalExcellenceBlock />
      <SalesAnalyticsBlock />
    </div>
 <div className="relative">
  <SectionNine />
  <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gray-100" />
</div>
     
    </div>
  )
}

export default page
