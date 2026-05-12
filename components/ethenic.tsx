'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { collections } from '@/config/collections'

interface AestheticCard {
  title: string
  subtitle: string
  label: string
  image: string
  href: string
  isLarge?: boolean
}

const aestheticCards: AestheticCard[] = [
  {
    title: 'Minimal & Calm',
    subtitle: 'Clean lines, serene spaces',
    label: 'TRENDING',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    href: '/collections/minimal',
    isLarge: true,
  },
  {
    title: 'Living Room',
    subtitle: 'Elevating your social space',
    label: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    href: '/collections/living-room',
  },
  {
    title: 'Dining Room',
    subtitle: 'Crafted for togetherness',
    label: 'EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207fa6?w=800&q=80',
    href: '/collections/dining-sets',
  },
  {
    title: 'Study Room',
    subtitle: 'Focus & Productivity',
    label: 'ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    href: '/collections/study-room',
  },
  {
    title: 'Kids Room',
    subtitle: 'Creative & Safe spaces',
    label: 'NEW',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
    href: '/collections/kids-room',
  },
  {
    title: 'Earthy & Warm',
    subtitle: 'Natural textures, warm tones',
    label: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80',
    href: '/collections/earthy',
  },
  {
    title: 'Luxe & Statement',
    subtitle: 'Bold elegance, rich details',
    label: 'NEW',
    image: 'https://images.unsplash.com/photo-1616489953149-8079717cb0b5?w=800&q=80',
    href: '/collections/luxe',
  },
  {
    title: 'Soft & Cozy',
    subtitle: 'Plush comfort, inviting warmth',
    label: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    href: '/collections/cozy',
  },
]

const categories = [
  { name: 'Sofas', slug: 'sofa-sets', icon: '/Photos/1.jpg' },
  { name: 'Beds', slug: 'beds', icon: '/Photos/4.jpg' },
  { name: 'Dining', slug: 'dining-sets', icon: '/Photos/Solid Sheesham Wood 4 Seater Dining Table Set.jpg' },
  { name: 'Tables', slug: 'center-tables', icon: '/Photos/2.jpg' },
  { name: 'Decor', slug: 'uncategorized', icon: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=100&q=80' },
  { name: 'Side Tables', slug: 'bed-side-table', icon: '/Photos/5.jpg' },
]

export default function EthenicCollection() {
  const getItemCount = (slug: string) => {
    return collections.find(c => c.slug === slug)?.itemCount || 0
  }

  return (
    <section className="bg-[#FAF7F2] py-24 text-brand-black overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Category Icons */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-14 mb-24">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/collections/${cat.slug}`} className="flex flex-col items-center group relative">
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden mb-5 border-2 border-transparent group-hover:border-brand-gold transition-all duration-500 shadow-sm group-hover:shadow-2xl">
                <Image src={cat.icon} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                {/* Item Size Badge */}
                <div className="absolute bottom-1 right-1 bg-brand-gold text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  {getItemCount(cat.slug)}
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-neutral-400 group-hover:text-brand-black transition-colors uppercase tracking-[0.2em]">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Heading */}
        <div className="text-center mb-20">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Room Inspirations</span>
          <h2 className="text-3xl md:text-5xl font-serif text-neutral-800 leading-relaxed max-w-4xl mx-auto">
            Find the aesthetic that speaks to you <span className="text-brand-gold">—</span> and bring it home
          </h2>
        </div>

        {/* Aesthetic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {aestheticCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 ${
                card.isLarge ? 'md:col-span-2 aspect-[4/3] md:aspect-auto' : 'md:col-span-1 aspect-[2/3]'
              }`}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700" />
              
              {/* Label */}
              <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl text-white text-[10px] font-bold px-5 py-2 rounded-full border border-white/20 tracking-[0.25em]">
                {card.label}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-10 md:p-12 w-full">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 leading-tight tracking-tight">
                  {card.title.split('&').map((text, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="font-sans italic mx-2 text-brand-gold">&</span>}
                      {text}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="text-white/80 text-sm mb-8 font-medium tracking-wide opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {card.subtitle}
                </p>
                
                {card.isLarge && (
                  <div className="inline-flex items-center bg-white text-brand-black px-10 py-4 rounded-full text-[10px] font-bold tracking-[0.3em] transition-all duration-500 hover:bg-brand-gold hover:text-white uppercase shadow-lg">
                    Explore Collection
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
