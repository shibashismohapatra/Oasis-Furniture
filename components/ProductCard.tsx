'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface ProductCardProps {
  name: string
  description: string
  image: string
  collectionSlug: string
  className?: string
}

export default function ProductCard({ 
  name, 
  description, 
  image, 
  collectionSlug,
  className = '' 
}: ProductCardProps) {
  const handleClick = () => {
    trackEvent('product_card_click', { 
      product: name,
      collection: collectionSlug 
    })
  }

  return (
    <Link 
      href={`/collections/${collectionSlug}`}
      onClick={handleClick}
      className={`group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif text-brand-gold mb-2 group-hover:text-brand-gold-dark transition-colors">
          {name}
        </h3>
        <p className="text-neutral-600 text-sm leading-relaxed">
          {description}
        </p>
        <p className="mt-4 text-brand-black font-medium text-sm inline-flex items-center">
          View Collection
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </Link>
  )
}
