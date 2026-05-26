import { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

const bedSideTablesData = [
  {
    id: 'bst1',
    name: 'Classic Bed Side Table',
    image: '/bedside-tables/Classic Side Table.jpg',
    tag: 'Bestseller',
    price: 8500,
    originalPrice: 10500,
    specs: { length: '16 inches', width: '16 inches', height: '18 inches', netWt: '15 KG', grossWt: '20 KG' },
    description: 'Classic Bed Side Table – Timeless Elegance for Your Bedroom\n\nComplete your bedroom décor with the beautifully crafted Classic Bed Side Table, designed to bring warmth, elegance, and functionality to your personal space. With its timeless design and premium craftsmanship, this bedside table adds charm and sophistication while perfectly complementing modern, traditional, and farmhouse-inspired interiors.\n\nBuilt with a solid structure and carefully selected materials, the Classic Bed Side Table offers excellent durability and long-lasting performance. The natural wood grain finish enhances its visual appeal, while the elegant detailing creates a refined look that elevates the overall ambiance of your bedroom.\n\nIts versatile design allows it to blend seamlessly with existing furniture while also serving as a stylish accent piece. Whether placed beside your bed or used as an additional storage table, it provides both practicality and aesthetic value.\n\nDesigned for everyday convenience, this bedside table offers the perfect combination of style, functionality, and traditional craftsmanship.\n\nUpgrade your bedroom with the timeless beauty of the Classic Bed Side Table and create a cozy, sophisticated retreat.',
  },
  {
    id: 'bst2',
    name: 'ES 1 Bed Side Table',
    image: '/bedside-tables/ES-1 Bed Side Table.jpg',
    tag: 'New',
    price: 9200,
    originalPrice: 11500,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: '15 KG', grossWt: '20 KG' },
    description: 'ES 1 Bed Side Table – Modern Elegance with Everyday Functionality\n\nComplete your bedroom setup with the stylish and functional ES 1 Bed Side Table, designed to bring elegance, warmth, and convenience to your personal space. With its sophisticated design and premium finish, this bedside table perfectly complements both modern and classic bedroom interiors.\n\nCrafted with a strong structure and detailed craftsmanship, the ES 1 Bed Side Table offers exceptional durability and long-lasting performance. The elegant wood texture and refined detailing enhance its aesthetic appeal, creating a calm and inviting atmosphere in your bedroom.\n\nIts versatile design seamlessly blends with a variety of décor styles, from contemporary to traditional settings. Whether used as a bedside companion or an accent piece, it adds both practicality and sophistication to your room.\n\nDesigned for everyday convenience, the ES 1 Bed Side Table provides a functional surface for keeping essentials within easy reach while enhancing the overall beauty of your space.\n\nUpgrade your bedroom décor with the timeless charm of the ES 1 Bed Side Table and enjoy the perfect balance of style and functionality.',
  },
  {
    id: 'bst3',
    name: 'Delonix Bed Side Table',
    image: '/bedside-tables/Delonix Bed Side Table.jpg',
    tag: 'Premium',
    price: 10500,
    originalPrice: 13000,
    specs: { length: '18 inches', width: '16 inches', height: '16 inches', netWt: '17 KG', grossWt: '22 KG' },
    description: 'Delonix Bed Side Table – Elegant Design with Timeless Functionality\n\nEnhance your bedroom décor with the sophisticated Delonix Bed Side Table, designed to bring style, warmth, and functionality to your personal space. With its elegant craftsmanship and refined detailing, this bedside table creates a perfect balance between aesthetics and everyday convenience.\n\nBuilt with a solid structure and premium-quality materials, the Delonix Bed Side Table ensures durability, stability, and long-lasting performance. Its beautiful wood texture and carefully crafted finish add a touch of natural elegance, making it a stylish addition to both modern and traditional bedroom interiors.\n\nThe versatile design blends effortlessly with various décor themes, from classic and farmhouse-inspired spaces to contemporary settings. Whether used as a bedside companion or a decorative accent piece, it enhances the overall ambiance of your room.\n\nDesigned for practicality and elegance, the Delonix Bed Side Table provides a convenient surface for keeping essentials close at hand while adding sophistication to your bedroom retreat.\n\nUpgrade your bedroom with the timeless appeal of the Delonix Bed Side Table and enjoy the perfect combination of functionality and refined design.',
  },
  {
    id: 'bst4',
    name: 'Austria Bed Side Table',
    image: '/bedside-tables/Austria Bed Side TAble.jpg',
    tag: 'Premium',
    price: 11000,
    originalPrice: 13500,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Austria Bed Side Table – Elegant Style with Everyday Functionality\n\nComplete your bedroom retreat with the beautifully crafted Austria Bed Side Table, designed to bring warmth, elegance, and practicality to your living space. With its refined detailing and timeless design, this bedside table adds sophistication while perfectly complementing both modern and traditional interiors.\n\nBuilt with a solid structure and premium-quality craftsmanship, the Austria Bed Side Table ensures excellent durability and long-lasting performance. The rich wood finish and carefully designed accents enhance its natural beauty, creating a calm and inviting atmosphere in your bedroom.\n\nIts versatile design blends seamlessly with various décor styles, from classic and farmhouse-inspired interiors to modern bedroom settings. Whether used as a bedside companion or an accent furniture piece, it enhances the overall appearance of your room.\n\nDesigned for both style and convenience, the Austria Bed Side Table provides a practical surface for keeping essentials close at hand while elevating the elegance of your bedroom décor.\n\nUpgrade your bedroom with the timeless charm of the Austria Bed Side Table and experience the perfect balance of functionality and sophistication.',
  },
  {
    id: 'bst5',
    name: 'Korvy Bed Side Table',
    image: '/bedside-tables/Korvy Bed Side Table.jpg',
    tag: 'Bestseller',
    price: 11000,
    originalPrice: 13500,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Korvy Bed Side Table – Timeless Elegance with Functional Design\n\nEnhance your bedroom décor with the beautifully crafted Korvy Bed Side Table, designed to bring warmth, sophistication, and everyday functionality to your personal space. With its elegant finish and premium detailing, this bedside table perfectly complements both modern and classic bedroom interiors.\n\nBuilt with a sturdy structure and quality craftsmanship, the Korvy Bed Side Table offers excellent durability and long-lasting performance. Its rich wood texture and carefully designed accents add a touch of natural elegance, creating a peaceful and inviting bedroom atmosphere.\n\nThe versatile design blends effortlessly with different décor styles, from traditional and farmhouse-inspired interiors to contemporary settings. Whether used as a bedside companion or an accent piece, it enhances the overall beauty and practicality of your room.\n\nDesigned for convenience and style, the Korvy Bed Side Table provides a functional surface for keeping essentials within easy reach while adding a refined touch to your bedroom décor.\n\nUpgrade your bedroom with the elegance and practicality of the Korvy Bed Side Table and create a stylish, comfortable retreat.',
  },
  {
    id: 'bst6',
    name: 'Ambely Bed Side Table',
    image: '/bedside-tables/Ambely Bed Side Table.jpg',
    tag: 'New',
    price: 11000,
    originalPrice: 13500,
    specs: { length: '16 inches', width: '16 inches', height: '19 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Ambely Bed Side Table – Elegant Design with Timeless Functionality\n\nComplete your bedroom décor with the beautifully crafted Ambely Bed Side Table, designed to bring warmth, sophistication, and practicality to your personal space. With its refined finish and elegant detailing, this bedside table perfectly complements both modern and traditional interiors.\n\nBuilt with a sturdy structure and premium craftsmanship, the Ambely Bed Side Table ensures durability, stability, and long-lasting performance. Its elegant wood texture and carefully selected details add a touch of natural charm, creating a warm and inviting atmosphere in your bedroom.\n\nThe versatile design seamlessly blends with various bedroom styles, from traditional settings to farmhouse-inspired décor. Whether used as a bedside companion or a decorative accent piece, it enhances the overall look and feel of your space.\n\nDesigned for everyday convenience, the Ambely Bed Side Table offers both style and functionality, providing a practical surface for keeping essentials within easy reach while elevating your bedroom aesthetics.\n\nUpgrade your bedroom with the timeless elegance of the Ambely Bed Side Table and enjoy the perfect combination of beauty and functionality.',
  },
  {
    id: 'bst7',
    name: 'Arena Bed Side Table',
    image: '/bedside-tables/Arena Bed Side Table.jpg',
    tag: 'Bestseller',
    price: 11000,
    originalPrice: 13500,
    specs: { length: '21 inches', width: '21 inches', height: '16 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Arena Bed Side Table – Modern Elegance with Functional Design\n\nComplete your bedroom retreat with the stylish and sophisticated Arena Bed Side Table, designed to add warmth, elegance, and practicality to your living space. Crafted with refined detailing and premium craftsmanship, this bedside table perfectly complements modern, contemporary, and traditional bedroom interiors.\n\nBuilt with a sturdy structure and quality materials, the Arena Bed Side Table offers durability, stability, and long-lasting performance. Its elegant finish and natural wood texture enhance the visual appeal while creating a calm and inviting bedroom atmosphere.\n\nThe versatile design seamlessly integrates with various décor styles, from classic and farmhouse-inspired themes to modern interiors. Whether used as a bedside companion or as an accent furniture piece, it enhances the overall beauty and functionality of your space.\n\nDesigned for everyday convenience, the Arena Bed Side Table provides a practical surface for keeping essentials within easy reach while elevating the overall aesthetics of your bedroom.\n\nUpgrade your bedroom décor with the timeless sophistication of the Arena Bed Side Table and enjoy the perfect balance of style and functionality.',
  },
  {
    id: 'bst8',
    name: 'Kosovo Bed Side Table',
    image: '/bedside-tables/Kosovo Bed Side Table.jpg',
    tag: 'New',
    price: 10000,
    originalPrice: 12500,
    specs: { length: '16 inches', width: '16 inches', height: '18 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Kosovo Bed Side Table – Elegant Simplicity for Modern Bedrooms\n\nComplete your bedroom décor with the stylish Kosovo Bed Side Table, designed to add warmth, elegance, and functionality to your space. Crafted with a sturdy structure and premium finish, it offers durability along with timeless appeal.\n\nIts versatile design blends beautifully with modern, traditional, and farmhouse-inspired interiors, making it a perfect addition to any bedroom setting.\n\nEnhance your bedroom ambiance with the Kosovo Bed Side Table, combining practicality with sophisticated craftsmanship.',
  },
  {
    id: 'bst9',
    name: 'Vienna Bed Side Table',
    image: '/bedside-tables/Vienna Bed Side Table.jpg',
    tag: 'Premium',
    price: 9500,
    originalPrice: 11800,
    specs: { length: '18 inches', width: '16 inches', height: '21 inches', netWt: '15 KG', grossWt: '20 KG' },
    description: 'Vienna Bed Side Table – Elegant Design with Timeless Appeal\n\nComplete your bedroom décor with the sophisticated Vienna Bed Side Table, designed to bring style, warmth, and functionality to your space. Crafted with a sturdy structure and premium finish, it offers durability while enhancing the beauty of your bedroom interiors.\n\nIts versatile design blends seamlessly with modern, classic, and farmhouse-inspired décor, making it a perfect addition to any bedroom setting.\n\nUpgrade your bedroom with the Vienna Bed Side Table and enjoy elegance with everyday convenience.',
  },
  {
    id: 'bst10',
    name: 'Madrid Bed Side Table',
    image: '/bedside-tables/Madrid Bed Side Table.jpg',
    tag: 'New',
    price: 10500,
    originalPrice: 13000,
    specs: { length: '18 inches', width: '16 inches', height: '21 inches', netWt: '18 KG', grossWt: '22 KG' },
    description: 'Madrid Bed Side Table – Modern Elegance for Your Bedroom\n\nComplete your bedroom décor with the stylish Madrid Bed Side Table, crafted to bring warmth, sophistication, and functionality to your space. With its sturdy construction and elegant finish, this bedside table adds both beauty and practicality to modern and classic interiors.\n\nIts versatile design blends effortlessly with different décor styles, creating a refined and welcoming bedroom ambiance.\n\nUpgrade your bedroom with the Madrid Bed Side Table and enjoy timeless style with everyday convenience.',
  },
  {
    id: 'bst11',
    name: 'Aria Bed Side Table',
    image: '/bedside-tables/Aria Bed Side Table.jpg',
    tag: 'Premium',
    price: 12000,
    originalPrice: 15000,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: null, grossWt: null },
    description: 'Aria Bed Side Table – Elegant Style with Practical Functionality\n\nComplete your bedroom retreat with the beautifully crafted Aria Bed Side Table, designed to add warmth, elegance, and convenience to your space. Its sturdy construction, refined detailing, and premium finish create a perfect balance of durability and sophisticated style.\n\nThe versatile design blends effortlessly with modern, traditional, and farmhouse-inspired interiors, making it an ideal addition to any bedroom décor.\n\nUpgrade your bedroom with the Aria Bed Side Table and enjoy timeless elegance with everyday functionality.',
  },
  {
    id: 'bst12',
    name: 'Nelson Bed Side Table',
    image: '/bedside-tables/Nelson Bed Side Table.jpg',
    tag: 'Bestseller',
    price: 11500,
    originalPrice: 14000,
    specs: { length: '21 inches', width: '16 inches', height: '20 inches', netWt: null, grossWt: null },
    description: 'Nelson Bed Side Table – Stylish Functionality for Modern Bedrooms\n\nEnhance your bedroom décor with the elegant Nelson Bed Side Table, designed to combine style, durability, and everyday convenience. Crafted with a sturdy frame and premium finish, it brings sophistication while offering practical storage and easy access to your essentials.\n\nIts modern design blends seamlessly with various interior styles, making it a perfect addition to both contemporary and classic bedroom spaces.\n\nTransform your bedroom with the Nelson Bed Side Table and enjoy the perfect balance of elegance and functionality.',
  },
  {
    id: 'bst13',
    name: 'Lexus Bed Side Table',
    image: '/bedside-tables/Lexus Bed Side Table.jpg',
    tag: 'Premium',
    price: 14500,
    originalPrice: 18000,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: null, grossWt: null },
    description: 'Lexus Bed Side Table – Luxury Design with Smart Storage\n\nUpgrade your bedroom décor with the sophisticated Lexus Bed Side Table, designed to bring elegance, functionality, and modern style to your space. Crafted with premium materials and refined detailing, this bedside table adds a luxurious touch while offering everyday convenience.\n\nFeaturing two spacious drawers, it provides ample storage space to keep your essentials organized and within easy reach. Its sturdy construction and premium finish ensure long-lasting durability and timeless appeal.\n\nPerfect for modern and classic interiors, the Lexus Bed Side Table combines style and practicality effortlessly.',
  },
  {
    id: 'bst14',
    name: 'London Bed Side Table',
    image: '/bedside-tables/London Bed Side Table.jpg',
    tag: 'Premium',
    price: 13500,
    originalPrice: 17000,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: null, grossWt: null },
    description: 'London Bed Side Table – Elegant Design with Smart Storage\n\nTransform your bedroom with the stylish London Bed Side Table, designed to bring elegance, functionality, and modern sophistication to your space. Featuring a sleek design with clean lines and a premium finish, it blends effortlessly with contemporary and classic interiors.\n\nDesigned with a spacious drawer and open shelf, this bedside table provides convenient storage for books, accessories, and everyday essentials while keeping your space organized and clutter-free.\n\nThe London Bed Side Table perfectly combines practicality with timeless elegance, making it an ideal addition to any bedroom.',
  },
  {
    id: 'bst15',
    name: 'Berry Ignoo Bed Side Table',
    image: '/bedside-tables/Berry Ignoo Bed Side Table.jpg',
    tag: 'Bestseller',
    price: 13000,
    originalPrice: 16000,
    specs: { length: '21 inches', width: '16 inches', height: '21 inches', netWt: null, grossWt: null },
    description: 'Berry Ignoo Bed Side Table – Elegant Design with Practical Storage\n\nEnhance your bedroom décor with the stylish Berry Ignoo Bed Side Table, designed to bring elegance, functionality, and sophistication to your space. Crafted with premium materials and fine detailing, this bedside table serves as both a practical storage solution and a beautiful statement piece.\n\nIts sleek design and rich finish blend effortlessly with modern and traditional interiors, while the spacious storage area keeps everyday essentials organized and within easy reach.\n\nThe Berry Ignoo Bed Side Table combines durability, style, and convenience to create the perfect addition to your bedroom.',
  },
  {
    id: 'bst16',
    name: 'Vesta Bed Side Table',
    image: '/bedside-tables/Vesta Bed Side Table.jpg',
    tag: 'New',
    price: 14000,
    originalPrice: 17500,
    specs: { length: '21 inches', width: '16 inches', height: '42 inches', netWt: '18 KG', grossWt: '23 KG' },
    description: 'Vesta Bed Side Table – Elegant Style with Modern Functionality\n\nComplete your bedroom décor with the sophisticated Vesta Bed Side Table, designed to bring warmth, elegance, and practicality to your space. Crafted with a sturdy structure and premium finish, this bedside table combines durability with timeless style.\n\nIts refined detailing and versatile design blend beautifully with modern, traditional, and farmhouse-inspired interiors, creating a stylish and inviting bedroom atmosphere.\n\nThe Vesta Bed Side Table is the perfect combination of elegance and everyday convenience, making it an ideal addition to your bedroom collection.',
  },
];

