import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getCollectionBySlug, collections } from '@/config/collections'
import { getWhatsAppLink } from '@/lib/contact'
import SectionHeading from '@/components/SectionHeading'

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug)
  
  if (!collection) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${collection.name} - Oasis Furniture`,
    description: collection.description,
  }
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollectionBySlug(params.slug)

  if (!collection) {
    notFound()
  }

  const sampleProducts = [
    {
      name: 'Premium Deluxe Set',
      image: collection.image,
      description: 'Luxurious craftsmanship with timeless appeal',
    },
    {
      name: 'Contemporary Classic',
      image: collection.image,
      description: 'Modern design meets traditional comfort',
    },
    {
      name: 'Royal Collection',
      image: collection.image,
      description: 'Elegant sophistication for discerning tastes',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-neutral-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
            {collection.name}
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Explore This Collection"
            subtitle="Visit our showroom to see the complete range and customize your selection"
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sampleProducts.map((product) => (
              <div key={product.name} className="bg-white rounded-sm overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-brand-gold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {product.description}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Available in Bhubaneswar showroom
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Interested in this collection? Connect with us to discuss customization options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getWhatsAppLink(`I'm interested in the ${collection.name}`)}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-medium rounded-sm hover:bg-[#20BA5A] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <a
                href="/showroom"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-black text-brand-black font-medium rounded-sm hover:bg-brand-black hover:text-white transition-colors"
              >
                Visit Showroom
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
