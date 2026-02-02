import React from 'react'
import Image from 'next/image'
import SectionHeading from './SectionHeading'
import SecondaryButton from './SecondaryButton'

export default function About() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                title="About Oasis Furniture"
                alignment="left"
                className="mb-6"
              />
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Since our founding, Oasis Furniture has been Bhubaneswar&apos;s destination for premium home furnishings. We believe that furniture is more than function—it&apos;s the foundation of comfort, style, and memories in your home.
                </p>
                <p>
                  Founded by passionate design enthusiasts, we curate only the finest pieces that blend craftsmanship with contemporary aesthetics. Every item in our showroom is selected for its quality, durability, and timeless appeal.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-brand-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Custom design options</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-brand-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Expert consultation</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-brand-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Premium materials</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-brand-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Installation support</span>
                </div>
              </div>

              <div className="mt-8">
                <SecondaryButton href="/about">
                  Learn More About Us
                </SecondaryButton>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
                alt="Oasis Furniture Showroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
