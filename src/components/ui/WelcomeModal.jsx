import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    const autoClose = setTimeout(() => {
      setClosing(true);
      setTimeout(() => setVisible(false), 900);
    }, 4300);
    return () => { clearTimeout(timer); clearTimeout(autoClose); };
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 900);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes wm-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wm-everything-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.15); }
        }
        @keyframes wm-card-in {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wm-line-grow {
          from { width: 0; }
          to   { width: 72px; }
        }
        @keyframes wm-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .wm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 8, 6, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: wm-backdrop-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
          transform-origin: center center;
        }
        .wm-backdrop.closing {
          animation: wm-everything-out 0.85s cubic-bezier(0.22,0.1,0.36,1) forwards;
        }

        .wm-card {
          position: relative;
          background: #fdf8f0;
          max-width: 500px;
          width: 100%;
          padding: 0;
          overflow: hidden;
          animation: wm-card-in 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .wm-top-bar {
          height: 4px;
          background: linear-gradient(90deg, #c9a96e, #e8c98a, #c9a96e);
          background-size: 200% auto;
          animation: wm-shimmer 2.5s linear infinite;
        }
        .wm-body {
          padding: 44px 48px 40px;
          text-align: center;
        }
        .wm-leaf {
          width: 110px;
          height: auto;
          margin: 0 auto 20px;
        }
        .wm-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0 0 14px 0;
        }
        .wm-line {
          display: block;
          height: 1px;
          background: #c9a96e;
          width: 0;
          margin: 0 auto 20px;
          animation: wm-line-grow 0.8s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
        }
        .wm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #1a1714;
          line-height: 1.12;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }
        .wm-title span { color: #c9a96e; }
        .wm-tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #6b6460;
          line-height: 1.75;
          margin: 0 0 32px 0;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }
        .wm-badges {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .wm-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .wm-badge-icon { font-size: 1.3rem; }
        .wm-badge-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.60rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a8278;
        }
        .wm-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1a1714;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.70rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 40px;
          border: none;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
          width: 100%;
          justify-content: center;
        }
        .wm-btn:hover {
          background: #c9a96e;
          transform: translateY(-1px);
        }
        .wm-skip {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          color: #aba49a;
          margin-top: 14px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
        }
        .wm-skip:hover { color: #6b6460; }
        .wm-close {
          position: absolute;
          top: 14px; right: 16px;
          width: 30px; height: 30px;
          background: none; border: none; cursor: pointer;
          color: #aba49a; font-size: 1.2rem;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .wm-close:hover { color: #1a1714; }
        @media (max-width: 520px) {
          .wm-body { padding: 36px 28px 32px; }
          .wm-title { font-size: 1.9rem; }
        }
      `}</style>

      <div className={`wm-backdrop${closing ? ' closing' : ''}`} onClick={close}>
        <div className="wm-card" onClick={e => e.stopPropagation()}>
          <div className="wm-top-bar" />
          <button className="wm-close" onClick={close}>✕</button>
          <div className="wm-body">
            <div className="wm-leaf">
              <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            <p className="wm-eyebrow">Est. 2018 · Handcrafted Luxury</p>
            <span className="wm-line" />
            <h2 className="wm-title">Welcome to<br /><span>OASIS</span> Furniture</h2>
            <p className="wm-tagline">Where craftsmanship meets contemporary living. Explore our curated collection of teak, walnut & solid wood furniture — designed for the modern Indian home.</p>

            <div className="wm-badges">
              <div className="wm-badge"><span className="wm-badge-icon">🪵</span><span className="wm-badge-text">Solid Wood</span></div>
              {/* <div className="wm-badge"><span className="wm-badge-icon">🚚</span><span className="wm-badge-text">Free Delivery</span></div> */}
              <div className="wm-badge"><span className="wm-badge-icon">✦</span><span className="wm-badge-text">5-Year Warranty</span></div>
              <div className="wm-badge"><span className="wm-badge-icon">🌿</span><span className="wm-badge-text">Sustainable</span></div>
            </div>

            <button className="wm-btn" onClick={close}>
              Explore the Collection →
            </button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="wm-skip" onClick={close}>Skip for now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}