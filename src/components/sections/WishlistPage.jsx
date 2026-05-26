import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { useState } from 'react';
import ProductDetailModal from '../ui/ProductDetailModal';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function WishlistPage({ onBack }) {
  const items     = useWishlistStore(s => s.items);
  const toggle    = useWishlistStore(s => s.toggle);
  const addItem   = useCartStore(s => s.addItem);
  const showToast = useToastStore(s => s.show);
  const [modal, setModal] = useState(null);

  const handleRemove = (p) => {
    toggle(p);
    showToast(`Removed "${p.name}" from Wishlist`, 'success');
  };

  const handleCart = (p) => {
    addItem(p);
    toggle(p); // remove from wishlist after moving to cart
    showToast(`"${p.name}" moved to cart`, 'success');
  };

  return (
    <>
      <style>{`
        .wl-page { background: #faf9f6; min-height: 80vh; padding: 56px 0 80px; }
        .wl-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        .wl-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem; font-weight: 500;
          color: #8a8278; background: none; border: none;
          cursor: pointer; margin-bottom: 36px;
          transition: color 0.2s; padding: 0;
        }
        .wl-back:hover { color: #1a1714; }
        .wl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 700;
          color: #1a1714; margin: 0 0 6px 0;
        }
        .wl-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.80rem; color: #8a8278; margin: 0 0 36px 0;
        }
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .wl-card { background: #fff; position: relative; }
        .wl-card-img { position: relative; overflow: hidden; }
        .wl-card-img img {
          width: 100%; height: 260px; object-fit: cover; display: block;
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .wl-card:hover .wl-card-img img { transform: scale(1.05); }
        .wl-remove {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px; background: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .wl-remove:hover { background: #fdf3e7; }
        .wl-card-body { padding: 14px 14px 16px; }
        .wl-cat {
          font-family: 'Jost', sans-serif;
          font-size: 0.60rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #8a8278; margin-bottom: 4px;
        }
        .wl-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-weight: 600;
          color: #1a1714; margin: 0 0 10px 0; line-height: 1.2;
          cursor: pointer;
        }
        .wl-name:hover { color: #c9a96e; }
        .wl-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem; font-weight: 500; color: #1a1714;
          margin-bottom: 12px;
        }
        .wl-add-btn {
          width: 100%;
          background: #1a1714; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 11px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.22s;
        }
        .wl-add-btn:hover { background: #c9a96e; }
        .wl-empty {
          text-align: center; padding: 80px 0;
          font-family: 'Jost', sans-serif;
        }
        .wl-empty-icon { color: #e8d5b0; margin-bottom: 20px; }
        .wl-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-weight: 600; color: #1a1714;
          margin-bottom: 10px;
        }
        .wl-empty-sub { font-size: 0.82rem; color: #8a8278; margin-bottom: 28px; }
        .wl-shop-btn {
          background: #1a1714; color: #fff;
          font-size: 0.70rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 13px 28px; border: none; cursor: pointer;
          transition: background 0.22s;
        }
        .wl-shop-btn:hover { background: #c9a96e; }

        @media (max-width: 900px) { .wl-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) {
          .wl-inner { padding: 0 16px; }
          .wl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wl-page">
        <div className="wl-inner">
          <button className="wl-back" onClick={onBack}>
            <ArrowLeft size={15} /> Back to Home
          </button>

          <h1 className="wl-title">My Wishlist</h1>
          <p className="wl-count">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>

          {items.length === 0 ? (
            <div className="wl-empty">
              <Heart size={56} className="wl-empty-icon" style={{ display: 'block', margin: '0 auto 20px' }} />
              <h2 className="wl-empty-title">Your wishlist is empty</h2>
              <p className="wl-empty-sub">Save pieces you love and come back to them anytime.</p>
              <button className="wl-shop-btn" onClick={onBack}>Continue Shopping</button>
            </div>
          ) : (
            <div className="wl-grid">
              {items.map(p => (
                <div key={p.id} className="wl-card">
                  <div className="wl-card-img">
                    <img src={p.image} alt={p.name} />
                    <button className="wl-remove" onClick={() => handleRemove(p)} aria-label="Remove">
                      <Heart size={14} fill="#c9a96e" style={{ color: '#c9a96e' }} />
                    </button>
                  </div>
                  <div className="wl-card-body">
                    <p className="wl-cat">{p.category}</p>
                    <h3 className="wl-name" onClick={() => setModal(p)}>{p.name}</h3>
                    <p className="wl-price">{fmt(p.price)}</p>
                    {/* Move to Cart — temporarily hidden (client request) */}
                    {/* <button className="wl-add-btn" onClick={() => handleCart(p)}>
                      <ShoppingBag size={13} /> Move to Cart
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && <ProductDetailModal product={modal} onClose={() => setModal(null)} />}
    </>
  );
}