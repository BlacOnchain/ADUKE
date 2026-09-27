import React from 'react';
import { MapPin, Phone, Clock, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onBookTable: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onBookTable, onOpenLegal }) => {
  const handleDirectionsClick = () => {
    window.open(
      'https://maps.google.com/?q=14+Adeola+Odeku+Street+Victoria+Island+Lagos+Nigeria',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <footer className="bg-surface-canvas text-ink-primary border-t border-surface-hairline pt-16 sm:pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-surface-hairline text-left">
          
          {/* Column 1: Brand Ethos */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate('hero')}
              className="group flex items-baseline gap-2 cursor-pointer text-left"
              title="Return to top"
            >
              <span className="font-display text-3xl font-bold tracking-tight text-ink-primary group-hover:text-brand-emerald transition-colors">
                Àdùkẹ́
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-emerald" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                Lagos
              </span>
            </button>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Contemporary Nigerian gastronomy celebrating the embers of firewood hearths, slow-braised oxtail efo riro, smoky party jollof, and cold-pressed native herbs.
            </p>

            <div className="pt-2">
              <button
                onClick={onBookTable}
                className="btn-interactive px-4 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Column 2: Service Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Service Hours</span>
            </h4>
            <div className="space-y-2 text-ink-secondary">
              <div>
                <p className="text-ink-primary font-semibold">Dinner Sittings</p>
                <p>Tuesday – Sunday</p>
                <p className="font-mono tabular-nums text-brand-emerald font-medium">5:30 PM – 11:30 PM</p>
              </div>
              <div className="pt-1">
                <p className="text-ink-primary font-semibold">Lunch & Suya Socials</p>
                <p>Thursday – Sunday</p>
                <p className="font-mono tabular-nums text-brand-emerald font-medium">12:00 PM – 3:00 PM</p>
              </div>
              <div className="pt-1">
                <p className="text-ink-muted italic">Monday: Reserved for private culinary curations.</p>
              </div>
            </div>
          </div>

          {/* Column 3: Location & Valet */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Location & Arrival</span>
            </h4>
            <div className="space-y-1.5 text-ink-secondary">
              <p className="text-ink-primary font-semibold">14 Adeola Odeku Street</p>
              <p>Victoria Island</p>
              <p>Lagos State, Nigeria</p>
              <p className="pt-1 text-ink-muted">
                Guarded courtyard parking and complimentary executive valet service from 12:00 PM onwards.
              </p>
              <button
                onClick={handleDirectionsClick}
                className="pt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-emerald hover:underline cursor-pointer"
              >
                <span>Get Driving Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 4: Concierge & Contacts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Direct Inquiries</span>
            </h4>
            <div className="space-y-2 text-ink-secondary">
              <div>
                <span className="text-ink-muted block text-[11px]">Host Stand Concierge:</span>
                <a
                  href="tel:+23414608910"
                  className="font-mono font-semibold text-ink-primary hover:text-brand-emerald transition-colors"
                >
                  +234 1 460 8910
                </a>
              </div>

              <div>
                <span className="text-ink-muted block text-[11px]">Private Dining & Bookings:</span>
                <a
                  href="mailto:concierge@aduke.lagos.ng"
                  className="text-brand-emerald font-medium hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>concierge@aduke.lagos.ng</span>
                </a>
              </div>

              <div className="pt-2 text-ink-muted text-[11px]">
                <span>Victoria Island · Lagos State, Nigeria</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Navigation Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Àdùkẹ́ Hospitality Group. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Culinary Menu
            </button>
            <button
              onClick={() => onNavigate('reservation')}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Reservations
            </button>
            <button
              onClick={() => onNavigate('story')}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={handleDirectionsClick}
              className="hover:text-ink-primary transition-colors cursor-pointer"
            >
              Directions
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
