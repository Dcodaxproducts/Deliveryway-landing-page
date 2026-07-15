import { BuiltForChefs } from '@/components/pages/Services/components/BuiltForChefs'
import { RequestDemo } from '@/components/pages/Services/components/RequestDemo'
import { Services } from '@/components/pages/Services/components/Services'
import { ServicesHero } from '@/components/pages/Services/components/ServicesHero'

const page = () => {
  return (
    <div>
      <ServicesHero />

      <Services />
      <BuiltForChefs />
      <RequestDemo />
    </div>
  )
}

export default page
