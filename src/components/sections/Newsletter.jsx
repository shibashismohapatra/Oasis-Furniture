import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  return (
    <>
      <style>{`
        .nl-section {
          background: #e8d5a8;
          padding: 64px 0 52px;
        }
        .nl-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .nl-left { max-width: 480px; }
        .nl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 2.8vw, 2.4rem);
          font-weight: 800;
          color: #1a1714;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .nl-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          color: #4a4038;
          line-height: 1.72;
          margin: 0;
        }
        .nl-right { flex: 1; max-width: 460px; }
        .nl-form {
          display: flex;
          gap: 0;
          margin-bottom: 12px;
        }
        .nl-input {
          flex: 1;
          border: 2px solid #b8965a;
          padding: 15px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1a1714;
          background: #fffbf4;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nl-input::placeholder { color: #9a8870; font-weight: 400; }
        .nl-input:focus { border-color: #1a1714; box-shadow: 0 0 0 3px rgba(201,169,110,0.25); }
        .nl-btn {
          background: #1a1714;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 15px 24px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.22s, transform 0.15s;
        }
        .nl-btn:hover { background: #c9a96e; transform: translateY(-1px); }
        .nl-note {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: #5a5048;
          margin: 0;
        }
        .nl-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          padding: 10px 0;
        }
        .nl-success-emoji {
          font-size: 2.4rem;
          animation: nlPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes nlPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .nl-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #1a1714;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .nl-success-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.80rem;
          font-weight: 600;
          color: #4a6b4a;
          margin: 0;
          letter-spacing: 0.01em;
        }
        @media (max-width: 768px) {
          .nl-inner { flex-direction: column; align-items: flex-start; padding: 0 24px; }
          .nl-right { width: 100%; max-width: 100%; }
          .nl-success { align-items: flex-start; text-align: left; }
        }
      `}</style>

      <section className="nl-section" id="newsletter">
        <div className="nl-inner">
          <div className="nl-left">
            <h2 className="nl-title">Join the OASIS Club</h2>
            <p className="nl-sub">Sign up for ₹500 off your first order and get early access to new arrivals, exclusive offers, and interior inspiration straight to your inbox.</p>
          </div>
          <div className="nl-right">
            {done ? (
              <div className="nl-success">
                <span className="nl-success-emoji">🎉</span>
                <p className="nl-success-title">You're in! Check your inbox for your ₹500 discount code.</p>
                <p className="nl-success-sub">✓ Welcome to the OASIS family — happy decorating!</p>
              </div>
            ) : (
              <form onSubmit={handle}>
                <div className="nl-form">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="nl-input"
                  />
                  <button type="submit" className="nl-btn">Subscribe &amp; Save ₹500</button>
                </div>
              </form>
            )}
            <p className="nl-note">*Minimum order ₹3,000. One use per customer. Excludes sale items.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;