import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
          width: '90vw', height: '85vh', overflow: 'hidden', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
          userSelect: 'none',
        }}
      >
        <img
          src={src} alt={alt} draggable={false}
          style={{
            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transition: dragging ? 'none' : 'transform 0.15s ease',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
    Center Table Data — from Oasis PDF Catalog
───────────────────────────────────────────── */
const centerTableData = [
  {
    id: 1,
    name: 'OS WD 001 A',
    image: '/rare-wood-wardrobes/OS WD 001 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'Premium',
    price: 41607,
    originalPrice: 52000,
    productCode: 'OS WD 001 A',
    dimensions: 'Custom Size Available',
    description: 'The OS WD 001 A is a premium solid rare wood wardrobe with a natural finish, crafted for those who appreciate the beauty of authentic wood grain. Its spacious interior and elegant silhouette make it a statement piece for any bedroom.',
  },
  {
    id: 2,
    name: 'OS WD 002 A',
    image: '/rare-wood-wardrobes/OS WD 002 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'Bestseller',
    price: 33660,
    originalPrice: 42000,
    productCode: 'OS WD 002 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 002 A combines timeless craftsmanship with practical storage. Made from premium rare wood, this wardrobe offers a classic aesthetic while providing ample space for your essentials.',
  },
  {
    id: 3,
    name: 'OS WD 003 A',
    image: '/rare-wood-wardrobes/OS WD 003 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'New',
    price: 33660,
    originalPrice: 42000,
    productCode: 'OS WD 003 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 003 A showcases the finest in rare wood joinery with its beautifully crafted panels and smooth finish. A sophisticated addition to modern and traditional bedrooms alike.',
  },
  {
    id: 4,
    name: 'OS WD 004 A',
    image: '/rare-wood-wardrobes/OS WD 004 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Premium Natural',
    tag: 'Premium',
    price: 50620,
    originalPrice: 63000,
    productCode: 'OS WD 004 A',
    dimensions: 'Custom Size Available',
    description: 'The flagship OS WD 004 A is our most luxurious rare wood wardrobe, featuring exquisite wood grain patterns and master-crafted detailing. A heritage-quality piece built to last generations.',
  },
  {
    id: 5,
    name: 'OS WD 005 A',
    image: '/rare-wood-wardrobes/OS WD 005 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'New',
    price: 24850,
    originalPrice: 31000,
    productCode: 'OS WD 005 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 005 A offers an ideal entry into the rare wood collection — beautifully crafted from solid wood with a natural finish that highlights the unique character of each piece.',
  },
  {
    id: 6,
    name: 'OS WD 006 A',
    image: '/rare-wood-wardrobes/OS WD 006 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'New',
    price: 24150,
    originalPrice: 30000,
    productCode: 'OS WD 006 A',
    dimensions: 'Custom Size Available',
    description: 'The OS WD 006 A wardrobe brings warmth and elegance to any bedroom with its natural rare wood construction and tasteful proportions. A perfect balance of form and function.',
  },
  {
    id: 7,
    name: 'OS WD 007 A',
    image: '/rare-wood-wardrobes/OS WD 007 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Premium Natural',
    tag: 'Bestseller',
    price: 36560,
    originalPrice: 46000,
    productCode: 'OS WD 007 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 007 A is a bestseller for its striking wood texture and generous storage capacity. Every panel is carefully selected for seamless grain pattern and superior finish quality.',
  },
  {
    id: 8,
    name: 'OS WD 008 A',
    image: '/rare-wood-wardrobes/OS WD 008 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'New',
    price: 23150,
    originalPrice: 29000,
    productCode: 'OS WD 008 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 008 A is crafted for the discerning homeowner who values natural materials and clean design. Its rare wood construction ensures both beauty and durability for years to come.',
  },
  {
    id: 9,
    name: 'OS WD 009 A',
    image: '/rare-wood-wardrobes/OS WD 009 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Natural Finish',
    tag: 'New',
    price: 23150,
    originalPrice: 29000,
    productCode: 'OS WD 009 A',
    dimensions: 'Custom Size Available',
    description: 'The OS WD 009 A wardrobe combines solid rare wood construction with thoughtful interior organization. Its natural finish celebrates the authentic beauty of the wood grain.',
  },
  {
    id: 10,
    name: 'OS WD 010 A',
    image: '/rare-wood-wardrobes/OS WD 010 A.jpg',
    series: 'Rare Wood Wardrobe',
    type: 'Wardrobe',
    topMaterial: 'Solid Rare Wood',
    finish: 'Premium Natural',
    tag: 'Premium',
    price: 36650,
    originalPrice: 46000,
    productCode: 'OS WD 010 A',
    dimensions: 'Custom Size Available',
    description: 'OS WD 010 A rounds out the Rare Wood Wardrobe collection with its premium construction and refined natural finish. A timeless wardrobe that will be a focal point in any master bedroom.',
  },
];

/* ─────────────────────────────────────────────
            Helpers
───────────────────────────────────────────── */
const stableRatings = centerTableData.map(p => ({
  id: p.id,
  rating: +(4.2 + ((p.id * 17 + 7) % 9) / 10).toFixed(1),
  count: 12 + ((p.id * 23 + 9) % 88),
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

const ALL_SERIES = [...new Set(centerTableData.map(p => p.series))];
const ALL_TYPES  = [...new Set(centerTableData.map(p => p.type))];

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
      <span style={{ color: '#6b6359', minWidth: 130, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a1714', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
            Main Component
───────────────────────────────────────────── */
export default function CenterTablePage({ onBack, selectedProductId }) {
  const [sortBy, setSortBy]             = useState('popularity');
  const [filterSeries, setFilterSeries] = useState([]);
  const [filterType, setFilterType]     = useState([]);
  const [filterTag, setFilterTag]       = useState([]);
  const [priceMin, setPriceMin]         = useState('');
  const [priceMax, setPriceMax]         = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomImg, setZoomImg]           = useState(null);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [openSections, setOpenSections] = useState({ series: true, type: true, tag: true, price: true });
  const [wishlist, setWishlist]         = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      const found = centerTableData.find(p => String(p.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedItem(found), 120);
    }
  }, [selectedProductId]);

  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...centerTableData];
    if (filterSeries.length) items = items.filter(p => filterSeries.includes(p.series));
    if (filterType.length)   items = items.filter(p => filterType.includes(p.type));
    if (filterTag.length)    items = items.filter(p => filterTag.includes(p.tag));
    if (priceMin)            items = items.filter(p => p.price >= parseInt(priceMin));
    if (priceMax)            items = items.filter(p => p.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterSeries, filterType, filterTag, priceMin, priceMax, sortBy]);

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: `ct-${item.id}`, name: item.name, price: item.price, image: item.image });
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
  ), [openSections]);

  return (
    <>
      <style>{`
        .ct-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }

        /* Hero banner */
        .ct-hero { background:linear-gradient(135deg,#1a1714 0%,#2d2520 60%,#3d3020 100%);
          padding:40px 40px 32px; border-bottom:1px solid rgba(201,169,110,0.2); position:relative; overflow:hidden; }
        .ct-hero::before { content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .ct-hero-inner { max-width:1320px; margin:0 auto; position:relative; }
        .ct-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:rgba(201,169,110,0.7);background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:18px;transition:color 0.2s; }
        .ct-back:hover { color:#c9a96e; }
        .ct-hero-tag { display:inline-block; background:rgba(201,169,110,0.15); border:1px solid rgba(201,169,110,0.3);
          color:#c9a96e; font-size:0.62rem; font-weight:700; letter-spacing:0.20em; text-transform:uppercase;
          padding:4px 14px; margin-bottom:14px; }
        .ct-heading { font-family:'Cormorant Garamond',serif;font-size:3.2rem;font-weight:700;
          color:#fff;margin:0 0 8px;letter-spacing:-0.01em;line-height:1.1; }
        .ct-sub { font-size:0.85rem;color:rgba(255,255,255,0.5);margin:0; }
        .ct-hero-accent { position:absolute;top:-20px;right:40px;width:180px;height:180px;
          border-radius:50%;background:radial-gradient(circle,rgba(201,169,110,0.12) 0%,transparent 70%);
          pointer-events:none; }

        /* Layout */
        .ct-layout { display:grid;grid-template-columns:256px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .ct-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .ct-sidebar::-webkit-scrollbar { width:3px; }
        .ct-sidebar::-webkit-scrollbar-thumb { background:#e8e1d8; }
        .ct-main { padding:28px 36px 80px; }

        /* Toolbar */
        .ct-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .ct-count { font-size:0.78rem;color:#6b6359; }
        .ct-count strong { color:#1a1714;font-weight:600; }
        .ct-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none; }
        .ct-sort::-webkit-scrollbar { display:none; }
        .ct-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .ct-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 14px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s;border-radius:1px; }
        .ct-sort-btn.active,.ct-sort-btn:hover { border-color:#c9a96e;color:#c9a96e;background:#fdf9f3; }

        /* Product grid */
        .ct-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px; }

        /* Product card */
        .ct-card { background:#fff;border:1px solid rgba(0,0,0,0.07);cursor:pointer;
          transition:box-shadow 0.3s,border-color 0.3s,transform 0.2s;overflow:hidden;position:relative; }
        .ct-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.12);border-color:rgba(201,169,110,0.4);transform:translateY(-2px); }
        .ct-card-img-wrap { position:relative;overflow:hidden;background:#f5f0e8;height:240px; }
        .ct-card-img { width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease; }
        .ct-card:hover .ct-card-img { transform:scale(1.06); }
        .ct-card-tag { position:absolute;top:12px;left:12px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;z-index:2; }
        .ct-card-wish { position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.92);
          border:none;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;
          justify-content:center;cursor:pointer;transition:all 0.18s;z-index:2;
          box-shadow:0 2px 8px rgba(0,0,0,0.1); }
        .ct-card-wish:hover { background:#fff;transform:scale(1.1); }
        .ct-card-series { position:absolute;bottom:10px;left:10px;background:rgba(26,23,20,0.72);
          color:rgba(255,255,255,0.85);font-size:0.58rem;font-weight:600;letter-spacing:0.10em;
          text-transform:uppercase;padding:3px 9px;backdrop-filter:blur(4px);z-index:2; }
        .ct-card-body { padding:18px 20px 22px; }
        .ct-card-code { font-size:0.62rem;color:#a09488;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px; }
        .ct-card-name { font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;
          color:#1a1714;margin:0 0 6px;line-height:1.25; }
        .ct-card-desc { font-size:0.78rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .ct-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.67rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 8px;margin:2px 2px 2px 0; }
        .ct-card-price-row { display:flex;align-items:baseline;gap:10px;margin-top:12px;
          padding-top:12px;border-top:1px solid rgba(0,0,0,0.06); }
        .ct-card-price { font-size:1.4rem;font-weight:700;color:#1a1714; }
        .ct-card-orig  { font-size:0.83rem;color:#bbb;text-decoration:line-through; }
        .ct-card-disc  { font-size:0.76rem;font-weight:600;color:#27ae60; }

        /* Detail panel */
        .ct-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.6);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end;backdrop-filter:blur(2px); }
        .ct-detail-panel { background:#fff;width:min(680px,100vw);height:100vh;overflow-y:auto;
          animation:ctSlideIn 0.35s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes ctSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .ct-detail-img-wrap { position:relative;background:#f5f0e8;cursor:zoom-in; }
        .ct-detail-img { width:100%;height:380px;object-fit:contain; }
        .ct-detail-zoom-hint { position:absolute;bottom:12px;right:12px;background:rgba(26,23,20,0.5);
          color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;
          justify-content:center;pointer-events:none;backdrop-filter:blur(4px); }
        .ct-detail-body { padding:32px 36px 56px; }
        .ct-detail-series { font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;
          color:#c9a96e;margin-bottom:6px; }
        .ct-detail-tag { font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:14px;margin-left:10px; }
        .ct-detail-name { font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;
          color:#1a1714;margin:0 0 12px;line-height:1.2; }
        .ct-detail-code { font-size:0.72rem;color:#a09488;letter-spacing:0.06em;margin-bottom:14px; }
        .ct-detail-price-row { display:flex;align-items:baseline;gap:14px;margin-bottom:18px; }
        .ct-detail-price { font-size:2rem;font-weight:700;color:#1a1714; }
        .ct-detail-orig  { font-size:1.1rem;color:#bbb;text-decoration:line-through; }
        .ct-detail-disc  { font-size:0.88rem;font-weight:600;color:#27ae60; }
        .ct-detail-divider { height:1px;background:rgba(0,0,0,0.08);margin:20px 0; }
        .ct-detail-desc { font-size:0.87rem;line-height:1.75;color:#4a4340;margin-bottom:24px; }
        .ct-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 12px; }
        .ct-detail-actions { display:flex;gap:12px;flex-wrap:wrap;margin-top:28px; }
        .ct-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:40px;height:40px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 12px rgba(0,0,0,0.18);transition:all 0.2s;flex-shrink:0; }
        .ct-detail-close:hover { background:#fff;box-shadow:0 4px 18px rgba(0,0,0,0.22); }

        /* Wishlist btn */
        .ct-wish-btn { padding:14px 22px;border:1.5px solid rgba(0,0,0,0.15);background:#fff;
          cursor:pointer;display:flex;align-items:center;gap:8px;
          font-family:'Jost',sans-serif;font-size:0.72rem;font-weight:600;
          letter-spacing:0.10em;text-transform:uppercase;transition:all 0.2s; }
        .ct-wish-btn:hover { border-color:#c9a96e;color:#c9a96e; }
        .ct-wish-btn.active { border-color:#c0392b;color:#c0392b; }

        /* Empty state */
        .ct-empty { text-align:center;padding:100px 0;color:#6b6359;
          font-family:'Jost',sans-serif;font-size:0.9rem; }

        /* Mobile */
        .mob-filter-btn { display:none!important; }
        @media (max-width:1024px) { .ct-grid { grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); } }
        @media (max-width:900px) {
          .ct-layout { grid-template-columns:1fr; }
          .ct-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;overflow-y:auto;padding:20px; }
          .ct-sidebar.open { display:block!important; }
          .mob-filter-btn { display:flex!important; }
          .ct-hero { padding:28px 16px 24px; }
          .ct-main { padding:16px 16px 60px; }
          .ct-heading { font-size:2.2rem; }
          .ct-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .ct-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
          .ct-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px; }
          .ct-card-img-wrap { height:180px; }
        }
        @media (max-width:480px) {
          .ct-grid { grid-template-columns:1fr 1fr;gap:12px; }
          .ct-detail-panel { width:100vw; }
          .ct-detail-img { height:280px; }
          .ct-detail-body { padding:20px 20px 48px; }
          .ct-detail-name { font-size:1.6rem; }
        }
      `}</style>

      <div className="ct-root">
        {/* ── Hero ── */}
        <div className="ct-hero">
          <div className="ct-hero-accent" />
          <div className="ct-hero-inner">
            <button className="ct-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <div className="ct-hero-tag">Oasis Furniture Collection</div>
            <h1 className="ct-heading">Rare Wood Wardrobe Collection</h1>
            <p className="ct-sub">
              Handcrafted from rare solid wood — {filtered.length} of {centerTableData.length} exclusive designs available
            </p>
          </div>
        </div>

        <div className="ct-layout">
          {/* ── Sidebar filters ── */}
          <aside className={`ct-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("SERIES", "series",
              ALL_SERIES.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.78rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterSeries.includes(s)} onChange={() => toggleArr(filterSeries, setFilterSeries, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {s}
                </label>
              ))
            )}

            {renderFilterSection("WARDROBE TYPE", "type",
              ALL_TYPES.map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.78rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterType.includes(t)} onChange={() => toggleArr(filterType, setFilterType, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
                </label>
              ))
            )}

            {renderFilterSection("CATEGORY", "tag",
              ['New', 'Bestseller', 'Premium'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.78rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
                </label>
              ))
            )}

            {renderFilterSection("PRICE RANGE (₹)", "price", (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
                <span style={{ color: '#aaa', flexShrink: 0 }}>–</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
              </div>
            ))}

            {(filterSeries.length > 0 || filterType.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterSeries([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: '#c0392b', background: 'none', border: '1px solid #c0392b',
                  padding: '9px 16px', cursor: 'pointer', width: '100%', marginTop: 4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── Main content ── */}
          <main className="ct-main">
            {/* Toolbar */}
            <div className="ct-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(0,0,0,0.15)',
                    padding: '8px 14px', cursor: 'pointer', fontFamily: "'Jost',sans-serif", fontSize: '0.74rem', fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="ct-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="ct-sort">
                <span className="ct-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`ct-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="ct-grid">
              {filtered.map(item => {
                const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
                const tc   = tagColors[item.tag] || tagColors['New'];
                const inWl = wishlist.includes(item.id);
                const ratingInfo = stableRatings.find(r => r.id === item.id);
                return (
                  <div key={item.id} className="ct-card" onClick={() => setSelectedItem(item)}>
                    <div className="ct-card-img-wrap">
                      <img className="ct-card-img" src={item.image} alt={item.name} loading="lazy"
                        style={{ cursor: 'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                      <span className="ct-card-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                      <button className="ct-card-wish" onClick={e => handleWishlist(item, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                      <span className="ct-card-series">{item.series}</span>
                    </div>
                    <div className="ct-card-body">
                      <div className="ct-card-code">{item.productCode}</div>
                      <h3 className="ct-card-name">{item.name}</h3>
                      <StarRating rating={ratingInfo?.rating ?? 4.5} count={ratingInfo?.count ?? 32} />
                      <p className="ct-card-desc">{item.description}</p>
                      <div>
                        {item.topMaterial && <span className="ct-spec-chip">· {item.topMaterial}</span>}
                        {item.finish && <span className="ct-spec-chip">· {item.finish}</span>}
                        {item.dimensions && <span className="ct-spec-chip">· {item.dimensions}</span>}
                      </div>
                      <div className="ct-card-price-row">
                        <span className="ct-card-price">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.originalPrice && <span className="ct-card-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                        {disc && <span className="ct-card-disc">{disc}% off</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="ct-empty" style={{ gridColumn: '1/-1' }}>
                  No products match your current filters.<br />
                  <button onClick={() => { setFilterSeries([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop: 14, background: 'none', border: 'none', color: '#c9a96e', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.85rem', textDecoration: 'underline', fontFamily: "'Jost',sans-serif" }}>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ── Detail slide-in panel ── */}
      {selectedItem && (() => {
        const item = selectedItem;
        const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
        const tc   = tagColors[item.tag] || tagColors['New'];
        const inWl = wishlist.includes(item.id);
        return (
          <div className="ct-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="ct-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="ct-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <div className="ct-detail-img-wrap" onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="ct-detail-img" src={item.image} alt={item.name} />
                <div className="ct-detail-zoom-hint"><ZoomIn size={16}/></div>
              </div>
              <div className="ct-detail-body">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <span className="ct-detail-series">{item.series}</span>
                  <span className="ct-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                </div>
                <h2 className="ct-detail-name">{item.name}</h2>
                <div className="ct-detail-code">Product Code: {item.productCode}</div>
                <StarRating rating={4.7} count={87} />
                <div className="ct-detail-price-row">
                  <span className="ct-detail-price">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.originalPrice && <span className="ct-detail-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="ct-detail-disc">{disc}% off</span>}
                </div>
                <div className="ct-detail-divider" />
                <p className="ct-detail-desc">{item.description}</p>
                <div>
                  <p className="ct-detail-specs-title">Specifications</p>
                  <SpecRow label="Series"        value={item.series} />
                  <SpecRow label="Table Type"    value={item.type} />
                  <SpecRow label="Top Material"  value={item.topMaterial} />
                  <SpecRow label="Finish"        value={item.finish} />
                  <SpecRow label="Dimensions"    value={item.dimensions} />
                  <SpecRow label="Product Code"  value={item.productCode} />
                </div>
                <div className="ct-detail-actions">
                  <button
                    className={`ct-wish-btn${inWl ? ' active' : ''}`}
                    onClick={e => handleWishlist(item, e)}
                  >
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'} />
                    {inWl ? 'Wishlisted' : 'Add to Wishlist'}
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