'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '@/components/SectionHeading'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink, getCallLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

export default function ContactPage() {
  const handleActionClick = (type: string, source: string) => {
    trackEvent('contact_page_action', { type, source })
  }

  return (
    <div className="bg-white">
      {/* Premium Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1616489953149-8079717cb0b5?w=1600&q=80"
          alt="Contact Hero"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.5em] mb-6 block animate-fade-in">
            Connect With Us
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Get in Touch
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto" />
          <p className="text-white/90 text-lg md:text-xl mt-8 max-w-2xl mx-auto">
            Visit our flagship showroom or reach out to us — we're here to help you create your dream space
          </p>
        </div>
      </section>

      {/* Contact Information & Map Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

              {/* Left - Contact Details */}
              <div className="space-y-10">
                {/* Showroom Card */}
                <div className="bg-[#FAF7F2] rounded-2xl p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif text-brand-black mb-2">
                        {mainShowroom.name}
                      </h2>
                      <p className="text-brand-gold text-sm font-medium">Flagship Showroom, Bhubaneswar</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex gap-4">
                      <svg className="w-5 h-5 text-brand-gold mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-neutral-700 leading-relaxed">
                          {mainShowroom.address}
                        </p>
                        <p className="text-brand-gold font-medium mt-1">{mainShowroom.landmark}</p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex gap-4">
                      <svg className="w-5 h-5 text-brand-gold mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                          {mainShowroom.timings}
                        </p>
                      </div>
                    </div>

                    {/* Phone & WhatsApp */}
                    <div className="flex gap-4">
                      <svg className="w-5 h-5 text-brand-gold mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div className="space-y-2">
                        <a
                          href={getCallLink()}
                          onClick={() => handleActionClick('call', 'contact_page')}
                          className="block text-neutral-700 hover:text-brand-gold transition-colors"
                        >
                          {mainShowroom.phone}
                        </a>
                        <a
                          href={getWhatsAppLink()}
                          onClick={() => handleActionClick('whatsapp', 'contact_page')}
                          className="block text-neutral-700 hover:text-brand-gold transition-colors"
                        >
                          WhatsApp: {mainShowroom.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                      <svg className="w-5 h-5 text-brand-gold mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a
                        href={`mailto:${mainShowroom.email}`}
                        onClick={() => handleActionClick('email', 'contact_page')}
                        className="text-neutral-700 hover:text-brand-gold transition-colors"
                      >
                        {mainShowroom.email}
                      </a>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-10 space-y-3">
                    <a
                      href={mainShowroom.googleMapsUrl}
                      onClick={() => handleActionClick('directions', 'contact_page')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-black text-white py-4 rounded-full font-bold text-sm tracking-[0.2em] hover:bg-brand-gold transition-all duration-500 uppercase text-center flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={getWhatsAppLink('Hello Oasis, I would like to inquire about your furniture collections.')}
                        onClick={() => handleActionClick('whatsapp_cta', 'contact_page')}
                        className="bg-[#25D366] text-white py-3 rounded-full font-semibold text-xs tracking-[0.1em] hover:bg-[#20BA5A] transition-all duration-500 uppercase text-center flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={getCallLink()}
                        onClick={() => handleActionClick('call_cta', 'contact_page')}
                        className="border-2 border-brand-black text-brand-black py-3 rounded-full font-semibold text-xs tracking-[0.1em] hover:bg-brand-black hover:text-white transition-all duration-500 uppercase text-center"
                      >
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Premium Service Promise */}
                <div className="bg-gradient-to-r from-[#FAF7F2] to-white rounded-2xl p-6 border border-neutral-100">
                  <h3 className="font-serif text-xl text-brand-black mb-4">Why Visit Us?</h3>
                  <div className="space-y-3">
                    {[
                      'Experience 1000+ premium furniture designs',
                      'Expert interior design consultation',
                      'Customization with 500+ fabric swatches',
                      'Exclusive showroom offers & discounts'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-neutral-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Premium Map Card */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 sticky top-24">
                  {/* Map Header */}
                  <div className="bg-brand-black px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-brand-gold text-xs font-bold uppercase tracking-wider">Find Us Here</p>
                        <p className="text-white text-sm font-medium mt-1">{mainShowroom.landmark}</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>

                  {/* Map Iframe */}
                  <div className="relative w-full" style={{ minHeight: '500px' }}>
                    <iframe
                      src={mainShowroom.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: '500px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale-0 hover:grayscale-0 transition-all duration-500"
                      title="Oasis Furniture Showroom Location"
                    />
                  </div>

                  {/* Map Footer */}
                  <div className="bg-[#FAF7F2] px-6 py-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Open today until 9:00 PM</span>
                      </div>
                      <a
                        href={mainShowroom.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-gold hover:underline text-xs font-medium"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Connect Section */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-black mb-4">
            Can't Visit Right Now?
          </h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            We're just a message away — reach out to us on WhatsApp for a virtual consultation
          </p>
          <a
            href={getWhatsAppLink('Hello Oasis, I would like to schedule a virtual consultation.')}
            onClick={() => handleActionClick('virtual_consultation', 'contact_page')}
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#20BA5A] transition-all duration-500 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Schedule Virtual Consultation
          </a>
        </div>
      </section>
    </div>
  )
}