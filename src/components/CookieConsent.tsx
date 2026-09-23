import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('aduke_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aduke_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('aduke_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white/95 backdrop-blur-md border border-[#E8E6DD] rounded-2xl p-5 shadow-[0_12px_32px_rgba(18,17,16,0.08)] text-[#121110] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-left flex-1">
          <p className="text-xs font-semibold text-[#121110] font-sans">
            Gastronomy & Privacy Preferences
          </p>
          <p className="text-[11px] text-[#595852] leading-relaxed">
            We use privacy-respecting cookies to save your table reservations, dietary preferences, and order history. No third-party tracking.
          </p>
        </div>
        <button
          onClick={handleDecline}
          className="text-[#8C8A82] hover:text-[#121110] p-1 rounded-lg"
          aria-label="Close cookie consent banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#F0EFEB]">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 text-xs text-[#595852] hover:text-[#121110] font-medium transition-colors"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 text-xs bg-[#14532D] hover:bg-[#0D3823] text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept Preferences</span>
        </button>
      </div>
    </aside>
  );
};
