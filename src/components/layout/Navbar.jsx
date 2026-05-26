import { useState, useEffect, useRef, Fragment } from 'react';
import logoImg from '../../assets/logo.png';
import { Search, Heart, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { featured, bestSellers } from '../../data/products';

// ── All beds data (same as BedsPage) ──
const bedsData = [
  { id: 'b1',  name: 'Diwan',                    image: '/beds/Diwan.jpg',                        category: 'Beds', price: 24500  },
  { id: 'b2',  name: 'Classic Queen Bed',         image: '/beds/Classic_Queen_Bed.jpg',            category: 'Beds', price: 38500  },
  { id: 'b3',  name: 'Classic King Size Bed',     image: '/beds/Classic_King_Size_Bed.jpg',        category: 'Beds', price: 44500  },
  { id: 'b4',  name: 'Atlanta Queen Bed',         image: '/beds/Atlanta_Queen_Bed.jpg',            category: 'Beds', price: 41000  },
  { id: 'b5',  name: 'Atlanta King Bed',          image: '/beds/Atlanta_King_Bed.jpg',             category: 'Beds', price: 48000  },
  { id: 'b6',  name: 'Aster King Bed',            image: '/beds/Aster_King_Bed.jpg',               category: 'Beds', price: 52000  },
  { id: 'b7',  name: 'Orchid King Bed',           image: '/beds/Orchid_King_Bed.jpg',              category: 'Beds', price: 53500  },
  { id: 'b8',  name: 'DS 1 Bed Without Storage',  image: '/beds/DS_1_Bed_Without_Storage.jpg',     category: 'Beds', price: 22000  },
  { id: 'b9',  name: 'DS 1 Queen Bed',            image: '/beds/DS_1_Queen_Bed.jpg',               category: 'Beds', price: 44000  },
  { id: 'b10', name: 'DS 1 King Bed',             image: '/beds/DS_1_King_Bed.jpg',                category: 'Beds', price: 51000  },
  { id: 'b11', name: 'ES 1 King Bed',             image: '/beds/ES_1_King_Bed.jpg',                category: 'Beds', price: 58000  },
  { id: 'b12', name: 'ES 2 King Bed',             image: '/beds/ES_2_King_Bed.jpg',                category: 'Beds', price: 62000  },
  { id: 'b13', name: 'Delonix King Bed',          image: '/beds/Delonix_King_Bed.jpg',             category: 'Beds', price: 67000  },
  { id: 'b14', name: 'Austria King Bed',          image: '/beds/Austria_King_Bed.jpg',             category: 'Beds', price: 72000  },
  { id: 'b15', name: 'Korvy Queen Bed',           image: '/beds/Korvy_Queen_Bed.jpg',              category: 'Beds', price: 61000  },
  { id: 'b16', name: 'Korvy King Bed',            image: '/beds/Korvy_King_Bed.jpg',               category: 'Beds', price: 72000  },
  { id: 'b17', name: 'Ambely Queen Bed',          image: '/beds/Ambely_Queen_Bed.jpg',             category: 'Beds', price: 61000  },
  { id: 'b18', name: 'Ambely King Bed',           image: '/beds/Ambely_King_Bed.jpg',              category: 'Beds', price: 72000  },
  { id: 'b19', name: 'Arena Queen Bed',           image: '/beds/Arena_Queen_Bed.jpg',              category: 'Beds', price: 57000  },
  { id: 'b20', name: 'Arena King Bed',            image: '/beds/Arena_King_Bed.jpg',               category: 'Beds', price: 69000  },
  { id: 'b21', name: 'Vesta Queen Bed',           image: '/beds/Vesta_Queen_Bed.jpg',              category: 'Beds', price: 61000  },
  { id: 'b22', name: 'Vesta King Bed',            image: '/beds/Vesta_King_Bed.jpg',               category: 'Beds', price: 72000  },
  { id: 'b23', name: 'Prague King Bed',           image: '/beds/Prague_King_Bed.jpg',              category: 'Beds', price: 78000  },
  { id: 'b24', name: 'Kosovo Queen Bed',          image: '/beds/Kosovo_Queen_Bed.jpg',             category: 'Beds', price: 36000  },
  { id: 'b25', name: 'Kosovo King Bed',           image: '/beds/Kosovo_King_Bed.jpg',              category: 'Beds', price: 66000  },
  { id: 'b26', name: 'Parker King Bed',           image: '/beds/Parker_King_Bed.jpg',              category: 'Beds', price: 71000  },
  { id: 'b27', name: 'Vienna King Bed',           image: '/beds/Vienna_King_Bed.jpg',              category: 'Beds', price: 69000  },
  { id: 'b28', name: 'Madrid King Bed',           image: '/beds/Madrid_King_Bed.jpg',              category: 'Beds', price: 73000  },
  { id: 'b29', name: 'Pristine King Bed',         image: '/beds/Pristine_King_Bed.jpg',            category: 'Beds', price: 82000  },
  { id: 'b30', name: 'Texas King Bed',            image: '/beds/Texas_King_Bed.jpg',               category: 'Beds', price: 79000  },
  { id: 'b31', name: 'Sony King Bed',             image: '/beds/Sony_King_Bed.jpg',                category: 'Beds', price: 76000  },
  { id: 'b32', name: 'Haven King Bed',            image: '/beds/Haven_King_Bed.jpg',               category: 'Beds', price: 84000  },
  { id: 'b33', name: 'Aria King Bed',             image: '/beds/Aria_King_Bed.jpg',                category: 'Beds', price: 86000  },
  { id: 'b34', name: 'Orlov King Bed',            image: '/beds/Orlov_King_Bed.jpg',               category: 'Beds', price: 91000  },
  { id: 'b35', name: 'Nelson King Bed',           image: '/beds/Nelson_King_Bed.jpg',              category: 'Beds', price: 88000  },
  { id: 'b36', name: 'Daisy King Bed',            image: '/beds/Daisy_King_Bed.jpg',               category: 'Beds', price: 87000  },
  { id: 'b37', name: 'Lexus King Bed',            image: '/beds/Lexus_King_Bed.jpg',               category: 'Beds', price: 93000  },
  { id: 'b38', name: 'London PLM King Bed',       image: '/beds/London_PLM_King_Bed.jpg',          category: 'Beds', price: 97000  },
  { id: 'b39', name: 'Armour 1 King Bed',         image: '/beds/Armour_1_King_Bed.jpg',            category: 'Beds', price: 89000  },
  { id: 'b40', name: 'Armour 3 King Bed',         image: '/beds/Armour_3_King_Bed.jpg',            category: 'Beds', price: 91000  },
  { id: 'b41', name: 'Armour 1 Queen Bed',        image: '/beds/Armour_1_Queen_Bed.jpg',           category: 'Beds', price: 74000  },
  { id: 'b42', name: 'Berry PLM King Bed',        image: '/beds/Berry_PLM_King_Bed.jpg',           category: 'Beds', price: 95000  },
  { id: 'b43', name: 'AS 4 King Bed',             image: '/beds/AS_4_King_Bed.jpg',                category: 'Beds', price: 64000  },
  { id: 'b44', name: 'AS 6 King Bed',             image: '/beds/AS_6_King_Bed.jpg',                category: 'Beds', price: 68000  },
  { id: 'b45', name: 'DS 1 King Bed 1',           image: '/beds/DS_1_King_Bed_1.jpg',              category: 'Beds', price: 51000  },
];

// ── Bedside Tables data for search ──
const bedSideTablesData = [
  { id: 'bst1',  name: 'Classic Bed Side Table',      image: '/bedside-tables/Classic Side Table.jpg',          category: 'Bedside Tables', price: 8500  },
  { id: 'bst2',  name: 'ES 1 Bed Side Table',         image: '/bedside-tables/ES-1 Bed Side Table.jpg',         category: 'Bedside Tables', price: 9200  },
  { id: 'bst3',  name: 'Delonix Bed Side Table',      image: '/bedside-tables/Delonix Bed Side Table.jpg',      category: 'Bedside Tables', price: 10500 },
  { id: 'bst4',  name: 'Austria Bed Side Table',      image: '/bedside-tables/Austria Bed Side TAble.jpg',      category: 'Bedside Tables', price: 11000 },
  { id: 'bst5',  name: 'Korvy Bed Side Table',        image: '/bedside-tables/Korvy Bed Side Table.jpg',        category: 'Bedside Tables', price: 11000 },
  { id: 'bst6',  name: 'Ambely Bed Side Table',       image: '/bedside-tables/Ambely Bed Side Table.jpg',       category: 'Bedside Tables', price: 11000 },
  { id: 'bst7',  name: 'Arena Bed Side Table',        image: '/bedside-tables/Arena Bed Side Table.jpg',        category: 'Bedside Tables', price: 11000 },
  { id: 'bst8',  name: 'Kosovo Bed Side Table',       image: '/bedside-tables/Kosovo Bed Side Table.jpg',       category: 'Bedside Tables', price: 10000 },
  { id: 'bst9',  name: 'Vienna Bed Side Table',       image: '/bedside-tables/Vienna Bed Side Table.jpg',       category: 'Bedside Tables', price: 9500  },
  { id: 'bst10', name: 'Madrid Bed Side Table',       image: '/bedside-tables/Madrid Bed Side Table.jpg',       category: 'Bedside Tables', price: 10500 },
  { id: 'bst11', name: 'Aria Bed Side Table',         image: '/bedside-tables/Aria Bed Side Table.jpg',         category: 'Bedside Tables', price: 12000 },
  { id: 'bst12', name: 'Nelson Bed Side Table',       image: '/bedside-tables/Nelson Bed Side Table.jpg',       category: 'Bedside Tables', price: 11500 },
  { id: 'bst13', name: 'Lexus Bed Side Table',        image: '/bedside-tables/Lexus Bed Side Table.jpg',        category: 'Bedside Tables', price: 14500 },
  { id: 'bst14', name: 'London Bed Side Table',       image: '/bedside-tables/London Bed Side Table.jpg',       category: 'Bedside Tables', price: 13500 },
  { id: 'bst15', name: 'Berry Ignoo Bed Side Table',  image: '/bedside-tables/Berry Ignoo Bed Side Table.jpg',  category: 'Bedside Tables', price: 13000 },
  { id: 'bst16', name: 'Vesta Bed Side Table',        image: '/bedside-tables/Vesta Bed Side Table.jpg',        category: 'Bedside Tables', price: 14000 },
];

const allProducts = [...bedsData, ...bedSideTablesData, ...featured, ...bestSellers];
const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const announcements = [
  '✦  New Arrivals: Kaveri Teak Dining Series — Shop Now',
  '✦  Visit Our Showrooms in Bhubaneswar & Cuttack',
  '✦  Free Shipping on Orders Above ₹15,000',
];

const navLinks = [
  { label: 'New In', section: 'featured' },
  {
    label: 'Living Room',
    section: 'categories',
    drop: ['Sofa Set', 'L Shape Sofa', 'Recliner Sofa', 'Center Table', 'TV Unit / TV Cabinet', 'Coffee Table', 'Side Table'],
    dropSlug: { 'Sofa Set': 'sofa-set', 'L Shape Sofa': 'l-shape-sofa', 'Recliner Sofa': 'recliner-sofa', 'Center Table': 'center-table', 'TV Unit / TV Cabinet': 'tv-unit', 'Coffee Table': 'coffee-table', 'Side Table': 'side-table' },
  },
  {
    label: 'Bedroom',
    section: 'categories',
    bedsInDrop: true,
    drop: ['Beds', 'Wardrobe', 'Dressing Table', 'Bedside Tables', 'Mattress', 'Storage Bed'],
    dropSlug: { 'Wardrobe': 'wardrobe', 'Dressing Table': 'dressing-table', 'Mattress': 'mattress', 'Storage Bed': 'storage-bed' },
  },
  {
    label: 'Dining',
    section: 'categories',
    drop: ['Dining Table Set (4 Seater)', 'Dining Table Set (6 Seater)', 'Dining Table Set (8 Seater)', 'Dining Chair'],
    dropSlug: { 'Dining Table Set (4 Seater)': 'dining-table-4-seater', 'Dining Table Set (6 Seater)': 'dining-table-6-seater', 'Dining Table Set (8 Seater)': 'dining-table-8-seater', 'Dining Chair': 'dining-chair' },
  },
  {
    label: 'Customized',
    section: 'categories',
    drop: ['Modular Kitchen', 'Custom Wardrobe', 'Interior Furniture Design'],
    dropSlug: { 'Modular Kitchen': 'modular-kitchen', 'Custom Wardrobe': 'custom-wardrobe', 'Interior Furniture Design': 'interior-furniture-design' },
  },
  { label: 'Best Sellers', section: 'bestsellers' },
  { label: 'Sale', sale: true, section: 'bestsellers' },
];

const ANN_H  = 38;
const NAV_H  = 72;
const TOTAL_H = ANN_H + NAV_H;
export { ANN_H, NAV_H, TOTAL_H };

export default function Navbar({ onLogoClick, onNavigate, onWishlist }) {
  const [annIdx,     setAnnIdx]     = useState(0);
  const [annFade,    setAnnFade]    = useState(true);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const inputRef = useRef(null);

  const count      = useCartStore(s => s.count());
  const toggleCart = useCartStore(s => s.toggleCart);
  const wlCount    = useWishlistStore(s => s.count());

  // Search results — live filter
  const results = searchVal.trim().length >= 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const id = setInterval(() => {
      setAnnFade(false);
      setTimeout(() => { setAnnIdx(i => (i + 1) % announcements.length); setAnnFade(true); }, 300);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const closeSearch = () => { setSearchOpen(false); setSearchVal(''); };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = scrolled ? NAV_H + 16 : TOTAL_H + 16;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        .nb-root *, .nb-root *::before, .nb-root *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }
        .ann-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 102; height: ${ANN_H}px; background: #1a1714; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.38s ease; }
        .ann-bar.hidden { height: 0; opacity: 0; pointer-events: none; }
        .ann-text { font-size: 0.775rem; font-weight: 400; letter-spacing: 0.07em; color: #fff; white-space: nowrap; transition: opacity 0.28s ease; }
        .ann-text.out { opacity: 0; } .ann-text.in { opacity: 1; }
        .main-nav { position: fixed; left: 0; right: 0; z-index: 100; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.08); transition: top 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s ease; }
        .main-nav.expanded { top: ${ANN_H}px; box-shadow: none; }
        .main-nav.scrolled { top: 0; box-shadow: 0 2px 24px rgba(0,0,0,0.09); }
        .nav-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; height: ${NAV_H}px; display: flex; align-items: center; }
        .nb-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; flex-shrink: 0; margin-right: 32px; cursor: pointer; background: #f5f0e8; border-radius: 6px; padding: 8px 14px; }
        .nb-logo-img { height: 57px; width: auto; display: block; object-fit: contain; flex-shrink: 0; }
        .nb-logo-text { display: flex; flex-direction: column; gap: 2px; border-left: 1.5px solid rgba(26,23,20,0.15); padding-left: 14px; }
        .nb-logo-name { font-family: 'Cormorant Garamond', serif !important; font-size: 1.18rem; font-weight: 700; color: #1a1714; letter-spacing: 0.12em; line-height: 1; text-transform: uppercase; white-space: nowrap; }
        .nb-logo-sub { font-size: 0.48rem; font-weight: 500; letter-spacing: 0.30em; color: #8a8278; text-transform: uppercase; white-space: nowrap; }
        .nb-ul { flex: 1; display: flex; align-items: center; justify-content: center; list-style: none; margin: 0; padding: 0; gap: 0; }
        .nb-li { position: relative; }
        .nb-btn { display: flex; align-items: center; gap: 4px; background: none; border: none; padding: 10px 12px; font-size: 0.875rem; font-weight: 600; color: #1a1714; cursor: pointer; white-space: nowrap; line-height: 1; transition: color 0.18s; height: ${NAV_H}px; }
        .nb-btn:hover, .nb-btn.sale:hover { color: #c9a96e; }
        .nb-btn.sale { color: #c0392b; }
        .nb-chevron { opacity: 0.45; margin-top: 1px; flex-shrink: 0; transition: opacity 0.18s, transform 0.22s; }
        .nb-li:hover .nb-chevron { opacity: 0.75; transform: rotate(180deg); }
        .nb-drop { position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(8px); background: #fff; border: 1px solid rgba(0,0,0,0.07); border-top: 2px solid #c9a96e; box-shadow: 0 20px 60px rgba(0,0,0,0.13); min-width: 240px; padding: 10px 0; opacity: 0; pointer-events: none; transition: opacity 0.22s ease, transform 0.22s cubic-bezier(.22,1,.36,1); z-index: 200; }
        .nb-li:hover .nb-drop { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
        .nb-drop a { display: flex; align-items: center; gap: 10px; padding: 11px 22px; font-size: 0.92rem; font-weight: 500; color: #2a2520; text-decoration: none; transition: color 0.18s, background 0.18s, padding-left 0.18s; white-space: nowrap; letter-spacing: 0.01em; position: relative; }
        .nb-drop a::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 2px; height: 0; background: #c9a96e; transition: height 0.18s ease; border-radius: 0 2px 2px 0; }
        .nb-drop a:hover { color: #c9a96e; background: #faf7f2; padding-left: 28px; }
        .nb-drop a:hover::before { height: 60%; }
        .nb-drop-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 6px 0; }
        .nb-actions { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
        .nb-icon { background: none; border: none; color: #1a1714; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; position: relative; transition: color 0.18s; }
        .nb-icon:hover { color: #c9a96e; }
        .nb-badge { position: absolute; top: -3px; right: -5px; min-width: 17px; height: 17px; background: #c9a96e; color: #fff; font-size: 9px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 2px; }

        /* ── Search overlay ── */
        .nb-search-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(10,8,6,0.65); backdrop-filter: blur(5px); display: flex; align-items: flex-start; justify-content: center; padding-top: 100px; opacity: 0; pointer-events: none; transition: opacity 0.28s ease; }
        .nb-search-overlay.open { opacity: 1; pointer-events: auto; }
        .nb-search-wrap { width: 100%; max-width: 600px; padding: 0 24px; }
        .nb-search-box { background: #fff; display: flex; align-items: center; padding: 0 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.22); }
        .nb-search-input { flex: 1; border: none; outline: none; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: #1a1714; padding: 18px 0; background: transparent; letter-spacing: 0.01em; }
        .nb-search-input::placeholder { color: rgba(26,23,20,0.3); }
        .nb-search-close { background: none; border: none; cursor: pointer; color: #8a8278; padding: 4px; display: flex; align-items: center; transition: color 0.2s; }
        .nb-search-close:hover { color: #1a1714; }

        /* Results dropdown */
        .nb-search-results { background: #fff; margin-top: 2px; box-shadow: 0 16px 40px rgba(0,0,0,0.15); max-height: 420px; overflow-y: auto; }
        .nb-search-result { display: flex; align-items: center; gap: 14px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f5f0e8; }
        .nb-search-result:last-child { border-bottom: none; }
        .nb-search-result:hover { background: #faf7f2; }
        .nb-search-result img { width: 52px; height: 52px; object-fit: cover; flex-shrink: 0; }
        .nb-search-result-info { flex: 1; min-width: 0; }
        .nb-search-result-name { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; color: #1a1714; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nb-search-result-cat { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #8a8278; margin-top: 2px; }
        .nb-search-result-price { font-size: 0.9rem; font-weight: 600; color: #c9a96e; white-space: nowrap; }
        .nb-search-empty { padding: 20px 16px; font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #8a8278; text-align: center; }
        .nb-search-hint { text-align: center; margin-top: 14px; font-size: 0.70rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); text-transform: uppercase; }

        /* Mobile menu */
        .mob-menu { position: fixed; inset: 0; background: #1a1714; z-index: 400; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: opacity 0.32s ease, transform 0.32s cubic-bezier(.22,1,.36,1); }
        .mob-menu.closed { opacity: 0; pointer-events: none; transform: translateX(100%); }
        .mob-menu.open   { opacity: 1; pointer-events: auto; transform: translateX(0); }
        .mob-link { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 400; color: #fff; padding: 6px 0; transition: color 0.2s; background: none; border: none; cursor: pointer; }
        .mob-link:hover { color: #c9a96e; }
        .mob-close { position: absolute; top: 24px; right: 24px; background: none; border: none; color: #fff; cursor: pointer; padding: 6px; transition: color 0.2s; }
        .mob-close:hover { color: #c9a96e; }
        @media (max-width: 1024px) { .nb-btn { font-size: 0.80rem; padding: 10px 9px; } }
        @media (max-width: 900px)  { .nb-ul { display: none !important; } #nb-mob-btn { display: flex !important; } }
        @media (min-width: 901px)  { #nb-mob-btn { display: none !important; } }
      `}</style>

      <div className="nb-root">
        {/* Announcement bar */}
        <div className={`ann-bar${scrolled ? ' hidden' : ''}`}>
          <span className={`ann-text ${annFade ? 'in' : 'out'}`}>{announcements[annIdx]}</span>
        </div>

        {/* Main nav */}
        <nav className={`main-nav ${scrolled ? 'scrolled' : 'expanded'}`}>
          <div className="nav-inner">
            <a href="/" className="nb-logo" onClick={e => { e.preventDefault(); onLogoClick?.(); }}>
              <img src={logoImg} alt="OASIS Furniture" className="nb-logo-img" />
              <div className="nb-logo-text">
                <span className="nb-logo-name">OASIS Furniture</span>
                <span className="nb-logo-sub">and Furnishing</span>
              </div>
            </a>

            <ul className="nb-ul">
              {navLinks.map(({ label, drop, sale, section, bedsInDrop, dropSlug }, idx) => (
                <Fragment key={label}>
                  {idx > 0 && <li aria-hidden="true" style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.15)', flexShrink: 0, alignSelf: 'center', listStyle: 'none' }} />}
                  <li className="nb-li">
                    <button className={`nb-btn${sale ? ' sale' : ''}`} onClick={() => section && scrollToSection(section)}>
                      {label}
                      {drop && <ChevronDown size={12} className="nb-chevron" />}
                    </button>
                    {drop && (
                      <div className="nb-drop">
                        {drop.map(d => (
                          <a key={d} href="#" onClick={e => {
                            e.preventDefault();
                            if (d === 'Beds') onNavigate?.('category', 'beds', 'Beds');
                            else if (d === 'Bedside Tables') onNavigate?.('category', 'bedside-tables', 'Bedside Tables');
                            else if (dropSlug?.[d]) onNavigate?.('category', dropSlug[d], d);
                            else if (bedsInDrop) onNavigate?.('category', d.toLowerCase().replace(/\s+/g, '-'), d);
                            else scrollToSection(section);
                          }}>{d}</a>
                        ))}
                      </div>
                    )}
                  </li>
                </Fragment>
              ))}
            </ul>

            <div className="nb-actions">
              <button className="nb-icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search size={20} strokeWidth={1.8} />
              </button>
              <button className="nb-icon" aria-label="Wishlist" onClick={onWishlist}>
                <Heart size={20} strokeWidth={1.8} />
                {wlCount > 0 && <span className="nb-badge">{wlCount}</span>}
              </button>
              <button className="nb-icon" onClick={toggleCart} aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.8} />
                {count > 0 && <span className="nb-badge">{count}</span>}
              </button>
              <button id="nb-mob-btn" className="nb-icon" style={{ display: 'none' }} onClick={() => setMobileOpen(o => !o)}>
                <Menu size={22} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Search overlay ── */}
        <div className={`nb-search-overlay${searchOpen ? ' open' : ''}`} onClick={closeSearch}>
          <div className="nb-search-wrap" onClick={e => e.stopPropagation()}>
            <div className="nb-search-box">
              <Search size={18} style={{ color: '#8a8278', flexShrink: 0, marginRight: 12 }} />
              <input
                ref={inputRef}
                className="nb-search-input"
                placeholder="Search beds, sofas, chairs..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button className="nb-search-close" onClick={() => setSearchVal('')} style={{ marginRight: 8 }}>
                  <X size={16} />
                </button>
              )}
              <button className="nb-search-close" onClick={closeSearch}>
                <X size={18} />
              </button>
            </div>

            {/* Live results */}
            {searchVal.trim().length >= 1 && (
              <div className="nb-search-results">
                {results.length > 0 ? results.map(p => (
                  <div key={p.id} className="nb-search-result" onClick={() => {
                    if (p.category === 'Beds') onNavigate?.('category', 'beds', 'Beds');
                    else if (p.category === 'Bedside Tables') onNavigate?.('category', 'bedside-tables', 'Bedside Tables');
                    else scrollToSection('featured');
                    closeSearch();
                  }}>
                    <img src={p.image} alt={p.name} />
                    <div className="nb-search-result-info">
                      <div className="nb-search-result-name">{p.name}</div>
                      <div className="nb-search-result-cat">{p.category}</div>
                    </div>
                    <div className="nb-search-result-price">{fmt(p.price)}</div>
                  </div>
                )) : (
                  <div className="nb-search-empty">No results for "{searchVal}" — try another name</div>
                )}
              </div>
            )}

            <p className="nb-search-hint">Press Esc to close</p>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mob-menu ${mobileOpen ? 'open' : 'closed'}`}>
          <button className="mob-close" onClick={() => setMobileOpen(false)}><X size={28} strokeWidth={1.6} /></button>
          {navLinks.map(({ label, section, drop, bedsInDrop, dropSlug }) => (
            <div key={label}>
              <button className="mob-link" onClick={() => { section && scrollToSection(section); if (!drop) setMobileOpen(false); }}>
                {label}
              </button>
              {drop && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
                  {drop.map(d => (
                    <button key={d} style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', transition: 'color 0.2s' }}
                      onClick={() => {
                        if (d === 'Beds') { onNavigate?.('category', 'beds', 'Beds'); setMobileOpen(false); }
                        else if (d === 'Bedside Tables') { onNavigate?.('category', 'bedside-tables', 'Bedside Tables'); setMobileOpen(false); }
                        else if (dropSlug?.[d]) { onNavigate?.('category', dropSlug[d], d); setMobileOpen(false); }
                        else if (bedsInDrop) { onNavigate?.('category', d.toLowerCase().replace(/\s+/g, '-'), d); setMobileOpen(false); }
                        else { section && scrollToSection(section); setMobileOpen(false); }
                      }}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}