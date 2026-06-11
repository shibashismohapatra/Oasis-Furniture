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

const mattressData = [
  {
    id: 1,
    name: 'Club Class Grande Pocket Spring King Mattress',
    image: '/mattress/Club Class Grande Pocket Spring King Mattress in White Colour - 78x72x6 Inch.jpg',
    type: 'Pocket Spring',
    size: 'King',
    thickness: '6 Inch',
    tag: 'Bestseller',
    price: 28500,
    originalPrice: 34000,
    specs: { size: '78 × 72 × 6 Inch', type: 'Pocket Spring', brand: 'HomeTown', category: 'Mattresses' },
    description: 'The Club Class Grande brings together the finest quality pocketed springs and a thick layer of pressure relieving temperature sensitive memory foam and latex. The thick top layer of memory foam responds to body temperature and molds as per body contours by creating an individually tailored surface for optimum support and comfort. Later it returns to its original shape, therefore eliminating the need to flip the mattress. Max latex foam is designed to keep you warm during winter and cool during summers. The NASA approved memory foam distributes body weight evenly which improves blood circulation and delivers unparalleled comfort. Pressure points are relaxed with its low bounce back properties and high-density polyfoam.',
  },
  {
    id: 2,
    name: 'Club Class Grande Pocket Spring Single Mattress',
    image: '/mattress/Club Class Grande Pocket Spring Single Mattress in White Colour - 75x36x8 Inch.jpg',
    type: 'Pocket Spring',
    size: 'Single',
    thickness: '8 Inch',
    tag: 'New',
    price: 14500,
    originalPrice: 18000,
    specs: { size: '75 × 36 × 8 Inch', type: 'Pocket Spring', brand: 'HomeTown', category: 'Mattresses' },
    description: 'The Club Class Grande brings together the finest quality pocketed springs and a thick layer of pressure relieving temperature sensitive memory foam and latex. The thick top layer of memory foam responds to body temperature and molds as per body contours by creating an individually tailored surface for optimum support and comfort. Later it returns to its original shape, therefore eliminating the need to flip the mattress. Max latex foam is designed to keep you warm during winter and cool during summers. The NASA approved memory foam distributes body weight evenly which improves blood circulation and delivers unparalleled comfort. Pressure points are relaxed with its low bounce back properties and high-density polyfoam.',
  },
  {
    id: 3,
    name: 'Club Class Natura Orthopedic Pocket Spring Queen Mattress',
    image: '/mattress/Club Class Natura Orthopedic Pocket Spring Queen Mattress for Back Pain in Grey Colour - 72x60x8 Inch.jpg',
    type: 'Pocket Spring',
    size: 'Queen',
    thickness: '8 Inch',
    tag: 'Bestseller',
    price: 24500,
    originalPrice: 29000,
    specs: { size: '72 × 60 × 8 Inch', type: 'Pocket Spring + Latex', brand: 'HomeTown', color: 'Grey', category: 'Mattresses' },
    description: 'The Club Class Natura mattress presents itself for a comfortable sleep. This European top mattress comes with support pocketed spring structure combined with high resilience foam covered with smart Max latex foam that doesn\'t create any pressure at the stress points of the body during sleep. It is covered with the most beautiful and comfortable Belgium Velour fabric. Inside, the individually wrapped soft pocketed spring structure combined with high resilience foam and on top is imported smart latex. The combination of High resilience foam, Latex foam and coil layers in this mattress are designed to aid in recovery and pressure relief. Ideal for those suffering from back pain — the orthopedic design supports the spine and keeps you aligned throughout the night.',
  },
  {
    id: 4,
    name: 'Dreamer Orthopedic 3 Layered Dual Comfort Memory & HR Foam Mattress',
    image: '/mattress/Dreamer Orthopedic 3 Layered Dual Comfort 8 Inch Memory & HR Foam Mattress In King Size.jpg',
    type: 'Memory Foam',
    size: 'King',
    thickness: '8 Inch',
    tag: 'Premium',
    price: 18500,
    originalPrice: 22000,
    specs: { size: '72 × 72 × 8 Inch', type: 'Memory Foam + HR Foam', brand: 'Springtek', firmness: 'Medium Firm', warranty: '11 Years', weight: '25 KG' },
    description: 'Adaptive Foam: Great Things Come In Small Packages. Constructed with freshly poured high density adaptive foam, this mattress provides a bouncy yet supportive feel perfect for all sleeping positions. With the all-new top layer of quality foam, you\'ll experience enhanced pressure relief and better rest. Medium Firm Supportive Dual Comfort: Combination of softer foam for shoulder region and supportive firm foam for core and hip area allowing perpetual sleep. The top side is Medium Firm & back side is Firm providing Dual Comfort in 1 mattress. The knitted, anti-microbial, removable zipper mattress cover is highly breathable with no tapered edges. Backed by an 11-year warranty against manufacturing defects.',
  },
  {
    id: 5,
    name: 'Dual Roll Back Reversible 6 Inch HR Foam King Size Mattress',
    image: '/mattress/Dual Roll Back Reversible 6 Inch HR Foam King Size Mattress.jpg',
    type: 'HR Foam',
    size: 'King',
    thickness: '6 Inch',
    tag: 'New',
    price: 11500,
    originalPrice: 14000,
    specs: { size: 'King Size', type: 'HR Foam', thickness: '6 Inch', comfort: 'Dual Side Reversible' },
    description: 'The Dual Roll Back Reversible HR Foam Mattress is engineered for everyday comfort and long-lasting durability. Made with high-resilience foam, it offers consistent support night after night. The dual-sided reversible design means you can flip the mattress to extend its life and switch between comfort preferences. Its roll-packed for easy delivery and setup. Ideal for those who prefer a firm yet supportive sleeping surface without the added weight of spring systems. Perfect for guest rooms, kids rooms, or everyday use.',
  },
  {
    id: 6,
    name: 'FLIP Dual Comfort Hard & Soft Roll Packed Foam Mattress',
    image: '/mattress/FLIP Dual Comfort Hard & Soft Roll Packed 6 Inch Foam Mattress In King Size.jpg',
    type: 'Foam',
    size: 'King',
    thickness: '6 Inch',
    tag: 'Bestseller',
    price: 10500,
    originalPrice: 13000,
    specs: { size: 'King Size', type: 'Dual Comfort Foam', thickness: '6 Inch', comfort: 'Hard & Soft Reversible' },
    description: 'The FLIP Dual Comfort Mattress brings you the best of both worlds — a hard side and a soft side in one reversible mattress. Simply flip it over to switch between firm support and plush comfort, depending on your needs and preferences. Roll-packed for convenient delivery and easy handling, this mattress is ideal for those who want flexibility without compromising on comfort. Made with quality foam layers for durability and consistent support. Great for couples with different firmness preferences — everyone sleeps happy.',
  },
  {
    id: 7,
    name: 'Flip Reversible 5 Inch HR Foam King Size Mattress',
    image: '/mattress/Flip Reversible 5 Inch HR Foam King Size Mattress.jpg',
    type: 'HR Foam',
    size: 'King',
    thickness: '5 Inch',
    tag: 'New',
    price: 9500,
    originalPrice: 12000,
    specs: { size: 'King Size', type: 'HR Foam', thickness: '5 Inch', comfort: 'Reversible' },
    description: 'The Flip Reversible HR Foam Mattress is a compact and versatile sleeping solution for modern homes. Made with high-resilience foam, it delivers reliable support and bouncy comfort. At 5 inches thick, it is ideal for use on divan beds, bunk beds, or as a second mattress option. The reversible design allows you to use both sides, doubling the life of the mattress. Roll-packed for easy setup and handling. Lightweight and easy to move, making it a practical choice for kids, teens, and guest rooms.',
  },
  {
    id: 8,
    name: 'Hemp Organic Orthopedic 10 inch Memory Foam King Size Mattress',
    image: '/mattress/Hemp Organic Orthopedic 10 inch Memory Foam King Size Mattress.jpg',
    type: 'Memory Foam',
    size: 'King',
    thickness: '10 Inch',
    tag: 'Premium',
    price: 32000,
    originalPrice: 38000,
    specs: { size: 'King Size', type: 'Organic Memory Foam', thickness: '10 Inch', material: 'Hemp Organic' },
    description: 'Experience the natural comfort of the Hemp Organic Orthopedic Memory Foam Mattress. Made with organic hemp-infused memory foam, this premium mattress offers superior pressure relief, body contouring, and orthopedic support. The hemp fiber layer provides natural breathability, keeping you cool and comfortable throughout the night. At 10 inches, it delivers a deep, luxurious sleep surface with excellent motion isolation. Ideal for those who suffer from back and joint pain. The organic construction ensures a chemical-free sleeping environment, making it safe for sensitive sleepers and eco-conscious households.',
  },
  {
    id: 9,
    name: 'Livein 2in1 Reversible Soft & Firm King Size Mattress',
    image: '/mattress/Livein 2in1 Reversible 6 Inch Soft & Firm King Size Mattress.jpg',
    type: 'Foam',
    size: 'King',
    thickness: '6 Inch',
    tag: 'New',
    price: 12000,
    originalPrice: 15000,
    specs: { size: 'King Size', type: 'Dual Comfort Foam', thickness: '6 Inch', comfort: 'Soft & Firm Reversible' },
    description: 'The Livein 2in1 Reversible Mattress offers the ultimate sleeping flexibility with a soft side and a firm side in a single mattress. Whether you prefer cloud-like softness or firm orthopedic support, simply flip to switch. Made with quality layered foam construction, it provides lasting durability and consistent performance. The 6-inch profile makes it compatible with most bed frames and storage beds. Roll-packed for easy delivery. Perfect for couples, guest rooms, or anyone who wants adaptable comfort without buying two separate mattresses.',
  },
  {
    id: 10,
    name: 'Nor Dual Side Reversible HR Foam 6 Inches King Size Mattress',
    image: '/mattress/Nor Dual Side Reversible HR Foam 6 Inches King Size Mattress.jpg',
    type: 'HR Foam',
    size: 'King',
    thickness: '6 Inch',
    tag: 'New',
    price: 11000,
    originalPrice: 14000,
    specs: { size: 'King Size', type: 'HR Foam', thickness: '6 Inch', comfort: 'Dual Side Reversible' },
    description: 'The Nor Dual Side Reversible HR Foam Mattress is designed for everyday reliability and comfort. Crafted with high-resilience foam on both sides, it provides consistent support no matter which way you sleep. The dual-sided design extends the lifespan of the mattress significantly. At 6 inches, it fits perfectly with most bed frames and storage beds available in the market. Roll-packed for easy transport and installation. A practical and affordable choice for anyone looking for a dependable, no-fuss mattress solution for their home.',
  },
  {
    id: 11,
    name: 'Original BodyIQ 8 inch Memory Foam King Size Mattress',
    image: '/mattress/Original BodyIQ 8 inch Memory Foam King Size Mattress.jpg',
    type: 'Memory Foam',
    size: 'King',
    thickness: '8 Inch',
    tag: 'Bestseller',
    price: 22000,
    originalPrice: 27000,
    specs: { size: 'King Size', type: 'Memory Foam', thickness: '8 Inch' },
    description: 'The Original BodyIQ Memory Foam Mattress is intelligently designed to respond to your unique body shape, weight, and temperature. The memory foam adapts to your body contours, providing customized pressure relief and spinal alignment. At 8 inches thick, it offers a premium sleeping experience with excellent motion isolation — perfect for couples. The breathable cover promotes airflow, keeping you comfortable throughout the night. Suitable for all sleeping positions — back, side, and stomach sleepers. A trusted choice for those seeking restorative, deep sleep every night.',
  },
  {
    id: 12,
    name: 'Restonic Carousel Pocket Spring King Mattress',
    image: '/mattress/Restonic Carousel Pocket Spring King Mattress in Cream Colour - 78x72x6 Inch.jpg',
    type: 'Pocket Spring',
    size: 'King',
    thickness: '6 Inch',
    tag: 'Premium',
    price: 26000,
    originalPrice: 31000,
    specs: { size: '78 × 72 × 6 Inch', type: 'Pocket Spring', brand: 'Restonic', color: 'Cream' },
    description: 'The Restonic Carousel Pocket Spring Mattress is crafted with individually wrapped pocket springs that move independently, providing targeted support to different parts of the body. This design minimizes motion transfer, making it ideal for couples with different sleep schedules. The cream-colored premium fabric cover adds elegance to your bedroom. At 6 inches, it offers the perfect balance of support and comfort. Restonic is a trusted global brand known for quality craftsmanship and sleep innovation. Experience hotel-quality rest in the comfort of your own home.',
  },
  {
    id: 13,
    name: 'Reversible Flip Mattress for Kids Trundle Mattress',
    image: '/mattress/Reversible Flip Mattress for Kids Trundle Mattress.jpg',
    type: 'Foam',
    size: 'Single',
    thickness: '4 Inch',
    tag: 'New',
    price: 6500,
    originalPrice: 8500,
    specs: { size: 'Single / Trundle Size', type: 'Foam', thickness: '4 Inch', use: 'Kids / Trundle Bed' },
    description: 'Designed specifically for kids and trundle beds, this Reversible Flip Mattress provides a safe, comfortable sleeping surface for children. The dual-sided design lets you alternate between sides to ensure even wear and extended lifespan. Lightweight and easy to handle, it is perfect for rollout trundle beds, bunk beds, or daybeds. Made with child-safe foam materials that are hygienic and easy to maintain. Compact and roll-packable for easy storage when not in use. The ideal starter mattress for growing kids who need reliable comfort and safe sleeping support.',
  },
  {
    id: 14,
    name: 'Sleepables Orthopedic 8 Inch Memory Foam & HR Foam Mattress',
    image: '/mattress/Sleepables Orthopedic 8 Inch Memory Foam & HR Foam mattress In King Size Inches.jpg',
    type: 'Memory Foam',
    size: 'King',
    thickness: '8 Inch',
    tag: 'Bestseller',
    price: 19500,
    originalPrice: 24000,
    specs: { size: 'King Size', type: 'Memory Foam + HR Foam', thickness: '8 Inch', use: 'Orthopedic Support' },
    description: 'The Sleepables Orthopedic Mattress combines the contouring comfort of memory foam with the resilient support of high-resilience foam, creating the perfect sleep system for back pain sufferers. The 3-layer construction ensures proper spinal alignment, pressure point relief, and undisturbed sleep. The memory foam top layer cradles your body while the HR foam base provides a firm and supportive foundation. The removable, washable cover keeps the mattress fresh and hygienic. Backed by quality craftsmanship, this mattress is built to last through years of daily use.',
  },
  {
    id: 15,
    name: 'Spine Guard Bonnel Spring Queen Mattress for Back Pain',
    image: '/mattress/Spine Guard Bonnel Spring Queen Mattress for Back Pain in Grey Colour - 78x60x8 Inch.jpg',
    type: 'Bonnel Spring',
    size: 'Queen',
    thickness: '8 Inch',
    tag: 'Bestseller',
    price: 17500,
    originalPrice: 21000,
    specs: { size: '78 × 60 × 8 Inch', type: 'Bonnel Spring', color: 'Grey', use: 'Back Pain Relief' },
    description: 'The Spine Guard Bonnel Spring Mattress is engineered specifically for people who suffer from back pain and spine issues. The interconnected bonnel spring system provides firm, even support across the entire mattress surface, ensuring proper spinal alignment during sleep. A thick comfort layer on top delivers the right amount of cushioning without compromising support. The grey fabric cover is stylish, durable, and easy to maintain. At 8 inches thick, it fits standard queen bed frames perfectly. Recommended by sleep experts for back pain sufferers who need firm, consistent support every night.',
  },
  {
    id: 16,
    name: 'Springkoil Bonnel Spring Queen Mattress',
    image: '/mattress/Springkoil Bonnel Spring Queen Mattress in Maroon Colour - 78x60x10 Inch.jpg',
    type: 'Bonnel Spring',
    size: 'Queen',
    thickness: '10 Inch',
    tag: 'Premium',
    price: 21000,
    originalPrice: 25500,
    specs: { size: '78 × 60 × 10 Inch', type: 'Bonnel Spring', color: 'Maroon', brand: 'Springkoil' },
    description: 'The Springkoil Bonnel Spring Queen Mattress brings luxurious comfort and exceptional support together in a bold maroon design. At 10 inches thick, it offers a deep, hotel-like sleeping experience with the classic bouncy feel of interconnected spring construction. The bonnel spring system provides consistent support across the sleep surface, ideal for those who prefer a traditional spring mattress feel. The rich maroon fabric cover adds elegance to any bedroom decor. Built by Springkoil, a trusted name in sleep technology, this mattress is designed to provide years of restful, undisturbed sleep.',
  },
  {
    id: 17,
    name: 'Truben Pinhole Latex Foam 10 Inches King Size Mattress',
    image: '/mattress/Truben Pinhole Latex Foam 10 Inches King Size Mattress.jpg',
    type: 'Latex Foam',
    size: 'King',
    thickness: '10 Inch',
    tag: 'Premium',
    price: 35000,
    originalPrice: 42000,
    specs: { size: 'King Size', type: 'Pinhole Latex Foam', thickness: '10 Inch', brand: 'Truben' },
    description: 'The Truben Pinhole Latex Foam Mattress represents the pinnacle of natural sleep comfort. Made with premium pinhole latex foam — a material known for its superior breathability, natural elasticity, and hypoallergenic properties — this mattress provides an unmatched sleeping experience. The pinhole design allows air to circulate freely through the mattress, keeping you cool even on warm nights. At 10 inches, it offers a plush, cloud-like comfort layer with excellent pressure point relief. Latex naturally resists dust mites and mold, making it ideal for allergy sufferers. A long-lasting, eco-friendly mattress that grows better with time.',
  },
];

