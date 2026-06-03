import Cta from '@/components/about/Cta'
import Comparison from '@/components/pricing/Comparison'
import Faq from '@/components/pricing/Faq'
import Plans from '@/components/pricing/Plans'
import Hero from '@/components/shared/Hero'

const page = () => {
  return (
    <div>
      <Hero
      showToggle={true}
  heading={
    <>
      <span className="text-neutral-900">Transparent </span>
      <span className="text-neutral-50">Pricing Plans</span>
    </>
  }
    description="Simple, predictable pricing designed to scale with your restaurant. Choose the plan that fits your kitchen's needs."

/>
<Plans />
<Comparison />
<Faq />
<Cta />

    </div>
  )
}

export default page
