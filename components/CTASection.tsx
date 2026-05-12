'use client'

import React from 'react'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

const workflowSteps = [
  {
    number: '01',
    title: 'Inquire',
    description: 'Enquire about your favorite products via WhatsApp or direct call.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Visit or Buy',
    description: 'Order for home delivery or visit our premium showroom to see the quality.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Payment',
    description: 'Secure payments through Card, UPI, or Bank Transfer.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    number: '04',
    title: 'Delivery',
    description: 'Relax as we provide free shipping and expert installation at your home.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  }
]

const trustBadges = [
  {
    title: 'Free Shipping Orders',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    )
  },
  {
    title: '100% Secure Payments',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Expert Installation',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    )
  }
]

export default function CTASection() {
  const handleActionClick = (type: string) => {
    trackEvent('cta_section_click', { type })
  }

  return (
    <section className="bg-white">
      {/* Workflow Section */}
      <div className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Our Process</span>
            <h2 className="text-3xl md:text-5xl font-serif text-neutral-800">How Oasis Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 relative">
            {/* Connector Lines (Desktop) */}
            <div className="hidden md:block absolute top-28 left-0 w-full h-px bg-brand-gold/20 -z-0" />
            
            {workflowSteps.map((step) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-full border border-neutral-100 flex items-center justify-center text-brand-black mb-8 group-hover:border-brand-gold group-hover:scale-110 transition-all duration-700 shadow-sm group-hover:shadow-2xl">
                  {step.icon}
                </div>
                <div className="bg-brand-gold text-white text-[10px] font-bold px-4 py-1 rounded-full mb-5 tracking-widest">
                  STEP {step.number}
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main CTA Section */}
      <div className="py-24 bg-[#4A0E2E] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-10 leading-[1.1]">
              Bring Premium Comfort <br /> 
              <span className="text-brand-gold italic">To Your Doorstep</span>
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of traditional craftsmanship and modern convenience. Start your home transformation journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
              <a
                href={mainShowroom.googleMapsUrl}
                onClick={() => handleActionClick('directions')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-gold text-brand-black px-14 py-5 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white transition-all duration-500 uppercase shadow-2xl shadow-brand-gold/20"
              >
                Visit Showroom
              </a>
              <a
                href={getWhatsAppLink('I want to inquire about home delivery options.')}
                onClick={() => handleActionClick('whatsapp')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-14 py-5 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white hover:text-brand-black transition-all duration-500 uppercase"
              >
                Inquire on WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-20 border-t border-white/10">
              {trustBadges.map((badge) => (
                <div key={badge.title} className="flex items-center justify-center gap-5 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-gold/10 group-hover:border-brand-gold transition-all duration-500">
                    {badge.icon}
                  </div>
                  <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em] text-left leading-relaxed">
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
