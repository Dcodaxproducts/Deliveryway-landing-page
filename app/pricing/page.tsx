import { Cta } from '@/components/about/Cta'
import { Comparison } from '@/components/pricing/Comparison'
import { Faq } from '@/components/pricing/Faq'
import { Plans } from '@/components/pricing/Plans'
import { PricingHero } from '@/components/pricing/PricingHero'
import { getPackagePlans } from '@/lib/package-plans'

const page = async () => {
  const packagePlans = await getPackagePlans()

  return (
    <div>
      <PricingHero />
<Plans packagePlans={packagePlans} />
<Comparison packagePlans={packagePlans} />
<Faq />
<Cta />

    </div>
  )
}

export default page
