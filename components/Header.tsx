'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink, getCallLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

const productCategories = [
  { name: 'Beds', href: '/collections/beds' },
  { name: 'Bed Side Table', href: '/collections/bed-side-table' },
  { name: 'Sofa Sets', href: '/collections/sofa-sets' },
  { name: 'Center Tables', href: '/collections/center-tables' },
  { name: 'Dining Sets', href: '/collections/dining-sets' },
  { name: 'Dining Chairs', href: '/collections/dining-chairs' },
  { name: 'Uncategorized', href: '/collections/uncategorized' },
  
]

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleWhatsAppClick = () => {
    trackEvent('cta_whatsapp_click', { source: 'header' })
  }

  const handleCallClick = () => {
    trackEvent('cta_call_click', { source: 'header' })
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCategoryClick = (categoryName: string) => {
    trackEvent('product_category_click', { source: 'header', category: categoryName })
    setIsDropdownOpen(false)
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
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-1 text-neutral-700 hover:text-brand-black transition-colors focus:outline-none"
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-40 py-2">
                    <div className="max-h-96 overflow-y-auto">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => handleCategoryClick(category.name)}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-brand-black transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <Link href="/showroom" className="text-neutral-700 hover:text-brand-black transition-colors">
              Project

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