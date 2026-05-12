import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from './SectionHeading'

interface CollectionItem {
  name: string
  price: string
  image: string
  slug: string
  className?: string
}

const collections: CollectionItem[] = [
  {
    name: 'Sofas',
    price: '₹12,990 Onwards',
    image: '/Photos/5 Seater Sofa Set.jpg',
    slug: 'sofa-sets',
    className: 'md:col-span-2 md:row-span-1',
  },
  {
    name: 'Dining',
    price: '₹17,900 Onwards',
    image: '/Photos/Solid Sheesham Wood 4 Seater Dining Table Set.jpg',
    slug: 'dining-sets',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    name: 'Home Decor',
    price: '₹569 Onwards',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
    slug: 'home-decor',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    name: 'Bedroom',
    price: '₹22,000 Onwards',
    image: '/Photos/4.jpg',
    slug: 'beds',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    name: 'Luxury Lighting',
    price: '₹2,499 Onwards',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80',
    slug: 'lighting',
    className: 'md:col-span-1 md:row-span-2',
  },
  {
    name: 'Bar & Dining',
    price: '₹8,900 Onwards',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    slug: 'bar-dining',
    className: 'md:col-span-1 md:row-span-1',
  },
]

export default function SignatureCollection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Signature Collection"
          subtitle="Explore our curated selection of premium furniture designed for modern living"
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {collections.map((item) => (
            <Link 
              key={item.name} 
              href={`/collections/${item.slug}`}
              className={`group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl ${item.className || ''}`}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-sm">
                  {item.name}
                </h3>
                <p className="text-white/90 font-medium text-sm">
                  {item.price}
                </p>
              </div>
              
              {/* Hover Indicator */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