const stableRatings = mattressData.map(m => ({
  id: m.id,
  rating: +(4.3 + ((m.id * 19 + 5) % 8) / 10).toFixed(1),
  count: 15 + ((m.id * 29 + 11) % 110),
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

export default function MattressPage({ onBack, selectedProductId }) {
  const [sortBy, setSortBy]           = useState('popularity');
  const [filterSize, setFilterSize]   = useState([]);
  const [filterType, setFilterType]   = useState([]);
  const [filterTag, setFilterTag]     = useState([]);
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');
  const [selectedMattress, setSelectedMattress] = useState(null);
  const [zoomImg, setZoomImg]         = useState(null);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [openSections, setOpenSections] = useState({ size: true, type: true, tag: true, price: true });
  const [wishlist, setWishlist]       = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      const found = mattressData.find(m => String(m.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedMattress(found), 120);
    }
  }, [selectedProductId]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...mattressData];
    if (filterSize.length) items = items.filter(m => filterSize.includes(m.size));
    if (filterType.length) items = items.filter(m => filterType.includes(m.type));
    if (filterTag.length)  items = items.filter(m => filterTag.includes(m.tag));
    if (priceMin)          items = items.filter(m => m.price >= parseInt(priceMin));
    if (priceMax)          items = items.filter(m => m.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterSize, filterType, filterTag, priceMin, priceMax, sortBy]);

  const handleAddToCart = (m, e) => {
    e.stopPropagation();
    addToCart({ id: m.id, name: m.name, price: m.price, image: m.image, quantity: 1 });
    showToast(`"${m.name}" added to cart`, 'success');
  };
  const handleWishlist = (m, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: m.id, name: m.name, price: m.price, image: m.image });
    showToast(
      wishlist.includes(m.id) ? `Removed from Wishlist` : `"${m.name}" added to Wishlist`,
      wishlist.includes(m.id) ? 'success' : 'wishlist'
    );
    setWishlist(w => w.includes(m.id) ? w.filter(x => x !== m.id) : [...w, m.id]);
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
        .mp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .mp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .mp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .mp-back:hover { color:#1a1714; }
        .mp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .mp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .mp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .mp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .mp-main { padding:24px 32px 60px; }
        .mp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .mp-count { font-size:0.78rem;color:#6b6359; }
        .mp-count strong { color:#1a1714;font-weight:600; }
        .mp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .mp-sort::-webkit-scrollbar { display:none; }
        .mp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .mp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .mp-sort-btn.active,.mp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        .mp-list { display:flex;flex-direction:column;gap:16px; }
        .mp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .mp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .mp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .mp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .mp-row:hover .mp-row-img { transform:scale(1.04); }
        .mp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .mp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .mp-row-wish:hover { color:#c0392b; }
        .mp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .mp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .mp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .mp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .mp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .mp-row-price { font-size:1.45rem;font-weight:700;color:#1a1714; }
        .mp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .mp-row-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71; }

        .mp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .mp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:mpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes mpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .mp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8; }
        .mp-detail-body { padding:28px 32px 48px; }
        .mp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .mp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 10px; }
        .mp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .mp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .mp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .mp-detail-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .mp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .mp-detail-specs { margin-bottom:24px; }
        .mp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .mp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .mp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .mp-detail-close:hover { background:#fff; }
        .mob-mp-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .mp-layout { grid-template-columns:1fr; }
          .mp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            overflow-y:auto;padding:20px; }
          .mp-sidebar.open { display:block!important; }
          .mob-mp-filter-btn { display:flex!important; }
          .mp-hero { padding:24px 16px 20px; }
          .mp-main { padding:16px 16px 60px; }
          .mp-row-img-wrap { width:140px; }
          .mp-row-img { height:160px; }
          .mp-row-name { font-size:1.1rem; }
          .mp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .mp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .mp-row { flex-direction:column; }
          .mp-row-img-wrap { width:100%; }
          .mp-row-img { height:200px; }
          .mp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="mp-root">
        {/* Hero */}
        <div className="mp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="mp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="mp-heading">Mattresses</h1>
            <p className="mp-sub">Premium mattresses for every sleep style — designed for comfort, support, and lasting quality. Showing {filtered.length} of {mattressData.length} products.</p>
          </div>
        </div>

        <div className="mp-layout">
          {/* Sidebar filters */}
          <aside className={`mp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mob-mp-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background:'none',border:'none',cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("SIZE", "size", <>
              {['Single', 'Queen', 'King'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterSize.includes(s)} onChange={() => toggleArr(filterSize, setFilterSize, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {s}
                </label>
              ))}
            </>)}

            {renderFilterSection("MATTRESS TYPE", "type", <>
              {['Memory Foam', 'Pocket Spring', 'Bonnel Spring', 'Latex Foam', 'HR Foam', 'Foam'].map(t => (
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

            {renderFilterSection("PRICE RANGE", "price", <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline:'none' }} />
                <span style={{ color: '#aaa', flexShrink: 0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline:'none' }} />
              </div>
            </>)}

            {(filterSize.length > 0 || filterType.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterSize([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="mp-main">
            <div className="mp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mob-mp-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.74rem',fontWeight:600,
                    letterSpacing:'0.08em',textTransform:'uppercase',color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="mp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="mp-sort">
                <span className="mp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`mp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            <div className="mp-list">
              {filtered.map(mattress => {
                const disc = mattress.originalPrice ? Math.round((1 - mattress.price / mattress.originalPrice) * 100) : null;
                const tc = tagColors[mattress.tag] || tagColors['New'];
                const inWl = wishlist.includes(mattress.id);
                return (
                  <div key={mattress.id} className="mp-row" onClick={() => setSelectedMattress(mattress)}>
                    <div className="mp-row-img-wrap">
                      <img className="mp-row-img" src={mattress.image} alt={mattress.name} loading="lazy"
                        style={{ cursor:'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: mattress.image, alt: mattress.name }); }} />
                      <span className="mp-row-tag" style={{ background: tc.bg, color: tc.color }}>{mattress.tag}</span>
                      <button className="mp-row-wish" onClick={e => handleWishlist(mattress, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="mp-row-body">
                      <div>
                        <h3 className="mp-row-name">{mattress.name}</h3>
                        <StarRating
                          rating={stableRatings.find(r => r.id === mattress.id)?.rating ?? 4.5}
                          count={stableRatings.find(r => r.id === mattress.id)?.count ?? 42}
                        />
                        <p className="mp-row-desc">{mattress.description}</p>
                        <div>
                          {mattress.type      && <span className="mp-spec-chip">· {mattress.type}</span>}
                          {mattress.size      && <span className="mp-spec-chip">· {mattress.size} Size</span>}
                          {mattress.thickness && <span className="mp-spec-chip">· {mattress.thickness} Thick</span>}
                          {mattress.specs?.brand && <span className="mp-spec-chip">· {mattress.specs.brand}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="mp-row-price-row">
                          <span className="mp-row-price">₹{mattress.price.toLocaleString('en-IN')}</span>
                          {mattress.originalPrice && <span className="mp-row-orig">₹{mattress.originalPrice.toLocaleString('en-IN')}</span>}
                          {disc && <span className="mp-row-disc">{disc}% off</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No mattresses match your current filters. <br />
                  <button onClick={() => { setFilterSize([]); setFilterType([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
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
      {selectedMattress && (() => {
        const m = selectedMattress;
        const disc = m.originalPrice ? Math.round((1 - m.price / m.originalPrice) * 100) : null;
        const tc = tagColors[m.tag] || tagColors['New'];
        const inWl = wishlist.includes(m.id);
        return (
          <div className="mp-detail-overlay" onClick={() => setSelectedMattress(null)}>
            <div className="mp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="mp-detail-close" onClick={() => setSelectedMattress(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: m.image, alt: m.name })}>
                <img className="mp-detail-img" src={m.image} alt={m.name} />
                <div style={{
                  position:'absolute', bottom:10, right:10,
                  background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%',
                  width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="mp-detail-body">
                <span className="mp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{m.tag}</span>
                <h2 className="mp-detail-name">{m.name}</h2>
                <StarRating rating={4.7} count={87} />
                <div className="mp-detail-price-row">
                  <span className="mp-detail-price">₹{m.price.toLocaleString('en-IN')}</span>
                  {m.originalPrice && <span className="mp-detail-orig">₹{m.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="mp-detail-disc">{disc}% off</span>}
                </div>
                <p className="mp-detail-desc">{m.description}</p>
                <div className="mp-detail-specs">
                  <p className="mp-detail-specs-title">Specifications</p>
                  <SpecRow label="Size"         value={m.specs?.size || m.size + ' Size'} />
                  <SpecRow label="Mattress Type" value={m.type} />
                  <SpecRow label="Thickness"    value={m.thickness} />
                  <SpecRow label="Brand"        value={m.specs?.brand} />
                  <SpecRow label="Firmness"     value={m.specs?.firmness} />
                  <SpecRow label="Warranty"     value={m.specs?.warranty} />
                  <SpecRow label="Weight"       value={m.specs?.weight} />
                  <SpecRow label="Colour"       value={m.specs?.color} />
                </div>
                <div className="mp-detail-actions">
                  <button onClick={e => handleWishlist(m, e)} style={{
                    padding:'14px 18px',border:'1px solid rgba(0,0,0,0.15)',background:'#fff',
                    cursor:'pointer',display:'flex',alignItems:'center',gap:7,
                    fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',fontWeight:600,
                    letterSpacing:'0.10em',textTransform:'uppercase',
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