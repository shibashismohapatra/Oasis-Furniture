import logoImg from '../../assets/logo.png';
import { Camera, Rss, MessageCircle } from 'lucide-react';

const Footer = () => (
  <>
    <style>{`
      .ft-root {
        background: #1a1714;
        color: #fff;
        padding: 56px 0 0;
        font-family: 'Jost', sans-serif;
      }
      .ft-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 40px;
      }
      .ft-grid {
        display: grid;
        grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
        gap: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .ft-brand-box {
        display: flex; align-items: center; gap: 22px;
        margin-bottom: 16px;
      }
      .ft-logo-wrap {
        background: #fff;
        border-radius: 6px;
        padding: 6px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .ft-logo-img {
        height: 44px; width: auto;
        object-fit: contain;
        display: block;
      }
      .ft-logo-text {
        border-left: 1.5px solid rgba(255,255,255,0.15);
        padding-left: 12px;
      }
      .ft-logo-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        display: block;
        line-height: 1.1;
      }
      .ft-logo-sub {
        font-size: 0.46rem;
        font-weight: 500;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        display: block;
      }
      .ft-tagline {
        font-size: 0.78rem;
        color: rgba(255,255,255,0.45);
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .ft-social {
        display: flex; gap: 10px; margin-bottom: 24px;
      }
      .ft-soc-btn {
        width: 34px; height: 34px;
        border: 1px solid rgba(255,255,255,0.18);
        background: none; color: rgba(255,255,255,0.5);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
      }
      .ft-soc-btn:hover { border-color: #c9a96e; color: #c9a96e; }
      .ft-showrooms-label {
        font-size: 0.60rem; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        margin-bottom: 6px;
      }
      .ft-showrooms-list {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.5);
        line-height: 1.8;
      }
      .ft-col-title {
        font-size: 0.62rem; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        margin: 0 0 16px 0;
      }
      .ft-links { list-style: none; padding: 0; margin: 0; }
      .ft-links li + li { margin-top: 10px; }
      .ft-links a {
        font-size: 0.78rem;
        color: rgba(255,255,255,0.55);
        text-decoration: none;
        transition: color 0.18s;
        letter-spacing: 0.01em;
        cursor: pointer;
      }
      .ft-links a:hover { color: rgba(255,255,255,0.9); }
      .ft-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 0 24px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .ft-copy {
        font-size: 0.70rem;
        color: rgba(255,255,255,0.28);
        letter-spacing: 0.02em;
      }
      .ft-bottom-links {
        display: flex; gap: 20px;
      }
      .ft-bottom-links a {
        font-size: 0.70rem;
        color: rgba(255,255,255,0.28);
        text-decoration: none;
        transition: color 0.18s;
        cursor: pointer;
      }
      .ft-bottom-links a:hover { color: rgba(255,255,255,0.6); }
      @media (max-width: 900px) {
        .ft-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 580px) {
        .ft-inner { padding: 0 16px; }
        .ft-grid { grid-template-columns: 1fr; gap: 28px; }
        .ft-bottom { flex-direction: column; align-items: flex-start; }
      }
    `}</style>

    <footer className="ft-root">
      <div className="ft-inner">
        <div className="ft-grid">
          {/* Brand — actual logo */}
          <div>
            <div className="ft-brand-box">
              <div className="ft-logo-wrap">
                <img src={logoImg} alt="OASIS Furniture" className="ft-logo-img" />
              </div>
              <div className="ft-logo-text">
                <span className="ft-logo-name">OASIS Furniture</span>
                <span className="ft-logo-sub">and Furnishing</span>
              </div>
            </div>
            <p className="ft-tagline">Premium home furniture crafted for modern Indian living. Delivered across Odisha and beyond.</p>
            <div className="ft-social">
              {[Camera, Rss, MessageCircle].map((Icon, i) => (
                <button key={i} className="ft-soc-btn" aria-label="social"><Icon size={13} /></button>
              ))}
            </div>
            <p className="ft-showrooms-label">Showrooms</p>
            <p className="ft-showrooms-list">Bhubaneswar · Cuttack · Puri · Sambalpur</p>
          </div>

          {/* About */}
          <div>
            <h4 className="ft-col-title">About Us</h4>
            <ul className="ft-links">
              {['Our Story', 'The Team', 'Careers', 'Sustainability', 'Press'].map(l => (
                <li key={l}><a onClick={e => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="ft-col-title">Help &amp; Support</h4>
            <ul className="ft-links">
              {['Contact Us', 'Help Centre', 'Track My Order', 'Shipping & Delivery', 'Returns & Refunds'].map(l => (
                <li key={l}><a onClick={e => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="ft-col-title">Our Services</h4>
            <ul className="ft-links">
              {['Showrooms', 'Design Consultations', 'Trade & Commercial', 'Order Fabric Swatches'].map(l => (
                <li key={l}><a onClick={e => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-copy">© Fidelsya Technologies Pvt. Ltd.  All Rights Reserved.</p>
          <div className="ft-bottom-links">
            <a onClick={e => e.preventDefault()}>Privacy Policy</a>
            <a onClick={e => e.preventDefault()}>Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;