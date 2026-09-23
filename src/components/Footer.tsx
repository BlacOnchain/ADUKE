import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onBookTable: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onBookTable, onOpenLegal }) => {
  return (
    <footer className="bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Editorial Grid — Airy & Spacious */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#E8E6DD] text-left">
          
          {/* Column 1: Brand Ethos */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-[#121110]">
                Àdùkẹ́
              </span>
              <span className="w-2 h-2 rounded-full bg-[#14532D]" />
            </div>
            <p className="text-xs text-[#595852] leading-relaxed">
              Contemporary Nigerian gastronomy celebrating the embers of firewood hearths, 8-hour braised oxtail efo riro, smoky party jollof, and cold-pressed native herbs.
            </p>
            <div className="pt-2">
              <button
                onClick={onBookTable}
                className="px-4 py-2.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Column 2: Service Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Service Hours</span>
            </h4>
            <div className="space-y-2 text-[#595852]">
              <div>
                <p className="text-[#121110] font-semibold">Dinner Sittings</p>
                <p>Tuesday – Sunday</p>
                <p className="font-mono tabular-nums text-[#14532D] font-medium">5:30 PM – 11:30 PM</p>
              </div>
              <div className="pt-1">
                <p className="text-[#121110] font-semibold">Lunch & Suya Socials</p>
                <p>Thursday – Sunday</p>
                <p className="font-mono tabular-nums text-[#14532D] font-medium">12:00 PM – 3:00 PM</p>
              </div>
              <div className="pt-1">
                <p className="text-[#8C8A82] italic">Monday: Reserved for private culinary curations.</p>
              </div>
            </div>
          </div>

          {/* Column 3: Location & Valet */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Location & Arrival</span>
            </h4>
            <div className="space-y-1.5 text-[#595852]">
              <p className="text-[#121110] font-semibold">174 Franklin Street</p>
              <p>Tribeca Historic District</p>
              <p>New York, NY 10013</p>
              <p className="pt-1 text-[#8C8A82]">
                Complimentary curbside valet welcomes you outside the canopy from 5:00 PM onwards.
              </p>
              <p className="text-[#8C8A82]">
                Subway: 1 train to Franklin St Station (2 min walk).
              </p>
            </div>
          </div>

          {/* Column 4: Concierge & Contacts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Direct Inquiries</span>
            </h4>
            <div className="space-y-1.5 text-[#595852]">
              <p>Host Stand: <span className="font-mono font-semibold text-[#121110]">+1 (212) 555-8910</span></p>
              <p>Sommelier Cellar: <span className="font-mono font-semibold text-[#121110]">+1 (212) 555-8912</span></p>
              <p>Private Dining: <span className="text-[#14532D] underline font-medium">oba@aduke-dining.com</span></p>
              <div className="pt-2 flex items-center gap-2 text-[#8C8A82]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Protected by Google Cloud Firestore</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Navigation Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8A82]">
          <p>© {new Date().getFullYear()} Àdùkẹ́ Hospitality Group. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#121110] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#121110] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="hover:text-[#121110] transition-colors cursor-pointer"
            >
              Menu
            </button>
            <button
              onClick={() => onNavigate('reservation')}
              className="hover:text-[#121110] transition-colors cursor-pointer"
            >
              Reservations
            </button>
            <button
              onClick={() => onNavigate('location')}
              className="hover:text-[#121110] transition-colors cursor-pointer"
            >
              Directions
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
