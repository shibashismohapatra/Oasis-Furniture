import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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

import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

/* ─────────────────────────────────────────────
   Bed Sets Data  (from Spacewood Price List — May 2026)
   Images: place photos in /public/bed-sets/ folder
   naming convention: Royce.jpg, Adore.jpg etc.
───────────────────────────────────────────── */
const bedSetsData = [
  {
    id: 1,
    name: 'Royce Bedroom Set',
    image: '/bed-sets/Royce.jpg',
    tier: 'Luxury',
    color: 'HG Ceramic, Slate Grey & Gold',
    tag: 'Premium',
    kingPrice: 112998,
    queenPrice: 94264,
    description: 'Elevate your bedroom with the Royce Bedroom Set — where sleek design meets warm sophistication. The combination of HG Ceramic, Slate Grey, and Gold adds just the right touch of luxury and modern flair. Features an openable headboard design and full hydraulic lift-on storage.',
    specs: {
      kingBed: '1957 × 2250 × 1200 mm',
      queenBed: '1657 × 2250 × 1200 mm',
      wardrobe: '1600 × 530 × 2100 mm (4 Door)',
      dresser: '900 × 400 × 1870 mm',
      dresserStool: '396 × 360 × 396 mm',
      bedside: '480 × 400 × 500 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 112998,
      'Queen Bed (Full Lift-on Storage)': 94264,
      '4 Door Wardrobe': 108806,
      'Dresser': 36983,
      'Dresser Stool': 16939,
    },
    features: ['Openable Headboard Design', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 2,
    name: 'Adore Bedroom Set',
    image: '/bed-sets/Adore.jpg',
    tier: 'Luxury',
    color: 'Eucalyptus & Sahara Beige',
    tag: 'Premium',
    kingPrice: 112998,
    queenPrice: 85264,
    description: 'The Adore Bedroom Set features Eucalyptus wood grain, Sahara Beige tones, and a plush cushioned headboard. With sleek grooves, curved panels, and gold accents, it\'s ideal for modern spaces with a luxe, serene feel.',
    specs: {
      kingBed: '1951 × 2087 × 1103 mm',
      queenBed: '1651 × 2087 × 1103 mm',
      wardrobe: '1854 × 602 × 2103 mm (4 Door)',
      dresser: '750 × 454 × 1875 mm',
      bedside: '500 × 454 × 486 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 112998,
      'Queen Bed (Full Lift-on Storage)': 85264,
      '4 Door Wardrobe': 106806,
      'Dresser': 36983,
      'Bedside': 14939,
    },
    features: ['Upholstered Leatherette Headboard', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 3,
    name: 'Desire Bedroom Set',
    image: '/bed-sets/Desire.jpg',
    tier: 'Luxury',
    color: 'Eucalyptus & Sahara Beige',
    tag: 'Bestseller',
    kingPrice: 106998,
    queenPrice: 85264,
    description: 'The Desire Bedroom Set pairs Eucalyptus wood and Sahara Beige with a quilted upholstered headboard and built-in shelf. Sleek lines and smart storage make it perfect for those who seek comfort, style, and functionality.',
    specs: {
      kingBed: '1930 × 2287 × 1200 mm',
      queenBed: '1630 × 2287 × 1200 mm',
      wardrobe: '1854 × 602 × 2103 mm (4 Door)',
      dresser: '750 × 454 × 1875 mm',
      bedside: '500 × 454 × 486 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 106998,
      'Queen Bed (Full Lift-on Storage)': 85264,
      '4 Door Wardrobe': 106806,
      'Dresser': 36983,
      'Bedside': 14939,
    },
    features: ['Upholstered Openable Headboard Storage', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 4,
    name: 'Morgan Bedroom Set',
    image: '/bed-sets/Morgan.jpg',
    tier: 'Luxury',
    color: 'ESM Sahara Beige',
    tag: 'Premium',
    kingPrice: 108778,
    queenPrice: 92485,
    description: 'The Morgan bedroom set features early morning hues in the headboard, a modern yet timeless design, cushioned padding for comfort, flat and fluted glass wardrobe shutters with LED lights, ample storage options, and luxurious gold-finished lunar handles.',
    specs: {
      kingBed: '2020 × 2046 × 1158 mm',
      queenBed: '1720 × 2046 × 1158 mm',
      wardrobe: '1704 × 532 × 2128 mm (4 Door)',
      dresser: '900 × 402 × 1850 mm',
      bedside: '450 × 402 × 480 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 108778,
      'Queen Bed (3/4th Lift-on Storage)': 92485,
      '4 Door Wardrobe': 129429,
      'Dresser': 44710,
      'Bedside': 16258,
    },
    features: ['Upholstered Cushioned Headboard', '3/4th Hydraulic Lift-up Storage'],
  },
  {
    id: 5,
    name: 'Akira Bedroom Set',
    image: '/bed-sets/Akira.jpg',
    tier: 'Luxury',
    color: 'Pumic Grey',
    tag: 'New',
    kingPrice: 109996,
    queenPrice: 89064,
    description: 'The Akira Bedroom Set offers the perfect blend of smartness, style and spaciousness. Its eye-catching look and headboard charging point make it a stunning match for modern lifestyles.',
    specs: {
      kingBed: '1960 × 2145 × 1100 mm',
      queenBed: '1660 × 2145 × 1100 mm',
      wardrobe: '1800 × 580 × 2100 mm (4 Door)',
      dresser: '550 × 403 × 1800 mm',
      bedside: '550 × 403 × 480 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 109996,
      'Queen Bed (Full Lift-on Storage)': 89064,
      '4 Door Wardrobe': 123835,
      'Dresser': 35381,
      'Bedside': 16187,
    },
    features: ['Smart Flute Design Headboard', 'USB Charging Socket', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 6,
    name: 'Artisan Bedroom Set',
    image: '/bed-sets/Artisan.jpg',
    tier: 'Luxury',
    color: 'Sheesham & Natural Wenge',
    tag: 'Premium',
    kingPrice: 103730,
    queenPrice: 87574,
    description: 'The Artisan Bedroom Set consists of detailed designs on the headboard, footboard, wardrobe and dresser shutters. The bed has a wooden top plank on the storage while the wardrobe features organized storage, a locker and an internal drawer.',
    specs: {
      kingBed: '1954 × 2185 × 1207 mm',
      queenBed: '1654 × 2185 × 1207 mm',
      wardrobe: '1770 × 525 × 2130 mm (4 Door)',
      dresser: '980 × 402 × 1850 mm',
      bedside: '500 × 453 × 507 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 103730,
      'Queen Bed (Full Lift-on Storage)': 87574,
      '4 Door Wardrobe': 119029,
      'Dresser': 37462,
      'Bedside': 15711,
    },
    features: ['Classic Headboard Design in Sheesham Color', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 7,
    name: 'Jupiter Bedroom Set',
    image: '/bed-sets/Jupiter.jpg',
    tier: 'Luxury',
    color: 'HG White & Natural Teak',
    tag: 'Premium',
    kingPrice: 114304,
    queenPrice: 94811,
    description: 'Get your lifestyle take to the skies with the luxurious Jupiter Bedroom Set! Its gorgeous finishes and out-of-this-world storage have a spectacular effect on any bedroom. Features a curved headboard panel with an elegant combination of high gloss white and wood grain.',
    specs: {
      kingBed: '1962 × 2150 × 1100 mm',
      queenBed: '1662 × 2150 × 1100 mm',
      wardrobe3Door: '1412 × 573 × 2130 mm (3 Door)',
      wardrobe4Door: '1860 × 573 × 2130 mm (4 Door)',
      dresser: '850 × 400 × 1840 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 114304,
      'Queen Bed (3/4th Lift-on Storage)': 94811,
      '4 Door Wardrobe': 116098,
      'Dresser': 38843,
      'Bedside': 13358,
    },
    features: ['Curved Headboard Panel', 'High Gloss White & Wood Grain', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 8,
    name: 'Nora Bedroom Set',
    image: '/bed-sets/Nora.jpg',
    tier: 'Luxury',
    color: 'Lyon Walnut & HG Ceramic',
    tag: 'Bestseller',
    kingPrice: 96286,
    queenPrice: 85250,
    description: 'Choose elegance. Choose spaciousness. Choose the Nora Bedroom Set! It\'s crafted from durable engineered wood with a minimalist vertical fluted surface. Features an upholstered headboard with flute design in HG ceramic finish.',
    specs: {
      kingBed: '2018 × 2084 × 1100 mm',
      queenBed: '1718 × 2084 × 1100 mm',
      wardrobe: '1664 × 533 × 2030 mm (4 Door)',
      dresser: '700 × 400 × 1875 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 96286,
      'Queen Bed (Full Lift-on Storage)': 85250,
      '4 Door Wardrobe': 112885,
      'Dresser': 35108,
      'Bedside': 14346,
    },
    features: ['Upholstered Headboard with Flute Design', 'HG Ceramic Finish', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 9,
    name: 'Alaska Bedroom Set',
    image: '/bed-sets/Alaska.jpg',
    tier: 'Luxury',
    color: 'HG White & Modern Ash',
    tag: 'New',
    kingPrice: 99098,
    queenPrice: 83611,
    description: 'Make your bedroom space feel more lived-in, welcoming & complete with this Alaska bedroom set. The crisp colors like Modern Ash and high gloss white along with thick 4 post-construction works its strength & style.',
    specs: {
      kingBed: '1960 × 2135 × 1200 mm',
      queenBed: '1660 × 2135 × 1200 mm',
      wardrobe: '1860 × 525 × 2136 mm (3 Door)',
      dresser: '982 × 400 × 1875 mm',
      bedside: '500 × 450 × 500 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 99098,
      'Queen Bed (Full Lift-on Storage)': 83611,
      '3 Door Wardrobe': 88905,
      'Dresser': 36608,
      'Bedside': 11984,
    },
    features: ['4 Post Construction', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 10,
    name: 'Sahara Bedroom Set',
    image: '/bed-sets/Sahara.jpg',
    tier: 'Lifestyle',
    color: 'Stone Grey Modern Ash',
    tag: 'Bestseller',
    kingPrice: 84042,
    queenPrice: 69455,
    description: 'The Sahara Bedroom set blends classic and contemporary styles with elegant moulding and a floating effect from plastic ABS legs. It includes a traditional dresser and bedside table with functional features. The beige and Sheesham finish is accentuated by sleek bronze diamond-cut handles.',
    specs: {
      kingBed: '1954 × 2140 × 1150 mm',
      queenBed: '1654 × 2140 × 1150 mm',
      wardrobe: '1800 × 530 × 2100 mm (4 Door)',
      dresser: '900 × 405 × 1900 mm',
      bedside: '500 × 405 × 490 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 84042,
      'Queen Bed (3/4th Lift-on Storage)': 69455,
      '4 Door Wardrobe': 99980,
      'Dresser': 27143,
      'Bedside': 13414,
    },
    features: ['Stylish Headboard with Charging Socket', '3/4 Hydraulic Lift-on Storage'],
  },
  {
    id: 11,
    name: 'Gloria Bedroom Set',
    image: '/bed-sets/Gloria.jpg',
    tier: 'Lifestyle',
    color: 'Sebastian Oak & Bamboo Flute',
    tag: 'New',
    kingPrice: 86411,
    queenPrice: 74957,
    description: 'Add a glorious touch with the Gloria Bedroom Set. The fluted design, padded headboard and natural finish complement each other for a beautiful and cosy space. Features easily accessible headboard storage.',
    specs: {
      kingBed: '1930 × 2278 × 1150 mm',
      queenBed: '1630 × 2278 × 1150 mm',
      wardrobe: '1390 × 533 × 2118 mm (3 Door)',
      dresser: '654 × 402 × 1945 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 86411,
      'Queen Bed (3/4th Lift-on Storage)': 74957,
      '3 Door Wardrobe': 72613,
      'Dresser': 28680,
      'Bedside': 10026,
    },
    features: ['Easily Accessible Headboard Storage', '3/4th Hydraulic Storage'],
  },
  {
    id: 12,
    name: 'Pearl Bedroom Set',
    image: '/bed-sets/Pearl.jpg',
    tier: 'Lifestyle',
    color: 'HG Ceramic & Natural Teak',
    tag: 'Bestseller',
    kingPrice: 93250,
    queenPrice: 74877,
    description: 'Transform your bedroom with the Spacewood Pearl Bedroom Set — the perfect mix of elegance, smart storage, and everyday convenience. Designed for those who value both beauty and functionality. Also available in 3 door wardrobe.',
    specs: {
      kingBed: '1960 × 2137 × 1100 mm',
      queenBed: '1660 × 2137 × 1100 mm',
      wardrobe3Door: '1276 × 530 × 2130 mm (3 Door)',
      wardrobe4Door: '1676 × 530 × 2130 mm (4 Door)',
      dresser: '850 × 480 × 1850 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 93250,
      'Queen Bed (3/4th Lift-on Storage)': 74877,
      '3 Door Wardrobe': 89296,
      '4 Door Wardrobe': 105944,
      'Dresser': 33239,
      'Bedside': 9173,
    },
    features: ['3/4th Hydraulic Lift-on Storage Bed', 'Also Available in 3 Door Wardrobe'],
  },
  {
    id: 13,
    name: 'Alina Bedroom Set',
    image: '/bed-sets/Alina.jpg',
    tier: 'Lifestyle',
    color: 'HG White & Fumed Oak',
    tag: 'New',
    kingPrice: 71284,
    queenPrice: 66580,
    description: 'Elevate your space with the perfect blend of style and functionality. The Alina Bedroom Set includes a premium bed, spacious wardrobe, elegant dresser, and matching bedside unit — all crafted to bring harmony and comfort to your bedroom. Features an elegant fluted design for a timeless look.',
    specs: {
      kingBed: '1960 × 2176 × 1100 mm',
      queenBed: '1660 × 2176 × 1100 mm',
      wardrobe: '1654 × 533 × 2030 mm (4 Door)',
      dresser: '900 × 400 × 1850 mm',
      bedside: '500 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 71284,
      'Queen Bed (3/4th Lift-on Storage)': 66580,
      '4 Door Wardrobe': 99000,
      'Dresser': 25529,
      'Bedside': 12714,
    },
    features: ['Elegant Fluted Design', '3/4th Hydraulic Lift-on Storage Bed'],
  },
  {
    id: 14,
    name: 'Boston Bedroom Set',
    image: '/bed-sets/Boston.jpg',
    tier: 'Lifestyle',
    color: 'Sheesham',
    tag: 'Bestseller',
    kingPrice: 93517,
    queenPrice: 77113,
    description: 'Outfit your bedroom dreams with real Sheesham feel. Boston bedroom set elegantly replicates the original Sheesham wood colors and textures to give it a novel look and hassle-free maintenance.',
    specs: {
      kingBed: '1954 × 2114 × 1150 mm',
      queenBed: '1654 × 2114 × 1150 mm',
      wardrobe: '1384 × 525 × 2030 mm (3 Door)',
      dresser: '650 × 400 × 1850 mm',
      bedside: '450 × 405 × 450 mm',
    },
    prices: {
      'King Bed (Full Lift-on Storage)': 93517,
      'Queen Bed (Full Lift-on Storage)': 77113,
      '3 Door Wardrobe': 76237,
      'Dresser': 29288,
      'Bedside': 11763,
    },
    features: ['Sheesham Wood Finish', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 15,
    name: 'Amazon Bedroom Set',
    image: '/bed-sets/Amazon.jpg',
    tier: 'Lifestyle',
    color: 'Natural Wenge & Bronze Walnut',
    tag: 'New',
    kingPrice: 105860,
    queenPrice: 89764,
    description: 'The Amazon Bedroom Set combines rich Natural Wenge and Bronze Walnut tones for a bold, earthy aesthetic. A statement bedroom set with ample storage and contemporary styling.',
    specs: {
      kingBed: '2030 × 2300 × 900 mm',
      queenBed: '1730 × 2300 × 900 mm',
      wardrobe: '1352 × 550 × 2130 mm (3 Door)',
      dresser: '800 × 450 × 1800 mm',
      bedside: '450 × 450 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 105860,
      'Queen Bed (3/4th Lift-on Storage)': 89764,
      '3 Door Wardrobe': 89035,
      'Dresser': 32604,
      'Bedside': 14196,
    },
    features: ['Natural Wenge & Bronze Walnut Finish', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 16,
    name: 'Maple Bedroom Set',
    image: '/bed-sets/Maple.jpg',
    tier: 'Lifestyle',
    color: 'Fumed Oak & Bronze Walnut',
    tag: 'Premium',
    kingPrice: 84460,
    queenPrice: 65373,
    description: 'Symbolic of strength & endurance, the Maple leaf assures a unified look across the entire bedroom set. It comes in a subtle blend of browns which satisfies the desires of comfort & luxury. Also available in 3 door wardrobe.',
    specs: {
      kingBed: '1920 × 2180 × 900 mm',
      queenBed: '1620 × 2180 × 900 mm',
      slidingWardrobe: '1804 × 600 × 2000 mm (Sliding)',
      wardrobe3Door: '1352 × 530 × 2030 mm (3 Door)',
      dresser: '852 × 400 × 1850 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 84460,
      'Queen Bed (3/4th Lift-on Storage)': 65373,
      'Sliding Wardrobe': 112391,
      '3 Door Wardrobe': 55016,
      'Dresser': 24753,
      'Bedside': 9066,
    },
    features: ['Also Available in 3 Door Wardrobe', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 17,
    name: 'Modena Bedroom Set',
    image: '/bed-sets/Modena.jpg',
    tier: 'Lifestyle',
    color: 'Natural Teak',
    tag: 'New',
    kingPrice: 68206,
    queenPrice: 62226,
    description: 'Modena bedroom set has all the elements you want in your room to exude functionality. While its upholstered headboard reflects your design aesthetics, its dresser is designed keeping in mind Indian utility concept to cater to multiple storage needs.',
    specs: {
      kingBed: '2018 × 2096 × 1100 mm',
      queenBed: '1718 × 2096 × 1100 mm',
      wardrobe3Door: '1352 × 535 × 2030 mm (3 Door Harmony)',
      wardrobe2Door: '904 × 535 × 2030 mm (2 Door Harmony)',
      dresser: '854 × 400 × 1800 mm',
      bedside: '454 × 404 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 68206,
      'Queen Bed (3/4th Lift-on Storage)': 62226,
      'Harmony 3 Door Wardrobe': 57993,
      'Harmony 2 Door Wardrobe': 47516,
      'Dresser': 27272,
      'Bedside': 9072,
    },
    features: ['Cushioned Upholstery', 'Grooved Side Panels', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 18,
    name: 'Monarch Bedroom Set',
    image: '/bed-sets/Monarch.jpg',
    tier: 'Lifestyle',
    color: 'Natural Teak / Vermont',
    tag: 'Bestseller',
    kingPrice: 67375,
    queenPrice: 50066,
    description: 'The Monarch Bedroom Set brings regal sophistication to your bedroom. Available in Natural Teak and Vermont color. A complete bedroom solution with wardrobe, dresser and bedside options.',
    specs: {
      kingBed: '1934 × 2235 × 1019 mm',
      queenBed: '1634 × 2235 × 1019 mm',
      wardrobe3Door: '1352 × 535 × 2030 mm (3 Door Harmony)',
      wardrobe2Door: '904 × 535 × 2030 mm (2 Door Harmony)',
      dresser: '854 × 400 × 1800 mm',
      bedside: '454 × 404 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 67375,
      'Queen Bed (3/4th Lift-on Storage)': 50066,
      'Harmony 3 Door Wardrobe': 57993,
      'Harmony 2 Door Wardrobe': 47516,
      'Dresser': 27272,
      'Bedside': 9072,
    },
    features: ['Also Available in Vermont Color', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 19,
    name: 'Maximus Bedroom Set',
    image: '/bed-sets/Maximus.jpg',
    tier: 'Lifestyle',
    color: 'Sheesham',
    tag: 'Premium',
    kingPrice: 73450,
    queenPrice: 65620,
    description: 'Add superb class and style to your bedroom with the elegant Maximus Bedroom set. The Sheesham color will enhance the aesthetics of your room. Also available in 2 & 3 Door Wardrobe options.',
    specs: {
      kingBed: '1930 × 2210 × 1150 mm',
      queenBed: '1630 × 2210 × 1150 mm',
      wardrobe2Door: '800 × 480 × 1930 mm (2 Door)',
      wardrobe3Door: '1200 × 480 × 1930 mm (3 Door)',
      slidingWardrobe: '1800 × 550 × 2100 mm (2 Door Sliding)',
      dresser: '870 × 400 × 1828 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 73450,
      'Queen Bed (3/4th Lift-on Storage)': 65620,
      '2 Door Wardrobe': 36626,
      '3 Door Wardrobe': 48926,
      '2 Door Sliding Wardrobe': 97956,
      'Dresser': 34183,
      'Bedside': 11134,
    },
    features: ['Cushioned Headboard with Storage', 'Also Available in 2 & 3 Door Wardrobe', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 20,
    name: 'Cleo Bedroom Set',
    image: '/bed-sets/Cleo.jpg',
    tier: 'Value',
    color: 'Santana Oak & Bamboo Flute',
    tag: 'New',
    kingPrice: 65001,
    queenPrice: 54548,
    description: 'The Cleo set exemplifies modern functionality with effortless charm. Its rich Santana Oak and Bamboo Flute finish offers a striking yet elegant appeal, seamlessly complementing any room décor.',
    specs: {
      kingBed: '1900 × 2060 × 950 mm',
      queenBed: '1600 × 2060 × 950 mm',
      wardrobe: '1200 × 530 × 2100 mm (3 Door)',
      dresser: '600 × 400 × 1850 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 65001,
      'Queen Bed (3/4th Lift-on Storage)': 54548,
      '3 Door Wardrobe': 63976,
      'Dresser': 26596,
      'Bedside': 8704,
    },
    features: ['Classic Bamboo Flute Headboard Design', 'Full Hydraulic Lift-on Storage'],
  },
  {
    id: 21,
    name: 'Asta Bedroom Set',
    image: '/bed-sets/Asta.jpg',
    tier: 'Value',
    color: 'Sheesham',
    tag: 'New',
    kingPrice: 45554,
    queenPrice: 40768,
    description: 'Add a natural touch to your space with this bedroom set coated in rich Sheesham colour. With an elegant queen-size bed, bedside, dresser and a choice between a 2 or 3-door wardrobe, it offers the perfect blend of practical design and excellent value.',
    specs: {
      kingBed: '1920 × 2080 × 900 mm (Box Storage)',
      queenBed: '1620 × 2080 × 900 mm (Box Storage)',
      wardrobe2Door: '800 × 460 × 1950 mm (2 Door, No Mirror)',
      wardrobe3Door: '1200 × 460 × 1800 mm (3 Door, No Mirror)',
      dresser: '450 × 400 × 1800 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (Box Storage)': 45554,
      'Queen Bed (Box Storage)': 40768,
      'King Bed (Without Storage)': 40369,
      'Queen Bed (Without Storage)': 36123,
      '2 Door Wardrobe': 26587,
      '3 Door Wardrobe': 35767,
      'Dresser': 9588,
      'Bedside': 5022,
    },
    features: ['Headboard with Aluminium T-Section Profile', 'Box Storage & Without Storage Options'],
  },
  {
    id: 22,
    name: 'Nester Bedroom Set',
    image: '/bed-sets/Nester.jpg',
    tier: 'Value',
    color: 'Stone Grey Modern Ash & Sebastian Oak',
    tag: 'New',
    kingPrice: 58813,
    queenPrice: 52336,
    description: 'The Nester Bedroom Set pairs Stone Grey panels with warm Sebastian Oak for a light, modern vibe. With clean lines, ample storage, and practical pieces like a dresser with stool and compact wardrobe, it\'s perfect for those who value simplicity, function, and understated elegance.',
    specs: {
      kingBed: '1880 × 2042 × 375 mm (3/4th Lift-on)',
      queenBed: '1680 × 2042 × 375 mm (3/4th Lift-on)',
      kingBedFront: '1904 × 2053 × 950 mm (Front Pull Out)',
      queenBedFront: '1615 × 2075 × 950 mm (Front Pull Out)',
      wardrobe: '1204 × 502 × 2100 mm (3 Door)',
      dresser: '600 × 400 × 1850 mm',
      bedside: '450 × 402 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 58813,
      'Queen Bed (3/4th Lift-on Storage)': 52336,
      'King Bed (Front Pull Out Storage)': 56332,
      'Queen Bed (Front Pull Out Storage)': 50324,
      '3 Door Wardrobe': 42024,
      'Dresser': 11588,
      'Dresser Stool': 3618,
      'Bedside': 5618,
    },
    features: ['Precision Routed Headboard', 'Front Pullout Lift-on Storage Option'],
  },
  {
    id: 23,
    name: 'Carnival Bedroom Set',
    image: '/bed-sets/Carnival.jpg',
    tier: 'Value',
    color: 'Natural Wenge / Natural Teak',
    tag: 'Bestseller',
    kingPrice: 55228,
    queenPrice: 50564,
    description: 'From the moment you wake up till you fall asleep, let the celebrations begin! The Spacewood Carnival Bedroom Set in Natural Wenge/Natural Teak. Also available in without storage option.',
    specs: {
      kingBed: '1964 × 2085 × 1030 mm',
      queenBed: '1664 × 2085 × 1030 mm',
      wardrobe2Door: '800 × 460 × 1800 mm (2 Door with Mirror)',
      wardrobe3Door: '1200 × 460 × 1800 mm (3 Door, No Mirror)',
      dresser: '520 × 400 × 1750 mm',
      bedside: '400 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 55228,
      'Queen Bed (3/4th Lift-on Storage)': 50564,
      'King Bed (Box Storage)': 51562,
      'Queen Bed (Box Storage)': 47205,
      '3 Door Wardrobe': 40798,
      'Dresser': 14714,
      'Bedside': 5390,
    },
    features: ['Also Available in Natural Teak', '3/4th Hydraulic Lift-on Storage', 'Box Storage Option Available'],
  },
  {
    id: 24,
    name: 'Comfy Bedroom Set',
    image: '/bed-sets/Comfy.jpg',
    tier: 'Value',
    color: 'Sheesham',
    tag: 'New',
    kingPrice: 58813,
    queenPrice: 50564,
    description: 'The Comfy bedroom set combines classic style with the bold look of Sheesham wood. It features a cushioned headboard for added comfort, sleek sliding wardrobe doors, a dresser with ample storage and a full-length mirror, and black handles that enhance the natural Sheesham finish.',
    specs: {
      kingBed: '1920 × 2210 × 1150 mm',
      queenBed: '1620 × 2210 × 1150 mm',
      wardrobe3Door: '1200 × 480 × 1930 mm (3 Door)',
      wardrobe2Door: '800 × 480 × 1930 mm (2 Door)',
      slidingWardrobe: '1800 × 550 × 2100 mm (2 Door Sliding)',
      dresser: '870 × 400 × 1828 mm',
      bedside: '450 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 58813,
      'Queen Bed (3/4th Lift-on Storage)': 50564,
      '3 Door Wardrobe': 53228,
      '2 Door Wardrobe': 47228,
      '2 Door Sliding Wardrobe': 77228,
      'Dresser': 26714,
      'Bedside': 7390,
    },
    features: ['Cushioned Headboard', 'Sliding Wardrobe Option', '3/4th Hydraulic Lift-on Storage'],
  },
  {
    id: 25,
    name: 'Eco Bedroom Set',
    image: '/bed-sets/Eco.jpg',
    tier: 'Value',
    color: 'Lyon Walnut / Bamboo Flute',
    tag: 'New',
    kingPrice: 55636,
    queenPrice: 50819,
    description: 'Enhance your bedroom with our affordable, stylish set in Lyon Walnut or Bamboo Flute. It features a choice of a 3/4 lift-up bed with or without storage, a spacious 3-door wardrobe, a classic Indian dresser with drawers, and a basic night stand. Experience practical design and excellent value with this complete set.',
    specs: {
      kingBed: '1915 × 2075 × 1030 mm',
      queenBed: '1615 × 2075 × 1030 mm',
      wardrobe: '1200 × 460 × 1950 mm (3 Door)',
      dresser: '520 × 400 × 1850 mm',
      bedside: '420 × 400 × 450 mm',
    },
    prices: {
      'King Bed (3/4th Lift-on Storage)': 55636,
      'Queen Bed (3/4th Lift-on Storage)': 50819,
      '3 Door Wardrobe': 40651,
      'Dresser': 15650,
      'Bedside': 6547,
    },
    features: ['Bamboo Flute Finish Headboard', '3/4th Hydraulic Lift-on Storage'],
  },

  // ── Alder Bedroom Sets ──
  {
    id: 26,
    name: 'Madrid Bedroom Set',
    image: '/bed-sets/alder/Madrid.jpg',
    tier: 'Luxury',
    color: 'Walnut & Off White',
    tag: 'Bestseller',
    kingPrice: 68438,
    queenPrice: 68438,
    description: 'The Madrid Bedroom Set blends contemporary arch design with rich walnut tones and clean white panels. Features full hydraulic lift storage with elegant arch motif detailing on bed, wardrobe, and dresser.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe': 'W 63D 21 H78 in / 1575 D 525 H 1950 mm (4 Door)',
      'dresser': 'W 32 D 16 H 75 in / 800 D 400 H 1875 mm',
      'bedside': 'W18 D16 H21 in / 450 D400 H525 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 68438,
      '4 Door Wardrobe': 65463,
      'Dresser': 32731,
      'Bedside': 9125
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Arch Design Motif', 'King Size Available'],
  },
  {
    id: 27,
    name: 'Vienna Bedroom Set',
    image: '/bed-sets/alder/Vienna.jpg',
    tier: 'Luxury',
    color: 'Walnut & White',
    tag: 'Premium',
    kingPrice: 67050,
    queenPrice: 67050,
    description: 'Vienna Bedroom Set offers sleek geometric line detailing on a classic walnut and white combination. Comes with full hydraulic lift storage and a matching dresser with full-length mirror.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe3Door': 'W 48D 21 H78 in / 1200 D 525 H1950 mm (3D)',
      'wardrobe2Door': 'W 32D 21 H78 in / 800 D 525 H1950 mm (2D)',
      'dresser': 'W 36 D 16 H 75 in / 900 D 400 H 1875 mm',
      'bedside': 'W18 D16 H21 in / 450 D400 H425 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 67050,
      '3 Door Wardrobe': 52568,
      '2 Door Wardrobe': 35707,
      'Dresser': 28566,
      'Bedside': 9918
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Geometric Line Design', '2D & 3D Wardrobe Options'],
  },
  {
    id: 28,
    name: 'Classic Bedroom Set',
    image: '/bed-sets/alder/Classic.jpg',
    tier: 'Value',
    color: 'Dark Walnut',
    tag: 'Bestseller',
    kingPrice: 43245,
    queenPrice: 43245,
    description: 'The Classic Bedroom Set in deep dark walnut finish is a timeless choice. Includes a manual lift bed, 2-door wardrobe with mirror, and matching bedside.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe2Door': 'W 32 D 21H 72 in / 800 D 525 H 1800 mm (2D)',
      'bedside': 'W16 D16 H18 in / 400 D400 H450 mm'
    },
    prices: {
      'King Bed (Manual Lift)': 43245,
      '2 Door Wardrobe': 29756,
      'Bedside': 6348
    },
    features: ['Manual Lift HT 400MM', 'King & Queen Available', 'Classic Dark Walnut Finish'],
  },
  {
    id: 29,
    name: 'Parker Bedroom Set',
    image: '/bed-sets/alder/Parker.jpg',
    tier: 'Lifestyle',
    color: 'Walnut & White',
    tag: 'Premium',
    kingPrice: 64141,
    queenPrice: 64141,
    description: 'Parker Bedroom Set features elegant curved arch detailing in walnut and white combination. Full hydraulic lift storage with matching dresser and wardrobe options in 2D and 3D.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe3Door': 'W 48D 21 H79 in / 1200 D 534 H 1988 mm (3D)',
      'wardrobe2Door': 'W 32D 21 H79 in / 800 D 534 H 1988 mm (2D)',
      'dresser': 'W 21 D 16 H 79 in / 534 D 422 H 1992 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 64141,
      '3 Door Wardrobe': 45629,
      '2 Door Wardrobe': 29954,
      'Dresser': 20828
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Curved Arch Design', 'King Size Available'],
  },
  {
    id: 30,
    name: 'Pristine Bedroom Set',
    image: '/bed-sets/alder/Pristine.jpg',
    tier: 'Luxury',
    color: 'White & Walnut',
    tag: 'Premium',
    kingPrice: 110693,
    queenPrice: 110693,
    description: 'The Pristine Bedroom Set is a statement of pure elegance in white and walnut. Includes a premium 6-door wardrobe and matching dresser for the ultimate luxury bedroom experience.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe6Door': '6 Door (2+2+2)',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 110693,
      '6 Door Wardrobe (2+2+2)': 228131,
      'Dresser': 39675,
      'Bedside': 17853
    },
    features: ['Luxury White Finish', '6 Door Wardrobe Available', 'Premium Build'],
  },
  {
    id: 31,
    name: 'Elite Bedroom Set',
    image: '/bed-sets/alder/Elite.jpg',
    tier: 'Luxury',
    color: 'White & Walnut',
    tag: 'Premium',
    kingPrice: 111883,
    queenPrice: 111883,
    description: 'Elite Bedroom Set redefines luxury with a 5-door wardrobe and premium white-walnut combination. Crafted for those who demand the very best in bedroom furniture.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe5Door': 'L 82 W 22 H 84 in / 2083 W 559 H 2130 mm (5D 2+1+2)',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 111883,
      '5 Door Wardrobe (2+1+2)': 139725,
      'Dresser': 49593,
      'Bedside': 12696
    },
    features: ['5 Door Wardrobe (2+1+2)', 'Full Luxury Package', 'Premium White Finish'],
  },
  {
    id: 32,
    name: 'Sony Bedroom Set',
    image: '/bed-sets/alder/Sony.jpg',
    tier: 'Lifestyle',
    color: 'Dark Walnut',
    tag: 'Bestseller',
    kingPrice: 64276,
    queenPrice: 64276,
    description: 'Sony Bedroom Set offers clean, modern lines in rich dark walnut. A complete bedroom solution with matching wardrobe, dresser, and bedside table.',
    specs: {
      'kingBed': 'King Size',
      'dresser': 'Included',
      'bedside': 'Included'
    },
    prices: {
      'King Bed': 64276,
      'Wardrobe': 59909,
      'Dresser': 20631,
      'Bedside': 2975
    },
    features: ['Clean Modern Lines', 'Dark Walnut Finish', 'Complete Set Available'],
  },
  {
    id: 33,
    name: 'Texas Bedroom Set',
    image: '/bed-sets/alder/Texas.jpg',
    tier: 'Lifestyle',
    color: 'Walnut & White',
    tag: 'New',
    kingPrice: 65463,
    queenPrice: 65463,
    description: 'Texas Bedroom Set with extended dressing profile brings Western-inspired boldness to your bedroom. Features walnut and white combination with full accessory range.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 31740,
      'Wardrobe': 65463,
      'Ext. Dressing': 24251,
      'Dresser': 7538,
      'Ext. Profile': 32535,
      'Extra': 21225
    },
    features: ['Extended Dressing Profile', 'Walnut & White Finish', 'King Size Available'],
  },
  {
    id: 34,
    name: 'Haven Bedroom Set',
    image: '/bed-sets/alder/Haven.jpg',
    tier: 'Lifestyle',
    color: 'Walnut & White',
    tag: 'New',
    kingPrice: 64273,
    queenPrice: 64273,
    description: 'Haven Bedroom Set is your sanctuary in walnut and white. A feature-complete set with extended profile dressing and 2-door wardrobe.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe2Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 31740,
      'Wardrobe 2D': 64273,
      'Ext. Dressing': 24201,
      'Dresser': 9323,
      'Ext. Profile': 23606,
      'Extra': 28290
    },
    features: ['Extended Profile Design', 'Walnut & White Finish', 'King Size Available'],
  },
  {
    id: 35,
    name: 'Ambely Bedroom Set',
    image: '/bed-sets/alder/Ambely.jpg',
    tier: 'Luxury',
    color: 'Walnut & White',
    tag: 'Bestseller',
    kingPrice: 63480,
    queenPrice: 63480,
    description: 'Ambely Bedroom Set features a bold contemporary design with a 4-door wardrobe and matching dresser. Crafted for those who appreciate spacious, well-organized bedrooms.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 63480,
      '4 Door Wardrobe': 65463,
      'Dresser': 33327,
      'Bedside': 7538
    },
    features: ['4 Door Wardrobe', 'Full Hydraulic Lift', 'King Size Available'],
  },
  {
    id: 36,
    name: 'Rio Bedroom Set',
    image: '/bed-sets/alder/Rio.jpg',
    tier: 'Lifestyle',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 57528,
    queenPrice: 57528,
    description: 'Rio Bedroom Set in rich dark walnut with a 4-door wardrobe. A complete bedroom solution with matching dresser and bedside for the modern home.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 57528,
      '4 Door Wardrobe': 61893,
      'Dresser': 18647,
      'Bedside': 7737
    },
    features: ['4 Door Wardrobe', 'Dark Walnut Finish', 'King Size Available'],
  },
  {
    id: 37,
    name: 'Austria Bedroom Set',
    image: '/bed-sets/alder/Austria.jpg',
    tier: 'Lifestyle',
    color: 'Walnut & White',
    tag: 'Premium',
    kingPrice: 68241,
    queenPrice: 68241,
    description: 'Austria Bedroom Set brings European elegance with walnut and white tones. Clean lines, full hydraulic lift storage and a comprehensive wardrobe system.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 68241,
      'Wardrobe': 55545,
      'Dresser': 20828,
      'Bedside': 7199
    },
    features: ['European Design', 'Full Hydraulic Lift', 'Walnut & White Finish'],
  },
  {
    id: 38,
    name: 'Korvy Bedroom Set',
    image: '/bed-sets/alder/Korvy.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Premium',
    kingPrice: 72200,
    queenPrice: 72200,
    description: 'Korvy Bedroom Set is a premium offering with a 3-door wardrobe and full matching set. A statement piece for those who want a bold, dark walnut bedroom.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe3Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 72200,
      '3 Door Wardrobe': 100156,
      'Dresser': 35131,
      'Bedside': 12696
    },
    features: ['3 Door Wardrobe', 'Premium Dark Walnut', 'Full Hydraulic Lift'],
  },
  {
    id: 39,
    name: 'Arena Bedroom Set',
    image: '/bed-sets/alder/Arena.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Bestseller',
    kingPrice: 84904,
    queenPrice: 84904,
    description: 'Arena Bedroom Set commands attention with its bold dark walnut design. Includes a spacious wardrobe and well-appointed dresser for a complete bedroom transformation.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 101071,
      'Wardrobe': 84904,
      'Dresser': 32533,
      'Bedside': 11902
    },
    features: ['Bold Dark Walnut Design', 'Full Hydraulic Lift', 'King Size Available'],
  },
  {
    id: 40,
    name: 'Aria Bedroom Set',
    image: '/bed-sets/alder/Aria.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Premium',
    kingPrice: 93236,
    queenPrice: 93236,
    description: 'Aria Bedroom Set exudes sophistication with its dark walnut finish and curved headboard. A 4-door wardrobe and matching dresser complete this premium set.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 93236,
      '4 Door Wardrobe': 111783,
      'Dresser': 39694,
      'Bedside': 14371
    },
    features: ['Premium Dark Walnut', '4 Door Wardrobe', 'Full Hydraulic Lift'],
  },
  {
    id: 41,
    name: 'Nelson Bedroom Set',
    image: '/bed-sets/alder/Nelson.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Premium',
    kingPrice: 96727,
    queenPrice: 96727,
    description: 'Nelson Bedroom Set is the epitome of dark luxury. With a 4-door wardrobe and elegant dresser, it offers maximum storage in a deeply satisfying walnut aesthetic.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 104939,
      '4 Door Wardrobe': 96727,
      'Dresser': 49731,
      'Bedside': 15274
    },
    features: ['Full Hydraulic Lift', '4 Door Wardrobe', 'Luxury Dark Walnut'],
  },
  {
    id: 42,
    name: 'Spectra Bedroom Set',
    image: '/bed-sets/alder/Spectra.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 95668,
    queenPrice: 95668,
    description: 'Spectra Bedroom Set brings a spectrum of dark walnut elegance with a 4-door wardrobe and premium dresser. Clean modern lines make it perfect for contemporary homes.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 95668,
      '4 Door Wardrobe': 78526,
      'Dresser': 39488,
      'Bedside': 13992
    },
    features: ['Modern Dark Walnut', '4 Door Wardrobe', 'Full Hydraulic Lift'],
  },
  {
    id: 43,
    name: 'Riviera Grey Bedroom Set',
    image: '/bed-sets/alder/Riviera_Grey.jpg',
    tier: 'Luxury',
    color: 'Graphite Grey & White',
    tag: 'Premium',
    kingPrice: 96494,
    queenPrice: 96494,
    description: 'Riviera Grey Bedroom Set combines bold graphite grey with clean white for a striking modern statement. Features a sliding wardrobe and full hydraulic lift storage.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'slidingWardrobe': 'H 90 W 84 D 24 in / 2250 W 2100 D 600 mm',
      'dresser': 'H 78 W 33 D 16 in / 1950 W 825 D 400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 96494,
      'Sliding Wardrobe': 103112,
      'Dresser': 40719,
      'Bedside': 15876
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Sliding Wardrobe', 'Graphite Grey & White'],
  },
  {
    id: 44,
    name: 'Riviera Teak Bedroom Set',
    image: '/bed-sets/alder/Riviera_Teak.jpg',
    tier: 'Luxury',
    color: 'Teak & White',
    tag: 'Premium',
    kingPrice: 95668,
    queenPrice: 95668,
    description: 'Riviera Teak Bedroom Set brings warm teak tones with white for a nature-inspired luxury bedroom. Sliding wardrobe and full hydraulic lift make it as functional as it is beautiful.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'slidingWardrobe': 'H 90 W 84 D 24 in / 2250 W 2100 D 600 mm',
      'dresser': 'H 78 W 33 D 16 in / 1950 W 825 D 400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 95668,
      'Sliding Wardrobe': 103810,
      'Dresser': 40710,
      'Bedside': 15876
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Sliding Wardrobe', 'Warm Teak & White'],
  },
  {
    id: 45,
    name: 'Lexus Bedroom Set',
    image: '/bed-sets/alder/Lexus.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Bestseller',
    kingPrice: 95668,
    queenPrice: 95668,
    description: 'Lexus Bedroom Set channels premium automotive-inspired design into your bedroom. Dark walnut with 4-door wardrobe, full hydraulic lift and a sleek dresser.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 95668,
      '4 Door Wardrobe': 78163,
      'Dresser': 40710,
      'Bedside': 13637
    },
    features: ['Premium Dark Walnut', '4 Door Wardrobe', 'Full Hydraulic Lift'],
  },
  {
    id: 46,
    name: 'Orlov Bedroom Set',
    image: '/bed-sets/alder/Orlov.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut',
    tag: 'Premium',
    kingPrice: 93810,
    queenPrice: 93810,
    description: 'Orlov Bedroom Set is crafted for the discerning buyer with its premium dark walnut and 4-door wardrobe. Full hydraulic lift and matching dresser complete the luxury experience.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe4Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 93810,
      '4 Door Wardrobe': 81420,
      'Dresser': 39895,
      'Bedside': 11601
    },
    features: ['Premium Dark Walnut', '4 Door Wardrobe', 'Full Hydraulic Lift'],
  },
  {
    id: 47,
    name: 'Daisy Bedroom Set',
    image: '/bed-sets/alder/Daisy.jpg',
    tier: 'Lifestyle',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 85183,
    queenPrice: 85183,
    description: 'Daisy Bedroom Set blooms with subtle elegance in dark walnut. The 3-door wardrobe and matching dresser make this a practical and attractive bedroom choice.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe3Door': 'Included',
      'dresser': 'Included'
    },
    prices: {
      'King Bed': 85183,
      '3 Door Wardrobe': 71242,
      'Dresser': 36276,
      'Bedside': 11601
    },
    features: ['3 Door Wardrobe', 'Dark Walnut Finish', 'Full Hydraulic Lift'],
  },
  {
    id: 48,
    name: 'ES1 Bedroom Set',
    image: '/bed-sets/alder/ES1.jpg',
    tier: 'Value',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 52187,
    queenPrice: 52187,
    description: 'ES1 Bedroom Set offers great value in rich dark walnut. Includes a 2-door wardrobe and dresser at an accessible price point without compromising on quality.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe2Door': 'H 78 W 32 D 21 in / 1950 W 800 D 525 mm',
      'dresser': 'H 73 W 21 D 16 in / 1825 W 525 D 400 mm'
    },
    prices: {
      'King Bed': 52187,
      '2 Door Wardrobe': 32568,
      'Dresser': 12377,
      'Bedside': 6377
    },
    features: ['Manual Lift HT 400MM', 'King & Queen Available', 'Value Dark Walnut'],
  },
  {
    id: 49,
    name: 'ES2 Bedroom Set',
    image: '/bed-sets/alder/ES2_Hydraulic.jpg',
    tier: 'Value',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 54187,
    queenPrice: 54187,
    description: 'ES2 Bedroom Set steps up with full hydraulic lift storage and a 2-door wardrobe. Available in both manual and hydraulic lift variants for flexible budgeting.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'queenBed': '78x60 in / 1950x1500 mm',
      'wardrobe2Door': 'H 78 W 32 D 21 in / 1950 W 800 D 525 mm',
      'dresser': 'H 73 W 21 D 16 in / 1825 W 525 D 400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic)': 54187,
      'King Bed (Manual)': 54187,
      '2 Door Wardrobe': 32568,
      'Dresser': 12377,
      'Bedside': 6377
    },
    features: ['Manual & Hydraulic Lift Options', 'King & Queen Available', 'Value Dark Walnut'],
  },
  {
    id: 50,
    name: 'ES3 Bedroom Set',
    image: '/bed-sets/alder/ES3.jpg',
    tier: 'Value',
    color: 'Beige & Dark Walnut',
    tag: 'New',
    kingPrice: 61743,
    queenPrice: 61743,
    description: 'ES3 Bedroom Set introduces a soft beige headboard with dark walnut frame for a two-tone look. Full hydraulic lift and a 3-door wardrobe make this a complete value package.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe3Door': 'H 78 W 48 D 21 in / 1950 W 1200 D 525 mm',
      'dresser': 'H 73 W 36 D 16 in / 1825 W 900 D 400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 61743,
      '3 Door Wardrobe': 46907,
      'Dresser': 12377,
      'Bedside': 6377
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Beige & Walnut Design', 'King Size Available'],
  },
  {
    id: 51,
    name: 'ES4 Bedroom Set',
    image: '/bed-sets/alder/ES4.jpg',
    tier: 'Value',
    color: 'Dark Walnut',
    tag: 'New',
    kingPrice: 63987,
    queenPrice: 63987,
    description: 'ES4 Bedroom Set is the flagship of the ES value series with full hydraulic lift and a 3-door wardrobe. Dark walnut with premium feel at an affordable price.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe3Door': 'H 78 W 48 D 21 in / 1950 W 1200 D 525 mm',
      'dresser': 'Included'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 63987,
      '3 Door Wardrobe': 46907,
      'Dresser': 12377,
      'Bedside': 6377
    },
    features: ['Full Hydraulic Lift HT 400MM', 'Dark Walnut Finish', 'King Size Available'],
  },
  {
    id: 52,
    name: 'Delonix Bedroom Set',
    image: '/bed-sets/alder/Delonix.jpg',
    tier: 'Lifestyle',
    color: 'Dark Walnut with Tree Motif',
    tag: 'Bestseller',
    kingPrice: 83485,
    queenPrice: 83485,
    description: 'Delonix Bedroom Set showcases an iconic tree-of-life motif hand-carved into the headboard, wardrobe, and dresser. A unique artistic statement in rich dark walnut.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'wardrobe3Door': 'H 78 W 60 D 23 in / 1950 W 1500 D 575 mm',
      'dresser': 'H 78 W 36 D 16 in / 1950 W 900 D 400 mm',
      'bedside': 'W18 D16 D15 in / 450 H400 D400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 83485,
      '3 Door Wardrobe': 81821,
      'Dresser': 34196,
      'Bedside': 11643
    },
    features: ['Iconic Tree-of-Life Motif', 'Full Hydraulic Lift HT 300MM', 'King Size Available'],
  },
  {
    id: 53,
    name: 'Armour 1 Bedroom Set',
    image: '/bed-sets/alder/Armour1.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut with Leather Headboard',
    tag: 'Premium',
    kingPrice: 81420,
    queenPrice: 81420,
    description: 'Armour 1 Bedroom Set features a tufted leather headboard in dark walnut frame with lattice wardrobe design. Full hydraulic lift and matching dresser for a bold bedroom statement.',
    specs: {
      'kingBed': '78x72 in / 1950x1800 mm',
      'queenBed': '78x60 in / 1950x1500 mm',
      'wardrobe': 'HS W3D H 77 W 64 D 25 in / 1925 W 1600 D 625 mm',
      'dresser': 'DS 7 H 76 W 36 D 17 in / 1900 W 900 D 425 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 81420,
      'HS W3D Wardrobe': 72977,
      'Dresser': 33789,
      'Bedside': 11399
    },
    features: ['Tufted Leather Headboard', 'Full Hydraulic Lift HT 400MM', 'King & Queen Available'],
  },
  {
    id: 54,
    name: 'Armour 3 Bedroom Set',
    image: '/bed-sets/alder/Armour3.jpg',
    tier: 'Luxury',
    color: 'Dark Walnut with Cane Headboard',
    tag: 'Premium',
    kingPrice: 87954,
    queenPrice: 87954,
    description: 'Armour 3 Bedroom Set impresses with a luxurious cane-accented headboard and curved storage design. Features the HS W3D wardrobe system and full hydraulic lift.',
    specs: {
      'kingBed': 'King Size',
      'wardrobe': 'HS W3D H 77 W 64 D 25 in / 1925 W 1600 D 625 mm',
      'dresser': 'DS 12 H 75 W 32 D 16 in / 1875 W 800 D 400 mm'
    },
    prices: {
      'King Bed (Full Hydraulic Lift)': 87954,
      'HS W3D Wardrobe': 72977,
      'Dresser': 33789,
      'Bedside': 11399
    },
    features: ['Cane Accent Headboard', 'Full Hydraulic Lift HT 400MM', 'King Size Available'],
  },

];

