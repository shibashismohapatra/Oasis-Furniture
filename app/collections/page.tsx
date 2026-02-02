import type { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import CollectionCard from '@/components/CollectionCard'
import { collections } from '@/config/collections'
import { monthlyOffer } from '@/config/monthlyOffer'
import { getWhatsAppLink } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Furniture Collections - Oasis Furniture',
  description: 'Browse our premium furniture collections including sofas, dining sets, and beds',
}

export default function CollectionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-4">
              Our Collections
            </h1>
            <p className="text-neutral-700 text-lg">
              Discover premium furniture crafted for modern living. Every piece is selected for quality, comfort, and timeless design.
            </p>
            
            {monthlyOffer.isActive && (
              <div className="mt-8 p-6 bg-brand-gold/10 border border-brand-gold rounded-sm">
                <p className="text-brand-black font-medium mb-2">
                  ✨ {monthlyOffer.title}
                </p>
                <p className="text-neutral-700 mb-4">{monthlyOffer.description}</p>
                <a
                  href={getWhatsAppLink(`I'm interested in the ${monthlyOffer.title}`)}
                  className="inline-flex items-center text-brand-black font-medium hover:text-brand-gold transition-colors"
                >
                  WhatsApp to Reserve Offer
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} {...collection} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-600 mb-4">
            All items available at our Bhubaneswar showroom
          </p>
          <a
            href="/showroom"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-black text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Visit Showroom
          </a>
        </div>
      </section>
    </>
  )
}
