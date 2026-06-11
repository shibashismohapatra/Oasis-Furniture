import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

/* ─────────────────────────────────────────────
            Image Zoom Modal
───────────────────────────────────────────── */
function ImageZoomModal({ src, alt, onClose }) {
  const [scale, setScale]   = useState(1);
  const [pos, setPos]       = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart   = useRef(null);
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
  const zoom = dir => setScale(s => { const ns = Math.min(4, Math.max(1, s + dir * 0.5)); setPos(p => clampPos(p.x, p.y, ns)); return ns; });
  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const onMouseDown = e => { if (scale === 1) return; setDragging(true); dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }; };
  const onMouseMove = e => { if (!dragging || !dragStart.current) return; setPos(clampPos(dragStart.current.px + e.clientX - dragStart.current.mx, dragStart.current.py + e.clientY - dragStart.current.my, scale)); };
  const onMouseUp = () => setDragging(false);
  const onWheel = e => { e.preventDefault(); zoom(e.deltaY < 0 ? 1 : -1); };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ position:'absolute',top:16,right:16,display:'flex',gap:8,zIndex:10 }}>
        {[{fn:()=>zoom(1),icon:<ZoomIn size={18}/>},{fn:()=>zoom(-1),icon:<ZoomOut size={18}/>},{fn:reset,icon:<RotateCcw size={16}/>},{fn:onClose,icon:<X size={18}/>}].map(({fn,icon},i) => (
          <button key={i} onClick={fn}
            style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)',transition:'background 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.background=i===3?'rgba(220,60,60,0.55)':'rgba(255,255,255,0.28)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>{icon}</button>
        ))}
      </div>
      {scale === 1 && <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.12)',color:'#fff',fontSize:'0.72rem',letterSpacing:'0.10em',padding:'6px 16px',borderRadius:20,backdropFilter:'blur(4px)',pointerEvents:'none',textTransform:'uppercase',fontFamily:"'Jost',sans-serif"}}>Scroll or tap + to zoom</div>}
      <div ref={containerRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onWheel={onWheel}
        style={{width:'90vw',height:'90vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:scale>1?(dragging?'grabbing':'grab'):'zoom-in'}}>
        <img src={src} alt={alt} draggable={false}
          style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',transform:`scale(${scale}) translate(${pos.x/scale}px,${pos.y/scale}px)`,transition:dragging?'none':'transform 0.25s cubic-bezier(.22,1,.36,1)',userSelect:'none'}} />
      </div>
    </div>
  );
}

/* ─── Star Rating ─── */
function StarRating({ rating, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i <= Math.round(rating) ? '#c9a96e' : 'none'} stroke='#c9a96e' strokeWidth={1.5}/>
      ))}
      <span style={{ fontSize:'0.72rem', color:'#6b6359', fontFamily:"'Jost',sans-serif" }}>{rating} ({count})</span>
    </div>
  );
}

/* ─── Tag colours ─── */
const tagColors = {
  'Valuable':  { bg:'#e8f5e9', color:'#2e7d32' },
  'Sheesham':  { bg:'#fff3e0', color:'#e65100' },
  'SPD':       { bg:'#e3f2fd', color:'#1565c0' },
  'SMD':       { bg:'#f3e5f5', color:'#6a1b9a' },
  'Premium':   { bg:'#1a1714', color:'#c9a96e' },
  'New':       { bg:'#f5f0e8', color:'#6b6359' },
};

const sortOptions = [
  { value: 'popularity', label: 'Popular' },
  { value: 'price_asc',  label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'newest',     label: 'Newest' },
];

/* ─── Stable ratings ─── */
const stableRatings = [
  { id:'df1', rating:4.7, count:134 }, { id:'df2', rating:4.5, count:89 },
  { id:'df3', rating:4.6, count:72 },  { id:'df4', rating:4.8, count:56 },
  { id:'df5', rating:4.4, count:48 },  { id:'df6', rating:4.9, count:37 },
  { id:'df7', rating:4.5, count:91 },  { id:'df8', rating:4.6, count:63 },
  { id:'df9', rating:4.7, count:115 }, { id:'df10', rating:4.5, count:78 },
  { id:'df11', rating:4.8, count:44 }, { id:'df12', rating:4.6, count:52 },
  { id:'df13', rating:4.7, count:83 }, { id:'df14', rating:4.5, count:67 },
  { id:'df15', rating:4.8, count:29 }, { id:'df16', rating:4.9, count:21 },
  { id:'df17', rating:4.7, count:38 }, { id:'df18', rating:4.6, count:55 },
  { id:'df19', rating:4.8, count:42 }, { id:'df20', rating:4.9, count:18 },
  { id:'df21', rating:4.7, count:31 }, { id:'df22', rating:4.8, count:25 },
  { id:'df23', rating:4.9, count:19 }, { id:'df24', rating:4.7, count:33 },
  { id:'df25', rating:4.8, count:27 }, { id:'df26', rating:4.9, count:16 },
  { id:'df27', rating:4.7, count:22 }, { id:'df28', rating:4.8, count:14 },
  { id:'df29', rating:4.9, count:11 }, { id:'df30', rating:4.7, count:28 },
  { id:'df31', rating:4.6, count:24 }, { id:'df32', rating:4.7, count:19 },
  { id:'df33', rating:4.5, count:31 }, { id:'df34', rating:4.8, count:22 },
  { id:'df35', rating:4.6, count:17 }, { id:'df36', rating:4.7, count:26 },
  { id:'df37', rating:4.8, count:33 }, { id:'df38', rating:4.9, count:15 },
  { id:'df39', rating:4.7, count:28 }, { id:'df40', rating:4.6, count:21 },
  { id:'df41', rating:4.8, count:18 }, { id:'df42', rating:4.9, count:12 },
  { id:'df43', rating:4.7, count:16 }, { id:'df44', rating:4.8, count:14 },
  { id:'df45', rating:4.9, count:10 }, { id:'df46', rating:4.8, count:13 },
  { id:'df47', rating:4.9, count:9  }, { id:'df48', rating:4.7, count:11 },
  { id:'df49', rating:4.6, count:38 },
];

