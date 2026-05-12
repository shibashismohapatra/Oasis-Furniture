'use client'

import React from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Priyanka Mohanty',
    location: 'Bhubaneswar',
    rating: 5,
    text: 'The quality of the Sheesham wood bed I purchased is exceptional. The finish is smooth and the design is truly unique. It has completely transformed my bedroom!',
    date: 'March 2024'
  },
  {
    id: 2,
    name: 'Rajesh Das',
    location: 'Cuttack',
    rating: 5,
    text: 'Visited their showroom and was amazed by the collection. The staff helped me customize my sofa fabric to match my living room perfectly. Delivery was on time.',
    date: 'February 2024'
  },
  {
    id: 3,
    name: 'Ananya Rao',
    location: 'Bhubaneswar',
    rating: 5,
    text: 'Searching for ethnic furniture in Odisha led me to Oasis. Their attention to detail in the carvings is something you don\'t find easily. Highly recommended!',
    date: 'January 2024'
  }
]

export default function TestimonialSection() {
  return (
    <section className="bg-neutral-50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-black leading-tight">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-10 rounded-sm shadow-sm border border-neutral-100 flex flex-col hover:shadow-xl transition-all duration-500">
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-brand-gold">
                {[...Array(item.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-neutral-600 italic leading-relaxed mb-8 flex-grow">
                "{item.text}"
              </p>

              <div className="border-t border-neutral-100 pt-6 mt-auto">
                <h4 className="font-bold text-brand-black text-lg">{item.name}</h4>
                <div className="flex justify-between items-center text-xs text-neutral-400 mt-1 uppercase tracking-widest">
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
