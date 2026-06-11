import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function ShowroomCTA({ onNavigate }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', style: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const showroomImages = [
    { src: '/showroom1.jpg', label: 'Showroom — Bhubaneswar' },
    { src: '/showroom2.jpg', label: 'Showroom — Interior Branch' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % showroomImages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleVisitUs = () => {
    if (onNavigate) onNavigate('page', 'new-arrivals', 'New Arrivals');
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setShowForm(false);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', time: '', style: '', notes: '' }); }, 400);
  };

  return (
    <>
      <style>{`
        .shcta-section { background: #fff; padding: 0; }
        .shcta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 40px;
          gap: 20px;
        }
        .shcta-card {
          position: relative;
          overflow: hidden;
          min-height: 420px;
          cursor: pointer;
        }

        /* ── Showroom Slider ── */
        .shcta-slider {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .shcta-slide {
          position: absolute; inset: 0;
          transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
          transform: scale(1.04);
        }
        .shcta-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }
        .shcta-slide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Floating label badge per slide */
        .shcta-slide-badge {
          position: absolute;
          top: 16px; right: 16px;
          background: rgba(201,169,110,0.92);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 12px;
          z-index: 2;
          backdrop-filter: blur(4px);
          animation: badgePop 0.5s cubic-bezier(0.22,1,.36,1);
        }
        @keyframes badgePop {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Dot indicators */
        .shcta-dots {
          position: absolute;
          bottom: 80px; left: 28px;
          display: flex; gap: 7px;
          z-index: 3;
        }
        .shcta-dot {
          width: 22px; height: 3px;
          background: rgba(255,255,255,0.35);
          border: none; cursor: pointer;
          padding: 0; transition: background 0.3s, width 0.3s;
        }
        .shcta-dot.active {
          background: #c9a96e;
          width: 36px;
        }

        /* Floating thumbnail strip */
        .shcta-thumbs {
          position: absolute;
          bottom: 90px; right: 16px;
          display: flex; flex-direction: column; gap: 6px;
          z-index: 3;
        }
        .shcta-thumb {
          width: 44px; height: 32px;
          object-fit: cover;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.25s, transform 0.25s;
          opacity: 0.65;
        }
        .shcta-thumb.active {
          border-color: #c9a96e;
          opacity: 1;
          transform: scale(1.06);
        }

        /* Booking card bg */
        .shcta-book-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #1a1714 0%, #2c2520 40%, #3a2e28 70%, #1a1714 100%);
          overflow: hidden;
        }
        .shcta-book-bg svg {
          width: 100%; height: 100%;
          position: absolute; inset: 0;
        }

        /* Floating "Book Now" pulse badge - remove, now in SVG */

        .shcta-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.1) 45%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          z-index: 2;
        }
        .shcta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 6px 0;
          line-height: 1.15;
        }
        .shcta-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.72);
          margin: 0 0 18px 0;
          line-height: 1.6;
          max-width: 280px;
        }
        .shcta-btn {
          display: inline-flex;
          align-items: center;
          background: #fff;
          color: #1a1714;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 11px 22px;
          border: none;
          cursor: pointer;
          width: fit-content;
          transition: background 0.22s, color 0.22s;
        }
        .shcta-btn:hover { background: #c9a96e; color: #fff; }

        /* Modal */
        .dc-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,8,6,0.72);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: dcFadeIn 0.22s ease;
          overflow-y: auto;
        }
        @keyframes dcFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dc-modal {
          background: #fff;
          max-width: 520px; width: 100%;
          position: relative;
          animation: dcSlideUp 0.3s cubic-bezier(.22,1,.36,1);
          margin: auto;
        }
        @keyframes dcSlideUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        .dc-modal-header {
          background: #1a1714;
          padding: 28px 32px 22px;
          position: relative;
        }
        .dc-modal-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #c9a96e; margin: 0 0 8px;
        }
        .dc-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-weight: 600;
          color: #fff; margin: 0 0 6px;
          line-height: 1.15;
        }
        .dc-modal-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.74rem;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }
        .dc-close {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.08); border: none;
          color: rgba(255,255,255,0.6); cursor: pointer;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; border-radius: 2px;
        }
        .dc-close:hover { background: rgba(255,255,255,0.18); color: #fff; }
        .dc-body { padding: 28px 32px 32px; }
        .dc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .dc-field { display: flex; flex-direction: column; }
        .dc-field.full { grid-column: 1 / -1; }
        .dc-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.60rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #8a8278; margin-bottom: 6px;
        }
        .dc-input, .dc-select, .dc-textarea {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem; color: #1a1714;
          border: 1px solid #e8d5b0;
          background: #faf8f5;
          padding: 10px 13px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .dc-input:focus, .dc-select:focus, .dc-textarea:focus { border-color: #c9a96e; background: #fff; }
        .dc-textarea { resize: none; height: 80px; }
        .dc-select { appearance: none; cursor: pointer; }
        .dc-submit {
          width: 100%; margin-top: 20px;
          background: #1a1714; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.74rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 15px; border: none; cursor: pointer;
          transition: background 0.22s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .dc-submit:hover { background: #c9a96e; }
        .dc-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .dc-privacy {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; color: #aaa;
          text-align: center; margin-top: 10px;
        }
        .dc-thankyou {
          padding: 48px 32px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
        }
        .dc-ty-icon {
          width: 64px; height: 64px;
          background: #f0faf0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .dc-ty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 600;
          color: #1a1714; margin: 0 0 12px;
        }
        .dc-ty-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem; color: #6b6359;
          line-height: 1.7; margin: 0 0 6px;
          max-width: 340px;
        }
        .dc-ty-detail {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem; color: #c9a96e;
          font-weight: 600; letter-spacing: 0.06em;
          margin: 0 0 28px;
        }
        .dc-ty-close {
          background: #1a1714; color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.70rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 13px 32px; border: none; cursor: pointer;
          transition: background 0.22s;
        }
        .dc-ty-close:hover { background: #c9a96e; }
        .dc-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .shcta-grid { grid-template-columns: 1fr; padding: 32px 16px; }
          .shcta-card { min-height: 320px; }
          .dc-grid { grid-template-columns: 1fr; }
          .dc-modal-header { padding: 24px 20px 18px; }
          .dc-body { padding: 20px 20px 24px; }
          .shcta-thumbs { display: none; }
        }
      `}</style>

      <section className="shcta-section">
        <div className="shcta-grid">

          {/* ── Card 1: Showroom with floating slider ── */}
          <div className="shcta-card" onClick={handleVisitUs}>
            <div className="shcta-slider">
              {showroomImages.map((img, i) => (
                <div key={i} className={`shcta-slide${activeSlide === i ? ' active' : ''}`}>
                  <img src={img.src} alt={img.label} />
                  {activeSlide === i && (
                    <span className="shcta-slide-badge">{img.label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Floating dot indicators */}
            <div className="shcta-dots" onClick={e => e.stopPropagation()}>
              {showroomImages.map((_, i) => (
                <button key={i} className={`shcta-dot${activeSlide === i ? ' active' : ''}`} onClick={() => setActiveSlide(i)} />
              ))}
            </div>

            {/* Floating thumbnail strip */}
            <div className="shcta-thumbs" onClick={e => e.stopPropagation()}>
              {showroomImages.map((img, i) => (
                <img key={i} src={img.src} alt="" className={`shcta-thumb${activeSlide === i ? ' active' : ''}`} onClick={() => setActiveSlide(i)} />
              ))}
            </div>

            <div className="shcta-overlay">
              <h3 className="shcta-title">Our Showrooms</h3>
              <p className="shcta-sub">Visit our showrooms across Odisha and experience our entire collection in person. Our in-store design consultants are here to help.</p>
              <button className="shcta-btn" onClick={handleVisitUs}>Visit Us</button>
            </div>
          </div>

          {/* ── Card 2: Book a Design Consult ── */}
          <div className="shcta-card" onClick={() => setShowForm(true)}>
            {/* Booking-themed illustrated background */}
            <div className="shcta-book-bg">
              <svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                {/* Subtle grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,169,110,0.07)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="600" height="480" fill="url(#grid)" />

                {/* Large calendar illustration — centered, upper area */}
                {/* Calendar shadow */}
                <rect x="158" y="92" width="294" height="236" rx="4" fill="rgba(0,0,0,0.4)" />
                {/* Calendar body */}
                <rect x="152" y="86" width="294" height="236" rx="4" fill="#2a2320" stroke="rgba(201,169,110,0.3)" strokeWidth="1" />
                {/* Calendar header */}
                <rect x="152" y="86" width="294" height="52" rx="4" fill="#c9a96e" />
                <rect x="152" y="114" width="294" height="24" fill="#c9a96e" />
                {/* Month label */}
                <text x="299" y="116" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="18" fontWeight="700" fill="#1a1714">JUNE 2025</text>
                {/* Ring holes */}
                {[200, 250, 300, 350, 400].map((x, i) => (
                  <circle key={i} cx={x} cy="88" r="7" fill="#1a1714" />
                ))}
                {/* Day headers */}
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <text key={i} x={174 + i * 40} y="158" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="9" fontWeight="700" letterSpacing="1" fill="rgba(201,169,110,0.7)">{d}</text>
                ))}
                {/* Day grid — 5 rows */}
                {[
                  [null,null,null,null,null,null,1],
                  [2,3,4,5,6,7,8],
                  [9,10,11,12,13,14,15],
                  [16,17,18,19,20,21,22],
                  [23,24,25,26,27,28,29],
                ].map((week, wi) =>
                  week.map((day, di) => day ? (
                    <g key={`${wi}-${di}`}>
                      {/* Highlight day 14 as "booked" */}
                      {day === 14 && <rect x={154 + di * 40} y={168 + wi * 32} width="36" height="28" rx="3" fill="#c9a96e" opacity="0.9" />}
                      {/* Highlight days 18,19 lightly */}
                      {(day === 18 || day === 19) && <rect x={154 + di * 40} y={168 + wi * 32} width="36" height="28" rx="3" fill="rgba(201,169,110,0.2)" />}
                      <text
                        x={172 + di * 40} y={186 + wi * 32}
                        textAnchor="middle"
                        fontFamily="Jost, sans-serif"
                        fontSize="11"
                        fontWeight={day === 14 ? "700" : "400"}
                        fill={day === 14 ? "#1a1714" : "rgba(255,255,255,0.65)"}
                      >{day}</text>
                      {/* Dot marker for day 14 */}
                      {day === 14 && <circle cx={172 + di * 40} cy={190 + wi * 32} r="2.5" fill="#1a1714" />}
                    </g>
                  ) : null)
                )}

                {/* Floating appointment card */}
                <rect x="310" y="270" width="180" height="72" rx="4" fill="rgba(201,169,110,0.12)" stroke="rgba(201,169,110,0.4)" strokeWidth="1" />
                <rect x="310" y="270" width="5" height="72" rx="2" fill="#c9a96e" />
                <text x="326" y="288" fontFamily="Jost, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="1.5" fill="#c9a96e">APPOINTMENT</text>
                <text x="326" y="304" fontFamily="Cormorant Garamond, serif" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.9)">Design Consultation</text>
                <text x="326" y="318" fontFamily="Jost, sans-serif" fontSize="9" fill="rgba(255,255,255,0.5)">10:00 AM – 11:00 AM</text>
                <text x="326" y="332" fontFamily="Jost, sans-serif" fontSize="9" fill="rgba(255,255,255,0.4)">With Senior Interior Designer</text>

                {/* Small clock icon area */}
                <circle cx="175" cy="305" r="28" fill="rgba(201,169,110,0.08)" stroke="rgba(201,169,110,0.2)" strokeWidth="1" />
                <circle cx="175" cy="305" r="20" fill="none" stroke="rgba(201,169,110,0.35)" strokeWidth="1.2" />
                {/* Clock hands */}
                <line x1="175" y1="305" x2="175" y2="291" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="175" y1="305" x2="184" y2="310" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="175" cy="305" r="2" fill="#c9a96e" />
                <text x="175" y="345" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="7" letterSpacing="1" fill="rgba(201,169,110,0.55)">YOUR TIME</text>

                {/* Decorative corner ornament top-right */}
                <circle cx="530" cy="60" r="80" fill="rgba(201,169,110,0.04)" />
                <circle cx="530" cy="60" r="55" fill="rgba(201,169,110,0.04)" />
                {/* Decorative bottom-left */}
                <circle cx="60" cy="420" r="90" fill="rgba(201,169,110,0.03)" />

                {/* "FREE" ribbon badge */}
                <rect x="460" y="36" width="110" height="32" rx="2" fill="#c9a96e" />
                <text x="515" y="56" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="9" fontWeight="700" letterSpacing="2" fill="#1a1714">FREE SERVICE</text>
              </svg>
            </div>
            <div className="shcta-overlay">
              <h3 className="shcta-title">Book a Design Consult</h3>
              <p className="shcta-sub">Sit with one of our professional interior designers to get a personalised design proposal tailored to your space and style.</p>
              <button className="shcta-btn" onClick={(e) => { e.stopPropagation(); setShowForm(true); }}>Book Now</button>
            </div>
          </div>

        </div>
      </section>

      {/* Design Consult Modal */}
      {showForm && (
        <div className="dc-overlay" onClick={handleClose}>
          <div className="dc-modal" onClick={e => e.stopPropagation()}>
            {!submitted ? (
              <>
                <div className="dc-modal-header">
                  <button className="dc-close" onClick={handleClose}><X size={16} /></button>
                  <p className="dc-modal-eyebrow">Complimentary Service</p>
                  <h2 className="dc-modal-title">Book a Design Consult</h2>
                  <p className="dc-modal-sub">Our interior designers will craft a personalised proposal for your space — at no cost to you.</p>
                </div>
                <div className="dc-body">
                  <form onSubmit={handleSubmit}>
                    <div className="dc-grid">
                      <div className="dc-field">
                        <label className="dc-label">Full Name *</label>
                        <input className="dc-input" name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required />
                      </div>
                      <div className="dc-field">
                        <label className="dc-label">Phone Number *</label>
                        <input className="dc-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                      </div>
                      <div className="dc-field full">
                        <label className="dc-label">Email Address *</label>
                        <input className="dc-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="priya@example.com" required />
                      </div>
                      <div className="dc-field">
                        <label className="dc-label">Preferred Date *</label>
                        <input className="dc-input" type="date" name="date" value={form.date} onChange={handleChange} required />
                      </div>
                      <div className="dc-field">
                        <label className="dc-label">Preferred Time *</label>
                        <select className="dc-select" name="time" value={form.time} onChange={handleChange} required>
                          <option value="">Select a time</option>
                          <option>10:00 AM – 11:00 AM</option>
                          <option>11:00 AM – 12:00 PM</option>
                          <option>12:00 PM – 1:00 PM</option>
                          <option>2:00 PM – 3:00 PM</option>
                          <option>3:00 PM – 4:00 PM</option>
                          <option>4:00 PM – 5:00 PM</option>
                        </select>
                      </div>
                      <div className="dc-field full">
                        <label className="dc-label">Interior Style Preference</label>
                        <select className="dc-select" name="style" value={form.style} onChange={handleChange}>
                          <option value="">Select a style (optional)</option>
                          <option>Modern Minimal</option>
                          <option>Classic / Traditional</option>
                          <option>Scandinavian</option>
                          <option>Industrial Chic</option>
                          <option>Bohemian / Eclectic</option>
                          <option>Luxury Contemporary</option>
                          <option>Not sure yet</option>
                        </select>
                      </div>
                      <div className="dc-field full">
                        <label className="dc-label">Tell Us About Your Space</label>
                        <textarea className="dc-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="e.g. 2BHK in Bhubaneswar, looking to furnish living room and master bedroom..." />
                      </div>
                    </div>
                    <button className="dc-submit" type="submit" disabled={loading}>
                      {loading ? <><span className="dc-spinner" /> Processing...</> : 'Confirm My Consultation'}
                    </button>
                    <p className="dc-privacy">🔒 Your details are safe with us. No spam, ever.</p>
                  </form>
                </div>
              </>
            ) : (
              <div className="dc-thankyou">
                <button className="dc-close" style={{ position: 'absolute', top: 16, right: 16, background: '#f5f0e8', color: '#1a1714' }} onClick={handleClose}><X size={16} /></button>
                <div className="dc-ty-icon">
                  <CheckCircle size={30} color="#4CAF50" />
                </div>
                <h2 className="dc-ty-title">Consultation Booked!</h2>
                <p className="dc-ty-sub">Thank you, <strong>{form.name}</strong>. Your design consultation has been successfully scheduled with our team.</p>
                <p className="dc-ty-detail">📅 {form.date} &nbsp;·&nbsp; 🕐 {form.time}</p>
                <p className="dc-ty-sub" style={{ marginBottom: '24px' }}>One of our senior interior designers will call you at <strong>{form.phone}</strong> to confirm and discuss your requirements in detail. We look forward to transforming your space!</p>
                <button className="dc-ty-close" onClick={handleClose}>Back to Browsing</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}