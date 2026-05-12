'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <>
      {/* Heritage Section */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
                  alt="Luxury Interior Design"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-1000"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />
              
              {/* Experience Badge */}
              <div className="absolute -right-8 bottom-20 z-20 bg-brand-black text-white p-8 rounded-2xl shadow-2xl animate-fade-in hidden md:block">
                <div className="text-4xl font-serif text-brand-gold mb-1">25+</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Years of<br />Craftsmanship</div>
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-1/2">
              <div className="max-w-xl">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Our Heritage</span>
                <h2 className="text-4xl md:text-6xl font-serif text-brand-black mb-8 leading-[1.1]">
                  Crafting Spaces Where <span className="text-brand-gold italic">Life Happens.</span>
                </h2>
                
                <div className="space-y-6 text-neutral-600 leading-relaxed text-lg font-light">
                  <p>
                    At Oasis Furniture, we believe your home is a reflection of your soul. Since 1999, we have been Bhubaneswar's premier curator of fine furniture, dedicated to bringing unparalleled elegance and comfort to every household.
                  </p>
                  <p>
                    Our collection is more than just decor; it's a testament to the timeless art of furniture making. We source only the highest quality Solid Sheesham and Teak wood, ensuring that every piece you bring home becomes a legacy for generations.
                  </p>
                </div>

                {/* Pillars of Excellence */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="group">
                    <div className="w-12 h-px bg-brand-gold mb-4 group-hover:w-20 transition-all duration-500" />
                    <h4 className="font-bold text-brand-black text-sm uppercase tracking-widest mb-2">Bespoke Design</h4>
                    <p className="text-neutral-400 text-xs">Tailored solutions for your unique lifestyle.</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-px bg-brand-gold mb-4 group-hover:w-20 transition-all duration-500" />
                    <h4 className="font-bold text-brand-black text-sm uppercase tracking-widest mb-2">Global Quality</h4>
                    <p className="text-neutral-400 text-xs">Sourced materials and finishes of international grade.</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-px bg-brand-gold mb-4 group-hover:w-20 transition-all duration-500" />
                    <h4 className="font-bold text-brand-black text-sm uppercase tracking-widest mb-2">Expert Care</h4>
                    <p className="text-neutral-400 text-xs">Lifetime support and professional installation.</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-px bg-brand-gold mb-4 group-hover:w-20 transition-all duration-500" />
                    <h4 className="font-bold text-brand-black text-sm uppercase tracking-widest mb-2">Sustainable Art</h4>
                    <p className="text-neutral-400 text-xs">Ethically sourced wood and eco-friendly practices.</p>
                  </div>
                </div>

                <div className="mt-16">
                  <Link 
                    href="/showroom" 
                    className="inline-flex items-center gap-4 text-brand-black font-bold text-xs uppercase tracking-[0.3em] group"
                  >
                    <span className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-white transition-all duration-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    Explore Our Legacy
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values / Philosophy Section */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Our Philosophy</span>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-black mb-6">
              Where Vision Meets <span className="text-brand-gold italic">Craftsmanship</span>
            </h2>
            <div className="w-20 h-px bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Creative Ideas */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-500">
                <svg className="w-7 h-7 text-brand-gold group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-brand-black mb-3">Creative Ideas</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Helpful to make various furniture, catering to workplace and home segments with innovative, durable and stylish range including living, dining, bedroom and workplace ensembles.
              </p>
            </div>

            {/* Comfort Interior */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-500">
                <svg className="w-7 h-7 text-brand-gold group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-brand-black mb-3">Comfort Interior</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Extensive effort in enhancing innovation and technological advancement. Providing comfortable home furniture to meet client needs with sensitive, efficient and dedicated teamwork.
              </p>
            </div>

            {/* Creating Style */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-500">
                <svg className="w-7 h-7 text-brand-gold group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-brand-black mb-3">Creating Style</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                We design furniture with style. Client care is our top concern. Building strong customer connections through open interaction, trust and solution-focused approach.
              </p>
            </div>

            {/* Modern Design */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-500">
                <svg className="w-7 h-7 text-brand-gold group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-brand-black mb-3">Modern Design</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Working hard to create clean designs prior to manufacturing. Delivering furniture as per personal client requirements with long-term relationships built on trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Milestones */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stats/Achievements */}
            <div>
              <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Our Achievements</span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-8">
                Building Trust, One <span className="text-brand-gold italic">Home at a Time</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border-l-2 border-brand-gold pl-6">
                  <div className="text-4xl font-serif text-brand-black mb-2">25+</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500">Years of Excellence</div>
                </div>
                <div className="border-l-2 border-brand-gold pl-6">
                  <div className="text-4xl font-serif text-brand-black mb-2">50K+</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500">Happy Customers</div>
                </div>
                <div className="border-l-2 border-brand-gold pl-6">
                  <div className="text-4xl font-serif text-brand-black mb-2">1000+</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500">Designs Delivered</div>
                </div>
                <div className="border-l-2 border-brand-gold pl-6">
                  <div className="text-4xl font-serif text-brand-black mb-2">500+</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500">Fabric Swatches</div>
                </div>
              </div>
            </div>

            {/* Smartwood Brand Story Card */}
            <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-8 md:p-10 border border-neutral-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-brand-gold"></div>
                <div>
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">Proudly Presenting</span>
                  <h3 className="text-2xl font-serif text-brand-black">Smartwood</h3>
                </div>
              </div>
              
              <p className="text-neutral-600 leading-relaxed mb-6">
                <span className="font-bold text-brand-black">Smartwood</span>, an exclusive Indian brand, was launched in 2010 with the objective of converting houses into homes in tandem with the commitment of <span className="font-semibold text-brand-gold">'Quality Prime'</span>.
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-start gap-3">
                  <svg className="w-8 h-8 text-brand-gold shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
                  </svg>
                  <p className="text-neutral-700 italic text-sm leading-relaxed">
                    "The result is Smartwood being blessed with the love and trust of our innumerable happy customers across the country."
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-neutral-600">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-neutral-600">Trusted Brand</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-neutral-600">Pan India Presence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Constant Vision Section */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-px bg-brand-gold mx-auto mb-4" />
              <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em]">Our Constant Vision</span>
              <div className="w-16 h-px bg-brand-gold mx-auto mt-4" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-serif text-brand-black leading-relaxed">
              To create timeless furniture that transforms houses into homes, 
              blending <span className="text-brand-gold italic">tradition with innovation</span>, 
              quality with affordability, and <span className="text-brand-gold italic">dreams with reality</span>.
            </h2>
            
            <div className="mt-12 flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-neutral-600">Innovation First</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-neutral-600">Quality Prime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-neutral-600">Customer First</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}