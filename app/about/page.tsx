
import AboutHero from '@/components/about/aboutHero'
import Cta from '@/components/about/Cta'
import MeetVisionaries from '@/components/about/MeetVisionaries'
import OurJourney from '@/components/about/OurJourney'
import Values from '@/components/about/Values'
import React from 'react'

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
