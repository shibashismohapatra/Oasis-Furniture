import { testimonials } from '../../data/products';

const renderStars = (rating = 5) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 10 10">
          <polygon
            points="5,0.5 6.2,3.8 9.8,4 7.2,6.2 8,9.8 5,7.8 2,9.8 2.8,6.2 0.2,4 3.8,3.8"
            fill={i < full || (i === full && half) ? '#c9a96e' : '#e0d6c8'}
          />
        </svg>
      ))}
    </span>
  );
};

const Testimonials = () => (
  <>
    <style>{`
      .ts-section {
        background: #f5f0e8;
        padding: 72px 0 80px;
      }
      .ts-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 40px;
      }
      .ts-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 40px;
      }
      .ts-eyebrow {
        font-family: 'Jost', sans-serif;
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        color: #c9a96e;
        margin-bottom: 8px;
      }
      .ts-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2rem, 3vw, 2.7rem);
        font-weight: 800;
        color: #1a1714;
        margin: 0;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }
      .ts-view-all {
        font-family: 'Jost', sans-serif;
        font-size: 0.78rem;
        font-weight: 500;
        color: #1a1714;
        text-decoration: none;
        letter-spacing: 0.03em;
        white-space: nowrap;
        border-bottom: 1px solid #1a1714;
        padding-bottom: 1px;
        background: none;
        border-top: none; border-left: none; border-right: none;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
      }
      .ts-view-all:hover { color: #c9a96e; border-bottom-color: #c9a96e; }

      .ts-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .ts-card {
        background: #fff;
        padding: 22px 22px 18px;
      }
      .ts-stars { margin-bottom: 12px; }
      .ts-text {
        font-family: 'Jost', sans-serif;
        font-size: 0.82rem;
        color: #3d3830;
        line-height: 1.72;
        margin: 0 0 14px 0;
      }
      .ts-author-name {
        font-family: 'Jost', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        color: #1a1714;
        margin: 0;
      }
      .ts-verified {
        font-size: 0.65rem;
        color: #6B8E6B;
        font-weight: 500;
        margin-left: 5px;
        letter-spacing: 0.03em;
      }
      .ts-product {
        font-family: 'Jost', sans-serif;
        font-size: 0.70rem;
        color: #8a8278;
        margin: 2px 0 0 0;
      }
      .ts-time {
        font-family: 'Jost', sans-serif;
        font-size: 0.65rem;
        color: #aba49a;
        margin: 2px 0 0 0;
      }

      @media (max-width: 900px) {
        .ts-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 580px) {
        .ts-inner { padding: 0 16px; }
        .ts-grid { grid-template-columns: 1fr; }
      }
    `}</style>

    <section className="ts-section" id="reviews">
      <div className="ts-inner">
        <div className="ts-header">
          <div>
            <p className="ts-eyebrow">Customer Stories</p>
            <h2 className="ts-title">What Our Customers Say</h2>
          </div>
          <button className="ts-view-all">View All Reviews →</button>
        </div>

        <div className="ts-grid">
          {testimonials.map(t => (
            <div key={t.id} className="ts-card">
              <div className="ts-stars">{renderStars(t.rating)}</div>
              <p className="ts-text">"{t.text}"</p>
              <p className="ts-author-name">
                {t.name}
                {t.verified && <span className="ts-verified">✓ Verified Buyer</span>}
              </p>
              <p className="ts-product">{t.product}</p>
              <p className="ts-time">{t.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Testimonials;