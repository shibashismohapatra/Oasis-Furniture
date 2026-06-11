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
      .ft-payments {
        padding: 20px 0 0;
        border-top: 1px solid rgba(255,255,255,0.06);
        margin-bottom: 0;
      }
      .ft-pay-label {
        font-size: 0.58rem; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: rgba(255,255,255,0.28);
        margin: 0 0 10px 0;
      }
      .ft-pay-icons {
        display: flex; flex-wrap: wrap; gap: 8px;
        align-items: center; margin-bottom: 18px;
      }
      .ft-pay-badge {
        display: flex; align-items: center; justify-content: center;
        border-radius: 4px;
        transition: opacity 0.2s;
        cursor: default;
      }
      .ft-pay-badge:hover { opacity: 0.8; }
      .ft-pay-secure {
        display: flex; align-items: center; gap: 5px;
        background: rgba(76,175,80,0.12);
        border: 1px solid rgba(76,175,80,0.25);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 0.63rem;
        font-family: 'Jost', sans-serif;
        color: #4CAF50;
        font-weight: 600;
        letter-spacing: 0.04em;
      }
      .ft-fidelsya-link {
        color: rgba(255,255,255,0.28);
        text-decoration: none;
        transition: color 0.18s;
        border-bottom: 1px solid rgba(201,169,110,0.3);
      }
      .ft-fidelsya-link:hover { color: #c9a96e; border-bottom-color: #c9a96e; }
      .ft-gstin-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-left: 3px solid rgba(201,169,110,0.5);
        border-radius: 4px;
        width: fit-content;
        margin-bottom: 14px;
      }
      .ft-gstin-label {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.20em;
        text-transform: uppercase;
        color: rgba(201,169,110,0.75);
      }
      .ft-gstin-divider {
        width: 1px; height: 14px;
        background: rgba(255,255,255,0.12);
      }
      .ft-gstin-num {
        font-family: 'Courier New', monospace;
        font-size: 0.76rem;
        font-weight: 600;
        color: rgba(255,255,255,0.5);
        letter-spacing: 0.10em;
      }
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
            <p className="ft-showrooms-list">Bhubaneswar</p>
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

        {/* Payment Methods */}
        <div className="ft-payments">
          <p className="ft-pay-label">Secure Payments Accepted</p>
          <div className="ft-pay-icons">
            {/* Visa */}
            <span className="ft-pay-badge" title="Visa">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <text x="19" y="16" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white" letterSpacing="1">VISA</text>
              </svg>
            </span>
            {/* Mastercard */}
            <span className="ft-pay-badge" title="Mastercard">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#252525"/>
                <circle cx="14" cy="12" r="7" fill="#EB001B"/>
                <circle cx="24" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00"/>
              </svg>
            </span>
            {/* RuPay */}
            <span className="ft-pay-badge" title="RuPay">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#1E3A5F"/>
                <text x="19" y="15" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">RuPay</text>
              </svg>
            </span>
            {/* UPI */}
            <span className="ft-pay-badge" title="UPI">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#097939"/>
                <text x="19" y="15.5" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="white">UPI</text>
              </svg>
            </span>
            {/* Net Banking */}
            <span className="ft-pay-badge" title="Net Banking">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#374151"/>
                <text x="19" y="11" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="5.5" fill="white">NET</text>
                <text x="19" y="18" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="5.5" fill="#c9a96e">BANKING</text>
              </svg>
            </span>
            {/* EMI */}
            <span className="ft-pay-badge" title="EMI Available">
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#7C3AED"/>
                <text x="19" y="11" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="7.5" fill="white">EMI</text>
                <text x="19" y="19" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="5" fill="rgba(255,255,255,0.7)">Available</text>
              </svg>
            </span>
            {/* SSL Secure */}
            <span className="ft-pay-badge ft-pay-secure" title="SSL Secured">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#4CAF50"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SSL Secure</span>
            </span>
          </div>
        </div>

        <div className="ft-bottom">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {/* GSTIN */}
            <div className="ft-gstin-bar">
              <span className="ft-gstin-label">GSTIN</span>
              <span className="ft-gstin-divider" />
              <span className="ft-gstin-num">21AAFF05181P1ZY</span>
            </div>
            <p className="ft-copy">© <a href="https://fidelsya.com" target="_blank" rel="noopener noreferrer" className="ft-fidelsya-link">Fidelsya Technologies Pvt. Ltd.</a> All Rights Reserved.</p>
          </div>
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