const stableRatings = bedSideTablesData.map(b => ({
  id: b.id,
  rating: +(4.4 + ((b.id.charCodeAt(3) * 17 + 3) % 7) / 10).toFixed(1),
  count: 20 + ((b.id.charCodeAt(3) * 31 + 7) % 120),
}));

const tagColors = {
  'New':        { bg: '#1a1714', color: '#fff' },
  'Bestseller': { bg: '#c9a96e', color: '#fff' },
  'Premium':    { bg: '#2c3e50', color: '#fff' },
  'Sale':       { bg: '#c0392b', color: '#fff' },
};

const sortOptions = [
  { label: 'Popularity',          value: 'popularity' },
  { label: 'Price — Low to High', value: 'price_asc' },
  { label: 'Price — High to Low', value: 'price_desc' },
  { label: 'Newest First',        value: 'newest' },
];

function StarRating({ rating = 4.5, count = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={12} fill={s <= Math.floor(rating) ? '#c9a96e' : 'none'}
          stroke={s <= Math.ceil(rating) ? '#c9a96e' : '#ccc'} strokeWidth={1.5} />
      ))}
      {count > 0 && <span style={{ fontSize: '0.72rem', color: '#888', marginLeft: 2 }}>{count} reviews</span>}
    </div>
  );
}

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: '0.82rem', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ color: '#6b6359', minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a1714', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function BedSideTablesPage({ onBack }) {
  const [sortBy, setSortBy]         = useState('popularity');
  const [filterTag, setFilterTag]   = useState([]);
  const [priceMin, setPriceMin]     = useState('');
  const [priceMax, setPriceMax]     = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openSections, setOpenSections] = useState({ tag: true, price: true });

  // FIX: use correct store method names (addItem, not addToCart)
  const addItem      = useCartStore(s => s.addItem);
  const wishlistItems = useWishlistStore(s => s.items);
  const toggleWl     = useWishlistStore(s => s.toggle);
  const showToast    = useToastStore(s => s.show);

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const toggleSection = (key) =>
    setOpenSections(s => ({ ...s, [key]: !s[key] }));

  const filtered = useMemo(() => {
    let list = [...bedSideTablesData];
    if (filterTag.length)   list = list.filter(b => filterTag.includes(b.tag));
    if (priceMin)           list = list.filter(b => b.price >= Number(priceMin));
    if (priceMax)           list = list.filter(b => b.price <= Number(priceMax));
    if (sortBy === 'price_asc')  list.sort((a,b) => a.price - b.price);
    if (sortBy === 'price_desc') list.sort((a,b) => b.price - a.price);
    if (sortBy === 'newest')     list.sort((a,b) => (a.tag === 'New' ? -1 : 1));
    return list;
  }, [filterTag, priceMin, priceMax, sortBy]);

  // FIX: use addItem (correct store method) + proper toast with type
  const handleAddToCart = useCallback((item, e) => {
    e.stopPropagation();
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    showToast(`"${item.name}" added to cart`, 'success');
  }, [addItem, showToast]);

  // FIX: wishlist check uses item ids from store items array, add toast for wishlist too
  const handleWishlist = useCallback((item, e) => {
    e.stopPropagation();
    const isCurrentlyWishlisted = wishlistItems.some(i => i.id === item.id);
    toggleWl({ id: item.id, name: item.name, price: item.price, image: item.image, category: 'Bedside Tables' });
    showToast(
      isCurrentlyWishlisted ? `Removed from Wishlist` : `"${item.name}" added to Wishlist`,
      isCurrentlyWishlisted ? 'success' : 'wishlist'
    );
  }, [toggleWl, wishlistItems, showToast]);

  const renderFilterSection = (title, key, children) => (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => toggleSection(key)}
        style={{ display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',
          background:'none',border:'none',cursor:'pointer',padding:'0 0 10px',
          fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:'0.72rem',
          letterSpacing:'0.10em',textTransform:'uppercase',color:'#1a1714' }}>
        {title}
        {openSections[key] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
      </button>
      {openSections[key] && children}
    </div>
  );

  return (
    <>
      <style>{`
        .bp-root *, .bp-root *::before, .bp-root *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }
        /* FIX: add padding-top like BedsPage so content is not hidden behind fixed header */
        .bp-root { min-height: 100vh; background: #faf8f5; padding-top: 110px; font-family: 'Jost', sans-serif; }
        .bp-hero { background: #f5f0e8; padding: 32px 40px 28px; border-bottom: 1px solid rgba(0,0,0,0.07); }
        .bp-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #6b6359; padding: 0; margin-bottom: 16px; transition: color 0.2s; }
        .bp-back:hover { color: #c9a96e; }
        .bp-heading { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 700;
          color: #1a1714; margin: 0 0 8px; letter-spacing: 0.02em; }
        .bp-sub { font-size: 0.82rem; color: #6b6359; margin: 0; letter-spacing: 0.03em; }
        .bp-layout { display: grid; grid-template-columns: 240px 1fr; max-width: 1320px; margin: 0 auto; }
        .bp-sidebar { padding: 28px 24px; border-right: 1px solid rgba(0,0,0,0.06); background: #fff;
          position: sticky; top: 72px; height: calc(100vh - 72px); overflow-y: auto; }
        .bp-main { padding: 24px 32px 80px; background: #fff; }
        .bp-toolbar { display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.07); }
        .bp-count { font-size: 0.78rem; color: #6b6359; font-weight: 400; }
        .bp-count strong { color: #1a1714; font-weight: 600; }
        .bp-sort { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; overflow-x: auto;
          -webkit-overflow-scrolling: touch; scrollbar-width: none; max-width: 100%; }
        .bp-sort::-webkit-scrollbar { display: none; }
        .bp-sort-label { font-size: 0.74rem; color: #6b6359; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; white-space: nowrap; flex-shrink: 0; }
        .bp-sort-btn { background: none; border: 1px solid rgba(0,0,0,0.12); padding: 6px 12px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1714;
          transition: all 0.18s; white-space: nowrap; flex-shrink: 0; }
        .bp-sort-btn:hover, .bp-sort-btn.active { border-color: #c9a96e; color: #c9a96e; }
        .bp-list { display: flex; flex-direction: column; gap: 20px; }
        .bp-row { display: flex; gap: 0; border: 1px solid rgba(0,0,0,0.07); background: #fff;
          cursor: pointer; transition: box-shadow 0.25s, border-color 0.25s; overflow: hidden; }
        .bp-row:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.09); border-color: rgba(201,169,110,0.3); }
        /* FIX: img-wrap needs overflow:hidden + img needs transition for zoom effect */
        .bp-row-img-wrap { position: relative; flex-shrink: 0; width: 220px; overflow: hidden; }
        .bp-row-img { width: 100%; height: 220px; object-fit: cover; display: block;
          transition: transform 0.5s ease; }
        /* FIX: hover zoom on image — same as BedsPage */
        .bp-row:hover .bp-row-img { transform: scale(1.04); }
        .bp-row-tag { position: absolute; top: 10px; left: 10px; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 8px; }
        /* FIX: wishlist button styling — round like BedsPage */
        .bp-row-wish { position: absolute; top: 9px; right: 9px; background: #fff; border: none;
          width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: color 0.18s; }
        .bp-row-wish:hover { color: #c0392b; }
        .bp-row-body { flex: 1; padding: 18px 24px; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
        .bp-row-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700;
          color: #1a1714; margin: 0 0 6px; line-height: 1.2; }
        .bp-row-desc { font-size: 0.8rem; color: #6b6359; line-height: 1.6; margin: 0 0 10px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .bp-spec-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 500;
          color: #6b6359; background: #f5f0e8; padding: 3px 9px; margin: 2px 3px 2px 0; }
        .bp-row-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; margin-top: 10px; }
        .bp-row-price { font-size: 1.45rem; font-weight: 700; color: #1a1714; }
        .bp-row-orig  { font-size: 0.85rem; color: #aaa; text-decoration: line-through; }
        .bp-row-disc  { font-size: 0.78rem; font-weight: 600; color: #2ecc71; }
        .bp-row-atc   { display: inline-flex; align-items: center; gap: 8px; background: #1a1714;
          color: #fff; border: none; padding: 10px 22px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; transition: background 0.22s; }
        .bp-row-atc:hover { background: #c9a96e; }
        .mob-filter-btn { display: none; }
        .bp-detail-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.55); z-index: 500;
          display: flex; align-items: flex-start; justify-content: flex-end; }
        .bp-detail-panel { background: #fff; width: min(640px,100vw); height: 100vh; overflow-y: auto;
          animation: slideIn 0.32s cubic-bezier(.22,1,.36,1); position: relative; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .bp-detail-img { width: 100%; height: 340px; object-fit: cover; }
        .bp-detail-body { padding: 28px 32px 48px; }
        .bp-detail-tag { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 10px; display: inline-block; margin-bottom: 12px; }
        .bp-detail-name { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700;
          color: #1a1714; margin: 0 0 12px; line-height: 1.15; }
        .bp-detail-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
        .bp-detail-price { font-size: 1.75rem; font-weight: 700; color: #1a1714; }
        .bp-detail-orig  { font-size: 1rem; color: #aaa; text-decoration: line-through; }
        .bp-detail-disc  { font-size: 0.85rem; font-weight: 600; color: #2ecc71; }
        .bp-detail-desc { font-size: 0.85rem; line-height: 1.7; color: #4a4340; margin-bottom: 20px; white-space: pre-line; }
        .bp-detail-specs { margin-bottom: 24px; }
        .bp-detail-specs-title { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: #1a1714; margin-bottom: 10px; }
        .bp-detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .bp-detail-atc { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #1a1714; color: #fff; border: none; padding: 14px 20px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; min-width: 180px; transition: background 0.22s; }
        .bp-detail-atc:hover { background: #c9a96e; }
        .bp-detail-close { position: sticky; top: 16px; float: right; margin: 16px 16px -54px 0;
          background: rgba(255,255,255,0.95); border: none; width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s; flex-shrink: 0; }
        .bp-detail-close:hover { background: #fff; }
        @media (max-width: 900px) {
          .bp-layout { grid-template-columns: 1fr; }
          .bp-sidebar { display: none; position: fixed; inset: 0; z-index: 400; height: 100vh;
            overflow-y: auto; padding: 24px; }
          .bp-sidebar.open { display: block !important; }
          .mob-filter-btn { display: flex !important; }
          .bp-hero { padding: 24px 16px 20px; }
          .bp-main { padding: 16px 16px 60px; }
          .bp-row-img-wrap { width: 140px; }
          .bp-row-img { height: 160px; }
          .bp-row-name { font-size: 1.1rem; }
          .bp-toolbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .bp-sort { width: 100%; overflow-x: auto; padding-bottom: 4px; }
        }
        @media (max-width: 580px) {
          .bp-row { flex-direction: column; }
          .bp-row-img-wrap { width: 100%; }
          .bp-row-img { height: 200px; }
          .bp-detail-panel { width: 100vw; }
        }
      `}</style>

      <div className="bp-root">
        <div className="bp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="bp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="bp-heading">Bedside Tables</h1>
            <p className="bp-sub">Elegant bedside tables — crafted for the modern Indian bedroom. Showing {filtered.length} of {bedSideTablesData.length} products.</p>
          </div>
        </div>

        <div className="bp-layout">
          {/* Sidebar filters */}
          <aside className={`bp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("CATEGORY", "tag", <>
              {['New','Bestseller','Premium'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}

            {renderFilterSection("PRICE RANGE", "price", <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
                <span style={{ color: '#aaa', flexShrink: 0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
              </div>
            </>)}

            {(filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="bp-main">
            {/* Toolbar */}
            <div className="bp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.74rem', fontWeight:600,
                    letterSpacing:'0.08em', textTransform:'uppercase', color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="bp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="bp-sort">
                <span className="bp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`bp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="bp-list">
              {filtered.map(item => {
                const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
                const tc = tagColors[item.tag] || tagColors['New'];
                // FIX: check wishlist by comparing item ids from the store items array (not using .includes on objects)
                const inWl = wishlistItems.some(i => i.id === item.id);
                const ratingData = stableRatings.find(r => r.id === item.id);
                return (
                  <div key={item.id} className="bp-row" onClick={() => setSelectedItem(item)}>
                    <div className="bp-row-img-wrap">
                      <img className="bp-row-img" src={item.image} alt={item.name} loading="lazy" />
                      <span className="bp-row-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                      <button className="bp-row-wish" onClick={e => handleWishlist(item, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="bp-row-body">
                      <div>
                        <h3 className="bp-row-name">{item.name}</h3>
                        <StarRating rating={ratingData?.rating ?? 4.5} count={ratingData?.count ?? 42} />
                        <p className="bp-row-desc">{item.description}</p>
                        <div>
                          {item.specs.length && <span className="bp-spec-chip">· L: {item.specs.length}</span>}
                          {item.specs.width && <span className="bp-spec-chip">· W: {item.specs.width}</span>}
                          {item.specs.height && <span className="bp-spec-chip">· H: {item.specs.height}</span>}
                          {item.specs.netWt && <span className="bp-spec-chip">· Net Weight: {item.specs.netWt}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="bp-row-price-row">
                          <span className="bp-row-price">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.originalPrice && <span className="bp-row-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                          {disc && <span className="bp-row-disc">{disc}% off</span>}
                        </div>
                        {/* Add to Cart — temporarily hidden (client request) */}
                        {/* <button className="bp-row-atc" onClick={e => handleAddToCart(item, e)}>
                          <ShoppingBag size={13} /> Add to Cart
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No products match your current filters. <br />
                  <button onClick={() => { setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop:12, background:'none', border:'none', color:'#c9a96e', cursor:'pointer',
                      fontWeight:600, fontSize:'0.85rem', textDecoration:'underline' }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Detail slide-in panel */}
      {selectedItem && (() => {
        const item = selectedItem;
        const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
        const tc = tagColors[item.tag] || tagColors['New'];
        const inWl = wishlistItems.some(i => i.id === item.id);
        return (
          <div className="bp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="bp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="bp-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <img className="bp-detail-img" src={item.image} alt={item.name} />
              <div className="bp-detail-body">
                <span className="bp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                <h2 className="bp-detail-name">{item.name}</h2>
                <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === item.id)?.count ?? 42} />
                <div className="bp-detail-price-row">
                  <span className="bp-detail-price">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.originalPrice && <span className="bp-detail-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="bp-detail-disc">{disc}% off</span>}
                </div>
                <p className="bp-detail-desc">{item.description}</p>
                <div className="bp-detail-specs">
                  <p className="bp-detail-specs-title">Specifications</p>
                  <SpecRow label="Product Type"   value="Bed Side Table" />
                  <SpecRow label="Length"         value={item.specs.length} />
                  <SpecRow label="Width"          value={item.specs.width} />
                  <SpecRow label="Height"         value={item.specs.height} />
                  <SpecRow label="Net Weight"     value={item.specs.netWt} />
                  <SpecRow label="Gross Weight"   value={item.specs.grossWt} />
                </div>
                <div className="bp-detail-actions">
                  {/* Add to Cart — temporarily hidden (client request) */}
                  {/* <button className="bp-detail-atc" onClick={e => { handleAddToCart(item, e); setSelectedItem(null); }}>
                    <ShoppingBag size={15}/> Add to Cart
                  </button> */}
                  <button onClick={e => handleWishlist(item, e)} style={{
                    padding:'14px 18px', border:'1px solid rgba(0,0,0,0.15)', background:'#fff',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                    fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600,
                    letterSpacing:'0.10em', textTransform:'uppercase',
                    color: inWl ? '#c0392b' : '#1a1714',
                    borderColor: inWl ? '#c0392b' : 'rgba(0,0,0,0.15)'
                  }}>
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                    {inWl ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}