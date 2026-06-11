import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

/* ─────────────────────────────────────────────
            Image Zoom Modal
───────────────────────────────────────────── */
function ImageZoomModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos]     = useState({ x: 0, y: 0 });
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

  const zoom = (dir) => {
    setScale(s => {
      const ns = Math.min(4, Math.max(1, s + dir * 0.5));
      setPos(p => clampPos(p.x, p.y, ns));
      return ns;
    });
  };

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  const onMouseDown = e => {
    if (scale === 1) return;
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };
  const onMouseMove = e => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setPos(clampPos(dragStart.current.px + dx, dragStart.current.py + dy, scale));
  };
  const onMouseUp = () => setDragging(false);

  const onWheel = e => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 1 : -1);
  };

  const lastTouchDist = useRef(null);
  const onTouchStart = e => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && scale > 1) {
      setDragging(true);
      dragStart.current = { mx: e.touches[0].clientX, my: e.touches[0].clientY, px: pos.x, py: pos.y };
    }
  };
  const onTouchMove = e => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (lastTouchDist.current) {
        const delta = (dist - lastTouchDist.current) / 80;
        setScale(s => { const ns = Math.min(4, Math.max(1, s + delta)); return ns; });
      }
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && dragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.mx;
      const dy = e.touches[0].clientY - dragStart.current.my;
      setPos(clampPos(dragStart.current.px + dx, dragStart.current.py + dy, scale));
    }
  };
  const onTouchEnd = () => { setDragging(false); lastTouchDist.current = null; };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 10 }}>
        <button onClick={() => zoom(1)} title="Zoom In"
          style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
            color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(4px)', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.28)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <ZoomIn size={18}/>
        </button>
        <button onClick={() => zoom(-1)} title="Zoom Out"
          style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
            color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(4px)', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.28)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <ZoomOut size={18}/>
        </button>
        <button onClick={reset} title="Reset"
          style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
            color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(4px)', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.28)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <RotateCcw size={16}/>
        </button>
        <button onClick={onClose} title="Close"
          style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
            color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(4px)', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(220,60,60,0.55)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <X size={18}/>
        </button>
      </div>

      {scale === 1 && (
        <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
          background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:'0.72rem', letterSpacing:'0.10em',
          padding:'6px 16px', borderRadius:20, backdropFilter:'blur(4px)', pointerEvents:'none',
          textTransform:'uppercase', fontFamily:"'Jost',sans-serif" }}>
          Scroll or tap + to zoom
        </div>
      )}
      {scale > 1 && (
        <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
          background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:'0.72rem', letterSpacing:'0.10em',
          padding:'6px 16px', borderRadius:20, backdropFilter:'blur(4px)', pointerEvents:'none',
          textTransform:'uppercase', fontFamily:"'Jost',sans-serif" }}>
          Drag to pan · {Math.round(scale * 100)}%
        </div>
      )}

      <div
        ref={containerRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{
          width: '90vw', height: '90vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
        }}
      >
        <img
          src={src} alt={alt}
          draggable={false}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain',
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(.22,1,.36,1)',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
            TV Unit Data