const stableRatings = bedSetsData.map(b => ({
  id: b.id,
  rating: +(4.3 + ((b.id * 19 + 5) % 8) / 10).toFixed(1),
  count: 15 + ((b.id * 37 + 11) % 100),
}));

const tagColors = {
  'New':        { bg: '#1a1714', color: '#fff' },
  'Bestseller': { bg: '#c9a96e', color: '#fff' },
  'Premium':    { bg: '#2c3e50', color: '#fff' },
  'Sale':       { bg: '#c0392b', color: '#fff' },
};

const tierColors = {
  'Luxury':    { bg: '#2c3e50', color: '#c9a96e' },
  'Lifestyle': { bg: '#4a6b5c', color: '#fff' },
  'Value':     { bg: '#6b4c2a', color: '#fff' },
};

const sortOptions = [
  { label: 'Popularity',          value: 'popularity' },
  { label: 'Price — Low to High', value: 'price_asc'  },
  { label: 'Price — High to Low', value: 'price_desc' },
  { label: 'Newest First',        value: 'newest'     },
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
      <span style={{ color: '#6b6359', minWidth: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a1714', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function BedSetsPage({ onBack, selectedProductId }) {
  const [sortBy,       setSortBy]       = useState('popularity');
  const [filterTier,   setFilterTier]   = useState([]);
  const [filterTag,    setFilterTag]    = useState([]);
  const [priceMin,     setPriceMin]     = useState('');
  const [priceMax,     setPriceMax]     = useState('');
  const [selectedSet,  setSelectedSet]  = useState(null);
  const [zoomImg,      setZoomImg]      = useState(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [openSections, setOpenSections] = useState({ tier: true, tag: true, price: true });
  const [wishlist,     setWishlist]     = useState([]);

  const addToCart            = useCartStore(s => s.addItem);
  const toggleWishlistStore  = useWishlistStore(s => s.toggle);
  const showToast            = useToastStore(s => s.show);

  useEffect(() => {
    if (selectedProductId) {
      const found = bedSetsData.find(b => b.id == selectedProductId || String(b.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedSet(found), 120);
    }
  }, [selectedProductId]);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...bedSetsData];
    if (filterTier.length) items = items.filter(b => filterTier.includes(b.tier));
    if (filterTag.length)  items = items.filter(b => filterTag.includes(b.tag));
    if (priceMin)          items = items.filter(b => b.kingPrice >= parseInt(priceMin));
    if (priceMax)          items = items.filter(b => b.kingPrice <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a,b) => a.kingPrice - b.kingPrice);
      case 'price_desc': return items.sort((a,b) => b.kingPrice - a.kingPrice);
      case 'newest':     return items.sort((a,b) => b.id - a.id);
      default:           return items;
    }
  }, [filterTier, filterTag, priceMin, priceMax, sortBy]);

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: `bs_${item.id}`, name: item.name, price: item.kingPrice, image: item.image });
    showToast(wishlist.includes(item.id) ? `Removed from Wishlist` : `"${item.name}" added to Wishlist`,
      wishlist.includes(item.id) ? 'success' : 'wishlist');
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
      {openSections[sectionKey] && <div>{children}</div>}
    </div>
  ), [openSections]);

  return (
    <>
      {/* Mobile filter drawer */}
      {filterOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.45)' }} onClick={() => setFilterOpen(false)}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:280, background:'#fff', overflowY:'auto', padding:24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Filters</span>
              <button onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><X size={18}/></button>
            </div>
            {renderFilterSection("COLLECTION TIER", "tier", <>
              {['Luxury','Lifestyle','Value'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterTier.includes(t)} onChange={() => toggleArr(filterTier, setFilterTier, t)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}
            {renderFilterSection("CATEGORY", "tag", <>
              {['New','Bestseller','Premium'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}
            {renderFilterSection("PRICE RANGE (KING BED)", "price", <>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }} />
                <span style={{ color:'#aaa', flexShrink:0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }} />
              </div>
            </>)}
          </div>
        </div>
      )}

      <div style={{ minHeight:'100vh', background:'#faf9f7', paddingTop:110 }}>
        {/* Page Header */}
        <div style={{ background:'#f5f0e8', padding:'48px 40px 40px', position:'relative' }}>
          <button onClick={onBack} style={{
            display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer',
            color:'rgba(0,0,0,0.45)', fontFamily:"'Jost',sans-serif", fontSize:'0.72rem',
            fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:24, padding:0
          }}>
            <ArrowLeft size={15}/> Back
          </button>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:500, color:'#1a1714', margin:0, letterSpacing:'0.02em' }}>
            Bed Sets
          </h1>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.85rem', color:'rgba(0,0,0,0.5)', marginTop:10, maxWidth:520, lineHeight:1.6 }}>
            Complete bedroom sets by Spacewood — thoughtfully designed with bed, wardrobe, dresser & bedside for a harmonious bedroom experience.
          </p>
          <div style={{ display:'flex', gap:16, marginTop:20 }}>
            {['Luxury','Lifestyle','Value'].map(tier => {
              const tc = tierColors[tier];
              return (
                <span key={tier} style={{
                  padding:'4px 14px', fontSize:'0.68rem', fontFamily:"'Jost',sans-serif",
                  fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                  background: tc.bg, color: tc.color, borderRadius:2
                }}>{tier}</span>
              );
            })}
          </div>
        </div>

        <div className="bp-layout" style={{ maxWidth:1400, margin:'0 auto', padding:'32px 24px', display:'flex', gap:32, alignItems:'flex-start' }}>
          {/* Sidebar filters */}
          <aside className="bp-aside" style={{ width:220, flexShrink:0, position:'sticky', top:120 }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1a1714', marginBottom:20, paddingBottom:12, borderBottom:'2px solid #1a1714' }}>
              Filter
            </div>

            {renderFilterSection("COLLECTION TIER", "tier", <>
              {['Luxury','Lifestyle','Value'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterTier.includes(t)} onChange={() => toggleArr(filterTier, setFilterTier, t)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}

            {renderFilterSection("CATEGORY", "tag", <>
              {['New','Bestseller','Premium'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}

            {renderFilterSection("PRICE RANGE (KING BED)", "price", <>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }} />
                <span style={{ color:'#aaa', flexShrink:0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }} />
              </div>
            </>)}

            {(filterTier.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterTier([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="bp-main" style={{ flex:1, minWidth:0 }}>
            {/* Toolbar */}
            <div className="bp-toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.74rem', fontWeight:600,
                    letterSpacing:'0.08em', textTransform:'uppercase', color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="bp-count" style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#6b6359' }}>
                  <strong style={{ color:'#1a1714' }}>{filtered.length}</strong> sets
                </span>
              </div>
              <div className="bp-sort" style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span className="bp-sort-label" style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', color:'#6b6359', letterSpacing:'0.08em', textTransform:'uppercase', marginRight:4 }}>Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value}
                    onClick={() => setSortBy(o.value)}
                    style={{
                      fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.08em',
                      textTransform:'uppercase', padding:'6px 12px', cursor:'pointer', border:'1px solid',
                      borderColor: sortBy === o.value ? '#1a1714' : 'rgba(0,0,0,0.15)',
                      background: sortBy === o.value ? '#1a1714' : 'transparent',
                      color: sortBy === o.value ? '#fff' : '#6b6359',
                      transition:'all 0.15s'
                    }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="bp-list" style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {filtered.map(item => {
                const tc  = tagColors[item.tag] || tagColors['New'];
                const trc = tierColors[item.tier];
                const inWl = wishlist.includes(item.id);
                return (
                  <div key={item.id} className="bp-row" onClick={() => setSelectedSet(item)}
                    style={{
                      display:'flex', gap:0, background:'#fff', cursor:'pointer',
                      border:'1px solid rgba(0,0,0,0.08)', transition:'box-shadow 0.2s',
                      boxShadow:'0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'}>

                    {/* Image */}
                    <div className="bp-row-img-wrap" style={{ width:240, flexShrink:0, position:'relative', overflow:'hidden' }}>
                      <img className="bp-row-img" src={item.image} alt={item.name} loading="lazy"
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', cursor:'zoom-in', transition:'transform 0.4s ease', minHeight:200 }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }}
                        onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                      <span style={{
                        position:'absolute', top:12, left:12, padding:'3px 10px',
                        fontSize:'0.65rem', fontFamily:"'Jost',sans-serif", fontWeight:700,
                        letterSpacing:'0.10em', textTransform:'uppercase',
                        background: tc.bg, color: tc.color
                      }}>{item.tag}</span>
                      <span style={{
                        position:'absolute', top:12, right:12, padding:'3px 10px',
                        fontSize:'0.62rem', fontFamily:"'Jost',sans-serif", fontWeight:700,
                        letterSpacing:'0.10em', textTransform:'uppercase',
                        background: trc.bg, color: trc.color
                      }}>{item.tier}</span>
                      <button onClick={e => handleWishlist(item, e)} style={{
                        position:'absolute', bottom:12, right:12,
                        width:32, height:32, borderRadius:'50%',
                        background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color: inWl ? '#c0392b' : '#1a1714'
                      }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="bp-row-body" style={{ flex:1, padding:'24px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:'0.68rem', fontFamily:"'Jost',sans-serif", color:'#c9a96e', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:6 }}>
                          {item.color}
                        </div>
                        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600, color:'#1a1714', margin:'0 0 6px 0' }}>
                          {item.name}
                        </h3>
                        <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === item.id)?.count ?? 42} />
                        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.83rem', color:'#6b6359', lineHeight:1.6, margin:'0 0 12px 0' }}>
                          {item.description.slice(0, 180)}...
                        </p>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                          {item.features.map(f => (
                            <span key={f} style={{
                              fontSize:'0.68rem', fontFamily:"'Jost',sans-serif", color:'#6b6359',
                              background:'rgba(0,0,0,0.04)', padding:'3px 10px', borderRadius:2
                            }}>· {f}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop:16 }}>
                        <div style={{ display:'flex', alignItems:'baseline', gap:12, flexWrap:'wrap' }}>
                          <div>
                            <span style={{ fontSize:'0.65rem', fontFamily:"'Jost',sans-serif", color:'#8a8278', letterSpacing:'0.08em', textTransform:'uppercase' }}>King Bed from</span>
                            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'#1a1714' }}>
                              ₹{item.kingPrice.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div style={{ borderLeft:'1px solid rgba(0,0,0,0.12)', paddingLeft:12 }}>
                            <span style={{ fontSize:'0.65rem', fontFamily:"'Jost',sans-serif", color:'#8a8278', letterSpacing:'0.08em', textTransform:'uppercase' }}>Queen Bed from</span>
                            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'1.1rem', fontWeight:600, color:'#4a4035' }}>
                              ₹{item.queenPrice.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop:10, fontSize:'0.7rem', fontFamily:"'Jost',sans-serif", color:'#8a8278' }}>
                          Click to view all pieces & prices
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359', fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No bed sets match your current filters.<br />
                  <button onClick={() => { setFilterTier([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop:12, background:'none', border:'none', color:'#c9a96e', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', textDecoration:'underline' }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Detail slide-in panel */}
      {selectedSet && (() => {
        const item = selectedSet;
        const tc  = tagColors[item.tag] || tagColors['New'];
        const trc = tierColors[item.tier];
        const inWl = wishlist.includes(item.id);
        return (
          <div className="bp-detail-overlay" onClick={() => setSelectedSet(null)}
            style={{ position:'fixed', inset:0, zIndex:900, background:'rgba(0,0,0,0.55)', display:'flex', justifyContent:'flex-end' }}>
            <div className="bp-detail-panel" onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth:480, background:'#fff', height:'100%',
                overflowY:'auto', position:'relative', boxShadow:'-8px 0 32px rgba(0,0,0,0.15)'
              }}>
              <button onClick={() => setSelectedSet(null)}
                style={{
                  position:'sticky', top:0, right:0, float:'right',
                  width:40, height:40, border:'none', background:'#1a1714', color:'#fff',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10
                }}>
                <X size={16}/>
              </button>

              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img src={item.image} alt={item.name}
                  style={{ width:'100%', height:280, objectFit:'cover', display:'block' }} />
                <div style={{
                  position:'absolute', top:12, left:12, padding:'3px 12px',
                  fontSize:'0.65rem', fontFamily:"'Jost',sans-serif", fontWeight:700,
                  letterSpacing:'0.10em', textTransform:'uppercase',
                  background: trc.bg, color: trc.color
                }}>{item.tier}</div>
                <span style={{
                  position:'absolute', top:12, right:12, padding:'3px 10px',
                  fontSize:'0.65rem', fontFamily:"'Jost',sans-serif", fontWeight:700,
                  letterSpacing:'0.10em', textTransform:'uppercase',
                  background: tc.bg, color: tc.color
                }}>{item.tag}</span>
                <div style={{
                  position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.45)', color:'#fff',
                  borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>

              <div style={{ padding:'24px 28px' }}>
                <div style={{ fontSize:'0.68rem', fontFamily:"'Jost',sans-serif", color:'#c9a96e', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:6 }}>
                  {item.color}
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.8rem', fontWeight:600, color:'#1a1714', margin:'0 0 8px 0' }}>
                  {item.name}
                </h2>
                <StarRating rating={4.7} count={87} />

                {/* Prices table */}
                <div style={{ background:'#faf9f7', border:'1px solid rgba(0,0,0,0.08)', padding:16, marginBottom:20, marginTop:8 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1a1714', marginBottom:12 }}>
                    Pricing (MRP)
                  </div>
                  {Object.entries(item.prices).map(([piece, price]) => (
                    <div key={piece} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(0,0,0,0.05)', fontFamily:"'Jost',sans-serif" }}>
                      <span style={{ fontSize:'0.8rem', color:'#6b6359' }}>{piece}</span>
                      <span style={{ fontSize:'0.88rem', fontWeight:700, color:'#1a1714' }}>₹{price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.85rem', color:'#6b6359', lineHeight:1.7, marginBottom:20 }}>
                  {item.description}
                </p>

                {/* Features */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1a1714', marginBottom:10 }}>
                    Key Features
                  </div>
                  {item.features.map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', fontFamily:"'Jost',sans-serif", fontSize:'0.82rem', color:'#3d3830' }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#c9a96e', flexShrink:0 }} />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Specifications */}
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1a1714', marginBottom:10 }}>
                    Specifications
                  </div>
                  {item.specs.kingBed     && <SpecRow label="King Bed"            value={item.specs.kingBed} />}
                  {item.specs.queenBed    && <SpecRow label="Queen Bed"           value={item.specs.queenBed} />}
                  {item.specs.wardrobe    && <SpecRow label="Wardrobe"            value={item.specs.wardrobe} />}
                  {item.specs.wardrobe3Door && <SpecRow label="3 Door Wardrobe"   value={item.specs.wardrobe3Door} />}
                  {item.specs.wardrobe4Door && <SpecRow label="4 Door Wardrobe"   value={item.specs.wardrobe4Door} />}
                  {item.specs.wardrobe2Door && <SpecRow label="2 Door Wardrobe"   value={item.specs.wardrobe2Door} />}
                  {item.specs.slidingWardrobe && <SpecRow label="Sliding Wardrobe" value={item.specs.slidingWardrobe} />}
                  {item.specs.dresser     && <SpecRow label="Dresser"             value={item.specs.dresser} />}
                  {item.specs.dresserStool && <SpecRow label="Dresser Stool"      value={item.specs.dresserStool} />}
                  {item.specs.bedside     && <SpecRow label="Bedside"             value={item.specs.bedside} />}
                  {item.specs.kingBedFront && <SpecRow label="King (Front Pull Out)" value={item.specs.kingBedFront} />}
                  {item.specs.queenBedFront && <SpecRow label="Queen (Front Pull Out)" value={item.specs.queenBedFront} />}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={e => handleWishlist(item, e)} style={{
                    flex:1, padding:'14px 18px', border:'1px solid',
                    borderColor: inWl ? '#c0392b' : 'rgba(0,0,0,0.15)',
                    background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                    fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600,
                    letterSpacing:'0.10em', textTransform:'uppercase',
                    color: inWl ? '#c0392b' : '#1a1714'
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