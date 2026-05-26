import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=1920&q=90',
    align: 'right',
    label: 'Luxury Living Collection',
    heading: 'Timeless\nLuxury Living',
    sub: 'Elevate your home with elegant design —\ncrafted for those who appreciate the finest details.',
    buttons: [{ text: 'Explore Collection', style: 'dark' }],
  },
  {
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1920&q=90',
    align: 'right',
    label: 'Style & Save Event',
    heading: 'Up to 30% Off on\nDining Collections',
    sub: 'Elevate your dining space with our award-winning Kaveri\nand Nanda teak dining series.',
    buttons: [{ text: 'Shop the Sale', style: 'dark' }],
  },
  {
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=90',
    align: 'left',
    label: 'New Season Collection',
    heading: 'Bring Warmth Into\nEvery Room',
    sub: 'Handcrafted furniture in solid teak, walnut and\nengineered wood — designed for the modern Indian home.',
    buttons: [
      { text: 'Shop New Arrivals', style: 'dark' },
      { text: 'View Lookbook', style: 'outline' },
    ],
  },
 
];

const DURATION = 5500;
const TRANS_MS = 1200; // slower = smoother crossfade

export default function Hero() {
  const [cur,     setCur]     = useState(0);
  const [prev,    setPrev]    = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [busy,    setBusy]    = useState(false);
  const [prog,    setProg]    = useState(0);
  const [py,      setPy]      = useState(0);
  const timerRef   = useRef(null);
  const sectionRef = useRef(null);

  /* Parallax */
  useEffect(() => {
    const fn = () => {
      if (!sectionRef.current) return;
      const top = sectionRef.current.getBoundingClientRect().top;
      setPy(Math.max(-50, Math.min(50, -top * 0.08)));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Navigate — pure crossfade, no jerk */
  const goTo = useCallback((idx) => {
    if (busy) return;
    setBusy(true);
    setPrev(cur);
    setCur(idx);
    setAnimKey(k => k + 1);
    setProg(0);
    // prev stays visible until fade fully done
    setTimeout(() => {
      setPrev(null);
      setBusy(false);
    }, TRANS_MS + 100);
  }, [busy, cur]);

  const nextSlide = useCallback(() => goTo((cur + 1) % slides.length), [cur, goTo]);

  /* Autoplay */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, DURATION);
  }, [nextSlide]);

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, DURATION);
    return () => clearInterval(timerRef.current);
  }, [nextSlide]);

  /* Progress bar */
  useEffect(() => {
    setProg(0);
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(((Date.now() - t0) / DURATION) * 100, 100);
      setProg(p);
      if (p >= 100) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [cur]);

  const slide   = slides[cur];
  const isRight = slide.align === 'right';

  const grad = (align, idx) => {
    return align === 'right'
      ? 'linear-gradient(to left, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 35%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.0) 100%)'
      : 'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 35%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.0) 100%)';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .hr-root {
          position: relative;
          width: 100%;
          height: calc(100vh - 72px);
          min-height: 520px;
          overflow: hidden;
          background: #0a0806;
        }

        /* ── BG layers — all stacked, z controlled ── */
        .hr-bg {
          position: absolute;
          inset: 0;
          will-change: opacity;
        }
        .hr-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          will-change: transform;
          display: block;
        }
        .hr-bg-overlay {
          position: absolute;
          inset: 0;
        }

        /* OUTGOING: stays fully visible, then fades out */
        .hr-exit {
          animation: hrFadeOut ${TRANS_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* INCOMING: starts invisible, fades in — slightly delayed so no black flash */
        .hr-enter {
          animation: hrFadeIn ${TRANS_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hr-enter img {
          animation: hrZoomIn ${TRANS_MS + 3000}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes hrFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes hrFadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes hrZoomIn {
          from { transform: scale(1.05) translateY(0px); }
          to   { transform: scale(1.00) translateY(0px); }
        }

        /* ── Text content ── */
        .hr-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 10;
        }
        .hr-inner {
          pointer-events: all;
          max-width: 580px;
          width: 100%;
        }

        /* Stagger fade-up for text */
        .hcf {
          opacity: 0;
          animation: hrCfUp 0.70s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes hrCfUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hcf-1 { animation-delay: 0.12s; }
        .hcf-2 { animation-delay: 0.26s; }
        .hcf-3 { animation-delay: 0.40s; }
        .hcf-4 { animation-delay: 0.55s; }
        .hcf-5 { animation-delay: 0.68s; }

        .hr-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.68);
          margin: 0 0 16px 0;
        }

        .hr-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(3rem, 5.8vw, 5.6rem);
          line-height: 1.00;
          letter-spacing: -0.01em;
          color: #ffffff;
          white-space: pre-line;
          margin: 0;
          text-shadow: 0 4px 32px rgba(0,0,0,0.30);
        }

        .hr-divider {
          display: block;
          width: 52px;
          height: 2px;
          background: #c9a96e;
          margin: 20px 0;
          border-radius: 1px;
        }
        .hr-right .hr-divider { margin-left: auto; }

        .hr-sub {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.83rem, 1.05vw, 0.97rem);
          font-weight: 400;
          line-height: 1.82;
          color: rgba(255,255,255,0.72);
          margin: 0;
          white-space: pre-line;
        }

        .hr-btns {
          display: flex;
          flex-direction: row;
          gap: 12px;
          flex-wrap: nowrap;
          margin-top: 32px;
        }

        .hr-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1c1814;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.70rem;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          padding: 15px 30px;
          border: none;
          cursor: pointer;
          transition: background 0.28s ease, transform 0.2s;
          white-space: nowrap;
        }
        .hr-btn-dark:hover { background: #c9a96e; transform: translateY(-2px); }

        .hr-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.70rem;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          padding: 14px 30px;
          border: 1.5px solid rgba(255,255,255,0.60);
          cursor: pointer;
          transition: background 0.28s ease, border-color 0.28s ease;
          white-space: nowrap;
        }
        .hr-btn-outline:hover {
          background: rgba(255,255,255,0.12);
          border-color: #fff;
        }

        /* ── Progress dots ── */
        .hr-dots {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .hr-dot {
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.25);
          cursor: pointer;
          overflow: hidden;
          position: relative;
          transition: width 0.40s cubic-bezier(0.22,1,0.36,1);
        }
        .hr-dot.act { background: rgba(255,255,255,0.18); }
        .hr-dot-fill {
          position: absolute;
          left: 0; top: 0;
          height: 100%;
          background: #c9a96e;
          border-radius: 2px;
        }
      `}</style>

      <section ref={sectionRef} className="hr-root" id="home">

        {/* ── OUTGOING slide (stays on top, fades out) ── */}
        {prev !== null && (
          <div key={`exit-${prev}`} className="hr-bg hr-exit" style={{ zIndex: 3 }}>
            <img
              src={slides[prev].image}
              alt=""
              style={{ transform: `scale(1.01) translateY(${py * 0.4}px)` }}
            />
            <div className="hr-bg-overlay" style={{ background: grad(slides[prev].align, prev) }} />
          </div>
        )}

        {/* ── INCOMING slide (underneath, already visible before outgoing fades) ── */}
        <div key={`enter-${cur}`} className="hr-bg" style={{ zIndex: 2 }}>
          <img
            src={slide.image}
            alt="hero"
            style={{
              transform: `translateY(${py}px)`,
              transition: 'transform 0.05s linear',
            }}
          />
          <div className="hr-bg-overlay" style={{ background: grad(slide.align, cur) }} />
        </div>

        {/* ── Text Content ── */}
        <div
          key={`txt-${animKey}`}
          className="hr-content"
          style={{ display: 'flex' }}
          style={{
            justifyContent: isRight ? 'flex-end' : 'flex-start',
            paddingLeft:  isRight ? '46%' : 'clamp(32px, 8vw, 100px)',
            paddingRight: isRight ? 'clamp(32px, 8vw, 100px)' : '46%',
          }}
        >
          <div className={`hr-inner${isRight ? ' hr-right' : ''}`} style={{ textAlign: isRight ? 'right' : 'left' }}>
            <p className="hr-label hcf hcf-1">{slide.label}</p>
            <h1 className="hr-h1 hcf hcf-2">{slide.heading}</h1>
            <span className="hr-divider hcf hcf-3" />
            <p className="hr-sub hcf hcf-4">{slide.sub}</p>
            <div
              className="hr-btns hcf hcf-5"
              style={{ justifyContent: isRight ? 'flex-end' : 'flex-start' }}
            >
              {slide.buttons.map((btn, i) =>
                btn.style === 'dark'
                  ? <button key={i} className="hr-btn-dark">{btn.text} <ArrowRight size={13} strokeWidth={2} /></button>
                  : <button key={i} className="hr-btn-outline">{btn.text}</button>
              )}
            </div>
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="hr-dots">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`hr-dot${i === cur ? ' act' : ''}`}
              style={{ width: i === cur ? '38px' : '18px' }}
              onClick={() => { goTo(i); resetTimer(); }}
            >
              {i === cur && (
                <div
                  className="hr-dot-fill"
                  style={{ width: `${prog}%`, transition: 'width 0.02s linear' }}
                />
              )}
            </div>
          ))}
        </div>

      </section>
    </>
  );
}