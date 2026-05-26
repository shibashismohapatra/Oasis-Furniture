import { useState } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import ProductDetailModal from './ProductDetailModal';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const renderStars = (rating = 4.8) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10">
          <polygon
            points="5,0.5 6.2,3.8 9.8,4 7.2,6.2 8,9.8 5,7.8 2,9.8 2.8,6.2 0.2,4 3.8,3.8"
            fill={i < full ? '#c9a96e' : '#e0d6c8'}
          />
        </svg>
      ))}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const addItem    = useCartStore(s => s.addItem);
  const toggleWL   = useWishlistStore(s => s.toggle);
  const isWL       = useWishlistStore(s => s.isWishlisted(product.id));
  const showToast  = useToastStore(s => s.show);

  const handleWL = (e) => {
    e.stopPropagation();
    const action = toggleWL(product);
    if (action === 'added') showToast(`Added "${product.name}" to Wishlist`, 'wishlist');
    else showToast(`Removed from Wishlist`, 'success');
  };

  const handleCart = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`"${product.name}" added to cart`, 'success');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <div className="card-hover group bg-white" style={{ cursor: 'pointer' }}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Tag */}
          {product.tag && (
            <span
              className="absolute top-4 left-4 text-white text-[10px] font-medium tracking-widest uppercase px-3 py-1"
              style={{ background: product.tag === 'BEST SELLER' ? '#1a1714' : '#c9a96e' }}
            >
              {discount && product.tag !== 'BEST SELLER' ? `${discount}% OFF` : product.tag}
            </span>
          )}

          {/* Wishlist icon */}
          <button
            onClick={handleWL}
            className="absolute top-4 right-4 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#fdf3e7]"
            aria-label="Wishlist"
          >
            <Heart size={15} fill={isWL ? '#c9a96e' : 'none'} style={{ color: isWL ? '#c9a96e' : '#1a1714' }} />
          </button>

          {/* Hover overlay: View Details + Add to Cart */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-white text-[#1a1714] text-[10px] font-semibold tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-[#f5f0e8] transition-colors"
            >
              <Eye size={13} /> View Details
            </button>
            {/* Add to Cart — temporarily hidden (client request) */}
            {/* <button
              onClick={handleCart}
              className="flex-1 bg-[#1a1714] text-white text-[10px] font-semibold tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-[#C9A96E] transition-colors"
            >
              <ShoppingBag size={13} /> Add to Cart
            </button> */}
          </div>
        </div>

        {/* Info */}
        <div className="p-5" onClick={() => setShowModal(true)}>
          <p className="text-[#8A8278] text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-[#1A1714]">{product.name}</h3>

          {/* Stars */}
          {product.rating && (
            <div className="flex items-center gap-2 mt-1">
              {renderStars(product.rating)}
              <span className="text-[#8a8278] text-[10px]">{product.rating} ({product.reviews})</span>
            </div>
          )}

          {/* Colors */}
          {product.colors && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.map((c, i) => (
                <div key={i} className="w-4 h-4 rounded-full border border-[rgba(0,0,0,0.1)]" style={{ background: c }} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[#1a1714] font-medium">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[#8A8278] text-sm line-through">{fmt(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>

      {showModal && <ProductDetailModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ProductCard;