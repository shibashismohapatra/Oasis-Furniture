import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    if (!email) return;

    setDone(true);

    // WhatsApp message — professional welcome note
    const whatsappNumber = '918917690567'; // country code 91 + number
    const message = encodeURIComponent(
      `Hii This is *${email}* requesting to join OASIS Club for great offer and exclusive membership plan.\n\nHappy decorating! 🏡\n— *Team OASIS Furniture*`
    );

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Short delay so user sees the success state first, then WhatsApp opens
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 600);

    setEmail('');
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
          align-items: flex-start;
          gap: 10px;
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
        .nl-whatsapp-hint {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4a4038;
          margin: 4px 0 0 0;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.85;
        }
        .nl-whatsapp-hint svg {
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .nl-inner { flex-direction: column; align-items: flex-start; padding: 0 24px; }
          .nl-right { width: 100%; max-width: 100%; }
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
                <p className="nl-whatsapp-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Opening WhatsApp to send your welcome message…
                </p>
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