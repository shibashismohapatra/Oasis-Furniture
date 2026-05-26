export const circleCategories = [
  { id: 1, name: 'Sofas',         slug: 'sofas',          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
  { id: 2, name: 'Chairs',        slug: 'chairs',         image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&q=80' },
  { id: 3, name: 'Dining Tables', slug: 'dining-tables',  image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&q=80' },
  { id: 4, name: 'Dining Chairs', slug: 'dining-chairs',  image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80' },
  { id: 5, name: 'Beds',          slug: 'beds',           image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80' },
  { id: 6, name: 'Storage',       slug: 'storage',        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&q=80' },
  { id: 7, name: 'Outdoor',       slug: 'outdoor',        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&q=80' },
  { id: 8, name: 'Decor',         slug: 'decor',          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
];

export const roomCategories = [
  { id: 1, name: 'Living Room',  slug: 'living-room',  count: '180+ pieces', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85' },
  { id: 2, name: 'Bedroom',      slug: 'bedroom',      count: '140+ pieces', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85' },
  { id: 3, name: 'Dining Room',  slug: 'dining-room',  count: '95+ pieces',  image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=85' },
  { id: 4, name: 'Outdoor',      slug: 'outdoor',      count: '60+ pieces',  image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=85' },
];

export const categories = roomCategories;

export const featured = [
  { id: 1, name: 'Oslo Lounge Chair',       price: 42500, originalPrice: 52000, tag: 'Bestseller', category: 'Living Room', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80', colors: ['#C4B49A','#1a1714','#6B8E6B'], rating: 4.8, reviews: 124, description: 'Crafted from solid teak with premium fabric upholstery, the Oslo Lounge Chair is the epitome of Scandinavian-Indian fusion design. Its low-profile silhouette and wide armrests make it the perfect accent piece for any living room.' },
  { id: 2, name: 'Aura King Bed Frame',     price: 89000, originalPrice: null,  tag: 'New',        category: 'Bedroom',     image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80', colors: ['#8B7355','#1a1714'], rating: 4.9, reviews: 87, description: 'The Aura King Bed Frame combines a solid walnut headboard with clean geometric lines. Engineered for durability and designed to anchor your bedroom with quiet luxury.' },
  { id: 3, name: 'Marble Dining Table',     price: 115000,originalPrice: null,  tag: 'Premium',    category: 'Dining',      image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500&q=80', colors: ['#E8E0D4','#C9A96E'], rating: 4.7, reviews: 56, description: 'A statement piece for modern dining rooms. Features a genuine Carrara marble top with solid brass legs. Seats 6-8 comfortably.' },
  { id: 4, name: 'Zen 3-Seater Sofa',       price: 67000, originalPrice: 78000, tag: 'Sale',       category: 'Living Room', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&q=80', colors: ['#C4B49A','#6B8E6B','#8B7355'], rating: 4.6, reviews: 203, description: 'The Zen 3-Seater strikes the perfect balance between comfort and style. Deep-cushioned seats with removable covers and a solid teak frame built to last decades.' },
  { id: 5, name: 'Teak Outdoor Set',        price: 54000, originalPrice: null,  tag: 'New',        category: 'Outdoor',     image: 'https://images.unsplash.com/photo-1600210491892-03d54079b6ac?w=500&q=80', colors: ['#8B7355','#1a1714'], rating: 4.8, reviews: 45, description: 'Grade-A teak outdoor dining set, naturally weather-resistant. Includes a 6-seater table and 6 stacking chairs. Perfect for garden terraces and balconies.' },
  { id: 6, name: 'Velvet Accent Chair',     price: 28000, originalPrice: 33000, tag: 'Sale',       category: 'Living Room', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80', colors: ['#6B8E6B','#C9A96E','#1a1714'], rating: 4.5, reviews: 178, description: 'A jewel of a chair in sage green velvet with gold-finished legs. Compact enough for any corner yet commanding enough to be the room\'s focal point.' },
];

export const bestSellers = [
  { id: 10, name: 'Aranya Sectional Sofa', price: 54900, originalPrice: 72000, tag: 'BEST SELLER', category: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=90', colors: ['#C4B49A','#1a1714','#6B8E6B','#E8D5B0'], rating: 4.8, reviews: 124, discount: null, description: 'The Aranya Sectional Sofa in rich forest-green velvet is our most-loved piece. Deep-set cushions, solid teak legs and a modular design that adapts to any living room layout.' },
  { id: 11, name: 'Kaveri Teak Dining Table', price: 32500, originalPrice: 42000, tag: '22% OFF', category: 'Dining Tables', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=90', colors: ['#8B7355','#1a1714','#6B8E6B'], rating: 4.9, reviews: 87, discount: 22, description: 'Handcrafted from sustainably sourced teak, the Kaveri Dining Table seats 6 comfortably. The warm honey finish deepens beautifully with age. A true heirloom piece.' },
  { id: 12, name: 'Neem Accent Chair',      price: 18900, originalPrice: 24000, tag: 'NEW IN',    category: 'Chairs',       image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=90', colors: ['#6B8E6B','#C9A96E'], rating: 4.7, reviews: 63, discount: null, description: 'The Neem Accent Chair brings a sculptural elegance to any room. Upholstered in premium bouclé fabric with a solid brass frame.' },
  { id: 13, name: 'Maara Platform Bed',     price: 74500, originalPrice: 89000, tag: '16% OFF',  category: 'Bedroom',      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=90', colors: ['#8B7355','#C4B49A','#1a1714'], rating: 4.8, reviews: 95, discount: 16, description: 'Low-slung and luxurious, the Maara Platform Bed features a solid walnut frame and upholstered headboard. No box spring needed — just pure, refined comfort.' },
  { id: 14, name: 'Zilwa Outdoor Sofa Set', price: 48000, originalPrice: null,  tag: 'NEW IN',   category: 'Outdoor',      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=90', colors: ['#6B8E6B','#C4B49A'], rating: 4.6, reviews: 38, discount: null, description: 'Engineered for Indian climates, the Zilwa Outdoor Sofa features UV-resistant cushions and powder-coated aluminium frames. Looks great all year round.' },
  { id: 15, name: 'Oslo Lounge Chair',      price: 42500, originalPrice: 52000, tag: 'BEST SELLER', category: 'Living Room', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=90', colors: ['#C4B49A','#1a1714','#6B8E6B'], rating: 4.8, reviews: 124, description: 'Crafted from solid teak with premium fabric upholstery, the Oslo Lounge Chair is the epitome of Scandinavian-Indian fusion design.' },
  { id: 16, name: 'Marble Dining Table',    price: 115000,originalPrice: null,  tag: 'PREMIUM',  category: 'Dining',       image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=700&q=90', colors: ['#E8E0D4','#C9A96E'], rating: 4.7, reviews: 56, description: 'A statement piece for modern dining rooms. Features a genuine Carrara marble top with solid brass legs. Seats 6–8 comfortably.' },
  { id: 17, name: 'Zen 3-Seater Sofa',      price: 67000, originalPrice: 78000, tag: '14% OFF',  category: 'Living Room',  image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=700&q=90', colors: ['#C4B49A','#6B8E6B','#8B7355'], rating: 4.6, reviews: 203, description: 'The Zen 3-Seater strikes the perfect balance between comfort and style. Deep-cushioned seats with removable covers and a solid teak frame built to last decades.' },
  { id: 18, name: 'Velvet Accent Chair',    price: 28000, originalPrice: 33000, tag: '15% OFF',  category: 'Living Room',  image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=700&q=90', colors: ['#6B8E6B','#C9A96E','#1a1714'], rating: 4.5, reviews: 178, description: 'A jewel of a chair in sage green velvet with gold-finished legs. Compact enough for any corner yet commanding enough to be the room\'s focal point.' },
];

export const testimonials = [
  { id: 1, name: 'Priya S.',   verified: true, product: 'Aranya Sectional Sofa', time: '2 weeks ago', text: 'Absolutely stunning piece! The fabric quality is exceptional and it arrived perfectly packaged. Our living room looks like a showroom now.', rating: 5 },
  { id: 2, name: 'Rahul M.',   verified: true, product: 'Kaveri Teak Dining Table', time: '1 month ago', text: 'Solid teak construction with a beautiful natural finish. We receive compliments every time guests come over. Worth every rupee.', rating: 4.5 },
  { id: 3, name: 'Sneha K.',   verified: true, product: 'Neem Accent Chair',       time: '1 month ago', text: 'This chair is my favourite piece in the entire house. Incredibly comfortable and the sage green colour is exactly as shown on the website.', rating: 5 },
  { id: 4, name: 'Arjun T.',   verified: true, product: 'Maara Platform Bed',      time: '5 weeks ago', text: 'Premium quality bed frame. The low-profile design gives a very modern look. Delivery was fast and assembly was straightforward.', rating: 5 },
  { id: 5, name: 'Divya R.',   verified: true, product: 'Zilwa Outdoor Sofa Set',  time: '3 months ago', text: 'Great storage that actually looks beautiful. The walnut finish is warm and luxurious. Very sturdy — absolutely no wobbling.', rating: 4.5 },
  { id: 6, name: 'Kiran S.',   verified: true, product: 'Zilwa Outdoor Sofa Set',  time: '3 months ago', text: 'Our outdoor space has been completely transformed. Weather-resistant and looks incredible. The quality is outstanding.', rating: 5 },
];

export const instagramImages = [
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=90',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=90',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=90',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=90',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=90',
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=90',
];

export const brands = [
  { name: 'ARTISAN CRAFT CO.', tagline: 'Exclusively at Techsheel' },
  { name: 'NORDIC WOODS',      tagline: 'Scandinavian Collection' },
  { name: 'KAVE HOME',         tagline: 'Mediterranean Living' },
  { name: 'ETHNICRAFT',        tagline: 'Solid Oak Furniture' },
  { name: 'MAISON & CO.',      tagline: 'Contemporary Luxury' },
  { name: 'SOTA REPUBLIC',     tagline: 'Artisanal Seating' },
];