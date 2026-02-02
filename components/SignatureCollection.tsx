import React from 'react'
import SectionHeading from './SectionHeading'
import ProductCard from './ProductCard'

export default function SignatureCollection() {
  const products = [
    {
      name: 'Premium Sofa Collection',
      description: 'Luxurious comfort meets timeless design in our handcrafted sofa sets',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      collectionSlug: 'sofa-sets',
    },
    {
      name: 'Elegant Dining Sets',
      description: 'Create memorable dining experiences with our refined furniture pieces',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
      collectionSlug: 'dining-sets',
    },
    {
      name: 'Bedroom Sanctuary',
      description: 'Transform your bedroom into a haven of rest and sophisticated style',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
      collectionSlug: 'beds',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Signature Collection"
          subtitle="Explore our curated selection of premium furniture designed for modern living"
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
