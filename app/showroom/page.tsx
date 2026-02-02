'use client'

import type { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink, getCallLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

export default function ShowroomPage() {
  const handleDirectionsClick = () => {
    trackEvent('cta_directions_click', { source: 'showroom_page' })
  }

  const handleWhatsAppClick = () => {
    trackEvent('cta_whatsapp_click', { source: 'showroom_page' })
  }

  const handleCallClick = () => {
    trackEvent('cta_call_click', { source: 'showroom_page' })
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-6">
              Visit Our Showroom
            </h1>
            <p className="text-xl text-neutral-700">
              Experience our premium furniture collection in person
            </p>
          </div>
        </div>
      </section>

      {/* Showroom Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-sm shadow-lg p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-serif text-brand-gold mb-8">
                {mainShowroom.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-brand-black mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </h3>
                  <address className="not-italic text-neutral-700 mb-2">
                    {mainShowroom.address}
                  </address>
                  <p className="text-brand-gold">{mainShowroom.landmark}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-brand-black mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Opening Hours
                  </h3>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {mainShowroom.timings}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href={mainShowroom.googleMapsUrl}
                  onClick={handleDirectionsClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-4 bg-brand-black text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>

                <a
                  href={getWhatsAppLink()}
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center px-6 py-4 bg-[#25D366] text-white font-medium rounded-sm hover:bg-[#20BA5A] transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                <a
                  href={getCallLink()}
                  onClick={handleCallClick}
                  className="flex items-center justify-center px-6 py-4 border-2 border-brand-black text-brand-black font-medium rounded-sm hover:bg-brand-black hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Us
                </a>
              </div>

              <div className="mt-6 text-center">
                <a
                  href={`mailto:${mainShowroom.email}`}
                  className="text-neutral-600 hover:text-brand-gold transition-colors"
                >
                  {mainShowroom.email}
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-sm overflow-hidden shadow-lg">
              <iframe
                src={mainShowroom.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              title="What to Expect"
              subtitle="Make the most of your showroom visit"
              className="mb-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-brand-black mb-2">See & Touch</h3>
                <p className="text-neutral-600 text-sm">
                  Experience the quality and craftsmanship of our furniture firsthand
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-brand-black mb-2">Expert Guidance</h3>
                <p className="text-neutral-600 text-sm">
                  Get personalized recommendations from our design consultants
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-brand-black mb-2">Customize</h3>
                <p className="text-neutral-600 text-sm">
                  Explore fabric swatches, finishes, and customization options
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
