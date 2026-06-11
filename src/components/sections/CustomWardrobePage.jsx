import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, SlidersHorizontal, X, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

/* ─── Image Zoom Modal ─── */
function ImageZoomModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  const clampPos = (x, y, s) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const { width: cw, height: ch } = el.getBoundingClientRect();
    const maxX = Math.max(0, (cw * s - cw) / 2);
    const maxY = Math.max(0, (ch * s - ch) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  const zoom = dir => setScale(s => { const ns = Math.min(4, Math.max(1, s + dir * 0.5)); setPos(p => clampPos(p.x, p.y, ns)); return ns; });
  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}>
      <div style={{ position:'absolute', top:16, right:16, display:'flex', gap:10 }}>
        {[{ icon:<ZoomIn size={18}/>, fn:()=>zoom(1) }, { icon:<ZoomOut size={18}/>, fn:()=>zoom(-1) }, { icon:<RotateCcw size={18}/>, fn:reset }, { icon:<X size={18}/>, fn:onClose }].map((b,i) => (
          <button key={i} onClick={e=>{e.stopPropagation();b.fn();}} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{b.icon}</button>
        ))}
      </div>
      <div ref={containerRef} style={{ overflow:'hidden', maxWidth:'90vw', maxHeight:'85vh', cursor: scale>1 ? 'grab' : 'default' }}
        onClick={e=>e.stopPropagation()}
        onMouseDown={e=>{ if(scale===1)return; setDragging(true); dragStart.current={mx:e.clientX,my:e.clientY,px:pos.x,py:pos.y}; }}
        onMouseMove={e=>{ if(!dragging||!dragStart.current)return; const dx=e.clientX-dragStart.current.mx; const dy=e.clientY-dragStart.current.my; setPos(clampPos(dragStart.current.px+dx,dragStart.current.py+dy,scale)); }}
        onMouseUp={()=>setDragging(false)}
        onWheel={e=>{ e.preventDefault(); zoom(e.deltaY<0?1:-1); }}>
        <img src={src} alt={alt} style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', transform:`scale(${scale}) translate(${pos.x/scale}px,${pos.y/scale}px)`, transition: dragging?'none':'transform 0.2s', userSelect:'none' }} draggable={false} />
      </div>
    </div>
  );
}

/* ─── Star Rating ─── */
function StarRating({ rating, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, margin:'6px 0 10px' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= Math.round(rating) ? '#c9a96e' : 'none'} stroke={i <= Math.round(rating) ? '#c9a96e' : '#c9a96e'} strokeWidth={1.5} />
      ))}
      <span style={{ fontSize:'0.75rem', color:'#8a8278', fontFamily:"'Jost',sans-serif" }}>{rating.toFixed(1)} ({count} reviews)</span>
    </div>
  );
}

/* ─── Spec Row ─── */
function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', gap:12, padding:'7px 0', borderBottom:'1px solid #f0ebe3', fontFamily:"'Jost',sans-serif" }}>
      <span style={{ minWidth:130, fontSize:'0.78rem', color:'#8a8278', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'0.82rem', color:'#2a2520', fontWeight:500 }}>{value}</span>
    </div>
  );
}

