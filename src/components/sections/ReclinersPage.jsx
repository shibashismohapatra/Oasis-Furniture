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
        setScale(s => Math.min(4, Math.max(1, s + delta)));
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
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.92)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', top:16, right:16, display:'flex', gap:8, zIndex:10 }}>
        {[{ icon:<ZoomIn size={18}/>, fn:()=>zoom(1), title:'Zoom In' },
          { icon:<ZoomOut size={18}/>, fn:()=>zoom(-1), title:'Zoom Out' },
          { icon:<RotateCcw size={16}/>, fn:reset, title:'Reset' },
          { icon:<X size={18}/>, fn:onClose, title:'Close', hoverBg:'rgba(220,60,60,0.55)' }
        ].map(({icon,fn,title,hoverBg},i) => (
          <button key={i} onClick={fn} title={title}
            style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
              color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              backdropFilter:'blur(4px)', transition:'background 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=hoverBg||'rgba(255,255,255,0.28)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
            {icon}
          </button>
        ))}
      </div>
      <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
        background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:'0.72rem', letterSpacing:'0.10em',
        padding:'6px 16px', borderRadius:20, backdropFilter:'blur(4px)', pointerEvents:'none',
        textTransform:'uppercase', fontFamily:"'Jost',sans-serif" }}>
        {scale === 1 ? 'Scroll or tap + to zoom' : `Drag to pan · ${Math.round(scale*100)}%`}
      </div>
      <div ref={containerRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ width:'90vw', height:'90vh', display:'flex', alignItems:'center', justifyContent:'center',
          overflow:'hidden', cursor: scale>1 ? (dragging?'grabbing':'grab') : 'zoom-in' }}>
        <img src={src} alt={alt} draggable={false}
          style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain',
            transform:`scale(${scale}) translate(${pos.x/scale}px,${pos.y/scale}px)`,
            transition: dragging?'none':'transform 0.25s cubic-bezier(.22,1,.36,1)', userSelect:'none' }}/>
      </div>
    </div>
  );
}
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

