import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'
import OfferBanner from '@/components/OfferBanner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Oasis Furniture & Furnishings - Premium Showroom in Bhubaneswar',
  description: 'Discover premium sofas, dining sets, beds, and drapes at Oasis Furniture showroom in Bhubaneswar. Customization, consultation, and installation support available.',
  keywords: 'furniture Bhubaneswar, premium furniture, sofa sets, dining sets, beds, drapes, furniture showroom',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <OfferBanner />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
