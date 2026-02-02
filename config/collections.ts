export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  image: string
  featured: boolean
}

export const collections: Collection[] = [
  {
    id: 'sofa-sets',
    slug: 'sofa-sets',
    name: 'Sofa Sets',
    description: 'Luxurious comfort meets timeless design in our premium sofa collection',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    featured: true,
  },
  {
    id: 'dining-sets',
    slug: 'dining-sets',
    name: 'Dining Sets',
    description: 'Elegant dining furniture crafted for memorable gatherings',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    featured: true,
  },
  {
    id: 'beds',
    slug: 'beds',
    name: 'Beds & Bedroom',
    description: 'Transform your bedroom into a sanctuary of rest and style',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    featured: true,
  },
]

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}
