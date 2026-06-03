import { CategoriesHero } from '@/components/categories/CategoriesHero'
import { DigitalFirstBlock } from '@/components/categories/DigitalFirstBlock'
import { OperationalExcellenceBlock } from '@/components/categories/OperationalExcellenceBlock'
import { SalesAnalyticsBlock } from '@/components/categories/SalesAnalyticsBlock'
import { SectionNine } from '@/components/Home/SectionNine'

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