const reclinersData = [
  {
    id: 'r1',
    name: 'ELIO Half Leather Electric Recliner',
    image: '/recliners/ELIO HALF LEATHER ELECTRIC RECLINER.jpg',
    type: 'Electric',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 42000,
    originalPrice: 52000,
    tag: 'Bestseller',
    specs: { brand: 'Hometown', sku: '6000439821', material: 'Leather + PVC', colour: 'Beige', dimensions: '199 × 108 × 108 cm' },
    description: 'Available in 3-Seater and 2-Seater configurations in elegant Beige. Premium genuine leather and breathable PVC upholstery for durability. Electric reclining mechanism for smooth, effortless one-touch control. Tall backrest with ergonomic design for enhanced back support. Sturdy seasoned and treated pine wood frame for lasting durability. Premium suspension with pocket springs, S-springs, and elastic webbing. High-density foam cushioning for superior comfort and shape retention.',
  },
  {
    id: 'r2',
    name: 'ELIO Half Leather 3-Seater Electric Recliner',
    image: '/recliners/ELIO HALF LEATHER 3STR ELECTRIC RECLINER.jpg',
    type: 'Electric',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 98000,
    originalPrice: 120000,
    tag: 'Premium',
    specs: { brand: 'Hometown', material: 'Leather + PVC', colour: 'Beige', dimensions: '199 × 108 × 108 cm' },
    description: 'Available in 3-Seater and 2-Seater configurations in elegant Beige. Premium genuine leather and breathable PVC upholstery for durability. Electric reclining mechanism for smooth, effortless one-touch control. Tall backrest with ergonomic design for enhanced back support. Sturdy seasoned and treated pine wood frame for lasting durability.',
  },
  {
    id: 'r3',
    name: 'Levanto Half Leather Zero Wall Electric Recliner — Ocean Blue',
    image: '/recliners/Levanto Half Leather Zero Wall Electric Recliner  Ocean Blue.jpg',
    type: 'Electric',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 48000,
    originalPrice: 59000,
    tag: 'New',
    specs: { brand: 'Hometown', sku: '6000439826', material: 'Half Leather (Top Grain Leather + Leatherette)', colour: 'Ocean Blue', dimensions: '1600 × 990 mm, Depth 1010 mm' },
    description: 'Available in 3-Seater & 2-Seater in Ocean Blue and Slate Grey colour. Elegant design with premium Leather upholstery & comfortable seating. Provides an ultimate lounging experience with smooth and effortless reclining. High-back segmented cushioning supports the neck, back, and lumbar for enhanced comfort. Frame construction in seasoned & treated solid wood for durability. Top grain premium Leather upholstery with matching leatherette.',
  },
  {
    id: 'r4',
    name: 'Levanto Half Leather Zero Wall Electric Recliner — Slate Grey',
    image: '/recliners/Levanto Half Leather Zero Wall Electric Recliner Slate Grey.jpg',
    type: 'Electric',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 48000,
    originalPrice: 59000,
    tag: 'New',
    specs: { brand: 'Hometown', sku: '6000439826', material: 'Half Leather (Top Grain Leather + Leatherette)', colour: 'Slate Grey', dimensions: '1600 × 990 mm, Depth 1010 mm' },
    description: 'Elegant design with premium Leather upholstery & comfortable seating. Smooth Electric reclining mechanism for easy operation and personalized comfort. High-back segmented cushioning supports the neck, back, and lumbar. Frame construction in seasoned & treated solid wood for durability. S-Spring and Elastic seat belt webbing together with high 25-density foam for greater seating comfort.',
  },
  {
    id: 'r5',
    name: 'Levanto Half Leather Zero Wall Electric Recliner 3-Seater — Slate Grey',
    image: '/recliners/Levanto Half Leather Zero Wall Electric Recliner  3 Seater  Slate Grey.jpg',
    type: 'Electric',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 118000,
    originalPrice: 145000,
    tag: 'Premium',
    specs: { brand: 'Hometown', sku: '6000439254', material: 'Half Leather (Top Grain Leather + Leatherette)', colour: 'Ocean Blue', dimensions: '2200 × 990 mm, Depth 1010 mm' },
    description: 'Available in 3-Seater & 2-Seater in Ocean Blue and Slate Grey colour. Elegant design with premium Leather upholstery & comfortable seating. Smooth Electric reclining mechanism for easy operation. High-back segmented cushioning supports the neck, back, and lumbar. A perfect blend of comfort and functionality — ideal for modern living spaces focused on everyday luxury.',
  },
  {
    id: 'r6',
    name: 'Haven Leatherette Manual Recliner 3-Seater — Dark Brown',
    image: '/recliners/Haven Leatherette Manual Recliner  3 Seater  Dark Brown.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Leatherette',
    price: 68000,
    originalPrice: 82000,
    tag: 'Bestseller',
    specs: { brand: 'Hometown', sku: '6000439818', material: 'Leatherette', colour: 'Dark Brown', dimensions: '2140 × 1035 mm, Depth 990 mm' },
    description: 'HAVEN LEATHERETTE RECLINER SERIES available in 3-Seater, 2-Seater and 1-Seater in Dark Brown. Premium leatherette upholstery offers a luxurious look with easy maintenance. 3-seater middle dropdown back features two convenient cup holders. Provides an incredibly cozy seating experience with ergonomic support. Tall headrest provides good neck and head support. Durable pine solidwood frame construction with S-Spring seat webbing.',
  },
  {
    id: 'r7',
    name: 'Haven Leatherette Manual Recliner — Dark Brown',
    image: '/recliners/Haven Leatherette Manual Recliner  Dark Brown.jpg',
    type: 'Manual',
    seater: '1 Seater',
    material: 'Leatherette',
    price: 32000,
    originalPrice: 39000,
    tag: 'Bestseller',
    specs: { brand: 'Hometown', sku: '6000439820', material: 'Leatherette', colour: 'Dark Brown', dimensions: '945 × 1035 mm, Depth 990 mm' },
    description: 'HAVEN LEATHERETTE RECLINER SERIES available in 3-Seater, 2-Seater and 1-Seater in Dark Brown. Premium leatherette upholstery offers a luxurious look with easy maintenance. Tall headrest provides good neck and head support. Durable pine solidwood frame. High-quality leatherette is resistant to wear and tear. Manual reclining mechanism allows smooth and effortless adjustment for personalized comfort.',
  },
  {
    id: 'r8',
    name: 'QUANTUM Half Leather 3-Seater Recliner — Light Grey',
    image: '/recliners/QUANTUM HALF LEATHER 3S RECLINER LT GREY.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 88000,
    originalPrice: 108000,
    tag: 'Premium',
    specs: { brand: 'Hometown', sku: '6000106995', material: 'Half Leather (Leather + PVC)', colour: 'Grey', dimensions: '2070 × 915 × 1020 mm' },
    description: 'QUANTUM HALF LEATHER RECLINER GREY available in 3-SEATER. Elegant design with tall backrest & additional back support in breathable PVC upholstery. Crafted from genuine leather exuding sophistication and elegance. Frame construction in seasoned & treated Pine Wood. Pocket Spring with Nozag spring seat construction with 30 Kg/M3 high density foam for superior comfort. High grade premium Leather & PVC upholstery.',
  },
  {
    id: 'r9',
    name: 'BRADFORD 1-Seater Electric Fabric Recliner — Beige Elite',
    image: '/recliners/BRADFORD 1S ELEC FABRIC REC BEIGE ELITE (2).jpg',
    type: 'Electric',
    seater: '1 Seater',
    material: 'Fabric',
    price: 38000,
    originalPrice: 47000,
    tag: 'New',
    specs: { brand: 'Hometown', sku: '6000439103', material: 'Pine Wood + Pocket Nozag Spring + 28Kg/M3 Foam', colour: 'Beige', dimensions: '935 × 935 × 1020 mm' },
    description: 'Bradford Electric fabric recliner 1 Seater with smooth electric reclining mechanism for effortless lounging at the touch of a button. Built-in USB charging ports let you charge your phone or gadgets right from your seat. S-Spring and pocket spring for enhanced seating comfort. 28 Kg/m3 density foam for superior seating experience. Premium Velvet Fabric upholstery.',
  },
  {
    id: 'r10',
    name: 'RIO Fabric 1-Seater Rocker Recliner — Brown',
    image: '/recliners/RIO FABRIC 1 STR ROCKER RECLINER BROWN.jpg',
    type: 'Manual',
    seater: '1 Seater',
    material: 'Fabric',
    price: 28000,
    originalPrice: 35000,
    tag: 'Bestseller',
    specs: { brand: 'Hometown', sku: '6000439116', material: 'Fabric', colour: 'Brown', dimensions: '970 × 960 × 1040 mm' },
    description: 'RIO FABRIC RECLINER available in 1-Seater in Brown. 1-Seater comes with Rocker, Swivel & Recliner function for versatile relaxation. 360° Swivel mechanism rotates smoothly. Pillow-top armrests for extended lounging. Pocket spring seat for extra support and comfort. Frames made of solid pinewood for long-term structural integrity. Manual Recliner Mechanism ensures smooth and durable reclining performance.',
  },
  {
    id: 'r11',
    name: 'RIO Fabric 2-Seater Recliner — Brown',
    image: '/recliners/RIO FABRIC 2 SEATER RECLINER BROWN.jpg',
    type: 'Manual',
    seater: '2 Seater',
    material: 'Fabric',
    price: 52000,
    originalPrice: 64000,
    tag: 'Bestseller',
    specs: { brand: 'Hometown', sku: '6000439115', material: 'Fabric', colour: 'Brown', dimensions: '1910 × 960 × 1040 mm' },
    description: 'RIO FABRIC RECLINER available in 2-Seater in Brown. Designed for comfortable seating with manual reclining functionality. Pillow-top armrests provide extra comfort. Pocket spring seat for extra support and comfort. Frames made of solid pinewood for long-term structural integrity. Manual Recliner Mechanism ensures smooth and durable reclining performance.',
  },
  {
    id: 'r12',
    name: 'QUANTUM ELITE Half Leather 1-Seater Recliner — Beige',
    image: '/recliners/QUANTUM ELITE HL 1S RECLINER LT BEIG.jpg',
    type: 'Manual',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 36000,
    originalPrice: 44000,
    tag: 'Premium',
    specs: { brand: 'Hometown', sku: '6000436559', material: 'Half Leather (Leather + PVC)', colour: 'Beige', dimensions: '960 × 915 × 1020 mm' },
    description: 'QUANTUM HALF LEATHER RECLINER BEIGE available in 1/2/3 Seater. Elegant design with tall backrest & additional back support in breathable PVC upholstery. Crafted from genuine leather for sophistication and elegance. Frame construction in seasoned & treated Pine Wood for product durability. Pocket Spring with Nozag spring seat construction with 30 Kg/M3 high density foam for superior comfort.',
  },
  {
    id: 'r13',
    name: 'QUANTUM ELITE Half Leather 2-Seater Recliner — Beige',
    image: '/recliners/QUANTUM ELITE HL 2S RECLINER LT BEIGE.jpg',
    type: 'Manual',
    seater: '2 Seater',
    material: 'Half Leather',
    price: 64000,
    originalPrice: 78000,
    tag: 'Premium',
    specs: { brand: 'Hometown', sku: '6000436558', material: 'Half Leather (Leather + PVC)', colour: 'Beige', dimensions: '1520 × 915 × 1020 mm' },
    description: 'QUANTUM HALF LEATHER RECLINER BEIGE available in 2-Seater (With 2 Recliners) in BEIGE. Elegant design with tall backrest & additional back support in breathable PVC upholstery. Pocket Spring with Nozag spring seat construction with 30 Kg/M3 high density foam. Dual reclining seats provide enhanced comfort and relaxation, perfect for couples or shared seating.',
  },
  {
    id: 'r14',
    name: 'QUANTUM ELITE Half Leather 3-Seater Recliner — Beige',
    image: '/recliners/QUANTUM ELITE HL 3S RECLINER LT BEIGE.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 92000,
    originalPrice: 112000,
    tag: 'Premium',
    specs: { brand: 'Hometown', sku: '6000436557', material: 'Half Leather (Leather + PVC)', colour: 'Beige', dimensions: '2070 × 915 × 1020 mm' },
    description: 'QUANTUM HALF LEATHER RECLINER BEIGE available in 3-Seater (With 2 Recliners) in BEIGE. Elegant design with tall backrest & additional back support. Pocket Spring with Nozag spring seat construction with 30 Kg/M3 high density foam. Spacious three-seater design with dual recliners offers luxurious comfort and ample seating for family and guests.',
  },
  {
    id: 'r15',
    name: 'Enfield Fabric 3-Seater Recliner — Black',
    image: '/recliners/Enfield Fabric 3 Seater Recliner-BLACK.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Fabric',
    price: 72000,
    originalPrice: 88000,
    tag: 'Bestseller',
    specs: { brand: 'HomeTown', sku: '830117351', material: 'Fabric', colour: 'Black', dimensions: '2250 × 1030 × 990 mm', warranty: '3 Years' },
    description: 'This fabric recliner shares a warm and soft relaxing experience with tall backrest and premium fabric upholstery. Cuddle-worthy comfort with a plush back and pillow top arms. Inbuilt console with charging points. Upholstered in high tensile strength & breathable Polyester Fabric. Kiln dried solid pine wood frame that is Termite resistant & borerproof. Middle backrest is a dropdown table with 2 plug points & 2 USB slots. Centre seat has a bottom pull-out drawer storage.',
  },
  {
    id: 'r16',
    name: 'Enfield Fabric 3-Seater Recliner — Grey',
    image: '/recliners/Enfield Fabric 3 Seater Recliner-GREY.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Fabric',
    price: 72000,
    originalPrice: 88000,
    tag: 'Bestseller',
    specs: { brand: 'HomeTown', sku: '830117321', material: 'Fabric', colour: 'Grey', dimensions: '2250 × 1030 × 990 mm', warranty: '3 Years' },
    description: 'This fabric recliner shares a warm and soft relaxing experience with tall backrest and premium fabric upholstery. Upholstered in high tensile strength & breathable Polyester Fabric. Kiln dried solid pine wood frame that is Termite resistant & borerproof. Three locking positions — Seating, TV Watching & Relaxing. Middle backrest is a dropdown table with 2 plug points & 2 USB slots for mobile charging.',
  },
  {
    id: 'r17',
    name: 'Emilia Half Leather 3-Seater Electric Recliner',
    image: '/recliners/Emilia Half Leather Three seater Electric Recliner.jpg',
    type: 'Electric',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 105000,
    originalPrice: 130000,
    tag: 'Premium',
    specs: { brand: 'HomeTown', sku: '830116098', material: 'Half Leather', colour: 'Blue', dimensions: '1900 × 1080 × 800 mm', warranty: '3 Years' },
    description: 'Sleek contemporary-modern half leather recliner for your home. Lean, adjustable headrest supported by a sturdy yet plush frame. Unique tucked-in armrests with striking piping. Semi Aniline Half Leather — leather in all body touching parts, colour-matched Leatherette elsewhere. Chemically treated and robust Engineered wood construction. Electrically operated for very smooth multi-position locking. Waterfall seat cushion design. Adjustable Headrest for personalized comfort.',
  },
  {
    id: 'r18',
    name: 'Emilia Half Leather 2-Seater Electric Recliner',
    image: '/recliners/Emilia Half Leather Two Seater Electric Recliner.jpg',
    type: 'Electric',
    seater: '2 Seater',
    material: 'Half Leather',
    price: 76000,
    originalPrice: 94000,
    tag: 'Premium',
    specs: { brand: 'HomeTown', sku: '830116267', material: 'Half Leather', colour: 'Light Grey', dimensions: '1520 × 1080 × 800 mm', warranty: '3 Years' },
    description: 'Sleek contemporary-modern half leather recliner. Lean, adjustable headrest supported by a sturdy yet plush frame. Unique tuck-in armrests with striking piping. Semi Aniline Half Leather upholstery — leather in body-touching parts, colour-matched Leatherette elsewhere. Electrically operated for smooth, multi-position locking. Waterfall seat cushion design gives leg support. Adjustable headrest for personalized comfort.',
  },
  {
    id: 'r19',
    name: 'Charles Half Leather 3-Seater Manual Recliner — Brown',
    image: '/recliners/Charles Half Leather Three Seater Recliner.jpg',
    type: 'Manual',
    seater: '3 Seater',
    material: 'Half Leather',
    price: 82000,
    originalPrice: 100000,
    tag: 'Bestseller',
    specs: { brand: 'HomeTown', sku: '830115295001', material: 'Half Leather', colour: 'Brown', dimensions: '1995 × 965 × 955 mm', warranty: '3 Years' },
    description: 'In a modern plush silhouette, this three-seater recliner offers the ultimate push-back and relax experience. Tuck-in pillow top and soft cushions on track arms. Semi Aniline Half Leather — leather in all body touching parts. Chemically treated Engineered wood construction, termite resistant & borerproof. No-Zag springs & webbing with 32 Density high resilient foam. Three locking positions — Seating, TV Watching & Relaxing. High Backrest for added comfort and support.',
  },
  {
    id: 'r20',
    name: 'Charles Half Leather 2-Seater Manual Recliner — Brown',
    image: '/recliners/Charles Half Leather Two Seater Recliner-BROWN.jpg',
    type: 'Manual',
    seater: '2 Seater',
    material: 'Half Leather',
    price: 58000,
    originalPrice: 72000,
    tag: 'Bestseller',
    specs: { brand: 'HomeTown', sku: '830115371001', material: 'Half Leather', colour: 'Brown', dimensions: '1450 × 965 × 955 mm', warranty: '3 Years' },
    description: 'In a modern plush silhouette, this two-seater recliner offers the ultimate push-back and relax experience. Tuck-in pillow top and soft cushions on track arms. Semi Aniline Half Leather upholstery — leather in body-touching parts, colour-matched Leatherette elsewhere. Manual Recliner with three locking positions — Seating, TV Watching & Relaxing. Waterfall seat cushion design. High backrest for added neck and lumbar support.',
  },
  {
    id: 'r21',
    name: 'Charles Half Leather Single Seater Manual Recliner — Brown',
    image: '/recliners/Charles Half Leather Single Seater Recliner-BROWN.jpg',
    type: 'Manual',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 38000,
    originalPrice: 47000,
    tag: 'New',
    specs: { brand: 'HomeTown', sku: '830115254001', material: 'Half Leather', colour: 'Brown', dimensions: '890 × 965 × 955 mm', warranty: '3 Years' },
    description: 'In a modern plush silhouette, this single seater recliner offers the ultimate push-back and relax experience. Semi Aniline Half Leather upholstery — leather in body-touching parts, colour-matched Leatherette elsewhere. Chemically treated, robust engineered wood — termite resistant and borerproof. No-Zag springs and webbing with 32-density high-resilience foam. Three locking positions — Seating, TV Watching & Relaxing. Equipped with a swivel function.',
  },
  {
    id: 'r22',
    name: 'Enfield Rocker Recliner — Grey',
    image: '/recliners/Enfield Rocker Recliner-GREY.jpg',
    type: 'Manual',
    seater: '1 Seater',
    material: 'Fabric',
    price: 32000,
    originalPrice: 40000,
    tag: 'New',
    specs: { brand: 'HomeTown', sku: '830117371', material: 'Fabric', colour: 'Brown', dimensions: '1020 × 1030 × 990 mm', warranty: '3 Years' },
    description: 'This fabric recliner shares a warm and soft relaxing experience with a larger-than-life tall backrest and premium upholstery. Enjoy cuddle-worthy comfort with a plush back and pillow-top arms. Multiple reclining angles to suit unique comfort needs. Kiln-dried and chemically treated solid pine wood frame — termite resistant & borerproof. No-Zag springs & webbing with 32 density high-resilient foam. Rocking function offering superior seating comfort.',
  },
  {
    id: 'r23',
    name: 'Zenora 1-Seater Double Electric Recliner Sofa — Brown',
    image: '/recliners/Zenora 1 Seater Double Electric Recliner Sofa-BROWN.jpg',
    type: 'Electric',
    seater: '1 Seater',
    material: 'Half Leather',
    price: 56000,
    originalPrice: 69000,
    tag: 'Premium',
    specs: { brand: 'HomeTown', sku: '830118431', material: 'Half Leather', colour: 'Brown', dimensions: '980 × 1000 × 1000 mm', warranty: '3 Years' },
    description: 'Half-leather electric recliner with a double motor system. Double motors allow independent control of footrest and backrest for precise, smooth adjustments. Tall headrest for excellent neck and head support. Power headrest is adjustable via electric motor. Push-out cup holder integrated into the armrest. Console option includes storage plus USB and C-plug ports. Breathable genuine top-grade leather. Thoughtfully designed for modern living rooms.',
  },
  {
    id: 'r24',
    name: 'Plush 3-Seater Leather Electric Recliner Sofa — Burgundy',
    image: '/recliners/Plush 3 Seater Leather Electric Recliner Sofa-BURGUNDY.jpg',
    type: 'Electric',
    seater: '3 Seater',
    material: 'Leather',
    price: 115000,
    originalPrice: 142000,
    tag: 'Premium',
    specs: { brand: 'HomeTown', sku: '830115361001', material: 'Leather', colour: 'Burgundy', dimensions: '1625 × 1003 × 1015 mm', warranty: '3 Years' },
    description: 'This leather recliner shares a warm and soft relaxing experience with tall backrest and premium fabric upholstery. Cuddle-worthy comfort with a plush back and pillow top arms. Inbuilt console with various charging points. Upholstered in high tensile strength Polyester Fabric. Kiln dried solid pine wood frame — Termite resistant & borerproof. Middle backrest dropdown table with 2 plug points & 2 USB slots. Centre seat has bottom pull-out drawer storage.',
  },
];

