export interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  originalPrice: number
  image: string
  status: 'In Stock' | 'On Sale' | 'Out of Stock'
  brand: string
  discount?: number
  material?: string
  dimensions?: string
  warranty?: string
  fullDescription?: string
}


export const products: Product[] = [
  // Beds
  {
    id: 'bed-1',
    name: 'Luxury King Bed',
    slug: 'luxury-king-bed',
    category: 'beds',
    price: 42000,
    originalPrice: 46000,
    image: 'https://i.pinimg.com/736x/cb/0e/4d/cb0e4d37be144103c6e97192f3b3cde9.jpg',
    status: 'On Sale',
    brand: 'Oasis Premium',
    discount: 8,
    material: 'Solid Sheesham Wood',
    dimensions: '78" x 72"',
    warranty: '10 Years',
    fullDescription: 'Premium king size bed with elegant handcrafted finish.',
  },
  {
    id: 'bed-2',
    name: 'Modern Queen Bed',
    slug: 'modern-queen-bed',
    category: 'beds',
    price: 32000,
    originalPrice: 35000,
    image: 'https://woodentwist.com/cdn/shop/products/untitled.1274.jpg?v=1743288748',
    status: 'In Stock',
    brand: 'Oasis Premium',
    material: 'Engineered Wood',
    dimensions: '72" x 60"',
    warranty: '5 Years',
    fullDescription: 'Modern queen bed with storage and soft headboard.',
  },

  // Sofa Sets
  {
    id: 'sofa-1',
    name: '5 Seater Luxury Sofa',
    slug: '5-seater-luxury-sofa',
    category: 'sofa-sets',
    price: 58000,
    originalPrice: 64000,
    image: 'https://i.pinimg.com/736x/cb/0e/4d/cb0e4d37be144103c6e97192f3b3cde9.jpg',
    status: 'On Sale',
    brand: 'Oasis Living',
    discount: 10,
    material: 'Velvet Fabric & Wood',
    dimensions: '5 Seater',
    warranty: '5 Years',
    fullDescription: 'Elegant luxury sofa with premium cushioning.',
  },
  {
    id: 'sofa-2',
    name: 'L Shape Sofa Set',
    slug: 'l-shape-sofa-set',
    category: 'sofa-sets',
    price: 76000,
    originalPrice: 82000,
    image: 'https://m.media-amazon.com/images/I/61HVVU8jFcL.jpg',
    status: 'In Stock',
    brand: 'Oasis Living',
    discount: 7,
    material: 'Premium Fabric',
    dimensions: '8ft x 6ft',
    warranty: '5 Years',
    fullDescription: 'Spacious L shape sofa perfect for modern homes.',
  },

  // Dining Sets
  {
    id: 'dining-1',
    name: '6 Seater Dining Set',
    slug: '6-seater-dining-set',
    category: 'dining-sets',
    price: 45000,
    originalPrice: 49000,
    image: 'https://www.livinstyles.com/cdn/shop/files/kalpana-stainless-steel-pvd-coated-6-seater-dining-table-set-121.webp?v=1757203279&width=1080',
    status: 'On Sale',
    brand: 'Oasis Dining',
    discount: 8,
    material: 'Sheesham Wood',
    dimensions: '6 Seater',
    warranty: '5 Years',
    fullDescription: 'Elegant dining table with comfortable chairs.',
  },
  {
    id: 'dining-2',
    name: '4 Seater Compact Dining',
    slug: '4-seater-compact-dining',
    category: 'dining-sets',
    price: 28000,
    originalPrice: 31000,
    image: 'https://moonwooden.in/cdn/shop/files/p34.jpg?v=1717078630',
    status: 'In Stock',
    brand: 'Oasis Dining',
    material: 'Solid Wood',
    dimensions: '4 Seater',
    warranty: '3 Years',
    fullDescription: 'Compact dining set ideal for apartments.',
  },

  // Center Tables
  {
    id: 'center-1',
    name: 'Glass Center Table',
    slug: 'glass-center-table',
    category: 'center-tables',
    price: 12000,
    originalPrice: 14500,
    image: 'https://korefurniture.com/wp-content/uploads/2024/06/01.jpg',
    status: 'On Sale',
    brand: 'Oasis Decor',
    discount: 12,
    material: 'Glass & Metal',
    dimensions: '48" x 24"',
    warranty: '2 Years',
    fullDescription: 'Stylish glass center table with gold finish.',
  },
  {
    id: 'center-2',
    name: 'Wooden Coffee Table',
    slug: 'wooden-coffee-table',
    category: 'center-tables',
    price: 15000,
    originalPrice: 17000,
    image: 'https://media.designcafe.com/wp-content/uploads/2023/05/22190708/sheesham-wood-coffee-table.jpg',
    status: 'In Stock',
    brand: 'Oasis Decor',
    material: 'Solid Wood',
    dimensions: '42" x 22"',
    warranty: '3 Years',
    fullDescription: 'Classic wooden coffee table for living spaces.',
  },

  // Dining Chairs
  {
    id: 'chair-1',
    name: 'Premium Dining Chair',
    slug: 'premium-dining-chair',
    category: 'dining-chairs',
    price: 6500,
    originalPrice: 7200,
    image: 'https://static1.squarespace.com/static/57e620c315d5db019000421a/61e748b30d72427e217a1c4b/61e7540e27609c0425249300/1642570773594/Modern+Black+Walnut+Dining+Chair.jpg?format=1500w',
    status: 'In Stock',
    brand: 'Oasis Seating',
    material: 'Wood & Fabric',
    dimensions: 'Standard',
    warranty: '2 Years',
    fullDescription: 'Comfortable premium dining chair with cushion.',
  },

  // Bed Side Tables
  {
    id: 'side-1',
    name: 'Modern Bed Side Table',
    slug: 'modern-bed-side-table',
    category: 'bed-side-table',
    price: 8500,
    originalPrice: 9500,
    image: '/Photos/10.jpg',
    status: 'On Sale',
    brand: 'Oasis Premium',
    discount: 5,
    material: 'Engineered Wood',
    dimensions: '20" x 18"',
    warranty: '2 Years',
    fullDescription: 'Compact bedside table with drawer storage.',
  },

  // Wardrobes
  {
    id: 'wardrobe-1',
    name: '3 Door Wardrobe',
    slug: '3-door-wardrobe',
    category: 'wardrobes',
    price: 52000,
    originalPrice: 58000,
    image: '/Photos/11.jpg',
    status: 'On Sale',
    brand: 'Oasis Storage',
    discount: 10,
    material: 'Engineered Wood',
    dimensions: '3 Door',
    warranty: '7 Years',
    fullDescription: 'Spacious wardrobe with premium finish.',
  },

  // Office Furniture
  {
    id: 'office-1',
    name: 'Executive Office Chair',
    slug: 'executive-office-chair',
    category: 'office-chair',
    price: 14000,
    originalPrice: 16000,
    image: '/Photos/12.jpg',
    status: 'In Stock',
    brand: 'Oasis Office',
    material: 'Leather & Steel',
    dimensions: 'Adjustable',
    warranty: '3 Years',
    fullDescription: 'Ergonomic office chair with lumbar support.',
  },
  {
    id: 'office-2',
    name: 'Study Table Pro',
    slug: 'study-table-pro',
    category: 'office-study-tables',
    price: 18000,
    originalPrice: 21000,
    image: '/Photos/13.jpg',
    status: 'On Sale',
    brand: 'Oasis Office',
    discount: 6,
    material: 'Wood & Metal',
    dimensions: '48" x 24"',
    warranty: '3 Years',
    fullDescription: 'Modern study table with drawer storage.',
  },

  // TV Units
  {
    id: 'tv-1',
    name: 'Modern TV Unit',
    slug: 'modern-tv-unit',
    category: 'tv-units',
    price: 24000,
    originalPrice: 27000,
    image: '/Photos/14.jpg',
    status: 'On Sale',
    brand: 'Oasis Decor',
    discount: 9,
    material: 'Engineered Wood',
    dimensions: '72"',
    warranty: '5 Years',
    fullDescription: 'Stylish TV unit with storage cabinets.',
  },

  // Display Units
  {
    id: 'display-1',
    name: 'Luxury Display Cabinet',
    slug: 'luxury-display-cabinet',
    category: 'display-units',
    price: 36000,
    originalPrice: 40000,
    image: '/Photos/15.jpg',
    status: 'In Stock',
    brand: 'Oasis Decor',
    material: 'Glass & Wood',
    dimensions: '6ft',
    warranty: '5 Years',
    fullDescription: 'Premium display cabinet for elegant interiors.',
  },

  // Storage
  {
    id: 'storage-1',
    name: 'Multi Utility Cabinet',
    slug: 'multi-utility-cabinet',
    category: 'storage',
    price: 19500,
    originalPrice: 22000,
    image: '/Photos/16.jpg',
    status: 'On Sale',
    brand: 'Oasis Storage',
    discount: 7,
    material: 'Engineered Wood',
    dimensions: '5ft',
    warranty: '3 Years',
    fullDescription: 'Utility cabinet with multiple storage sections.',
  },
]

