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
            Coffee Table Data
───────────────────────────────────────────── */
const coffeeTableData = [
  {
    id: 1,
    name: 'Antwerp Center Table in Sheesham Colour',
    image: '/coffee-tables/Antwerp Center Table in Sheesham Colour.jpg',
    type: 'Centre Table',
    material: 'Engineered Wood',
    finish: 'Sheesham',
    tag: 'Bestseller',
    price: 18500,
    originalPrice: 23000,
    specs: { brand: 'HomeTown', sku: '6000440503', material: 'Particle Board + Melamine', colour: 'Walnut', dimensions: '1100 × 500 × 550 mm', weight: '24 kg', warranty: '1 Year', length: '≈ 3.6 ft', width: '≈ 1.6 ft', height: '≈ 1.8 ft' },
    description: 'A modern elegance in all its angles and grooves, the Antwerp flute center table stands apart with its fluted apron details. The table offers an open shelf to store your quick access knick knacks. Crafted with a seamless and minimalistic construct, the table adds warmth to your space with its sheesham wood finish. Made from environment friendly European Standard Engineered wood with scratch resistant melamine coating. Edge banding on all sides and lamination on all open exposed surfaces to protect from moisture. This product is termite and borer proof.',
  },
  {
    id: 2,
    name: 'Antwerp Sheesham Wood Center Table with Black Glass Top',
    image: '/coffee-tables/Antwerp Sheesham Wood Center Table with Black Glass Top in Sheesham Colour.jpg',
    type: 'Centre Table',
    material: 'Engineered Wood',
    finish: 'Sheesham',
    tag: 'New',
    price: 16500,
    originalPrice: 21000,
    specs: { brand: 'HomeTown', sku: '6000440502', material: 'Particle Board', colour: 'Walnut', dimensions: '800 × 350 × 800 mm', weight: '21 kg', warranty: '1 Year', length: '≈ 2.6 ft', width: '≈ 1.1 ft', height: '≈ 2.6 ft' },
    description: 'The Antwerp center table stands in perfect geometry with clean straight lines and a fitted glass top. Crafted with sturdy joineries, the table offers generous storage and décor space with an open shelf below. Store your quick access knick knacks, magazines, and other miscellaneous things. The warm toned center table has a sheesham finish, exuding a deep rich look. The glass top enables ease of cleaning and gives a semi clear view of the bottom shelf. This product is termite and borer proof.',
  },
  {
    id: 3,
    name: 'Cady Metal Nesting Coffee Table Set In Black Finish (Set of 2)',
    image: '/coffee-tables/Cady Metal Nesting Coffee Table Set In Black Finish (Set of 2).jpg',
    type: 'Nesting Set',
    material: 'Iron',
    finish: 'Black',
    tag: 'Premium',
    price: 22000,
    originalPrice: 28000,
    specs: { brand: 'Bohemiana from Pepperfry', sku: 'FM1904642', colour: 'Black', dimensions: 'H 43.18 × W 81.28 × D 81.28 cm', topMaterial: 'Wood and Cement', weight: '20.6 kg', warranty: '36 Months' },
    description: 'The Cady Metal Nesting Coffee Table Set brings an industrial-chic aesthetic to your living room. Crafted in Iron with a rich Black powder-coat finish, this set of 2 tables features a striking combination of wood and cement tops. The nesting design allows the smaller table to tuck neatly under the larger one, offering flexible arrangement for everyday use and entertaining. No assembly required — these stylish tables are ready to elevate your living space right out of the box.',
  },
  {
    id: 4,
    name: 'Christine Marble Top Center Table with Two Stools in Brown',
    image: '/coffee-tables/Christine Marble Top Center Table with Two Stools in Brown Colour.jpg',
    type: 'Centre Table',
    material: 'Marble + Mango Wood',
    finish: 'Brown',
    tag: 'Premium',
    price: 32000,
    originalPrice: 40000,
    specs: { brand: 'HomeTown', sku: '6000440521', material: 'Marble Top + Mango Wood', colour: 'Brown', dimensions: '900 × 900 × 520 mm', warranty: '1 Year', length: '≈ 3.0 ft', width: '≈ 3.0 ft', height: '≈ 1.7 ft' },
    description: 'The Christine centre table is designed in modern-contemporary aesthetics with utilities in mind. The all-in-one table is adorned with gorgeous white marble top placed on a structured dense hardwood native to India. The natural veining of the marble top makes each table uniquely yours. The table comes with two stools that can be placed under the table when not in use and a half bottom shelf to store knick-knacks. The stools are upholstered in high quality leatherette — comfortable and easy to maintain. This product is termite and borer proof.',
  },
  {
    id: 5,
    name: 'Elvas S Metal Round Nesting Coffee Table Set In Gold Finish (Set of 2)',
    image: '/coffee-tables/Elvas S Metal Round Nesting Coffee Table Set In Gold Finish with White Porcelain Top (Set of 2).jpg',
    type: 'Nesting Set',
    material: 'Metal',
    finish: 'Gold',
    tag: 'Premium',
    price: 25500,
    originalPrice: 32000,
    specs: { brand: 'Casacraft from Pepperfry', sku: 'FM2313068', colour: 'Golden', dimensionsBig: 'H 46 × W 53 × D 53 cm', dimensionsSmall: 'H 41 × W 46 × D 46 cm', topMaterial: 'Porcelain', weight: '19 kg', warranty: '36 Months' },
    description: 'Elevate your living space with the Elvas S Metal Round Nesting Coffee Table Set in a stunning Gold finish. This exquisite set of 2 features a graceful round design with a premium white porcelain top that beautifully contrasts the warm gold metal base. The nesting configuration makes it easy to tuck the smaller table under the larger one, saving space while maintaining a luxurious look. No assembly required — these statement pieces are ready to transform your living room into an elegant retreat.',
  },
  {
    id: 6,
    name: 'Giove Marble & Iron Center Table in White & Gold',
    image: '/coffee-tables/Giove Marble & Iron Center Table in White & Gold Colour.jpg',
    type: 'Centre Table',
    material: 'Marble & Iron',
    finish: 'White & Gold',
    tag: 'Premium',
    price: 38000,
    originalPrice: 47000,
    specs: { brand: 'HomeTown', sku: '6000094496', material: 'Marble + High Grade Mild Steel', colour: 'White + Gold', dimensions: '1219 × 609 × 431 mm', warranty: '1 Year', length: '≈ 4.0 ft', width: '≈ 2.0 ft', height: '≈ 1.4 ft' },
    description: 'Bring home the perfect combination of elegance and luxury with the Giove center table. The premium milky white marble fills your space with clean and brightening aesthetics. The oval marble top is beautifully complemented with a contemporary gold coated table frame joined with eye-catching sculptured legs. The base is made of High Grade Mild Steel with Gold powder coating for lasting durability. Pair with Giove side and console table to complete the luxurious look. This product is termite and borer proof.',
  },
  {
    id: 7,
    name: 'GLACIA 4 Seater Marble Finish Dining Table',
    image: '/coffee-tables/GLACIA 4 STR MARBLE FINISH DINING TABLE.jpg',
    type: 'Dining Table',
    material: 'Solid Rubber Wood',
    finish: 'Brown',
    tag: 'New',
    price: 28000,
    originalPrice: 35000,
    specs: { brand: 'Hometown', sku: '830118746', material: 'Solid Rubber Wood', colour: 'Brown', dimensions: '1200 × 750 × 760 mm', length: '≈ 3.9 ft', width: '≈ 2.5 ft', height: '≈ 2.5 ft' },
    description: 'The GLACIA Dining Table is available in a 4-seater configuration with a rectangular shape and smooth surface that adds a premium and modern appeal to any dining space. The table features a marble-inspired design that mimics the look of real stone, enhancing its visual appeal. The Solid Rubber Wood frame provides excellent stability and long-lasting support. The product is seasoned and chemically treated to enhance its durability. The non-porous surface resists stains and can be wiped clean effortlessly. Features 65 mm thick solid wood legs for strong stability.',
  },
  {
    id: 8,
    name: 'GLAMORA Marble Top 6 Seater Dining Table',
    image: '/coffee-tables/GLAMORA MARBLE TOP 6 STR DINING TABLE.jpg',
    type: 'Dining Table',
    material: 'Marble Top & Stainless Steel',
    finish: 'Dark Grey',
    tag: 'Bestseller',
    price: 42000,
    originalPrice: 52000,
    specs: { brand: 'Hometown', sku: '830118491', material: 'Marble Top & Stainless Steel Base', colour: 'Dark Grey', dimensions: '1800 × 900 × 750 mm', length: '≈ 5.9 ft', width: '≈ 3.0 ft', height: '≈ 2.5 ft' },
    description: 'The GLAMORA Dining Table is available in a 6-seater configuration with a rectangular non-porous marble top and stainless steel base. The table base has a unique design that makes it look even more attractive. Features a marble top providing both an elegant appearance and lasting durability while ensuring easy maintenance. The Stainless Steel base provides strong structural support and ensures stability. A durable and stylish table with a premium appearance that complements modern interiors.',
  },
  {
    id: 9,
    name: 'Luxe Coffee Table in White and Gold Colour',
    image: '/coffee-tables/Luxe Coffee Table in White and Gold Colour.jpg',
    type: 'Coffee Table',
    material: 'Mango Wood',
    finish: 'White & Gold',
    tag: 'New',
    price: 19500,
    originalPrice: 25000,
    specs: { brand: 'Myoon', sku: 'FN2256463', material: 'Mango Wood', dimensions: 'H 38 × W 99 × D 99 cm', weight: '7 kg', warranty: '12 Months', assembly: 'Carpenter Assembly' },
    description: 'The Brasswood Fusion Coffee Table blends natural elegance with industrial charm. Its sturdy frame is made from high-quality Metal Iron, finished with a rich Copper Gold powder coating, offering both durability and a luxurious touch. The table\'s unique top features a blend of wooden and MDF drawer sections, crafted to provide ample storage while maintaining a refined look. The top is carefully finished with a natural white wash, highlighting the wood\'s natural beauty and texture. This modern coffee table is perfect for adding a sophisticated yet functional piece to your living space, designed to complement a range of interior styles.',
  },
  {
    id: 10,
    name: 'Manastir Coffee Table Set In Natural Finish With Panther Marble Top (Set of 3)',
    image: '/coffee-tables/Manastir Coffee Table Set In Natural Finish With Panther Marble Top (Set of 3 ).jpg',
    type: 'Nesting Set',
    material: 'Mango Veneer',
    finish: 'Natural',
    tag: 'Premium',
    price: 45000,
    originalPrice: 56000,
    specs: { brand: 'Casacraft from Pepperfry', sku: 'FM2275918', material: 'Mango Veneer', colour: 'Natural', topMaterial: 'Marble', weight: '44.45 kg', warranty: '36 Months', rating: '5.0' },
    description: 'The Manastir Coffee Table Set brings timeless sophistication to your living room with its stunning Panther Marble tops in a warm Natural finish. This set of 3 tables — big, medium, and small — offers versatile arrangement options for any living space layout. The natural finish of the mango veneer base beautifully complements the unique marble tops, creating a harmonious blend of organic and luxurious materials. No assembly required. The primary material is Mango Veneer with premium marble tops.',
  },
  {
    id: 11,
    name: 'Maysville Glass Top Center Table in Walnut Colour',
    image: '/coffee-tables/Maysville Glass Top Center Table in Walnut Colour.jpg',
    type: 'Centre Table',
    material: 'Engineered Wood',
    finish: 'Walnut',
    tag: 'Bestseller',
    price: 17500,
    originalPrice: 22000,
    specs: { brand: 'HomeTown', sku: '6000440499', material: 'European Standard Engineered Wood', colour: 'Walnut', dimensions: '1200 × 600 × 450 mm', warranty: '1 Year', length: '≈ 3.9 ft', width: '≈ 2.0 ft', height: '≈ 1.5 ft' },
    description: 'Bring elegance and modern design to your living space with the Maysville Centre Table. Crafted from high-grade European Standard engineered wood, this centre table features a sleek semi-clear glass top inlaid between a warm walnut finish frame. The table is designed with smooth rounded edges and a medium-sized apron, combining safety with sophistication. The open bottom shelf provides ample space for magazines, décor pieces, or daily essentials, while the side panel design adds a contemporary touch. All edges are edge banded and all exposed surfaces are laminated for moisture resistance. Termite and borer proof.',
  },
  {
    id: 12,
    name: 'Modern Marble Top Nesting Coffee Table In Gold Finish',
    image: '/coffee-tables/Modern Marble Top Nesting Coffee Table In Gold Finish.jpg',
    type: 'Nesting Set',
    material: 'Metal',
    finish: 'Gold',
    tag: 'New',
    price: 21000,
    originalPrice: 27000,
    specs: { brand: 'Creator Handicrafts', sku: 'FN2253200', material: 'Metal', topMaterial: 'Composite Marble', weight: '18 kg', warranty: '12 Months', rating: '3.5' },
    description: 'Each table is handcrafted by skilled artisans, so natural variations in composite marble texture and slight differences in the metal frame may occur — making every piece truly one of a kind. Features a sturdy metal base and a scratch-resistant marble surface designed for long-lasting style and functionality. Its timeless design complements both modern and traditional interiors, serving as a true centerpiece in any room. The smooth marble surface is easy to clean and maintain, staying polished and pristine with minimal effort. Self-assembly required.',
  },
  {
    id: 13,
    name: 'OREN Sintered Stone Top Coffee Table',
    image: '/coffee-tables/OREN SINTERED STONE TOP COFFEE TABLE.jpg',
    type: 'Coffee Table',
    material: 'Sintered Stone & Engineered Wood',
    finish: 'Black',
    tag: 'Premium',
    price: 26000,
    originalPrice: 33000,
    specs: { brand: 'Hometown', sku: '830118503', material: 'Sintered Stone & Engineered Wood', colour: 'Black', dimensions: '1305 × 700 × 185 mm', length: '≈ 4.3 ft', width: '≈ 2.3 ft', height: '≈ 0.6 ft' },
    description: 'The OREN Sintered Stone Top Coffee Table is available in an elegant black colour. The rectangular tabletop is made from durable sintered stone paired with engineered wood for lasting strength. Its uniquely fluted designed base adds visual appeal, elevating the overall aesthetic of your living space. The tabletop is finished with sintered stone inspired by the timeless beauty of natural marble. The surface is resistant to scratches, stains, and heat, ensuring long-lasting durability. Its non-porous surface is easy to clean, making it ideal for everyday use. This elegant sintered stone design with fluted legs blends beautifully with every home interior.',
  },
  {
    id: 14,
    name: 'Ryleigh Metal Nesting Coffee Table Set in Brown Finish',
    image: '/coffee-tables/Ryleigh Metal Nesting Coffee Table Set in Brown Finish.jpg',
    type: 'Nesting Set',
    material: 'Solid Wood',
    finish: 'Brown',
    tag: 'Bestseller',
    price: 34000,
    originalPrice: 43000,
    specs: { brand: 'Casacraft from Pepperfry', sku: 'FN2310786', material: 'Solid Wood', topMaterial: 'Veneer', dimensionsBig: 'H 30 × W 71 × D 150 cm', dimensionsSmall: 'H 46 × W 51 × D 51 cm', weight: '72 kg' },
    description: 'The Ryleigh Metal Nesting Coffee Table Set brings warm, natural beauty to your living room with a rich Brown finish. This two-piece set pairs a low-profile rectangular table with a compact accent table, both crafted from solid wood with premium veneer tops. The nesting design allows for flexible arrangement — spread them out for entertaining or tuck one under the other for everyday use. No assembly required. The primary material is solid wood, with veneer topping for a refined surface finish.',
  },
  {
    id: 15,
    name: 'Square Marble Nesting Coffee Table In Black & Matt Gold Finish (Set of 2)',
    image: '/coffee-tables/Square Marble Nesting Coffee Table In Black & Matt Gold Finish (Set of 2).jpg',
    type: 'Nesting Set',
    material: 'Metal',
    finish: 'Black & Gold',
    tag: 'Premium',
    price: 23000,
    originalPrice: 29000,
    specs: { brand: 'Creator Handicrafts', sku: 'FN2291608', material: 'Metal', dimensions: 'H 46 × W 58 × D 58 cm', weight: '18 kg', warranty: '12 Months', assembly: 'Self Assembly' },
    description: 'A perfect blend of luxury, functionality, and timeless design — the Square Marble Nesting Coffee Table Set of 2 is a centerpiece that adds sophistication to any room while offering practical arrangement flexibility. Each table is carefully handmade by skilled artisans. Natural variations in composite marble texture, slight differences in the metal frame, and visible weld marks may occur — these are inherent characteristics of handcrafted furniture and make every piece truly one of a kind. The striking Black and Matt Gold combination complements both modern and classic interiors.',
  },
];