// Stable ratings seeded by id
const stableRatings = reclinersData.map((r, i) => ({
  id: r.id,
  rating: +(4.3 + ((i * 19 + 5) % 8) / 10).toFixed(1),
  count: 15 + ((i * 37 + 11) % 130),
}));

const tagColors = {
  'New':        { bg: '#1a1714', color: '#fff' },
  'Bestseller': { bg: '#c9a96e', color: '#fff' },
  'Premium':    { bg: '#2c3e50', color: '#fff' },
  'Sale':       { bg: '#c0392b', color: '#fff' },
};

const sortOptions = [
  { label: 'Popularity',           value: 'popularity' },
  { label: 'Price — Low to High',  value: 'price_asc'  },
  { label: 'Price — High to Low',  value: 'price_desc' },
  { label: 'Newest First',         value: 'newest'     },
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

export default function ReclinersPage({ onBack, productId }) {
  const [sortBy,       setSortBy]       = useState('popularity');
  const [filterSeater, setFilterSeater] = useState([]);
  const [filterType,   setFilterType]   = useState([]);
  const [filterMat,    setFilterMat]    = useState([]);
  const [filterTag,    setFilterTag]    = useState([]);
  const [priceMin,     setPriceMin]     = useState('');
  const [priceMax,     setPriceMax]     = useState('');
  const [selected,     setSelected]     = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const productRefs = useRef({});
  const [zoomImg,      setZoomImg]      = useState(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [openSections, setOpenSections] = useState({ seater: true, type: true, material: true, tag: true, price: true });
  const [wishlist,     setWishlist]     = useState([]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  // Auto-scroll to product from search
  useEffect(() => {
    if (!productId) return;
    const timer = setTimeout(() => {
      const el = productRefs.current[productId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightId(productId);
        setTimeout(() => setHighlightId(null), 2500);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [productId]);

  const filtered = useMemo(() => {
    let items = [...reclinersData];
    if (filterSeater.length) items = items.filter(r => filterSeater.includes(r.seater));
    if (filterType.length)   items = items.filter(r => filterType.includes(r.type));
    if (filterMat.length)    items = items.filter(r => filterMat.includes(r.material));
    if (filterTag.length)    items = items.filter(r => filterTag.includes(r.tag));
    if (priceMin)            items = items.filter(r => r.price >= parseInt(priceMin));
    if (priceMax)            items = items.filter(r => r.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a,b) => a.price - b.price);
      case 'price_desc': return items.sort((a,b) => b.price - a.price);
      case 'newest':     return [...items].reverse();
      default:           return items;
    }
  }, [filterSeater, filterType, filterMat, filterTag, priceMin, priceMax, sortBy]);

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

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <>
      <style>{`
        .rp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .rp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .rp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .rp-back:hover { color:#1a1714; }
        .rp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .rp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .rp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .rp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .rp-main { padding:24px 32px 60px; }
        .rp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .rp-count { font-size:0.78rem;color:#6b6359; }
        .rp-count strong { color:#1a1714;font-weight:600; }
        .rp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .rp-sort::-webkit-scrollbar { display:none; }
        .rp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .rp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .rp-sort-btn.active,.rp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        /* Product list rows */
        .rp-list { display:flex;flex-direction:column;gap:16px; }
        .rp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .rp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .rp-row.highlighted { box-shadow:0 0 0 3px #c9a96e, 0 6px 28px rgba(201,169,110,0.25)!important; border-color:#c9a96e!important; animation: rpHighlight 2.5s ease forwards; }
        @keyframes rpHighlight { 0%,80% { box-shadow:0 0 0 3px #c9a96e, 0 6px 28px rgba(201,169,110,0.25); } 100% { box-shadow:none; border-color:rgba(0,0,0,0.07); } }
        .rp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .rp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .rp-row:hover .rp-row-img { transform:scale(1.04); }
        .rp-row-tag { position:absolute;top:12px;left:12px;font-size:0.62rem;font-weight:700;
          letter-spacing:0.10em;text-transform:uppercase;padding:4px 8px; }
        .rp-row-body { flex:1;padding:20px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .rp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.22rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:0.01em;line-height:1.25; }
        .rp-row-meta { font-size:0.74rem;color:#8a8278;letter-spacing:0.03em;margin-bottom:10px; }
        .rp-row-price { display:flex;align-items:baseline;gap:10px;margin-bottom:14px; }
        .rp-row-price-cur { font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:700;color:#1a1714; }
        .rp-row-price-old { font-size:0.88rem;color:#aaa;text-decoration:line-through; }
        .rp-row-price-off { font-size:0.72rem;font-weight:600;color:#27ae60;letter-spacing:0.03em; }
        .rp-row-actions { display:flex;gap:10px;align-items:center; }
        .rp-btn-cart { display:flex;align-items:center;gap:7px;background:#1a1714;color:#fff;
          border:none;padding:10px 20px;font-family:'Jost',sans-serif;font-size:0.80rem;
          font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;
          transition:background 0.18s; }
        .rp-btn-cart:hover { background:#c9a96e; }
        .rp-btn-wish { background:none;border:1px solid rgba(0,0,0,0.15);padding:9px 12px;
          cursor:pointer;display:flex;align-items:center;justify-content:center;
          color:#6b6359;transition:all 0.18s; }
        .rp-btn-wish:hover,.rp-btn-wish.active { border-color:#e8767b;color:#e8767b; }
        .rp-row-specs { display:flex;gap:18px;flex-wrap:wrap;margin-bottom:10px; }
        .rp-spec-chip { font-size:0.70rem;font-weight:500;color:#6b6359;background:#f5f0e8;
          padding:3px 9px;border-radius:2px;letter-spacing:0.04em;white-space:nowrap; }

        /* Detail slide-in panel */
        .rp-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:600;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .rp-panel { background:#fff;width:min(620px,100vw);height:100vh;overflow-y:auto;
          animation:rpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes rpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .rp-panel-img { width:100%;height:360px;object-fit:contain;background:#f5f0e8; }
        .rp-panel-body { padding:28px 32px 48px; }
        .rp-panel-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .rp-panel-close:hover { background:#fff; }
        .rp-panel-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .rp-panel-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 6px;line-height:1.2; }
        .rp-panel-meta { font-size:0.74rem;color:#8a8278;letter-spacing:0.05em;margin-bottom:10px;text-transform:uppercase; }
        .rp-panel-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .rp-panel-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .rp-panel-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .rp-panel-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .rp-panel-divider { height:1px;background:rgba(0,0,0,0.07);margin:16px 0; }
        .rp-panel-section-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .rp-panel-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .rp-panel-actions { display:flex;gap:12px;flex-wrap:wrap;margin-top:8px; }
        .rp-panel-atc { flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;min-width:180px;transition:background 0.2s; }
        .rp-panel-atc:hover { background:#c9a96e; }

        /* Sidebar filter checkboxes */
        .rp-check { display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 0; }
        .rp-check input { width:14px;height:14px;accent-color:#c9a96e;cursor:pointer; }
        .rp-check-label { font-size:0.82rem;color:#2a2520;user-select:none; }
        .rp-check-count { font-size:0.70rem;color:#aaa;margin-left:auto; }
        .rp-sidebar-title { font-size:0.72rem;font-weight:700;letter-spacing:0.12em;
          text-transform:uppercase;color:#1a1714;margin:0 0 18px; }
        .rp-clear-btn { font-size:0.72rem;color:#c9a96e;background:none;border:none;
          cursor:pointer;text-decoration:underline;padding:0;letter-spacing:0.04em; }

        /* Mobile filter toggle */
        .rp-mob-filter-btn { display:none;align-items:center;gap:8px;background:#1a1714;
          color:#fff;border:none;padding:10px 18px;font-family:'Jost',sans-serif;
          font-size:0.78rem;font-weight:600;letter-spacing:0.08em;cursor:pointer; }

        @media (max-width: 900px) {
          .rp-layout { grid-template-columns:1fr; }
          .rp-sidebar { display:none;position:fixed;inset:0;z-index:300;height:100%;
            overflow-y:auto;padding:40px 24px; }
          .rp-sidebar.open { display:block; }
          .rp-mob-filter-btn { display:flex; }
          .rp-hero { padding:24px 20px 20px; }
          .rp-heading { font-size:2rem; }
          .rp-main { padding:16px 16px 60px; }
          .rp-row-img-wrap { width:140px; }
          .rp-row-img { height:160px; }
          .rp-panel { width:100vw; }
          .rp-panel-img { height:260px; }
        }
      `}</style>

      <div className="rp-root">
        {/* Hero */}
        <div className="rp-hero">
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="rp-back" onClick={onBack}>
              <ArrowLeft size={13} /> Back to Home
            </button>
            <h1 className="rp-heading">Recliner Sofas</h1>
            <p className="rp-sub">Premium recliners — electric, manual &amp; rocker styles for every living room</p>
          </div>
        </div>

        <div className="rp-layout">
          {/* Sidebar */}
          <aside className={`rp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="rp-sidebar-title" style={{ margin: 0 }}>Filters</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button className="rp-clear-btn" onClick={() => {
                  setFilterSeater([]); setFilterType([]); setFilterMat([]); setFilterTag([]);
                  setPriceMin(''); setPriceMax('');
                }}>Clear All</button>
                {filterOpen && (
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1714' }} onClick={() => setFilterOpen(false)}>
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {renderFilterSection('Seating', 'seater', (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['1 Seater', '2 Seater', '3 Seater'].map(v => (
                  <label key={v} className="rp-check">
                    <input type="checkbox" checked={filterSeater.includes(v)}
                      onChange={() => toggleArr(filterSeater, setFilterSeater, v)} />
                    <span className="rp-check-label">{v}</span>
                    <span className="rp-check-count">{reclinersData.filter(r => r.seater === v).length}</span>
                  </label>
                ))}
              </div>
            ))}

            {renderFilterSection('Mechanism', 'type', (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Electric', 'Manual'].map(v => (
                  <label key={v} className="rp-check">
                    <input type="checkbox" checked={filterType.includes(v)}
                      onChange={() => toggleArr(filterType, setFilterType, v)} />
                    <span className="rp-check-label">{v}</span>
                    <span className="rp-check-count">{reclinersData.filter(r => r.type === v).length}</span>
                  </label>
                ))}
              </div>
            ))}

            {renderFilterSection('Material', 'material', (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Half Leather', 'Leather', 'Leatherette', 'Fabric'].map(v => (
                  <label key={v} className="rp-check">
                    <input type="checkbox" checked={filterMat.includes(v)}
                      onChange={() => toggleArr(filterMat, setFilterMat, v)} />
                    <span className="rp-check-label">{v}</span>
                    <span className="rp-check-count">{reclinersData.filter(r => r.material === v).length}</span>
                  </label>
                ))}
              </div>
            ))}

            {renderFilterSection('Collection', 'tag', (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['New', 'Bestseller', 'Premium'].map(v => (
                  <label key={v} className="rp-check">
                    <input type="checkbox" checked={filterTag.includes(v)}
                      onChange={() => toggleArr(filterTag, setFilterTag, v)} />
                    <span className="rp-check-label">{v}</span>
                    <span className="rp-check-count">{reclinersData.filter(r => r.tag === v).length}</span>
                  </label>
                ))}
              </div>
            ))}

            {renderFilterSection('Price Range', 'price', (
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Min ₹" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '50%', border: '1px solid rgba(0,0,0,0.15)', padding: '7px 10px',
                    fontFamily: "'Jost', sans-serif", fontSize: '0.82rem', color: '#1a1714', outline: 'none' }} />
                <input type="number" placeholder="Max ₹" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '50%', border: '1px solid rgba(0,0,0,0.15)', padding: '7px 10px',
                    fontFamily: "'Jost', sans-serif", fontSize: '0.82rem', color: '#1a1714', outline: 'none' }} />
              </div>
            ))}
          </aside>

          {/* Main */}
          <main className="rp-main">
            <div className="rp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="rp-mob-filter-btn" onClick={() => setFilterOpen(o => !o)}>
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="rp-count"><strong>{filtered.length}</strong> recliners</span>
              </div>
              <div className="rp-sort">
                <span className="rp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`rp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            <div className="rp-list">
              {filtered.map((item) => {
                const r = stableRatings.find(x => x.id === item.id) || { rating: 4.5, count: 0 };
                const discount = Math.round((1 - item.price / item.price) * 100); // kept for structure
                const discountPct = Math.round((1 - item.price / item.originalPrice) * 100);
                return (
                  <div key={item.id} className={`rp-row${highlightId === item.id ? ' highlighted' : ''}`}
                    ref={el => { if (el) productRefs.current[item.id] = el; }}
                    onClick={() => setSelected(item)}>
                    <div className="rp-row-img-wrap">
                      <img src={item.image} alt={item.name} className="rp-row-img"
                        style={{ cursor:'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                      <span className="rp-row-tag" style={{ background: tagColors[item.tag]?.bg, color: tagColors[item.tag]?.color }}>
                        {item.tag}
                      </span>
                    </div>
                    <div className="rp-row-body">
                      <div>
                        <h3 className="rp-row-name">{item.name}</h3>
                        <p className="rp-row-meta">{item.seater} · {item.type} · {item.material}</p>
                        <StarRating rating={r.rating} count={r.count} />
                        <div className="rp-row-specs">
                          <span className="rp-spec-chip">{item.seater}</span>
                          <span className="rp-spec-chip">{item.type} Recliner</span>
                          <span className="rp-spec-chip">{item.material}</span>
                        </div>
                        <p style={{ fontSize: '0.80rem', color: '#6b6359', lineHeight: 1.55, margin: '0 0 12px',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <div className="rp-row-price">
                          <span className="rp-row-price-cur">{fmt(item.price)}</span>
                          <span className="rp-row-price-old">{fmt(item.originalPrice)}</span>
                          <span className="rp-row-price-off">{discountPct}% off</span>
                        </div>
                        <div className="rp-row-actions">
                          <button className="rp-btn-cart" onClick={(e) => handleAddToCart(item, e)}>
                            <ShoppingBag size={14} /> Add to Cart
                          </button>
                          <button className={`rp-btn-wish${wishlist.includes(item.id) ? ' active' : ''}`}
                            onClick={(e) => handleWishlist(item, e)}>
                            <Heart size={16} fill={wishlist.includes(item.id) ? '#e8767b' : 'none'} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#8a8278' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', marginBottom: 8 }}>No recliners match your filters</p>
                <p style={{ fontSize: '0.85rem' }}>Try adjusting or clearing your filters</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Detail Slide-in Panel */}
      {selected && (() => {
        const r = stableRatings.find(x => x.id === selected.id) || { rating: 4.5, count: 0 };
        const discountPct = Math.round((1 - selected.price / selected.originalPrice) * 100);
        const tc = tagColors[selected.tag] || { bg: '#1a1714', color: '#fff' };
        return (
          <div className="rp-overlay" onClick={() => setSelected(null)}>
            <div className="rp-panel" onClick={e => e.stopPropagation()}>
              <button className="rp-panel-close" onClick={() => setSelected(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: selected.image, alt: selected.name })}>
                <img className="rp-panel-img" src={selected.image} alt={selected.name} />
                <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.45)',
                  color:'#fff', borderRadius:'50%', width:34, height:34,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  backdropFilter:'blur(3px)', pointerEvents:'none' }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="rp-panel-body">
                <span className="rp-panel-tag" style={{ background: tc.bg, color: tc.color }}>{selected.tag}</span>
                <h2 className="rp-panel-name">{selected.name}</h2>
                <p className="rp-panel-meta">{selected.seater} · {selected.type} Recliner · {selected.material}</p>
                <StarRating rating={r.rating} count={r.count} />
                <div className="rp-panel-price-row">
                  <span className="rp-panel-price">{fmt(selected.price)}</span>
                  <span className="rp-panel-orig">{fmt(selected.originalPrice)}</span>
                  <span className="rp-panel-disc">{discountPct}% off</span>
                </div>
                <div className="rp-panel-divider" />
                <p className="rp-panel-section-title">Description</p>
                <p className="rp-panel-desc">{selected.description}</p>
                <div className="rp-panel-divider" />
                <p className="rp-panel-section-title">Specifications</p>
                <SpecRow label="Brand"      value={selected.specs.brand} />
                <SpecRow label="SKU"        value={selected.specs.sku} />
                <SpecRow label="Material"   value={selected.specs.material} />
                <SpecRow label="Colour"     value={selected.specs.colour} />
                <SpecRow label="Dimensions" value={selected.specs.dimensions} />
                <SpecRow label="Warranty"   value={selected.specs.warranty} />
                <div className="rp-panel-actions">
                  <button className="rp-panel-atc" onClick={(e) => { handleAddToCart(selected, e); setSelected(null); }}>
                    <ShoppingBag size={15}/> Add to Cart
                  </button>
                  <button onClick={(e) => handleWishlist(selected, e)} style={{
                    padding:'14px 18px', border:'1px solid rgba(0,0,0,0.15)', background:'#fff',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                    fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600,
                    letterSpacing:'0.10em', textTransform:'uppercase',
                    color: wishlist.includes(selected.id) ? '#c0392b' : '#1a1714',
                    borderColor: wishlist.includes(selected.id) ? '#c0392b' : 'rgba(0,0,0,0.15)'
                  }}>
                    <Heart size={14} fill={wishlist.includes(selected.id) ? '#c0392b' : 'none'} />
                    {wishlist.includes(selected.id) ? 'Wishlisted' : 'Wishlist'}
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