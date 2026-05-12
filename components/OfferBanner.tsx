'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { monthlyOffer } from '@/config/monthlyOffer'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

export default function OfferPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!monthlyOffer.isActive) return

    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenOfferPopup')
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000) // Show after 2 seconds
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem('hasSeenOfferPopup', 'true')
    trackEvent('offer_popup_close', { offer: monthlyOffer.title })
  }

  const handleClaim = () => {
    trackEvent('offer_popup_claim', { offer: monthlyOffer.title })
  }

  if (!isVisible || !monthlyOffer.isActive) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup Card */}
      <div className="relative bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-up">
        {/* Close Icon */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:rotate-90"
        >
          <svg className="w-5 h-5 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Side */}
        <div className="w-full p-8 md:p-12 text-center">
          <span className="inline-block bg-[#FDF2F2] text-[#CC2E2E] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 uppercase">
            Exclusive Limited Offer
          </span>
          
          <h2 className="text-3xl md:text-4xl font-serif text-brand-black leading-tight mb-4">
            {monthlyOffer.title}
          </h2>
          
          <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-6 tracking-tight">
            {monthlyOffer.discount}
          </div>
          
          <p className="text-neutral-500 text-sm md:text-base mb-10 leading-relaxed px-4">
            Upgrade your lifestyle with our premium furniture collection. Valid until <span className="font-bold text-brand-black">{monthlyOffer.validUntil}</span>. Don't miss out!
          </p>
          
          <div className="flex flex-col gap-3">
            <a
              href={getWhatsAppLink(`Hi! I'd like to claim the ${monthlyOffer.title}: ${monthlyOffer.discount}`)}
              onClick={handleClaim}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-black text-white py-4 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-brand-gold transition-all duration-500 uppercase shadow-xl"
            >
              Claim Offer via WhatsApp
            </a>
            <button 
              onClick={handleClose}
              className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest hover:text-brand-black transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
