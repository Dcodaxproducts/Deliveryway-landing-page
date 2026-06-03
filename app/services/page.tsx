import BuiltForChefs from '@/components/services/BuiltForChefs'
import RequestDemo from '@/components/services/RequestDemo'
import Services from '@/components/services/Services'
import Hero from '@/components/shared/Hero'

const page = () => {
  return (
    <div>
     <Hero
  badgeText="The Complete Platform"
  heading={
    <>
      <span className="text-neutral-900">Solutions for </span>
      <span className="text-neutral-50">Every Kitchen</span>
    </>
  }
  description="Streamline your operations, from back-of-house inventory to front-of-house service. Our unified platform empowers your team to deliver excellence in every dish and every interaction."
  secondaryButton={{ label: "Watch Video" }}
/>

      <Services />
      <BuiltForChefs />
      <RequestDemo />
    </div>
  )
}

export default page
