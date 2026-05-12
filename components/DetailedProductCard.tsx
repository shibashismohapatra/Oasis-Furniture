'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/config/products'
import { getWhatsAppLink } from '@/lib/contact'

interface DetailedProductCardProps {
  product: Product
}

export default function DetailedProductCard({ product }: DetailedProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <>
      <div className="group bg-white rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300">
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-4 left-4 z-10 bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 text-xs font-bold rounded-sm">
              -{product.discount}%
            </div>
          )}
          
          {/* Action Icons (Floating) */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={toggleModal}
              className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 transition-colors"
              title="Quick View"
            >
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 transition-colors">
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={toggleModal}
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-4">
            <button 
              onClick={toggleModal}
              className="inline-block border border-neutral-200 px-4 py-2 text-sm font-bold tracking-widest text-brand-black hover:bg-brand-black hover:text-white transition-all duration-300 uppercase"
            >
              Read more
            </button>
          </div>

          <h3 className="text-lg font-bold text-neutral-800 mb-1 group-hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-brand-black">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleModal}
          />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={toggleModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="mb-6">
                <span className="text-xs font-bold text-brand-gold tracking-[0.3em] uppercase mb-2 block">
                  {product.brand}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-brand-black leading-tight mb-4">
                  {product.name}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-brand-black">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 text-xs font-bold rounded-sm">
                    {product.discount}% OFF
                  </span>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2 border-b border-neutral-100 pb-1">Description</h4>
                  <p className="text-neutral-600 leading-relaxed italic">
                    {product.fullDescription || 'No description available for this product.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Material</h4>
                    <p className="text-sm font-medium text-neutral-800">{product.material || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Dimensions</h4>
                    <p className="text-sm font-medium text-neutral-800">{product.dimensions || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Warranty</h4>
                    <p className="text-sm font-medium text-neutral-800">{product.warranty || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Status</h4>
                    <p className={`text-sm font-bold ${product.status === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                      {product.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={getWhatsAppLink(`I'm interested in the ${product.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 px-6 font-bold text-sm tracking-widest hover:bg-[#1EBE57] transition-all uppercase"
                >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Inquire Now
                </a>
                <button 
                  onClick={toggleModal}
                  className="px-8 py-4 border-2 border-brand-black text-brand-black font-bold text-sm tracking-widest hover:bg-brand-black hover:text-white transition-all uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
