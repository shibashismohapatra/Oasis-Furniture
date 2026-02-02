import type { Metadata } from 'next'
import Image from 'next/image'
import SectionHeading from '@/components/SectionHeading'
import SecondaryButton from '@/components/SecondaryButton'

export const metadata: Metadata = {
  title: 'About Us - Oasis Furniture',
  description: 'Learn about Oasis Furniture - Bhubaneswar\'s premium furniture showroom',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-6">
              About Oasis Furniture
            </h1>
            <p className="text-xl text-neutral-700">
              Crafting comfort and style for homes across Bhubaneswar
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
                  alt="Oasis Furniture Showroom"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif text-brand-gold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    Founded by passionate design enthusiasts, Oasis Furniture has become Bhubaneswar&apos;s destination for premium home furnishings. We believe that furniture is more than just function—it&apos;s the foundation of comfort, style, and memories in your home.
                  </p>
                  <p>
                    Our journey began with a simple vision: to bring world-class furniture design to discerning homeowners in Bhubaneswar. Today, we curate an exclusive collection of sofas, dining sets, beds, and drapes that blend craftsmanship with contemporary aesthetics.
                  </p>
                  <p>
                    Every piece in our showroom is meticulously selected for its quality, durability, and timeless appeal. We partner with skilled artisans and trusted manufacturers to ensure that each item meets our exacting standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="bg-neutral-50 p-12 rounded-sm">
              <h2 className="text-3xl font-serif text-brand-gold text-center mb-12">
                What Sets Us Apart
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-sm flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-black mb-2">
                      Premium Quality
                    </h3>
                    <p className="text-neutral-600">
                      We source only the finest materials and work with skilled craftsmen to deliver furniture that lasts generations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-sm flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-black mb-2">
                      Custom Design
                    </h3>
                    <p className="text-neutral-600">
                      Personalize your furniture with custom fabrics, finishes, and dimensions to match your unique vision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-sm flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-black mb-2">
                      Expert Consultation
                    </h3>
                    <p className="text-neutral-600">
                      Our experienced design team provides personalized guidance to help you create the perfect space.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-sm flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-black mb-2">
                      Installation Support
                    </h3>
                    <p className="text-neutral-600">
                      Professional delivery and installation services ensure your furniture is set up perfectly in your home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-brand-gold mb-4">
            Visit Our Showroom
          </h2>
          <p className="text-neutral-700 mb-8 max-w-2xl mx-auto">
            Experience our collection in person and let our team help you find the perfect pieces for your home.
          </p>
          <SecondaryButton href="/showroom">
            Get Directions
          </SecondaryButton>
        </div>
      </section>
    </>
  )
}
