'use client'

import React from 'react'
import Image from 'next/image'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'
import { monthlyOffer } from '@/config/monthlyOffer'

export default function Hero() {
  const handleDirectionsClick = () => {
    trackEvent('cta_directions_click', { source: 'hero' })
  }

  const handleWhatsAppClick = () => {
    trackEvent('cta_whatsapp_click', { source: 'hero' })
  }

  return (
    <section className="relative bg-neutral-900 text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80"
          alt="Premium Furniture Showroom"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-32 md:py-40">
        <div className="max-w-3xl">
          {monthlyOffer.isActive && (
            <div className="inline-block bg-brand-gold text-brand-black px-4 py-2 rounded-sm text-sm font-medium mb-6">
              ✨ {monthlyOffer.title} - {monthlyOffer.discount}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-balance">
            Premium Furniture Showroom in <span className="text-brand-gold">Bhubaneswar</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-300 mb-4">
            Sofas, Dining, Beds & Drapes — crafted for comfort and style
          </p>
          
          <div className="flex flex-wrap gap-3 text-sm text-neutral-400 mb-8">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Customization
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Expert Consultation
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Installation Support
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={mainShowroom.googleMapsUrl}
              onClick={handleDirectionsClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-black font-medium rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
            <a
              href={getWhatsAppLink()}
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium rounded-sm hover:bg-white hover:text-brand-black transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
