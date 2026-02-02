# Oasis Furniture & Furnishings

Premium furniture showroom website for Oasis Furniture in Bhubaneswar, Odisha.

## Overview

This is a Next.js 14 website for Oasis Furniture, a premium furniture showroom. The website showcases furniture collections and drives customers to visit the physical showroom. No ecommerce functionality - all purchases are made in-person at the showroom.

## Features

- **Premium Design**: Black & gold brand colors with clean, elegant layouts
- **Collections**: Sofa sets, dining sets, and beds
- **Showroom-First**: All CTAs direct users to visit, WhatsApp, or call
- **Monthly Offers**: Config-driven promotional banners
- **Mobile-First**: Fully responsive design
- **WhatsApp Integration**: Floating WhatsApp button on all pages
- **Analytics Tracking**: Event tracking for CTAs and user interactions
- **SEO Optimized**: Metadata and structured content

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter (sans-serif), Playfair Display (serif)
- **Deployment**: Ready for Vercel/Netlify

## Project Structure

```
oasis-furniture/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with header/footer
│   ├── page.tsx             # Home page
│   ├── collections/         # Collections pages
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── showroom/            # Showroom page
│   ├── privacy/             # Privacy policy
│   └── terms/               # Terms & conditions
├── components/              # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── CollectionCard.tsx
│   ├── WhatsAppFloatingButton.tsx
│   └── ...
├── config/                  # Configuration files
│   ├── collections.ts       # Furniture collections data
│   ├── showrooms.ts        # Showroom location data
│   └── monthlyOffer.ts     # Monthly promotional offers
├── lib/                     # Utility functions
│   ├── analytics.ts        # Analytics tracking
│   └── contact.ts          # Contact helper functions
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Monthly Offers

Edit `config/monthlyOffer.ts` to update the monthly promotional banner:

```typescript
export const monthlyOffer: MonthlyOffer = {
  title: 'February Showroom Special',
  description: 'Exclusive discounts on premium sofa sets',
  discount: 'Up to 25% off',
  validUntil: 'February 28, 2026',
  isActive: true, // Set to false to disable
}
```

### Showroom Information

Edit `config/showrooms.ts` to update showroom details:

```typescript
export const showrooms: ShowroomLocation[] = [
  {
    name: 'Oasis Furniture Main Showroom',
    address: 'Plot No. 123, Patia, Bhubaneswar, Odisha 751024',
    phone: '+91 98765 43210',
    // ... other fields
  },
]
```

### Brand Colors

Colors are defined in `tailwind.config.ts`:

- Black: `#000000`
- Gold: `#D4AF37`
- Neutral tones for backgrounds and text

## Key Pages

- **Home** (`/`): Hero, signature collection, about section, showroom CTA
- **Collections** (`/collections`): Browse all furniture categories
- **Collection Detail** (`/collections/[slug]`): View specific collection items
- **About** (`/about`): Company story and values
- **Showroom** (`/showroom`): Location, hours, map, and directions
- **Contact** (`/contact`): Contact information and map

## Primary CTAs

1. **Get Directions**: Google Maps deep link to showroom
2. **WhatsApp**: Direct messaging for inquiries
3. **Call**: Phone call link

## Analytics Events

The site tracks these events (configured in `lib/analytics.ts`):

- `cta_directions_click`
- `cta_whatsapp_click`
- `cta_call_click`
- `monthly_offer_click`
- `collection_card_click`
- `product_card_click`

## Customization

### Adding New Collections

1. Add to `config/collections.ts`
2. Collection page will be auto-generated at `/collections/[slug]`

### Changing Contact Details

Update `lib/contact.ts` with phone, WhatsApp, and email

### Updating Images

Replace placeholder Unsplash URLs with actual product images

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

## License

© 2026 Oasis Furniture & Furnishings. All rights reserved.

## Support

For questions or support:
- Email: info@oasisfurniture.in
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210
