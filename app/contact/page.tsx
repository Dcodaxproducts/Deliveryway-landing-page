import Contact from '@/components/contact/Contact'
import Infrastructure from '@/components/contact/Infrastructure'
import Hero from '@/components/shared/Hero'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero
  badgeText="Contact Support"
  heading={
    <>
      <span className="text-neutral-900">Get in Touch with </span>
      <span className="text-neutral-50">Our Experts</span>
    </>
  }
    description="Need help managing your restaurant or interested in our enterprise solutions? Our team is available 24/7 to assist you."

/>
<Contact />
<Infrastructure />

    </div>
  )
}

export default page
