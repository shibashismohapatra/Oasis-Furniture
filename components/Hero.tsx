'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'
import { monthlyOffer } from '@/config/monthlyOffer'

const heroImages = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80'
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleDirectionsClick = () => {
    trackEvent('cta_directions_click', { source: 'hero' })
  }

  const handleWhatsAppClick = () => {
    trackEvent('cta_whatsapp_click', { source: 'hero' })
  }

  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden bg-neutral-900">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-50' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt={`Premium Furniture Showroom ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          {monthlyOffer.isActive && (
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 backdrop-blur-md border border-brand-gold/30 text-brand-gold px-6 py-2 rounded-full text-xs font-bold mb-8 animate-fade-in uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
              </span>
              {monthlyOffer.title}: {monthlyOffer.discount}
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1]">
            Curating <span className="text-brand-gold italic">Luxury</span> <br /> 
            For Your Home.
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-2xl leading-relaxed font-light">
            Discover a world of premium sofas, dining sets, and bespoke beds — where every piece is a masterpiece of comfort and style.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href={mainShowroom.googleMapsUrl}
              onClick={handleDirectionsClick}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold text-brand-black px-12 py-5 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white transition-all duration-500 uppercase shadow-2xl shadow-brand-gold/20 text-center"
            >
              Visit Showroom
            </a>
            <a
              href={getWhatsAppLink('Hello Oasis, I am interested in exploring your furniture collections.')}
              onClick={handleWhatsAppClick}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white hover:text-brand-black transition-all duration-500 uppercase text-center"
            >
              Inquire Now
            </a>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-12 left-4 flex gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${
                  idx === currentSlide ? 'w-12 bg-brand-gold' : 'w-6 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
