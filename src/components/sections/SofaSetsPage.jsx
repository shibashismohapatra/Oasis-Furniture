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

const sofasData = [
  { id: 1,  name: 'Bombay Brown (3 Seater)', image: '/sofas/Bombay-brown-3.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 42000, originalPrice: 52000,
    specs: { length: '72 inch', width: '36 inch', netWt: '80 KG', grossWt: '90 KG', material: 'Fabric', color: 'Brown' },
    description: 'Discover the peak of elegance with our Bombay Brown Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure using a soft-bristled brush. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately — do not rub. Protect from direct sunlight and moisture.' },

  { id: 2,  name: 'Bingo Fabric 3 Seater Sofa (Grey)', image: '/sofas/bingo-fabric-3-seater-sofa-in-grey-colour-bingo-fabric-3-seater-sofa-in-grey-colour-2timof.jpg', type: 'Fabric', config: '3 Seater', tag: 'New', price: 28000, originalPrice: 35000,
    specs: { length: '70 inch (178 cm)', width: '32 inch (81 cm)', netWt: '30 KG', material: 'Fabric', color: 'Grey' },
    description: 'Frame material: 4 side planed Neem wood & commercial grade 12mm calibrated ply. Leg material: PVC Legs. Foam Density: 32D High Grade foam with a combination of hard and soft. Seat Suspension: 3" Narrow Woven Elastic Belt with a tension strength of 1.7 tons. A well-crafted sofa designed for comfortable everyday living.',
    care: 'Ensure proper levelling of floor. Do not drag the sofa. Avoid direct sunlight and AC vents. Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands.' },

  { id: 3,  name: 'ALEXA ELITE Half Leather Sofa (Beige)', image: '/sofas/ALEXA ELITE HALF LEATHER BEIGE.jpg', type: 'Half Leather', config: '1/2/3 Seater', tag: 'Premium', price: 58000, originalPrice: 70000,
    specs: { length: '1100 mm', width: '980 mm', height: '825 mm', material: 'Half Leather (Leather + PVC)', color: 'Beige' },
    description: 'Frame construction in seasoned & treated Plywood for product durability. Pocket Nozag Spring & Elastic Seat belt webbing together with high 830 density foam for greater seating comfort. High grade premium Leather Fabric upholstery. Available in a comfortable 1/2/3 Seater configuration designed for personal relaxation. A highly comfortable & magnanimous product with superior quality, construction & finish.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight and sharp objects.' },

  { id: 4,  name: 'ELOWEN Fabric Sofa Steel Grey (2 Seater)', image: '/sofas/ELOWEN FABRIC SOFA STEEL GREY.jpg', type: 'Fabric', config: '2 Seater', tag: 'New', price: 22000, originalPrice: 27000,
    specs: { length: '172 cm', width: '90 cm', height: '78 cm', material: 'Fabric', color: 'Grey' },
    description: 'HomeTown Elowen Fabric Sofa Series. Available in 3-Seater and 2-Seater configurations in Light Grey. Strong seasoned and treated solidwood frame for lasting durability. 32 Density 100MM high-resiliency foam for superior comfort and shape retention. Plush fiber-filled cushions with S-spring and pocket spring suspension. Sculpted curved form with cushioned backrest and wide track armrests. Premium high-grade fabric upholstery resists wrinkles and fading. Ideal for modern apartments and spacious contemporary living rooms.',
    care: 'Do not move in assembled condition. Avoid moisture, high temperature or chemicals. Dust with clean dry lint-free cotton cloth. Do not keep hot products directly on surface.' },

  { id: 5,  name: 'ELOWEN Fabric 3 Seater Sofa Steel Grey', image: '/sofas/ELOWEN FABRIC 3 SEATER SOFA STEEL GREY.jpg', type: 'Fabric', config: '3 Seater', tag: 'New', price: 32000, originalPrice: 39000,
    specs: { length: '233 cm', width: '90 cm', height: '78 cm', material: 'Fabric', color: 'Grey' },
    description: 'HomeTown Elowen Fabric Sofa Series. Available in 3-Seater and 2-Seater configurations in Light Grey. Strong seasoned and treated solidwood frame for lasting durability. 32 Density 100MM high-resiliency foam for superior comfort and shape retention. Plush fiber-filled cushions with S-spring and pocket spring suspension. Sculpted curved form with cushioned backrest and wide track armrests. Premium high-grade fabric upholstery resists wrinkles and fading.',
    care: 'Do not move in assembled condition. Avoid moisture, high temperature or chemicals. Dust with clean dry lint-free cotton cloth. Do not keep hot products directly on surface.' },
 { id: 5,  name: 'Legacy (3+2+2) Sofa Set', image: '/sofas/LegacySofa Set.jpg', type: 'Fabric', config: '3 Seater', tag: 'New', price: 32000, originalPrice: 39000,
    specs: { length: '233 cm', width: '90 cm', height: '78 cm', material: 'Fabric', color: 'Grey' },
    description: 'HomeTown Elowen Fabric Sofa Series. Available in 3-Seater and 2-Seater configurations in Light Grey. Strong seasoned and treated solidwood frame for lasting durability. 32 Density 100MM high-resiliency foam for superior comfort and shape retention. Plush fiber-filled cushions with S-spring and pocket spring suspension. Sculpted curved form with cushioned backrest and wide track armrests. Premium high-grade fabric upholstery resists wrinkles and fading.',
    care: 'Do not move in assembled condition. Avoid moisture, high temperature or chemicals. Dust with clean dry lint-free cotton cloth. Do not keep hot products directly on surface.' },

  { id: 7,  name: 'Hazel Fabric Sofa (Beige)', image: '/sofas/Hazel Fabric Sofa Beige.jpg', type: 'Fabric', config: '2/3 Seater', tag: 'New', price: 38000, originalPrice: 46000,
    specs: { length: '1730 mm', width: '790 mm', height: '885 mm', material: 'Pine Wood, Chenille Fabric, Zig Zag Spring + High density foam', color: 'Beige & Brown' },
    description: 'HAZEL FABRIC SOFA is available in 3–SEATER & 2-SEATER in Beige color. Stylish design, trendy Chenille Boucle fabric, & comfortable seating ergonomics. Upholstered in Chenille Boucle fabric — highly durable. Product comes with 1 year warranty against manufacturing defect. Zig Zag Spring seat construction with high density foam for superior comfort. A modern silhouette with clean, curved arms and subtle design details that add a touch of sophistication.',
    care: 'Ensure proper levelling of floor. Do not drag. Avoid direct sunlight and AC vents. Use vacuum cleaner for cleaning.' },

  { id: 8,  name: 'Magnific Velvet Sofa', image: '/sofas/Magnific Velvet Sofa.jpg', type: 'Velvet', config: '2 Seater', tag: 'Premium', price: 45000, originalPrice: 55000,
    specs: { length: '1410 mm', width: '880 mm', height: '850 mm', netWt: '30 KG', material: 'Velvet Fabric', color: 'Wine' },
    description: 'The velvet sofa with a clean, straight-lined silhouette exudes the form and texture of a quintessential modern sofa. Plush high cushions and half-rounded arms promise a comfortable seating experience within a compact living space. The sofa frame is made from kiln-dried and chemically treated solid wood, making it termite resistant & borerproof. A combination of No-Zag springs & webbing with 32 density high-resilient foam is used in the seat construction, topped with a layer of super soft foam. Loose back cushions filled with polyester fibre provide greater support & comfort.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 9,  name: 'Grace Fabric Sofa', image: '/sofas/Grace Fabric Sofa.jpg', type: 'Fabric', config: '2 Seater', tag: 'Bestseller', price: 35000, originalPrice: 43000,
    specs: { length: '1430 mm', width: '910 mm', height: '940 mm', material: 'Fabric', color: 'Olive' },
    description: 'The grandeur fabric sofa is for people who love extra space to stretch and lounge on. The larger-than-life yet minimal form lines offer statement comfort and style for your living spaces. This luxury piece allows you to sink in and unwind completely. The sofa frame is made from kiln-dried and chemically treated solid wood — termite resistant & borerproof. Combination of No-Zag springs & webbing with 32 Density high-resilient foam for ultimate comfort. Soft-curve cushions are filled with polyester fibre to give greater support & comfort. Available in multiple configurations and upholstery shades.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight and AC vents.' },

  { id: 10, name: 'Garcia Fabric Sofa (Single Seater)', image: '/sofas/Garcia Fabric Sofa.jpg', type: 'Fabric', config: '1 Seater', tag: 'New', price: 18000, originalPrice: 22000,
    specs: { length: '890 mm', width: '815 mm', height: '900 mm', material: 'Fabric', color: 'Blue' },
    description: 'Refined craftsmanship meets modern design in a compact, contemporary sofa. Clean lines, a boxy silhouette and expertly tailored button-tufted back cushions create a polished look, while high-tensile polyester upholstery delivers breathable, long-lasting comfort suited to everyday living. Built with kiln-dried, chemically treated solid wood — termite and borer resistant. Combination of No-Zag springs and pocket springs with 32-density high-resilient foam. Compact yet stylish — ideal for contemporary interiors and smaller rooms.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 11, name: 'Garcia Fabric Three Seater Sofa', image: '/sofas/Garcia Fabric Three Seater Sofa.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 38000, originalPrice: 46000,
    specs: { length: '1950 mm', width: '815 mm', height: '900 mm', material: 'Fabric', color: 'Dark Brown' },
    description: 'The Garcia Fabric Three Seater Sofa is a contemporary upholstered seating piece designed for modern homes. With its structured silhouette and button-tufted back cushions, this fabric three seater sofa delivers both comfort and refined style. Built with a durable frame and resilient seating system, it works beautifully as a family size sofa for living rooms or even as an office sofa. Spacious three seater ideal for families and entertaining. Broad track arms for comfortable support. Breathable high-tensile polyester fabric upholstery. Suitable as a triple seater sofa for large living room setups.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 12, name: 'Garcia Fabric Two Seater Sofa', image: '/sofas/Garcia Fabric Two Seater Sofa.jpg', type: 'Fabric', config: '2 Seater', tag: 'New', price: 28000, originalPrice: 34000,
    specs: { length: '1435 mm', width: '815 mm', height: '900 mm', material: 'Fabric', color: 'Dark Brown' },
    description: 'This fabric sofa brings contemporary elegance and supreme comfort to your living space. With a modern boxy silhouette, plush button-tufted cushions and soft polyester upholstery, it is ideal for lounging, entertaining or unwinding after a long day. Clean lines, firm upright seating, thick armrests and a sleek wooden panel along the length create a refined, stylish centerpiece for any room. Constructed from kiln-dried, chemically treated solid wood — termite and borer resistant. Engineered with No-Zag springs and pocket springs for balanced support.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 13, name: 'Legacy (3+2+2) Sofa Set', image: '/sofas/LegacySofa Set.jpg', type: 'Fabric', config: '3+2+2 Set', tag: 'Bestseller', price: 88000, originalPrice: 108000,
    specs: { length3S: '82 x 36 inch', length2S: '60 x 36 inch', material: 'Fabric', color: 'Brown' },
    description: 'Discover the peak of elegance with our Legacy (3+2+2) Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure using a soft-bristled brush. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

  { id: 14, name: 'LAVISTA Sofa Bed (Brown)', image: '/sofas/LAVISTA SOFA BED BROWN.jpg', type: 'Fabric', config: 'Sofa Cum Bed', tag: 'New', price: 36000, originalPrice: 44000,
    specs: { length: '221 cm', width: '94 cm', height: '99 cm', material: 'Fabric', color: 'Brown' },
    description: 'HomeTown Lavista Sofa Cum Bed. Converts from 3-seater sofa to queen-size bed effortlessly. Available in elegant Brown color. Sturdy solidwood frame with integrated box base for durability. 40 Density 50MM foam for superior comfort and shape retention. Premium fabric upholstery with ribbed detailing and stitched accents. Thick rounded armrests for enhanced support and modern appeal. Ideal for living rooms, apartments, guest rooms, and compact homes.',
    care: 'Do not move in assembled condition. Avoid moisture, high temperature or chemicals. Dust with clean dry lint-free cotton cloth. Keep assembly instructions handy.' },

  { id: 15, name: 'Paddington 3 Seater Sofa (Grey)', image: '/sofas/Paddington 3 Seater Sofa in Grey 100% Polyester Fabric.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 42000, originalPrice: 52000,
    specs: { length: '1943 mm', width: '825 mm', height: '870 mm', material: 'Fabric (100% Polyester)', color: 'Grey' },
    description: 'PADDINGTON FABRIC SOFA is available in 3-Seater in GREY colour. Characteristic tufted backrest design, full stock rounded arm rest and comfortable seating ergonomics in 100% polyester fabric upholstery. Frame construction in seasoned & treated Pine Wood for product durability. Nozag Spring & Elastic Seat belt webbing together with high density foam 28-32 Kg/M3 for greater seating comfort. 100% Polyester Fabric Upholstery. Comes with 1 Yr Warranty from HomeTown against manufacturing defects.',
    care: 'Do not move in assembled condition. Avoid moisture and chemicals. Dust with clean dry lint-free cloth. Do not keep hot products directly on surface.' },

  { id: 16, name: 'Riga Lyra 3 Seater Sofa (Grey Velvet)', image: '/sofas/Riga Lyra 3 Seater Sofa in Grey Velvet Upholstery Fabric.jpg', type: 'Velvet', config: '3 Seater', tag: 'Premium', price: 55000, originalPrice: 67000,
    specs: { length: '2080 mm', width: '875 mm', height: '900 mm', material: 'Velvet', color: 'Dark Grey' },
    description: 'Available in 3 Seater size configuration in Dark Grey colour variant. Zig-Zag Spring seat construction with high density foam for superior comfort. Product comes with 1 year warranty against manufacturing defect. Treated velvet upholstery in Dark Grey maintains its rich color and modern appearance. A highly comfortable product with superior quality, construction & finish. Velvet gives luxury, foam + springs give comfort, Pine wood frame gives durability, and premium legs add style & stability.',
    care: 'Do not move in assembled condition. Avoid moisture and chemicals. Dust with clean dry lint-free cloth. Do not keep hot products directly on surface.' },

  { id: 17, name: 'Riga Lyra Single Seater Sofa (Dark Grey Velvet)', image: '/sofas/Riga Lyra Single Seater Sofa in Dark Grey Velvet Upholstery Fabric.jpg', type: 'Velvet', config: '1 Seater', tag: 'New', price: 24000, originalPrice: 29000,
    specs: { length: '1005 mm', width: '875 mm', height: '900 mm', material: 'Velvet', color: 'Dark Grey' },
    description: 'Available in 1 Seater size configuration in Dark Grey colour variant. Zig-Zag Spring seat construction with high density foam for superior comfort. Product comes with 1 year warranty against manufacturing defect. Treated velvet upholstery in Dark Grey maintains its rich color and modern appearance. Velvet gives luxury, foam + springs give comfort, Pine wood frame gives durability, and premium legs add style & stability.',
    care: 'Do not move in assembled condition. Avoid moisture and chemicals. Dust with clean dry lint-free cloth.' },

  { id: 18, name: 'Riga Lyra 2 Seater Sofa (Brown Velvet)', image: '/sofas/Riga Lyra 2 Seater Sofa in Brown Velvet Upholstery Fabric.jpg', type: 'Velvet', config: '2 Seater', tag: 'New', price: 36000, originalPrice: 44000,
    specs: { length: '1540 mm', width: '875 mm', height: '900 mm', material: 'Velvet', color: 'Brown' },
    description: 'Available in 2 Seater size configuration in Brown colour variant. Zig-Zag Spring seat construction with high density foam for superior comfort. Product comes with 1 year warranty against manufacturing defect. Treated velvet upholstery in Brown maintains its rich color and elegant appearance. Velvet gives luxury, foam + springs give comfort, Pine wood frame gives durability, and premium legs add style & stability.',
    care: 'Do not move in assembled condition. Avoid moisture and chemicals. Dust with clean dry lint-free cloth.' },

  { id: 19, name: 'Perth Fabric Two Seater Sofa (Beige)', image: '/sofas/Perth Fabric Two Seater Sofa in Beige Colour.jpg', type: 'Fabric', config: '2 Seater', tag: 'Bestseller', price: 32000, originalPrice: 39000,
    specs: { length: '1740 mm', width: '1020 mm', height: '900 mm', netWt: '47 KG', material: 'Fabric (Polyester)', color: 'Beige' },
    description: 'The Perth sofa in beige is a statement in elegance with its curved silhouette that adds softness to your living spaces. The accent throw cushions offer contrast to the look with plush arms and seating. The sofa frame is made from kiln dried and chemically treated Solid wood — Termite resistant & borerproof. A Combination of No-Zag springs & Webbing with 32 Density high resilient foam for ultimate comfort. Contrast coloured Throw Pillows add oomph to this statement piece. Available in 2 Seater and Arm Chair.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 20, name: 'Perth Fabric Three Seater Sofa (Beige)', image: '/sofas/Perth Fabric Three Seater Sofa in Beige Colour.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 42000, originalPrice: 52000,
    specs: { length: '1740 mm', width: '1020 mm', height: '900 mm', material: 'Fabric (Polyester)', color: 'Beige' },
    description: 'The Perth sofa in beige is a statement in elegance with its curved silhouette that adds softness to your living spaces. Available first time ever in extended 3 seater size for plush seating. The sofa frame is made from kiln dried and chemically treated Solid wood — Termite resistant & borerproof. A Combination of No-Zag springs & Webbing with 32 Density high resilient foam is used in the construction. Also available in 2 Seater and Arm Chair. Available colours in Sofa — Beige.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 21, name: 'Arizona 3 Seater Sofa (Beige & Chenille)', image: '/sofas/Arizona 3 Seater Sofa Set in Beige & Colour Chenille fabric.jpg', type: 'Fabric', config: '2/3 Seater', tag: 'New', price: 38000, originalPrice: 46000,
    specs: { length: '1865 mm', width: '985 mm', height: '995 mm', material: 'Pine Wood, Chenille Fabric, Zig Zag Spring + High density foam', color: 'Beige & Brown' },
    description: 'ARIZONA FABRIC AND LEATHERETTE SOFA is available in 3–SEATER & 2-SEATER in combination of Beige and brown color. Elegant design with Fabric and leatherette upholstery & comfortable seating ergonomics. Designed with extra cushions for ultimate comfort and support. Elegant dual-material design — smooth leatherette frame with plush fabric seating. Supported by stylish, sturdy metal legs for a modern look. Zig Zag Spring seat construction with high density foam for superior comfort. Comes with 1 year warranty against manufacturing defect.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 22, name: 'ALABASTER Half Leather Sofa (2 Seater)', image: '/sofas/ALABASTER HALF LEATHER SOFA 2 seater.jpg', type: 'Half Leather', config: '2 Seater', tag: 'Premium', price: 52000, originalPrice: 63000,
    specs: { length: '1660 mm', width: '955 mm', height: '890 mm', material: 'Half Leather & Solid Wood', color: 'Brown' },
    description: 'Available in 2 and 3 seater configurations to suit various living space requirements. Features an elegant design with exotic half-leather upholstery for a premium look and feel. Provides an incredibly cozy and comfortable seating experience, ideal for modern homes. Zig-zag spring seat construction and high-density foam for superior comfort and shape retention. Internal frame is constructed from seasoned and treated pine wood for enhanced structural durability. Includes a 1-year warranty against manufacturing defects.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 23, name: 'ALABASTER Half Leather Sofa (3 Seater)', image: '/sofas/ALABASTER HALF LEATHER SOFA 3 seater.jpg', type: 'Half Leather', config: '3 Seater', tag: 'Premium', price: 68000, originalPrice: 82000,
    specs: { material: 'Half Leather & Solid Wood', color: 'Brown', config: '3 Seater' },
    description: 'Available in 2 and 3 seater configurations to suit various living space requirements. Features an elegant design with exotic half-leather upholstery for a premium look and feel. Provides an incredibly cozy and comfortable seating experience, ideal for modern homes. Durable and stylish metal legs provide robust support and a contemporary aesthetic. Zig-zag spring seat construction and high-density foam for superior comfort. Internal frame constructed from seasoned and treated pine wood for enhanced structural durability.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 24, name: 'Elise Velvet Fabric Sofa', image: '/sofas/Elise Velvet Fabric Sofa.jpg', type: 'Velvet', config: '2 Seater', tag: 'Premium', price: 48000, originalPrice: 58000,
    specs: { length: '1645 mm', width: '945 mm', height: '730 mm', netWt: '32 KG', material: 'Velvet Fabric', color: 'Rust' },
    description: 'This sofa is upholstered with high tensile strength & breathable Velvet Fabric which offers high durability and a luxurious, soft touch — ideal as a velvet sofa for contemporary living spaces. The sofa frame is crafted from kiln dried and chemically treated solid wood — termite resistant & borerproof. Designed for ultimate comfort, the seat combines No-Zag springs & webbing with 32 Density high resilient foam, topped with super soft foam. The fixed backrest features a stylish quilted design. Elegant gold tip leg detailing adds a touch of sophistication. Note: Cushions are not included.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 25, name: 'Valentina Fabric Sofa (Walnut)', image: '/sofas/Valentina Fabric Sofa In Walnut.jpg', type: 'Velvet', config: '3 Seater', tag: 'Premium', price: 58000, originalPrice: 70000,
    specs: { length: '2100 mm', width: '910 mm', height: '780 mm', material: 'Velvet', color: 'Walnut & Beige' },
    description: 'This sofa is upholstered with high tensile strength & breathable velvet fabric, offering exceptional durability and a plush, luxurious texture. Crafted with a kiln-dried and chemically treated solid wood frame — termite resistant and borerproof. The seat combines No-Zag springs and webbing paired with 28-density high resilient foam, topped with super soft foam. Featuring a meticulously crafted shesham wood body and water-repellent velvet upholstery, combining style and practicality for your living space.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight and sharp objects.' },

  { id: 26, name: 'Thames Fabric Sofa (Beige)', image: '/sofas/Thames Fabric Sofa In Beige Color.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 45000, originalPrice: 55000,
    specs: { length: '1829 mm', width: '1041 mm', height: '1016 mm', netWt: '53 KG', material: 'Fabric', color: 'Beige' },
    description: 'This sofa is upholstered with high tensile strength & breathable Velvet Fabric which offers high durability. The sofa frame is made from kiln dried and chemically treated Solidwood — termite resistant & borerproof. A combination of No-Zag springs & webbing with 32 density high resilient foam for ultimate comfort. Topped with a layer of super soft foam for added sitting comfort. Its fixed backrest features a stylish quilted design. Paired with reversible accent pillows and coordinated prints for added versatility and style.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 27, name: 'Siam Solidwood Sofa (Beige)', image: '/sofas/Siam Solidwood Sofa In Beige Color.jpg', type: 'Solid Wood', config: '3 Seater', tag: 'Premium', price: 72000, originalPrice: 87000,
    specs: { length: '707 mm', width: '900 mm', height: '770 mm', netWt: '30 KG', material: 'Mango + Acacia + Ply + Cane', color: 'Walnut Finish + Grey' },
    description: 'This sofa is upholstered with high tensile strength & breathable fabric, offering exceptional durability. Crafted from kiln-dried and chemically treated solid wood — termite resistant and borerproof. High-tensile elastic seat belt webbing combined with high-density 28 Kg/M3 foam for superior seating comfort. Natural cane paneling on the sides of the arms adds a contemporary and inviting aesthetic, lending a touch of elegance and warmth to your living space. This design seamlessly blends timeless style with modern comfort.',
    care: 'Due to change in climatic conditions, wood may expand or contract leading to hairline cracks. Do not move in assembled condition. Avoid moisture, high temperature or chemicals.' },

  { id: 28, name: 'Riga Fabric Sofa (Beige)', image: '/sofas/Riga Fabric Sofa In Beige Color.jpg', type: 'Fabric', config: '3 Seater', tag: 'Bestseller', price: 42000, originalPrice: 52000,
    specs: { length: '2080 mm', width: '875 mm', height: '900 mm', material: 'Fabric', color: 'Beige' },
    description: 'The Riga sofa is a stylish beige sofa designed to elevate modern interiors with comfort and understated elegance. Upholstered in premium fabric, this beige fabric sofa blends durability with refined aesthetics. Premium quality fabric upholstery for a refined and durable finish. S-Spring seating structure for balanced and long-lasting support. Soft, rounded armrests for enhanced relaxation. Tufted back cushions with detailed stitching for added stability. Elegant neutral tone suitable for drawing room settings. Durable upholstered construction designed for long-term use.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 29, name: 'Plume Velvet Fabric Sofa (Brown)', image: '/sofas/Plume Velvet Fabric Sofa In Brown Color.jpg', type: 'Velvet', config: '2 Seater', tag: 'Premium', price: 46000, originalPrice: 56000,
    specs: { length: '2230 mm', width: '945 mm', height: '895 mm', material: 'Velvet Fabric', color: 'Brown' },
    description: 'The Plume Sofa epitomizes plush elegance, seamlessly blending classic triangle-shaped quilting with modern design sensibilities. Upholstered in luxurious velvet fabric, it exudes warmth and comfort, inviting a cozy yet sophisticated ambiance. Thick 12MM gold-plated metal legs add a refined touch of sophistication. The frame is constructed from seasoned and treated solid wood for durability. Seating comfort enhanced through high-tensile Zig-Zag springs, elastic seat belt webbing, and high-density 28 Kg/M3 foam. Available in various living spaces — complements both modern and classic settings.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 30, name: 'Malta 1 Seater Sofa (Brown)', image: '/sofas/Malta 1 Seater Sofa Set In Brown Color.jpg', type: 'Fabric', config: '1 Seater', tag: 'New', price: 18000, originalPrice: 22000,
    specs: { length: '870 mm', width: '915 mm', height: '950 mm', material: 'Fabric', color: 'Brown' },
    description: 'The upholstery is crafted from high-quality, durable fabric that is easy to clean and designed to maintain its appearance over time. Featuring an S-Spring structure in the seating area, this sofa offers well-balanced, firm, and long-lasting support. Soft armrests contribute to a cozy and welcoming appeal. The back cushions showcase a tufted design with gentle stitching, adding an elegant and refined look. Finished with premium fabric upholstery that combines durability with style — a perfect blend of comfort and sophistication.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 31, name: 'Hercules Sofa (Beige)', image: '/sofas/Hercules Sofa In Beige Color.jpg', type: 'Leatherette', config: 'Set', tag: 'Bestseller', price: 78000, originalPrice: 95000,
    specs: { material: 'Leatherette Fabric + Solid Wood', color: 'Beige' },
    description: 'Experience the perfect blend of contemporary design and modern craftsmanship with this elegant fabric sofa series. Crafted to enhance your living space, these sofas are designed to become the centerpiece of your room, offering both style and comfort. Built with a sturdy frame made from seasoned and treated solid wood for long-lasting durability. S spring and elastic seat belt webbing combined with high-density 32 Kg/m³ foam for superior comfort. Upholstered in soft leatherette fabric with solid wood legs that add stability and classic elegance.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 32, name: 'Haku Fabric Sofa (Grey)', image: '/sofas/Haku Fabric Sofa In Grey Color.jpg', type: 'Fabric', config: '2 Seater', tag: 'Premium', price: 38000, originalPrice: 46000,
    specs: { length: '1840 mm', width: '845 mm', height: '760 mm', material: 'Boucle Fabric', color: 'Grey' },
    description: 'The Haku sofa exemplifies modern chic living with a design that elevates any space through its unique blend of elegance and comfort. Upholstered in luxurious Boucle fabric, known for its textured looped and curled yarns, this sofa offers a cozy and inviting texture. Inspired by the visionary essence of Pinakin Patel, this piece stands as a testament to the fusion of style and functionality. The wrap-around, bulbous neotenic form retains youthful charm, offering a minimalistic yet cute appeal. The sofa frame is built with seasoned and treated solid wood. Uniquely shaped legs contribute to the distinctive modern design.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 33, name: 'Genova Leatherette Sofa (Tan)', image: '/sofas/Genova Leatherette Sofa In Tan Color.jpg', type: 'Leatherette', config: '1/2/3 Seater', tag: 'New', price: 65000, originalPrice: 79000,
    specs: { length: '1380 mm', width: '925 mm', height: '960 mm', material: 'Premium Tan Leatherette + Pine Solid Wood', color: 'Tan' },
    description: 'The Genova leatherette sofa in tan color is a modern and durable seating solution crafted for stylish living spaces. Tall backrest with plush cushioning for enhanced comfort and support. Premium tan leatherette upholstery for a sophisticated, easy-to-clean finish. Ergonomic seating with high-density foam cushioning. Durable pine solid wood frame for long-lasting strength. High-density virgin foam (25-density, 95mm thickness). Available in single, two, and three-seater variants.',
    care: 'Use vacuum cleaner for cleaning fabric sofas. For stubborn stains, use mild solution of ivory soap and lukewarm water. Dust with dry cloth only.' },

  { id: 34, name: 'Bellrose Velvet Fabric Sofa (Brown)', image: '/sofas/Bellrose Velvet Fabric Sofa In Brown Color.jpg', type: 'Velvet', config: '2 Seater', tag: 'Premium', price: 48000, originalPrice: 58000,
    specs: { length: '2500 mm', width: '930 mm', height: '770 mm', material: 'Velvet Fabric', color: 'Brown' },
    description: 'The velvet fabric sofa seamlessly combines classic button-tufting with modern design, adding a sophisticated touch to any living space. Upholstered in rich velvet fabric with thick metallic gold legs that elevate its classy appearance. Designed by Pinakin Patel, this sofa exudes luxury and refinement. The frame is constructed from seasoned and treated solid wood for lasting durability. Seat construction incorporates high-tensile S springs and webbing with high-density foam. Featuring a graceful, low-profile design that makes a striking statement in any home.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 35, name: 'Asher Fabric Sofa (Grey)', image: '/sofas/Asher Fabric Sofa In Grey Color.jpg', type: 'Fabric', config: '2 Seater', tag: 'Bestseller', price: 32000, originalPrice: 39000,
    specs: { length: '1400 mm', width: '900 mm', height: '900 mm', material: 'Polyester + Cotton Fabric', color: 'Grey' },
    description: 'With its sleek lines and spacious comfort, this sofa embodies the essence of modern chic, offering a harmonious balance of warmth and sophistication. Designed by Pinakin Patel, it incorporates a blend of sleek design elements and premium materials. Capsule-shaped slim arms and a wide seat offer a perfect combination of sleek aesthetics and generous comfort. Raised sleek legs and a mid-height backrest contribute to a sense of spaciousness. Equipped with high-tensile Zig-Zag springs, elastic seat belt webbing, and high-density 28 Kg/M3 foam for medium-firm seating comfort.',
    care: 'Use vacuum cleaner for cleaning. Use sofa cleaners of reputed brands. For stubborn stains, use mild solution of ivory soap and lukewarm water. Avoid direct sunlight.' },

  { id: 36, name: 'Audi L Shape Sofa', image: '/sofas/Audi L Shape Sofa.jpg', type: 'Fabric', config: 'L Shape', tag: 'Premium', price: 95000, originalPrice: 115000,
    specs: { length: '120 inch', width: '110 inch', height: '36 inch', material: 'Fabric', color: 'Grey' },
    description: 'Discover the peak of elegance with our Audi L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure using a soft-bristled brush. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

  { id: 37, name: 'CAIRO (3+2)', image: '/sofas/CAIRO (3+2).jpg', type: 'Fabric', config: '3+2 Set', tag: 'Bestseller', price: 72000, originalPrice: 88000,
    specs: { length3S: '66 inch', width: '36 inch', netWt: '90 KG', grossWt: '100 KG', material: 'Fabric' },
    description: 'Discover the peak of elegance with our Cairo Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure. Blot spills immediately. Protect from direct sunlight and moisture. Avoid sharp objects and pet paws.' },

  { id: 38, name: 'ARROW 3S', image: '/sofas/ARROW 3S.jpg', type: 'Fabric', config: '3 Seater', tag: 'New', price: 35000, originalPrice: 43000,
    specs: { grossWt: '10 KG', material: 'Fabric' },
    description: 'Discover the peak of elegance with our Arrow 3S Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure. Blot spills immediately. Protect from direct sunlight and moisture. Avoid sharp objects.' },

  { id: 39, name: 'Reno L Shape Sofa', image: '/sofas/Reno-L-Shape.jpg', type: 'Fabric', config: 'L Shape', tag: 'Premium', price: 88000, originalPrice: 108000,
    specs: { length: '115 inch', width: '93 inch', height: '36 inch', material: 'Fabric' },
    description: 'Discover the peak of elegance with our Reno L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

  { id: 40, name: 'Cappuccino L Shape Sofa', image: '/sofas/Cappuccino L Shape Sofa.jpg', type: 'Fabric', config: 'L Shape', tag: 'New', price: 82000, originalPrice: 100000,
    specs: { material: 'Fabric' },
    description: 'Discover the peak of elegance with our Cappuccino L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
    care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture.' },

//   { id: 41, name: 'Harley L Shape & Divider Sofa', image: '/sofas/Harley L Shape & Divider Sofa.jpg', type: 'Fabric', config: 'L Shape', tag: 'Premium', price: 115000, originalPrice: 140000,
//     specs: { length: '112 inch', width: '88 inch', height: '37 inch', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Harley L Shape & Divider Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

//   { id: 42, name: 'Flair (3+2+2)', image: '/sofas/Flair (3+2+2).jpg', type: 'Fabric', config: '3+2+2 Set', tag: 'Bestseller', price: 95000, originalPrice: 115000,
//     specs: { length3S: '88 x 36 inch', length2S: '66 x 36 inch', length1S: '38 x 36 inch', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Flair (3+2+2) Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

//   { id: 43, name: 'Caffino L Shape (3+2+Corner+2 Round Chair)', image: '/sofas/Caffino L Shape (3+2+CORNER+2 ROUND CHAIR).jpg', type: 'Fabric', config: 'L Shape Set', tag: 'Premium', price: 125000, originalPrice: 152000,
//     specs: { length: '115 inch', width: '93 inch', height: '35 inch', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Caffino L Shape Sofa. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

//   { id: 44, name: 'Ontario (3+1+1) Sofa Set', image: '/sofas/Ontario (3+1+1) Sofa Set.jpg', type: 'Fabric', config: '3+1+1 Set', tag: 'Bestseller',
//     specs: { length3S: '75 x 31 inch', length1S: '34 x 31 inch', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Ontario (3+1+1) Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

//   { id: 45, name: 'Oyster (3+2+2) Sofa Set', image: '/sofas/Oyster (3+2+2) Sofa Set.jpg', type: 'Fabric', config: '3+2+2 Set', tag: 'Bestseller',
//     specs: { length3S: '90 x 36 inch', length2S: '66 x 36 inch', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Oyster (3+2+2) Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture. Professional cleaning every 5-6 months.' },

//   { id: 46, name: 'TURKEY (3+2)', image: '/sofas/TURKEY (3+2).jpg', type: 'Fabric', config: '3+2 Set', tag: 'Bestseller',
//     specs: { length: '84/60 inch', width: '36 inch', netWt: '180 KG', grossWt: '190 KG', material: 'Fabric' },
//     description: 'Discover the peak of elegance with our Turkey Sofa Set. This stunning piece of furniture is a testament to exquisite design and detailed craftsmanship. The soft and breathable upholstery offers a calming aura, creating a harmonious blend that soothes the senses. The tufted backrest and gracefully curved armrests add a touch of classic charm, making this sofa a timeless beauty. Crafted with a sturdy wooden frame, this sofa promises both durability and luxury, adding a touch of sophistication to your home for years to come.',
//     care: 'Vacuum at low pressure. Wipe wooden surface with wood-friendly cleansers. Blot spills immediately. Protect from direct sunlight and moisture.' },
];

const tagColors = {
  Bestseller: { bg: '#1a1714', color: '#f5f0e8' },
  New:        { bg: '#c9a96e', color: '#fff' },
  Premium:    { bg: '#2c4a2e', color: '#d4edda' },
};

const sortOptions = [
  { label: 'Popularity', value: 'default' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Name A–Z',   value: 'name-asc' },
  { label: 'Name Z–A',   value: 'name-desc' },
];

function StarRating({ rating = 4.5, count = 42 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:8 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12}
          fill={i <= Math.round(rating) ? '#c9a96e' : 'none'}
          stroke='#c9a96e' />
      ))}
      <span style={{ fontSize:'0.72rem', color:'#6b6359', marginLeft:2 }}>
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', gap:12, padding:'6px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ width:130, flexShrink:0, fontSize:'0.72rem', color:'#6b6359', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</span>
      <span style={{ fontSize:'0.78rem', color:'#1a1714' }}>{value}</span>
    </div>
  );
}

export default function SofaSetsPage({ onBack, selectedProductId }) {
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const wishlistItems       = useWishlistStore(s => s.items);
  const showToast           = useToastStore(s => s.show);

  const [sortBy,       setSortBy]       = useState('default');
  const [filterType,   setFilterType]   = useState([]);
  const [filterConfig, setFilterConfig] = useState([]);
  const [filterTag,    setFilterTag]    = useState([]);
  const [priceMin,     setPriceMin]     = useState('');
  const [priceMax,     setPriceMax]     = useState('');
  const [openSections, setOpenSections] = useState({ type: true, config: true, tag: true, price: true });
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [selectedSofa, setSelectedSofa] = useState(null);
  const [zoomImg,      setZoomImg]      = useState(null);

  useEffect(() => {
    if (selectedProductId) {
      const found = sofasData.find(s => String(s.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedSofa(found), 120);
    }
  }, [selectedProductId]);

  const toggleSection = useCallback(key => setOpenSections(s => ({ ...s, [key]: !s[key] })), []);

  // Stable ratings
  const stableRatings = useMemo(() =>
    sofasData.map(s => ({ id: s.id, rating: 4.0 + ((s.id * 17) % 10) / 10, count: 30 + ((s.id * 13) % 80) })),
    []
  );

  const types   = useMemo(() => [...new Set(sofasData.map(s => s.type))].sort(), []);
  const configs = useMemo(() => [...new Set(sofasData.map(s => s.config))].sort(), []);
  const tags    = useMemo(() => [...new Set(sofasData.map(s => s.tag))], []);

  const filtered = useMemo(() => {
    let arr = [...sofasData];
    if (filterType.length)   arr = arr.filter(s => filterType.includes(s.type));
    if (filterConfig.length) arr = arr.filter(s => filterConfig.includes(s.config));
    if (filterTag.length)    arr = arr.filter(s => filterTag.includes(s.tag));
    if (priceMin)            arr = arr.filter(s => s.price && s.price >= parseInt(priceMin));
    if (priceMax)            arr = arr.filter(s => s.price && s.price <= parseInt(priceMax));
    if (sortBy === 'name-asc')   arr.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'name-desc')  arr.sort((a,b) => b.name.localeCompare(a.name));
    if (sortBy === 'price-asc')  arr.sort((a,b) => (a.price||0) - (b.price||0));
    if (sortBy === 'price-desc') arr.sort((a,b) => (b.price||0) - (a.price||0));
    return arr;
  }, [sortBy, filterType, filterConfig, filterTag, priceMin, priceMax]);

  // Fix: wishlist stores full objects, check by id
  const isWishlisted = useCallback((id) => wishlistItems.some(i => i.id === id), [wishlistItems]);

  const handleWishlist = useCallback((sofa, e) => {
    e.stopPropagation();
    const result = toggleWishlistStore({ id: sofa.id, name: sofa.name, price: sofa.price, image: sofa.image });
    showToast(result === 'removed' ? 'Removed from wishlist' : `${sofa.name} added to wishlist`, result === 'removed' ? 'info' : 'success');
  }, [toggleWishlistStore, showToast]);

  // Encode image paths that may have spaces or special chars (prevents Vite URI malformed error)
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

        /* Sidebar filter chips */
        .sp-chip { display:inline-flex;align-items:center;gap:6px;font-family:'Jost',sans-serif;
          font-size:0.74rem;font-weight:500;color:#1a1714;background:none;
          border:1px solid rgba(0,0,0,0.12);padding:5px 10px;margin:3px 4px 3px 0;
          cursor:pointer;transition:all 0.18s; }
        .sp-chip.active { border-color:#c9a96e;color:#c9a96e;background:#fdf8ef; }
        .sp-chip:hover { border-color:#c9a96e; }
        .sp-filter-title { font-size:0.7rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 8px; }

        /* Detail panel */
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

        /* Mobile filter button */
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
          <h1 className="sp-heading">Sofa Sets</h1>
          <p className="sp-sub">Discover our complete collection of premium sofas — fabric, velvet, leather & more</p>
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
                          {sofa.type && <span className="sp-spec-chip">· {sofa.type}</span>}
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
                  <SpecRow label="Material Type"   value={sofa.type} />
                  <SpecRow label="Configuration"   value={sofa.config} />
                  <SpecRow label="Frame Material"  value={sofa.specs?.material} />
                  <SpecRow label="Colour"          value={sofa.specs?.color} />
                  <SpecRow label="Length"          value={sofa.specs?.length} />
                  <SpecRow label="3-Seater Size"   value={sofa.specs?.length3S} />
                  <SpecRow label="2-Seater Size"   value={sofa.specs?.length2S} />
                  <SpecRow label="1-Seater Size"   value={sofa.specs?.length1S} />
                  <SpecRow label="Width"           value={sofa.specs?.width} />
                  <SpecRow label="Height"          value={sofa.specs?.height} />
                  <SpecRow label="Net Weight"      value={sofa.specs?.netWt} />
                  <SpecRow label="Gross Weight"    value={sofa.specs?.grossWt} />
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