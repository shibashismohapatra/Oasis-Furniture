'use client'

import React from 'react'
import { monthlyOffer } from '@/config/monthlyOffer'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

export default function OfferBanner() {
  if (!monthlyOffer.isActive) return null

  const handleClick = () => {
    trackEvent('monthly_offer_click', { offer: monthlyOffer.title })
  }

  return (
    <div className="bg-brand-gold text-brand-black py-2 px-4 text-center text-sm font-medium">
      <a 
        href={getWhatsAppLink(`I'm interested in the ${monthlyOffer.title}`)}
        onClick={handleClick}
        className="hover:underline"
      >
        ✨ {monthlyOffer.title}: {monthlyOffer.discount} · Valid until {monthlyOffer.validUntil} · WhatsApp to Reserve
      </a>
    </div>
  )
}
