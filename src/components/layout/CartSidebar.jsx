import { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const WHATSAPP_NUMBER = '918917690567';
// Automatically picks the real URL — works on localhost, LAN IP, and live domain
const SITE_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

const CartSidebar = () => {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count, clearCart } = useCartStore();
  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;
  const [showCheckoutMsg, setShowCheckoutMsg] = useState(false);

  const buildWhatsAppMessage = () => {
    if (items.length === 0) return '';

    // Each product block: image URL on its own line so WhatsApp auto-generates a rich preview
    const lines = items.map(
      (item, i) =>
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*${i + 1}. ${item.name}*\n` +
        `🏷️ _${item.category}_\n` +
        `💬 ${item.description ? item.description.slice(0, 120) + (item.description.length > 120 ? '...' : '') : 'Premium quality furniture'}\n` +
        `💰 *${fmt(item.price)}* × ${item.qty} qty = *${fmt(item.price * item.qty)}*\n` +
        `🖼️ *Product Photo* (tap to open):\n` +
        `${SITE_BASE_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}`
    );

    const subtotal = fmt(total());
    const msg =
      `🛋️ *OASIS Furniture — New Order*\n` +
      `${'━'.repeat(22)}\n\n` +
      lines.join('\n\n') +
      `\n\n${'━'.repeat(22)}\n` +
      `🧾 *Total: ${subtotal}*\n` +
      `📦 *${count()} ${count() === 1 ? 'item' : 'items'}* | 🚚 *FREE Delivery*\n\n` +
      `Please confirm availability & arrange delivery.\n` +
      `_Thank you for shopping with OASIS!_ 🙏`;

    return encodeURIComponent(msg);
  };

  const handleCheckout = () => {
    setShowCheckoutMsg(true);
  };

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, '_blank');
    // Clear cart and close modal after sending order
    setTimeout(() => {
      clearCart();
      setShowCheckoutMsg(false);
      closeCart();
    }, 800);
  };

  return (
    <>
      <style>{`
        .cart-checkout-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,8,6,0.68);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: coFadeIn 0.22s ease;
        }
        @keyframes coFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .cart-checkout-modal {
          background: #fff;
          max-width: 420px; width: 100%;
          padding: 36px 32px 28px;
          position: relative;
          animation: coSlideUp 0.28s cubic-bezier(.22,1,.36,1);
        }
        @keyframes coSlideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .co-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: none; border: none; cursor: pointer;
          color: #aaa; transition: color 0.2s;
        }
        .co-modal-close:hover { color: #1a1714; }
        .co-modal-icon {
          width: 52px; height: 52px;
          background: #fff8ee;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .co-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem; font-weight: 700;
          color: #1a1714; text-align: center;
          margin: 0 0 10px;
        }
        .co-modal-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem; color: #6b6359;
          text-align: center; line-height: 1.65;
          margin: 0 0 24px;
        }
        .co-modal-sub strong { color: #1a1714; }
        .co-wa-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #25D366; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.10em; text-transform: uppercase;
          padding: 14px 20px;
          border: none; cursor: pointer;
          transition: background 0.22s;
          margin-bottom: 10px;
        }
        .co-wa-btn:hover { background: #1ebe5a; }
        .co-cancel-btn {
          width: 100%;
          background: none;
          border: 1px solid rgba(0,0,0,0.12);
          font-family: 'Jost', sans-serif;
          font-size: 0.74rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #8a8278; cursor: pointer;
          padding: 11px;
          transition: border-color 0.2s, color 0.2s;
        }
        .co-cancel-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .co-items-preview {
          background: #faf8f5;
          border: 1px solid #f0ebe1;
          padding: 12px 14px;
          margin-bottom: 20px;
          max-height: 200px;
          overflow-y: auto;
        }
        .co-item-line {
          font-family: 'Jost', sans-serif;
          font-size: 0.74rem; color: #4a4340;
          padding: 8px 0;
          display: flex; gap: 10px; align-items: flex-start;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .co-item-line:last-child { border-bottom: none; }
        .co-item-img {
          width: 48px; height: 48px;
          object-fit: cover; flex-shrink: 0;
          border-radius: 2px;
        }
        .co-item-info { flex: 1; min-width: 0; }
        .co-item-name { font-weight: 600; color: #1a1714; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .co-item-desc { font-size: 0.65rem; color: #8a8278; line-height: 1.4; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .co-item-price { font-weight: 600; color: #c9a96e; white-space: nowrap; font-size: 0.78rem; }
      `}</style>

      {isOpen && <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={closeCart} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F0E8]">
          <div>
            <h3 className="font-display text-2xl font-light text-[#1A1714]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Cart</h3>
            <p className="text-[#8A8278] text-xs mt-0.5">{count()} {count() === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={40} className="text-[#E8D5B0]" />
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light text-[#8A8278]">Your cart is empty</p>
              <p className="text-[#8A8278] text-xs">Add some beautiful pieces to get started.</p>
              <button onClick={closeCart} className="mt-2 bg-[#C9A96E] text-white text-xs font-medium tracking-widest uppercase px-8 py-3 hover:bg-[#b8935a] transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[#8A8278] text-[10px] tracking-widest uppercase">{item.category}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-base font-light text-[#1A1714] leading-tight">{item.name}</p>
                <p className="text-[#C9A96E] text-sm font-medium mt-1">{fmt(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-[#E8D5B0]">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors"><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-[#8A8278] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#F5F0E8]">
            <div className="flex justify-between mb-1">
              <span className="text-[#8A8278] text-sm">Subtotal</span>
              <span className="font-medium text-[#1A1714]">{fmt(total())}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#8A8278] text-xs">({count()} {count() === 1 ? 'item' : 'items'})</span>
              <span className="text-[#6B8E6B] text-xs font-medium">Free delivery on this order ✓</span>
            </div>
            <p className="text-[#8A8278] text-xs mb-5">Taxes included. Shipping calculated at checkout.</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#1A1714] text-white text-xs font-medium tracking-widest uppercase py-4 hover:bg-[#C9A96E] transition-colors"
            >
              Proceed to Checkout
            </button>
            <button onClick={closeCart} className="w-full mt-3 border border-[#E8D5B0] text-[#8A8278] text-xs font-medium tracking-widest uppercase py-3 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Checkout Coming Soon Modal */}
      {showCheckoutMsg && (
        <div className="cart-checkout-modal-overlay" onClick={() => setShowCheckoutMsg(false)}>
          <div className="cart-checkout-modal" onClick={e => e.stopPropagation()}>
            <button className="co-modal-close" onClick={() => setShowCheckoutMsg(false)}>
              <X size={18} />
            </button>

            <div className="co-modal-icon">
              <MessageCircle size={26} style={{ color: '#25D366' }} />
            </div>

            <h2 className="co-modal-title">Online Checkout Coming Soon!</h2>
            <p className="co-modal-sub">
              We're building a seamless checkout experience for you.<br />
              For now, simply send your order directly on <strong>WhatsApp</strong> — our team will confirm availability and arrange delivery.
            </p>

            {/* Items preview */}
            <div className="co-items-preview">
              {items.map((item, i) => (
                <div key={item.id} className="co-item-line">
                  <img src={item.image} alt={item.name} className="co-item-img" />
                  <div className="co-item-info">
                    <div className="co-item-name">{item.name} × {item.qty}</div>
                    {item.description && (
                      <div className="co-item-desc">{item.description}</div>
                    )}
                  </div>
                  <span className="co-item-price">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <button className="co-wa-btn" onClick={handleWhatsApp}>
              <MessageCircle size={18} />
              Send Order on WhatsApp
            </button>
            <button className="co-cancel-btn" onClick={() => setShowCheckoutMsg(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;