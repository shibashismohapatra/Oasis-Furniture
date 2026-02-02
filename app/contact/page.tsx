import type { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import { mainShowroom } from '@/config/showrooms'
import { getWhatsAppLink, getCallLink } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Contact Us - Oasis Furniture',
  description: 'Get in touch with Oasis Furniture showroom in Bhubaneswar',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-neutral-700">
              We&apos;re here to help you find the perfect furniture for your home
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Contact Details */}
            <div>
              <SectionHeading
                title="Visit Our Showroom"
                alignment="left"
                className="mb-8"
              />

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-brand-black mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </h3>
                  <address className="not-italic text-neutral-700 ml-7">
                    <p>{mainShowroom.address}</p>
                    <p className="text-brand-gold mt-1">{mainShowroom.landmark}</p>
                  </address>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-brand-black mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Opening Hours
                  </h3>
                  <p className="text-neutral-700 ml-7 whitespace-pre-line">
                    {mainShowroom.timings}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-brand-black mb-3">
                    Contact Us
                  </h3>
                  <div className="space-y-3 ml-7">
                    <a
                      href={getWhatsAppLink()}
                      className="flex items-center text-neutral-700 hover:text-brand-gold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp: {mainShowroom.phone}
                    </a>
                    <a
                      href={getCallLink()}
                      className="flex items-center text-neutral-700 hover:text-brand-gold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call: {mainShowroom.phone}
                    </a>
                    <a
                      href={`mailto:${mainShowroom.email}`}
                      className="flex items-center text-neutral-700 hover:text-brand-gold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {mainShowroom.email}
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href={mainShowroom.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-brand-black text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Map */}
            <div>
              <div className="rounded-sm overflow-hidden shadow-lg h-full min-h-[500px]">
                <iframe
                  src={mainShowroom.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
