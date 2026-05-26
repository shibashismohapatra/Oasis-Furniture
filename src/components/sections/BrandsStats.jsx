import { brands } from '../../data/products';

export default function BrandsStats() {
  return (
    <>
      <style>{`
        /* ── Brands Section ── */
        .brands-section {
          background: #fff;
          padding: 72px 0 64px;
          border-top: 1px solid #f0ebe1;
          border-bottom: 1px solid #f0ebe1;
          overflow: hidden;
        }
        .brands-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .brands-header {
          text-align: center;
          margin-bottom: 52px;
        }
        .brands-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 12px;
        }
        .brands-gold-line {
          width: 40px;
          height: 2px;
          background: #c9a96e;
          margin: 0 auto 14px;
        }
        .brands-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800;
          color: #1a1714;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .brands-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
          color: #5a5048;
          margin: 14px 0 0;
          letter-spacing: 0.02em;
        }

        /* ── Brand Cards Grid ── */
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1px;
          background: #f0ebe1;
          border: 1px solid #f0ebe1;
        }
        .brand-card {
          background: #fff;
          padding: 32px 20px 28px;
          text-align: center;
          position: relative;
          transition: background 0.25s ease, transform 0.25s ease;
          cursor: default;
          overflow: hidden;
        }
        .brand-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 32px; height: 2px;
          background: #c9a96e;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .brand-card:hover {
          background: #faf7f2;
          transform: translateY(-2px);
          z-index: 1;
          box-shadow: 0 8px 32px rgba(201,169,110,0.12);
        }
        .brand-card:hover::before {
          transform: translateX(-50%) scaleX(1);
        }
        .brand-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #e8d5b0;
          display: block;
          line-height: 1;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
          transition: color 0.25s;
        }
        .brand-card:hover .brand-number {
          color: #c9a96e;
        }
        .brand-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1714;
          display: block;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .brand-divider {
          width: 20px;
          height: 1px;
          background: #e8d5b0;
          margin: 0 auto 8px;
          transition: width 0.3s ease, background 0.25s;
        }
        .brand-card:hover .brand-divider {
          width: 32px;
          background: #c9a96e;
        }
        .brand-tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 400;
          color: #a09690;
          letter-spacing: 0.03em;
          line-height: 1.5;
          transition: color 0.25s;
        }
        .brand-card:hover .brand-tagline {
          color: #6b6359;
        }

        /* ── Stats Bar ── */
        .stats-section {
          background: #1a1714;
          padding: 36px 0;
          position: relative;
        }
        .stats-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e 50%, transparent);
        }
        .stats-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 0 24px;
          position: relative;
        }
        .stat-item + .stat-item::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          height: 36px;
          width: 1px;
          background: rgba(255,255,255,0.10);
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.1rem;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-num sup {
          font-size: 1rem;
          font-weight: 500;
          vertical-align: super;
          color: #c9a96e;
        }
        .stat-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .brands-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .brands-inner, .stats-inner { padding: 0 16px; }
          .brands-grid { grid-template-columns: repeat(2, 1fr); }
          .brands-title { font-size: 1.8rem; }
          .stat-num { font-size: 1.6rem; }
          .brands-section { padding: 48px 0 44px; }
        }
      `}</style>

      {/* Brands */}
      <section className="brands-section">
        <div className="brands-inner">
          <div className="brands-header">
            <span className="brands-eyebrow">Curated Partners</span>
            <div className="brands-gold-line" />
            <h2 className="brands-title">Our Brands</h2>
            <p className="brands-subtitle">Premium furniture collections, exclusively at OASIS</p>
          </div>

          <div className="brands-grid">
            {brands.map((b, idx) => (
              <div key={b.name} className="brand-card">
                <span className="brand-number">0{idx + 1}</span>
                <span className="brand-name">{b.name}</span>
                <div className="brand-divider" />
                <span className="brand-tagline">{b.tagline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-inner">
          {[
            { num: '15', sup: '+', label: 'Years in Business' },
            { num: '1,20,000', sup: '+', label: 'Happy Customers' },
            { num: '4', sup: '',  label: 'Showrooms in Odisha' },
            { num: '500', sup: '+', label: 'Curated Products' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.num}<sup>{s.sup}</sup></span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}