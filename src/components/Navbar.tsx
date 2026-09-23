import React, { useState } from 'react';
import { ShoppingBag, Utensils, User, LogOut, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RestaurantOrder } from '../types/restaurant';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  activeOrder?: RestaurantOrder;
  onOpenTracker?: () => void;
  isStaffMode: boolean;
  onToggleStaffMode: () => void;
  onOpenAuth: () => void;
  onOpenMenuManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenReservation,
  activeOrder,
  onOpenTracker,
  isStaffMode,
  onToggleStaffMode,
  onOpenAuth,
  onOpenMenuManager,
}) => {
  const { currentUser, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'menu', label: 'Culinary Menu' },
    { id: 'diagram', label: 'Pavilion Plan' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'story', label: 'Our Story' },
    { id: 'location', label: 'Arrival & Map' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8E6DD]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: Clean Brand Wordmark (Top Bar Contract: Single Text Element) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('hero')}
              className="text-left group flex items-baseline gap-2 cursor-pointer"
            >
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121110] group-hover:text-[#14532D] transition-colors">
                Àdùkẹ́
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#14532D]" />
            </button>
          </div>

          {/* ZONE 2: Clean Text Navigation Links with Subtle Underlines */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#595852]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1 transition-colors hover:text-[#121110] ${
                    isActive ? 'text-[#121110] font-semibold' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#14532D] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: 1-2 Primary Functional Actions */}
          <div className="flex items-center gap-3">
            
            {/* Live Order Tracker Trigger if user placed an active order */}
            {activeOrder && (
              <button
                onClick={onOpenTracker}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#DCFCE7] text-[#14532D] hover:bg-[#BBF7D0] rounded-full text-xs font-semibold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#14532D] animate-ping" />
                <span className="font-mono">Order #{activeOrder.orderNumber}</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              aria-label="View shopping bag"
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121110] hover:bg-white border border-[#E8E6DD] transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#14532D]" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[#C2410C] text-white font-mono text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              ) : (
                <span className="font-mono text-[#8C8A82]">0</span>
              )}
            </button>

            {/* Book Table Primary CTA */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* User Auth or Staff Mode Switch */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleStaffMode}
                  title={isStaffMode ? 'Return to Guest View' : 'Open Staff Console'}
                  className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                    isStaffMode
                      ? 'bg-[#121110] text-white border-[#121110]'
                      : 'bg-white text-[#595852] border-[#E8E6DD] hover:text-[#121110]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-[#E8E6DD] bg-white text-[#595852] hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-2 rounded-xl border border-[#E8E6DD] bg-white text-[#595852] hover:text-[#121110] transition-colors cursor-pointer"
                title="Account Login"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#E8E6DD] bg-white text-[#121110]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E6DD] space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#595852]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-white hover:text-[#121110] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E6DD] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onOpenReservation();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-xl text-center"
              >
                Book Table
              </button>
              {profile?.role === 'staff' && (
                <button
                  onClick={() => {
                    onToggleStaffMode();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2.5 border border-[#E8E6DD] text-xs font-semibold rounded-xl"
                >
                  Staff Console
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
