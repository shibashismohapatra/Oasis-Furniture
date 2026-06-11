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
            Kitchen Data
───────────────────────────────────────────── */
const kitchenData = [
  {
    id: 1,
    name: '4-Door Wall Mounted Kitchen Cabinet',
    image: '/modular-kitchen/4-doors-modular-wall-mounted-kitchen-cabinet.jpg',
    type: 'Wall Cabinet',
    shape: 'Straight',
    tag: 'New',
    price: 8500,
    originalPrice: 11000,
    brand: 'SpecialityPanels',
    specs: {
      assembly: 'Self-Arranged Installation',
      colour: 'Maroon',
      dimensions: 'L 173 x B 32 x H 55 cm',
      material: 'Engineered Wood',
      shelves: '4',
      warranty: "12 Months' Warranty",
      weight: '28 kg',
      sku: 'KD2227567-S-PM40514',
    },
    description: 'Maximize your kitchen storage with the 4-Door Wall Mounted Kitchen Cabinet. Crafted from durable Engineered Wood with a rich Maroon finish, this sleek wall-mounted unit features four spacious doors that keep your kitchen essentials organized and neatly tucked away. Its compact depth of 32 cm ensures it fits perfectly even in smaller kitchens without compromising on storage capacity. With self-arranged installation and a lightweight build, this cabinet is a practical and stylish addition to any modern modular kitchen setup.',
  },
  {
    id: 2,
    name: '6-Door Wall Mounted Kitchen',
    image: '/modular-kitchen/6-doors-modular-wall-mounted-kitchen.jpg',
    type: 'Wall Cabinet',
    shape: 'Straight',
    tag: 'Bestseller',
    price: 12500,
    originalPrice: 16000,
    brand: 'SpecialityPanels',
    specs: {
      assembly: 'Self-Arranged Installation',
      colour: 'Maroon',
      dimensions: 'L 173 x B 32 x H 55 cm',
      material: 'Engineered Wood',
      shelves: '5 or more',
      warranty: "12 Months' Warranty",
      weight: '45 kg',
      sku: 'KD2227589-S-PM40514',
    },
    description: 'Upgrade your kitchen storage with the 6-Door Wall Mounted Kitchen unit. Made from high-quality Engineered Wood with a vibrant Maroon finish, this wall-mounted storage solution offers six spacious compartments to keep your kitchen clutter-free and organized. Designed with five or more interior shelves, it provides generous storage for utensils, spices, and other kitchen essentials. Its slim profile and self-arranged installation make it a smart and stylish choice for modern kitchens looking to maximize overhead space efficiently.',
  },
  {
    id: 3,
    name: '6-Door Wall Mounted Kitchen Cabinet',
    image: '/modular-kitchen/6-doors-modular-wall-mounted-kitchen-cabinet.jpg',
    type: 'Wall Cabinet',
    shape: 'Straight',
    tag: 'New',
    price: 11500,
    originalPrice: 14500,
    brand: 'SpecialityPanels',
    specs: {
      assembly: 'Self-Arranged Installation',
      colour: 'Grey',
      dimensions: 'L 173 x B 32 x H 55 cm',
      material: 'Engineered Wood',
      shelves: '5 or more',
      warranty: "12 Months' Warranty",
      weight: '45 kg',
      sku: 'KD2227583-S-PM40514',
    },
    description: 'Transform your kitchen with the elegant 6-Door Wall Mounted Kitchen Cabinet in a sophisticated Grey finish. Crafted from premium Engineered Wood, this wall-mounted unit offers six door compartments with five or more interior shelves for abundant storage space. Its neutral grey tone blends seamlessly with any modern kitchen interior, adding a clean and contemporary look. Designed for self-arranged installation, it is easy to set up and perfect for homeowners looking to enhance their kitchen organization without hassle.',
  },
  {
    id: 4,
    name: 'Beau Straight Modular Kitchen',
    image: '/modular-kitchen/beau-straight-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'Straight',
    tag: 'Premium',
    price: 145000,
    originalPrice: 180000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'Exterior Grade MDF',
      shutterColour: 'American Walnut',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749311-S-PM21084',
    },
    description: 'The Beau Straight Modular Kitchen is a stunning blend of form and function. Featuring a rich American Walnut shutter colour with a premium Laminate Matt finish, this straight-layout kitchen exudes warmth and elegance. Built with Exterior Grade MDF and Smart hardware, every element is designed for durability and ease of use. Professional carpenter assembly ensures a precise and seamless installation. Whether you are designing a new home or upgrading your existing kitchen, the Beau is an outstanding choice backed by a 60-month warranty.',
  },
  {
    id: 5,
    name: 'Celia Straight Modular Kitchen',
    image: '/modular-kitchen/celia-straight-modular-kitchen.jpg',
    type: 'Full Kitchen',
    shape: 'Straight',
    tag: 'New',
    price: 135000,
    originalPrice: 168000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'Exterior Grade MDF',
      shutterColour: 'Orange',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749312-S-PM21084',
    },
    description: 'Make a bold statement with the Celia Straight Modular Kitchen, featuring a vibrant Orange shutter colour and a smooth Laminate Matt finish. Crafted from Exterior Grade MDF with Premium hardware, the Celia is built to last and designed to impress. Its straight layout is ideal for compact and medium-sized kitchens, offering a practical and stylish cooking space. With professional carpenter assembly and a generous 60-month warranty, the Celia brings colour, character, and confidence to your home.',
  },
  {
    id: 6,
    name: 'Daniel L-Shaped Modular Kitchen',
    image: '/modular-kitchen/daniel-l-shaped-modular-kitchen.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Bestseller',
    price: 185000,
    originalPrice: 230000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterFinish: 'Acrylic',
      warranty: "60 Months' Warranty",
      sku: 'MK1759136-S-PM25706',
    },
    description: 'The Daniel L-Shaped Modular Kitchen is a bestselling design loved for its smart use of corner space and high-gloss appeal. Made from superior BWR Ply and finished with a lustrous Acrylic shutter, this L-shaped kitchen exudes a premium and modern aesthetic. The Smart hardware ensures smooth drawer and cabinet operation for everyday convenience. Professional carpenter assembly guarantees a flawless fit, and the 60-month warranty reflects the quality and confidence behind every Daniel kitchen.',
  },
  {
    id: 7,
    name: 'Edward L-Shaped Modular Kitchen',
    image: '/modular-kitchen/edward-l-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Premium',
    price: 195000,
    originalPrice: 245000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'Exterior Grade MDF',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1759137-S-PM21084',
    },
    description: 'Designed for the modern home, the Edward L-Shaped Modular Kitchen offers a perfect balance of sophistication and practicality. Constructed from Exterior Grade MDF and finished with a refined Laminate Matt surface, the Edward features an L-shaped layout that maximizes workflow and storage. Smart hardware throughout ensures smooth and reliable performance. Installed by professional carpenters and protected by a 60-month warranty, the Edward is an investment in quality, style, and lasting comfort.',
  },
  {
    id: 8,
    name: 'Frank Straight Modular Kitchen',
    image: '/modular-kitchen/frank-straight-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'Straight',
    tag: 'New',
    price: 162000,
    originalPrice: 200000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterColour: 'Ivory Forest',
      shutterFinish: 'Laminate High Gloss',
      warranty: "60 Months' Warranty",
      sku: 'MK1759138-S-PM21550',
    },
    description: 'The Frank Straight Modular Kitchen brings a fresh and luminous look to your cooking space with its Ivory Forest shutter colour and Laminate High Gloss finish. Built on a solid BWR Ply base with Smart hardware, this straight kitchen combines structural strength with visual elegance. Its sleek high-gloss surface is easy to maintain and adds a bright, airy feel to any kitchen interior. Professionally assembled and backed by a 60-month warranty, the Frank is the perfect blend of practicality and style.',
  },
  {
    id: 9,
    name: 'Gail L-Shaped Modular Kitchen',
    image: '/modular-kitchen/gail-l-shaped-modular-kitchen.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Bestseller',
    price: 175000,
    originalPrice: 218000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterColour: 'Canary',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749318-S-PM21550',
    },
    description: 'Bring warmth and energy into your kitchen with the Gail L-Shaped Modular Kitchen, featuring a cheerful Canary shutter colour and a smooth Laminate Matt finish. Constructed from premium BWR Ply with Smart hardware, the Gail offers excellent durability and smooth functionality throughout. Its L-shaped layout optimizes corner space and creates an efficient cooking workflow. Professionally installed with a 60-month warranty, the Gail is a bestselling kitchen choice that combines vibrant colour with lasting quality.',
  },
  {
    id: 10,
    name: 'Gail L-Shaped Modular Kitchen (Designed)',
    image: '/modular-kitchen/gail-l-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Premium',
    price: 192000,
    originalPrice: 240000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterColour: 'Canary',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749318-S-PM21551',
    },
    description: 'The premium designed edition of the Gail L-Shaped Modular Kitchen elevates the original concept with a finely curated interior arrangement. Featuring the same beautiful Canary shutter colour with Laminate Matt finish and built on durable BWR Ply, this version is enhanced with Smart hardware and a thoughtfully planned layout for maximum kitchen efficiency. From storage to workflow, every detail is crafted to make your daily cooking experience more organized and enjoyable, backed by a 60-month warranty.',
  },
  {
    id: 11,
    name: 'Gordon Straight Modular Kitchen',
    image: '/modular-kitchen/gordon-straight-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'Straight',
    tag: 'New',
    price: 148000,
    originalPrice: 185000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'Engineered Wood',
      shutterColour: 'Saffron',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1756222-S-PM21550',
    },
    description: 'Add a bold and earthy warmth to your home with the Gordon Straight Modular Kitchen, designed with a rich Saffron shutter colour and a smooth Laminate Matt finish. Built using premium Engineered Wood with Smart hardware, the Gordon is crafted to deliver lasting performance and aesthetic appeal. Its straight layout is ideal for linear kitchen spaces, ensuring practical storage and a clean, organized cooking environment. With professional carpenter assembly and a 60-month warranty, the Gordon is a standout kitchen choice.',
  },
  {
    id: 12,
    name: 'Jean L-Shaped Modular Kitchen',
    image: '/modular-kitchen/jean-l-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Premium',
    price: 215000,
    originalPrice: 268000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'Exterior Grade MDF',
      shutterColour: 'Black',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749320-S-PM21084',
    },
    description: 'Make a striking impression with the Jean L-Shaped Modular Kitchen, featuring a sophisticated Black shutter colour and a premium Laminate Matt finish. Crafted from Exterior Grade MDF with Premium hardware, this kitchen offers superior durability and an unmistakably sleek aesthetic. The L-shaped design maximizes workspace and storage, making it perfect for those who love to cook and entertain. Professional carpenter installation ensures a flawless result, and the 60-month warranty provides long-term peace of mind.',
  },
  {
    id: 13,
    name: 'Kelsey U-Shaped Modular Kitchen',
    image: '/modular-kitchen/kelsey-u-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'Premium',
    price: 265000,
    originalPrice: 330000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'BWR Ply',
      shutterColour: 'Shangrilla',
      shutterFinish: 'Laminate High Gloss',
      warranty: "60 Months' Warranty",
      sku: 'MK1756224-S-PM21550',
    },
    description: 'The Kelsey U-Shaped Modular Kitchen is designed for those who demand space, style, and efficiency in equal measure. Featuring the unique Shangrilla shutter colour with a stunning Laminate High Gloss finish, Kelsey offers an abundance of counter space and storage across its three-wall U-shaped layout. Built from premium BWR Ply with Premium hardware, every element is crafted for long-term performance. Professional carpenter assembly and a 60-month warranty complete this exceptional modular kitchen offering.',
  },
  {
    id: 14,
    name: 'Kevin L-Shaped Modular Kitchen',
    image: '/modular-kitchen/kevin-l-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'L-Shaped',
    tag: 'Bestseller',
    price: 245000,
    originalPrice: 305000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'BWR Ply',
      shutterFinish: 'Laminate High Gloss',
      warranty: "60 Months' Warranty",
      sku: 'MK1759140-S-PM29391',
    },
    description: 'The Kevin L-Shaped Modular Kitchen combines practicality with a polished high-gloss elegance that elevates any kitchen interior. Built from robust BWR Ply with Premium hardware, this L-shaped kitchen offers excellent storage efficiency and a smooth cooking workflow. The Laminate High Gloss finish adds a bright, mirror-like sheen that makes the space feel larger and more luxurious. With professional carpenter assembly and a 60-month warranty, the Kevin is a trusted bestseller that delivers on both form and function.',
  },
  {
    id: 15,
    name: 'Laura Parallel Modular Kitchen',
    image: '/modular-kitchen/laura-parallel-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'Parallel',
    tag: 'New',
    price: 195000,
    originalPrice: 243000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterColour: 'Coffee',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: '',
    },
    description: 'The Laura Parallel Modular Kitchen is a thoughtfully designed kitchen that maximizes every inch of available space with its dual-wall layout. Featuring a warm Coffee shutter colour and a smooth Laminate Matt finish, it creates a cozy and inviting cooking environment. Built from premium BWR Ply with Smart hardware, the Laura ensures durability and reliable performance in every detail. Professionally assembled by skilled carpenters and supported by a 60-month warranty, it is a perfect kitchen for modern homes.',
  },
  {
    id: 16,
    name: 'Paula Parallel Modular Kitchen',
    image: '/modular-kitchen/paula-parallel-modular-kitchen-designe.jpg',
    type: 'Full Kitchen',
    shape: 'Parallel',
    tag: 'Premium',
    price: 285000,
    originalPrice: 355000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'BWR Ply',
      shutterColour: 'Cappuccino',
      shutterFinish: 'Acrylic',
      warranty: "60 Months' Warranty",
      sku: 'MK1749326-S-PM21550',
    },
    description: 'Indulge in culinary luxury with the Paula Parallel Modular Kitchen, featuring a rich Cappuccino shutter colour and a glossy Acrylic finish that speaks of premium craftsmanship. The parallel layout provides two working surfaces on opposite walls, offering maximum counter space and efficient kitchen workflow. Crafted from durable BWR Ply with Premium hardware, every component of the Paula is built to last. Professional carpenter installation and a 60-month warranty make the Paula a premium kitchen investment.',
  },
  {
    id: 17,
    name: 'Rachael U-Shaped Modular Kitchen',
    image: '/modular-kitchen/rachael-u-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'New',
    price: 275000,
    originalPrice: 343000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Smart',
      material: 'BWR Ply',
      shutterColour: 'Olive',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749328-S-PM21550',
    },
    description: 'Bring nature indoors with the Rachael U-Shaped Modular Kitchen, featuring a calming Olive shutter colour and a sophisticated Laminate Matt finish. Its U-shaped design offers abundant storage and counter space across three walls, making it an ideal choice for avid home cooks. Built from quality BWR Ply with Smart hardware, the Rachael is designed for durability and everyday practicality. Professional installation and a 60-month warranty ensure your kitchen remains beautiful and functional for years to come.',
  },
  {
    id: 18,
    name: 'Saiphin U-Shaped Modular Kitchen',
    image: '/modular-kitchen/saiphin-u-shaped-modualr-kitchen.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'Bestseller',
    price: 310000,
    originalPrice: 385000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'BWR Ply',
      shutterColour: 'Orange',
      shutterFinish: 'Foil Membrane',
      warranty: "60 Months' Warranty",
      sku: 'MK1749329-S-PM21550',
    },
    description: 'The Saiphin U-Shaped Modular Kitchen is a bestseller that stands out with its bold Orange shutter colour and a premium Foil Membrane finish that is both visually striking and highly durable. Its U-shaped layout envelops the cook with accessible storage and ample workspace on three sides. Crafted from BWR Ply with Premium hardware, every cabinet, drawer, and shelf is built for long-lasting, smooth performance. With professional carpenter assembly and a 60-month warranty, the Saiphin is a kitchen that truly delivers.',
  },
  {
    id: 19,
    name: 'Saiphin U-Shaped Modular Kitchen (Designed)',
    image: '/modular-kitchen/saiphin-u-shaped-modualr-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'Premium',
    price: 335000,
    originalPrice: 418000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'BWR Ply',
      shutterColour: 'Orange',
      shutterFinish: 'Foil Membrane',
      warranty: "60 Months' Warranty",
      sku: 'MK1749329-S-PM21550',
    },
    description: 'The designed edition of the Saiphin U-Shaped Modular Kitchen takes the original to the next level with an enhanced interior layout and thoughtfully planned storage solutions. Featuring the same vibrant Orange shutter colour with a durable Foil Membrane finish and built on premium BWR Ply, this version is optimized for functionality and aesthetics. Premium hardware ensures buttery-smooth operation throughout. Professionally assembled and backed by a 60-month warranty, the Saiphin Designed is the ultimate kitchen experience.',
  },
  {
    id: 20,
    name: 'Thierry U-Shaped Modular Kitchen',
    image: '/modular-kitchen/thierry-u-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'Premium',
    price: 295000,
    originalPrice: 368000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'Engineered Wood',
      shutterFinish: 'Foil Membrane',
      warranty: "60 Months' Warranty",
      sku: 'MK1749330-S-PM21550',
    },
    description: 'The Thierry U-Shaped Modular Kitchen is an embodiment of premium quality and modern kitchen design. Constructed from Engineered Wood with Premium hardware, this kitchen features a rich Foil Membrane finish that adds a timeless, textured elegance to any home. The spacious U-shaped layout is designed to maximize kitchen efficiency with generous storage on all three walls. Thierry is professionally assembled and backed by a 60-month warranty, making it a wise and stylish investment for discerning homeowners.',
  },
  {
    id: 21,
    name: 'Wendy U-Shaped Modular Kitchen',
    image: '/modular-kitchen/wendy-u-shaped-modular-kitchen-designed.jpg',
    type: 'Full Kitchen',
    shape: 'U-Shaped',
    tag: 'Premium',
    price: 345000,
    originalPrice: 430000,
    brand: 'Mangiamo',
    specs: {
      assembly: 'Carpenter Assembly',
      hardware: 'Premium',
      material: 'Exterior Grade MDF',
      shutterFinish: 'Laminate Matt',
      warranty: "60 Months' Warranty",
      sku: 'MK1749332-S-PM21084',
    },
    description: 'The Wendy U-Shaped Modular Kitchen is a masterpiece of premium craftsmanship, designed to transform your kitchen into a sophisticated culinary haven. Built with Exterior Grade MDF and Premium hardware, it features a seamless Laminate Matt finish that exudes quiet luxury and is easy to maintain. The generous U-shaped layout provides exceptional workspace and storage, perfect for families and those who love to cook. Professional carpenter assembly and a 60-month warranty ensure that the Wendy stands the test of time.',
  },
];

