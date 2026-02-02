'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface CollectionCardProps {
  name: string
  description: string
  image: string
  slug: string
  className?: string
}

export default function CollectionCard({ 
  name, 
  description, 
  image, 
  slug,
  className = '' 
}: CollectionCardProps) {
  const handleClick = () => {
    trackEvent('collection_card_click', { collection: slug })
  }

  return (
    <Link 
      href={`/collections/${slug}`}
      onClick={handleClick}
      className={`group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-2xl font-serif mb-2">{name}</h3>
          <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
