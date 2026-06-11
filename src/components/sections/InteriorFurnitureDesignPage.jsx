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

const interiorFurnitureData = [
  {
    id: 1,
    name: 'WILLY PLUS 4 DOOR WARDROBE',
    image: '/interior-furniture/willy-plus-4-door.jpg',
    category: 'Wardrobe',
    brand: 'Spring Art',
    tag: 'Bestseller',
    price: 21999,
    originalPrice: 91800,
    specs: { sku: '830116697001', material: 'Engineered Wood', colour: 'White', dimensions: '416 × 1575 × 1800 mm', warranty: '12 Months' },
    description: 'The Willy 4-Door Wardrobe comes in a pristine white colour that complements any décor. It features a spacious multi-compartment layout with multiple adjustable shelves for folded garments, bags, or storage boxes. A dedicated hanging section with a sturdy metal rod keeps clothes wrinkle-free, while the central locker/drawer unit safely stores valuables and personal items. Smooth hinged shutters ensure easy and convenient daily access. Manufactured from high-quality engineered wood with uniform density construction for better screw-holding strength, and a sturdy back panel that enhances overall structural stability and durability.',
  },
  {
    id: 2,
    name: 'ALLEN PLUS 4 DOOR WARDROBE WITH MIRROR',
    image: '/interior-furniture/allen-plus-4-door.jpg',
    category: 'Wardrobe',
    brand: 'Spring Art',
    tag: 'New',
    price: 22999,
    originalPrice: 53900,
    specs: { sku: '830116658001', material: 'Engineered Wood', colour: 'Walnut', dimensions: '416 × 1575 × 1800 mm', warranty: '12 Months' },
    description: 'The Allen 4-Door Wardrobe comes in an elegant walnut colour with two ¾ mirrors on the middle doors that complement any décor. It features a spacious multi-compartment interior with multiple adjustable shelves for folded garments, bags, and storage boxes. A dedicated hanging section with a sturdy metal rod ensures wrinkle-free clothing storage, while the central locker/drawer unit allows secure storage of valuables. Manufactured using high-quality engineered wood with uniform density construction offering better screw-holding strength and durability, built to withstand regular daily usage.',
  },
  {
    id: 3,
    name: 'Nova Dresser with Full Length Mirror',
    image: '/interior-furniture/nova-dresser.jpg',
    category: 'Dressing Table',
    brand: 'Hometown',
    tag: 'Premium',
    price: 27900,
    originalPrice: 79900,
    specs: { sku: '6000439346', material: 'UV Finish + Engineered Wood', colour: 'UV Gloss + Walnut', dimensions: '400 × 750 × 1930 mm', warranty: 'Manufacturer Warranty' },
    description: 'The Nova Dresser pairs perfectly with matching furniture including King and Queen size beds, chest of drawers, and night stands. Its luxurious high gloss finish with gold-toned handles provides a timeless look that adds warmth and elegance, seamlessly blending with various interior styles. Equipped with covered multi-shelves for displaying perfumes, cosmetics, skincare, or decorative items, along with closed side cabinet storage and one drawer for organised, dust-free storage. The UV coating forms a hard protective layer making the surface resistant to scratches and daily wear. The full-length mirror reflects light, giving the illusion of a larger and more open room.',
  },
  {
    id: 4,
    name: 'Snowcrest 2 Door Sliding Wardrobe',
    image: '/interior-furniture/snowcrest-wardrobe.jpg',
    category: 'Wardrobe',
    brand: 'Hometown',
    tag: 'Premium',
    price: 119900,
    originalPrice: 336900,
    specs: { sku: '6000439306', material: 'PU Gloss + Engineered Wood', colour: 'High Gloss White + Matt Gold', dimensions: '600 × 1800 × 1200 mm', warranty: 'Manufacturer Warranty' },
    description: 'The Snowcrest Wardrobe features two hanging rods, multiple shelves, two built-in lockable drawers, and a separate locker to maintain a tidy and organised space. Two upper compartments provide ample storage for clothes, accessories, and more. Space-saving sliding shutters glide effortlessly on high-quality tracks, ideal for modern bedrooms. The mirror-like glossy surface enhances the luxury look of the bedroom, with high-gloss coatings providing resistance against scratches, stains, and daily wear. An integrated mirror enhances functionality for dressing while visually making the room appear larger, with built-in wardrobe lighting that automatically illuminates the interior for better visibility.',
  },
  {
    id: 5,
    name: 'Utsav Two Door Wardrobe with Mirror',
    image: '/interior-furniture/utsav-wardrobe.jpg',
    category: 'Wardrobe',
    brand: 'HomeTown',
    tag: 'Bestseller',
    price: 14999,
    originalPrice: 28500,
    specs: { sku: '600371093001', material: 'Melamine Faced Chipboard', colour: 'Wenge', dimensions: '804 × 470 × 1825 mm', warranty: '1 Year' },
    description: 'A sleek, user-centric two-door wardrobe crafted from engineered particle board, designed for functional everyday storage and a clean, modern look. Made from environment-friendly European standard E2 grade particle board, the panels are laminated with a scratch-resistant melamine finish and edge-banded on all exposed surfaces to protect from moisture. Termite resistant and borer proof for long-lasting performance. Features hinged doors with a full-length mirror that visually expands the room. The oval-shaped hanger pole improves hanger stability with superior weight-bearing capacity, while the telescopic drawer channels provide full accessibility. All doors and drawers are fitted with locks and supplied with metal keys for secure storage.',
  },
  {
    id: 6,
    name: 'Diago Night Stand In Natural Teak Color',
    image: '/interior-furniture/diago-nightstand.jpg',
    category: 'Night Stand',
    brand: 'HomeTown',
    tag: 'New',
    price: 3999,
    originalPrice: 9500,
    specs: { sku: '6000440508', material: 'Engineered Wood', colour: 'Natural Teak + Printed Flute', dimensions: '400 × 420 × 450 mm', warranty: '1 Year' },
    description: 'The Diago Night Stand is part of a furniture collection that includes King and Queen beds, a Dresser, and 2-door, 3-door, and 4-door wardrobes. Equipped with telescopic channels to ensure drawers open and close smoothly. The luxurious natural teak finish provides a timeless look that adds warmth and elegance, seamlessly blending with various interior styles. Features a stain and water resistant melamine finish, and is termite resistant and borer proof. Comes with one drawer and shelf which offers the perfect amount of space to store nighttime essentials such as books, chargers, or other personal items, keeping your bedside area tidy and organised.',
  },
  {
    id: 7,
    name: 'Prime Three Door Wardrobe White',
    image: '/interior-furniture/prime-3door-wardrobe.jpg',
    category: 'Wardrobe',
    brand: 'HomeTown',
    tag: 'Bestseller',
    price: 14999,
    originalPrice: 42500,
    specs: { sku: '6000089628001', material: 'Engineered Wood', colour: 'White', dimensions: '460 × 1210 × 1830 mm', warranty: '1 Year' },
    description: 'The Prime Three Door Wardrobe features an environment-friendly engineered wood construction with ergonomic functional fittings and a user-centric design that fits seamlessly in any bedroom. Its elegant profile, clean structural lines, and sturdy form make it a modern, practical storage solution. Made with environment-friendly European standard E2 grade Particle board, laminated with scratch-resistant melamine finish and edge-banded on all exposed surfaces for moisture protection. The oval-shaped hanger pole allows hangers to twist easily with superior weight-bearing capacity, installed at an ergonomic height for easy accessibility. All doors are fitted with locks that come with metal keys for added security.',
  },
  {
    id: 8,
    name: 'RIGA LYRA FAB LOUNGER LARGE BROWN RH',
    image: '/interior-furniture/riga-lounger.jpg',
    category: 'Lounger',
    brand: 'Hometown',
    tag: 'Premium',
    price: 75900,
    originalPrice: 194740,
    specs: { sku: '6000437821', material: 'Velvet', colour: 'Brown', dimensions: '2740 × 1705 × 930 mm', warranty: '1 Year' },
    description: 'The RIGA Brown Lounger is available in a right-hand configuration, offering a brown finish with a soft touch. It provides an incredibly cozy seating experience with ergonomic support, perfect for long hours of relaxation. The rich brown finish features a modern aesthetic that is easy to maintain, supported by stylish legs with a wooden finish. Features a plush wide seat ideal for reading, lounging, or napping. Built with Zig-Zag Spring seat construction and high density foam for superior comfort. The pine wood frame gives durability, while premium legs add style and stability. Brown luxury, foam and springs deliver comfort, and treated brown maintains its rich colour beautifully.',
  },
  {
    id: 9,
    name: 'QUANTUM HALF LEATHER 3S RECLINER LT GREY',
    image: '/interior-furniture/quantum-recliner.jpg',
    category: 'Recliner',
    brand: 'Hometown',
    tag: 'Premium',
    price: 62910,
    originalPrice: 202900,
    specs: { sku: '6000106995', material: 'Half Leather (Leather + PVC)', colour: 'Grey', dimensions: '2070 × 915 × 1020 mm', warranty: 'Manufacturer Warranty' },
    description: 'The Quantum Half Leather Recliner Grey is available in a 3-seater configuration. It features an elegant design with a tall backrest and additional back support in breathable PVC upholstery with comfortable seating ergonomics. Crafted from genuine leather, this recliner exudes sophistication and elegance, making it a perfect addition to any living space. The frame construction uses seasoned and treated Pine Wood for product durability, with Pocket Spring and Nozag spring seat construction using 30 Kg/M3 high density foam for superior comfort. Upholstered in high-grade premium Leather and PVC, it offers a highly comfortable experience with superior quality, construction and finish.',
  },
  {
    id: 10,
    name: 'RIO FAB 3 STR REC WITH DD TRAY BROWN',
    image: '/interior-furniture/rio-recliner.jpg',
    category: 'Recliner',
    brand: 'Hometown',
    tag: 'Bestseller',
    price: 72000,
    originalPrice: 171340,
    specs: { sku: '6000439114', material: 'Fabric', colour: 'Brown', dimensions: '2145 × 960 × 1040 mm', warranty: '1 Year' },
    description: 'The Rio Fabric Recliner is available in a 3-seater configuration in brown colour. It comes with 2 recliners and a dropdown console along with 2 cup holders, providing a theatre-like lounging experience. Pillow-top armrests provide extra comfort for extended lounging, while the tall headrest offers good neck and head support. Pocket spring seat construction offers independent spring movement for personalised support and pressure relief. Racer Polyester Boucle fabric provides a comfortable seating experience. Frames made of solid pinewood for long-term structural integrity. High-density foam and pocket springs support lumbar and leg areas, promoting better posture. The manual recliner mechanism ensures smooth and durable reclining performance.',
  },
  {
    id: 11,
    name: 'STONITA 4 SEATER DINING BENCH COPPER',
    image: '/interior-furniture/stonita-bench.jpg',
    category: 'Dining Furniture',
    brand: 'Hometown',
    tag: 'New',
    price: 6800,
    originalPrice: 37900,
    specs: { sku: '830118480', material: 'Solid Rubber Wood Base', colour: 'Wenge', dimensions: '930 × 360 × 500 mm', warranty: 'Manufacturer Warranty' },
    description: 'The Stonita Dining Bench is available in a 4-seater configuration. It comes with soft padding and plush upholstery for a comfortable seating experience. The bench can be parked under the table when not in use, saving space efficiently, and can accommodate 2 adults or 3 kids. Heavy section of solid rubber wood construction makes this product robust and durable. The wood used is seasoned and chemically treated, making it termite resistant and borer proof. Bench legs protect floors from scratches and make it easier to move. Stonita Dining adapts effortlessly to different interior themes and spaces, making it a versatile addition to any dining room.',
  },
  {
    id: 12,
    name: 'JAMIRA CERAMIC TOP 6 SEATER DINING TABLE',
    image: '/interior-furniture/jamira-dining.jpg',
    category: 'Dining Furniture',
    brand: 'HomeTown',
    tag: 'Premium',
    price: 38900,
    originalPrice: 151900,
    specs: { sku: '6000440497', material: 'Sheesham Wood', colour: 'Walnut', dimensions: '1600 × 900 × 760 mm', warranty: '12 Months' },
    description: 'The Jamira Ceramic Top Dining Table is available in a 6-seater configuration. The rectangular tabletop with smooth, rounded edges offers a contemporary and refined look. The ceramic top design blends seamlessly with a variety of interior styles, with a spacious tabletop providing comfortable dining for family gatherings. The polished ceramic top adds a luxurious appearance and is easy to clean and maintain. The cylindrical fluted wooden base ensures excellent stability and structural strength, with vertical fluted grooves enhancing visual appeal with a rich wooden finish. The combination of a luxurious ceramic top with a sturdy wooden base delivers a sophisticated and modern look suitable for both classic and contemporary dining spaces.',
  },
  {
    id: 13,
    name: 'GRACE DRESSING TABLE - SEBASTIAN OAK',
    image: '/interior-furniture/grace-dressing-table.jpg',
    category: 'Dressing Table',
    brand: 'Hometown',
    tag: 'New',
    price: 18500,
    originalPrice: 52000,
    specs: { sku: '6000440196', material: 'Engineered Wood', colour: 'Sebastian Oak', dimensions: '402 × 654 × 1945 mm', warranty: 'Manufacturer Warranty' },
    description: 'The Grace Dressing Table in Sebastian Oak is part of a furniture collection that includes King and Queen beds, a Dresser, and 3-door wardrobes. The luxurious Sebastian Oak with printed bamboo flutes provides a timeless matt finish look that adds warmth and elegance, seamlessly blending with various interior styles. Equipped with two spacious drawers, it provides plenty of room to organise accessories or daily essentials with ease, keeping everything neatly in place. Features a stain and water resistant melamine finish, and is termite resistant and borer proof. The built-in storage behind the mirror offers hidden space to store small accessories, cosmetics, or other personal items, providing both convenience and a clutter-free look.',
  },
  {
    id: 14,
    name: 'Garcia Fabric 3 Seater Sofa With Left Hand Side Lounger',
    image: '/interior-furniture/garcia-sofa.jpg',
    category: 'Sofa & Lounger',
    brand: 'HomeTown',
    tag: 'Bestseller',
    price: 48500,
    originalPrice: 129900,
    specs: { sku: '6000087446001', material: 'Fabric', colour: 'Blue', dimensions: '2775 × 2110 × 910 mm', warranty: '3 Years' },
    description: 'Available in left- or right-hand configurations, this fabric lounger blends the comfort of a 3-seater sofa with the relaxed length of a chaise to create a versatile seating solution for tricky corners and open living spaces. Added tufting and tailored button detailing enhance visual definition, delivering a contemporary boxy silhouette with clean lines. Thick armrests and a sleek wooden panel along the lounger maintain a modern impression while providing stable support. Built on a kiln-dried, chemically treated solid wood frame that resists termites and borers. A supportive seat core combines No-Zag springs and pocket springs with 32-density high-resilient foam for balanced comfort and resilience. Loose back cushions are filled with polyester fibre for plush support and shape retention over time.',
  },
];

