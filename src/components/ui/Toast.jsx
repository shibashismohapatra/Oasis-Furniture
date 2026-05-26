import { useEffect } from 'react';
import { Heart, CheckCircle, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export default function Toast() {
  const toasts = useToastStore(s => s.toasts);
  const remove  = useToastStore(s => s.remove);

  return (
    <>
      <style>{`
        .toast-wrap {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .toast-item {
          pointer-events: all;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a1714;
          color: #fff;
          padding: 13px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 32px rgba(0,0,0,0.22);
          min-width: 240px;
          max-width: 340px;
          animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .toast-item.wishlist { border-left: 3px solid #c9a96e; }
        .toast-item.success  { border-left: 3px solid #6B8E6B; }
        .toast-icon { flex-shrink: 0; }
        .toast-close {
          margin-left: auto;
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .toast-close:hover { color: #fff; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === 'wishlist' && <Heart size={15} className="toast-icon" style={{ color: '#c9a96e' }} fill="#c9a96e" />}
            {t.type === 'success'  && <CheckCircle size={15} className="toast-icon" style={{ color: '#6B8E6B' }} />}
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)}><X size={12} /></button>
          </div>
        ))}
      </div>
    </>
  );
}