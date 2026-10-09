import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'terms'>(initialTab);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the modal container or first button
    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative w-full max-w-2xl bg-surface-pure rounded-3xl shadow-2xl border border-surface-hairline overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-surface-canvas border-b border-surface-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-emerald-light text-brand-emerald flex items-center justify-center">
              <ShieldCheck aria-hidden="true" className="w-4 h-4" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="font-display text-lg font-bold text-ink-primary">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Reservation Policies'}
              </h2>
              <p className="text-xs text-ink-muted">Àdùkẹ́ Hospitality Group · Effective 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close legal policy dialog"
            className="p-1.5 rounded-xl hover:bg-surface-muted text-ink-secondary transition-colors cursor-pointer"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Legal documents" className="flex border-b border-surface-hairline px-6 bg-surface-canvas/50 text-xs font-semibold">
          <button
            role="tab"
            id="tab-privacy"
            aria-selected={activeTab === 'privacy'}
            aria-controls="panel-privacy"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <Lock aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Guest Privacy & Data Protection</span>
          </button>
          <button
            role="tab"
            id="tab-terms"
            aria-selected={activeTab === 'terms'}
            aria-controls="panel-terms"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <FileText aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Reservations & Service Terms</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs text-ink-secondary leading-relaxed">
          {activeTab === 'privacy' ? (
            <div role="tabpanel" id="panel-privacy" aria-labelledby="tab-privacy" className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">1. Commitment to Guest Confidentiality</h3>
                <p>
                  At Àdùkẹ́, our guests' privacy and dining tranquility are of paramount importance. We collect only the contact information necessary to confirm table bookings and coordinate culinary delivery orders across Lagos.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">2. Information We Collect</h3>
                <p>
                  When making reservations or placing orders through our digital concierge, we collect your full name, mobile telephone number, email address, and optional dietary or allergen instructions.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">3. Local Device Storage</h3>
                <p>
                  To preserve your dining bag between visits without requiring an intrusive account setup, we store your selected dishes directly in your browser’s local storage. This data is not shared with third-party tracking networks.
                </p>
              </section>
            </div>
          ) : (
            <div role="tabpanel" id="panel-terms" aria-labelledby="tab-terms" className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">1. Dining Table Reservations</h3>
                <p>
                  Table reservations at our Victoria Island establishment are held for up to 15 minutes past the scheduled sitting time. For parties of 6 or larger, we kindly request notice 4 hours prior for any schedule adjustments.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">2. Kitchen Fulfilment & Allergens</h3>
                <p>
                  Our kitchen proudly incorporates genuine Nigerian spices, ground peanuts (yaji), fermented locust beans (iru), and assorted shellfish. While we adhere to rigorous sanitary kitchen protocols, please notify our concierge of severe allergies prior to dining.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-ink-primary text-sm">3. Executive Valet Service</h3>
                <p>
                  Complimentary executive valet service is available on Adeola Odeku Street during all operational hours. Valet claims require presenting your digital reservation confirmation upon departure.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-canvas border-t border-surface-hairline flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
