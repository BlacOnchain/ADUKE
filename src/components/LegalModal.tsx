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
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E6DD] overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAFAF7] border-b border-[#E8E6DD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#121110]">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Reservation Policies'}
              </h3>
              <p className="text-xs text-[#8C8A82]">Àdùkẹ́ Hospitality Group · Effective 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F0EFEB] text-[#595852] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E6DD] px-6 bg-[#FAFAF7]/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#14532D] text-[#14532D]'
                : 'border-transparent text-[#8C8A82] hover:text-[#121110]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Guest Privacy & Data Protection</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-[#14532D] text-[#14532D]'
                : 'border-transparent text-[#8C8A82] hover:text-[#121110]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reservation Terms & Cancellations</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto text-xs text-[#595852] leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">1. Collection of Guest Information</h4>
                <p>
                  When you make a reservation or place an online order at Àdùkẹ́, we collect only necessary details: your name, telephone number, email address, dietary restrictions, and fulfillment address for delivery orders.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">2. Secure Cloud Persistence</h4>
                <p>
                  All reservation records and transaction summaries are stored within encrypted Google Cloud Firestore database instances. We do not sell, rent, or trade your dining history or contact details with third-party advertisers.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">3. Allergen & Kitchen Communication</h4>
                <p>
                  Dietary requirements and allergy alerts provided in reservation notes are shared exclusively with our Executive Chef and culinary service team to guarantee guest safety.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">4. Your Data Rights</h4>
                <p>
                  You may request the deletion or export of your account profile and dining records at any time by contacting our Host Stand at privacy@aduke-dining.com.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">1. Table Reservation Timeliness</h4>
                <p>
                  Tables are held for 15 minutes past the confirmed reservation time. If your party is delayed, please notify the host stand immediately to preserve your seating.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">2. Double-Booking Prevention Protocol</h4>
                <p>
                  Our system guarantees real-time capacity allocation. In the rare event of severe weather impacting veranda tables, guests will be accommodated in the Eko Grand Dining Hall or offered alternative dates.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">3. Cancellations & Modifications</h4>
                <p>
                  Cancellations for standard parties (up to 6 guests) can be made up to 4 hours prior to service without charge. For Oba's Suite private dining and parties of 8+, 24-hour advance notice is requested.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#121110]">4. Dress Code & Atmosphere</h4>
                <p>
                  We celebrate smart casual and elegant West African attire. We ask guests to refrain from athletic gym wear in the dining room and Oba's Suite.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAF7] border-t border-[#E8E6DD] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#14532D] hover:bg-[#0D3823] text-white rounded-xl transition-colors shadow-sm"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
