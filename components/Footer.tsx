import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="relative w-72 h-20 mb-4">
              <Image
                src="/Photos/oasis.png"
                alt="Oasis Furniture"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Premium furniture showroom in Bhubaneswar. Crafting comfort and style for your home.
            </p>
          </div>

          {/* Showroom Info */}
          <div>
            <h3 className="text-brand-gold font-serif text-xl mb-4">Visit Our Showroom</h3>
            <address className="not-italic text-neutral-300 space-y-2">
              <p>{mainShowroom.address}</p>
              <p>{mainShowroom.landmark}</p>
              <p className="text-sm text-neutral-400 mt-3">{mainShowroom.timings}</p>
            </address>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-gold font-serif text-xl mb-4">Get in Touch</h3>
            <div className="space-y-2 text-neutral-300">
              <p>
                <a href={`https://wa.me/${mainShowroom.whatsapp}`} className="hover:text-brand-gold transition-colors">
                  WhatsApp: {mainShowroom.phone}
                </a>
              </p>
              <p>
                <a href={`tel:${mainShowroom.whatsapp}`} className="hover:text-brand-gold transition-colors">
                  Call: {mainShowroom.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${mainShowroom.email}`} className="hover:text-brand-gold transition-colors">
                  {mainShowroom.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Oasis Furniture & Furnishings. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
