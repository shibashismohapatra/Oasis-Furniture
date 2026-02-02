'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink, getCallLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

export default function Header() {
  const handleWhatsAppClick = () => {
    trackEvent('cta_whatsapp_click', { source: 'header' })
  }

  const handleCallClick = () => {
    trackEvent('cta_call_click', { source: 'header' })
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-40 h-12">
              <Image
                src="/Photos/oasis.png"
                alt="Oasis Furniture"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-brand-black transition-colors">
              Home
            </Link>
            <Link href="/collections" className="text-neutral-700 hover:text-brand-black transition-colors">
              Collections
            </Link>
            <Link href="/showroom" className="text-neutral-700 hover:text-brand-black transition-colors">
              Visit Showroom
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-brand-black transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-brand-black transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <a
              href={getCallLink()}
              onClick={handleCallClick}
              className="inline-flex items-center px-6 py-2 bg-brand-black text-white rounded-sm hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden sm:inline">Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