/* ─── Product Data ─── */
const wardrobeData = [
  {
    id: 'cw1',
    name: 'Utsav 4 Door Wardrobe in Wenge Finish',
    image: '/wardrobes/Utsav 4 door wardrobe in Wenge Finish.jpg',
    price: 26999,
    originalPrice: 53500,
    category: 'Custom Wardrobe',
    doors: '4 Door',
    colour: 'Wenge',
    tag: 'Best Seller',
    description: 'The Utsav 4 door wardrobe in Wenge finish is designed for modern bedrooms that value functionality and clean aesthetics. Crafted from engineered wood with a natural wood grain texture, this wardrobe combines spacious storage with user-centric design.',
    highlights: [
      'Elegant natural wood grain finish for a refined appearance',
      'Spacious 4 door wardrobe with mirror',
      'Scratch-resistant melamine finish for long-lasting durability',
      'Hinged door construction for smooth operation',
      'External lower drawers for organized shoe storage',
      'Secure locking system with metal keys',
    ],
    specs: {
      brand: 'HomeTown',
      sku: '600383511001',
      material: 'E2 Grade Particle Board',
      finish: 'Scratch-resistant Melamine with Edge Banding',
      colour: 'Wenge',
      dimensions: '1605 × 470 × 1825 mm',
      warranty: '1 Year',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw2',
    name: 'Allen Plus 4 Door Wardrobe with Mirror — White',
    image: '/wardrobes/ALLEN PLUS 4 DOOR WARDROBE WITH MIRROR WHITE.jpg',
    price: 23999,
    originalPrice: 53900,
    category: 'Custom Wardrobe',
    doors: '4 Door',
    colour: 'White',
    tag: 'New',
    description: 'The Allen Plus 4 Door Wardrobe with Mirror in White is designed for modern bedrooms that require generous storage with a clean, elegant aesthetic. Integrated full-length mirror makes everyday dressing convenient while the structured compartments maximize organization.',
    highlights: [
      'Spacious four door wardrobe for modern bedroom storage',
      'Integrated full-length mirror for dressing convenience',
      'Clean white finish for contemporary and minimalist homes',
      'Multiple storage compartments with shelves and hanging space',
      'Durable engineered wood construction for everyday use',
    ],
    specs: {
      brand: 'Spring Art',
      sku: '830116706001',
      material: 'Engineered Wood',
      finish: 'White Colour Finish',
      colour: 'White',
      dimensions: '1600 × 550 × 2000 mm',
      warranty: '12 Months',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw3',
    name: 'Willy Plus 3 Door Wardrobe — Walnut',
    image: '/wardrobes/WILLY PLUS 3 DOOR WARDROBE WALNUT.jpg',
    price: 14999,
    originalPrice: 34900,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Walnut',
    tag: 'Sale',
    description: 'The Willy Plus 3 Door Wardrobe in Walnut Finish is designed for bedrooms that need organized storage with a warm, timeless aesthetic. Its rich walnut finish and functional layout provides efficient storage while complementing modern and classic bedroom interiors.',
    highlights: [
      'Spacious 3 door wardrobe for organized bedroom storage',
      'Warm walnut finish for a classic wooden wardrobe look',
      'Structured internal layout with shelves and hanging sections',
      'Durable engineered wood for everyday use',
      'Clean and versatile style for contemporary bedrooms',
    ],
    specs: {
      brand: 'Spring Art',
      sku: '830116704001',
      material: 'Engineered Wood',
      finish: 'Walnut Finish',
      colour: 'Walnut',
      dimensions: '1200 × 550 × 2000 mm',
      warranty: '12 Months',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw4',
    name: 'Archer Three Door Wardrobe — Walnut Colour',
    image: '/wardrobes/Archer Three door Wardrobe in Walnut Colour.jpg',
    price: 21900,
    originalPrice: 49900,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Walnut',
    tag: 'Store Exclusive',
    description: 'The Archer three door wardrobe combines modern design with practical storage for contemporary homes. Finished in a rich walnut tone with natural wood grain detailing, this bedroom wardrobe offers durability, functionality, and elegant styling for everyday use.',
    highlights: [
      'Sleek walnut finish with natural wood grain texture',
      'Soft rounded corners for a refined, modern look',
      'Designed as a spacious 3 door wooden wardrobe',
      'Hinged door mechanism for smooth functionality',
      'Fully accessible drawers on telescopic channels',
      'All doors and drawers fitted with secure locks and metal keys',
    ],
    specs: {
      brand: 'HomeTown',
      sku: '600383512001',
      material: 'E2 Grade Particle Board',
      finish: 'PU Laminated with Edge Banding',
      colour: 'Walnut',
      dimensions: '1200 × 470 × 1825 mm',
      warranty: '1 Year',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw5',
    name: 'Tiago Engineered Wood Three Door Wardrobe — Wenge',
    image: '/wardrobes/Tiago Engineered Wood Three Door Wardrobe in Wenge Colour.jpg',
    price: 25900,
    originalPrice: 68640,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Wenge',
    tag: 'Store Exclusive',
    description: 'Hometown brings the latest designs to Indian homes with this Three Door Wardrobe in Wenge finish. Crafted from particle board with a rich wenge colour, this wardrobe offers a combination of style and functionality suited for modern bedroom interiors.',
    highlights: [
      'Engineered wood construction for durability',
      'Rich wenge finish for a premium bedroom aesthetic',
      'Three door configuration with ample storage space',
      '1 Year warranty against manufacturing defects',
      'Carpenter assembly provided by seller at no cost',
    ],
    specs: {
      brand: 'HomeTown',
      sku: '6000039943001',
      material: 'Particle Board',
      finish: 'Wenge Colour',
      colour: 'Wenge',
      dimensions: '1200 × 470 × 1825 mm',
      warranty: '1 Year',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw6',
    name: 'Kibo 2 Door Wardrobe — Lyon Walnut Finish With Drawer',
    image: '/wardrobes/Kibo 2 Door Wardrobe In Lyon Walnut Finish With Drawer.jpg',
    price: 18500,
    originalPrice: 38000,
    category: 'Custom Wardrobe',
    doors: '2 Door',
    colour: 'Walnut',
    tag: 'New',
    description: 'The Kibo Door Wardrobe by Mintwud combines practical storage solutions with a sleek, modern design. Built from durable 17mm engineered wood, it offers a sturdy structure with adjustable shelves that allow you to customize the interior layout for your needs.',
    highlights: [
      'Built from durable 17mm engineered wood',
      'Adjustable shelves for flexible, customizable organization',
      'Sleek modern design that complements various interiors',
      'Ample space for clothes, accessories, and personal items',
      'Low-maintenance surfaces for easy cleaning',
    ],
    specs: {
      brand: 'Mintwud from Pepperfry',
      material: '17mm Engineered Wood',
      finish: 'Lyon Walnut Finish',
      colour: 'Walnut',
      dimensions: '70 × 46 × 180 cm',
      warranty: '36 Months',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw7',
    name: 'Maya 2 Door Wardrobe — Wenge Finish',
    image: '/wardrobes/Maya 2 Door Wardrobe In Wenge Finish.jpg',
    price: 16500,
    originalPrice: 32000,
    category: 'Custom Wardrobe',
    doors: '2 Door',
    colour: 'Wenge',
    tag: 'New',
    description: 'Part of the exclusive Maya Collection by Mintwud, this 2 Door Wardrobe in Wenge finish combines classic aesthetics with modern functionality. Crafted from engineered wood with a seasoned solid wood handle for a refined touch.',
    highlights: [
      'Seasoned solid wood handle for a premium touch',
      'Classic wenge finish suited for modern bedrooms',
      'Engineered wood construction for lasting durability',
      'Ideal bedroom storage wardrobe for organized living',
      '36 months warranty for peace of mind',
    ],
    specs: {
      brand: 'Mintwud from Pepperfry',
      sku: 'FN2152479-S-WH44079',
      material: 'Engineered Wood',
      finish: 'Wenge',
      colour: 'Wenge',
      dimensions: 'H 180 × W 70 × D 46 cm',
      warranty: '36 Months',
      assembly: 'Carpenter Assembly',
      weight: '48 kg',
    },
  },
  {
    id: 'cw8',
    name: 'Kibo 3 Door Wardrobe — Lyon Walnut With Drawer, Adjustable Shelves & Mirror',
    image: '/wardrobes/Kibo 3 Door Wardrobe In Lyon Walnut Finish With Drawer& Adjustable Shelves & Mirror.jpg',
    price: 28500,
    originalPrice: 55000,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Walnut',
    tag: 'Best Seller',
    description: 'The Kibo 3 Door Wardrobe by Mintwud is a comprehensive storage solution featuring adjustable shelves, a built-in mirror, and a drawer for everyday essentials. Crafted from 17mm engineered wood for durability and a modern lifestyle.',
    highlights: [
      'Primary: 17mm Engineered Wood, Secondary: 8mm Engineered Wood',
      'Adjustable shelves for personalized interior layout',
      'Integrated mirror door for dressing convenience',
      'Drawer included for organized storage of essentials',
      'Contemporary design for modern bedrooms',
    ],
    specs: {
      brand: 'Mintwud from Pepperfry',
      sku: 'FN2271260-S-PM43313',
      material: 'Engineered Wood (17mm + 8mm)',
      finish: 'Lyon Walnut Finish',
      colour: 'Walnut',
      dimensions: 'H 180 × W 119 × D 46 cm',
      warranty: '36 Months',
      assembly: 'Carpenter Assembly',
      weight: '103 kg',
    },
  },
  {
    id: 'cw9',
    name: 'Milford 3 Door Wardrobe — Urban Teak Finish',
    image: '/wardrobes/Milford 3 Door Wardrobe in Urban Teak Finish.jpg',
    price: 22500,
    originalPrice: 48000,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Teak',
    tag: 'New',
    description: 'The Milford 3 Door Wardrobe in Urban Teak finish by Nilkamal is crafted from high-quality particle board panels with melamine finish and edge banding on all sides. Engineered for durability, functionality and an Urban Teak aesthetic.',
    highlights: [
      'All panels: 15mm particle board for structural strength',
      'Back panel: 9mm for lightweight stability',
      'Melamine finish with edge banding on all sides',
      'Mirror fitted on middle door for convenience',
      'Drawer box with smooth operation',
    ],
    specs: {
      brand: 'Nilkamal',
      sku: 'FN1982838-S-WH32519',
      material: 'Engineered Wood (Particle Board)',
      finish: 'Melamine — Urban Teak',
      colour: 'Urban Teak',
      dimensions: 'H 182.98 × W 119.99 × D 55.98 cm',
      warranty: '12 Months',
      assembly: 'Carpenter Assembly',
      weight: '97 kg',
    },
  },
  {
    id: 'cw10',
    name: 'Kosmo Flexton 3 Door Wardrobe — Modern Ash & Natural Teak With Drawer',
    image: '/wardrobes/Kosmo Flexton 3 Door Wardrobe In Modern Ash & Natural Teak Finish With Drawer.jpg',
    price: 24500,
    originalPrice: 51000,
    category: 'Custom Wardrobe',
    doors: '3 Door',
    colour: 'Ash / Teak',
    tag: 'New',
    description: 'The Kosmo Flexton 3 Door Wardrobe by Spacewood features a stylish dual-tone Modern Ash and Natural Teak finish. Water resistant, fungus and termite proof with premium grade hardware for a sophisticated and durable bedroom storage solution.',
    highlights: [
      'Water resistant, fungus, termite and scratch proof',
      'Premium grade hardware and fittings throughout',
      'Dual-tone Modern Ash & Natural Teak aesthetic',
      'Drawer included for organized storage',
      'Durable engineered wood construction',
    ],
    specs: {
      brand: 'Spacewood',
      material: 'Engineered Wood',
      finish: 'Modern Ash & Natural Teak',
      colour: 'Ash / Teak',
      dimensions: 'H 193 × W 119 × D 47 cm',
      warranty: '12 Months',
      assembly: 'Carpenter Assembly',
    },
  },
  {
    id: 'cw11',
    name: 'Abran 4 Door Wardrobe with Mirror & Locker — High Gloss White',
    image: '/wardrobes/Abran 4 Door Wardrobe With Mirror & Locker In High Gloss White Finish.jpg',
    price: 38999,
    originalPrice: 78000,
    category: 'Custom Wardrobe',
    doors: '4 Door',
    colour: 'White',
    tag: 'Premium',
    description: 'Transform your bedroom with the Casacraft Abran 4-Door Wardrobe. Designed in a sleek high-gloss white PVC-foiled finish, this luxury wardrobe combines spacious storage with a built-in mirror and locker section for secure storage of valuables.',
    highlights: [
      'High-gloss white PVC-foiled finish for a premium look',
      'Full-length mirror door for everyday dressing',
      'Integrated locker section for secure storage',
      'Spacious 4 door configuration for family use',
      'Engineered wood with moisture resistant properties',
    ],
    specs: {
      brand: 'Casacraft from Pepperfry',
      material: 'Engineered Wood with PVC Foil',
      finish: 'High Gloss White',
      colour: 'White',
      warranty: '12 Months',
      assembly: 'Carpenter Assembly',
    },
  },
];

const tagColors = {
  'Best Seller':     { bg: '#1a1714', color: '#c9a96e' },
  'New':             { bg: '#c9a96e', color: '#fff' },
  'Sale':            { bg: '#c0392b', color: '#fff' },
  'Store Exclusive': { bg: '#3d5c8a', color: '#fff' },
  'Premium':         { bg: '#7c4a6b', color: '#fff' },
};

const TOTAL_H = 110;

// Stable ratings seed
const stableRatings = wardrobeData.map((p, i) => ({
  id: p.id,
  rating: [4.5, 4.4, 4.6, 4.7, 4.3, 4.5, 4.4, 4.8, 4.5, 4.6, 4.7][i % 11],
  count: [142, 87, 63, 211, 95, 58, 76, 183, 49, 102, 127][i % 11],
}));

export default function CustomWardrobePage({ onBack }) {
  const [filterDoors, setFilterDoors] = useState([]);
  const [filterColour, setFilterColour] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const addToCart  = useCartStore(s => s.addItem);
  const toggleWl   = useWishlistStore(s => s.toggle);
  const wishlist   = useWishlistStore(s => s.items);
  const showToast  = useToastStore(s => s.show);

  const doorsOptions  = ['2 Door', '3 Door', '4 Door'];
  const colourOptions = ['Wenge', 'Walnut', 'White', 'Teak', 'Ash / Teak'];

  const filtered = useMemo(() => {
    let list = [...wardrobeData];
    if (filterDoors.length)  list = list.filter(p => filterDoors.includes(p.doors));
    if (filterColour.length) list = list.filter(p => filterColour.includes(p.colour));
    if (priceMin) list = list.filter(p => p.price >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax));
    if (sortBy === 'low')   list.sort((a, b) => a.price - b.price);
    if (sortBy === 'high')  list.sort((a, b) => b.price - a.price);
    if (sortBy === 'disc')  list.sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice);
    return list;
  }, [filterDoors, filterColour, priceMin, priceMax, sortBy]);

  const handleAddToCart = (item, e) => {
    e?.stopPropagation();
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
    showToast(`${item.name.slice(0, 32)}… added to cart`);
  };

  const handleWishlist = (item, e) => {
    e?.stopPropagation();
    toggleWl({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
  };

  const toggle = (arr, setArr, val) => setArr(a => a.includes(val) ? a.filter(x => x !== val) : [...a, val]);

  const FilterSection = ({ title, opts, active, onToggle }) => (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#1a1714', marginBottom:10 }}>{title}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {opts.map(o => (
          <label key={o} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.82rem', color: active.includes(o) ? '#c9a96e' : '#2a2520', fontWeight: active.includes(o) ? 600 : 400 }}>
            <input type="checkbox" checked={active.includes(o)} onChange={() => onToggle(o)}
              style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );

  const sortOptions = [{ value:'featured', label:'Featured' }, { value:'low', label:'Price: Low–High' }, { value:'high', label:'Price: High–Low' }, { value:'disc', label:'Discount' }];

  const hasFilter = filterDoors.length > 0 || filterColour.length > 0 || priceMin || priceMax;

  return (
    <>
      <style>{`
        .cwp-root *, .cwp-root *::before, .cwp-root *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }
        .cwp-wrap { max-width: 1440px; margin: 0 auto; padding: 0 32px; }
        .cwp-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; letter-spacing: 0.08em; color: #8a8278; text-transform: uppercase; margin-bottom: 28px; }
        .cwp-breadcrumb span { cursor: pointer; transition: color 0.18s; } .cwp-breadcrumb span:hover { color: #c9a96e; }
        .cwp-hero { background: #f5f0e8; padding: 52px 0 44px; margin-bottom: 40px; }
        .cwp-hero-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; }
        .cwp-hero-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a96e; margin-bottom: 12px; }
        .cwp-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 600; color: #1a1714; line-height: 1.15; margin-bottom: 16px; }
        .cwp-hero-desc { font-size: 0.92rem; color: #6b6359; max-width: 600px; line-height: 1.75; }
        .cwp-hero-stats { display: flex; gap: 40px; margin-top: 28px; }
        .cwp-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: #1a1714; }
        .cwp-stat-lbl { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #8a8278; margin-top: 2px; }

        .cwp-body { display: flex; gap: 36px; align-items: flex-start; }
        .cwp-aside { width: 220px; flex-shrink: 0; position: sticky; top: ${TOTAL_H + 16}px; }
        .cwp-aside-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #1a1714; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #1a1714; }
        .cwp-main { flex: 1; min-width: 0; }

        /* Toolbar */
        .cwp-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0ebe3; margin-bottom: 24px; flex-wrap: wrap; gap: 10px; }
        .cwp-count { font-size: 0.78rem; color: #6b6359; }
        .cwp-sort { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .cwp-sort-label { font-size: 0.68rem; letter-spacing: 0.10em; text-transform: uppercase; color: #8a8278; margin-right: 4px; }
        .cwp-sort-btn { background: none; border: 1px solid rgba(0,0,0,0.12); padding: 5px 12px; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.06em; cursor: pointer; color: #2a2520; transition: all 0.18s; }
        .cwp-sort-btn.active { background: #1a1714; color: #fff; border-color: #1a1714; }
        .cwp-mob-filter-btn { display: none; }
        @media (max-width: 860px) { .cwp-aside { display: none; } .cwp-mob-filter-btn { display: flex !important; } }

        .cwp-list { display:flex;flex-direction:column;gap:16px; }
        .cwp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;transition:box-shadow 0.25s,border-color 0.25s;overflow:hidden; }
        .cwp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .cwp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .cwp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .cwp-row:hover .cwp-row-img { transform:scale(1.04); }
        .cwp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .cwp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:color 0.18s; }
        .cwp-row-wish:hover { color:#c0392b; }
        .cwp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .cwp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;color:#1a1714;margin:0 0 4px; }
        .cwp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px; }
        .cwp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .cwp-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .cwp-price { font-size:1.45rem;font-weight:700;color:#1a1714;font-family:'Jost',sans-serif; }
        .cwp-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through;font-family:'Jost',sans-serif; }
        .cwp-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71;font-family:'Jost',sans-serif; }
        .cwp-atc { display:inline-flex;align-items:center;gap:7px;margin-top:14px;padding:10px 22px;background:#1a1714;color:#fff;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;transition:background 0.2s; }
        .cwp-atc:hover { background:#c9a96e; }
        .cwp-highlights { margin: 8px 0 12px; padding-left: 16px; }
        .cwp-highlights li { font-size: 0.78rem; color: #4a4440; line-height: 1.7; }

        /* Detail panel */
        .cwp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;display:flex;justify-content:flex-end; }
        .cwp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;position:relative;box-shadow:-8px 0 40px rgba(0,0,0,0.18);display:flex;flex-direction:column; }
        .cwp-detail-close { position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:#1a1714;z-index:2;padding:4px; }
        .cwp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8;display:block; }
        .cwp-detail-body { padding: 24px 28px 32px; flex: 1; }
        .cwp-detail-tag { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; display: inline-block; margin-bottom: 12px; }
        .cwp-detail-name { font-family: 'Cormorant Garamond', serif; font-size: 1.45rem; font-weight: 600; color: #1a1714; line-height: 1.3; margin-bottom: 4px; }
        .cwp-detail-brand { font-size: 0.78rem; color: #8a8278; margin-bottom: 8px; }
        .cwp-detail-desc { font-size: 0.84rem; color: #6b6359; line-height: 1.7; margin-bottom: 16px; }
        .cwp-detail-specs { background: #faf7f2; padding: 16px 20px; margin-bottom: 20px; }
        .cwp-detail-specs-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #1a1714; margin-bottom: 10px; }
        .cwp-detail-actions { display: flex; gap: 10px; }
        .cwp-highlights-detail { margin: 0 0 16px; padding-left: 18px; }
        .cwp-highlights-detail li { font-size: 0.80rem; color: #4a4440; line-height: 1.75; }

        /* Mobile filter drawer */
        .cwp-filter-drawer { position: fixed; inset: 0; z-index: 900; display: flex; }
        .cwp-filter-drawer-overlay { flex: 1; background: rgba(0,0,0,0.5); }
        .cwp-filter-drawer-panel { width: 280px; background: #fff; height: 100%; overflow-y: auto; padding: 28px 24px; }
        .cwp-filter-drawer-close { background: none; border: none; cursor: pointer; float: right; color: #1a1714; margin-bottom: 16px; }

        @media (max-width: 640px) { .cwp-row { flex-direction: column; } .cwp-row-img-wrap { width: 100%; min-width: 0; height: 200px; } .cwp-hero-stats { flex-wrap: wrap; gap: 20px; } }
      `}</style>

      <div className="cwp-root" style={{ paddingTop: TOTAL_H }}>
        {/* Hero */}
        <div className="cwp-hero">
          <div className="cwp-hero-inner">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'#8a8278', fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.10em', textTransform:'uppercase', transition:'color 0.18s', padding:0 }}
                onMouseEnter={e=>e.currentTarget.style.color='#1a1714'} onMouseLeave={e=>e.currentTarget.style.color='#8a8278'}>
                <ArrowLeft size={14} strokeWidth={2} /> Back
              </button>
              <span style={{ color:'#d4c4a8' }}>·</span>
              <span style={{ color:'#c9a96e', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>Customized Furniture</span>
              <span style={{ color:'#d4c4a8' }}>·</span>
              <span style={{ color:'#1a1714', fontSize:'0.72rem', letterSpacing:'0.08em', fontWeight:600, textTransform:'uppercase' }}>Custom Wardrobe</span>
            </div>
            <p className="cwp-hero-label">Oasis Furniture — Customized Collection</p>
            <h1 className="cwp-hero-title">Custom Wardrobes<br />Crafted for Your Bedroom</h1>
            <p className="cwp-hero-desc">Discover our curated range of premium wardrobes — from compact 2-door designs to spacious 4-door configurations. Built with engineered wood, scratch-resistant finishes and thoughtful storage solutions to organize your space beautifully.</p>
            <div className="cwp-hero-stats">
              {[['11+', 'Wardrobe Models'], ['3', 'Finish Families'], ['2–4', 'Door Configurations'], ['36 Mo', 'Max Warranty']].map(([n, l]) => (
                <div key={l}><div className="cwp-stat-num">{n}</div><div className="cwp-stat-lbl">{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="cwp-wrap" style={{ paddingBottom: 80 }}>
          {/* Breadcrumb */}
          <div className="cwp-breadcrumb">
            <span onClick={onBack}>Home</span>
            <span style={{ color:'#d4c4a8' }}>›</span>
            <span>Customized Furniture</span>
            <span style={{ color:'#d4c4a8' }}>›</span>
            <span style={{ color:'#1a1714', fontWeight:600 }}>Custom Wardrobe</span>
          </div>

          <div className="cwp-body">
            {/* Sidebar Filter */}
            <aside className="cwp-aside">
              <p className="cwp-aside-title">Filters</p>
              <FilterSection title="No. of Doors" opts={doorsOptions} active={filterDoors} onToggle={v => toggle(filterDoors, setFilterDoors, v)} />
              <FilterSection title="Colour / Finish" opts={colourOptions} active={filterColour} onToggle={v => toggle(filterColour, setFilterColour, v)} />
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#1a1714', marginBottom:10 }}>Price Range</p>
                <div style={{ display:'flex', gap:8 }}>
                  {[['Min', priceMin, setPriceMin], ['Max', priceMax, setPriceMax]].map(([ph, v, sv]) => (
                    <input key={ph} type="number" placeholder={`₹ ${ph}`} value={v} onChange={e => sv(e.target.value)}
                      style={{ width:'100%', border:'1px solid rgba(0,0,0,0.15)', padding:'7px 10px', fontFamily:"'Jost',sans-serif", fontSize:'0.80rem', outline:'none', color:'#1a1714' }} />
                  ))}
                </div>
              </div>
              {hasFilter && (
                <button onClick={() => { setFilterDoors([]); setFilterColour([]); setPriceMin(''); setPriceMax(''); }}
                  style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em', textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b', padding:'8px 16px', cursor:'pointer', width:'100%' }}>
                  Clear All Filters
                </button>
              )}
            </aside>

            {/* Main */}
            <main className="cwp-main">
              {/* Toolbar */}
              <div className="cwp-toolbar">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button className="cwp-mob-filter-btn" onClick={() => setFilterOpen(true)}
                    style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(0,0,0,0.15)', padding:'7px 14px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.74rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#1a1714' }}>
                    <SlidersHorizontal size={14} /> Filters
                  </button>
                  <span className="cwp-count"><strong>{filtered.length}</strong> wardrobes</span>
                </div>
                <div className="cwp-sort">
                  <span className="cwp-sort-label">Sort:</span>
                  {sortOptions.map(o => (
                    <button key={o.value} className={`cwp-sort-btn${sortBy === o.value ? ' active' : ''}`} onClick={() => setSortBy(o.value)}>{o.label}</button>
                  ))}
                </div>
              </div>

              {/* Product List */}
              <div className="cwp-list">
                {filtered.map(item => {
                  const tc = tagColors[item.tag] || tagColors['New'];
                  const inWl = wishlist.includes(item.id);
                  const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
                  const rating = stableRatings.find(r => r.id === item.id);
                  return (
                    <div key={item.id} className="cwp-row" onClick={() => setSelectedItem(item)}>
                      <div className="cwp-row-img-wrap">
                        <img className="cwp-row-img" src={item.image} alt={item.name} loading="lazy"
                          style={{ cursor:'zoom-in' }}
                          onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                        <span className="cwp-row-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                        <button className="cwp-row-wish" onClick={e => handleWishlist(item, e)}
                          style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                          <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                        </button>
                      </div>
                      <div className="cwp-row-body">
                        <div>
                          <h3 className="cwp-row-name">{item.name}</h3>
                          <StarRating rating={rating?.rating ?? 4.5} count={rating?.count ?? 72} />
                          <p className="cwp-row-desc">{item.description}</p>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:8 }}>
                            {item.doors && <span className="cwp-spec-chip">· {item.doors}</span>}
                            {item.colour && <span className="cwp-spec-chip">· {item.colour}</span>}
                            {item.specs.material && <span className="cwp-spec-chip">· {item.specs.material}</span>}
                            {item.specs.dimensions && <span className="cwp-spec-chip">· Dimensions: {item.specs.dimensions}</span>}
                            {item.specs.weight && <span className="cwp-spec-chip">· Net Weight: {item.specs.weight}</span>}
                            {item.specs.warranty && <span className="cwp-spec-chip">· {item.specs.warranty} Warranty</span>}
                          </div>
                        </div>
                        <div>
                          <div className="cwp-price-row">
                            <span className="cwp-price">₹{item.price.toLocaleString('en-IN')}</span>
                            {item.originalPrice && <span className="cwp-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                            {disc > 0 && <span className="cwp-disc">{disc}% off</span>}
                          </div>
                          <button className="cwp-atc" onClick={e => handleAddToCart(item, e)}>
                            <ShoppingBag size={14} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359', fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                    No wardrobes match your current filters.<br />
                    <button onClick={() => { setFilterDoors([]); setFilterColour([]); setPriceMin(''); setPriceMax(''); }}
                      style={{ marginTop:12, background:'none', border:'none', color:'#c9a96e', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', textDecoration:'underline' }}>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Detail slide-in panel */}
      {selectedItem && (() => {
        const item = selectedItem;
        const tc = tagColors[item.tag] || tagColors['New'];
        const inWl = wishlist.includes(item.id);
        const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
        const rating = stableRatings.find(r => r.id === item.id);
        return (
          <div className="cwp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="cwp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="cwp-detail-close" onClick={() => setSelectedItem(null)}><X size={16} /></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="cwp-detail-img" src={item.image} alt={item.name} />
                <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <ZoomIn size={16} />
                </div>
              </div>
              <div className="cwp-detail-body">
                <span className="cwp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                <h2 className="cwp-detail-name">{item.name}</h2>
                <p className="cwp-detail-brand">Brand: {item.specs.brand} · {item.doors} · {item.colour}</p>
                <StarRating rating={rating?.rating ?? 4.5} count={rating?.count ?? 72} />
                <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:16 }}>
                  <span style={{ fontSize:'1.75rem', fontWeight:700, color:'#1a1714', fontFamily:"'Jost',sans-serif" }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span style={{ fontSize:'1rem', color:'#aaa', textDecoration:'line-through', fontFamily:"'Jost',sans-serif" }}>
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {disc > 0 && (
                    <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#2ecc71', fontFamily:"'Jost',sans-serif" }}>{disc}% off</span>
                  )}
                </div>
                <p className="cwp-detail-desc">{item.description}</p>
                {item.highlights && (
                  <div style={{ marginBottom:16 }}>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#1a1714', marginBottom:8 }}>Key Highlights</p>
                    <ul className="cwp-highlights-detail">
                      {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}
                <div className="cwp-detail-specs">
                  <p className="cwp-detail-specs-title">Specifications</p>
                  <SpecRow label="Brand"       value={item.specs.brand} />
                  <SpecRow label="Doors"       value={item.doors} />
                  <SpecRow label="Colour"      value={item.colour} />
                  <SpecRow label="Material"    value={item.specs.material} />
                  <SpecRow label="Finish"      value={item.specs.finish} />
                  <SpecRow label="Dimensions"  value={item.specs.dimensions} />
                  <SpecRow label="Weight"      value={item.specs.weight} />
                  <SpecRow label="Assembly"    value={item.specs.assembly} />
                  <SpecRow label="Warranty"    value={item.specs.warranty} />
                  <SpecRow label="SKU"         value={item.specs.sku} />
                </div>
                <div className="cwp-detail-actions">
                  <button onClick={e => { handleAddToCart(item, e); setSelectedItem(null); }} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'14px', background:'#1a1714', color:'#fff', border:'none', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', transition:'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#c9a96e'} onMouseLeave={e => e.currentTarget.style.background='#1a1714'}>
                    <ShoppingBag size={15} /> Add to Cart
                  </button>
                  <button onClick={e => handleWishlist(item, e)} style={{ padding:'14px 18px', border:`1px solid ${inWl ? '#c0392b' : 'rgba(0,0,0,0.15)'}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:7, fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em', textTransform:'uppercase', color: inWl ? '#c0392b' : '#1a1714' }}>
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'} /> {inWl ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="cwp-filter-drawer">
          <div className="cwp-filter-drawer-overlay" onClick={() => setFilterOpen(false)} />
          <div className="cwp-filter-drawer-panel">
            <button className="cwp-filter-drawer-close" onClick={() => setFilterOpen(false)}><X size={20} /></button>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:24, clear:'both' }}>Filters</p>
            <FilterSection title="No. of Doors" opts={doorsOptions} active={filterDoors} onToggle={v => toggle(filterDoors, setFilterDoors, v)} />
            <FilterSection title="Colour / Finish" opts={colourOptions} active={filterColour} onToggle={v => toggle(filterColour, setFilterColour, v)} />
            {hasFilter && (
              <button onClick={() => { setFilterDoors([]); setFilterColour([]); setPriceMin(''); setPriceMax(''); setFilterOpen(false); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em', textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b', padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:12 }}>
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {zoomImg && <ImageZoomModal src={zoomImg.src} alt={zoomImg.alt} onClose={() => setZoomImg(null)} />}
    </>
  );
}