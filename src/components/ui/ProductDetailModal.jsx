import { X, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function ProductDetailModal({ product, onClose }) {
  const addItem    = useCartStore(s => s.addItem);
  const toggleWL   = useWishlistStore(s => s.toggle);
  const isWL       = useWishlistStore(s => s.isWishlisted(product.id));
  const showToast  = useToastStore(s => s.show);

  const handleWishlist = () => {
    const action = toggleWL(product);
    if (action === 'added') showToast(`Added "${product.name}" to Wishlist`, 'wishlist');
    else showToast(`Removed from Wishlist`, 'success');
  };

  const handleCart = () => {
    addItem(product);
    showToast(`"${product.name}" added to cart`, 'success');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            style={{
              color: i < full || (i === full && half) ? '#c9a96e' : '#e0d6c8',
              fill:  i < full ? '#c9a96e' : 'none',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .pdm-backdrop {
          position: fixed; inset: 0;
          background: rgba(10,8,6,0.65);
          z-index: 5000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: pdmFadeIn 0.22s ease forwards;
        }
        @keyframes pdmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pdm-modal {
          background: #fff;
          max-width: 820px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          animation: pdmSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes pdmSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .pdm-modal { grid-template-columns: 1fr; }
        }
        .pdm-img-wrap { position: relative; }
        .pdm-img-wrap img {
          width: 100%; height: 100%; min-height: 360px;
          object-fit: cover; display: block;
        }
        .pdm-tag {
          position: absolute; top: 16px; left: 16px;
          background: #1a1714; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 10px;
        }
        .pdm-tag.sale { background: #c9a96e; }
        .pdm-body {
          padding: 36px 32px;
          display: flex; flex-direction: column; gap: 0;
          font-family: 'Jost', sans-serif;
        }
        .pdm-close {
          position: absolute; top: 14px; right: 14px;
          background: #fff; border: none;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: background 0.2s;
        }
        .pdm-close:hover { background: #f5f0e8; }
        .pdm-cat {
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #8a8278; margin-bottom: 10px;
        }
        .pdm-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-weight: 600;
          color: #1a1714; line-height: 1.15;
          margin: 0 0 12px 0;
        }
        .pdm-rating-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 18px;
        }
        .pdm-rating-count {
          font-size: 0.75rem; color: #8a8278;
        }
        .pdm-price-row {
          display: flex; align-items: baseline; gap: 10px;
          margin-bottom: 6px;
        }
        .pdm-price {
          font-family: 'Jost', sans-serif;
          font-size: 1.4rem; font-weight: 500;
          color: #1a1714;
        }
        .pdm-original {
          font-size: 1rem; color: #8a8278;
          text-decoration: line-through;
        }
        .pdm-discount-badge {
          background: #fdf3e7; color: #c9a96e;
          font-size: 0.7rem; font-weight: 600;
          padding: 3px 8px; letter-spacing: 0.04em;
        }
        .pdm-incl { font-size: 0.72rem; color: #8a8278; margin-bottom: 20px; }
        .pdm-divider { height: 1px; background: #f0ebe1; margin: 16px 0; }
        .pdm-desc {
          font-size: 0.84rem; color: #6b6460; line-height: 1.75;
          margin-bottom: 20px;
        }
        .pdm-colors-label {
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #8a8278; margin-bottom: 10px;
        }
        .pdm-colors { display: flex; gap: 8px; margin-bottom: 24px; }
        .pdm-color-dot {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.08); cursor: pointer;
          transition: transform 0.2s;
        }
        .pdm-color-dot:hover { transform: scale(1.15); }
        .pdm-btns { display: flex; gap: 10px; margin-top: auto; }
        .pdm-btn-cart {
          flex: 1;
          background: #1a1714; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 20px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.25s;
        }
        .pdm-btn-cart:hover { background: #c9a96e; }
        .pdm-btn-wl {
          width: 48px; height: 48px;
          border: 1.5px solid #e8d5b0;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .pdm-btn-wl:hover { border-color: #c9a96e; background: #fdf3e7; }
        .pdm-btn-wl.active { border-color: #c9a96e; background: #fdf3e7; }
      `}</style>

      <div className="pdm-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="pdm-modal">
          <button className="pdm-close" onClick={onClose}><X size={16} /></button>

          {/* Image */}
          <div className="pdm-img-wrap">
            <img src={product.image} alt={product.name} />
            {product.tag && (
              <span className={`pdm-tag${discount ? ' sale' : ''}`}>{product.tag}</span>
            )}
          </div>

          {/* Body */}
          <div className="pdm-body">
            <p className="pdm-cat">{product.category}</p>
            <h2 className="pdm-name">{product.name}</h2>

            <div className="pdm-rating-row">
              {renderStars(product.rating || 4.8)}
              <span className="pdm-rating-count">{product.rating} ({product.reviews || 0} reviews)</span>
            </div>

            <div className="pdm-price-row">
              <span className="pdm-price">{fmt(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="pdm-original">{fmt(product.originalPrice)}</span>
                  {discount && <span className="pdm-discount-badge">{discount}% OFF</span>}
                </>
              )}
            </div>
            <p className="pdm-incl">Incl. of all taxes · Free delivery above ₹15,000</p>

            <div className="pdm-divider" />

            {product.description && (
              <p className="pdm-desc">{product.description}</p>
            )}

            {product.colors && product.colors.length > 0 && (
              <>
                <p className="pdm-colors-label">Available Colours</p>
                <div className="pdm-colors">
                  {product.colors.map((c, i) => (
                    <div key={i} className="pdm-color-dot" style={{ background: c }} />
                  ))}
                </div>
              </>
            )}

            <div className="pdm-btns">
              {/* Add to Cart — temporarily hidden (client request) */}
              {/* <button className="pdm-btn-cart" onClick={handleCart}>
                <ShoppingBag size={14} /> Add to Cart
              </button> */}
              <button
                className={`pdm-btn-wl${isWL ? ' active' : ''}`}
                onClick={handleWishlist}
                aria-label="Wishlist"
              >
                <Heart
                  size={16}
                  style={{ color: isWL ? '#c9a96e' : '#1a1714' }}
                  fill={isWL ? '#c9a96e' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}