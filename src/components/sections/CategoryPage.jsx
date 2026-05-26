import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

const placeholderProducts = (name, count) =>
  Array.from({ length: parseInt(count) > 8 ? 8 : 4 }, (_, i) => ({
    id: i + 1,
    name: `${name} Collection ${i + 1}`,
    price: Math.floor(Math.random() * 80000 + 18000),
    tag: ['New', 'Bestseller', 'Sale', 'Premium'][i % 4],
    image: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&q=80',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80',
    ][i % 8],
  }));

export default function CategoryPage({ categoryName, onBack }) {
  const products = placeholderProducts(categoryName, 8);

  return (
    <>
      <style>{`
        .cp-root {
          min-height: 100vh;
          background: #faf8f5;
          padding-top: 68px;
        }
        .cp-hero {
          background: #f5f0e8;
          padding: 40px 40px 36px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .cp-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b6359;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 18px;
          transition: color 0.2s;
        }
        .cp-back:hover { color: #1a1714; }
        .cp-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #1a1714;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }
        .cp-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #6b6359;
          margin: 0;
        }
        .cp-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) { .cp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 760px)  { .cp-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
        @media (max-width: 480px)  { .cp-inner { padding: 32px 16px 60px; } .cp-hero { padding: 28px 16px 24px; } }

        .cp-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }
        .cp-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .cp-card-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/5;
        }
        .cp-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .cp-card:hover .cp-card-img { transform: scale(1.05); }
        .cp-card-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          padding: 4px 9px;
          background: #1a1714;
          color: #fff;
        }
        .cp-card-tag.sale { background: #c0392b; }
        .cp-card-wish {
          position: absolute;
          top: 10px;
          right: 12px;
          background: #fff;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s, transform 0.25s;
          color: #1a1714;
        }
        .cp-card:hover .cp-card-wish { opacity: 1; transform: translateY(0); }
        .cp-card-wish:hover { color: #c0392b; }
        .cp-card-body { padding: 16px 16px 18px; }
        .cp-card-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: #1a1714;
          margin: 0 0 6px 0;
          letter-spacing: 0.01em;
        }
        .cp-card-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1714;
        }
        .cp-card-atc {
          width: 100%;
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          background: #1a1714;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s, transform 0.25s, background 0.2s;
        }
        .cp-card:hover .cp-card-atc { opacity: 1; transform: translateY(0); }
        .cp-card-atc:hover { background: #302a24; }
      `}</style>

      <div className="cp-root">
        <div className="cp-hero">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <button className="cp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back to Home
            </button>
            <h1 className="cp-heading">{categoryName}</h1>
            <p className="cp-sub">Handcrafted pieces — designed for the modern Indian home.</p>
          </div>
        </div>

        <div className="cp-inner">
          <div className="cp-grid">
            {products.map(p => (
              <div key={p.id} className="cp-card">
                <div className="cp-card-img-wrap">
                  <img className="cp-card-img" src={p.image} alt={p.name} loading="lazy" />
                  <span className={`cp-card-tag${p.tag === 'Sale' ? ' sale' : ''}`}>{p.tag}</span>
                  <button className="cp-card-wish" aria-label="Wishlist">
                    <Heart size={15} />
                  </button>
                </div>
                <div className="cp-card-body">
                  <p className="cp-card-name">{p.name}</p>
                  <p className="cp-card-price">₹{p.price.toLocaleString('en-IN')}</p>
                  {/* Add to Cart — temporarily hidden (client request) */}
                  {/* <button className="cp-card-atc">
                    <ShoppingBag size={12} />
                    Add to Cart
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}