/* ═══════════════════════════════════════════════
   DINING DATA — From Oasis Furniture Catalogue 2026
═══════════════════════════════════════════════ */
const diningData = [

  /* ── 4-SEATER VALUABLE SERIES ── */
  { id:'df1', name:'Trio — 1+4 Round Dining Set', series:'Valuable Series',
    image:'/dining/catalogue/Trio.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:66806, originalPrice:78000,
    specs:{ material:'Solid Wood, GO2 Marble Top', colour:'Dark Walnut', dimensions:'Round 42" Dia Table + 4 Chairs', series:'Valuable Series' },
    description:'The Trio brings timeless elegance with a round 42" GO2 marble top table and 4 striped-back cushioned chairs. Classic crossbase design with solid wood construction — perfect for cosy family dining rooms.' },

  { id:'df2', name:'Beyza — 1+4 Dining Set (4830)', series:'Valuable Series',
    image:'/dining/catalogue/Beyza.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:64022, originalPrice:75000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Walnut', dimensions:'4830 Table (48"×30") + 4 Chairs', series:'Valuable Series' },
    description:'The Beyza is a refined 4-seater with a 4-leg table and Composite Italian Marble top. Elegant carved chair backs with upholstered cushioning offer a premium seating experience at a value price.' },

  { id:'df3', name:'Kilic — 1+4 Dining Set (4836)', series:'Valuable Series',
    image:'/dining/catalogue/Kilic.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:61237, originalPrice:72000,
    specs:{ material:'Solid Wood, Designer Glass Top', colour:'Dark Walnut', dimensions:'4836 Table (48"×36") + 4 Chairs', series:'Valuable Series' },
    description:'The Kilic pairs a 4-leg solid wood table with a premium designer glass top and 4 fully upholstered chairs in soft grey fabric. A sleek, modern silhouette that works beautifully in contemporary homes.' },

  { id:'df4', name:'Sophia — 1+4 Dining Set with Crockery Unit (4731)', series:'Valuable Series',
    image:'/dining/catalogue/Sophia.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:56224, originalPrice:66000,
    specs:{ material:'Solid Wood, Full Italian Marble Top', colour:'Dark Walnut', dimensions:'4731 Table + Crockery Unit + 4 Chairs', series:'Valuable Series' },
    description:'The Sophia is a unique set combining a solid wood dining table with a full Italian marble top alongside a built-in crockery display unit — a practical and stylish centrepiece for any dining space.' },

  { id:'df5', name:'SWID-01 — 1+4 Dining Set (5532)', series:'Valuable Series',
    image:'/dining/catalogue/SWID-01.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:38958, originalPrice:46000,
    specs:{ material:'Solid Wood, Designer Marble Top', colour:'Black', dimensions:'5532 Table + 4 Chairs', series:'Valuable Series' },
    description:'SWID-01 delivers modern drama with a 4-leg black table topped with a bold designer marble surface. The 4 curved-back upholstered chairs in warm grey complete this contemporary composition at a competitive price.' },

  { id:'df6', name:'SWID-02 — 1+4 Dining Set (5532)', series:'Valuable Series',
    image:'/dining/catalogue/SWID-02.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:55667, originalPrice:65000,
    specs:{ material:'Solid Wood, Designer Marble Top', colour:'Black', dimensions:'5532 Designer Table + 4 Chairs', series:'Valuable Series' },
    description:'SWID-02 elevates the classic 4-seater with a sculptural slab-base table and premium designer marble top. The streamlined chairs in dove grey echo the clean architectural lines of the base.' },

  { id:'df7', name:'Rylee — 1+4 Round Dining Set (48" Dia)', series:'Valuable Series',
    image:'/dining/catalogue/Rylee.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:43136, originalPrice:51000,
    specs:{ material:'Solid Wood, Round Black Glass Top', colour:'Dark Brown', dimensions:'Round 48" Dia + 4 Chairs', series:'Valuable Series' },
    description:'The Rylee is a warm, inviting round dining set with a black glass top and 4 ladder-back chairs with cream cushions. A lifestyle-friendly set that looks equally at home in a family room or a dining nook.' },

  { id:'df8', name:'Milky — 1+4 Round Dining Set (48" Dia)', series:'Valuable Series',
    image:'/dining/catalogue/Milky.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:45920, originalPrice:54000,
    specs:{ material:'Solid Wood, Round Black Glass Top', colour:'White', dimensions:'Round 48" Dia + 4 Chairs', series:'Valuable Series' },
    description:'The Milky is a bright, cheerful round dining set in white finish. The round black glass top creates an elegant contrast, while the 4 slatted back chairs with dark leather cushions add character.' },

  { id:'df9', name:'Amii — 1+4 Dining Set (4830)', series:'Valuable Series',
    image:'/dining/catalogue/Amii.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:38958, originalPrice:46000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Brown', dimensions:'4830 Table + 4 Chairs', series:'Valuable Series' },
    description:'The Amii is a simple, enduring classic. Striped-back chairs pair beautifully with a rectangular composite Italian marble top table. Built to last with solid wood legs and a timeless dark brown finish.' },

  { id:'df10', name:'Amii-2 — 1+4 Dining Set (4830)', series:'Valuable Series',
    image:'/dining/catalogue/Amii-2.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:38958, originalPrice:46000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Brown', dimensions:'4830 Table + 4 Chairs', series:'Valuable Series' },
    description:'The Amii-2 is the updated variant of the classic Amii set, featuring straight-back upholstered chairs in warm beige fabric with a matching composite marble top table. Clean lines, warm comfort.' },

  { id:'df11', name:'Nyasa — 1+4 Dining Set (4830)', series:'Valuable Series',
    image:'/dining/catalogue/Nyasa-4S.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:51768, originalPrice:61000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Brown', dimensions:'4830 Table + 4 Chairs', series:'Valuable Series' },
    description:'The Nyasa 4-seater features ornate floral-print chair backs against a white composite marble top — a beautiful fusion of Indian craft tradition and modern dining functionality.' },

  { id:'df12', name:'Tuna — 1+4 Dining Set (4528)', series:'Valuable Series',
    image:'/dining/catalogue/Tuna-4S.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:36601, originalPrice:43000,
    specs:{ material:'Solid Wood, Plain Top', colour:'Dark Brown', dimensions:'4528 Table + 4 Chairs', series:'Valuable Series' },
    description:'The Tuna 4-seater is our most accessible value set with a plain-top solid wood table and classic ladder-back chairs. Durable, practical, and designed for everyday family use.' },

  { id:'df13', name:'Perry — 1+4 Dining Set (4528)', series:'Valuable Series',
    image:'/dining/catalogue/Perry-4S.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Valuable', price:50098, originalPrice:59000,
    specs:{ material:'Solid Wood, Full Composite Italian Marble Top', colour:'Dark Brown', dimensions:'4528 Table + 4 Chairs', series:'Valuable Series' },
    description:'The Perry 4-seater pairs sleek ladder-back chairs with grey cushions against a clean composite Italian marble top. A great everyday set that brings a touch of sophistication to regular family meals.' },

  { id:'df14', name:'Kenzo — 1+4 Dining Set (4532)', series:'Sheesham Wood Series',
    image:'/dining/catalogue/Kenzo-4S.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Sheesham', price:47313, originalPrice:56000,
    specs:{ material:'4 Leg Sheesham Wood Table', colour:'Natural Sheesham', dimensions:'4532 Table + 4 Chairs', series:'Sheesham Wood Series' },
    description:'The Kenzo 4-seater is hand-crafted from premium Sheesham (Indian Rosewood) — one of the most durable and beautiful Indian hardwoods. The intricate lattice chair backs and rich natural grain make this a collector\'s piece.' },

  { id:'df15', name:'Clark — 1+4 Round Dining Set (3939)', series:'Sheesham Wood Series',
    image:'/dining/catalogue/Clark.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'Sheesham', price:48984, originalPrice:58000,
    specs:{ material:'Round Sheesham Wood Table', colour:'Natural Sheesham', dimensions:'Round 39"×39" Table + 4 Chairs', series:'Sheesham Wood Series' },
    description:'The Clark is a sculptural round Sheesham dining set with a dramatic spider-leg base. The curved-back armchairs in soft mauve upholstery create an intimate, café-style dining experience with Indian hardwood warmth.' },

  { id:'df16', name:'Twin-D — 1+4 Dining Set with Bench (6636)', series:'Sheesham Wood Series',
    image:'/dining/catalogue/Twin-D.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set with Bench', tag:'Sheesham', price:91870, originalPrice:108000,
    specs:{ material:'4 Leg Sheesham Wood Table', colour:'Natural Sheesham', dimensions:'6636 Table + 3 Chairs + 1 Bench', series:'Sheesham Wood Series' },
    description:'The Twin-D is a statement Sheesham set featuring 3 high-back slatted chairs plus a generous dining bench. A family-table feel with Indian Rosewood craftsmanship — robust, warm, and full of character.' },

  /* ── 6-SEATER SERIES ── */
  { id:'df17', name:'Nyasa — 1+6 Dining Set (6036)', series:'Valuable Series',
    image:'/dining/catalogue/Nyasa-6S.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Valuable', price:80452, originalPrice:95000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Brown', dimensions:'6036 Table + 6 Chairs', series:'Valuable Series' },
    description:'The Nyasa 6-seater extends the beloved 4-seater design to accommodate 6 guests comfortably. Floral-print chairbacks, ornate turned legs, and a white composite marble top make this an unmistakable dining centrepiece.' },

  { id:'df18', name:'Tuna — 1+6 Dining Set (6036)', series:'Valuable Series',
    image:'/dining/catalogue/Tuna-6S.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Valuable', price:54275, originalPrice:64000,
    specs:{ material:'Solid Wood, Plain Top', colour:'Dark Brown', dimensions:'6036 Table + 6 Chairs', series:'Valuable Series' },
    description:'The Tuna 6-seater brings solid value for larger families. A plain-top rectangular table with classic ladder-back chairs — simple, durable, and built for daily use in the Indian home.' },

  { id:'df19', name:'Perry — 1+6 Dining Set (6036)', series:'Valuable Series',
    image:'/dining/catalogue/Perry-6S.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Valuable', price:70984, originalPrice:84000,
    specs:{ material:'Solid Wood, Full Composite Italian Marble Top', colour:'Dark Brown', dimensions:'6036 Table + 6 Chairs', series:'Valuable Series' },
    description:'The Perry 6-seater is perfect for hosting. Six ladder-back chairs with grey cushions surround an elegant composite Italian marble top — a set that handles everything from family dinners to festive gatherings.' },

  { id:'df20', name:'Kenzo — 1+6 Dining Set (5735)', series:'Sheesham Wood Series',
    image:'/dining/catalogue/Kenzo-6S.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Sheesham', price:59844, originalPrice:70000,
    specs:{ material:'4 Leg Sheesham Wood Table', colour:'Natural Sheesham', dimensions:'5735 Table + 6 Chairs', series:'Sheesham Wood Series' },
    description:'The Kenzo 6-seater in premium Sheesham Wood is a masterclass in Indian woodcraft. Six intricately carved lattice-back chairs surround a solid Sheesham table — built to be passed down through generations.' },

  { id:'df21', name:'SPD-35 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/SPD-35.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:89113, originalPrice:105000,
    specs:{ material:'4 Leg Table, Printed Glass Top', colour:'Dark Brown', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-35 from our premium SPD collection features a beautiful printed glass top table with 6 high-back carved chairs upholstered in warm fabric. A perfect blend of artisanal craft and modern appeal.' },

  { id:'df22', name:'SPD-36 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-36.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:96075, originalPrice:113000,
    specs:{ material:'4 Leg Table, Italian Marble Top', colour:'Dark Brown', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-36 offers a luxurious Italian marble top with 6 finely carved high-back chairs. The deep brown finish and bold turned legs make a strong statement in any formal dining room.' },

  { id:'df23', name:'SPD-37 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-37.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table, Italian Marble Top', colour:'Dark Brown', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-37 combines an ornate lattice-carved chair design with a pristine Italian marble top. Six beautifully upholstered chairs in neutral fabric create a formal yet welcoming dining environment.' },

  { id:'df24', name:'SPD-38 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-38.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table, Italian Marble Top', colour:'Dark Brown / Blue', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-38 features a dramatic dark marble-effect top with 6 slatted chairs upholstered in vibrant blue fabric — a bold, fashion-forward choice that makes a lasting impression.' },

  { id:'df25', name:'Latina-SPD60 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/Latina-SPD60.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:178227, originalPrice:210000,
    specs:{ material:'4 Leg Table, Onyx Plain Marble Top', colour:'Dark Brown', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'The Latina-SPD60 is an opulent 6-seater from our top SPD series. Six high-back button-tufted chairs in premium polyester surround an Onyx marble table on ornate carved legs — a truly grand statement piece.' },

  /* ── SMD SERIES (6-Seater Premium) ── */
  { id:'df26', name:'SMD-03 — 1+6 Dining Set (7236)', series:'SMD Series',
    image:'/dining/catalogue/SMD-03.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SMD', price:160012, originalPrice:188000,
    specs:{ material:'4 Leg Table, GO2 Marble Top', colour:'Dark Brown / Cream', dimensions:'7236 Table + 6 Chairs', series:'SMD Series' },
    description:'SMD-03 is a premium 6-seater with an extra-large 72"×36" table and elegant GO2 marble top. Six carved high-back chairs with floral upholstery create an atmosphere of refined luxury for formal entertaining.' },

  /* ── PREMIUM SERIES (6-Seater Luxury) ── */
  { id:'df27', name:'Bliss — 1+6 Premium Dining Set (7242)', series:'Premium Series',
    image:'/dining/catalogue/Bliss.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Premium', price:296274, originalPrice:348000,
    specs:{ material:'Center Base Table, Laurent Marble Top with Inlay', colour:'Dark Walnut / Gold', dimensions:'7242 Center Base Table + 6 Chairs', series:'Premium Series' },
    description:'The Bliss is the pinnacle of our Premium Series — a stunning center-base table with a Laurent marble top featuring intricate inlay work, paired with 6 barrel-back chairs in two contrasting leathers. For those who demand the extraordinary.' },

  { id:'df28', name:'Harmony — 1+6 Premium Dining Set (7242)', series:'Premium Series',
    image:'/dining/catalogue/Harmony.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Premium', price:248961, originalPrice:293000,
    specs:{ material:'Center Base Table, Laurent Marble Top with Inlay', colour:'Dark Walnut / Gold', dimensions:'7242 Center Base Table + 6 Chairs', series:'Premium Series' },
    description:'The Harmony offers 6 generously proportioned barrel chairs in rich brown quilted upholstery around a sculptural fluted column center-base table with Laurent marble. Gold-tipped legs add a luxurious final flourish.' },

  { id:'df29', name:'Glister — 1+6 Premium Dining Set (7242)', series:'Premium Series',
    image:'/dining/catalogue/Glister.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Premium', price:289590, originalPrice:341000,
    specs:{ material:'Center Base Table, Laurent Marble Top with Inlay', colour:'Dark Brown / Gold', dimensions:'7242 Center Base Table + 6 Chairs', series:'Premium Series' },
    description:'The Glister pairs a dramatic sculpted-base table in deep chocolate with 6 tall-back chairs in contrasting ribbed and smooth upholstery. The Laurent marble top with inlay detail elevates this to true luxury furniture.' },

  { id:'df30', name:'Granio — 1+6 Premium Dining Set (7242)', series:'Premium Series',
    image:'/dining/catalogue/Granio.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Premium', price:261742, originalPrice:308000,
    specs:{ material:'Center Base Table, Onyx Marble Top with Inlay', colour:'Dark Brown / Gold', dimensions:'7242 Center Base Table + 6 Chairs', series:'Premium Series' },
    description:'The Granio crowns our Premium Series with an Onyx marble top in luminous gold-veined tones, set on a bold asymmetric base. Six expertly upholstered chairs in cognac and ivory leather complete this heirloom-quality collection.' },

  /* ── SPD Series — New Additions ── */
  { id:'df31', name:'SPD-39 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-39.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table with Italian Marble Top', colour:'Dark Walnut', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-39 features a sturdy 4-leg table with a premium Italian marble top and six elegantly carved high-back chairs with comfortable upholstery — a timeless choice for formal dining rooms.' },

  { id:'df32', name:'SPD-40 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-40.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table with Italian Marble Top', colour:'Dark Walnut', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-40 continues the popular 6336 format with an Italian marble top and six ladder-back chairs with blue fabric upholstery — bold colour meets classic wood craftsmanship.' },

  { id:'df33', name:'SPD-41 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/SPD-41.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:89113, originalPrice:105000,
    specs:{ material:'4 Leg Table with Printed Glass Top', colour:'Natural Teak', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-41 brings warm natural teak tones with a decorative printed glass top and six carved chairs with cream upholstery — a blend of artisan craft and contemporary style.' },

  { id:'df34', name:'SPD-42 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-42.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table with Italian Marble Top', colour:'Dark Walnut', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-42 pairs a sleek Italian marble top with six slatted high-back chairs in warm mauve upholstery — a refined dining set that balances elegance with everyday durability.' },

  { id:'df35', name:'SPD-43 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/SPD-43.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:89113, originalPrice:105000,
    specs:{ material:'4 Leg Table with Printed Glass Top', colour:'Dark Walnut', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-43 features a bold printed glass top with six slatted chairs upholstered in ocean blue fabric — a dramatic, fashion-forward set for modern dining spaces.' },

  { id:'df36', name:'SPD-44 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-44.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:93290, originalPrice:110000,
    specs:{ material:'4 Leg Table with Italian Marble Top', colour:'Dark Brown', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-44 combines a pristine white Italian marble top with six ladder-back chairs in deep brown upholstery — a contrast-rich set that commands attention in any dining room.' },

  { id:'df37', name:'SPD-45 — 1+6 Dining Set (6336)', series:'SPD Series',
    image:'/dining/catalogue/SPD-45.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:96075, originalPrice:113000,
    specs:{ material:'4 Leg Table with Italian Marble Top', colour:'Dark Walnut', dimensions:'6336 Table + 6 Chairs', series:'SPD Series' },
    description:'SPD-45 is a premium pick in the SPD range — a stately Italian marble top table paired with six richly carved and upholstered chairs that evoke old-world grandeur.' },

  { id:'df38', name:'Allwin-SPD46 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/Allwin-SPD46.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:89113, originalPrice:105000,
    specs:{ material:'4 Leg Table with Printed Glass Top', colour:'Dark Walnut', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'Allwin-SPD46 is a standout 6-seater with a striking circular-pattern printed glass top and six intricately carved chairs with warm beige upholstery — where artisanal detail meets showpiece design.' },

  { id:'df39', name:'Ferro-SPD47 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/Ferro-SPD47.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:91898, originalPrice:108000,
    specs:{ material:'4 Leg Table with Printed Glass Top', colour:'Honey Oak', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'Ferro-SPD47 brings warmth and elegance to your dining room — a rich honey oak finish with a decorative glass-top table and six plush chairs with neutral upholstery, ideal for modern Indian homes.' },

  { id:'df40', name:'Atlanta-SPD49 — 1+6 Dining Set (6636)', series:'SPD Series',
    image:'/dining/catalogue/Atlanta-SPD49.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SPD', price:89113, originalPrice:105000,
    specs:{ material:'4 Leg Table with Printed Glass Top', colour:'Dark Walnut', dimensions:'6636 Table + 6 Chairs', series:'SPD Series' },
    description:'Atlanta-SPD49 features a dark walnut frame with a decorative printed glass top and six ladder-back chairs with cream upholstery — a clean, architectural set for contemporary interiors.' },

  /* ── SMD Series — New Additions ── */
  { id:'df41', name:'SMD-04 — 1+6 Dining Set (7236)', series:'SMD Series',
    image:'/dining/catalogue/SMD-04.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SMD', price:160012, originalPrice:188000,
    specs:{ material:'Center Base Table, Italian Marble Top', colour:'Dark Walnut', dimensions:'7236 Table + 6 Chairs', series:'SMD Series' },
    description:'SMD-04 is a large-format luxury 6-seater with a center-base table and Italian marble top. Six high-back button-tufted chairs complete this opulent set, designed for grand dining rooms and formal entertaining.' },

  { id:'df42', name:'SMD-05 — 1+6 Dining Set (7236)', series:'SMD Series',
    image:'/dining/catalogue/SMD-05.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'SMD', price:160012, originalPrice:188000,
    specs:{ material:'Center Base Table, Italian Marble Top', colour:'Dark Brown', dimensions:'7236 Table + 6 Chairs', series:'SMD Series' },
    description:'SMD-05 presents a center-base dining table with a premium Italian marble top, paired with six elegantly carved chairs with sumptuous upholstery — a masterpiece for luxury homes.' },

  { id:'df43', name:'SMD-08 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-08.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:143067, originalPrice:168000,
    specs:{ material:'Center Base with Onyx Top & 3" Sling', colour:'Dark Walnut', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-08 features a spectacular center-base table with an Onyx marble top and 3-inch sling detailing. Four premium upholstered chairs complete this exclusive 4-seater collection.' },

  { id:'df44', name:'SMD-09 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-09.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:154528, originalPrice:182000,
    specs:{ material:'Center Base, GO2 Top with Inlay & 3" Sling', colour:'Dark Walnut', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-09 elevates dining luxury with a GO2 marble top with exquisite inlay detailing and a 3-inch sling base. Four lavishly upholstered chairs create a truly exclusive dining experience.' },

  { id:'df45', name:'SMD-10 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-10.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:147287, originalPrice:173000,
    specs:{ material:'Center Base with Onyx Top & 3" Sling', colour:'Dark Walnut', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-10 pairs an Onyx marble top and sculpted 3-inch sling base with four premium high-back chairs — a statement 4-seater built for those who demand nothing but the finest.' },

  { id:'df46', name:'SMD-11 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-11.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:174027, originalPrice:205000,
    specs:{ material:'Center Base with Onyx Top & 3" Sling', colour:'Dark Walnut / Gold', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-11 is a dramatic luxury set with an Onyx marble top on a gold-accented sling base. The four chairs are finished in premium fabric, creating an unmatched atmosphere of exclusivity.' },

  { id:'df47', name:'SMD-12 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-12.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:188781, originalPrice:222000,
    specs:{ material:'Center Base with Onyx Top & 3" Sling', colour:'Dark Walnut', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-12 commands attention with its grand Onyx marble top and architectural sling base. Four high-back chairs with bespoke upholstery make this one of our most prestigious 4-seater offerings.' },

  { id:'df48', name:'SMD-13 — 1+4 Dining Set (4848)', series:'SMD Series',
    image:'/dining/catalogue/SMD-13.jpg',
    category:'Dining Set', seating:'4 Seater', type:'Set', tag:'SMD', price:168452, originalPrice:198000,
    specs:{ material:'Center Base with Onyx Top & 3" Sling', colour:'Dark Brown', dimensions:'4848 Center Base Table + 4 Chairs', series:'SMD Series' },
    description:'SMD-13 blends the grandeur of an Onyx marble top with a richly carved sling base in dark brown. Four supremely comfortable upholstered chairs round off this impeccable luxury set.' },

  /* ── TONA ── */
  { id:'df49', name:'Tona — 1+6 Dining Set (6336)', series:'Valuable Series',
    image:'/dining/catalogue/Tona-6S.jpg',
    category:'Dining Set', seating:'6 Seater', type:'Set', tag:'Valuable', price:80452, originalPrice:95000,
    specs:{ material:'Solid Wood, Composite Italian Marble Top', colour:'Dark Brown', dimensions:'6336 Table + 6 Chairs', series:'Valuable Series' },
    description:'The Tona 6-seater is a handsome solid wood set with a composite Italian marble top and six well-crafted dining chairs — perfect for family gatherings and festive occasions alike.' },
];

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', gap:8, fontSize:'0.82rem', padding:'5px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ color:'#6b6359', minWidth:130, flexShrink:0 }}>{label}</span>
      <span style={{ color:'#1a1714', fontWeight:500 }}>{value}</span>
    </div>
  );
}

export default function DiningFurniturePage({ onBack, selectedProductId }) {
  const [sortBy,        setSortBy]        = useState('popularity');
  const [filterSeat,    setFilterSeat]    = useState([]);
  const [filterSeries,  setFilterSeries]  = useState([]);
  const [priceMin,      setPriceMin]      = useState('');
  const [priceMax,      setPriceMax]      = useState('');
  const [selectedItem,  setSelectedItem]  = useState(null);
  const [zoomImg,       setZoomImg]       = useState(null);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [openSections,  setOpenSections]  = useState({ seat:true, series:true, price:true });
  const [wishlist,      setWishlist]      = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      const found = diningData.find(d => String(d.id) === String(selectedProductId));
      if (found) setTimeout(() => setSelectedItem(found), 120);
    }
  }, [selectedProductId]);

  const addToCart           = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast           = useToastStore(s => s.show);

  const toggleSection = key => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...diningData];
    if (filterSeat.length)   items = items.filter(d => filterSeat.includes(d.seating));
    if (filterSeries.length) items = items.filter(d => filterSeries.includes(d.tag));
    if (priceMin)            items = items.filter(d => d.price >= parseInt(priceMin));
    if (priceMax)            items = items.filter(d => d.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a,b) => (a.seating||'').localeCompare(b.seating||'') || a.price - b.price);
      case 'price_desc': return items.sort((a,b) => (a.seating||'').localeCompare(b.seating||'') || b.price - a.price);
      case 'newest':     return items.sort((a,b) => (a.seating||'').localeCompare(b.seating||'') || b.id.localeCompare(a.id));
      default:           return items.sort((a,b) => (a.seating||'').localeCompare(b.seating||''));
    }
  }, [filterSeat, filterSeries, priceMin, priceMax, sortBy]);

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: item.id, name: item.name, price: item.price, image: item.image });
    showToast(wishlist.includes(item.id) ? 'Removed from Wishlist' : `"${item.name}" added to Wishlist`, wishlist.includes(item.id) ? 'success' : 'wishlist');
    setWishlist(w => w.includes(item.id) ? w.filter(x => x !== item.id) : [...w, item.id]);
  };

  const renderFilterSection = useCallback((title, key, children) => (
    <div style={{ borderBottom:'1px solid rgba(0,0,0,0.08)', paddingBottom:16, marginBottom:16 }}>
      <button onClick={() => toggleSection(key)} style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        width:'100%', background:'none', border:'none', cursor:'pointer',
        fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', fontWeight:700,
        letterSpacing:'0.10em', textTransform:'uppercase', color:'#1a1714', padding:'0 0 10px 0'
      }}>
        {title}
        {openSections[key] ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
      </button>
      {openSections[key] && children}
    </div>
  ), [openSections]);

  return (
    <>
      <style>{`
        .dp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .dp-hero { background:linear-gradient(135deg,#f5f0e8 0%,#ede8de 100%); padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .dp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .dp-back:hover { color:#1a1714; }
        .dp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;color:#1a1714;margin:0 0 6px;letter-spacing:-0.01em; }
        .dp-sub { font-size:0.83rem;color:#6b6359;margin:0 0 12px; }
        .dp-series-badge { display:inline-block;padding:4px 12px;border:1px solid rgba(201,169,110,0.4);font-size:0.65rem;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:#c9a96e;margin:2px 4px 2px 0;cursor:pointer;transition:all 0.18s;background:transparent; }
        .dp-series-badge:hover,.dp-series-badge.active { background:#c9a96e;color:#fff;border-color:#c9a96e; }
        .dp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .dp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .dp-main { padding:24px 32px 60px; }
        .dp-toolbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .dp-count { font-size:0.78rem;color:#6b6359; }
        .dp-count strong { color:#1a1714;font-weight:600; }
        .dp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none; }
        .dp-sort::-webkit-scrollbar { display:none; }
        .dp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .dp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .dp-sort-btn.active,.dp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }
        .dp-list { display:flex;flex-direction:column;gap:20px; }
        .dp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;transition:box-shadow 0.25s,border-color 0.25s;overflow:hidden; }
        .dp-row:hover { box-shadow:0 8px 32px rgba(0,0,0,0.10);border-color:rgba(201,169,110,0.35); }
        .dp-row-img-wrap { position:relative;width:240px;flex-shrink:0;overflow:hidden;background:#f5f0e8; }
        .dp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .dp-row:hover .dp-row-img { transform:scale(1.04); }
        .dp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .dp-series-label { position:absolute;bottom:10px;left:10px;font-size:0.58rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;background:rgba(0,0,0,0.55);color:#fff;backdrop-filter:blur(3px); }
        .dp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:color 0.18s; }
        .dp-row-wish:hover { color:#c0392b; }
        .dp-row-body { flex:1;padding:20px 26px;display:flex;flex-direction:column;justify-content:space-between; }
        .dp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:600;color:#1a1714;margin:0 0 4px; }
        .dp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px; }
        .dp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .dp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .dp-row-price { font-size:1.5rem;font-weight:700;color:#1a1714; }
        .dp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .dp-row-disc  { font-size:0.78rem;font-weight:600;color:#c9a96e; }
        .dp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;display:flex;align-items:flex-start;justify-content:flex-end; }
        .dp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;animation:dpSlideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes dpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .dp-detail-img { width:100%;height:340px;object-fit:contain;background:#f5f0e8; }
        .dp-detail-body { padding:28px 32px 48px; }
        .dp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;display:inline-block;margin-bottom:8px; }
        .dp-detail-series { font-size:0.68rem;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:#c9a96e;margin-bottom:10px;display:block; }
        .dp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#1a1714;margin:0 0 10px; }
        .dp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .dp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .dp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .dp-detail-disc  { font-size:0.85rem;font-weight:600;color:#c9a96e; }
        .dp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .dp-detail-specs { margin-bottom:24px; }
        .dp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .dp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .dp-detail-close:hover { background:#fff; }
        .dp-mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .dp-layout { grid-template-columns:1fr; }
          .dp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;overflow-y:auto;padding:20px; }
          .dp-sidebar.open { display:block!important; }
          .dp-mob-filter-btn { display:flex!important; }
          .dp-hero { padding:24px 16px 20px; }
          .dp-main { padding:16px 16px 60px; }
          .dp-row-img-wrap { width:140px; }
          .dp-row-img { height:160px; }
          .dp-row-name { font-size:1.1rem; }
          .dp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .dp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .dp-row { flex-direction:column; }
          .dp-row-img-wrap { width:100%; }
          .dp-row-img { height:200px; }
          .dp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="dp-root">
        {/* Hero */}
        <div className="dp-hero" style={{ maxWidth:'100%' }}>
          <div style={{ maxWidth:1320, margin:'0 auto' }}>
            <button className="dp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5}/> Back to Home
            </button>
            <h1 className="dp-heading">Dining Furniture</h1>
            <p className="dp-sub">From the Oasis Furniture Catalogue 2026 — {diningData.length} curated dining sets across 5 series. Showing {filtered.length} products.</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {['Valuable','Sheesham','SPD','SMD','Premium'].map(s => (
                <button key={s} className={`dp-series-badge${filterSeries.includes(s) ? ' active' : ''}`}
                  onClick={() => toggleArr(filterSeries, setFilterSeries, s)}>
                  {s} Series
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dp-layout">
          {/* Sidebar */}
          <aside className={`dp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.10em', textTransform:'uppercase', color:'#1a1714' }}>FILTERS</span>
              <button className="dp-mob-filter-btn" onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection('SEATING', 'seat', <>
              {['4 Seater','6 Seater'].map(s => (
                <label key={s} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterSeat.includes(s)} onChange={() => toggleArr(filterSeat, setFilterSeat, s)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }}/> {s}
                </label>
              ))}
            </>)}

            {renderFilterSection('SERIES', 'series', <>
              {['Valuable','Sheesham','SPD','SMD','Premium'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#3d3830', padding:'4px 0', userSelect:'none' }}>
                  <input type="checkbox" checked={filterSeries.includes(t)} onChange={() => toggleArr(filterSeries, setFilterSeries, t)} style={{ accentColor:'#c9a96e', width:14, height:14, cursor:'pointer' }}/> {t} Series
                </label>
              ))}
            </>)}

            {renderFilterSection('PRICE RANGE (₹)', 'price', <>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }}/>
                <span style={{ color:'#aaa', flexShrink:0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width:'100%', padding:'6px 10px', border:'1px solid rgba(0,0,0,0.15)', fontFamily:"'Jost',sans-serif", fontSize:'0.8rem', color:'#1a1714', outline:'none' }}/>
              </div>
            </>)}

            {(filterSeat.length > 0 || filterSeries.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterSeat([]); setFilterSeries([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em', textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b', padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main */}
          <main className="dp-main">
            <div className="dp-toolbar">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button className="dp-mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(0,0,0,0.15)', padding:'7px 14px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'0.74rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="dp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="dp-sort">
                <span className="dp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`dp-sort-btn${sortBy === o.value ? ' active' : ''}`} onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            <div className="dp-list">
              {(() => {
                let lastSeating = null;
                return filtered.map(item => {
                  const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
                  const tc = tagColors[item.tag] || tagColors['New'];
                  const inWl = wishlist.includes(item.id);
                  const rt = stableRatings.find(r => r.id === item.id) || { rating: 4.5, count: 42 };
                  const showHeader = item.seating !== lastSeating;
                  lastSeating = item.seating;
                  return (
                    <div key={item.id}>
                      {showHeader && (
                        <div style={{ padding:'18px 0 10px', borderBottom:'2px solid rgba(201,169,110,0.3)', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
                          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', fontWeight:700, color:'#1a1714' }}>
                            {item.seating === '4 Seater' ? '4-Seater Dining Sets' : item.seating === '6 Seater' ? '6-Seater Dining Sets' : item.seating}
                          </span>
                          <span style={{ fontSize:'0.72rem', color:'#6b6359', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                            ({filtered.filter(x => x.seating === item.seating).length} designs)
                          </span>
                        </div>
                      )}
                      <div className="dp-row" onClick={() => setSelectedItem(item)}>
                        <div className="dp-row-img-wrap">
                          <img className="dp-row-img" src={item.image} alt={item.name} loading="lazy"
                            style={{ cursor:'zoom-in' }}
                            onClick={e => { e.stopPropagation(); setZoomImg({ src: item.image, alt: item.name }); }}/>
                          <span className="dp-row-tag" style={{ background:tc.bg, color:tc.color }}>{item.tag}</span>
                          <span className="dp-series-label">{item.series}</span>
                          <button className="dp-row-wish" onClick={e => handleWishlist(item, e)} style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                            <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'}/>
                          </button>
                        </div>
                        <div className="dp-row-body">
                          <div>
                            <h3 className="dp-row-name">{item.name}</h3>
                            <StarRating rating={rt.rating} count={rt.count}/>
                            <p className="dp-row-desc">{item.description}</p>
                            <div>
                              {item.seating && <span className="dp-spec-chip">· {item.seating}</span>}
                              {item.type && <span className="dp-spec-chip">· {item.type}</span>}
                              {item.specs.material && <span className="dp-spec-chip">· {item.specs.material}</span>}
                            </div>
                          </div>
                          <div>
                            <div className="dp-row-price-row">
                              <span className="dp-row-price">₹{item.price.toLocaleString('en-IN')}</span>
                              {item.originalPrice && <span className="dp-row-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                              {disc && <span className="dp-row-disc">{disc}% off</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359', fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No products match your current filters.<br/>
                  <button onClick={() => { setFilterSeat([]); setFilterSeries([]); setPriceMin(''); setPriceMax(''); }}
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
      {selectedItem && (() => {
        const item = selectedItem;
        const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;
        const tc = tagColors[item.tag] || tagColors['New'];
        const inWl = wishlist.includes(item.id);
        return (
          <div className="dp-detail-overlay" onClick={() => setSelectedItem(null)}>
            <div className="dp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="dp-detail-close" onClick={() => setSelectedItem(null)}><X size={16}/></button>
              <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setZoomImg({ src: item.image, alt: item.name })}>
                <img className="dp-detail-img" src={item.image} alt={item.name}/>
                <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.45)', color:'#fff', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(3px)', pointerEvents:'none' }}>
                  <ZoomIn size={16}/>
                </div>
              </div>
              <div className="dp-detail-body">
                <span className="dp-detail-tag" style={{ background:tc.bg, color:tc.color }}>{item.tag}</span>
                <span className="dp-detail-series">{item.series} · Oasis Furniture Catalogue 2026</span>
                <h2 className="dp-detail-name">{item.name}</h2>
                <StarRating rating={4.7} count={87}/>
                <div className="dp-detail-price-row">
                  <span className="dp-detail-price">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.originalPrice && <span className="dp-detail-orig">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="dp-detail-disc">{disc}% off</span>}
                </div>
                <p className="dp-detail-desc">{item.description}</p>
                <div className="dp-detail-specs">
                  <p className="dp-detail-specs-title">Specifications</p>
                  <SpecRow label="Seating"     value={item.seating}/>
                  <SpecRow label="Type"        value={item.type}/>
                  <SpecRow label="Series"      value={item.series}/>
                  <SpecRow label="Material"    value={item.specs.material}/>
                  <SpecRow label="Colour"      value={item.specs.colour}/>
                  <SpecRow label="Dimensions"  value={item.specs.dimensions}/>
                </div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <button onClick={e => handleWishlist(item, e)} style={{
                    padding:'14px 18px', border:'1px solid rgba(0,0,0,0.15)', background:'#fff',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                    fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600,
                    letterSpacing:'0.10em', textTransform:'uppercase',
                    color: inWl ? '#c0392b' : '#1a1714',
                    borderColor: inWl ? '#c0392b' : 'rgba(0,0,0,0.15)'
                  }}>
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'}/>
                    {inWl ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {zoomImg && <ImageZoomModal src={zoomImg.src} alt={zoomImg.alt} onClose={() => setZoomImg(null)}/>}
    </>
  );
}