/* ─────────────────────────────────────────────
            Stable ratings seeded by id
───────────────────────────────────────────── */
const stableRatings = kitchenData.map(k => ({
  id: k.id,
  rating: +(4.4 + ((k.id * 17 + 3) % 7) / 10).toFixed(1),
  count: 20 + ((k.id * 31 + 7) % 120),
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
      <span style={{ color: '#6b6359', minWidth: 130, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a1714', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
            Main Page Component
───────────────────────────────────────────── */
export default function ModularKitchenPage({ onBack }) {
  const [sortBy, setSortBy]               = useState('popularity');
  const [filterShape, setFilterShape]     = useState([]);
  const [filterType, setFilterType]       = useState([]);
  const [filterTag, setFilterTag]         = useState([]);
  const [priceMin, setPriceMin]           = useState('');
  const [priceMax, setPriceMax]           = useState('');
  const [selectedItem, setSelectedItem]   = useState(null);
  const [zoomImg, setZoomImg]             = useState(null);
  const [filterOpen, setFilterOpen]       = useState(false);
  const [openSections, setOpenSections]   = useState({ shape: true, type: true, tag: true, price: true });
  const [wishlist, setWishlist]           = useState([]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...kitchenData];
    if (filterShape.length) items = items.filter(k => filterShape.includes(k.shape));
    if (filterType.length)  items = items.filter(k => filterType.includes(k.type));
    if (filterTag.length)   items = items.filter(k => filterTag.includes(k.tag));
    if (priceMin)           items = items.filter(k => k.price >= parseInt(priceMin));
    if (priceMax)           items = items.filter(k => k.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterShape, filterType, filterTag, priceMin, priceMax, sortBy]);

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

  return (
    <>
      <style>{`
        .mkp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .mkp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .mkp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .mkp-back:hover { color:#1a1714; }
        .mkp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .mkp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .mkp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .mkp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .mkp-main { padding:24px 32px 60px; }
        .mkp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .mkp-count { font-size:0.78rem;color:#6b6359; }
        .mkp-count strong { color:#1a1714;font-weight:600; }
        .mkp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .mkp-sort::-webkit-scrollbar { display:none; }
        .mkp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .mkp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .mkp-sort-btn.active,.mkp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        .mkp-list { display:flex;flex-direction:column;gap:16px; }
        .mkp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .mkp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .mkp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .mkp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .mkp-row:hover .mkp-row-img { transform:scale(1.04); }
        .mkp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .mkp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .mkp-row-wish:hover { color:#c0392b; }
        .mkp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .mkp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .mkp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .mkp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }

        .mkp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .mkp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:mkpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes mkpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .mkp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8; }
        .mkp-detail-body { padding:28px 32px 48px; }
        .mkp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .mkp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 10px; }
        .mkp-detail-brand { font-size:0.78rem;color:#6b6359;margin:0 0 14px;letter-spacing:0.05em; }
        .mkp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .mkp-detail-specs { margin-bottom:24px; }
        .mkp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .mkp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .mkp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .mkp-detail-close:hover { background:#fff; }
        .mkp-mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .mkp-layout { grid-template-columns:1fr; }
          .mkp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            overflow-y:auto;padding:20px; }
          .mkp-sidebar.open { display:block!important; }
          .mkp-mob-filter-btn { display:flex!important; }
          .mkp-hero { padding:24px 16px 20px; }
          .mkp-main { padding:16px 16px 60px; }
          .mkp-row-img-wrap { width:140px; }
          .mkp-row-img { height:160px; }
          .mkp-row-name { font-size:1.1rem; }
          .mkp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .mkp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .mkp-row { flex-direction:column; }
          .mkp-row-img-wrap { width:100%; }
          .mkp-row-img { height:200px; }
          .mkp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="mkp-root">
        {/* Hero */}
        <div className="mkp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="mkp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="mkp-heading">Modular Kitchen</h1>
            <p className="mkp-sub">Thoughtfully designed modular kitchens — crafted for the modern Indian home. Showing {filtered.length} of {kitchenData.length} products.</p>
          </div>
        </div>

        <div className="mkp-layout">
          {/* Sidebar filters */}
          <aside className={`mkp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mkp-mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background:'none',border:'none',cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("KITCHEN SHAPE", "shape", <>
              {['Straight', 'L-Shaped', 'U-Shaped', 'Parallel'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterShape.includes(s)} onChange={() => toggleArr(filterShape, setFilterShape, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {s}
                </label>
              ))}
            </>)}

            {renderFilterSection("KITCHEN TYPE", "type", <>
              {['Full Kitchen', 'Wall Cabinet'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterType.includes(t)} onChange={() => toggleArr(filterType, setFilterType, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
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

            {(filterShape.length > 0 || filterType.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterShape([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="mkp-main">
            {/* Toolbar */}
            <div className="mkp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mkp-mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.74rem',fontWeight:600,
                    letterSpacing:'0.08em',textTransform:'uppercase',color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="mkp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="mkp-sort">
                <span className="mkp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`mkp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="mkp-list">
              {filtered.map(item => {
                const tc = tagColors[item.tag] || tagColors['New'];
                const inWl = wishlist.includes(item.id);
                const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
                return (
                  <div key={item.id} className="mkp-row" onClick={() => setSelectedItem(item)}>
                    <div className="mkp-row-img-wrap">
                      <img className="mkp-row-img" src={item.image} alt={item.name} loading="lazy"
                        style={{ cursor:'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                      <span className="mkp-row-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                      <button className="mkp-row-wish" onClick={e => handleWishlist(item, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="mkp-row-body">
                      <div>
                        <h3 className="mkp-row-name">{item.name}</h3>
                        <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === item.id)?.count ?? 42} />
                        <p className="mkp-row-desc">{item.description}</p>
                        <div>
                          {item.shape && <span className="mkp-spec-chip">· {item.shape}</span>}
                          {item.type && <span className="mkp-spec-chip">· {item.type}</span>}
                          {item.specs.material && <span className="mkp-spec-chip">· {item.specs.material}</span>}
                          {item.specs.shutterFinish && <span className="mkp-spec-chip">· {item.specs.shutterFinish}</span>}
                          {item.specs.warranty && <span className="mkp-spec-chip">· {item.specs.warranty}</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginTop:12 }}>
                          <span style={{ fontSize:'1.4rem', fontWeight:700, color:'#1a1714', fontFamily:"'Jost',sans-serif" }}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice && (
                            <span style={{ fontSize:'0.85rem', color:'#aaa', textDecoration:'line-through', fontFamily:"'Jost',sans-serif" }}>
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {disc > 0 && (
                            <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#2ecc71', fontFamily:"'Jost',sans-serif" }}>
                              {disc}% off
                            </span>
                          )}
                        </div>
                        <button
                          onClick={e => handleAddToCart(item, e)}
                          style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:12,
                            padding:'10px 22px', background:'#1a1714', color:'#fff', border:'none', cursor:'pointer',
                            fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.12em',
                            textTransform:'uppercase', transition:'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background='#c9a96e'}
                          onMouseLeave={e => e.currentTarget.style.background='#1a1714'}>
                          <ShoppingBag size={14}/> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No kitchens match your current filters. <br />
                  <button onClick={() => { setFilterShape([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
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
        return (
          <div className="mkp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="mkp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="mkp-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="mkp-detail-img" src={item.image} alt={item.name} />
                <div style={{
                  position:'absolute', bottom:10, right:10,
                  background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%',
                  width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="mkp-detail-body">
                <span className="mkp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                <h2 className="mkp-detail-name">{item.name}</h2>
                <p className="mkp-detail-brand">Brand: {item.brand} &nbsp;·&nbsp; {item.shape} Layout</p>
                <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.7} count={stableRatings.find(r => r.id === item.id)?.count ?? 87} />
                <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:16 }}>
                  <span style={{ fontSize:'1.75rem', fontWeight:700, color:'#1a1714', fontFamily:"'Jost',sans-serif" }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span style={{ fontSize:'1rem', color:'#aaa', textDecoration:'line-through', fontFamily:"'Jost',sans-serif" }}>
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {item.originalPrice && item.price < item.originalPrice && (
                    <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#2ecc71', fontFamily:"'Jost',sans-serif" }}>
                      {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                    </span>
                  )}
                </div>
                <p className="mkp-detail-desc">{item.description}</p>
                <div className="mkp-detail-specs">
                  <p className="mkp-detail-specs-title">Specifications</p>
                  <SpecRow label="Kitchen Shape"   value={item.shape} />
                  <SpecRow label="Kitchen Type"    value={item.type} />
                  <SpecRow label="Brand"           value={item.brand} />
                  <SpecRow label="Assembly"        value={item.specs.assembly} />
                  <SpecRow label="Hardware"        value={item.specs.hardware} />
                  <SpecRow label="Primary Material" value={item.specs.material} />
                  <SpecRow label="Shutter Colour"  value={item.specs.shutterColour} />
                  <SpecRow label="Shutter Finish"  value={item.specs.shutterFinish} />
                  <SpecRow label="Colour"          value={item.specs.colour} />
                  <SpecRow label="Dimensions"      value={item.specs.dimensions} />
                  <SpecRow label="Shelves"         value={item.specs.shelves} />
                  <SpecRow label="Weight"          value={item.specs.weight} />
                  <SpecRow label="Warranty"        value={item.specs.warranty} />
                  <SpecRow label="SKU"             value={item.specs.sku} />
                </div>
                <div className="mkp-detail-actions">
                  <button onClick={e => { handleAddToCart(item, e); setSelectedItem(null); }} style={{
                    flex: 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    padding:'14px', background:'#1a1714', color:'#fff', border:'none', cursor:'pointer',
                    fontFamily:"'Jost',sans-serif", fontSize:'0.75rem', fontWeight:600,
                    letterSpacing:'0.12em', textTransform:'uppercase', minWidth:180, transition:'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.background='#1a1714'}>
                    <ShoppingBag size={15}/> Add to Cart
                  </button>
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