import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

/* ─── Product Data ─────────────────────────────────────────────────── */
const outdoorProducts = [
  // Outdoor Wicker Series
  {
    id: 'ODR-01', code: 'ODR-01',
    name: 'Outdoor Set 1+4',
    series: 'Outdoor Wicker',
    type: '1 Table + 4 Chairs',
    image: '/outdoor/ODR-01.jpg',
    price: 44968,
    tag: 'New',
  },
  {
    id: 'ODR-02', code: 'ODR-02',
    name: 'Outdoor Set 1+4',
    series: 'Outdoor Wicker',
    type: '1 Table + 4 Chairs',
    image: '/outdoor/ODR-02.jpg',
    price: 64252,
    tag: 'New',
  },
  {
    id: 'ODR-03', code: 'ODR-03',
    name: 'Outdoor Set 1+4',
    series: 'Outdoor Wicker',
    type: '1 Table + 4 Chairs',
    image: '/outdoor/ODR-03.jpg',
    price: 73394,
    tag: 'New',
  },
  {
    id: 'ODR-04', code: 'ODR-04',
    name: 'Outdoor Sofa Set 3+1+1',
    series: 'Outdoor Wicker',
    type: '3 Seater + 2 Single Chairs',
    image: '/outdoor/ODR-04.jpg',
    price: 97906,
    tag: 'New',
  },
  {
    id: 'ODR-05', code: 'ODR-05',
    name: 'Outdoor Sofa Set 3+1+1',
    series: 'Outdoor Wicker',
    type: '3 Seater + 2 Single Chairs',
    image: '/outdoor/ODR-05.jpg',
    price: 104534,
    tag: 'New',
  },
  {
    id: 'ODR-06', code: 'ODR-06',
    name: 'Outdoor Set 2+1',
    series: 'Outdoor Wicker',
    type: '1 Table + 2 Chairs',
    image: '/outdoor/ODR-06.jpg',
    price: 38083,
    tag: 'New',
  },
  {
    id: 'ODR-07', code: 'ODR-07',
    name: 'Outdoor Set 1+4',
    series: 'Outdoor Wicker',
    type: '1 Table + 4 Chairs',
    image: '/outdoor/ODR-07.jpg',
    price: 54110,
    tag: 'New',
  },
  {
    id: 'ODR-08', code: 'ODR-08',
    name: 'Outdoor Set 1+4',
    series: 'Outdoor Wicker',
    type: '1 Table + 4 Chairs',
    image: '/outdoor/ODR-08.jpg',
    price: 74565,
    tag: 'New',
  },
  {
    id: 'ODR-09', code: 'ODR-09',
    name: 'Outdoor Set 2+1+1',
    series: 'Outdoor Wicker',
    type: '1 Table + 2 Chairs + 1 Bench',
    image: '/outdoor/ODR-09.jpg',
    price: 55924,
    tag: 'New',
  },
  {
    id: 'ODR-10', code: 'ODR-10',
    name: 'Outdoor Set 3+1+1',
    series: 'Outdoor Wicker',
    type: '3 Seater + 2 Single Chairs',
    image: '/outdoor/ODR-10.jpg',
    price: 105248,
    tag: 'New',
  },
  // Swing Wicker Series
  {
    id: 'SWWS-01', code: 'SWWS-01',
    name: 'Swing Wicker',
    series: 'Swing Wicker',
    type: 'Single Hanging Chair',
    image: '/outdoor/SWWS-01.jpg',
    price: 23870,
    tag: 'New',
  },
  {
    id: 'SWWS-02', code: 'SWWS-02',
    name: 'Swing Wicker',
    series: 'Swing Wicker',
    type: 'Single Hanging Chair',
    image: '/outdoor/SWWS-02.jpg',
    price: 25870,
    tag: 'New',
  },
  {
    id: 'SWWS-03', code: 'SWWS-03',
    name: 'Swing Wicker Double',
    series: 'Swing Wicker',
    type: 'Double Hanging Chair',
    image: '/outdoor/SWWS-03.jpg',
    price: 52839,
    tag: 'New',
  },
  // Swing Rope Series
  {
    id: 'SWRS-01', code: 'SWRS-01',
    name: 'Swing Rope',
    series: 'Swing Rope',
    type: 'Double Hanging Chair',
    image: '/outdoor/SWRS-01.jpg',
    price: 45511,
    tag: 'New',
  },
  {
    id: 'SWRS-02', code: 'SWRS-02',
    name: 'Swing Rope',
    series: 'Swing Rope',
    type: 'Single Hanging Chair',
    image: '/outdoor/SWRS-02.jpg',
    price: 41611,
    tag: 'New',
  },
  {
    id: 'SWRS-03', code: 'SWRS-03',
    name: 'Swing Rope',
    series: 'Swing Rope',
    type: 'Single Hanging Chair',
    image: '/outdoor/SWRS-03.jpg',
    price: 32775,
    tag: 'New',
  },
];

