import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';
import { bestSellers } from '../../data/products';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { useCartStore } from '../../store/useCartStore';
import ProductDetailModal from '../ui/ProductDetailModal';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const renderStars = (rating = 4.8) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 10 10">
          <polygon
            points="5,0.5 6.2,3.8 9.8,4 7.2,6.2 8,9.8 5,7.8 2,9.8 2.8,6.2 0.2,4 3.8,3.8"
            fill={i < full ? '#c9a96e' : '#e0d6c8'}
          />
        </svg>
      ))}
    </span>
  );
};

function BestSellerCard({ product }) {
  const [modal, setModal] = useState(false);
  const toggleWL  = useWishlistStore(s => s.toggle);
  const isWL      = useWishlistStore(s => s.isWishlisted(product.id));
  const showToast = useToastStore(s => s.show);
  const addItem   = useCartStore(s => s.addItem);

  const handleWL = (e) => {
    e.stopPropagation();
    const action = toggleWL(product);
    if (action === 'added') showToast(`Added "${product.name}" to Wishlist`, 'wishlist');
    else showToast(`Removed from Wishlist`, 'success');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <div className="bs-card group" style={{ flexShrink: 0 }}>
        <div className="bs-card-img-wrap">
          <img src={product.image} alt={product.name} className="bs-card-img" />

          {/* Tag */}
          {product.tag && (
            <span className={`bs-tag${product.tag === 'BEST SELLER' ? ' bs-tag-dark' : ' bs-tag-gold'}`}>
              {discount ? `${discount}% OFF` : product.tag}
            </span>
          )}

          {/* Wishlist */}
          <button className="bs-wl-btn" onClick={handleWL} aria-label="Wishlist">
            <Heart size={14} fill={isWL ? '#c9a96e' : 'none'} style={{ color: isWL ? '#c9a96e' : '#1a1714' }} />
          </button>

          {/* View Details overlay */}
          <button className="bs-view-btn" onClick={() => setModal(true)}>
            <Eye size={13} style={{ marginRight: 5 }} /> View Details
          </button>
        </div>

        <div className="bs-card-body" onClick={() => setModal(true)} style={{ cursor: 'pointer' }}>
          <p className="bs-cat">{product.category}</p>
          <h3 className="bs-name">{product.name}</h3>
          <div className="bs-stars-row">
            {renderStars(product.rating)}
            <span className="bs-stars-count">{product.rating} ({product.reviews})</span>
          </div>
          {product.colors && (
            <div className="bs-colors">
              {product.colors.map((c, i) => (
                <div key={i} className="bs-color-dot" style={{ background: c }} />
              ))}
            </div>
          )}
          <div className="bs-price-row">
            <span className="bs-price">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="bs-original">{fmt(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>

      {modal && <ProductDetailModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}

export default function BestSellers() {
  const scrollRef = useRef(null);
  const [pos, setPos] = useState(0);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 480;
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
    setTimeout(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setPos(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
    }, 350);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setPos(progress);
  };

  return (
    <>
      <style>{`
        .bs-section {
          background: #fff;
          padding: 72px 0 56px;
        }
        .bs-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .bs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 36px;
          gap: 14px;
        }
        .bs-eyebrow {
          font-weight: 700;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 8px;
        }
        .bs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.7rem);
          font-weight: 800;
          color: #1a1714;
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.1;
        }
        .bs-view-all {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #1a1714;
          text-decoration: none;
          letter-spacing: 0.03em;
          white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
          border-bottom: 1px solid #1a1714;
          padding-bottom: 1px;
          transition: color 0.2s;
          background: none; border-top: none; border-left: none; border-right: none;
          cursor: pointer;
        }
        .bs-view-all:hover { color: #c9a96e; border-bottom-color: #c9a96e; }

        /* Scroll container */
        .bs-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 4px;
        }
        .bs-scroll::-webkit-scrollbar { display: none; }

        /* Card */
        .bs-card {
          width: 340px;
          min-width: 340px;
          background: #fff;
          scroll-snap-align: start;
        }
        .bs-card-img-wrap {
          position: relative;
          overflow: hidden;
        }
        .bs-card-img {
          width: 100%; height: 380px;
          object-fit: cover;
          display: block;
          transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .bs-card:hover .bs-card-img { transform: scale(1.04); }

        /* Tag */
        .bs-tag {
          position: absolute; top: 14px; left: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 10px;
        }
        .bs-tag-dark  { background: #1a1714; color: #fff; }
        .bs-tag-gold  { background: #c9a96e; color: #fff; }

        /* Wishlist btn */
        .bs-wl-btn {
          position: absolute; top: 14px; right: 14px;
          width: 34px; height: 34px;
          background: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .bs-card:hover .bs-wl-btn { opacity: 1; }

        /* View details overlay */
        .bs-view-btn {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(26,23,20,0.88);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 12px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .bs-card:hover .bs-view-btn { transform: translateY(0); }
        .bs-view-btn:hover { background: #c9a96e; }

        /* Card body */
        .bs-card-body { padding: 16px 4px 8px; }
        .bs-cat {
          font-family: 'Jost', sans-serif;
          font-size: 0.64rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #8a8278; margin: 0 0 5px 0;
        }
        .bs-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-weight: 600;
          color: #1a1714; margin: 0 0 6px 0; line-height: 1.2;
        }
        .bs-stars-row {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 8px;
        }
        .bs-stars-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.70rem; color: #8a8278;
        }
        .bs-colors {
          display: flex; gap: 6px; margin-bottom: 8px;
        }
        .bs-color-dot {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.1);
        }
        .bs-price-row { display: flex; align-items: baseline; gap: 8px; }
        .bs-price {
          font-family: 'Jost', sans-serif;
          font-size: 1rem; font-weight: 500; color: #1a1714;
        }
        .bs-original {
          font-size: 0.85rem; color: #8a8278; text-decoration: line-through;
        }

        /* Nav dots / scroll indicator */
        .bs-scrollbar-wrap {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bs-scrollbar-track {
          flex: 1;
          height: 2px;
          background: #e8d5b0;
          max-width: 320px;
          position: relative;
          overflow: visible;
        }
        .bs-scrollbar-thumb {
          position: absolute; top: 0; left: 0;
          height: 100%;
          background: #1a1714;
          width: 30%;
          border-radius: 1px;
          transition: transform 0.3s;
        }
        .bs-nav-btn {
          width: 40px; height: 40px;
          border: 1.5px solid #e8d5b0;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .bs-nav-btn:hover { border-color: #1a1714; background: #1a1714; color: #fff; }

        @media (max-width: 640px) {
          .bs-inner { padding: 0 16px; }
          .bs-card { width: 280px; min-width: 280px; }
        }
      `}</style>

      <section className="bs-section" id="bestsellers">
        <div className="bs-inner">
          <div className="bs-header">
            <p className="bs-eyebrow">Top Sale Picks</p>
            <h2 className="bs-title">Our Best-Sellers This Season</h2>
            <button className="bs-view-all">View All Products →</button>
          </div>

          <div ref={scrollRef} className="bs-scroll" onScroll={handleScroll}>
            {bestSellers.map(p => (
              <BestSellerCard key={p.id} product={p} />
            ))}
          </div>

          <div className="bs-scrollbar-wrap">
            <button className="bs-nav-btn" onClick={() => scroll('prev')}><ChevronLeft size={16} /></button>
            <div className="bs-scrollbar-track">
              <div
                className="bs-scrollbar-thumb"
                style={{
                  transform: `translateX(${pos * 233}%)`,
                }}
              />
            </div>
            <button className="bs-nav-btn" onClick={() => scroll('next')}><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
    </>
  );
}