export default function VideoSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .vs-root {
          background: #0d0b09;
          padding: 90px 0 100px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background texture lines */
        .vs-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 119px,
              rgba(201,169,110,0.04) 120px
            );
          pointer-events: none;
        }

        .vs-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 60px);
        }

        /* Header */
        .vs-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0 0 14px 0;
          text-align: center;
        }

        .vs-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.08;
          color: #ffffff;
          text-align: center;
          margin: 0 0 12px 0;
          letter-spacing: -0.01em;
        }

        .vs-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          text-align: center;
          margin: 0 0 52px 0;
          line-height: 1.7;
        }

        /* Gold divider */
        .vs-divider {
          display: block;
          width: 48px;
          height: 2px;
          background: #c9a96e;
          margin: 0 auto 52px;
          border-radius: 1px;
        }

        /* Video wrapper — 16:9 ratio, with ornamental frame */
        .vs-frame-outer {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
        }

        /* Decorative corner accents */
        .vs-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          z-index: 5;
          pointer-events: none;
        }
        .vs-corner--tl { top: -8px; left: -8px; border-top: 2px solid #c9a96e; border-left: 2px solid #c9a96e; }
        .vs-corner--tr { top: -8px; right: -8px; border-top: 2px solid #c9a96e; border-right: 2px solid #c9a96e; }
        .vs-corner--bl { bottom: -8px; left: -8px; border-bottom: 2px solid #c9a96e; border-left: 2px solid #c9a96e; }
        .vs-corner--br { bottom: -8px; right: -8px; border-bottom: 2px solid #c9a96e; border-right: 2px solid #c9a96e; }

        /* Outer glow ring */
        .vs-frame-glow {
          position: absolute;
          inset: -2px;
          border-radius: 4px;
          background: transparent;
          box-shadow:
            0 0 0 1px rgba(201,169,110,0.18),
            0 32px 80px rgba(0,0,0,0.70),
            0 8px 24px rgba(0,0,0,0.50);
          pointer-events: none;
          z-index: 4;
        }

        /* 16:9 ratio container */
        .vs-video-ratio {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 */
          background: #000;
          border-radius: 2px;
          overflow: hidden;
        }

        .vs-video-ratio iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* Bottom label */
        .vs-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
        }

        .vs-label-line {
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: rgba(201,169,110,0.25);
        }

        .vs-label-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.32);
        }

        @media (max-width: 600px) {
          .vs-root { padding: 60px 0 70px; }
          .vs-frame-outer { max-width: 100%; }
        }
      `}</style>

      <section className="vs-root" id="brand-video">
        <div className="vs-container">

          {/* Header */}
          <p className="vs-eyebrow">Our Story</p>
          <h2 className="vs-title">Craftsmanship in Motion</h2>
          <p className="vs-subtitle">
            A glimpse into the artistry, passion, and precision behind every piece we create.
          </p>
          <span className="vs-divider" />

          {/* Video Frame */}
          <div className="vs-frame-outer">
            {/* Decorative corners */}
            <div className="vs-corner vs-corner--tl" />
            <div className="vs-corner vs-corner--tr" />
            <div className="vs-corner vs-corner--bl" />
            <div className="vs-corner vs-corner--br" />

            {/* Glow border */}
            <div className="vs-frame-glow" />

            {/* 16:9 Video */}
            <div className="vs-video-ratio">
              <iframe
                src="https://www.youtube.com/embed/VAIduj0IdqM?si=Og3T3plRuvldKLST"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Bottom label */}
          <div className="vs-label">
            <span className="vs-label-line" />
            <span className="vs-label-text">Techsheel — Est. 2010</span>
            <span className="vs-label-line" />
          </div>

        </div>
      </section>
    </>
  );
}