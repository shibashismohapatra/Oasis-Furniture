'use client'

import React from 'react'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

const projects = [
  {
    title: 'Conference Room Furniture',
    image: 'https://alder.in/wp-content/uploads/2023/06/conference-room.jpg',
    category: 'Commercial'
  },
  {
    title: 'Restaurant Furniture',
    image: 'https://alder.in/wp-content/uploads/2023/06/restaurant.jpg',
    category: 'Hospitality'
  },
  {
    title: 'Bed Room Furniture',
    image: 'https://alder.in/wp-content/uploads/2023/06/bedroom.jpg',
    category: 'Residential'
  },
  {
    title: 'Executive Office Set',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    category: 'Office'
  },
  {
    title: 'Luxury Cafe Lounge',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    category: 'Hospitality'
  },
  {
    title: 'Modular Kitchen Project',
    image: 'https://images.unsplash.com/photo-1556911223-4470c33d5f73?w=800&q=80',
    category: 'Residential'
  }
]

const benefits = [
  {
    title: 'EXCLUSIVE PRICING',
    description: 'Enjoy exclusive discounts and incentives, designed especially for you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'DEDICATED 24x7 SUPPORT',
    description: 'Your dedicated point of contact at Oasis Furniture is a quick phone call away.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    title: 'QUALITY YOU CAN TRUST',
    description: 'Our furniture undergoes thorough checks to ensure that you enjoy best-in-class quality.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'SPEEDY RESPONSE & DELIVERY',
    description: 'No follow-ups, no delays. We promise seamless, on-time delivery at your convenience.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
]

const sectors = [
  { name: 'Government', icon: '🏛️' },
  { name: 'Restaurant', icon: '🍴' },
  { name: 'Hotels', icon: '🏨' },
  { name: 'Residential', icon: '🏠' },
  { name: 'Office', icon: '💼' },
  { name: 'Education', icon: '🎓' }
]

export default function ShowroomProjectPage() {
  const handleProjectInquiry = (project: string) => {
    trackEvent('project_inquiry', { project })
  }

  return (
    <div className="bg-white">
      {/* Sketch Hero Section */}
      <section className="relative h-[40vh] flex flex-col items-center justify-end overflow-hidden bg-[#F5F5F5]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1544450181-29597f60533c?w=1600&q=80"
            alt="Furniture Sketch Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center pb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#A52A2A] mb-4">Our Projects</h1>
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-neutral-800 text-sm md:text-base leading-relaxed">
              <span className="font-bold">Beautifully Crafted</span> Furniture is all about providing a sense of comfort. At Oasis, we strive to make that possible, along with focusing on important metrics such as build-quality and consistency. Read about some of the projects that Oasis had taken up in the past to understand our way of business.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 shadow-md transition-all duration-500 hover:shadow-xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Badge */}
                  <div className="absolute top-6 left-6 bg-white py-3 px-5 shadow-lg flex flex-col">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Designed by</span>
                    <span className="text-xs text-brand-black font-bold">Oasis Furniture</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif text-brand-black group-hover:text-[#A52A2A] transition-colors">
                  {project.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-black leading-tight uppercase tracking-wide">
              SOMETIMES, <br />
              <span className="text-2xl md:text-3xl normal-case italic font-light text-neutral-600">good things come in large packages.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 max-w-5xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="w-20 h-20 rounded-full border-2 border-brand-gold flex items-center justify-center shrink-0 shadow-lg bg-white group hover:bg-brand-gold transition-colors duration-500">
                  <div className="text-brand-gold group-hover:text-white transition-colors">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-black mb-3 tracking-widest uppercase">{benefit.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {sectors.map((sector) => (
              <div key={sector.name} className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 border border-neutral-100">
                  {sector.icon}
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] group-hover:text-brand-black transition-colors">
                  {sector.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-brand-black mb-6">Have a large project in mind?</h3>
            <p className="text-neutral-500 mb-10">
              Our B2B team specializes in large-scale furniture procurement for hotels, restaurants, and corporate offices.
            </p>
            <a
              href={getWhatsAppLink('I want to discuss a bulk project with Oasis Furniture.')}
              className="inline-flex items-center gap-3 bg-brand-black text-white px-10 py-5 rounded-full font-bold text-xs tracking-widest hover:bg-brand-gold transition-all duration-500 uppercase shadow-2xl"
            >
              Consult Our Project Team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
