import React, { useState } from 'react';
import { ShoppingBag, Utensils, Menu, X, Phone } from 'lucide-react';
import { formatNaira } from '../types/restaurant';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenReservation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'menu', label: 'Culinary Menu' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'story', label: 'Our Story' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleLogoClick = () => {
    onNavigate('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-canvas/95 backdrop-blur-md border-b border-surface-hairline/80 transition-all">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-emerald text-white text-xs font-bold rounded-xl shadow-lg ring-2 ring-white transition-all"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: Brand Wordmark (Clickable Logo) */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleLogoClick}
              aria-label="Àdùkẹ́ Home - Modern Nigerian Gastronomy"
              className="text-left group flex items-baseline gap-2 cursor-pointer"
              title="Àdùkẹ́ Home"
            >
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary group-hover:text-brand-emerald transition-colors">
                Àdùkẹ́
              </span>
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                Lagos
              </span>
            </button>
          </div>

          {/* ZONE 2: Clean Text Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7 text-[13px] font-medium text-ink-secondary">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 transition-colors hover:text-ink-primary cursor-pointer ${
                    isActive ? 'text-ink-primary font-semibold' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-emerald rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Functional Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Shopping Bag Button with Naira total */}
            <button
              onClick={onOpenCart}
              aria-label={`View shopping bag, ${cartCount} items totaling ${formatNaira(cartTotal)}`}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-ink-primary hover:bg-surface-pure bg-surface-canvas border border-surface-hairline transition-all cursor-pointer shadow-2xs"
            >
              <ShoppingBag aria-hidden="true" className="w-4 h-4 text-brand-emerald" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 ? (
                <>
                  <span aria-hidden="true" className="w-5 h-5 rounded-full bg-brand-terracotta text-white font-mono text-[11px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span aria-hidden="true" className="hidden lg:inline font-mono font-bold text-brand-emerald text-xs">
                    {formatNaira(cartTotal)}
                  </span>
                </>
              ) : (
                <span aria-hidden="true" className="font-mono text-ink-muted">0</span>
              )}
            </button>

            {/* Book Table Primary CTA */}
            <button
              onClick={onOpenReservation}
              aria-label="Book a table at Àdùkẹ́"
              className="btn-interactive inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Utensils aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-surface-pure border border-surface-hairline text-ink-primary hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation-menu"
            aria-label="Mobile Navigation"
            className="md:hidden py-4 border-t border-surface-hairline space-y-2 text-left animate-fadeIn"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-emerald-light text-brand-emerald font-bold'
                        : 'text-ink-primary hover:bg-surface-pure'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-ink-muted">→</span>
                  </button>
                );
              })}
            </div>

            {/* Direct Mobile Quick Contact & Action */}
            <div className="pt-3 border-t border-surface-hairline flex items-center justify-between text-xs text-ink-secondary px-1">
              <a
                href="tel:+23414608910"
                aria-label="Call restaurant directly at +234 1 460 8910"
                className="flex items-center gap-1.5 font-medium text-brand-emerald hover:underline"
              >
                <Phone aria-hidden="true" className="w-3.5 h-3.5" />
                <span>+234 1 460 8910</span>
              </a>

              <span className="text-ink-muted font-mono text-[11px]">
                Victoria Island, Lagos
              </span>
            </div>
          </nav>
        )}

      </div>
    </header>
  );
};
