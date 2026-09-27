import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-surface-pure rounded-3xl shadow-2xl border border-surface-hairline overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-surface-canvas border-b border-surface-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-emerald-light text-brand-emerald flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-primary">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Reservation Policies'}
              </h3>
              <p className="text-xs text-ink-muted">Àdùkẹ́ Hospitality Group · Effective 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-muted text-ink-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-hairline px-6 bg-surface-canvas/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Guest Privacy & Data Protection</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reservation Terms & Cancellations</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto text-xs text-ink-secondary leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">1. Information We Collect</h4>
                <p>
                  Àdùkẹ́ collects information you provide directly to us when placing food orders or booking dining table reservations (such as full name, phone number, email address, dietary restrictions, and delivery instructions).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">2. Local Storage and Demo Nature</h4>
                <p>
                  This web application operates as an interactive showcase portfolio demonstration. Dining orders and table reservations placed during this session are stored locally within your browser state and do not process live card charges or share data with external brokers.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">3. Dietary and Allergen Safety</h4>
                <p>
                  Special instructions and allergy notices submitted through our order bag and reservation desk are routed immediately to the head chef and hearth crew for careful preparation.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">1. Table Reservations & Punctuality</h4>
                <p>
                  Reserved tables are held for a maximum of 15 minutes past the scheduled booking time before being released to walk-in diners. We kindly request notice if your party is delayed.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">2. Cancellations and Modifications</h4>
                <p>
                  Table modifications or cancellations made 4 or more hours prior to service incur zero penalties or fees. For private chamber events in The Oba’s Suite, 24 hours advance notice is preferred.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-primary">3. Valet Service & Code of Conduct</h4>
                <p>
                  Complimentary executive valet parking is provided to all dining guests at our 14 Adeola Odeku entrance in Victoria Island, Lagos.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-canvas border-t border-surface-hairline flex items-center justify-between text-xs">
          <span className="text-ink-muted">Need personal assistance? Call +234 1 460 8910</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