const ALL_CATEGORIES = [...new Set(interiorFurnitureData.map(p => p.category))];
const ALL_BRANDS     = [...new Set(interiorFurnitureData.map(p => p.brand))];
const ALL_TAGS       = [...new Set(interiorFurnitureData.map(p => p.tag))];

const TAG_COLORS = {
  Bestseller: { bg: '#1a1714', color: '#fff' },
  Premium:    { bg: '#c9a96e', color: '#fff' },
  New:        { bg: '#2ecc71', color: '#fff' },
};

export default function InteriorFurnitureDesignPage({ onBack, selectedProductId }) {
  const [sortBy, setSortBy]           = useState('popularity');
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterTag, setFilterTag]     = useState([]);
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [zoomImg, setZoomImg]         = useState(null);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [openSections, setOpenSections] = useState({ category: true, brand: true, tag: true, price: true });
  const [wishlist, setWishlist]       = useState([]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  useEffect(() => {
    if (selectedProductId) {
      const found = interiorFurnitureData.find(p => p.id == selectedProductId || String(p.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedProduct(found), 120);
    }
  }, [selectedProductId]);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...interiorFurnitureData];
    if (filterCategory.length) items = items.filter(p => filterCategory.includes(p.category));
    if (filterBrand.length)    items = items.filter(p => filterBrand.includes(p.brand));
    if (filterTag.length)      items = items.filter(p => filterTag.includes(p.tag));
    if (priceMin)              items = items.filter(p => p.price >= parseInt(priceMin));
    if (priceMax)              items = items.filter(p => p.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price);
      case 'price_desc': return items.sort((a, b) => b.price - a.price);
      case 'newest':     return items.sort((a, b) => b.id - a.id);
      default:           return items;
    }
  }, [filterCategory, filterBrand, filterTag, priceMin, priceMax, sortBy]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    showToast(`"${product.name}" added to cart`, 'success');
  };
  const handleWishlist = (product, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: product.id, name: product.name, price: product.price, image: product.image });
    showToast(wishlist.includes(product.id) ? `Removed from Wishlist` : `"${product.name}" added to Wishlist`, wishlist.includes(product.id) ? 'success' : 'wishlist');
    setWishlist(w => w.includes(product.id) ? w.filter(x => x !== product.id) : [...w, product.id]);
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

  const CheckItem = useCallback(({ label, checked, onChange }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      fontSize: '0.8rem', color: '#1a1714', padding: '4px 0', userSelect: 'none' }}>
      <span style={{
        width: 14, height: 14, border: `2px solid ${checked ? '#c9a96e' : 'rgba(0,0,0,0.2)'}`,
        background: checked ? '#c9a96e' : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s', flexShrink: 0
      }}>
        {checked && <span style={{ width: 7, height: 7, background: '#fff', display: 'block' }} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      {label}
    </label>
  ), []);

  const disc = (p) => Math.round((1 - p.price / p.originalPrice) * 100);

  return (
    <>
      <style>{`
        .ifp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .ifp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .ifp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .ifp-back:hover { color:#1a1714; }
        .ifp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .ifp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .ifp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .ifp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .ifp-main { padding:24px 32px 60px; }
        .ifp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .ifp-count { font-size:0.78rem;color:#6b6359; }
        .ifp-count strong { color:#1a1714;font-weight:600; }
        .ifp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .ifp-sort::-webkit-scrollbar { display:none; }
        .ifp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .ifp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .ifp-sort-btn.active,.ifp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        .ifp-list { display:flex;flex-direction:column;gap:16px; }
        .ifp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .ifp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .ifp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .ifp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .ifp-row:hover .ifp-row-img { transform:scale(1.04); }
        .ifp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .ifp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .ifp-row-wish:hover { color:#c0392b; }
        .ifp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .ifp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .ifp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .ifp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .ifp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .ifp-row-price { font-size:1.45rem;font-weight:700;color:#1a1714; }
        .ifp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .ifp-row-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71; }
        .ifp-row-atc { display:inline-flex;align-items:center;gap:7px;margin-top:14px;
          padding:10px 22px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;transition:background 0.2s; }
        .ifp-row-atc:hover { background:#c9a96e; }

        .ifp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .ifp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:ifpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes ifpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .ifp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8;cursor:zoom-in; }
        .ifp-detail-body { padding:28px 32px 48px; }
        .ifp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .ifp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 6px; }
        .ifp-detail-brand { font-size:0.75rem;color:#6b6359;margin:0 0 12px;letter-spacing:0.06em;
          text-transform:uppercase; }
        .ifp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .ifp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .ifp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .ifp-detail-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .ifp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .ifp-detail-specs { margin-bottom:24px; }
        .ifp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .ifp-spec-row { display:flex;justify-content:space-between;align-items:center;
          padding:7px 0;border-bottom:1px solid rgba(0,0,0,0.05); }
        .ifp-spec-key { font-size:0.75rem;color:#6b6359;font-weight:500; }
        .ifp-spec-val { font-size:0.78rem;color:#1a1714;font-weight:600;text-align:right; }
        .ifp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .ifp-detail-atc { flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;min-width:180px;transition:background 0.2s; }
        .ifp-detail-atc:hover { background:#c9a96e; }
        .ifp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .ifp-detail-close:hover { background:#fff; }
        .mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .ifp-layout { grid-template-columns:1fr; }
          .ifp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            top:0;width:280px;max-width:100vw;overflow-y:auto; }
          .ifp-sidebar.open { display:block!important; }
          .mob-filter-btn { display:inline-flex!important;align-items:center;gap:6px;
            font-family:'Jost',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.10em;
            text-transform:uppercase;background:#1a1714;color:#fff;border:none;padding:9px 16px;cursor:pointer; }
          .ifp-hero { padding:24px 20px 20px; }
          .ifp-heading { font-size:1.9rem; }
          .ifp-main { padding:16px 16px 48px; }
          .ifp-row { flex-direction:column; }
          .ifp-row-img-wrap { width:100%; }
          .ifp-row-img { height:200px; }
          .ifp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .ifp-sort { width:100%; }
        }
        @media (max-width:480px) {
          .ifp-heading { font-size:1.5rem; }
        }
      `}</style>

      {zoomImg && <ImageZoomModal src={zoomImg.src} alt={zoomImg.alt} onClose={() => setZoomImg(null)} />}

      <div className="ifp-root">
        {/* Hero */}
        <div className="ifp-hero">
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="ifp-back" onClick={onBack}>
              <ArrowLeft size={13} /> Back
            </button>
            <h1 className="ifp-heading">Interior Furniture Design</h1>
            <p className="ifp-sub">Curated premium furniture for every corner of your home — wardrobes, loungers, dining & more.</p>
          </div>
        </div>

        <div className="ifp-layout">
          {/* Sidebar */}
          <aside className={`ifp-sidebar${filterOpen ? ' open' : ''}`}>
            {filterOpen && (
              <button onClick={() => setFilterOpen(false)}
                style={{ position:'absolute', top:14, right:14, background:'none', border:'none',
                  cursor:'pointer', padding:4 }}>
                <X size={18} />
              </button>
            )}
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:700,
              letterSpacing:'0.10em', textTransform:'uppercase', color:'#1a1714',
              marginBottom:20, paddingBottom:14, borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
              Filters
            </div>

            {renderFilterSection('Category', 'category',
              <div>
                {ALL_CATEGORIES.map(cat => (
                  <CheckItem key={cat} label={cat}
                    checked={filterCategory.includes(cat)}
                    onChange={() => toggleArr(filterCategory, setFilterCategory, cat)} />
                ))}
              </div>
            )}

            {renderFilterSection('Brand', 'brand',
              <div>
                {ALL_BRANDS.map(br => (
                  <CheckItem key={br} label={br}
                    checked={filterBrand.includes(br)}
                    onChange={() => toggleArr(filterBrand, setFilterBrand, br)} />
                ))}
              </div>
            )}

            {renderFilterSection('Collection', 'tag',
              <div>
                {ALL_TAGS.map(t => (
                  <CheckItem key={t} label={t}
                    checked={filterTag.includes(t)}
                    onChange={() => toggleArr(filterTag, setFilterTag, t)} />
                ))}
              </div>
            )}

            {renderFilterSection('Price Range', 'price',
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <input value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  placeholder="Min" type="number"
                  style={{ width:'100%', padding:'6px 8px', border:'1px solid rgba(0,0,0,0.15)',
                    fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none' }} />
                <span style={{ color:'#aaa', fontSize:'0.75rem' }}>–</span>
                <input value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max" type="number"
                  style={{ width:'100%', padding:'6px 8px', border:'1px solid rgba(0,0,0,0.15)',
                    fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', outline:'none' }} />
              </div>
            )}

            {(filterCategory.length || filterBrand.length || filterTag.length || priceMin || priceMax) ? (
              <button onClick={() => { setFilterCategory([]); setFilterBrand([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ background:'none', border:'1px solid rgba(0,0,0,0.12)', padding:'7px 14px', cursor:'pointer',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.08em',
                  textTransform:'uppercase', color:'#6b6359', width:'100%', transition:'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a96e'; e.currentTarget.style.color='#c9a96e'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'; e.currentTarget.style.color='#6b6359'; }}>
                Clear All Filters
              </button>
            ) : null}
          </aside>

          {/* Main */}
          <main className="ifp-main">
            <div className="ifp-toolbar">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}>
                  <SlidersHorizontal size={13} /> Filters
                </button>
                <span className="ifp-count">Showing <strong>{filtered.length}</strong> of <strong>{interiorFurnitureData.length}</strong> products</span>
              </div>
              <div className="ifp-sort">
                <span className="ifp-sort-label">Sort:</span>
                {[
                  { key: 'popularity', label: 'Popularity' },
                  { key: 'price_asc',  label: 'Price ↑' },
                  { key: 'price_desc', label: 'Price ↓' },
                  { key: 'newest',     label: 'Newest' },
                ].map(s => (
                  <button key={s.key} className={`ifp-sort-btn${sortBy === s.key ? ' active' : ''}`}
                    onClick={() => setSortBy(s.key)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'#aaa', fontFamily:"'Jost',sans-serif" }}>
                No products match your filters.
              </div>
            ) : (
              <div className="ifp-list">
                {filtered.map(product => {
                  const tagStyle = TAG_COLORS[product.tag] || { bg:'#1a1714', color:'#fff' };
                  const discPct  = disc(product);
                  const inWish   = wishlist.includes(product.id);
                  return (
                    <div key={product.id} className="ifp-row" onClick={() => setSelectedProduct(product)}>
                      <div className="ifp-row-img-wrap">
                        <img src={product.image} alt={product.name} className="ifp-row-img"
                          onError={e => { e.currentTarget.style.objectFit='contain'; e.currentTarget.style.padding='20px'; }} />
                        <span className="ifp-row-tag"
                          style={{ background: tagStyle.bg, color: tagStyle.color }}>
                          {product.tag}
                        </span>
                        <button className="ifp-row-wish" onClick={e => handleWishlist(product, e)}
                          style={{ color: inWish ? '#c0392b' : '#aaa' }}>
                          <Heart size={14} fill={inWish ? '#c0392b' : 'none'} />
                        </button>
                      </div>
                      <div className="ifp-row-body">
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <span style={{ fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.10em',
                              textTransform:'uppercase', color:'#c9a96e' }}>{product.category}</span>
                            <span style={{ fontSize:'0.65rem', color:'#aaa' }}>·</span>
                            <span style={{ fontSize:'0.65rem', color:'#6b6359', letterSpacing:'0.05em' }}>{product.brand}</span>
                          </div>
                          <h3 className="ifp-row-name">{product.name}</h3>
                          <p className="ifp-row-desc">{product.description}</p>
                          <div>
                            <span className="ifp-spec-chip">{product.specs.material}</span>
                            <span className="ifp-spec-chip">{product.specs.colour}</span>
                            <span className="ifp-spec-chip">{product.specs.dimensions}</span>
                            {product.specs.warranty && <span className="ifp-spec-chip">{product.specs.warranty} Warranty</span>}
                          </div>
                        </div>
                        <div>
                          <div className="ifp-row-price-row">
                            <span className="ifp-row-price">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="ifp-row-orig">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            <span className="ifp-row-disc">{discPct}% OFF</span>
                          </div>
                          <button className="ifp-row-atc" onClick={e => handleAddToCart(product, e)}>
                            <ShoppingBag size={13} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedProduct && (
        <div className="ifp-detail-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="ifp-detail-panel" onClick={e => e.stopPropagation()}>
            <button className="ifp-detail-close" onClick={() => setSelectedProduct(null)}>
              <X size={16} />
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="ifp-detail-img"
              onClick={() => setZoomImg({ src: selectedProduct.image, alt: selectedProduct.name })}
              onError={e => { e.currentTarget.style.objectFit='contain'; e.currentTarget.style.padding='20px'; }}
            />
            <div className="ifp-detail-body">
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                {(() => {
                  const ts = TAG_COLORS[selectedProduct.tag] || { bg:'#1a1714', color:'#fff' };
                  return (
                    <span className="ifp-detail-tag" style={{ background: ts.bg, color: ts.color }}>
                      {selectedProduct.tag}
                    </span>
                  );
                })()}
                <span style={{ fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c9a96e' }}>{selectedProduct.category}</span>
              </div>
              <h2 className="ifp-detail-name">{selectedProduct.name}</h2>
              <p className="ifp-detail-brand">By {selectedProduct.brand} · SKU: {selectedProduct.specs.sku}</p>
              <div className="ifp-detail-price-row">
                <span className="ifp-detail-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                <span className="ifp-detail-orig">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                <span className="ifp-detail-disc">{disc(selectedProduct)}% OFF</span>
              </div>
              <p className="ifp-detail-desc">{selectedProduct.description}</p>

              <div className="ifp-detail-specs">
                <p className="ifp-detail-specs-title">Product Specifications</p>
                {[
                  ['Material', selectedProduct.specs.material],
                  ['Colour', selectedProduct.specs.colour],
                  ['Dimensions (L × W × H)', selectedProduct.specs.dimensions],
                  ['Warranty', selectedProduct.specs.warranty],
                  ['Brand', selectedProduct.brand],
                  ['SKU', selectedProduct.specs.sku],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="ifp-spec-row">
                    <span className="ifp-spec-key">{k}</span>
                    <span className="ifp-spec-val">{v}</span>
                  </div>
                ))}
              </div>

              <div className="ifp-detail-actions">
                <button className="ifp-detail-atc" onClick={e => { handleAddToCart(selectedProduct, e); }}>
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <button onClick={e => handleWishlist(selectedProduct, e)}
                  style={{ width:48, height:48, border:'1px solid rgba(0,0,0,0.12)',
                    background:'#fff', cursor:'pointer', display:'flex', alignItems:'center',
                    justifyContent:'center', transition:'border-color 0.2s',
                    color: wishlist.includes(selectedProduct.id) ? '#c0392b' : '#aaa' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'}>
                  <Heart size={18} fill={wishlist.includes(selectedProduct.id) ? '#c0392b' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}