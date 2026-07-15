import { CategoriesHero } from '@/components/pages/Categories/components/CategoriesHero'
import { DigitalFirstBlock } from '@/components/pages/Categories/components/DigitalFirstBlock'
import { OperationalExcellenceBlock } from '@/components/pages/Categories/components/OperationalExcellenceBlock'
import { SalesAnalyticsBlock } from '@/components/pages/Categories/components/SalesAnalyticsBlock'
import { SectionNine } from '@/components/pages/Home/components/SectionNine'

const page = () => {
  return (
    <div>
     <CategoriesHero />
 <div className="w-full flex flex-col gap-24 px-6 lg:px-30 py-20">
      <DigitalFirstBlock />
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
