'use client'

import React, { useState } from 'react'

const faqs = [
  {
    question: 'Do you offer customization for furniture?',
    answer: 'Yes, we specialize in customization. From fabric choices and wood finishes to exact dimensions, our team can tailor most pieces in our collection to meet your specific requirements.'
  },
  {
    question: 'What is the standard delivery time?',
    answer: 'For in-stock items, we typically deliver within 3-5 business days within Bhubaneswar. Custom-made furniture generally takes 4-6 weeks depending on the complexity of the design.'
  },
  {
    question: 'Do you provide furniture installation?',
    answer: 'Absolutely. We provide professional installation for all major furniture pieces like beds, wardrobes, and dining sets at no extra cost within our standard delivery areas.'
  },
  {
    question: 'Can I visit the showroom to see the products?',
    answer: 'Yes, we highly recommend visiting our premium showroom in Bhubaneswar. You can experience the quality, comfort, and craftsmanship of our furniture firsthand.'
  },
  {
    question: 'What kind of wood do you use?',
    answer: 'We primarily use high-quality Solid Sheesham (Indian Rosewood), Teak Wood, and premium Grade-A Plywood depending on the design and structural requirements of the piece.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Information</span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-black">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-neutral-100 last:border-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 flex justify-between items-center text-left group"
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-brand-gold' : 'text-brand-black group-hover:text-brand-gold'}`}>
                  {faq.question}
                </span>
                <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-neutral-500 leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
