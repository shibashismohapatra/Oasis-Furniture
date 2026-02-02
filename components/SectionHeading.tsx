import React from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  alignment?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  alignment = 'center',
  className = '' 
}: SectionHeadingProps) {
  return (
    <div className={`${alignment === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brand-gold mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
