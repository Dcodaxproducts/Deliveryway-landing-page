import { Cta } from '@/components/pages/About/components/Cta'
import { Comparison } from '@/components/pages/Pricing/components/Comparison'
import { Faq } from '@/components/pages/Pricing/components/Faq'
import { Plans } from '@/components/pages/Pricing/components/Plans'
import { PricingHero } from '@/components/pages/Pricing/components/PricingHero'
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
