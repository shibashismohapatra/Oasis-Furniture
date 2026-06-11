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
    (Updated May 2026 — MRP Catalogue)
───────────────────────────────────────────── */
const centerTableData = [

  /* ── Italian Top Series ── */
  {
    id: 1,
    name: 'VIGGO',
    image: '/center-tables/VIGGO.jpeg',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Champagne & White',
    tag: 'Premium',
    price: 26056,
    originalPrice: 32000,
    productCode: 'VIGGO - 3921',
    dimensions: '990(W) × 420(H) × 530(D) mm',
    description: 'The VIGGO center table makes a refined statement with its composite Italian top and curved drawer fronts adorned with gold-tone handles. Its warm champagne finish and ribbed detailing on the apron bring a contemporary Italian elegance to any living space.',
  },
  {
    id: 2,
    name: 'IMPERIA',
    image: '/center-tables/IMPERIA.jpeg',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Graphite & White',
    tag: 'New',
    price: 20970,
    originalPrice: 26000,
    productCode: 'IMPERIA - 3921',
    dimensions: '990(W) × 420(H) × 530(D) mm',
    description: 'IMPERIA strikes a bold contrast with its graphite frame and crisp white panelling, topped with a luxurious composite Italian surface. The central ribbed accent panel gives it a gallery-worthy silhouette that anchors modern interiors effortlessly.',
  },
  {
    id: 3,
    name: 'OSAKA',
    image: '/center-tables/OSAKA.jpeg',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Natural Wood',
    tag: 'Bestseller',
    price: 25684,
    originalPrice: 32000,
    productCode: 'OSAKA',
    dimensions: '1200(W) × 560(H) × 600(D) mm',
    description: 'OSAKA features an organically shaped bi-level Italian composite top in a clean natural wood frame. Its sculptural silhouette brings a Japandi aesthetic — minimal yet warm — to contemporary living spaces.',
  },
  {
    id: 4,
    name: 'SKODA',
    image: '/center-tables/SKODA.jpeg',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Steel Blue',
    tag: 'New',
    price: 24598,
    originalPrice: 30000,
    productCode: 'SKODA',
    dimensions: '1240(W) × 510(H) × 600(D) mm',
    description: 'SKODA is a wide-format center table with a cool steel blue body and a glowing composite Italian top. Its generous surface area and open lower shelf make it ideal for larger living rooms seeking a modern focal point.',
  },

  /* ── PU Finish Series ── */
  {
    id: 5,
    name: 'ELIO',
    image: '/center-tables/ELIO.jpeg',
    series: 'PU Finish Series',
    type: 'Centre Table',
    topMaterial: 'Designer Printed Top with PU Finish',
    finish: 'Navy & Chrome',
    tag: 'Premium',
    price: 24327,
    originalPrice: 30000,
    productCode: 'ELIO - 3921',
    dimensions: '990(W) × 445(H) × 530(D) mm',
    description: 'ELIO\'s deep navy body with a chrome-trimmed designer printed top brings a bold, contemporary feel to your drawing room. Its elevated height and open shelf storage make it as functional as it is striking.',
  },
  {
    id: 6,
    name: 'DION',
    image: '/center-tables/DION.jpeg',
    series: 'PU Finish Series',
    type: 'Centre Table',
    topMaterial: 'Designer Printed Top with PU Finish',
    finish: 'Steel Blue & Marble',
    tag: 'New',
    price: 21784,
    originalPrice: 27000,
    productCode: 'DION - 3921',
    dimensions: '990(W) × 450(H) × 530(D) mm',
    description: 'DION pairs a stone-effect printed top with a steel blue base and a sliding door storage compartment. Its clean geometric form and cool tonal palette make it perfect for modern and Scandinavian-inspired interiors.',
  },
  {
    id: 7,
    name: 'DELIA',
    image: '/center-tables/DELIA.jpeg',
    series: 'PU Finish Series',
    type: 'Centre Table',
    topMaterial: 'Designer Printed Top with PU Finish',
    finish: 'Natural Beige & Marble',
    tag: 'Bestseller',
    price: 24598,
    originalPrice: 30000,
    productCode: 'DELIA - 3921',
    dimensions: '990(W) × 450(H) × 530(D) mm',
    description: 'DELIA offers a warm beige frame with a marble-effect printed top and a single drawer. Its natural tone and delicate veining make it the perfect transitional piece between classic and contemporary interiors.',
  },
  {
    id: 8,
    name: 'AISHA',
    image: '/center-tables/AISHA.jpeg',
    series: 'PU Finish Series',
    type: 'Centre Table',
    topMaterial: 'Designer Printed Top with PU Finish',
    finish: 'White & Marble',
    tag: 'New',
    price: 22513,
    originalPrice: 28000,
    productCode: 'AISHA - 3921',
    dimensions: '990(W) × 450(H) × 530(D) mm',
    description: 'AISHA is a pristine all-white center table with a subtle marble-veined printed top and a neatly recessed drawer. Its clean lines and bright finish make it the perfect choice for light-filled minimalist interiors.',
  },
  {
    id: 9,
    name: 'NORA',
    image: '/center-tables/NORA.jpeg',
    series: 'PU Finish Series',
    type: 'Centre Table',
    topMaterial: 'Designer Printed Top with PU Finish',
    finish: 'White Fluted',
    tag: 'New',
    price: 16899,
    originalPrice: 21000,
    productCode: 'NORA - 4624',
    dimensions: '1170(W) × 420(H) × 600(D) mm',
    description: 'NORA stands out with its all-white fluted pedestal base and a dramatic dark stone-effect oval top. The vertical ribbing on the base adds tactile texture and sculptural depth, making it an instant centrepiece.',
  },

  /* ── Classic Series ── */
  {
    id: 10,
    name: 'NAOMI',
    image: '/center-tables/NAOMI.jpeg',
    series: 'Classic Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Navy & Silver',
    tag: 'Bestseller',
    price: 15542,
    originalPrice: 19500,
    productCode: 'NAOMI - 3921',
    dimensions: '990(W) × 400(H) × 535(D) mm',
    description: 'NAOMI features a deep navy frame with a contrasting silver border detail and a composite Italian top. Its bold cutout motif on the front panel gives it a distinctive, graphic character perfect for modern urban homes.',
  },

  /* ── Marble Top Series ── */
  {
    id: 11,
    name: 'MELTA',
    image: '/center-tables/MELTA.jpeg',
    series: 'Marble Top Series',
    type: 'Centre Table',
    topMaterial: 'GO2 Marble Top',
    finish: 'Walnut Dark Wood',
    tag: 'Premium',
    price: 25684,
    originalPrice: 32000,
    productCode: 'MELTA - 4221',
    dimensions: '1050(W) × 400(H) × 535(D) mm',
    description: 'MELTA pairs a genuine GO2 marble top with ornately carved dark walnut legs that reference traditional craftsmanship. A timeless piece that bridges heritage design with modern living room aesthetics.',
  },
  {
    id: 12,
    name: 'JORDEN',
    image: '/center-tables/JORDEN.jpeg',
    series: 'Marble Top Series',
    type: 'Centre Table',
    topMaterial: 'GO2 Marble Top',
    finish: 'Walnut Dark Wood',
    tag: 'Premium',
    price: 29755,
    originalPrice: 37000,
    productCode: 'JORDEN - 4724',
    dimensions: '1190(W) × 400(H) × 600(D) mm',
    description: 'JORDEN is a wide-format center table with a richly veined GO2 marble top supported by sculpted carved wood legs. The premium marble surface and handcrafted base make this an heirloom-quality centrepiece.',
  },

  /* ── Solid Wood / Sheesham Series ── */
  {
    id: 13,
    name: 'DORIS',
    image: '/center-tables/DORIS.jpeg',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'GO2 Marble Top',
    finish: 'Sheesham Natural',
    tag: 'Premium',
    price: 27041,
    originalPrice: 33500,
    productCode: 'DORIS - 4221',
    dimensions: '975(W) × 450(H) × 445(D) mm',
    description: 'DORIS combines a GO2 marble top with a bold X-shaped Sheesham wood base. The dramatic cross-leg structure and rich natural grain make this an unmistakably premium choice for sophisticated living rooms.',
  },
  {
    id: 14,
    name: 'SCT-01',
    image: '/center-tables/SCT-01.jpeg',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'GO2 Marble Top',
    finish: 'Sheesham Natural',
    tag: 'Premium',
    price: 27312,
    originalPrice: 34000,
    productCode: 'SCT-01 4824',
    dimensions: '1200(W) × 460(H) × 600(D) mm',
    description: 'SCT-01 features a wide GO2 marble top on a dramatic sculptural Sheesham X-base. The contrast of cool white marble against warm natural wood creates a bold focal point for any premium living space.',
  },
  {
    id: 15,
    name: 'SCT-02',
    image: '/center-tables/SCT-02.png',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'Glass Top',
    finish: 'Sheesham Natural',
    tag: 'Bestseller',
    price: 24327,
    originalPrice: 30000,
    productCode: 'SCT-02 3921',
    dimensions: '990(W) × 440(H) × 530(D) mm',
    description: 'SCT-02 brings the warmth of Sheesham wood with the lightness of a glass top. The angled wooden legs and lower display shelf offer a perfect blend of open design and practical storage in natural hardwood.',
  },
  {
    id: 16,
    name: 'SCT-03',
    image: '/center-tables/SCT-03.png',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'Glass Top',
    finish: 'Sheesham Natural',
    tag: 'New',
    price: 21970,
    originalPrice: 27500,
    productCode: 'SCT-03 3921',
    dimensions: '990(W) × 440(H) × 530(D) mm',
    description: 'SCT-03 features a glass top over a Sheesham cross-leg frame with a lower magazine shelf. Its open airy design and natural hardwood character bring warmth and simplicity to contemporary drawing rooms.',
  },
  {
    id: 17,
    name: 'SCT-04',
    image: '/center-tables/SCT-04.jpeg',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'Glass Top',
    finish: 'Sheesham Dark',
    tag: 'New',
    price: 21970,
    originalPrice: 27500,
    productCode: 'SCT-04 3921',
    dimensions: '990(W) × 440(H) × 530(D) mm',
    description: 'SCT-04 offers a darker Sheesham finish with Z-shaped side supports and a black glass top, giving it an edgier, more architectural character compared to its siblings in the SCT range.',
  },
  {
    id: 18,
    name: 'SCT-05',
    image: '/center-tables/SCT-05.jpeg',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'Glass Top',
    finish: 'Sheesham Natural',
    tag: 'New',
    price: 20613,
    originalPrice: 25500,
    productCode: 'SCT-05',
    dimensions: '770(Dia) × 460(H) mm',
    description: 'SCT-05 is a round Sheesham center table with a circular glass top and a lower display shelf. Its compact round form makes it ideal for smaller living areas or as a complementary piece in a larger arrangement.',
  },
  {
    id: 19,
    name: 'THITA',
    image: '/center-tables/THITA.png',
    series: 'Solid Wood Series',
    type: 'Centre Table',
    topMaterial: 'Glass Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 21070,
    originalPrice: 26500,
    productCode: 'THITA - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'THITA features an ornate carved apron panel with decorative cutout motifs under a dark glass top. Its rich dark walnut finish and traditional carving detail make it a distinguished piece for classically styled living rooms.',
  },

  /* ── Coffee Table & Chair Sets ── */
  {
    id: 20,
    name: 'JERRY (Natural)',
    image: '/center-tables/JERRY.png',
    series: 'Coffee Table Sets',
    type: 'Coffee Table Set',
    topMaterial: 'White Table Top',
    finish: 'Natural Sheesham',
    tag: 'Premium',
    price: 37017,
    originalPrice: 46000,
    productCode: 'COFFEE TABLE 1+2 (2 Chair + 1 Table)',
    dimensions: 'Set of 3 pieces',
    description: 'JERRY is a complete coffee table set with 2 matching armchairs and a small white-top table. The natural Sheesham wood frame and dark fabric cushions create an inviting seating alcove perfect for living room corners.',
  },
  {
    id: 21,
    name: 'SKYLINE',
    image: '/center-tables/SKYLINE.png',
    series: 'Coffee Table Sets',
    type: 'Coffee Table Set',
    topMaterial: 'Solid Wood Table',
    finish: 'Sheesham Natural',
    tag: 'Bestseller',
    price: 27041,
    originalPrice: 33500,
    productCode: 'SKYLINE (Sheesham Wood)',
    dimensions: 'Set of 3 pieces',
    description: 'SKYLINE is a folding chair and table set in natural Sheesham wood — two folding slatted chairs and a matching round side table. Perfect for balconies, living corners, or outdoor use with natural wood warmth.',
  },

  /* ── OMEGA Series ── */
  {
    id: 22,
    name: 'OMEGA (4824)',
    image: '/center-tables/OMEGA-4824.png',
    series: 'OMEGA Series',
    type: 'Centre Table',
    topMaterial: 'White Composite Top',
    finish: 'Dark Walnut & White',
    tag: 'Bestseller',
    price: 15831,
    originalPrice: 19500,
    productCode: 'OMEGA - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'OMEGA 4824 is a striking two-tone center table with horizontal white stripe detailing against a dark walnut body. The side-access open shelf and bold graphic aesthetic make it a statement piece for modern living rooms.',
  },
  {
    id: 23,
    name: 'OMEGA (3618)',
    image: '/center-tables/OMEGA-3618.png',
    series: 'OMEGA Series',
    type: 'Centre Table',
    topMaterial: 'White Composite Top',
    finish: 'Dark Walnut & White',
    tag: 'New',
    price: 13914,
    originalPrice: 17000,
    productCode: 'OMEGA - 3618',
    dimensions: '900(W) × 400(H) × 450(D) mm',
    description: 'OMEGA 3618 brings the same bold two-tone Walnut & White design in a compact size perfect for apartments and smaller living rooms. Horizontal white band detailing gives it its distinctive modern character.',
  },
  {
    id: 24,
    name: 'OMEGA (3921)',
    image: '/center-tables/OMEGA-3921.png',
    series: 'OMEGA Series',
    type: 'Centre Table',
    topMaterial: 'White Composite Top',
    finish: 'Dark Walnut & White',
    tag: 'New',
    price: 14728,
    originalPrice: 18000,
    productCode: 'OMEGA - 3921',
    dimensions: '990(W) × 400(H) × 535(D) mm',
    description: 'OMEGA 3921 is the mid-size option in the popular OMEGA Series. The horizontal white stripe detailing and dark walnut base create a sophisticated modern aesthetic at an accessible price point.',
  },
  {
    id: 25,
    name: 'OMEGA (3636)',
    image: '/center-tables/OMEGA-3636.png',
    series: 'OMEGA Series',
    type: 'Centre Table',
    topMaterial: 'White Composite Top',
    finish: 'Dark Walnut & White',
    tag: 'New',
    price: 18527,
    originalPrice: 23000,
    productCode: 'OMEGA - 3636',
    dimensions: '900(W) × 400(H) × 900(D) mm',
    description: 'OMEGA 3636 is a square variant in the OMEGA Series — perfect as a coffee table or beside a sofa corner. The same bold two-tone Walnut & White design in a compact square footprint.',
  },
  {
    id: 26,
    name: 'OMEGA (2121)',
    image: '/center-tables/OMEGA-2121.png',
    series: 'OMEGA Series',
    type: 'Side Table',
    topMaterial: 'White Composite Top',
    finish: 'Dark Walnut & White',
    tag: 'New',
    price: 9928,
    originalPrice: 12500,
    productCode: 'OMEGA - 2121',
    dimensions: '535(W) × 400(H) × 535(D) mm',
    description: 'OMEGA 2121 is the compact side table version of the OMEGA Series — ideal as an end table beside a sofa or bed. Same signature Walnut & White two-tone design in a space-saving square format.',
  },

  /* ── SIGMA Series ── */
  {
    id: 27,
    name: 'SIGMA (4824)',
    image: '/center-tables/SIGMA-4824.png',
    series: 'SIGMA Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 13099,
    originalPrice: 16500,
    productCode: 'SIGMA - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'SIGMA 4824 is a clean-lined center table with a glass top insert and a lower open shelf for display or storage. The dark walnut frame with simple square legs offers a timeless modern aesthetic.',
  },
  {
    id: 28,
    name: 'SIGMA (3921)',
    image: '/center-tables/SIGMA-3921.png',
    series: 'SIGMA Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 12285,
    originalPrice: 15500,
    productCode: 'SIGMA - 3921',
    dimensions: '990(W) × 400(H) × 535(D) mm',
    description: 'SIGMA 3921 brings classic glass-top center table design with a lower storage shelf in a mid-size format. The dark walnut finish and clean square frame work with any interior style.',
  },
  {
    id: 29,
    name: 'SIGMA (3618)',
    image: '/center-tables/SIGMA-3618.png',
    series: 'SIGMA Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 11471,
    originalPrice: 14500,
    productCode: 'SIGMA - 3618',
    dimensions: '900(W) × 420(H) × 600(D) mm',
    description: 'SIGMA 3618 is a compact version of the classic SIGMA design — glass top with a lower open shelf in a smaller apartment-friendly footprint. Dark walnut finish with simple square wood legs.',
  },
  {
    id: 30,
    name: 'SIGMA (3636)',
    image: '/center-tables/SIGMA-3636.png',
    series: 'SIGMA Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 15542,
    originalPrice: 19500,
    productCode: 'SIGMA - 3636',
    dimensions: '900(W) × 420(H) × 900(D) mm',
    description: 'SIGMA 3636 is a square-format SIGMA center table — perfect for symmetrical placement with a corner sofa. Glass top and lower shelf in a dark walnut frame with solid square legs.',
  },
  {
    id: 31,
    name: 'SIGMA DESIGNER',
    image: '/center-tables/SIGMA-DESIGNER.png',
    series: 'SIGMA Series',
    type: 'Centre Table',
    topMaterial: 'Designer Wood Top',
    finish: 'Dark Walnut & Light Wood',
    tag: 'Premium',
    price: 37878,
    originalPrice: 47000,
    productCode: 'SIGMA DESIGNER - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'SIGMA DESIGNER elevates the SIGMA range with a two-tone wooden top — light centre panel in a dark walnut frame. The contrast panel adds visual warmth and a premium feel to this classic design.',
  },

  /* ── CANNA ── */
  {
    id: 32,
    name: 'CANNA',
    image: '/center-tables/CANNA.png',
    series: 'Classic Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 12557,
    originalPrice: 15500,
    productCode: 'CANNA - 3921',
    dimensions: '990(W) × 400(H) × 535(D) mm',
    description: 'CANNA features a sculpted curved base in dark walnut with a smooth plain top. The fluid curves of the leg structure contrast the flat top creating an elegant and distinctive centre table.',
  },

  /* ── OPAL Series ── */
  {
    id: 33,
    name: 'OPAL (4824)',
    image: '/center-tables/OPAL-4824.png',
    series: 'OPAL Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 14999,
    originalPrice: 18500,
    productCode: 'OPAL Plain Glass - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'OPAL 4824 is an oval center table with a plain glass insert in a dark walnut frame with sculptural arched legs. The oval form softens the room and the open shelf below adds functionality.',
  },
  {
    id: 34,
    name: 'OPAL (3618)',
    image: '/center-tables/OPAL-3618.png',
    series: 'OPAL Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 12828,
    originalPrice: 16000,
    productCode: 'OPAL Plain Glass - 3618',
    dimensions: '900(W) × 400(H) × 450(D) mm',
    description: 'OPAL 3618 brings the elegant oval form of the OPAL Series in a smaller format. Perfect for compact living rooms, the arched walnut base and glass top create a light, graceful presence.',
  },
  {
    id: 35,
    name: 'OPAL DESIGNER (4824)',
    image: '/center-tables/OPAL-DESIGNER-4824.png',
    series: 'OPAL Series',
    type: 'Centre Table',
    topMaterial: 'Designer Glass',
    finish: 'Dark Walnut',
    tag: 'Premium',
    price: 18256,
    originalPrice: 22500,
    productCode: 'OPAL DESIGNER GLASS - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'OPAL DESIGNER upgrades the classic OPAL with a premium designer printed glass top featuring a delicate floral motif. The combination of artistic glass and dark walnut arched base makes this truly distinctive.',
  },

  /* ── DIANA Series ── */
  {
    id: 36,
    name: 'DIANA (Plain)',
    image: '/center-tables/DIANA-plain.png',
    series: 'DIANA Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 19912,
    originalPrice: 25000,
    productCode: 'DIANA Plain Glass - 5127',
    dimensions: '1290(W) × 455(H) × 680(D) mm',
    description: 'DIANA Plain is a wide oval center table with a sleek black glass top and dramatic curved C-shaped base panels. Its wide footprint and architectural curved supports make it a standout centerpiece.',
  },
  {
    id: 37,
    name: 'DIANA (Designer)',
    image: '/center-tables/DIANA-designer.png',
    series: 'DIANA Series',
    type: 'Centre Table',
    topMaterial: 'Designer Glass',
    finish: 'Dark Walnut',
    tag: 'Premium',
    price: 29941,
    originalPrice: 37000,
    productCode: 'DIANA Designer Glass - 5127',
    dimensions: '1290(W) × 455(H) × 680(D) mm',
    description: 'DIANA Designer upgrades the DIANA form with a premium etched designer glass top featuring a traditional floral motif. The ornate glass and bold curved base panels create an opulent centerpiece for premium interiors.',
  },

  /* ── CT Italian Top Series ── */
  {
    id: 38,
    name: 'LEONA',
    image: '/center-tables/LEONA.png',
    series: 'CT Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'CT Italian Top with 2 Drawer',
    finish: 'White Fluted',
    tag: 'Premium',
    price: 27584,
    originalPrice: 34000,
    productCode: 'LEONA - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'LEONA is a stunning fluted-panel center table with a CT Italian top and 2 drawers. The all-white ribbed facade with a marble-effect surface creates a luxurious, contemporary look for premium living rooms.',
  },
  {
    id: 39,
    name: 'ODESSY',
    image: '/center-tables/ODESSY.png',
    series: 'CT Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'CT Italian Top with 2 Drawer',
    finish: 'White & Natural Wood',
    tag: 'Bestseller',
    price: 26227,
    originalPrice: 32500,
    productCode: 'ODESSY - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'ODESSY pairs a white body and CT Italian top with warm natural wood legs for a Scandi-inspired look. The 2-drawer storage and handle bar design make it as practical as it is stylish.',
  },
  {
    id: 40,
    name: 'CLORISS',
    image: '/center-tables/CLORISS.png',
    series: 'CT Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'CT Italian Top with 1 Drawer',
    finish: 'White & Natural Wood',
    tag: 'New',
    price: 24870,
    originalPrice: 31000,
    productCode: 'CLORISS - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'CLORISS brings a beautiful oval-top design in white with natural wood legs and a CT Italian top. The single pull-out drawer and elegant oval silhouette make it a refined choice for modern homes.',
  },
  {
    id: 41,
    name: 'KAIRA',
    image: '/center-tables/KAIRA.png',
    series: 'CT Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Polyester with Inlay',
    finish: 'Dark Brown',
    tag: 'Premium',
    price: 67509,
    originalPrice: 84000,
    productCode: 'KAIRA - 4830',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'KAIRA is a premium dark brown center table with a polyester top featuring delicate inlay detailing. Its large footprint and luxurious surface material make it a bold statement for exclusive living spaces.',
  },
  {
    id: 42,
    name: 'GIA',
    image: '/center-tables/GIA.png',
    series: 'CT Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'CT Italian Top with 2 Drawers',
    finish: 'Dark Brown & Ivory',
    tag: 'Bestseller',
    price: 19070,
    originalPrice: 24000,
    productCode: 'GIA - 3921',
    dimensions: '1000(W) × 450(H) × 500(D) mm',
    description: 'GIA is a stylish two-tone center table with a CT Italian top and 2 drawers. The dark chocolate body with ivory door panels and subtle metallic handles deliver a premium look at an accessible price.',
  },

  /* ── BELLE Series ── */
  {
    id: 43,
    name: 'BELLE (4724)',
    image: '/center-tables/BELLE-4724.png',
    series: 'BELLE Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Black & White',
    tag: 'Premium',
    price: 25684,
    originalPrice: 32000,
    productCode: 'BELLE - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'BELLE 4724 is a dramatic black and white center table with a black composite Italian marble top and ivory drawer panel. The scalloped gold-tone handles add an antique French elegance to this monochrome beauty.',
  },
  {
    id: 44,
    name: 'BELLE (3921)',
    image: '/center-tables/BELLE-3921.png',
    series: 'BELLE Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Black & White',
    tag: 'Bestseller',
    price: 23513,
    originalPrice: 29000,
    productCode: 'BELLE - 3921',
    dimensions: '990(W) × 400(H) × 535(D) mm',
    description: 'BELLE 3921 brings the same glamorous black and white combination in a more compact size. The single white drawer with ornate handles against the black composite marble top creates a luxurious French-inspired centerpiece.',
  },

  /* ── Black & White Series ── */
  {
    id: 45,
    name: 'SALSA',
    image: '/center-tables/SALSA.png',
    series: 'Black & White Series',
    type: 'Centre Table',
    topMaterial: 'Composite Top',
    finish: 'Black & White',
    tag: 'Bestseller',
    price: 26298,
    originalPrice: 32500,
    productCode: 'SALSA - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'SALSA is a bold black and white center table with a dramatic black composite marble top and two curved white drawer panels. The wavy drawer fronts and antique brass handles add a theatrical flair to contemporary living rooms.',
  },
  {
    id: 46,
    name: 'BASIL',
    image: '/center-tables/BASIL.png',
    series: 'Black & White Series',
    type: 'Centre Table',
    topMaterial: 'Italian Top',
    finish: 'Black & White',
    tag: 'New',
    price: 24398,
    originalPrice: 30000,
    productCode: 'BASIL - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'BASIL offers clean architectural black and white contrast with a white Italian marble top, a lower recessed drawer and an open cubby. Its sharp rectangular form and silver hardware make it perfect for contemporary interiors.',
  },
  {
    id: 47,
    name: 'OCEAN',
    image: '/center-tables/OCEAN.png',
    series: 'Black & White Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Black & White',
    tag: 'New',
    price: 25684,
    originalPrice: 32000,
    productCode: 'OCEAN - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'OCEAN is an oval center table with a soft-edge white composite Italian top and a jet-black base with golden bun feet. The rounded corners and elegant gold accents make it a perfect blend of modern and traditional glamour.',
  },

  /* ── Nesting Tables ── */
  {
    id: 48,
    name: 'NESTING 2-IN-1 SQUARE',
    image: '/center-tables/NESTING-2IN1.png',
    series: 'Nesting Tables',
    type: 'Nesting Table',
    topMaterial: 'Composite Italian Top',
    finish: 'SS Gold',
    tag: 'Premium',
    price: 38540,
    originalPrice: 48000,
    productCode: 'NESTING 2 IN 1 SQUARE',
    dimensions: 'Big: 790(W)×450(H)×790(D) mm | Small: 600(W)×400(H)×600(D) mm',
    description: 'A gorgeous set of 2 nesting tables in SS Gold with a composite Italian marble top. The square forms stack neatly and can be used separately — one large, one small — for versatile styling flexibility.',
  },
  {
    id: 49,
    name: 'NESTING TWIN (Set of 3)',
    image: '/center-tables/NESTING-TWIN.png',
    series: 'Nesting Tables',
    type: 'Nesting Table',
    topMaterial: 'Composite Italian Top',
    finish: 'SS Gold',
    tag: 'Premium',
    price: 41861,
    originalPrice: 52000,
    productCode: 'NESTING TWIN (SET OF 3)',
    dimensions: 'DIA: 780 & 580 mm',
    description: 'NESTING TWIN Set of 3 features three gold-frame round tables with composite Italian marble tops that nest within each other. The luxurious SS Gold frames and contrasting marble tops make this a glamorous living room statement.',
  },
  {
    id: 50,
    name: 'NESTING TWIN (Set of 2)',
    image: '/center-tables/NESTING-TWIN1.png',
    series: 'Nesting Tables',
    type: 'Nesting Table',
    topMaterial: 'Composite Italian Top',
    finish: 'SS Gold',
    tag: 'Bestseller',
    price: 32112,
    originalPrice: 40000,
    productCode: 'NESTING TWIN (SET OF 2)',
    dimensions: 'DIA: 780 & 580 mm',
    description: 'NESTING TWIN Set of 2 gives you the glamorous SS Gold round nesting table look in a pair. Two different sizes with composite Italian marble tops that nest together — versatile, elegant, and space-saving.',
  },
  {
    id: 51,
    name: 'CHERRY CT',
    image: '/center-tables/CHERRY-CT.png',
    series: 'Nesting Tables',
    type: 'Side Table',
    topMaterial: 'Composite Top',
    finish: 'Available in 6 Colours',
    tag: 'New',
    price: 8300,
    originalPrice: 10500,
    productCode: 'CHERRY CT',
    dimensions: 'Compact Side Table',
    description: 'CHERRY CT is a small decorative side table available in 6 colours with a composite top. Its slim sculptural pedestal base and round top make it perfect as a plant stand, side table or accent piece.',
  },

  /* ── PATRO Series ── */
  {
    id: 52,
    name: 'PATRO-01',
    image: '/center-tables/PATRO-01.png',
    series: 'PATRO Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Blush Pink & SS Gold',
    tag: 'Premium',
    price: 64252,
    originalPrice: 80000,
    productCode: 'PATRO-01 | Size: 4830',
    dimensions: '4830',
    description: 'PATRO-01 is a luxurious center table in blush pink with SS Gold frame detailing and a composite Italian top. The oval form, plush body and two integrated drawers create an ultra-premium focal point for high-end interiors.',
  },
  {
    id: 53,
    name: 'PATRO-02',
    image: '/center-tables/PATRO-02-correct.png',
    series: 'PATRO Series',
    type: 'Side Table',
    topMaterial: 'Composite Top',
    finish: 'Black & SS Gold',
    tag: 'Bestseller',
    price: 18256,
    originalPrice: 22500,
    productCode: 'PATRO-02',
    dimensions: 'Round Side Table',
    description: 'PATRO-02 is a sleek round side table with a black composite top and an elegant SS Gold tripod base. Its refined minimal design makes it perfect as a side table, plant stand or accent in premium living spaces.',
  },
  {
    id: 54,
    name: 'PATRO-03',
    image: '/center-tables/PATRO-03.png',
    series: 'PATRO Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Cream & SS Gold',
    tag: 'Premium',
    price: 43968,
    originalPrice: 54000,
    productCode: 'PATRO-03 | Size: 4830',
    dimensions: '4830',
    description: 'PATRO-03 is an oval center table with a cream composite Italian top and SS Gold open frame base. The exposed gold frame base and clean oval top create an elegant floating aesthetic for luxury interiors.',
  },
  {
    id: 55,
    name: 'PATRO-04',
    image: '/center-tables/PATRO-04.png',
    series: 'PATRO Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Dark Brown & SS Gold',
    tag: 'Premium',
    price: 99177,
    originalPrice: 124000,
    productCode: 'PATRO-04',
    dimensions: 'Oval Nesting Set',
    description: 'PATRO-04 is a statement dual oval nesting set in dark rattan/leather effect with SS Gold oval base frames. The nesting design and premium materials make this the ultimate luxury centerpiece.',
  },
  {
    id: 56,
    name: 'PATRO-05',
    image: '/center-tables/PATRO-05.png',
    series: 'PATRO Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Lilac & SS Gold',
    tag: 'Premium',
    price: 79822,
    originalPrice: 99000,
    productCode: 'PATRO-05 | Size: 4830',
    dimensions: '4830',
    description: 'PATRO-05 is a stunning lilac center table with a composite Italian top and SS Gold vertical bar legs with 3 integrated drawers. The pastel body with gold accents creates an ultra-feminine luxury aesthetic.',
  },
  {
    id: 57,
    name: 'PATRO-06',
    image: '/center-tables/PATRO-06.png',
    series: 'PATRO Series',
    type: 'Side Table',
    topMaterial: 'Composite Italian Top',
    finish: 'White & SS Gold',
    tag: 'Bestseller',
    price: 28398,
    originalPrice: 35000,
    productCode: 'PATRO-06',
    dimensions: 'Round Side Table',
    description: 'PATRO-06 is a circular side table with a white composite Italian top and an SS Gold cylindrical slatted base. The vertical gold slats create a lantern-like aesthetic perfect for glamorous living room corners.',
  },
  {
    id: 58,
    name: 'PATRO-07',
    image: '/center-tables/PATRO-07.png',
    series: 'PATRO Series',
    type: 'Console / Sideboard',
    topMaterial: 'Composite Italian Top',
    finish: 'White & SS Gold',
    tag: 'Premium',
    price: 99004,
    originalPrice: 124000,
    productCode: 'PATRO-07',
    dimensions: 'Large Sideboard',
    description: 'PATRO-07 is an oval sideboard with 4 cabinet doors in white with SS Gold frame. The graceful oval form and premium gold accents make it a statement living room storage piece for luxury interiors.',
  },
  {
    id: 59,
    name: 'PATRO-08',
    image: '/center-tables/PATRO-08.png',
    series: 'PATRO Series',
    type: 'Console / Sideboard',
    topMaterial: 'Composite Italian Top',
    finish: 'Cream & SS Gold',
    tag: 'Premium',
    price: 89392,
    originalPrice: 111500,
    productCode: 'PATRO-08',
    dimensions: 'Large Sideboard',
    description: 'PATRO-08 is a large fluted-panel sideboard with a cream composite Italian top and SS Gold frame base. The ribbed front panels and gold frame create a premium modern sideboard for living and dining spaces.',
  },

  /* ── DUALTWIN / RG Series ── */
  {
    id: 60,
    name: 'DUALTWIN',
    image: '/center-tables/DUALTWIN.png',
    series: 'Premium Marble Series',
    type: 'Centre Table',
    topMaterial: 'Half Marble + Half Veneer with Polyester',
    finish: 'Cream & Black',
    tag: 'Premium',
    price: 67509,
    originalPrice: 84000,
    productCode: 'DUALTIWIN - 4830',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'DUALTWIN features a striking dual-material top — half natural marble, half veneer with polyester — creating a bold two-tone aesthetic. A collector\'s piece that bridges natural and engineered materials.',
  },
  {
    id: 61,
    name: 'RG-17D BC',
    image: '/center-tables/RG-17D-BC.png',
    series: 'Premium Marble Series',
    type: 'Centre Table',
    topMaterial: 'GO2 Marble with Box Sling',
    finish: 'Cream & Natural Wood',
    tag: 'Premium',
    price: 73208,
    originalPrice: 91500,
    productCode: 'RG-17D BC 4830',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'RG-17D BC is a premium center table with a GO2 marble top featuring inlay detailing and a 12-inch box sling, all on a wooden base. The combination of natural marble and quality woodwork makes this a premium heirloom piece.',
  },
  {
    id: 62,
    name: 'RG-15C OLIVER',
    image: '/center-tables/RG-15C-OLIVER.png',
    series: 'OLIVER Marble Series',
    type: 'Centre Table',
    topMaterial: 'Onyx (White) Top with Tapper Sling',
    finish: 'White Onyx & Dark Wood',
    tag: 'Premium',
    price: 89231,
    originalPrice: 111500,
    productCode: 'RG -15C (OLIVER 4830)',
    dimensions: '1220(W) × 420(H) × 770(D) mm',
    description: 'RG-15C OLIVER features a spectacular Onyx White top with 12-inch tapper sling detailing on a dark wooden base. The pure white marble and dark carved wood legs create a timeless luxury statement.',
  },
  {
    id: 63,
    name: 'RG-15G OLIVER',
    image: '/center-tables/RG-15G-OLIVER.png',
    series: 'OLIVER Marble Series',
    type: 'Centre Table',
    topMaterial: 'Onyx (White) Top with Tapper Sling',
    finish: 'White Onyx & Dark Wood',
    tag: 'Premium',
    price: 87336,
    originalPrice: 109000,
    productCode: 'RG -15G (OLIVER 3636)',
    dimensions: '915(W) × 460(H) × 915(D) mm',
    description: 'RG-15G OLIVER is a square format center table with a thick Onyx White top and 12-inch tapper sling, all supported on dark carved wooden legs. A bold square footprint with premium marble top for exclusive interiors.',
  },
  {
    id: 64,
    name: 'RG-15 OLIVER',
    image: '/center-tables/RG-15-OLIVER.png',
    series: 'OLIVER Marble Series',
    type: 'Centre Table',
    topMaterial: 'Onyx (White) Top with Sling',
    finish: 'White Onyx & Dark Wood',
    tag: 'Premium',
    price: 68052,
    originalPrice: 85000,
    productCode: 'RG -15 (OLIVER 4830)',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'RG-15 OLIVER is a thick-slab Onyx White marble top center table on 4 ornately carved dark wooden legs. The solid white marble slab and traditional turned legs create a beautiful blend of classical and contemporary luxury.',
  },
  {
    id: 65,
    name: 'RG-15A OLIVER',
    image: '/center-tables/RG-15A-OLIVER.png',
    series: 'OLIVER Marble Series',
    type: 'Centre Table',
    topMaterial: 'Onyx (White) Inlay Top',
    finish: 'White Onyx & Metal Hair Pin',
    tag: 'Premium',
    price: 72308,
    originalPrice: 90000,
    productCode: 'RG -15A (OLIVER 4830)',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'RG-15A OLIVER features a thick Onyx White slab with gold inlay geometric pattern, supported on 4-inch sling and dramatic black metal hairpin legs. The combination of pure marble and modern metal legs is striking.',
  },
  {
    id: 66,
    name: 'RG-15B OLIVER',
    image: '/center-tables/RG-15B-OLIVER.png',
    series: 'OLIVER Marble Series',
    type: 'Centre Table',
    topMaterial: 'Onyx (White) Inlay Top',
    finish: 'White Onyx & Dark Wood',
    tag: 'Premium',
    price: 74565,
    originalPrice: 93000,
    productCode: 'RG -15B (OLIVER 4830)',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'RG-15B OLIVER combines a premium Onyx White marble slab with gold inlay rectangular border detailing, supported on a 4-inch tapper sling and dark carved wood legs. A sophisticated update of classical marble furniture.',
  },

  /* ── RG-24 DIANA Series ── */
  {
    id: 67,
    name: 'RG-24A DIANA',
    image: '/center-tables/RG-24A-DIANA.png',
    series: 'DIANA Marble Series',
    type: 'Centre Table',
    topMaterial: 'Inlay Top with Sling',
    finish: 'Grey Marble & Dark Wood',
    tag: 'Premium',
    price: 58824,
    originalPrice: 73500,
    productCode: 'RG -24A (DIANA 4830)',
    dimensions: '1200(W) × 400(H) × 750(D) mm',
    description: 'RG-24A DIANA features a grey-toned inlay marble top with 4-inch sling detailing and ornate dark carved wooden legs. The warm grey marble and traditional carved legs create an heirloom-quality premium center table.',
  },
  {
    id: 68,
    name: 'RG-24B DIANA',
    image: '/center-tables/RG-24B-DIANA.png',
    series: 'DIANA Marble Series',
    type: 'Centre Table',
    topMaterial: 'Inlay Top',
    finish: 'Grey Marble & Black Wood',
    tag: 'Premium',
    price: 45254,
    originalPrice: 56500,
    productCode: 'RG-24B (DIANA 4824)',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'RG-24B DIANA pairs a grey inlay marble top with elegant black carved cabriole legs. The contrast of soft grey stone and dramatic black legs creates a sophisticated luxury aesthetic for premium living rooms.',
  },

  /* ── CLT Series ── */
  {
    id: 69,
    name: 'CLT-01',
    image: '/center-tables/CLT-01.png',
    series: 'CLT Economical Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Walnut (Non CL)',
    tag: 'New',
    price: 10331,
    originalPrice: 13000,
    productCode: 'CLT-01 3921',
    dimensions: '975(W) × 420(H) × 500(D) mm',
    description: 'CLT-01 is a practical center table with a curved side panel design offering an open shelf. In a warm walnut finish, it provides functional storage at an accessible price for everyday homes.',
  },
  {
    id: 70,
    name: 'CLT-02',
    image: '/center-tables/CLT-02.png',
    series: 'CLT Economical Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Walnut (Non CL)',
    tag: 'New',
    price: 9287,
    originalPrice: 11500,
    productCode: 'CLT-02 3618',
    dimensions: '900(W) × 480(H) × 450(D) mm',
    description: 'CLT-02 features curved hexagonal side supports and a double-shelf design in a warm walnut finish. Its unique geometric side panels make it more visually interesting than standard center tables at this price point.',
  },
  {
    id: 71,
    name: 'CLT-03',
    image: '/center-tables/CLT-03.png',
    series: 'CLT Economical Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Walnut (Non CL)',
    tag: 'New',
    price: 8960,
    originalPrice: 11200,
    productCode: 'CLT-03 3618',
    dimensions: '900(W) × 460(H) × 600(D) mm',
    description: 'CLT-03 is the most affordable entry in the series — a straightforward rectangular walnut center table with a lower display shelf and solid construction at an accessible price point.',
  },

  /* ── PCT Series ── */
  {
    id: 72,
    name: 'PCT-01',
    image: '/center-tables/PCT-01.png',
    series: 'PCT Series',
    type: 'Centre Table',
    topMaterial: 'Italian Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 15899,
    originalPrice: 19500,
    productCode: 'PCT-01 4824',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'PCT-01 is a classic center table with an Italian top on a dark walnut T-frame base with open side shelves. The simple and elegant design works well in both traditional and contemporary interiors.',
  },
  {
    id: 73,
    name: 'PCT-02',
    image: '/center-tables/PCT-02.png',
    series: 'PCT Series',
    type: 'Centre Table',
    topMaterial: 'Italian Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 17899,
    originalPrice: 22000,
    productCode: 'PCT-02 4824',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'PCT-02 features an Italian top on an open T-shaped base with double lower shelves in dark walnut. The asymmetric shelf arrangement and warm wood finish create a refined, functional center table.',
  },
  {
    id: 74,
    name: 'PCT-04',
    image: '/center-tables/PCT-04.png',
    series: 'PCT Series',
    type: 'Centre Table',
    topMaterial: 'Plain Top',
    finish: 'Black & White',
    tag: 'New',
    price: 11756,
    originalPrice: 14500,
    productCode: 'PCT-04 3921',
    dimensions: '1000(W) × 400(H) × 490(D) mm',
    description: 'PCT-04 is a minimalist two-tone center table with a black frame and white lower shelf, featuring an open rectangular silhouette. Its clean modern form and black and white contrast work beautifully in contemporary spaces.',
  },
  {
    id: 75,
    name: 'PCT-05 (4824)',
    image: '/center-tables/PCT-05.png',
    series: 'PCT Series',
    type: 'Centre Table',
    topMaterial: 'Plain Top',
    finish: 'Dark Brown & Light Wood',
    tag: 'Bestseller',
    price: 15703,
    originalPrice: 19500,
    productCode: 'PCT-05 4824',
    dimensions: '1100(W) × 360(H) × 600(D) mm',
    description: 'PCT-05 is a sleek low-profile center table with a dark brown base and a natural light wood two-tone top panel. Its smooth curved form and contrasting finish make it one of our most contemporary-looking value offerings.',
  },

  /* ── MAGMA Series ── */
  {
    id: 76,
    name: 'MAGMA (4824)',
    image: '/center-tables/MAGMA-4824.png',
    series: 'MAGMA Series',
    type: 'Centre Table',
    topMaterial: 'Black Glass',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 13642,
    originalPrice: 17000,
    productCode: 'MAGMA - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'MAGMA 4824 is a classic dark walnut center table with a black glass top and lower open shelf. Its clean lines, dark glass and warm wood create a timeless living room aesthetic at a great value.',
  },
  {
    id: 77,
    name: 'MAGMA (3921)',
    image: '/center-tables/MAGMA-3921.png',
    series: 'MAGMA Series',
    type: 'Centre Table',
    topMaterial: 'Black Glass',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 12828,
    originalPrice: 16000,
    productCode: 'MAGMA - 3921',
    dimensions: '990(W) × 420(H) × 535(D) mm',
    description: 'MAGMA 3921 brings the classic MAGMA black glass and walnut combination in a compact mid-size format. Clean-lined with a glass top and lower shelf, it\'s a reliable choice for any living room.',
  },

  /* ── MARK Series ── */
  {
    id: 78,
    name: 'MARK (With 2 Drawers)',
    image: '/center-tables/MARK-with-drawer.png',
    series: 'MARK Series',
    type: 'Centre Table',
    topMaterial: 'Composite Top with Striped Panels',
    finish: 'Dark Walnut & White',
    tag: 'Bestseller',
    price: 16899,
    originalPrice: 21000,
    productCode: 'MARK - 4824',
    dimensions: '1200(W) × 400(H) × 600(D) mm',
    description: 'MARK with 2 Drawers is a sophisticated center table with bold horizontal stripe panel detailing in white and dark walnut, topped with a composite marble-look surface and featuring 2 storage drawers.',
  },
  {
    id: 79,
    name: 'MARK (Without Drawer)',
    image: '/center-tables/MARK-no-drawer.png',
    series: 'MARK Series',
    type: 'Centre Table',
    topMaterial: 'Composite Top with Striped Panels',
    finish: 'Dark Walnut & White',
    tag: 'New',
    price: 13713,
    originalPrice: 17000,
    productCode: 'MARK - 3618',
    dimensions: '900(W) × 450(H) × 450(D) mm',
    description: 'MARK Without Drawer is a compact open-shelf version of the MARK design — horizontal stripe panel detailing in dark walnut and white without storage drawers, at a more accessible price point.',
  },

  /* ── WAVE BLK ── */
  {
    id: 80,
    name: 'WAVE BLK (4824)',
    image: '/center-tables/WAVE-BLK.png',
    series: 'Classic Wood Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 15540,
    originalPrice: 19500,
    productCode: 'WAVE BLK - 4824',
    dimensions: '1200(W) × 450(H) × 600(D) mm',
    description: 'WAVE BLK is an elegant oval center table with a flat dark walnut top on sculpted wave-form curved base supports. The flowing organic curves of the base create a graceful, distinctive silhouette.',
  },

  /* ── WOODOO ── */
  {
    id: 81,
    name: 'WOODOO',
    image: '/center-tables/WOODOO.png',
    series: 'Classic Wood Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 12285,
    originalPrice: 15500,
    productCode: 'WOODOO - 4824',
    dimensions: '1200(W) × 450(H) × 600(D) mm',
    description: 'WOODOO is a clean-lined rectangular center table with a flat dark walnut top on simple slab-leg supports. Its minimal, no-fuss design makes it a versatile choice for both modern and traditional interiors.',
  },

  /* ── LOTUS / DINO FOUR ── */
  {
    id: 82,
    name: 'LOTUS',
    image: '/center-tables/LOTUS.png',
    series: 'Classic Wood Series',
    type: 'Centre Table',
    topMaterial: 'Plain Wood Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 20598,
    originalPrice: 25500,
    productCode: 'LOTUS - 3636',
    dimensions: '900(W) × 420(H) × 900(D) mm',
    description: 'LOTUS is a square center table with an ornate circular carved top insert and side cutout details. The decorative carved panel adds a traditional Indian character to this practical storage table.',
  },
  {
    id: 83,
    name: 'DINO FOUR',
    image: '/center-tables/DINO-FOUR.png',
    series: 'Classic Wood Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top with Box Storage',
    finish: 'Dark Walnut',
    tag: 'Premium',
    price: 32926,
    originalPrice: 41000,
    productCode: 'DINO FOUR - 3636',
    dimensions: '900(W) × 400(H) × 900(D) mm',
    description: 'DINO FOUR is a unique center table with a composite Italian top and 4 matching pull-out ottoman storage stools. The ottomans tuck under the table creating a practical multi-functional living room piece.',
  },

  /* ── Candy, Peony, Charlie, Lyra ── */
  {
    id: 84,
    name: 'CANDY',
    image: '/center-tables/CANDY.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 15670,
    originalPrice: 19500,
    productCode: 'CANDY - 3921',
    dimensions: '1000(W) × 420(H) × 535(D) mm',
    description: 'CANDY features a composite Italian top on a dramatic dark walnut base with sculpted curved leaf-shaped leg supports. The unusual organic leg form gives this table a distinctive premium character.',
  },
  {
    id: 85,
    name: 'PEONY',
    image: '/center-tables/PEONY.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite GO2 Top',
    finish: 'Dark Walnut & Gold',
    tag: 'Bestseller',
    price: 20143,
    originalPrice: 25000,
    productCode: 'PEONY - 4120',
    dimensions: '1140(W) × 400(H) × 510(D) mm',
    description: 'PEONY is a striking center table with a composite GO2 top on elegantly turned dark walnut legs with gold accent rings. The ornate turned legs with gold band details create a luxury look at an accessible price.',
  },
  {
    id: 86,
    name: 'CHARLIE',
    image: '/center-tables/CHARLIE.png',
    series: 'Italian Marble Series',
    type: 'Centre Table',
    topMaterial: 'Italian Marble Top',
    finish: 'Dark Brown',
    tag: 'Bestseller',
    price: 17627,
    originalPrice: 22000,
    productCode: 'CHARLIE - 3921',
    dimensions: '1000(W) × 430(H) × 500(D) mm',
    description: 'CHARLIE features an Italian marble top on a dark brown base with decorative cloud-like cutout side panels. The ornate carved side panels reference traditional Indian woodcraft and make this table visually distinctive.',
  },
  {
    id: 87,
    name: 'LYRA',
    image: '/center-tables/LYRA.png',
    series: 'Italian Marble Series',
    type: 'Centre Table',
    topMaterial: 'Plain Top',
    finish: 'Black',
    tag: 'New',
    price: 13713,
    originalPrice: 17000,
    productCode: 'LYRA - 3921',
    dimensions: '1000(W) × 430(H) × 530(D) mm',
    description: 'LYRA is a minimalist center table in all black with a composite top and H-frame base with a lower shelf. Its clean architectural lines and dark monochrome palette make it perfect for contemporary urban interiors.',
  },

  /* ── EMELY, ABBY, ANGEL, DINO-2 ── */
  {
    id: 88,
    name: 'EMELY',
    image: '/center-tables/EMELY.png',
    series: 'Italian Marble Series',
    type: 'Centre Table',
    topMaterial: 'Italian Marble Top',
    finish: 'Black High Gloss',
    tag: 'New',
    price: 19745,
    originalPrice: 24500,
    productCode: 'EMELY - 4724',
    dimensions: '1170(W) × 400(H) × 600(D) mm',
    description: 'EMELY features a warm Italian marble top floating over a dramatic black high-gloss curved slab base. The contrast of warm cream marble and jet-black gloss creates a luxury aesthetic for high-end living rooms.',
  },
  {
    id: 89,
    name: 'ABBY',
    image: '/center-tables/ABBY.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Italian Top with 1 Drawer',
    finish: 'White with Wheels',
    tag: 'Bestseller',
    price: 24938,
    originalPrice: 31000,
    productCode: 'ABBY - 3920',
    dimensions: '1000(W) × 430(H) × 500(D) mm',
    description: 'ABBY is a sleek white center table with a black Italian-effect top panel and a single storage drawer on castor wheels. The wheels make it fully movable — a flexible, practical piece for modern homes.',
  },
  {
    id: 90,
    name: 'ANGEL',
    image: '/center-tables/ANGEL.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Black High Gloss',
    tag: 'New',
    price: 14713,
    originalPrice: 18500,
    productCode: 'ANGEL - 3921',
    dimensions: '1000(W) × 450(H) × 535(D) mm',
    description: 'ANGEL is a clean rectangular center table with a composite Italian top and a black high-gloss base with lower display shelf. A minimalist design that delivers a premium look at an entry-level price.',
  },
  {
    id: 91,
    name: 'DINO-2',
    image: '/center-tables/DINO-2.png',
    series: 'Classic Wood Series',
    type: 'Centre Table',
    topMaterial: 'Composite Top with Box Storage',
    finish: 'Black & Cream Marble',
    tag: 'Premium',
    price: 37722,
    originalPrice: 47000,
    productCode: 'DINO-2 3636',
    dimensions: '900(W) × 400(H) × 900(D) mm',
    description: 'DINO-2 is a square center table with a cream composite marble top and 2 pull-out ottoman storage stools in a dark body. The built-in ottomans provide seating and extra storage — a clever multi-functional living room piece.',
  },

  /* ── MELLOW, NIKOLE, CHAMOLI, ORCHID ── */
  {
    id: 92,
    name: 'MELLOW',
    image: '/center-tables/MELLOW.png',
    series: 'Designer Glass Series',
    type: 'Centre Table',
    topMaterial: 'Plain Glass Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 14993,
    originalPrice: 18500,
    productCode: 'MELLOW - 3921',
    dimensions: '1000(W) × 500(H) × 535(D) mm',
    description: 'MELLOW features a printed designer glass top with a colourful folk art floral motif on a dark walnut base with a lower shelf. The vibrant printed glass adds a cheerful, artistic character to any living space.',
  },
  {
    id: 93,
    name: 'NIKOLE',
    image: '/center-tables/NIKOLE.png',
    series: 'Designer Glass Series',
    type: 'Centre Table',
    topMaterial: 'Black Glass Top',
    finish: 'Dark Walnut with Silver Inlay',
    tag: 'New',
    price: 15552,
    originalPrice: 19500,
    productCode: 'NIKOLE - 3921',
    dimensions: '1000(W) × 470(H) × 500(D) mm',
    description: 'NIKOLE is a bold black glass top center table with dramatic silver inlay detailing on the dark walnut sides. The angular silver cutout motifs give it a strong geometric presence perfect for contemporary masculine interiors.',
  },
  {
    id: 94,
    name: 'CHAMOLI',
    image: '/center-tables/CHAMOLI.png',
    series: 'Designer Glass Series',
    type: 'Centre Table',
    topMaterial: 'Designer Glass Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 31143,
    originalPrice: 39000,
    productCode: 'CHAMOLI - 3921',
    dimensions: '1000(W) × 470(H) × 500(D) mm',
    description: 'CHAMOLI features a premium designer printed glass top with a daisy floral motif, on a dark walnut base with 2 storage drawers and an open lower shelf. The beautiful printed glass makes this a truly unique centerpiece.',
  },
  {
    id: 95,
    name: 'ORCHID',
    image: '/center-tables/ORCHID.png',
    series: 'Designer Glass Series',
    type: 'Centre Table',
    topMaterial: 'Designer Glass Top',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 19745,
    originalPrice: 24500,
    productCode: 'ORCHID - 3921',
    dimensions: '1000(W) × 470(H) × 500(D) mm',
    description: 'ORCHID features a delicate aqua-tone designer glass top with a nature-inspired floral and butterfly motif. The combination of beautiful printed glass and dark walnut storage base creates a visually stunning and functional center table.',
  },

  /* ── HENRY, ZOYA, DIEGO, ZARA ── */
  {
    id: 96,
    name: 'HENRY',
    image: '/center-tables/HENRY.png',
    series: 'Designer Glass Series',
    type: 'Centre Table',
    topMaterial: 'Designer Glass Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 13713,
    originalPrice: 17000,
    productCode: 'HENRY - 3921',
    dimensions: '1000(W) × 410(H) × 535(D) mm',
    description: 'HENRY features a designer glass top with a geometric inlay diamond pattern on a dark walnut base with C-shaped curved leg supports and a lower shelf. A classic-meets-contemporary design with artistic glass detailing.',
  },
  {
    id: 97,
    name: 'ZOYA',
    image: '/center-tables/ZOYA.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Dark Brown',
    tag: 'Bestseller',
    price: 22540,
    originalPrice: 28000,
    productCode: 'ZOYA - 4824',
    dimensions: '1240(W) × 500(H) × 535(D) mm',
    description: 'ZOYA is a wide and bold center table with a composite Italian top on an architectural dark brown base with deep geometric cutouts. The dramatic carved-out base panels create a striking visual weight and presence.',
  },
  {
    id: 98,
    name: 'DIEGO',
    image: '/center-tables/DIEGO.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Dark Brown',
    tag: 'New',
    price: 24938,
    originalPrice: 31000,
    productCode: 'DIEGO - 4824',
    dimensions: '1240(W) × 640(H) × 400(D) mm',
    description: 'DIEGO is a low-profile rectangular center table with a composite Italian top on a clean dark brown base with 4 storage drawers and a natural wood panel. The drawers and natural wood accent add both function and warmth.',
  },
  {
    id: 99,
    name: 'ZARA',
    image: '/center-tables/ZARA.png',
    series: 'Italian Top Series',
    type: 'Centre Table',
    topMaterial: 'Composite Italian Top',
    finish: 'Black',
    tag: 'New',
    price: 16111,
    originalPrice: 20000,
    productCode: 'ZARA - 3921',
    dimensions: '1000(W) × 500(H) × 530(D) mm',
    description: 'ZARA features a composite Italian oval top on a dramatic all-black base with a recessed drawer and metallic chrome handle. Its oval form and glossy black finish create a sleek, sophisticated look for modern living rooms.',
  },

  /* ── Side Tables / Accessories ── */
  {
    id: 100,
    name: 'ZAMBO (TS-03)',
    image: '/center-tables/ZAMBO.png',
    series: 'Side Tables',
    type: 'Side Table',
    topMaterial: 'Plain Top',
    finish: 'Dark Walnut',
    tag: 'New',
    price: 6671,
    originalPrice: 8500,
    productCode: 'TS - 03',
    dimensions: '450(W) × 540(H) × 350(D) mm',
    description: 'ZAMBO is a compact Z-form side table with a dark walnut finish — perfect as an end table beside a sofa or armchair. Its slim Z-shaped profile takes up minimal space.',
  },
  {
    id: 101,
    name: 'LEXUS (TS-01)',
    image: '/center-tables/CLT-01.png',
    series: 'Side Tables',
    type: 'Side Table',
    topMaterial: 'Plain Top with Glass Display',
    finish: 'Dark Walnut',
    tag: 'Bestseller',
    price: 15543,
    originalPrice: 19500,
    productCode: 'TS - 01',
    dimensions: '435(W) × 720(H) × 420(D) mm',
    description: 'LEXUS is a tall display side table with a glass-panel cabinet door and a marble-top surface. It functions as a sofa-side display unit or lamp table with practical storage in a compact footprint.',
  },

  /* ── Rocking Chairs / Easy Chair ── */
  {
    id: 102,
    name: 'ROCKING CHAIR-01',
    image: '/center-tables/ROCKING-CHAIR-01.png',
    series: 'Rocking Chairs',
    type: 'Rocking Chair',
    topMaterial: 'Upholstered Seat & Back',
    finish: 'Walnut',
    tag: 'Premium',
    price: 29548,
    originalPrice: 37000,
    productCode: 'ROCKING CHAIR - 01 (Walnut)',
    dimensions: 'Standard Rocking Chair',
    description: 'A classic upholstered rocking chair in walnut finish with a cream cushioned seat and high back. The ornate scrolled arm ends and traditional rocker base bring timeless comfort and character to any living space.',
  },
  {
    id: 103,
    name: 'ROCKING CHAIR-02',
    image: '/center-tables/ROCKING-CHAIR-02.jpeg',
    series: 'Rocking Chairs',
    type: 'Rocking Chair',
    topMaterial: 'Upholstered Seat & Back',
    finish: 'Walnut',
    tag: 'Bestseller',
    price: 32112,
    originalPrice: 40000,
    productCode: 'ROCKING CHAIR - 02 (Walnut)',
    dimensions: 'Standard Rocking Chair',
    description: 'ROCKING CHAIR-02 is a classic upholstered rocker in walnut with a bright yellow cushioned seat and back. The simple curved arm rests and traditional rockers make it a cheerful addition to any living room or bedroom.',
  },
  {
    id: 104,
    name: 'EASY CHAIR SET',
    image: '/center-tables/EASY-CHAIR-SET.png',
    series: 'Rocking Chairs',
    type: 'Easy Chair with Ottoman',
    topMaterial: 'Upholstered',
    finish: 'Walnut',
    tag: 'Premium',
    price: 44540,
    originalPrice: 55500,
    productCode: 'EASY CHAIR (Walnut)',
    dimensions: 'Chair + Ottoman Set',
    description: 'The EASY CHAIR SET in walnut includes a generously cushioned armchair and matching ottoman — both in cream linen upholstery with traditional carved walnut frames. A classic lounging set for a premium living room corner.',
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
        .ct-hero { background:#f5f0e8;
          padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); position:relative; overflow:hidden; }
        .ct-hero-inner { max-width:1320px; margin:0 auto; position:relative; }
        .ct-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .ct-back:hover { color:#1a1714; }
        .ct-hero-tag { display:none; }
        .ct-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em;line-height:1.15; }
        .ct-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .ct-hero-accent { display:none; }

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
        .ct-card-body { padding:16px 18px 20px; display:flex; flex-direction:column; }
        .ct-card-code { font-size:0.62rem;color:#a09488;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px; }
        .ct-card-name { font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;
          color:#1a1714;margin:0 0 6px;line-height:1.25; }
        .ct-card-desc { font-size:0.78rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:8px;flex:1; }
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
          .ct-hero { padding:24px 16px 20px; }
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
            <h1 className="ct-heading">Center Table Collection</h1>
            <p className="ct-sub">
              Add a personalised touch to your home — {filtered.length} of {centerTableData.length} designs available
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

            {renderFilterSection("TABLE TYPE", "type",
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