import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mainShowroom } from '@/config/showrooms'
import { collections } from '@/config/collections'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="space-y-8">
           
            <p className="text-neutral-400 leading-relaxed text-sm max-w-xs">
              Bhubaneswar's premier destination for luxury furniture. We blend traditional Indian craftsmanship with modern aesthetics to create timeless spaces.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-500 group"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white/20 group-hover:bg-white rounded-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-gold font-serif text-lg mb-8 tracking-widest uppercase">Quick Explore</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Collections', 'Signature Pieces', 'Visit Showroom', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-brand-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-brand-gold font-serif text-lg mb-8 tracking-widest uppercase">Shop Categories</h3>
            <ul className="space-y-4">
              {collections.slice(0, 6).map((col) => (
                <li key={col.id}>
                  <Link 
                    href={`/collections/${col.slug}`} 
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-brand-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div>
            <h3 className="text-brand-gold font-serif text-lg mb-8 tracking-widest uppercase">Find Us</h3>
            <div className="space-y-6 text-sm text-neutral-400">
              <div className="flex gap-4">
                <svg className="w-5 h-5 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <address className="not-italic leading-relaxed">
                  {mainShowroom.address}<br />
                  {mainShowroom.landmark}
                </address>
              </div>
              <div className="flex gap-4">
                <svg className="w-5 h-5 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p><a href={`tel:${mainShowroom.whatsapp}`} className="hover:text-white transition-colors">Call: {mainShowroom.phone}</a></p>
                  <p><a href={`https://wa.me/${mainShowroom.whatsapp}`} className="hover:text-white transition-colors">WhatsApp: {mainShowroom.phone}</a></p>
                </div>
              </div>
              <div className="flex gap-4">
                <svg className="w-5 h-5 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${mainShowroom.email}`} className="hover:text-white transition-colors">{mainShowroom.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 text-xs tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Oasis Furniture & Furnishings. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-neutral-500 hover:text-brand-gold transition-colors text-xs uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {/* Payment Methods placeholder */}
            <div className="w-10 h-6 bg-white/10 rounded-sm" />
            <div className="w-10 h-6 bg-white/10 rounded-sm" />
            <div className="w-10 h-6 bg-white/10 rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  )
}
