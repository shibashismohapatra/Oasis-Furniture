'use client'

import React from 'react'
import { mainShowroom } from '@/config/showrooms'
import { trackEvent } from '@/lib/analytics'

export default function CTASection() {
  const handleDirectionsClick = () => {
    trackEvent('cta_directions_click', { source: 'cta_section' })
  }

  return (
    <section className="py-20 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-gold mb-4">
            Ready to Transform Your Home?
          </h2>
          <p className="text-neutral-700 text-lg mb-8">
            Visit our showroom to see, touch, and experience our furniture collection. Our design experts are ready to help you create the perfect space.
          </p>
          <a
            href={mainShowroom.googleMapsUrl}
            onClick={handleDirectionsClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 bg-brand-black text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors text-lg"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Visit Our Showroom
          </a>
        </div>
      </div>
    </section>
  )
}