const allSeries = ['All', 'Outdoor Wicker', 'Swing Wicker', 'Swing Rope'];

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const seriesColors = {
  'Outdoor Wicker': '#6b7c3d',
  'Swing Wicker':   '#8a5c2a',
  'Swing Rope':     '#3d6b6b',
};

/* ─── Product Card ────────────────────────────────────────────────── */
function ProductCard({ product, onAddCart, onAddWishlist, isWishlisted }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="na-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tag badge */}
      <div className="na-card-badge" style={{ background: seriesColors[product.series] || '#555' }}>
        ✦ {product.tag}
      </div>

      {/* Image */}
      <div className="na-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className={`na-card-img${hovered ? ' zoomed' : ''}`}
          loading="lazy"
        />
        {/* Wishlist button */}
        <button
          className={`na-wl-btn${isWishlisted ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onAddWishlist(product); }}
          aria-label="Add to wishlist"
        >
          <Heart size={15} fill={isWishlisted ? '#c9a96e' : 'none'} strokeWidth={1.8} />
        </button>
        {/* Series pill */}
        <div className="na-series-pill" style={{ background: seriesColors[product.series] || '#555' }}>
          {product.series}
        </div>
      </div>

      {/* Info */}
      <div className="na-card-body">
        <div className="na-card-code">{product.code}</div>
        <div className="na-card-name">{product.name}</div>
        <div className="na-card-type">{product.type}</div>
        <div className="na-card-footer">
          <span className="na-card-price">{fmt(product.price)}</span>
          <button
            className={`na-add-btn${added ? ' added' : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓ Added' : (
              <><ShoppingBag size={13} strokeWidth={2} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────── */
export default function NewArrivalsPage({ onBack }) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const addItem     = useCartStore(s => s.addItem);
  const addToWl     = useWishlistStore(s => s.addItem);
  const wlItems     = useWishlistStore(s => s.items);
  const sortRef     = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    const close = (e) => { if (!sortRef.current?.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filtered = outdoorProducts
    .filter(p => filter === 'All' || p.series === filter)
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const sortLabels = { default: 'Featured', 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low' };

  return (
    <>
      <style>{`
        .na-root { font-family: 'Jost', sans-serif; background: #faf8f5; min-height: 100vh; }

        /* Page header — clean light style matching site */
        .na-page-header {
          background: #f5f0e8;
          padding: 28px 40px 0;
        }

        /* Back button */
        .na-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5a5248;
          padding: 0 0 20px 0;
          transition: color 0.2s;
        }
        .na-back:hover { color: #1a1714; }
        .na-back svg { transition: transform 0.2s; }
        .na-back:hover svg { transform: translateX(-3px); }

        .na-header-body { padding-bottom: 24px; }
        .na-header-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 8px;
        }
        .na-header-title {
          font-family: 'Jost', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1714;
          letter-spacing: -0.01em;
          margin: 0 0 10px 0;
          line-height: 1.15;
        }
        .na-header-desc {
          font-size: 0.88rem;
          color: #6b6059;
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          max-width: 560px;
        }

        /* Controls bar */
        .na-controls {
          padding: 16px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 100%;
          background: #f5f0e8;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .na-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .na-filter-btn {
          padding: 7px 20px;
          border-radius: 2px;
          border: 1px solid #d8d0c4;
          background: transparent;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #5a5248;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.03em;
        }
        .na-filter-btn:hover { border-color: #c9a96e; color: #c9a96e; background: rgba(201,169,110,0.06); }
        .na-filter-btn.active {
          background: #c9a96e;
          border-color: #c9a96e;
          color: #fff;
          font-weight: 600;
        }
        .na-sort-wrap { position: relative; }
        .na-sort-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e8e1d8;
          background: #fff;
          border-radius: 2px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #5a5248;
          cursor: pointer;
          transition: border-color 0.18s;
          white-space: nowrap;
        }
        .na-sort-btn:hover { border-color: #c9a96e; }
        .na-sort-drop {
          position: absolute;
          right: 0;
          top: calc(100% + 6px);
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-top: 2px solid #c9a96e;
          box-shadow: 0 12px 36px rgba(0,0,0,0.12);
          min-width: 210px;
          z-index: 50;
          padding: 6px 0;
        }
        .na-sort-opt {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 18px;
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.84rem;
          color: #2a2520;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
        }
        .na-sort-opt:hover { background: #faf7f2; color: #c9a96e; }
        .na-sort-opt.active { color: #c9a96e; font-weight: 600; }

        /* Count */
        .na-count {
          font-size: 0.78rem;
          color: #8a8278;
          letter-spacing: 0.04em;
          padding: 18px 40px 4px;
        }

        /* Grid */
        .na-grid {
          padding: 20px 40px 64px;
          max-width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        /* Series divider */
        .na-series-divider {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 0;
        }
        .na-series-divider-line { flex: 1; height: 1px; background: #e8e1d8; }
        .na-series-divider-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8a8278;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .na-series-divider-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* Card */
        .na-card {
          background: #fff;
          border: 1px solid #f0ebe3;
          position: relative;
          transition: box-shadow 0.24s ease, transform 0.24s ease;
          cursor: default;
        }
        .na-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }
        .na-card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          padding: 4px 10px;
          border-radius: 2px;
        }
        .na-card-img-wrap {
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          position: relative;
          background: #f5f0e8;
        }
        .na-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(.22,1,.36,1);
        }
        .na-card-img.zoomed { transform: scale(1.06); }
        .na-wl-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
        }
        .na-wl-btn:hover { background: #fff; border-color: #c9a96e; }
        .na-wl-btn.active { background: #fff8f0; border-color: #c9a96e; }
        .na-series-pill {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          padding: 3px 10px;
          border-radius: 2px;
          opacity: 0.92;
        }
        .na-card-body {
          padding: 16px 18px 18px;
        }
        .na-card-code {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #b0a898;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .na-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.18rem;
          font-weight: 600;
          color: #1a1714;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .na-card-type {
          font-size: 0.78rem;
          color: #8a8278;
          margin-bottom: 14px;
          font-weight: 400;
        }
        .na-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .na-card-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1714;
          letter-spacing: -0.01em;
        }
        .na-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: #1a1714;
          color: #fff;
          border: 1px solid #1a1714;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          border-radius: 2px;
          white-space: nowrap;
        }
        .na-add-btn:hover { background: #c9a96e; border-color: #c9a96e; }
        .na-add-btn.added { background: #4a7c59; border-color: #4a7c59; }

        /* Fade in animation */
        .na-card {
          opacity: 0;
          animation: naFadeUp 0.45s ease forwards;
        }
        @keyframes naFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .na-page-header { padding: 20px 20px 0; }
          .na-controls { padding: 14px 20px; }
          .na-grid { padding: 16px 20px 48px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
          .na-count { padding: 14px 20px 4px; }
        }
        @media (max-width: 480px) {
          .na-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="na-root">

        {/* Clean page header — matches site's other category pages */}
        <div className="na-page-header">
          <button className="na-back" onClick={onBack}>
            <ArrowLeft size={13} strokeWidth={2.5} />
            Back to Home
          </button>
          <div className="na-header-body">
            <div className="na-header-tag">✦ May 2026 Collection</div>
            <h1 className="na-header-title">New Arrivals</h1>
            <p className="na-header-desc">
              Introducing our latest Outdoor Furniture — crafted for terraces, gardens &amp; balconies with premium wicker &amp; rope weaving.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="na-controls">
          <div className="na-filters">
            {allSeries.map(s => (
              <button
                key={s}
                className={`na-filter-btn${filter === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="na-sort-wrap" ref={sortRef}>
            <button className="na-sort-btn" onClick={() => setSortOpen(o => !o)}>
              Sort: {sortLabels[sortBy]}
              <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: sortOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {sortOpen && (
              <div className="na-sort-drop">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`na-sort-opt${sortBy === key ? ' active' : ''}`}
                    onClick={() => { setSortBy(key); setSortOpen(false); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="na-count">
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {filter !== 'All' ? ` in ${filter}` : ''}
        </div>

        {/* Grid — with series dividers when showing All */}
        <div className="na-grid">
          {filter === 'All' ? (
            allSeries.filter(s => s !== 'All').map(series => {
              const items = filtered.filter(p => p.series === series);
              if (!items.length) return null;
              return (
                <div key={series} style={{ display: 'contents' }}>
                  <div className="na-series-divider">
                    <div className="na-series-divider-line" />
                    <div className="na-series-divider-label">
                      <div
                        className="na-series-divider-dot"
                        style={{ background: seriesColors[series] || '#555' }}
                      />
                      {series}
                    </div>
                    <div className="na-series-divider-line" />
                  </div>
                  {items.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddCart={(item) => addItem({ ...item, category: item.series })}
                      onAddWishlist={(item) => addToWl({ ...item, category: item.series })}
                      isWishlisted={wlItems.some(w => w.id === p.id)}
                      style={{ animationDelay: `${i * 60}ms` }}
                    />
                  ))}
                </div>
              );
            })
          ) : (
            filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddCart={(item) => addItem({ ...item, category: item.series })}
                onAddWishlist={(item) => addToWl({ ...item, category: item.series })}
                isWishlisted={wlItems.some(w => w.id === p.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}