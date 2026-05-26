import { ArrowRight } from 'lucide-react';
import { circleCategories, roomCategories } from '../../data/products';

export default function Categories({ onNavigate }) {
  return (
    <>
      <style>{`
        .ebc-section {
          background: #ffffff;
          padding: 64px 0 56px;
        }
        .ebc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .ebc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800;
          color: #1a1714;
          text-align: center;
          margin: 0 0 44px 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .ebc-grid {
          display: flex;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .ebc-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
          border: none;
          background: none;
          padding: 0;
        }
        .ebc-circle {
          width: 116px;
          height: 116px;
          border-radius: 50%;
          overflow: hidden;
          border: none;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          flex-shrink: 0;
        }
        .ebc-item:hover .ebc-circle {
          transform: scale(1.05);
          box-shadow: 0 8px 28px rgba(0,0,0,0.14);
        }
        .ebc-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ebc-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #1a1714;
          letter-spacing: 0.04em;
          text-align: center;
          line-height: 1.3;
          text-transform: uppercase;
        }

        /* SHOP BY ROOM */
        .sbr-section {
          background: #f5f0e8;
          padding: 64px 0 72px;
        }
        .sbr-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .sbr-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800;
          color: #1a1714;
          text-align: center;
          margin: 0 0 36px 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .sbr-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .sbr-grid { grid-template-columns: repeat(2, 1fr); }
          .ebc-circle { width: 90px; height: 90px; }
          .ebc-grid { gap: 12px; }
        }
        @media (max-width: 580px) {
          .sbr-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ebc-grid { gap: 8px; }
          .ebc-circle { width: 76px; height: 76px; }
          .ebc-inner, .sbr-inner { padding: 0 16px; }
        }
        .sbr-card {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          cursor: pointer;
          display: block;
          text-decoration: none;
          border: none;
          background: none;
          padding: 0;
        }
        .sbr-card-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
          transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .sbr-card:hover .sbr-card-img { transform: scale(1.06); }
        .sbr-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.20) 45%, rgba(10,8,6,0.0) 100%);
        }
        .sbr-card-body {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 20px 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .sbr-card-name {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 3px 0;
          letter-spacing: 0.04em;
          line-height: 1.2;
          text-transform: uppercase;
        }
        .sbr-card-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          letter-spacing: 0.02em;
          margin: 0;
        }
        .sbr-card-arrow {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.55);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
          transition: background 0.25s, border-color 0.25s;
        }
        .sbr-card:hover .sbr-card-arrow { background: rgba(255,255,255,0.15); border-color: #fff; }
      `}</style>

      <section className="ebc-section">
        <div className="ebc-inner">
          <h2 className="ebc-title">Explore by Category</h2>
          <div className="ebc-grid">
            {circleCategories.map(cat => (
              <button
                key={cat.id}
                className="ebc-item"
                onClick={() => onNavigate && onNavigate('category', cat.slug, cat.name)}
                aria-label={cat.name}
              >
                <div className="ebc-circle">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <span className="ebc-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sbr-section">
        <div className="sbr-inner">
          <h2 className="sbr-title">Shop by Room</h2>
          <div className="sbr-grid">
            {roomCategories.map(cat => (
              <button
                key={cat.id}
                className="sbr-card"
                onClick={() => onNavigate && onNavigate('room', cat.slug, cat.name)}
                aria-label={cat.name}
              >
                <img className="sbr-card-img" src={cat.image} alt={cat.name} loading="lazy" />
                <div className="sbr-card-overlay" />
                <div className="sbr-card-body">
                  <div>
                    <p className="sbr-card-name">{cat.name}</p>
                    <p className="sbr-card-count">{cat.count}</p>
                  </div>
                  <div className="sbr-card-arrow">
                    <ArrowRight size={14} strokeWidth={2} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}