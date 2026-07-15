
import { AboutHero } from '@/components/pages/About/components/aboutHero'
import { Cta } from '@/components/pages/About/components/Cta'
import { MeetVisionaries } from '@/components/pages/About/components/MeetVisionaries'
import { OurJourney } from '@/components/pages/About/components/OurJourney'
import { Values } from '@/components/pages/About/components/Values'

const page = () => {
  return (
    <div>
     <AboutHero />
     <OurJourney />
     <MeetVisionaries />
     <Values />
     <Cta />
    </div>
  )
}

export default page
