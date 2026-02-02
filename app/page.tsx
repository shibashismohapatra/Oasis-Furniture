import Hero from '@/components/Hero'
import About from '@/components/About'
import SignatureCollection from '@/components/SignatureCollection'
import ShowroomLocations from '@/components/ShowroomLocations'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <SignatureCollection />
      <About />
      <ShowroomLocations />
      <CTASection />
    </>
  )
}
