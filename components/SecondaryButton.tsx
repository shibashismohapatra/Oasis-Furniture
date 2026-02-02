import React from 'react'
import Link from 'next/link'

interface SecondaryButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export default function SecondaryButton({ 
  children, 
  href, 
  onClick, 
  className = '' 
}: SecondaryButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-8 py-4 border-2 border-brand-black text-brand-black font-medium rounded-sm hover:bg-brand-black hover:text-white transition-all duration-200 ${className}`

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
    </button>
  )
}
