'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Collection } from '@/config/collections'
import { Product } from '@/config/products'
import DetailedProductCard from './DetailedProductCard'

interface CategoryListingProps {
  collection: Collection
  allCollections: Collection[]
  allProducts: Product[]
  currentSlug: string
}

export default function CategoryListing({ 
  collection, 
  allCollections, 
  allProducts,
  currentSlug 
}: CategoryListingProps) {
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [brandFilters, setBrandFilters] = useState<string[]>([])
  
  // Filter products based on category, price, status and brand
  const filteredProducts = allProducts.filter(p => {
    const categoryMatch = p.category === currentSlug
    const statusMatch = statusFilters.length === 0 || statusFilters.includes(p.status)
    const brandMatch = brandFilters.length === 0 || brandFilters.includes(p.brand)
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1]
    return categoryMatch && statusMatch && brandMatch && priceMatch
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Top Category Navigation */}
      <div className="border-b border-neutral-100 overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center md:justify-center gap-8 md:gap-12 min-w-max">
            {allCollections.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug}`}
                className={`flex flex-col items-center group transition-all duration-300 ${currentSlug === cat.slug ? 'text-brand-black scale-110' : 'text-neutral-400'}`}
              >
                <div className={`relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 transition-all duration-300 ${currentSlug === cat.slug ? 'border-brand-black shadow-lg grayscale-0' : 'border-transparent grayscale group-hover:grayscale-0'}`}>
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <span className={`text-sm font-bold whitespace-nowrap mb-1 ${currentSlug === cat.slug ? 'text-brand-black' : 'text-neutral-600 group-hover:text-brand-black'}`}>
                  {cat.name}
                </span>
                <span className="text-xs text-neutral-400">{cat.itemCount || 0} Items</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
            {/* Filter by Price */}
            <div>
              <h3 className="text-xl font-bold text-brand-black mb-8 pb-2 border-b-2 border-brand-black inline-block">
                Filter by price
              </h3>
              <div className="space-y-6">
                <div className="relative h-2 bg-neutral-100 rounded-full">
                  <div 
                    className="absolute h-full bg-brand-black rounded-full" 
                    style={{ left: '0%', right: `${100 - (priceRange[1] / 100000) * 100}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    value={priceRange[1]}
                    step="500"
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-brand-black rounded-full shadow-md"></div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-black rounded-full shadow-md"
                    style={{ left: `${(priceRange[1] / 100000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-600">
                    Price: <span className="text-brand-black">₹{priceRange[0].toLocaleString()} — ₹{priceRange[1].toLocaleString()}</span>
                  </p>
                  <button className="bg-neutral-100 hover:bg-neutral-800 hover:text-white px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300">
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div>
              <h3 className="text-xl font-bold text-brand-black mb-8 pb-2 border-b-2 border-brand-black inline-block">
                Product Status
              </h3>
              <div className="space-y-4">
                {['In Stock', 'On Sale'].map((status) => (
                  <label key={status} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border border-neutral-300 rounded-sm checked:bg-brand-black checked:border-brand-black transition-all"
                        onChange={(e) => {
                          if (e.target.checked) setStatusFilters([...statusFilters, status])
                          else setStatusFilters(statusFilters.filter(s => s !== status))
                        }}
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-600 group-hover:text-brand-black transition-colors font-medium">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Name */}
            <div>
              <h3 className="text-xl font-bold text-brand-black mb-8 pb-2 border-b-2 border-brand-black inline-block">
                Brand Name
              </h3>
              <div className="space-y-4">
                {['Oasis Premium', 'Royal Touch', 'Luxury Living'].map((brand) => (
                  <label key={brand} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border border-neutral-300 rounded-sm checked:bg-brand-black checked:border-brand-black transition-all"
                        onChange={(e) => {
                          if (e.target.checked) setBrandFilters([...brandFilters, brand])
                          else setBrandFilters(brandFilters.filter(b => b !== brand))
                        }}
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-600 group-hover:text-brand-black transition-colors font-medium">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-500 mb-4 md:mb-0">
                Showing 1–{filteredProducts.length} of {collection.itemCount || allProducts.length} results
              </p>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                   <button className="p-1.5 text-brand-black hover:bg-neutral-100 rounded-sm transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                   </button>
                   <button className="p-1.5 text-neutral-400 hover:text-brand-black hover:bg-neutral-100 rounded-sm transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                   </button>
                </div>
                <div className="relative">
                  <select className="appearance-none text-sm font-bold pr-8 pl-0 border-none focus:ring-0 cursor-pointer text-brand-black bg-transparent uppercase tracking-wider">
                    <option>Sort by latest</option>
                    <option>Sort by price: low to high</option>
                    <option>Sort by price: high to low</option>
                  </select>
                  <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <DetailedProductCard key={product.id} product={product} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-32 text-center bg-neutral-50 rounded-lg">
                  <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-neutral-500 text-lg font-medium">No products found matching your filters.</p>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 100000])
                      setStatusFilters([])
                    }}
                    className="mt-4 text-brand-black font-bold border-b-2 border-brand-black hover:pb-1 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
