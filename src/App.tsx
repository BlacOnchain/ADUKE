import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
  MenuItem,
  CartItem,
  RestaurantOrder,
  OrderStatus,
  TableReservation,
  CustomerReview,
} from './types/restaurant';
import { INITIAL_NIGERIAN_MENU, NIGERIAN_SEATING_AREAS, INITIAL_REVIEWS } from './data/menuData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { ReservationSection } from './components/ReservationSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { CartDrawer } from './components/CartDrawer';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal } from './components/LegalModal';

/**
 * Validates individual cart item structure non-destructively against the menu catalog.
 */
function isValidCartItem(entry: unknown, validMenuIds: Set<string>): entry is CartItem {
  if (!entry || typeof entry !== 'object') return false;

  const item = entry as Partial<CartItem>;
  const hasValidCartItemId = typeof item.cartItemId === 'string' && item.cartItemId.length > 0;
  const hasValidItem =
    item.item &&
    typeof item.item === 'object' &&
    typeof item.item.id === 'string' &&
    validMenuIds.has(item.item.id);
  const hasValidQuantity =
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0;
  const hasValidUnitPrice = typeof item.unitPrice === 'number' && Number.isFinite(item.unitPrice);
  const hasValidTotalPrice =
    typeof item.totalPrice === 'number' && Number.isFinite(item.totalPrice);
  const hasValidSelectedOptions = Array.isArray(item.selectedOptions);

  return Boolean(
    hasValidCartItemId &&
    hasValidItem &&
    hasValidQuantity &&
    hasValidUnitPrice &&
    hasValidTotalPrice &&
    hasValidSelectedOptions
  );
}

/**
 * Non-destructive Cart loader: filters out corrupted/stale entries instead of wiping the user's cart.
 */
function sanitizeSavedCart(data: unknown): CartItem[] {
  if (!Array.isArray(data)) return [];
  const validMenuIds = new Set(INITIAL_NIGERIAN_MENU.map((m) => m.id));
  return data.filter((entry): entry is CartItem => isValidCartItem(entry, validMenuIds));
}

/**
 * Non-destructive Order history loader: filters out corrupted order records.
 */
function sanitizeSavedOrders(data: unknown): RestaurantOrder[] {
  if (!Array.isArray(data)) return [];
  const validMenuIds = new Set(INITIAL_NIGERIAN_MENU.map((m) => m.id));

  return data.filter((entry): entry is RestaurantOrder => {
    if (!entry || typeof entry !== 'object') return false;
    const ord = entry as Partial<RestaurantOrder>;
    const hasId = typeof ord.id === 'string' && ord.id.length > 0;
    const hasOrderNumber = typeof ord.orderNumber === 'string';
    const hasTotal = typeof ord.total === 'number' && Number.isFinite(ord.total);
    const hasItems = Array.isArray(ord.items) && ord.items.length > 0;
    const validItems = hasItems && ord.items!.every((it) => isValidCartItem(it, validMenuIds));
    return Boolean(hasId && hasOrderNumber && hasTotal && validItems);
  });
}

export default function App() {
  const [menu] = useState<MenuItem[]>(INITIAL_NIGERIAN_MENU);
  const [seatingAreas] = useState(NIGERIAN_SEATING_AREAS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // Active section for smooth scrolling
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Orders list: Persisted across sessions via localStorage with non-destructive validation
  const [localOrders, setLocalOrders] = useState<RestaurantOrder[]>(() => {
    try {
      const saved = localStorage.getItem('aduke_orders_v1');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        return sanitizeSavedOrders(parsed);
      }
    } catch {
      // Ignore read failure and default to empty array
    }
    return [];
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Cart state: Non-destructive filtering
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aduke_cart_v3');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        return sanitizeSavedCart(parsed);
      }
    } catch {
      // Discard read failure
    }
    return [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aduke_cart_v3', JSON.stringify(cart));
    } catch {
      // LocalStorage full or private browsing quota
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aduke_orders_v1', JSON.stringify(localOrders));
    } catch {
      // LocalStorage full
    }
  }, [localOrders]);

  // Cart metrics
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Cart Actions - Immutable updates recalculating totalPrice from unitPrice * quantity
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
        return prev.map((item, idx) => {
          if (idx !== existingIdx) return item;
          const nextQty = item.quantity + cartItem.quantity;
          return {
            ...item,
            quantity: nextQty,
            totalPrice: nextQty * item.unitPrice,
          };
        });
      }

      return [
        {
          ...cartItem,
          totalPrice: cartItem.quantity * cartItem.unitPrice,
        },
        ...prev,
      ];
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
    setActiveTrackingOrderId(order.id);
    toast.success(`Order #${order.orderNumber} placed!`, {
      description: 'Your woodfire culinary experience has been transmitted to our chefs.',
    });
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    scrollToSection('tracking');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setLocalOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  // 1-Click Re-order action: takes an array of CartItems and immutably adds them to the cart
  const handleReorder = (items: CartItem[]) => {
    items.forEach((item) => {
      // Re-generate fresh cart item ID
      const reorderedItem: CartItem = {
        ...item,
        cartItemId: `${item.item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        totalPrice: item.quantity * item.unitPrice,
      };
      handleAddToCart(reorderedItem);
    });
    setIsCartOpen(true);
  };

  const handleReservationComplete = (_reservation: TableReservation) => {
    toast.success('Table reservation confirmed', {
      description: 'We eagerly anticipate welcoming you to our Victoria Island hearth.',
    });
  };

  const handleAddReview = (review: CustomerReview) => {
    setReviews((prev) => [review, ...prev]);
    toast.success('Review published', {
      description: 'Thank you for sharing your dining experience with Àdùkẹ́.',
    });
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
      {/* Toast Notification Provider */}
      <Toaster position="top-right" richColors closeButton />

      {/* Accessible Root Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-emerald text-white text-xs font-bold rounded-xl shadow-lg ring-2 ring-white transition-all"
      >
        Skip to main content
      </a>

      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => scrollToSection('reservation')}
      />

      {/* Main Content Sections with Accessible Landmark ID */}
      <main id="main-content" className="flex-1">
        <Hero
          onBookTable={() => scrollToSection('reservation')}
          onExploreMenu={() => scrollToSection('menu')}
        />

        <MenuSection
          menu={menu}
          onSelectDish={(dish) => setSelectedDish(dish)}
          onQuickAdd={handleQuickAdd}
        />

        <OrderTrackingSection
          orders={localOrders}
          activeOrderId={activeTrackingOrderId}
          onSelectOrder={(orderId) => setActiveTrackingOrderId(orderId)}
          onExploreMenu={() => scrollToSection('menu')}
          onReorder={handleReorder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
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
        onTrackOrder={handleTrackOrder}
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
