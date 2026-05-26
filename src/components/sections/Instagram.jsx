export default function VideoShowcase() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700;800&family=Jost:wght@300;400;500;600;700&display=swap');

        .ig-section {
          background: #0d0b09;
          padding: 90px 0 100px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background texture */
        .ig-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 119px,
            rgba(201,169,110,0.04) 120px
          );
          pointer-events: none;
        }

        .ig-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 60px);
          position: relative;
          z-index: 1;
        }

        /* ── Section Header ── */
        .ig-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .ig-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0 0 14px 0;
        }

        .ig-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.01em;
          line-height: 1.08;
        }

        .ig-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.42);
          margin: 0;
          line-height: 1.7;
        }

        .ig-divider {
          display: block;
          width: 48px;
          height: 2px;
          background: #c9a96e;
          margin: 18px auto 0;
          border-radius: 1px;
        }

        /* ── Two-video grid ── */
        .ig-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Individual video card */
        .ig-video-card {
          display: flex;
          flex-direction: column;
        }

        /* Tag + line above heading */
        .ig-card-tag-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .ig-card-tag {
          font-family: 'Jost', sans-serif;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #0d0b09;
          background: #c9a96e;
          padding: 4px 10px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ig-card-tag-line {
          flex: 1;
          height: 1px;
          background: rgba(201,169,110,0.18);
        }

        .ig-card-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 2vw, 1.7rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
          line-height: 1.15;
          letter-spacing: 0.01em;
        }

        .ig-card-desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 400;
          color: rgba(255,255,255,0.36);
          margin: 0 0 18px 0;
          line-height: 1.65;
        }

        /* Video frame with ornamental corners */
        .ig-frame-outer {
          position: relative;
        }

        .ig-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 5;
          pointer-events: none;
        }
        .ig-corner--tl { top: -6px; left: -6px; border-top: 2px solid #c9a96e; border-left: 2px solid #c9a96e; }
        .ig-corner--tr { top: -6px; right: -6px; border-top: 2px solid #c9a96e; border-right: 2px solid #c9a96e; }
        .ig-corner--bl { bottom: -6px; left: -6px; border-bottom: 2px solid #c9a96e; border-left: 2px solid #c9a96e; }
        .ig-corner--br { bottom: -6px; right: -6px; border-bottom: 2px solid #c9a96e; border-right: 2px solid #c9a96e; }

        .ig-frame-glow {
          position: absolute;
          inset: -2px;
          border-radius: 3px;
          background: transparent;
          box-shadow:
            0 0 0 1px rgba(201,169,110,0.15),
            0 24px 60px rgba(0,0,0,0.65),
            0 6px 18px rgba(0,0,0,0.45);
          pointer-events: none;
          z-index: 4;
        }

        .ig-video-ratio {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          background: #000;
          border-radius: 2px;
          overflow: hidden;
        }

        .ig-video-ratio iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* Bottom label */
        .ig-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 52px;
        }

        .ig-label-line {
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: rgba(201,169,110,0.22);
        }

        .ig-label-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.60rem;
          font-weight: 600;
          letter-spacing: 0.30em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }

        @media (max-width: 820px) {
          .ig-body { grid-template-columns: 1fr; gap: 48px; }
          .ig-section { padding: 60px 0 70px; }
        }

        @media (max-width: 580px) {
          .ig-inner { padding: 0 16px; }
        }
      `}</style>

      <section className="ig-section" id="our-videos">
        <div className="ig-inner">

          {/* Section Header */}
          <div className="ig-header">
            <p className="ig-eyebrow">Watch &amp; Discover</p>
            <h2 className="ig-title">Experience Oasis, Beyond the Showroom</h2>
            <p className="ig-sub">
              See the craftsmanship, explore our collections, and get inspired — all from the comfort of your home.
            </p>
            <span className="ig-divider" />
          </div>

          {/* Two Videos Side by Side */}
          <div className="ig-body">

            {/* LEFT — existing brand video */}
            <div className="ig-video-card">
              <div className="ig-card-tag-row">
                <span className="ig-card-tag">Our Story</span>
                <span className="ig-card-tag-line" />
              </div>
              <h3 className="ig-card-heading">Craftsmanship in Motion</h3>
              <p className="ig-card-desc">
                A glimpse into the artistry, passion, and precision behind every piece we craft at Oasis Furniture.
              </p>
              <div className="ig-frame-outer">
                <div className="ig-corner ig-corner--tl" />
                <div className="ig-corner ig-corner--tr" />
                <div className="ig-corner ig-corner--bl" />
                <div className="ig-corner ig-corner--br" />
                <div className="ig-frame-glow" />
                <div className="ig-video-ratio">
                  <iframe
                    src="https://www.youtube.com/embed/VAIduj0IdqM?si=Og3T3plRuvldKLST"
                    title="Craftsmanship in Motion — Oasis Furniture"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — new product showcase video */}
            <div className="ig-video-card">
              <div className="ig-card-tag-row">
                <span className="ig-card-tag">Product Showcase</span>
                <span className="ig-card-tag-line" />
              </div>
              <h3 className="ig-card-heading">Designed for the Modern Indian Home</h3>
              <p className="ig-card-desc">
                Explore our curated furniture collection — where premium materials meet timeless design for everyday living.
              </p>
              <div className="ig-frame-outer">
                <div className="ig-corner ig-corner--tl" />
                <div className="ig-corner ig-corner--tr" />
                <div className="ig-corner ig-corner--bl" />
                <div className="ig-corner ig-corner--br" />
                <div className="ig-frame-glow" />
                <div className="ig-video-ratio">
                  <iframe
                    src="https://www.youtube.com/embed/pSjD2Ku0weA?si=xNY1595tPKCOn6yU"
                    title="Designed for the Modern Indian Home — Oasis Furniture"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom label */}
          <div className="ig-label">
            <span className="ig-label-line" />
            <span className="ig-label-text">Oasis Furniture &amp; Furnishing — Est. 2010</span>
            <span className="ig-label-line" />
          </div>

        </div>
      </section>
    </>
  );
}