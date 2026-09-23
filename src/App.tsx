/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { restaurantDB } from './data/db';
import {
  MenuItem,
  CartItem,
  RestaurantOrder,
  TableReservation,
  CustomerReview,
  TableSession,
  StaffRole,
} from './types/restaurant';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { ReservationSection } from './components/ReservationSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { StaffDashboard } from './components/StaffDashboard';
import { AuthModal } from './components/AuthModal';
import { MenuManagementModal } from './components/MenuManagementModal';
import { ScanQR } from './components/ScanQR';
import { NotificationToast } from './components/NotificationToast';
import { NotificationSubscriptionModal } from './components/NotificationSubscriptionModal';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal } from './components/LegalModal';
import { OrderHistoryDashboard } from './components/OrderHistoryDashboard';

import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { AdminLogin } from './components/AdminLogin';
import { useAuth } from './context/AuthContext';


function MainContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { profile } = useAuth();
  const isStaffLoggedIn = profile && profile.role !== 'customer';

  // DB Reactive State
  const [menu, setMenu] = useState<MenuItem[]>(() => restaurantDB.getMenu());
  const [seatingAreas] = useState(() => restaurantDB.getSeatingAreas());
  const [orders, setOrders] = useState<RestaurantOrder[]>(() => restaurantDB.getOrders());
  const [reservations, setReservations] = useState<TableReservation[]>(() => restaurantDB.getReservations());
  const [reviews, setReviews] = useState<CustomerReview[]>(() => restaurantDB.getReviews());

  // Navigation & View state
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Table QR Session State
  const [isScanQROpen, setIsScanQROpen] = useState(false);
  const [activeTableSession, setActiveTableSession] = useState<TableSession | null>(null);

  // Notification Subscription Modal State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Legal Modal State
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aduke_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('aduke_cart_v2', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [trackerOrder, setTrackerOrder] = useState<RestaurantOrder | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);

  // Subscribe to DB updates
  useEffect(() => {
    const unsubscribe = restaurantDB.subscribe(() => {
      setMenu(restaurantDB.getMenu());
      setOrders(restaurantDB.getOrders());
      setReservations(restaurantDB.getReservations());
      setReviews(restaurantDB.getReviews());
    });
    return () => unsubscribe();
  }, []);

  // Most recent ongoing order
  const activeOrder = useMemo(() => {
    return orders.find((o) => o.status !== 'completed' && o.status !== 'cancelled') || undefined;
  }, [orders]);

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Cart Actions
  const handleAddToCart = (cartItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((ci) => {
        if (ci.item.id !== cartItem.item.id) return false;
        if (ci.selectedOptions.length !== cartItem.selectedOptions.length) return false;
        const sameOpts = ci.selectedOptions.every(
          (o, i) => o.optionId === cartItem.selectedOptions[i]?.optionId
        );
        return sameOpts && ci.specialInstructions === cartItem.specialInstructions;
      });

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += cartItem.quantity;
        copy[existingIdx].totalPrice = copy[existingIdx].quantity * copy[existingIdx].unitPrice;
        return copy;
      }
      return [cartItem, ...prev];
    });

    setIsCartOpen(true);
  };

  const handleQuickAdd = (dish: MenuItem) => {
    const quickItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      item: dish,
      quantity: 1,
      selectedOptions: [],
      unitPrice: dish.price,
      totalPrice: dish.price,
    };
    handleAddToCart(quickItem);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            }
          : item
      )
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (order: RestaurantOrder) => {
    setTrackerOrder(order);
  };

  const handleReorder = (order: RestaurantOrder) => {
    const newCartItems: CartItem[] = order.items.map((i) => ({
      ...i,
      cartItemId: `${i.item.id}-${Date.now()}-${Math.random()}`,
    }));
    setCart(newCartItems);
    setIsCartOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // If we are on the admin route, render the Staff Portal or Login completely separate
  if (isAdminRoute) {
    if (!isStaffLoggedIn) {
      return <AdminLogin />;
    }
    return (
      <>
        <StaffDashboard
          orders={orders}
          reservations={reservations}
          menu={menu}
          currentRole={profile.role as StaffRole}
          onClose={() => navigate('/')}
          onOpenMenuManager={() => setIsMenuManagerOpen(true)}
        />
        <MenuManagementModal
          isOpen={isMenuManagerOpen}
          onClose={() => setIsMenuManagerOpen(false)}
          menu={menu}
        />
      </>
    );
  }

  // Otherwise, render the Guest Public Interface
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] flex flex-col selection:bg-[#14532D] selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => scrollToSection('reservation')}
        onOpenScanQR={() => setIsScanQROpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        activeTableSession={activeTableSession}
        activeOrder={activeOrder}
        onOpenTracker={() => setTrackerOrder(activeOrder || orders[0] || null)}
        isStaffMode={false} // Removed
        onToggleStaffMode={() => {}} // Removed
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMenuManager={() => {}}
      />

      <main className="flex-1">
        {activeSection === 'order-history' ? (
          <OrderHistoryDashboard
            orders={orders}
            onReorder={handleReorder}
            onTrackOrder={(order) => setTrackerOrder(order)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateToMenu={() => scrollToSection('menu')}
          />
        ) : (
          <>
            <Hero
              onBookTable={() => scrollToSection('reservation')}
              onExploreMenu={() => scrollToSection('menu')}
            />

            <MenuSection
              menu={menu}
              onSelectDish={(dish) => setSelectedDish(dish)}
              onQuickAdd={handleQuickAdd}
              onOpenMenuManager={() => {}}
            />

            <ReservationSection
              seatingAreas={seatingAreas}
              onReservationComplete={() => {}}
            />

            <StorySection />
            <ReviewsSection reviews={reviews} />
          </>
        )}
      </main>

      <Footer
        onNavigate={scrollToSection}
        onBookTable={() => scrollToSection('reservation')}
        onOpenLegal={handleOpenLegal}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        activeTableSession={activeTableSession}
      />

      <ScanQR
        isOpen={isScanQROpen}
        onClose={() => setIsScanQROpen(false)}
        activeTableSession={activeTableSession}
        onSelectTableSession={(session) => {
          setActiveTableSession(session);
        }}
        onOrderForTable={() => {
          setIsScanQROpen(false);
          setIsCartOpen(true);
        }}
      />

      <DishModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      <OrderTrackerModal
        order={trackerOrder}
        onClose={() => setTrackerOrder(null)}
        onStatusChange={(orderId, newStatus) => {
          if (trackerOrder && trackerOrder.id === orderId) {
            setTrackerOrder({ ...trackerOrder, status: newStatus });
          }
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      <NotificationSubscriptionModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        activeOrderNumber={activeOrder?.orderNumber}
      />

      <NotificationToast />
      <CookieConsent />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
