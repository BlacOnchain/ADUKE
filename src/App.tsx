import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  RestaurantOrder,
  TableReservation,
  CustomerReview,
} from './types/restaurant';
import { INITIAL_NIGERIAN_MENU, NIGERIAN_SEATING_AREAS, INITIAL_REVIEWS } from './data/menuData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { ReservationSection } from './components/ReservationSection';
import { CartDrawer } from './components/CartDrawer';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [menu] = useState<MenuItem[]>(INITIAL_NIGERIAN_MENU);
  const [seatingAreas] = useState(NIGERIAN_SEATING_AREAS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // Active section for smooth scrolling
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Local Orders list (in-memory demo state)
  const [, setLocalOrders] = useState<RestaurantOrder[]>([]);

  // Cart state with local storage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aduke_cart_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aduke_cart_v3', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

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
    setLocalOrders((prev) => [order, ...prev]);
  };

  const handleReservationComplete = (_reservation: TableReservation) => {
    // Local reservation confirmed
  };

  const handleAddReview = (review: CustomerReview) => {
    setReviews((prev) => [review, ...prev]);
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

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-primary flex flex-col selection:bg-brand-emerald selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => scrollToSection('reservation')}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onBookTable={() => scrollToSection('reservation')}
          onExploreMenu={() => scrollToSection('menu')}
        />

        <MenuSection
          menu={menu}
          onSelectDish={(dish) => setSelectedDish(dish)}
          onQuickAdd={handleQuickAdd}
        />

        <ReservationSection
          seatingAreas={seatingAreas}
          onReservationComplete={handleReservationComplete}
        />

        <StorySection />

        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onBookTable={() => scrollToSection('reservation')}
        onOpenLegal={handleOpenLegal}
      />

      {/* Cart Drawer */}
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

      {/* Legal & Privacy Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* Local Cookie Preferences Banner */}
      <CookieConsent />
    </div>
  );
}
