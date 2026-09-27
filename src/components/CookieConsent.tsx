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
      className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-surface-pure/95 backdrop-blur-md border border-surface-hairline rounded-2xl p-5 shadow-[0_12px_32px_rgba(18,17,16,0.08)] text-ink-primary animate-fadeIn"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-brand-emerald-light text-brand-emerald flex items-center justify-center shrink-0">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-left flex-1">
          <p className="text-xs font-semibold text-ink-primary font-sans">
            Gastronomy & Privacy Preferences
          </p>
          <p className="text-[11px] text-ink-secondary leading-relaxed">
            We use privacy-respecting local storage to remember your bag items and dietary preferences. Zero third-party trackers.
          </p>
        </div>
        <button
          onClick={handleDecline}
          className="text-ink-muted hover:text-ink-primary p-1 rounded-lg cursor-pointer"
          aria-label="Close cookie consent banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-surface-muted">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink-primary font-medium transition-colors cursor-pointer"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept</span>
        </button>
      </div>
    </aside>
  );
};
