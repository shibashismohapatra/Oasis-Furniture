'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  productName: string
  price: string
  link: string
}

const hotspots: Hotspot[] = [
  {
    id: 'bedside',
    x: 17,
    y: 83,
    productName: 'Premium Bedside Table',
    price: '₹8,499',
    link: '/collections/bed-side-table',
  },
  {
    id: 'bed',
    x: 46,
    y: 71,
    productName: 'Luxury King Size Bed',
    price: '₹42,000',
    link: '/collections/beds',
  },
  {
    id: 'wardrobe',
    x: 70,
    y: 52,
    productName: 'Elegant Sliding Wardrobe',
    price: '₹35,000',
    link: '/collections/wardrobes',
  },
  {
    id: 'dressing',
    x: 92,
    y: 40,
    productName: 'Modern Dressing Table',
    price: '₹12,000',
    link: '/collections/dressers',
  },
]

export default function ShowroomLocations() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  const handleHotspotClick = (hotspot: Hotspot) => {
    trackEvent('hotspot_click', { 
      product: hotspot.productName,
      location: 'bedroom_showcase' 
    })
  }

  return (
    <section className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-neutral-100 group">
      {/* Background Scene */}
      <Image
        src="https://media.designcafe.com/wp-content/uploads/2020/01/21004212/wooden-showcase-designs-home.jpg"
        alt="Interior Showcase"
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
        priority
      />
      
      {/* Immersive Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      
      <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 z-10 max-w-xl">
        <p className="text-brand-gold text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-6 opacity-0 animate-fade-in [animation-delay:200ms] fill-mode-forwards">
          Alder Exclusive Indian Furniture
        </p>
        <h2 className="text-4xl md:text-7xl font-serif text-white leading-[1.1] mb-10 opacity-0 animate-fade-in [animation-delay:400ms] fill-mode-forwards drop-shadow-2xl">
          The Ideal Choice <br /> 
          <span className="text-brand-gold italic">For Home</span> & <br /> 
          Office
        </h2>
        <Link 
          href="/collections/beds"
          className="group/btn inline-flex items-center text-white font-bold text-sm tracking-[0.2em] border-b-2 border-brand-gold pb-2 transition-all duration-300 hover:text-brand-gold opacity-0 animate-fade-in [animation-delay:600ms] fill-mode-forwards"
        >
          SHOP COLLECTION
          <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Hotspots */}
      {hotspots.map((spot) => (
        <div 
          key={spot.id}
          className="absolute z-20 group/spot"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          <button
            onMouseEnter={() => setActiveHotspot(spot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() => handleHotspotClick(spot)}
            className="relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-[#CC2E2E] rounded-full shadow-lg text-white transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-xl md:text-2xl font-bold">+</span>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border-4 border-[#CC2E2E]/30 animate-ping" />
          </button>

          {/* Tooltip */}
          {activeHotspot === spot.id && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white p-4 shadow-2xl rounded-sm animate-fade-in z-30">
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1 font-bold">New Arrival</p>
              <p className="text-sm font-bold text-brand-black mb-1">{spot.productName}</p>
              <p className="text-brand-gold font-bold mb-3">{spot.price}</p>
              <Link 
                href={spot.link}
                className="text-[10px] font-bold border-b border-brand-black pb-0.5 hover:text-brand-gold hover:border-brand-gold transition-colors"
              >
                VIEW PRODUCT
              </Link>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
