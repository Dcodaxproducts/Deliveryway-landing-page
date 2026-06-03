import { BuiltForChefs } from '@/components/services/BuiltForChefs'
import { RequestDemo } from '@/components/services/RequestDemo'
import { Services } from '@/components/services/Services'
import { ServicesHero } from '@/components/services/ServicesHero'

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
