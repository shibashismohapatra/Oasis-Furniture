export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  image: string
  featured: boolean
  itemCount?: number
}

export const collections: Collection[] = [
  {
    id: 'beds',
    slug: 'beds',
    name: 'Beds',
    description: 'Transform your bedroom into a sanctuary of rest and style',
    image: 'https://luxonation.in/cdn/shop/files/H77673c822756480a97fb0ee2936842fez.jpg_720x720q50.webp?v=1706773248',
    featured: true,
    itemCount: 45,
  },
  {
    id: 'sofa-sets',
    slug: 'sofa-sets',
    name: 'Sofa Sets',
    description: 'Luxurious comfort meets timeless design in our premium sofa collection',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNs5wNqdb7sRfVtQrFzb3jca3dG6HjkdEpVg&s',
    featured: true,
    itemCount: 32,
  },
  {
    id: 'dining-sets',
    slug: 'dining-sets',
    name: 'Dining Sets',
    description: 'Elegant dining furniture crafted for memorable gatherings',
    image: 'https://aarsunwoods.b-cdn.net/dining-table/Classic-Dining-Furniture-8-Seater-UH-DNG-0035-jpg.webp',
    featured: true,
    itemCount: 28,
  },
  {
    id: 'center-tables',
    slug: 'center-tables',
    name: 'Center Tables',
    description: 'The perfect centerpiece for your living room',
    image: 'https://laboro.in/cdn/shop/files/download_62_d852e311-14a6-4028-892f-0305ccc240a8.jpg?v=1744217298',
    featured: true,
    itemCount: 15,
  },
  {
    id: 'wardrobes',
    slug: 'wardrobes',
    name: 'Wardrobes',
    description: 'Spacious and elegant storage solutions for your bedroom',
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/MRIVA4DRWRBWMNWG_05.webp?v=1753178880&width=1080',
    featured: true,
    itemCount: 12,
  },
  {
    id: 'office-furniture',
    slug: 'office-furniture',
    name: 'Office Furniture',
    description: 'Ergonomic and stylish solutions for your workspace',
    image: 'https://www.vlitefurnitech.com/wp-content/uploads/2024/09/modern-office-furniture-design.webp',
    featured: true,
    itemCount: 18,
  },
  {
    id: 'tv-units',
    slug: 'tv-units',
    name: 'TV Units',
    description: 'Modern entertainment centers for your living area',
    image: '/Photos/14.jpg',
    featured: true,
    itemCount: 10,
  },
  {
    id: 'display-units',
    slug: 'display-units',
    name: 'Display Units',
    description: 'Showcase your treasures with our elegant display cabinets',
    image: '/Photos/15.jpg',
    featured: true,
    itemCount: 8,
  },
  {
    id: 'bed-side-table',
    slug: 'bed-side-table',
    name: 'Bed Side Table',
    description: 'Elegant companions for your bed',
    image: '/Photos/10.jpg',
    featured: false,
    itemCount: 25,
  },
  {
    id: 'dining-chairs',
    slug: 'dining-chairs',
    name: 'Dining Chairs',
    description: 'Comfortable and stylish seating for your dining area',
    image: '/Photos/9.jpg',
    featured: false,
    itemCount: 12,
  },
  {
    id: 'storage',
    slug: 'storage',
    name: 'Storage',
    description: 'Multi-utility storage solutions for every room',
    image: '/Photos/16.jpg',
    featured: false,
    itemCount: 14,
  },
  {
    id: 'uncategorized',
    slug: 'uncategorized',
    name: 'Uncategorized',
    description: 'Misc furniture items',
    image: '/Photos/1.jpg',
    featured: false,
    itemCount: 3,
  },
]

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}