const stableRatings = coffeeTableData.map(p => ({
  id: p.id,
  rating: +(4.3 + ((p.id * 19 + 5) % 8) / 10).toFixed(1),
  count: 15 + ((p.id * 29 + 11) % 90),
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

export default function CoffeeTablePage({ onBack, selectedProductId }) {
  const [sortBy, setSortBy]             = useState('popularity');
  const [filterType, setFilterType]     = useState([]);
  const [filterFinish, setFilterFinish] = useState([]);
  const [filterTag, setFilterTag]       = useState([]);
  const [priceMin, setPriceMin]         = useState('');
  const [priceMax, setPriceMax]         = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomImg, setZoomImg]           = useState(null);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [openSections, setOpenSections] = useState({ type: true, finish: true, tag: true, price: true });
  const [wishlist, setWishlist]         = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      const found = coffeeTableData.find(p => String(p.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedItem(found), 120);
    }
  }, [selectedProductId]);

  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...coffeeTableData];
    if (filterType.length)   items = items.filter(p => filterType.includes(p.type));
    if (filterFinish.length) items = items.filter(p => filterFinish.some(f => p.finish.includes(f)));
    if (filterTag.length)    items = items.filter(p => filterTag.includes(p.tag));
    if (priceMin)            items = items.filter(p => p.price >= parseInt(priceMin));
    if (priceMax)            items = items.filter(p => p.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterType, filterFinish, filterTag, priceMin, priceMax, sortBy]);

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: item.id, name: item.name, price: item.price, image: item.image });
    showToast(wishlist.includes(item.id) ? `Removed from Wishlist` : `"${item.name}" added to Wishlist`, wishlist.includes(item.id) ? 'success' : 'wishlist');
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
        .bp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .bp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .bp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .bp-back:hover { color:#1a1714; }
        .bp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .bp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .bp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .bp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .bp-main { padding:24px 32px 60px; }
        .bp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .bp-count { font-size:0.78rem;color:#6b6359; }
        .bp-count strong { color:#1a1714;font-weight:600; }
        .bp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .bp-sort::-webkit-scrollbar { display:none; }
        .bp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .bp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .bp-sort-btn.active,.bp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        /* Product list rows */
        .bp-list { display:flex;flex-direction:column;gap:16px; }
        .bp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .bp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .bp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .bp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .bp-row:hover .bp-row-img { transform:scale(1.04); }
        .bp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .bp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .bp-row-wish:hover { color:#c0392b; }
        .bp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .bp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .bp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .bp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .bp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .bp-row-price { font-size:1.45rem;font-weight:700;color:#1a1714; }
        .bp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .bp-row-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71; }

        /* Detail panel */
        .bp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .bp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:slideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .bp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8; }
        .bp-detail-body { padding:28px 32px 48px; }
        .bp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .bp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 10px; }
        .bp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .bp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .bp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .bp-detail-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .bp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .bp-detail-specs { margin-bottom:24px; }
        .bp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .bp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .bp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .bp-detail-close:hover { background:#fff; }
        .mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .bp-layout { grid-template-columns:1fr; }
          .bp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            overflow-y:auto;padding:20px; }
          .bp-sidebar.open { display:block!important; }
          .mob-filter-btn { display:flex!important; }
          .bp-hero { padding:24px 16px 20px; }
          .bp-main { padding:16px 16px 60px; }
          .bp-row-img-wrap { width:140px; }
          .bp-row-img { height:160px; }
          .bp-row-name { font-size:1.1rem; }
          .bp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .bp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .bp-row { flex-direction:column; }
          .bp-row-img-wrap { width:100%; }
          .bp-row-img { height:200px; }
          .bp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="bp-root">
        {/* Hero */}
        <div className="bp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="bp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="bp-heading">Coffee Tables</h1>
            <p className="bp-sub">Elegant coffee & centre tables — designed for the modern Indian home. Showing {filtered.length} of {coffeeTableData.length} products.</p>
          </div>
        </div>

        <div className="bp-layout">
          {/* Sidebar filters */}
          <aside className={`bp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("TABLE TYPE", "type", <>
              {['Centre Table', 'Coffee Table', 'Nesting Set', 'Dining Table'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterType.includes(t)} onChange={() => toggleArr(filterType, setFilterType, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {t}
                </label>
              ))}
            </>)}

            {renderFilterSection("FINISH", "finish", <>
              {['Sheesham', 'Brown', 'Black', 'Gold', 'White & Gold', 'Natural', 'Walnut', 'Black & Gold'].map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                  <input type="checkbox" checked={filterFinish.includes(f)} onChange={() => toggleArr(filterFinish, setFilterFinish, f)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                  {f}
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
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
                <span style={{ color: '#aaa', flexShrink: 0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline: 'none' }} />
              </div>
            </>)}

            {(filterType.length > 0 || filterFinish.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterType([]); setFilterFinish([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: '#c0392b', background: 'none', border: '1px solid #c0392b',
                  padding: '8px 16px', cursor: 'pointer', width: '100%', marginTop: 4 }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(0,0,0,0.15)',
                    padding: '7px 14px', cursor: 'pointer', fontFamily: "'Jost',sans-serif", fontSize: '0.74rem', fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1714' }}>
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
                const inWl = wishlist.includes(item.id);
                return (
                  <div key={item.id} className="bp-row" onClick={() => setSelectedItem(item)}>
                    <div className="bp-row-img-wrap">
                      <img className="bp-row-img" src={item.image} alt={item.name} loading="lazy"
                        style={{ cursor: 'zoom-in' }}
                        onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }} />
                      <span className="bp-row-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                      <button className="bp-row-wish" onClick={e => handleWishlist(item, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="bp-row-body">
                      <div>
                        <h3 className="bp-row-name">{item.name}</h3>
                        <StarRating rating={stableRatings.find(r => r.id === item.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === item.id)?.count ?? 42} />
                        <p className="bp-row-desc">{item.description}</p>
                        <div>
                          {item.type && <span className="bp-spec-chip">· {item.type}</span>}
                          {item.material && <span className="bp-spec-chip">· {item.material}</span>}
                          {item.finish && <span className="bp-spec-chip">· {item.finish}</span>}
                          {item.specs.dimensions && <span className="bp-spec-chip">· {item.specs.dimensions}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="bp-row-price-row">
                          <span className="bp-row-price">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.originalPrice && <span className="bp-row-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                          {disc && <span className="bp-row-disc">{disc}% off</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6359',
                  fontFamily: "'Jost',sans-serif", fontSize: '0.9rem' }}>
                  No products match your current filters.<br />
                  <button onClick={() => { setFilterType([]); setFilterFinish([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop: 12, background: 'none', border: 'none', color: '#c9a96e', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.85rem', textDecoration: 'underline' }}>
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
        const inWl = wishlist.includes(item.id);
        return (
          <div className="bp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="bp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="bp-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="bp-detail-img" src={item.image} alt={item.name} />
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: '50%',
                  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(3px)', pointerEvents: 'none'
                }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="bp-detail-body">
                <span className="bp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                <h2 className="bp-detail-name">{item.name}</h2>
                <StarRating rating={4.7} count={87} />
                <div className="bp-detail-price-row">
                  <span className="bp-detail-price">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.originalPrice && <span className="bp-detail-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="bp-detail-disc">{disc}% off</span>}
                </div>
                <p className="bp-detail-desc">{item.description}</p>
                <div className="bp-detail-specs">
                  <p className="bp-detail-specs-title">Specifications</p>
                  <SpecRow label="Type"         value={item.type} />
                  <SpecRow label="Material"     value={item.material} />
                  <SpecRow label="Finish"       value={item.finish} />
                  <SpecRow label="Brand"        value={item.specs.brand} />
                  <SpecRow label="Dimensions"   value={item.specs.dimensions || item.specs.dimensionsBig} />
                  <SpecRow label="Weight"       value={item.specs.weight} />
                  <SpecRow label="Top Material" value={item.specs.topMaterial} />
                  <SpecRow label="Colour"       value={item.specs.colour} />
                  <SpecRow label="Warranty"     value={item.specs.warranty} />
                  <SpecRow label="Assembly"     value={item.specs.assembly} />
                  <SpecRow label="SKU"          value={item.specs.sku} />
                </div>
                <div className="bp-detail-actions">
                  <button onClick={e => handleWishlist(item, e)} style={{
                    padding: '14px 18px', border: '1px solid rgba(0,0,0,0.15)', background: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                    fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', fontWeight: 600,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
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