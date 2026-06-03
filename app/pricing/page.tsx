import { Cta } from '@/components/about/Cta'
import { Comparison } from '@/components/pricing/Comparison'
import { Faq } from '@/components/pricing/Faq'
import { Plans } from '@/components/pricing/Plans'
import { PricingHero } from '@/components/pricing/PricingHero'

const page = () => {
  return (
    <div>
      <PricingHero />
<Plans />
<Comparison />
<Faq />
<Cta />

    </div>
  )
}

export default page
