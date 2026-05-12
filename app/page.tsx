import Hero from '@/components/Hero'
import About from '@/components/About'
import SignatureCollection from '@/components/SignatureCollection'
import ShowroomLocations from '@/components/ShowroomLocations'
import CTASection from '@/components/CTASection'
import EthenicCollection from '@/components/ethenic'
import TestimonialSection from '@/components/testimonial'
import FAQSection from '@/components/faq'
import OfferBanner from '@/components/OfferBanner'

export default function Home() {
  return (
    <>
      <OfferBanner />
      <Hero />
      <EthenicCollection />
      <SignatureCollection />
      <TestimonialSection />
      <ShowroomLocations />
      <FAQSection />
      <CTASection />
    </>
  )
}
