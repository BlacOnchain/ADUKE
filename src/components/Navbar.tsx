import React, { useState, useEffect } from 'react';
import { ShoppingBag, Utensils, User, LogOut, Menu, X, QrCode, Sparkles, Bell, Phone, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RestaurantOrder, TableSession, formatNaira } from '../types/restaurant';
import { notificationService } from '../services/notificationService';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenScanQR: () => void;
  onOpenNotifications: () => void;
  activeTableSession?: TableSession | null;
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
  onOpenScanQR,
  onOpenNotifications,
  activeTableSession,
  activeOrder,
  onOpenTracker,
  onOpenAuth,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = () => {
      const history = notificationService.getHistory();
      setHasUnread(history.some((h) => !h.read));
    };
    checkUnread();
    const unsub = notificationService.subscribe(checkUnread);
    return () => unsub();
  }, []);

  const navLinks = [
    { id: 'menu', label: 'Culinary Menu' },
    { id: 'order-history', label: 'Order History' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'story', label: 'Our Story' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleLogoClick = () => {
    onNavigate('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E6DD]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: Brand Wordmark (Clickable Logo) */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleLogoClick}
              className="text-left group flex items-baseline gap-2 cursor-pointer"
              title="Àdùkẹ́ Home"
            >
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121110] group-hover:text-[#14532D] transition-colors">
                Àdùkẹ́
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#14532D]" />
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-[#8C8A82]">
                Lagos
              </span>
            </button>
          </div>

          {/* ZONE 2: Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#595852]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1 transition-colors hover:text-[#121110] cursor-pointer ${
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

          {/* ZONE 3: Functional Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Scan QR Table Ordering Action */}
            <button
              onClick={onOpenScanQR}
              title="Scan Table QR code for direct ordering"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                activeTableSession
                  ? 'bg-[#DCFCE7] text-[#14532D] border border-emerald-300 ring-1 ring-[#14532D]/20'
                  : 'bg-white hover:bg-[#F4F3ED] text-[#121110] border border-[#E8E6DD]'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#14532D]" />
              <span className="hidden sm:inline">
                {activeTableSession ? `${activeTableSession.tableNumber}` : 'Scan Table QR'}
              </span>
              {activeTableSession && (
                <span className="w-2 h-2 rounded-full bg-[#14532D] animate-pulse" />
              )}
            </button>
            
            {/* Live Order Tracker Trigger if user placed an active order */}
            {activeOrder && (
              <button
                onClick={onOpenTracker}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#DCFCE7] text-[#14532D] hover:bg-[#BBF7D0] rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#14532D] animate-ping" />
                <span className="font-mono">Order #{activeOrder.orderNumber}</span>
              </button>
            )}

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              aria-label="Order notifications and subscription preferences"
              title="Real-time order notifications"
              className="relative p-2 rounded-xl text-[#121110] hover:bg-white bg-[#FAFAF7] border border-[#E8E6DD] transition-all cursor-pointer shadow-2xs"
            >
              <Bell className="w-4 h-4 text-[#14532D]" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C2410C] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Shopping Bag Button with Naira total */}
            <button
              onClick={onOpenCart}
              aria-label="View shopping bag"
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121110] hover:bg-white bg-[#FAFAF7] border border-[#E8E6DD] transition-all cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#14532D]" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-[#C2410C] text-white font-mono text-[11px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="hidden lg:inline font-mono font-bold text-[#14532D] text-xs">
                    {formatNaira(cartTotal)}
                  </span>
                </>
              ) : (
                <span className="font-mono text-[#8C8A82]">0</span>
              )}
            </button>

            {/* Book Table Primary CTA */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* User Auth */}
            {currentUser ? (
              <button
                onClick={() => logout()}
                title={`Signed in as ${currentUser.displayName || currentUser.email}. Click to sign out.`}
                className="p-2 rounded-xl bg-white border border-[#E8E6DD] text-[#8C8A82] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-2 rounded-xl bg-white border border-[#E8E6DD] text-[#595852] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
                title="Account / Guest Sign In"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Navigation Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white border border-[#E8E6DD] text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Full Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E6DD] space-y-2 text-left animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    activeSection === link.id
                      ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                      : 'text-[#121110] hover:bg-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[#8C8A82]">→</span>
                </button>
              ))}
            </div>

            {/* Primary Mobile Action Buttons */}
            <div className="pt-3 border-t border-[#E8E6DD] grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenScanQR();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 bg-white border border-[#E8E6DD] text-[#121110] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-[#14532D]" />
                <span>Scan QR</span>
              </button>

              <button
                onClick={() => {
                  onOpenReservation();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 bg-[#14532D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Utensils className="w-4 h-4" />
                <span>Book Table</span>
              </button>
            </div>

            {/* Direct Mobile Quick Contact & Staff Link */}
            <div className="pt-3 border-t border-[#E8E6DD] flex items-center justify-between text-xs text-[#595852] px-1">
              <a
                href="tel:+23414608910"
                className="flex items-center gap-1.5 font-medium text-[#14532D] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+234 1 460 8910</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="text-[#8C8A82] hover:text-[#121110] font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#14532D]" />
                <span>Staff Portal</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
