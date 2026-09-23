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
} from './types/restaurant';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { RestaurantDiagramSection } from './components/RestaurantDiagramSection';
import { DishModal } from './components/DishModal';
import { ReservationSection } from './components/ReservationSection';
import { GoogleMapsAgent } from './components/GoogleMapsAgent';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { StaffDashboard } from './components/StaffDashboard';
import { AuthModal } from './components/AuthModal';
import { MenuManagementModal } from './components/MenuManagementModal';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal } from './components/LegalModal';

function MainApp() {
  // DB Reactive State
  const [menu, setMenu] = useState<MenuItem[]>(() => restaurantDB.getMenu());
  const [seatingAreas] = useState(() => restaurantDB.getSeatingAreas());
  const [orders, setOrders] = useState<RestaurantOrder[]>(() => restaurantDB.getOrders());
  const [reservations, setReservations] = useState<TableReservation[]>(() => restaurantDB.getReservations());
  const [reviews, setReviews] = useState<CustomerReview[]>(() => restaurantDB.getReviews());

  // Navigation & View state
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isStaffMode, setIsStaffMode] = useState<boolean>(false);
  const [preSelectedZone, setPreSelectedZone] = useState<string>('eko-grand');

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

  // Section Navigation
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

  const handleSelectZoneFromDiagram = (zoneId: string) => {
    setPreSelectedZone(zoneId);
    scrollToSection('reservation');
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

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
        activeOrder={activeOrder}
        onOpenTracker={() => setTrackerOrder(activeOrder || orders[0] || null)}
        isStaffMode={isStaffMode}
        onToggleStaffMode={() => setIsStaffMode((prev) => !prev)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMenuManager={() => setIsMenuManagerOpen(true)}
      />

      {isStaffMode ? (
        /* Kitchen / Staff Management Screen */
        <main className="flex-1">
          <StaffDashboard
            orders={orders}
            reservations={reservations}
            onClose={() => setIsStaffMode(false)}
            onOpenMenuManager={() => setIsMenuManagerOpen(true)}
          />
        </main>
      ) : (
        /* Guest Experience View */
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onBookTable={() => scrollToSection('reservation')}
            onExploreMenu={() => scrollToSection('menu')}
            onExploreFloorPlan={() => scrollToSection('diagram')}
          />

          {/* Dynamic Categorized Culinary Menu & Live Ordering */}
          <MenuSection
            menu={menu}
            onSelectDish={(dish) => setSelectedDish(dish)}
            onQuickAdd={handleQuickAdd}
            onOpenMenuManager={() => setIsMenuManagerOpen(true)}
          />

          {/* Illustrated Cartoon Diagram & Architectural Floor Plan */}
          <RestaurantDiagramSection
            onSelectZoneForReservation={handleSelectZoneFromDiagram}
          />

          {/* Double-Booking Prevention Table Reservation System */}
          <ReservationSection
            seatingAreas={seatingAreas}
            preSelectedAreaId={preSelectedZone}
            onReservationComplete={() => {
              // reservation completed
            }}
            onViewDiagram={() => scrollToSection('diagram')}
          />

          {/* Google Maps Real-Time Location, Directions & Transit Agent */}
          <GoogleMapsAgent />

          {/* Nigerian Woodfire & Heritage Story */}
          <StorySection />

          {/* Guest Reviews & Ratings */}
          <ReviewsSection reviews={reviews} />
        </main>
      )}

      {/* Footer */}
      {!isStaffMode && (
        <Footer
          onNavigate={scrollToSection}
          onBookTable={() => scrollToSection('reservation')}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {/* Cart & Checkout Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Dish Customization Modal */}
      <DishModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={trackerOrder}
        onClose={() => setTrackerOrder(null)}
        onStatusChange={(orderId, newStatus) => {
          if (trackerOrder && trackerOrder.id === orderId) {
            setTrackerOrder({ ...trackerOrder, status: newStatus });
          }
        }}
      />

      {/* User Authentication Modal (Sign In, Sign Up, Password Recovery, Google Sign-In) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Dynamic Menu & Price Management Modal (Staff / Admin Tool) */}
      <MenuManagementModal
        isOpen={isMenuManagerOpen}
        onClose={() => setIsMenuManagerOpen(false)}
        menu={menu}
      />

      {/* Privacy Policy & Terms of Service Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* Discrete Cookie Preferences Banner */}
      <CookieConsent />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