───────────────────────────────────────────── */
const tvData = [
  {
    id: 1,
    name: 'Concerto TV Unit Light Grey Walnut',
    image: '/tv-panel/concerto tv unit light grey.jpg',
    type: 'Low Height',
    style: 'Contemporary',
    tag: 'Bestseller',
    price: 18500,
    originalPrice: 22000,
    specs: {
      sku: '830118567',
      brand: 'Hometown',
      material: 'Engineered Wood',
      colour: 'Walnut',
      dimensions: '1695 × 398 × 544 mm',
      length: '1695 mm (≈ 5.6 ft)',
      width: '398 mm (≈ 1.3 ft)',
      height: '544 mm (≈ 1.8 ft)',
      finish: 'Stain & Water Resistant Melamine',
      warranty: '1 Year',
    },
    description: 'The CONCERTO TV unit features sleek legs, beautifully crafted, adorned with a light birch finish. Its unique abstract design at the front elevates your living space. The TV unit is designed to enhance the room\'s aesthetic while providing ample storage, making it suitable for various room setups. The product features a Stain and Water Resistant melamine finish, making it easy to maintain. It is also termite resistant and borer-proof, ensuring long-term durability. Made from environment friendly European Standard Engineered wood.',
    care: 'Dust with a clean, dry lint-free cotton cloth. Avoid exposure to moisture, high temperature or chemicals. Do not expose to direct sunlight. Use placemats or trivets under decorative products to avoid scratches.',
  },
  {
    id: 2,
    name: 'Opus TV Unit in White & Walnut Colour',
    image: '/tv-panel/Opus Tv Unit in White & Walnut Colour.jpg',
    type: 'Low Height',
    style: 'Modern',
    tag: 'New',
    price: 15500,
    originalPrice: 19000,
    specs: {
      sku: '830117958',
      brand: 'HomeTown',
      material: 'Engineered Wood',
      colour: 'White & Walnut',
      configuration: 'Low Height TV Unit',
      dimensions: '1400 × 393 × 548 mm',
      length: '1400 mm (≈ 4.6 ft)',
      width: '393 mm (≈ 1.3 ft)',
      height: '548 mm (≈ 1.8 ft)',
      finish: 'PU Laminate',
      warranty: '1 Year',
    },
    description: 'Made from environment-friendly European Standard Engineered wood, the Opus TV Unit provides a lightweight yet durable structure, making it easy to handle while still offering long-lasting stability. Designed for ease of use and handling, making it practical for everyday use. On each side of the unit, ample storage space for larger items. Positioned at the center, offering storage for smaller items. The surface is treated with a high-quality PU laminate, making it easy to clean and resistant to minor scratches and wear.',
    care: 'Dust with clean, dry lint-free cloth. Do not use chemicals for cleaning surfaces. Avoid direct sunlight. Use placemats to prevent scratches.',
  },
  {
    id: 3,
    name: 'Praxis Wall Unit (Roomset Collection)',
    image: '/tv-panel/ROOMSET-JULYSBPRAXISW7442-LGGL.jpg',
    type: 'Full Height',
    style: 'Contemporary',
    tag: 'Premium',
    price: 32000,
    originalPrice: 39000,
    specs: {
      sku: '830117971',
      brand: 'HomeTown',
      material: 'Engineered Wood',
      colour: 'White & Walnut',
      configuration: 'Dining Utilities / Wall Unit',
      dimensions: '1300 × 393 × 778 mm',
      length: '1300 mm (≈ 4.3 ft)',
      width: '393 mm (≈ 1.3 ft)',
      height: '778 mm (≈ 2.6 ft)',
      finish: 'PU Laminate',
      warranty: '1 Year',
    },
    description: 'Made from environment-friendly European Standard Engineered wood, the Praxis Wall Unit features front cabinet doors with raised geometric squares, adding a touch of retro flair while keeping the overall design clean and modern. Designed for convenient use, with easy access to storage compartments. On each side of the unit, ample storage space for larger items such as cookware or other household essentials. The surface is treated with a high-quality PU laminate, making it easy to clean and resistant to minor scratches and wear.',
    care: 'Clean with a moist cloth for glass surfaces. Avoid exposure to moisture and chemicals. Do not keep hot items directly on furniture surface.',
  },
  {
    id: 4,
    name: 'Antwerp Full Height TV Unit in Sheesham',
    image: '/tv-panel/Antwerp full height tv unit in sheesham.jpg',
    type: 'Full Height',
    style: 'Classic',
    tag: 'Bestseller',
    price: 42000,
    originalPrice: 51000,
    specs: {
      sku: '6000440180',
      brand: 'HomeTown',
      material: 'Engineered Wood',
      colour: 'Sheesham',
      configuration: 'Full Height TV Unit',
      dimensions: '1804 × 408 × 1800 mm',
      length: '1804 mm (≈ 5.9 ft)',
      width: '408 mm (≈ 1.3 ft)',
      height: '1800 mm (≈ 5.9 ft)',
      depth: '405 mm',
      weight: '108 kg',
      finish: 'Scratch Resistant Melamine',
      warranty: '1 Year',
    },
    description: 'The Antwerp wall unit soothes the aesthetic eye with its perfectly symmetrical and geometric layout. Offering ample space and a niche that fits up to 32" screen size TV, the wall unit has a natural wood grain finish in sheesham colour tone. Tuck away your knick-knacks, electronics, and other miscellaneous items in the closed door storage while you can display your favourite curios, memorable frames and fresh planters on the open shelves. Made from environment friendly European Standard Engineered wood with scratch resistant melamine coating. Edge banding on all sides and lamination on all open exposed surfaces to protect from moisture. This product is termite and borer proof.',
    care: 'Dust regularly with dry lint-free cloth. Avoid moisture, high temperature or chemicals. Do not drag in assembled condition. Keep assembly instructions handy.',
  },
  {
    id: 5,
    name: 'Mandrin Engineered Wood Wall Unit',
    image: '/tv-panel/mandrin engineered wood wall unit.jpg',
    type: 'Full Height',
    style: 'Classic',
    tag: 'Premium',
    price: 55000,
    originalPrice: 67000,
    specs: {
      sku: '6000440144',
      brand: 'HomeTown',
      material: 'Melamine Faced Chipboard',
      colour: 'Wenge',
      configuration: 'Full Height TV Unit',
      dimensions: '2130 × 1960 × 1960 mm',
      length: '2130 mm (≈ 7.0 ft)',
      width: '1960 mm (≈ 6.4 ft)',
      height: '1960 mm (≈ 6.4 ft)',
      tvNiche: 'Fits TV up to 42"',
      finish: 'Scratch Resistant Melamine',
      warranty: '1 Year',
    },
    description: 'The Mandrin wall unit in a modern-classic style offers ample open and closed storage spaces to tuck away your quick access items like magazines, books, remotes, cables, etc. Designed with oriental silhouettes of curved cuts and linear window cut on shutters, the wall unit adds warmth to your space with its natural wood grain finish. Display your favourite curios, photo frames, planters on the open shelves to decorate it in your own unique style. A TV with screen size of up to 42" can be fit in the niche provided or placed on top of the shelf. Made from environment friendly European Standard Engineered wood with scratch resistant melamine coating. This product is termite and borer proof.',
    care: 'Do not move in assembled condition. Dismantling is required for shifting. Avoid moisture and direct sunlight. Clean with dry lint-free cloth.',
  },
  {
    id: 6,
    name: 'Peppa TV Unit',
    image: '/tv-panel/peppa tv unit.jpg',
    type: 'Low Height',
    style: 'Modern',
    tag: 'New',
    price: 12500,
    originalPrice: 15500,
    specs: {
      brand: 'Nilkamal',
      modelSeries: 'Walton',
      material: 'Engineered Wood',
      colour: 'Wenge / Multi',
      warranty: '12 Months',
      warrantyType: 'Parts replacement warranty',
    },
    description: 'The Peppa TV Unit from the Walton series by Nilkamal brings modern simplicity to your living room. Compact yet functional, it offers well-designed storage compartments to keep your media essentials organized. The clean finish and streamlined design complement both contemporary and transitional interiors. Built from quality engineered wood ensuring durability for everyday use.',
    care: 'Do not move or push without dismantling. Do not use acid to clean. Do not abuse closing by legs. Use dry cloth to wipe furniture. Do not put water on it. Do not expose to sun.',
  },
  {
    id: 7,
    name: 'BTM Modern TV Cabinet',
    image: '/tv-panel/BTM modern TV cabinet.jpg',
    type: 'Low Height',
    style: 'Contemporary',
    tag: 'Bestseller',
    price: 21000,
    originalPrice: 26000,
    specs: {
      brand: 'BTM',
      material: 'Engineered Wood with Metal Legs',
      colour: 'Grey-Black with Gold Accents',
      dimensions: '170 cm × 40 cm × 50 cm',
      length: '170 cm (≈ 5.6 ft)',
      legHeight: '15.5 cm (adjustable)',
      finish: 'Special Texture with Luxurious Gold Accents',
      warranty: '1 Year',
    },
    description: 'This stunning TV stand combines elegance and functionality, making it the perfect addition to any modern living space. It is 170 cm long and features an elegant grey-black finish with a special texture and luxurious gold accents on the handles and legs. Spacious door compartments ensure your media equipment and accessories stay organized and out of sight. Provides versatile storage solutions for a variety of items. The sturdy gold metal legs not only visually enhance the cabinet, but also provide strong support, with a height of 15.5 cm and adjustable feet ensure stability on any surface. Blends seamlessly into a variety of room configurations and adds modern elegance to your interior décor.',
    care: 'Wipe with dry soft cloth. Avoid harsh chemicals. Adjust feet for stability. Do not overload shelves beyond capacity.',
  },
];

