import React from 'react'
import Link from 'next/link'

interface PrimaryButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  fullWidth?: boolean
}

export default function PrimaryButton({ 
  children, 
  href, 
  onClick, 
  className = '',
  fullWidth = false 
}: PrimaryButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-8 py-4 bg-brand-black text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors duration-200 ${fullWidth ? 'w-full' : ''} ${className}`

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
