export default function ShowroomCTA() {
  return (
    <>
      <style>{`
        .shcta-section {
          background: #fff;
          padding: 0;
        }
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
          min-height: 240px;
          cursor: pointer;
        }
        .shcta-card img {
          width: 100%; height: 100%; min-height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .shcta-card:hover img { transform: scale(1.05); }
        .shcta-overlay {
          position: absolute; inset: 0;
          background: rgba(10,8,6,0.48);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
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

        @media (max-width: 640px) {
          .shcta-grid { grid-template-columns: 1fr; padding: 32px 16px; }
        }
      `}</style>

      <section className="shcta-section">
        <div className="shcta-grid">
          <div className="shcta-card">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80" alt="Showroom" />
            <div className="shcta-overlay">
              <h3 className="shcta-title">Our Showrooms</h3>
              <p className="shcta-sub">Visit our showrooms across Odisha and experience our entire collection in person. Our in-store design consultants are here to help.</p>
              <button className="shcta-btn">Visit Us</button>
            </div>
          </div>
          <div className="shcta-card">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80" alt="Design Consult" />
            <div className="shcta-overlay">
              <h3 className="shcta-title">Book a Design Consult</h3>
              <p className="shcta-sub">Sit with one of our professional interior designers to get a personalised design proposal tailored to your space and style.</p>
              <button className="shcta-btn">Book Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}