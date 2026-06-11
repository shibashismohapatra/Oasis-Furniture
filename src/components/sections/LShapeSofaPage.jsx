import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

/* ─────────────────────────────────────────────
            L Shape Sofa Data
───────────────────────────────────────────── */
const lShapeSofasData = [
  {
    id: 101,
    name: 'Taigun Sofa',
    image: '/lshape-sofas/Taigun Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 38000, originalPrice: 48000,
    specs: { material: 'Fabric', color: 'Beige' },
    description: 'Discover the peak of elegance with our Taigun Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 102,
    name: 'Flamingos L Shape Sofa',
    image: '/lshape-sofas/Flamingos L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'New',
    price: 42000, originalPrice: 52000,
    specs: { material: 'Fabric', color: 'Multi', length: '113 inch', width: '84 inch', height: '37 inch' },
    description: 'Discover the peak of elegance with our Flamingos L Shape. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  
  {
    id: 103,
    name: 'Harley L Shape & Divider Sofa',
    image: '/lshape-sofas/Harley L Shape & Divider Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape + Divider',
    tag: 'Premium',
    price: 78000, originalPrice: 95000,
    specs: { material: 'Fabric', color: 'Grey', length: '112 inch', width: '88 inch', height: '37 inch' },
    description: 'Discover the peak of elegance with our Harley L Shape & Divider Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 104,
    name: 'Reno L Shape Sofa',
    image: '/lshape-sofas/Reno L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 55000, originalPrice: 68000,
    specs: { material: 'Fabric', color: 'Brown', length: '115 inch', width: '93 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Reno L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 105,
    name: 'Norton L Shape Sofa',
    image: '/lshape-sofas/Norton L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'New',
    price: 45000, originalPrice: 56000,
    specs: { material: 'Fabric', color: 'Beige', length: '102 inch', width: '72 inch', height: '34 inch' },
    description: 'Discover the peak of elegance with our Norton L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 106,
    name: 'Lexus L Shape Sofa',
    image: '/lshape-sofas/Lexus L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Premium',
    price: 72000, originalPrice: 88000,
    specs: { material: 'Fabric', color: 'Dark Grey', length: '116 inch', width: '94 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Lexus L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 107,
    name: 'Odion L Shape Sofa',
    image: '/lshape-sofas/Odion L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'New',
    price: 48000, originalPrice: 60000,
    specs: { material: 'Fabric', color: 'Cream', length: '123 inch', width: '84 inch', height: '35 inch' },
    description: 'Discover the peak of elegance with our Odion L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 108,
    name: 'Jaguar L Shape Sofa',
    image: '/lshape-sofas/Jaguar L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 62000, originalPrice: 76000,
    specs: { material: 'Fabric', color: 'Brown', length: '119 inch', width: '97 inch', height: '35 inch' },
    description: 'Discover the peak of elegance with our Jaguar L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 109,
    name: 'Caffino L Shape Sofa',
    image: '/lshape-sofas/Caffino L Shape.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Premium',
    price: 68000, originalPrice: 84000,
    specs: { material: 'Fabric', color: 'Brown', length: '115 inch', width: '93 inch', height: '35 inch' },
    description: 'Discover the peak of elegance with our Caffino L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 110,
    name: 'Audi L Shape Sofa',
    image: '/lshape-sofas/Audi L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 95000, originalPrice: 118000,
    specs: { material: 'Fabric', color: 'Grey', length: '120 inch', width: '110 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Audi L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 111,
    name: 'Mahal L Shape Sofa',
    image: '/lshape-sofas/Mahal L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Premium',
    price: 88000, originalPrice: 110000,
    specs: { material: 'Fabric', color: 'Beige', length: '122 inch', width: '110 inch', height: '35 inch' },
    description: 'Discover the peak of elegance with our Mahal L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 112,
    name: 'Coral L Shape Sofa',
    image: '/lshape-sofas/Coral L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'New',
    price: 52000, originalPrice: 64000,
    specs: { material: 'Fabric', color: 'Coral', length: '120 inch', width: '96 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Coral L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 113,
    name: 'Picaso L Shape Sofa',
    image: '/lshape-sofas/Picaso L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 58000, originalPrice: 72000,
    specs: { material: 'Fabric', color: 'Grey', length: '110 inch', width: '84 inch', height: '35 inch' },
    description: 'Discover the peak of elegance with our Picaso L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 114,
    name: 'Apollo L Shape Sofa',
    image: '/lshape-sofas/Apollo L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Premium',
    price: 82000, originalPrice: 100000,
    specs: { material: 'Fabric', color: 'Brown', length: '114 inch', width: '92 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Apollo L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 115,
    name: 'Nexa L Shape Sofa',
    image: '/lshape-sofas/Nexa L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'New',
    price: 46000, originalPrice: 58000,
    specs: { material: 'Fabric', color: 'Grey', length: '115 inch', width: '93 inch', height: '36 inch' },
    description: 'Discover the peak of elegance with our Nexa L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 116,
    name: 'Cappuccino L Shape Sofa',
    image: '/lshape-sofas/Cappuccino L Shape Sofa.jpg',
    type: 'Fabric',
    config: 'L Shape',
    tag: 'Bestseller',
    price: 44000, originalPrice: 54000,
    specs: { material: 'Fabric', color: 'Cappuccino' },
    description: 'Discover the peak of elegance with our Cappuccino L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum your fabric furniture at a low pressure using a soft-bristled brush attachment. Wipe the wooden surface with a clean microfiber cloth damped in wood-friendly cleansers. In case of a spill, immediately blot the stain with a clean, dry cloth. Ensure that the furniture does not have any exposure to moisture and water. Protect the furniture from direct sunlight and heat. Keep away from sharp objects. Avoid chemical and alcohol contact. Get your furniture cleaned professionally every 5–6 months.',
  },
  {
    id: 117,
    name: 'Dona Velvet LHS Sectional Sofa (3 + Lounger) — Dusky Rose',
    image: '/lshape-sofas/Dona Velvet Lhs Sectional Sofa (3 + Lounger) In Dusky Rose Colour.jpg',
    type: 'Velvet',
    config: '3 Seater + Lounger',
    tag: 'Premium',
    price: 92000, originalPrice: 115000,
    specs: {
      material: 'Velvet',
      color: 'Dusky Rose',
      length: 'Sofa: H 84 x W 183 x D 86 cm',
      width: 'Lounger: H 84 x W 74 x D 152 cm',
      netWt: '70 KG',
    },
    description: 'Frame: Sal Wood. Upholstery: 100% Premium Velvet, 450 GSM, 40,000+ Martindale Rubs. Seating Mechanism: Elastic Webbing. Foam: 32 Density Duroflex PU Foam. Legs: Metal. Firmness: Medium. No. of cushions: 2. Warranty: 36 Months.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid placing burning candles or irons on furniture.',
  },
  {
    id: 118,
    name: 'Petra Sheesham Wood LHS Sectional Sofa — Beige',
    image: '/lshape-sofas/Petra Sheesham Wood LHS Sectional Sofa In Beige Colour.jpg',
    type: 'Wood',
    config: 'LHS Sectional',
    tag: 'Premium',
    price: 110000, originalPrice: 138000,
    specs: {
      material: 'Sheesham Wood',
      color: 'Beige',
      length: 'H 81 x W 244 x D 142 cm',
      netWt: '55 KG',
    },
    description: 'Brand: Woodsworth from Pepperfry. Primary Material: Sheesham Wood. Carpenter Assembly. Seating Height: 16 inch. Warranty: 60 Months. Key Features: Resistant to water, fungus, termites, and scratches. Fitted with premium-grade hardware and fittings.',
    care: 'Avoid or limit direct exposure to sunlight as it can cause fading and loss of shine. Vacuum regularly with a soft brush nozzle. Do not leave spills unattended. Do not use bleach or abrasive cleaners. Fluff cushions regularly. Check legs are fitted tightly on a regular basis. Do not jump or sit on the arms.',
  },
  {
    id: 119,
    name: 'Haiden Leatherette LHS Sectional Sofa (2+ Lounger) — Cream',
    image: '/lshape-sofas/Haiden Leatherette LHS Sectional Sofa (2+ Lounger) in Cream Colour.jpg',
    type: 'Leatherette',
    config: '2 Seater + Lounger',
    tag: 'Premium',
    price: 98000, originalPrice: 122000,
    specs: {
      material: 'Leatherette (100% PVC)',
      color: 'Cream',
      length: 'Sofa: H 71 x W 155 x D 89 cm',
      width: 'Lounger: H 71 x W 89 x D 183 cm',
      netWt: '95 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood + Heavy Grade Plywood. Upholstery: Premium Leatherette (Lab Tested — 100% PVC). Legs: Premium Stainless Steel in Glossy Finish with Nylon Bush. Foam: 32 Density Heavy Grade PU Foam, Medium Softness. Suspension: Elastic Webbing. Headrest Mechanism: Tested for 10,000+ Cycles. Warranty: As per brand terms.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 120,
    name: 'Haiden Leatherette LHS Sectional Sofa (2+ Lounger) — Grey',
    image: '/lshape-sofas/Haiden Leatherette LHS Sectional Sofa (2+ Lounger) in Grey Colour.jpg',
    type: 'Leatherette',
    config: '2 Seater + Lounger',
    tag: 'New',
    price: 96000, originalPrice: 120000,
    specs: {
      material: 'Leatherette (100% PVC)',
      color: 'Grey',
      length: 'H 71 x W 244 x D 89 cm',
      netWt: '95 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood + Heavy Grade Plywood. Upholstery: Premium Leatherette (Lab Tested — 100% PVC). Legs: Premium Stainless Steel in Glossy Finish with Nylon Bush. Foam: 32 Density Heavy Grade PU Foam, Medium Softness. Suspension: Elastic Webbing. Headrest Mechanism: Tested for 10,000+ Cycles. Seating Height: 17 inch.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 121,
    name: 'Laura Velvet LHS Sectional Sofa — Teal Blue',
    image: '/lshape-sofas/Laura Velvet LHS Sectional Sofa in Teal Blue Colour.jpg',
    type: 'Velvet',
    config: 'LHS Sectional',
    tag: 'New',
    price: 75000, originalPrice: 92000,
    specs: {
      material: 'Velvet Fabric (100% Polyester, 300 GSM)',
      color: 'Teal Blue',
      length: 'H 84 x W 259 x D 79 cm',
      netWt: '78 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood + Heavy Grade Plywood. Upholstery: Premium Velvet Fabric (Lab Tested — 100% Polyester, 300 GSM, Martindale Count 40,000+ Rubs). Legs: Steem Beach Solid Wood with Dark Brown Finish. Foam: 32 Density Heavy Grade PU Foam, Medium Softness. Suspension: Elastic Webbing. Seating Height: 17 inch.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 122,
    name: 'Yardley Chenille LHS Sectional Sofa (2 + Lounger) — Beige',
    image: '/lshape-sofas/Yardley Chenille Fabric LHS Sectional Sofa (2 + Lounger) in Beige Color.jpg',
    type: 'Fabric',
    config: '2 Seater + Lounger',
    tag: 'Bestseller',
    price: 68000, originalPrice: 84000,
    specs: {
      material: 'Chenille Fabric (400 GSM, 50,000+ Rubs)',
      color: 'Beige',
      length: 'H 86 x W 202 x D 142 cm',
      netWt: '70 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood. Upholstery: Premium Chenille Fabric, 400 GSM, 50,000+ Martindale Rubs. Leg Material: Metal. Seating Mechanism: Elastic Webbing. Foam Density: PU Foam 32D (Medium Firm). Seating Height: 18 inch.',
    care: 'Frequent cleaning with a clean buff cloth removes dirt. Lightly spritz your cleaning cloth with water before dusting. Use a vacuum cleaner to remove dust from crevices. Always use a coaster for drinks. Avoid sharp objects, direct sunlight, and heavy impacts.',
  },
  {
    id: 123,
    name: 'Montez Velvet LHS Sectional Sofa (3 + Lounger) — Grey & Beige',
    image: '/lshape-sofas/Montez Velvet LHS Sectional Sofa (3 + Lounger) in Grey & Beige Colour.jpg',
    type: 'Velvet',
    config: '3 Seater + Lounger',
    tag: 'Premium',
    price: 105000, originalPrice: 130000,
    specs: {
      material: 'Velvet Fabric + Leatherette Arm Rest',
      color: 'Grey & Beige',
      length: 'Sofa: H 86 x W 198 x D 84 cm',
      width: 'Lounger: H 86 x W 81 x D 152 cm',
      netWt: '90 KG',
    },
    description: 'Frame Material: Solid Sal Wood. Upholstery: 100% Premium Velvet Fabric with Leatherette Arm Rest & Under Seat. Leg: Stainless Steel Metal Legs. Suspension System: Elastic Belt Webbing. Foam: Duroflex 32 Density Foam. Seating Height: 16 inch.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 124,
    name: 'Yardley Velvet LHS Sectional Sofa (3 + Lounger) — Wine Red',
    image: '/lshape-sofas/Yardley Velvet Fabric LHS Sectional Sofa (3 + Lounger) in Wine Red Color.jpg',
    type: 'Velvet',
    config: '3 Seater + Lounger',
    tag: 'New',
    price: 78000, originalPrice: 96000,
    specs: {
      material: 'Velvet Fabric (400 GSM, 50,000+ Rubs)',
      color: 'Wine Red',
      length: 'H 81 x W 267 x D 152 cm',
      netWt: '85 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood. Upholstery: Premium Velvet Fabric, 400 GSM, 50,000+ Martindale Rubs. Leg Material: Metal. Seating Mechanism: Elastic Webbing. Foam Density: PU Foam 32D (Medium Firm). Product Rating: 5.0. Seating Height: 18 inch.',
    care: 'Dust regularly with a dry soft cloth. Do not leave spills unattended. Avoid using abrasive cleaners. Use a vacuum cleaner to remove dust from crevices. Always use a coaster for drinks. Avoid sharp objects, direct sunlight, and heavy impacts.',
  },
  {
    id: 125,
    name: 'Santiago Fabric LHS Sectional Sofa (2 + Lounger) — Chestnut Brown',
    image: '/lshape-sofas/Santiago Fabric LHS Sectional Sofa (2 + Lounger) In Chestnut Brown Colour.jpg',
    type: 'Fabric',
    config: '2 Seater + Lounger',
    tag: 'Bestseller',
    price: 56000, originalPrice: 70000,
    specs: {
      material: 'Polyester Fabric',
      color: 'Chestnut Brown',
      length: 'H 84 x W 201 x D 165 cm',
      netWt: '38 KG',
    },
    description: 'Frame: Pine Wood / 9 & 18mm Ply. Upholstery: Polyester Fabric. Seat Foam: 32 & 26D. Seat: Elastic Belt 70mm. Legs: White Ash Wood with Walnut Polish. Throw Cushions: 3 nos. Seating Height: 18 inch.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 126,
    name: 'Andres Fabric LHS Sectional Sofa (3 + Lounger) — Denim Blue',
    image: '/lshape-sofas/Andres Fabric LHS Sectional Sofa (3 + Lounger) In Denim Blue Colour.jpg',
    type: 'Fabric',
    config: '3 Seater + Lounger',
    tag: 'New',
    price: 72000, originalPrice: 88000,
    specs: {
      material: 'Polyester Fabric',
      color: 'Denim Blue',
      length: 'H 89 x W 175 x D 89 cm',
      netWt: '73 KG',
    },
    description: 'Brand: Woodsworth from Pepperfry. Frame: Pine Wood & Plywood. Upholstery: Fabric, 290 GSM. Seating Mechanism: S Spring + Pocket Spring. Foam: PU Foam 28, 25, 24 & 20 Density. Legs: Wooden Legs — Pine Wood. Firmness: Soft. Seating Height: 18 inch.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 127,
    name: 'Marina LHS Sectional Sofa (2+ Lounger) — Teal Blue',
    image: '/lshape-sofas/Marina LHS Sectional Sofa (2+ Lounger) With Adjustable Headrestss In Teal Blue Colour.jpg',
    type: 'Velvet',
    config: '2 Seater + Lounger',
    tag: 'Premium',
    specs: {
      material: 'Velvet Fabric',
      color: 'Teal Blue',
      length: 'H 69 x W 244 x D 86 cm',
      netWt: '78 KG',
    },
    description: 'Brand: Woodsworth from Pepperfry. Primary Material: Velvet Fabric. Adjustable Headrests. Seating Height: 17 inch. Sofa Firmness: Medium. Bed when open: H 17 x W 73 x D 58 inch. Storage: H 9 x W 24 x D 65 inch. Product Rating: 5.0.',
    care: 'Do not keep warm or cold items directly on furniture; use coasters. Avoid direct sunlight to prevent fading. Clean gently with a soft lightly damp cloth. In case of spill, blot — do not wipe. Protect from moisture. Avoid sharp objects and chemical contact.',
  },
  {
    id: 128,
    name: 'Yardley Chenille LHS Sectional Sofa (3 + Lounger) — Beige',
    image: '/lshape-sofas/Yardley Chenille Fabric LHS Sectional Sofa (3 + Lounger) in Beige Color.jpg',
    type: 'Fabric',
    config: '3 Seater + Lounger',
    tag: 'Bestseller',
    specs: {
      material: 'Chenille Fabric (400 GSM, 50,000+ Rubs)',
      color: 'Beige',
      length: 'Sofa: H 86 x W 246 x D 79 cm',
      width: 'Lounger: H 86 x W 76 x D 142 cm',
      netWt: '85 KG',
    },
    description: 'Frame Material: Red Meranti Solid Wood. Upholstery: Premium Chenille Fabric, 400 GSM, 50,000+ Martindale Rubs. Leg Material: Metal. Seating Mechanism: Elastic Webbing. Foam Density: PU Foam 32D (Medium Firm). Seating Height: 18 inch.',
    care: 'Frequent cleaning with a clean buff cloth removes dirt. Lightly spritz your cleaning cloth with water before dusting. Use a vacuum cleaner to remove dust from crevices. Always use a coaster for drinks. Avoid sharp objects, direct sunlight, and heavy impacts.',
  },
  {
    id: 129,
    name: 'Garcia Sylo Fabric LHS Sectional Sofa (3+ Lounger) — Dark Brown',
    image: '/lshape-sofas/Garcia Sylo Fabric LHS Sectional Sofa ( 3+ Lounger) In Dark Brown Colour.jpg',
    type: 'Fabric',
    config: '3 Seater + Lounger',
    tag: 'Premium',
    specs: {
      material: 'Fabric',
      color: 'Dark Brown',
      length: 'H 91 x W 277 x D 211 cm',
      netWt: '38 KG',
    },
    description: 'This fabric sofa brings contemporary elegance and everyday comfort to your living space. Its clean, boxy silhouette and expertly tailored button-tufted cushions blend modern aesthetics with supportive seating. Firm upright seating, thick armrests and a sleek wooden panel along the length create a refined, distinctive impression perfect for lounging, entertaining or quiet relaxation. Seating Height: 18 inch.',
    care: 'Dust regularly with a dry soft cloth. Do not leave spills unattended. Avoid using abrasive cleaners. Use a vacuum cleaner to remove dust from crevices. Always use a coaster for drinks. Avoid sharp objects, direct sunlight, and heavy impacts.',
  },
];

/* ─────────────────────────────────────────────
            Tag Colours (same as SofaSetsPage)
───────────────────────────────────────────── */
const tagColors = {
  Bestseller: { bg: '#c9a96e', color: '#fff' },
  New:        { bg: '#1a1714', color: '#fff' },
  Premium:    { bg: '#4a7c59', color: '#fff' },
  Sale:       { bg: '#c0392b', color: '#fff' },
};

const sortOptions = [
  { label: 'Default',     value: 'default' },
  { label: 'Price: Low',  value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
];

/* ─────────────────────────────────────────────
            Star Rating
───────────────────────────────────────────── */
function StarRating({ rating, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:6 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11}
          fill={i <= Math.round(rating) ? '#c9a96e' : 'none'}
          stroke={i <= Math.round(rating) ? '#c9a96e' : '#ccc'}
        />
      ))}
      <span style={{ fontSize:'0.7rem', color:'#6b6359', marginLeft:2 }}>({count})</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
            Spec Row
───────────────────────────────────────────── */
function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0',
      borderBottom:'1px solid rgba(0,0,0,0.06)', fontSize:'0.78rem' }}>
      <span style={{ color:'#6b6359', fontWeight:500 }}>{label}</span>
      <span style={{ color:'#1a1714', textAlign:'right', maxWidth:'55%' }}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
            Stable Ratings Seed
───────────────────────────────────────────── */
function useStableRatings(data) {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = data.map(s => ({
      id: s.id,
      rating: parseFloat((3.8 + Math.abs(Math.sin(s.id * 13.7)) * 1.2).toFixed(1)),
      count:  Math.floor(20 + Math.abs(Math.sin(s.id * 7.3)) * 180),
    }));
  }
  return ref.current;
}

/* ─────────────────────────────────────────────
            Main Component
───────────────────────────────────────────── */
export default function LShapeSofaPage({ onBack, selectedProductId }) {
  const toggleWishlistStore = useWishlistStore(s => s.toggleItem);
  const wishlistItems       = useWishlistStore(s => s.items);
  const showToast           = useToastStore(s => s.showToast);

  const stableRatings = useStableRatings(lShapeSofasData);

  const [sortBy,        setSortBy]        = useState('default');
  const [filterType,    setFilterType]    = useState([]);
  const [filterConfig,  setFilterConfig]  = useState([]);
  const [filterTag,     setFilterTag]     = useState([]);
  const [priceMin,      setPriceMin]      = useState('');
  const [priceMax,      setPriceMax]      = useState('');
  const [selectedSofa,  setSelectedSofa]  = useState(null);
  const [zoomImg,       setZoomImg]       = useState(null);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [openSections,  setOpenSections]  = useState({ type: true, config: true, tag: true, price: false });

  // Open selected product on mount if ID passed
  useEffect(() => {
    if (selectedProductId) {
      const found = lShapeSofasData.find(s => s.id === selectedProductId);
      if (found) setSelectedSofa(found);
    }
  }, [selectedProductId]);

  const toggleSection = useCallback(key => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const types   = useMemo(() => [...new Set(lShapeSofasData.map(s => s.type).filter(Boolean))], []);
  const configs = useMemo(() => [...new Set(lShapeSofasData.map(s => s.config).filter(Boolean))], []);
  const tags    = useMemo(() => [...new Set(lShapeSofasData.map(s => s.tag).filter(Boolean))], []);

  const filtered = useMemo(() => {
    let arr = [...lShapeSofasData];
    if (filterType.length)   arr = arr.filter(s => filterType.includes(s.type));
    if (filterConfig.length) arr = arr.filter(s => filterConfig.includes(s.config));
    if (filterTag.length)    arr = arr.filter(s => filterTag.includes(s.tag));
    if (priceMin) arr = arr.filter(s => (s.price || 0) >= Number(priceMin));
    if (priceMax) arr = arr.filter(s => (s.price || 0) <= Number(priceMax));
    if (sortBy === 'price-asc')  arr.sort((a,b) => (a.price||0) - (b.price||0));
    if (sortBy === 'price-desc') arr.sort((a,b) => (b.price||0) - (a.price||0));
    return arr;
  }, [sortBy, filterType, filterConfig, filterTag, priceMin, priceMax]);

  const isWishlisted = useCallback((id) => wishlistItems.some(i => i.id === id), [wishlistItems]);

  const handleWishlist = useCallback((sofa, e) => {
    e.stopPropagation();
    const result = toggleWishlistStore({ id: sofa.id, name: sofa.name, price: sofa.price, image: sofa.image });
    showToast(result === 'removed' ? 'Removed from wishlist' : `${sofa.name} added to wishlist`, result === 'removed' ? 'info' : 'success');
  }, [toggleWishlistStore, showToast]);

  const safeImg = (path) => {
    if (!path) return path;
    const parts = path.split('/');
    return parts.map((p, i) => i === 0 ? p : encodeURIComponent(p)).join('/');
  };

  const toggleFilter = useCallback((arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  }, []);

  const FilterSection = useCallback(({ title, sectionKey, children }) => (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => toggleSection(sectionKey)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'none', border:'none', cursor:'pointer', fontFamily:"'Jost',sans-serif",
        fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
        color:'#1a1714', padding:'0 0 10px 0'
      }}>
        {title}
        {openSections[sectionKey] ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
      </button>
      {openSections[sectionKey] && children}
    </div>
  ), [openSections, toggleSection]);

  return (
    <>
      <style>{`
        .sp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .sp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .sp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .sp-back:hover { color:#1a1714; }
        .sp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .sp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .sp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .sp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .sp-main { padding:24px 32px 60px; }
        .sp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .sp-count { font-size:0.78rem;color:#6b6359; }
        .sp-count strong { color:#1a1714;font-weight:600; }
        .sp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .sp-sort::-webkit-scrollbar { display:none; }
        .sp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .sp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .sp-sort-btn.active,.sp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        .sp-list { display:flex;flex-direction:column;gap:16px; }
        .sp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .sp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .sp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .sp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .sp-row:hover .sp-row-img { transform:scale(1.04); }
        .sp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .sp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .sp-row-wish:hover { color:#c0392b; }
        .sp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .sp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .sp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .sp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .sp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }

        .sp-chip { display:inline-flex;align-items:center;gap:6px;font-family:'Jost',sans-serif;
          font-size:0.74rem;font-weight:500;color:#1a1714;background:none;
          border:1px solid rgba(0,0,0,0.12);padding:5px 10px;margin:3px 4px 3px 0;
          cursor:pointer;transition:all 0.18s; }
        .sp-chip.active { border-color:#c9a96e;color:#c9a96e;background:#fdf8ef; }
        .sp-chip:hover { border-color:#c9a96e; }
        .sp-filter-title { font-size:0.7rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 8px; }

        .sp-detail-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:800;
          display:flex;justify-content:flex-end; }
        .sp-detail-panel { width:min(520px,95vw);background:#fff;height:100%;overflow-y:auto;
          position:relative;animation:spSlideIn 0.32s cubic-bezier(.22,1,.36,1); }
        @keyframes spSlideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
        .sp-detail-close { position:absolute;top:14px;right:14px;background:none;border:none;
          cursor:pointer;color:#1a1714;z-index:2; }
        .sp-detail-img { width:100%;height:320px;object-fit:cover;display:block; }
        .sp-detail-body { padding:24px; }
        .sp-detail-tag { font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 9px;display:inline-block;margin-bottom:10px; }
        .sp-detail-name { font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;
          color:#1a1714;margin:0 0 6px;line-height:1.2; }
        .sp-detail-desc { font-size:0.82rem;color:#5a534a;line-height:1.6;margin:12px 0 16px; }
        .sp-detail-specs { background:#faf8f5;padding:16px;margin-bottom:16px; }
        .sp-detail-specs-title { font-size:0.7rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .sp-detail-actions { display:flex;gap:10px;flex-wrap:wrap; }
        .sp-care { background:#f0ece4;padding:14px 16px;margin-top:14px; }
        .sp-care-title { font-size:0.65rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 8px; }
        .sp-care-text { font-size:0.78rem;color:#5a534a;line-height:1.6; }

        .mob-filter-btn { display:none; }
        .sp-mob-filter-overlay { display:none; }

        @media (max-width: 768px) {
          .sp-hero { padding:24px 20px 20px; }
          .sp-heading { font-size:1.9rem; }
          .sp-layout { grid-template-columns:1fr; }
          .sp-sidebar { display:none; }
          .sp-main { padding:16px 16px 40px; }
          .mob-filter-btn { display:flex !important; }
          .sp-row-img-wrap { width:140px; }
          .sp-row-img { height:160px; }
          .sp-row-name { font-size:1.1rem; }
          .sp-mob-filter-overlay { display:block;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:700; }
          .sp-mob-sidebar { position:fixed;left:0;top:0;bottom:0;width:min(300px,85vw);
            background:#fff;z-index:800;overflow-y:auto;padding:24px 20px;
            animation:spSlideIn2 0.3s ease; }
          @keyframes spSlideIn2 { from { transform:translateX(-100%); } to { transform:translateX(0); } }
        }
      `}</style>

      <div className="sp-root">
        {/* Hero */}
        <div className="sp-hero">
          <button className="sp-back" onClick={onBack}><ArrowLeft size={14}/> Back</button>
          <h1 className="sp-heading">L Shape Sofas</h1>
          <p className="sp-sub">Discover our complete collection of premium L Shape sofas — fabric, velvet, leatherette, wood & more</p>
        </div>

        {/* Mobile filter overlay */}
        {filterOpen && (
          <>
            <div className="sp-mob-filter-overlay" onClick={() => setFilterOpen(false)} />
            <div className="sp-mob-sidebar">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <span style={{ fontWeight:700, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Filters</span>
                <button onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18}/></button>
              </div>
              <FilterSection title="Material Type" sectionKey="type">
                {types.map(t => (
                  <button key={t} className={`sp-chip${filterType.includes(t) ? ' active' : ''}`}
                    onClick={() => toggleFilter(filterType, setFilterType, t)}>{t}</button>
                ))}
              </FilterSection>
              <FilterSection title="Configuration" sectionKey="config">
                {configs.map(c => (
                  <button key={c} className={`sp-chip${filterConfig.includes(c) ? ' active' : ''}`}
                    onClick={() => toggleFilter(filterConfig, setFilterConfig, c)}>{c}</button>
                ))}
              </FilterSection>
              <FilterSection title="Tag" sectionKey="tag">
                {tags.map(t => (
                  <button key={t} className={`sp-chip${filterTag.includes(t) ? ' active' : ''}`}
                    onClick={() => toggleFilter(filterTag, setFilterTag, t)}>{t}</button>
                ))}
              </FilterSection>
              <FilterSection title="Price Range" sectionKey="price">
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <input type="number" placeholder="Min ₹" value={priceMin}
                    onChange={e => setPriceMin(e.target.value)}
                    style={{ width:'100%', border:'1px solid rgba(0,0,0,0.14)', padding:'6px 8px',
                      fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none', color:'#1a1714' }} />
                  <input type="number" placeholder="Max ₹" value={priceMax}
                    onChange={e => setPriceMax(e.target.value)}
                    style={{ width:'100%', border:'1px solid rgba(0,0,0,0.14)', padding:'6px 8px',
                      fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none', color:'#1a1714' }} />
                </div>
              </FilterSection>
              {(filterType.length + filterConfig.length + filterTag.length > 0 || priceMin || priceMax) && (
                <button onClick={() => { setFilterType([]); setFilterConfig([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                  style={{ marginTop:8, background:'none', border:'none', color:'#c9a96e', cursor:'pointer',
                    fontWeight:600, fontSize:'0.82rem', textDecoration:'underline' }}>
                  Clear all filters
                </button>
              )}
            </div>
          </>
        )}

        <div className="sp-layout">
          {/* Desktop sidebar */}
          <aside className="sp-sidebar">
            <FilterSection title="Material Type" sectionKey="type">
              {types.map(t => (
                <button key={t} className={`sp-chip${filterType.includes(t) ? ' active' : ''}`}
                  onClick={() => toggleFilter(filterType, setFilterType, t)}>{t}</button>
              ))}
            </FilterSection>
            <FilterSection title="Configuration" sectionKey="config">
              {configs.map(c => (
                <button key={c} className={`sp-chip${filterConfig.includes(c) ? ' active' : ''}`}
                  onClick={() => toggleFilter(filterConfig, setFilterConfig, c)}>{c}</button>
              ))}
            </FilterSection>
            <FilterSection title="Tag" sectionKey="tag">
              {tags.map(t => (
                <button key={t} className={`sp-chip${filterTag.includes(t) ? ' active' : ''}`}
                  onClick={() => toggleFilter(filterTag, setFilterTag, t)}>{t}</button>
              ))}
            </FilterSection>
            <FilterSection title="Price Range" sectionKey="price">
              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                <input type="number" placeholder="Min ₹" value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  style={{ width:'100%', border:'1px solid rgba(0,0,0,0.14)', padding:'6px 8px',
                    fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none', color:'#1a1714' }} />
                <input type="number" placeholder="Max ₹" value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  style={{ width:'100%', border:'1px solid rgba(0,0,0,0.14)', padding:'6px 8px',
                    fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none', color:'#1a1714' }} />
              </div>
            </FilterSection>
            {(filterType.length + filterConfig.length + filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterType([]); setFilterConfig([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ marginTop:4, background:'none', border:'none', color:'#c9a96e', cursor:'pointer',
                  fontWeight:600, fontSize:'0.82rem', textDecoration:'underline' }}>
                Clear all
              </button>
            )}
          </aside>

          <main className="sp-main">
            {/* Toolbar */}
            <div className="sp-toolbar">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.74rem', fontWeight:600,
                    letterSpacing:'0.08em', textTransform:'uppercase', color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="sp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="sp-sort">
                <span className="sp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`sp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="sp-list">
              {filtered.map(sofa => {
                const tc = tagColors[sofa.tag] || tagColors['New'];
                const inWl = isWishlisted(sofa.id);
                const rating = stableRatings.find(r => r.id === sofa.id);
                return (
                  <div key={sofa.id} className="sp-row" onClick={() => setSelectedSofa(sofa)}>
                    <div className="sp-row-img-wrap">
                      <img className="sp-row-img" src={safeImg(sofa.image)} alt={sofa.name} loading="lazy"
                        style={{ cursor:'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: safeImg(sofa.image), alt: sofa.name }); }} />
                      <span className="sp-row-tag" style={{ background: tc.bg, color: tc.color }}>{sofa.tag}</span>
                      <button className="sp-row-wish" onClick={e => handleWishlist(sofa, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="sp-row-body">
                      <div>
                        <h3 className="sp-row-name">{sofa.name}</h3>
                        <StarRating rating={rating?.rating ?? 4.5} count={rating?.count ?? 42} />
                        <p className="sp-row-desc">{sofa.description}</p>
                        <div>
                          {sofa.type   && <span className="sp-spec-chip">· {sofa.type}</span>}
                          {sofa.config && <span className="sp-spec-chip">· {sofa.config}</span>}
                          {sofa.specs?.color && <span className="sp-spec-chip">· {sofa.specs.color}</span>}
                        </div>
                      </div>
                      <div>
                        {sofa.price ? (
                          <div className="sp-row-price-row">
                            <span style={{ fontSize:'1.45rem', fontWeight:700, color:'#1a1714' }}>₹{sofa.price.toLocaleString('en-IN')}</span>
                            {sofa.originalPrice && <span style={{ fontSize:'0.85rem', color:'#aaa', textDecoration:'line-through' }}>₹{sofa.originalPrice.toLocaleString('en-IN')}</span>}
                            {sofa.originalPrice && <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#2ecc71' }}>{Math.round((1 - sofa.price / sofa.originalPrice) * 100)}% off</span>}
                          </div>
                        ) : (
                          <span style={{ fontSize:'0.7rem', color:'#6b6359', fontStyle:'italic' }}>Click to view full details</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No sofas match your current filters. <br />
                  <button onClick={() => { setFilterType([]); setFilterConfig([]); setFilterTag([]); }}
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
      {selectedSofa && (() => {
        const sofa = selectedSofa;
        const tc = tagColors[sofa.tag] || tagColors['New'];
        const inWl = isWishlisted(sofa.id);
        const rating = stableRatings.find(r => r.id === sofa.id);
        return (
          <div className="sp-detail-overlay" onClick={() => setSelectedSofa(null)}>
            <div className="sp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="sp-detail-close" onClick={() => setSelectedSofa(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: safeImg(sofa.image), alt: sofa.name })}>
                <img className="sp-detail-img" src={safeImg(sofa.image)} alt={sofa.name} />
                <div style={{
                  position:'absolute', bottom:10, right:10,
                  background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%',
                  width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="sp-detail-body">
                <span className="sp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{sofa.tag}</span>
                <h2 className="sp-detail-name">{sofa.name}</h2>
                <StarRating rating={rating?.rating ?? 4.7} count={rating?.count ?? 87} />
                {sofa.price && (
                  <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:14 }}>
                    <span style={{ fontSize:'1.75rem', fontWeight:700, color:'#1a1714' }}>₹{sofa.price.toLocaleString('en-IN')}</span>
                    {sofa.originalPrice && <span style={{ fontSize:'1rem', color:'#aaa', textDecoration:'line-through' }}>₹{sofa.originalPrice.toLocaleString('en-IN')}</span>}
                    {sofa.originalPrice && <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#2ecc71' }}>{Math.round((1 - sofa.price / sofa.originalPrice) * 100)}% off</span>}
                  </div>
                )}
                <p className="sp-detail-desc">{sofa.description}</p>
                <div className="sp-detail-specs">
                  <p className="sp-detail-specs-title">Specifications</p>
                  <SpecRow label="Material Type"  value={sofa.type} />
                  <SpecRow label="Configuration"  value={sofa.config} />
                  <SpecRow label="Material"       value={sofa.specs?.material} />
                  <SpecRow label="Colour"         value={sofa.specs?.color} />
                  <SpecRow label="Dimensions"     value={sofa.specs?.length} />
                  <SpecRow label="Lounger Size"   value={sofa.specs?.width} />
                  <SpecRow label="Height"         value={sofa.specs?.height} />
                  <SpecRow label="Net Weight"     value={sofa.specs?.netWt} />
                </div>
                {sofa.care && (
                  <div className="sp-care">
                    <p className="sp-care-title">Care & Instructions</p>
                    <p className="sp-care-text">{sofa.care}</p>
                  </div>
                )}
                <div className="sp-detail-actions" style={{ marginTop:16 }}>
                  <button onClick={e => handleWishlist(sofa, e)} style={{
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