/* ─────────────────────────────────────────────
            Stable Ratings
───────────────────────────────────────────── */
const stableRatings = tvData.map(t => ({
  id: t.id,
  rating: +(4.3 + ((t.id * 19 + 5) % 8) / 10).toFixed(1),
  count: 15 + ((t.id * 37 + 11) % 100),
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

/* ─────────────────────────────────────────────
            Main Page Component
───────────────────────────────────────────── */
export default function TvPanelPage({ onBack, selectedProductId }) {
  const [sortBy, setSortBy]           = useState('popularity');
  const [filterType, setFilterType]   = useState([]);
  const [filterStyle, setFilterStyle] = useState([]);
  const [filterTag, setFilterTag]     = useState([]);
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomImg, setZoomImg]           = useState(null);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [openSections, setOpenSections] = useState({ type: true, style: true, tag: true, price: true });
  const [wishlist, setWishlist]       = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      const found = tvData.find(t => String(t.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedItem(found), 120);
    }
  }, [selectedProductId]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...tvData];
    if (filterType.length)  items = items.filter(t => filterType.includes(t.type));
    if (filterStyle.length) items = items.filter(t => filterStyle.includes(t.style));
    if (filterTag.length)   items = items.filter(t => filterTag.includes(t.tag));
    if (priceMin)           items = items.filter(t => t.price >= parseInt(priceMin));
    if (priceMax)           items = items.filter(t => t.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterType, filterStyle, filterTag, priceMin, priceMax, sortBy]);

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    showToast(`"${item.name}" added to cart`, 'success');
  };

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: item.id, name: item.name, price: item.price, image: item.image });
    showToast(
      wishlist.includes(item.id) ? `Removed from Wishlist` : `"${item.name}" added to Wishlist`,
      wishlist.includes(item.id) ? 'success' : 'wishlist'
    );
    setWishlist(w => w.includes(item.id) ? w.filter(x => x !== item.id) : [...w, item.id]);
  };

  const renderFilterSection = useCallback((title, sectionKey, children) => (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => toggleSection(sectionKey)} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714',
        padding: '0 0 10px 0'
      }}>
        {title}
        {openSections[sectionKey] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {openSections[sectionKey] && children}
    </div>
  ), [openSections, toggleSection]);

  const disc = (item) => Math.round((1 - item.price / item.originalPrice) * 100);

  return (
    <>
      <style>{`
        .tvp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .tvp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .tvp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .tvp-back:hover { color:#1a1714; }
        .tvp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .tvp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .tvp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .tvp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .tvp-main { padding:24px 32px 60px; }
        .tvp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .tvp-count { font-size:0.78rem;color:#6b6359; }
        .tvp-count strong { color:#1a1714;font-weight:600; }
        .tvp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .tvp-sort::-webkit-scrollbar { display:none; }
        .tvp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .tvp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .tvp-sort-btn.active,.tvp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        .tvp-list { display:flex;flex-direction:column;gap:16px; }
        .tvp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .tvp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .tvp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .tvp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .tvp-row:hover .tvp-row-img { transform:scale(1.04); }
        .tvp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .tvp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .tvp-row-wish:hover { color:#c0392b; }
        .tvp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .tvp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .tvp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .tvp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .tvp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .tvp-row-price { font-size:1.45rem;font-weight:700;color:#1a1714; }
        .tvp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .tvp-row-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71; }
        .tvp-row-atc { display:inline-flex;align-items:center;gap:7px;margin-top:14px;
          padding:10px 22px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;transition:background 0.2s; }
        .tvp-row-atc:hover { background:#c9a96e; }

        .tvp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .tvp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:tvpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes tvpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .tvp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8; }
        .tvp-detail-body { padding:28px 32px 48px; }
        .tvp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .tvp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 10px; }
        .tvp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .tvp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .tvp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .tvp-detail-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .tvp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .tvp-detail-specs { margin-bottom:24px; }
        .tvp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .tvp-detail-care { background:#f9f6f1;border-left:3px solid #c9a96e;padding:14px 16px;
          font-size:0.8rem;line-height:1.65;color:#4a4340;margin-bottom:24px; }
        .tvp-detail-care-title { font-size:0.68rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#c9a96e;margin:0 0 8px; }
        .tvp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .tvp-detail-atc { flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;min-width:180px;transition:background 0.2s; }
        .tvp-detail-atc:hover { background:#c9a96e; }
        .tvp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .tvp-detail-close:hover { background:#fff; }
        .tvp-mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .tvp-layout { grid-template-columns:1fr; }
          .tvp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            overflow-y:auto;padding:20px; }
          .tvp-sidebar.open { display:block!important; }
          .tvp-mob-filter-btn { display:flex!important; }
          .tvp-hero { padding:24px 16px 20px; }
          .tvp-main { padding:16px 16px 60px; }
          .tvp-row-img-wrap { width:140px; }
          .tvp-row-img { height:160px; }
          .tvp-row-name { font-size:1.1rem; }
          .tvp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .tvp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .tvp-row { flex-direction:column; }
          .tvp-row-img-wrap { width:100%; }
          .tvp-row-img { height:200px; }
          .tvp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="tvp-root">
        {/* Hero */}
        <div className="tvp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="tvp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="tvp-heading">TV Unit / TV Panel</h1>
            <p className="tvp-sub">Beautifully crafted TV units — designed to elevate your living space. Showing {filtered.length} of {tvData.length} products.</p>
          </div>
        </div>

        <div className="tvp-layout">
          {/* Sidebar filters */}
          <aside className={`tvp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="tvp-mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background:'none',border:'none',cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("UNIT TYPE", "type", <>
              {['Low Height', 'Full Height'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterType.includes(s)} onChange={() => toggleArr(filterType, setFilterType, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {s}
                </label>
              ))}
            </>)}

            {renderFilterSection("STYLE", "style", <>
              {['Contemporary', 'Modern', 'Classic'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterStyle.includes(s)} onChange={() => toggleArr(filterStyle, setFilterStyle, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {s}
                </label>
              ))}
            </>)}

            {renderFilterSection("CATEGORY", "tag", <>
              {['New', 'Bestseller', 'Premium'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}

            {renderFilterSection("PRICE RANGE (₹)", "price", <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number" placeholder="Min" value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '50%', padding: '6px 8px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.78rem', color: '#1a1714' }}
                />
                <span style={{ color: '#aaa', fontSize: '0.75rem' }}>–</span>
                <input
                  type="number" placeholder="Max" value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '50%', padding: '6px 8px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.78rem', color: '#1a1714' }}
                />
              </div>
            </>)}

            {(filterType.length > 0 || filterStyle.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterType([]); setFilterStyle([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="tvp-main">
            {/* Toolbar */}
            <div className="tvp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="tvp-mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.74rem',fontWeight:600,
                    letterSpacing:'0.08em',textTransform:'uppercase',color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="tvp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="tvp-sort">
                <span className="tvp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`tvp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="tvp-list">
              {filtered.map(item => {
                const tc = tagColors[item.tag] || tagColors['New'];
                const inWl = wishlist.includes(item.id);
                const d = disc(item);
                const r = stableRatings.find(r => r.id === item.id);
                return (
                  <div key={item.id} className="tvp-row" onClick={() => setSelectedItem(item)}>
                    <div className="tvp-row-img-wrap">
                      <img className="tvp-row-img" src={item.image} alt={item.name} loading="lazy"
                        style={{ cursor:'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                      <span className="tvp-row-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                      <button className="tvp-row-wish" onClick={e => handleWishlist(item, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="tvp-row-body">
                      <div>
                        <h3 className="tvp-row-name">{item.name}</h3>
                        <StarRating rating={r?.rating ?? 4.5} count={r?.count ?? 42} />
                        <p className="tvp-row-desc">{item.description}</p>
                        <div>
                          {item.type  && <span className="tvp-spec-chip">· {item.type}</span>}
                          {item.style && <span className="tvp-spec-chip">· {item.style}</span>}
                          {item.specs.material && <span className="tvp-spec-chip">· {item.specs.material}</span>}
                          {item.specs.colour   && <span className="tvp-spec-chip">· {item.specs.colour}</span>}
                          {item.specs.warranty && <span className="tvp-spec-chip">· {item.specs.warranty}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="tvp-row-price-row">
                          <span className="tvp-row-price">₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="tvp-row-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                          {d > 0 && <span className="tvp-row-disc">{d}% off</span>}
                        </div>
                        {/* Add to Cart — temporarily hidden (client request) */}
                        {/* <button className="tvp-row-atc" onClick={e => handleAddToCart(item, e)}>
                          <ShoppingBag size={14} /> Add to Cart
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No TV units match your current filters. <br />
                  <button onClick={() => { setFilterType([]); setFilterStyle([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop:12,background:'none',border:'none',color:'#c9a96e',cursor:'pointer',
                      fontWeight:600,fontSize:'0.85rem',textDecoration:'underline' }}>
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
        const tc = tagColors[item.tag] || tagColors['New'];
        const inWl = wishlist.includes(item.id);
        const d = disc(item);
        return (
          <div className="tvp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="tvp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="tvp-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="tvp-detail-img" src={item.image} alt={item.name} />
                <div style={{
                  position:'absolute', bottom:10, right:10,
                  background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%',
                  width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="tvp-detail-body">
                <span className="tvp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                <h2 className="tvp-detail-name">{item.name}</h2>
                <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === item.id)?.count ?? 42} />
                <div className="tvp-detail-price-row">
                  <span className="tvp-detail-price">₹{item.price.toLocaleString('en-IN')}</span>
                  <span className="tvp-detail-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                  {d > 0 && <span className="tvp-detail-disc">{d}% off</span>}
                </div>
                <p className="tvp-detail-desc">{item.description}</p>

                <div className="tvp-detail-specs">
                  <p className="tvp-detail-specs-title">Specifications</p>
                  <SpecRow label="Type"         value={item.type} />
                  <SpecRow label="Style"        value={item.style} />
                  <SpecRow label="Brand"        value={item.specs.brand} />
                  <SpecRow label="SKU"          value={item.specs.sku} />
                  <SpecRow label="Material"     value={item.specs.material} />
                  <SpecRow label="Colour"       value={item.specs.colour} />
                  <SpecRow label="Dimensions"   value={item.specs.dimensions} />
                  <SpecRow label="Length"       value={item.specs.length} />
                  <SpecRow label="Width"        value={item.specs.width} />
                  <SpecRow label="Height"       value={item.specs.height} />
                  <SpecRow label="Depth"        value={item.specs.depth} />
                  <SpecRow label="Weight"       value={item.specs.weight} />
                  <SpecRow label="Finish"       value={item.specs.finish} />
                  <SpecRow label="TV Niche"     value={item.specs.tvNiche} />
                  <SpecRow label="Warranty"     value={item.specs.warranty} />
                </div>

                {item.care && (
                  <div className="tvp-detail-care">
                    <p className="tvp-detail-care-title">Care & Maintenance</p>
                    {item.care}
                  </div>
                )}

                <div className="tvp-detail-actions">
                  {/* Add to Cart — temporarily hidden (client request) */}
                  {/* <button className="tvp-detail-atc" onClick={e => { handleAddToCart(item, e); setSelectedItem(null); }}>
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
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'} />
                    {inWl ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {zoomImg && <ImageZoomModal src={zoomImg.src} alt={zoomImg.alt} onClose={() => setZoomImg(null)} />}
    </>
  );
}