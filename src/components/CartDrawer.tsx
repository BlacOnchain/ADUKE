import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CartItem, OrderType, RestaurantOrder, formatNaira } from '../types/restaurant';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (order: RestaurantOrder) => void;
  onTrackOrder?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  onTrackOrder,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+234 803 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<RestaurantOrder | null>(null);

  const drawerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus trap, scroll lock, and ESC listener
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables && focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const elements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!elements.length) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Financial calculations in Nigerian Naira (₦)
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const tax = Math.round(subtotal * 0.075); // 7.5% Nigerian VAT
  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? 4500 : 0;
  const tip = Math.round((subtotal * tipPercentage) / 100);
  const total = subtotal + tax + deliveryFee + tip;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setCheckoutError('Please provide your name and contact phone number.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setCheckoutError('Please provide your Lagos delivery destination address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `ADK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: RestaurantOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        items: [...items],
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'guest@aduke.lagos.ng',
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        subtotal,
        tax,
        deliveryFee,
        tip,
        total,
        status: 'placed',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: orderType === 'delivery' ? '35-45 mins' : '20-25 mins',
        specialNotes: specialNotes.trim() || undefined,
      };

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      onOrderPlaced?.(newOrder);
      onClearCart();

      // Confetti celebration (respects prefers-reduced-motion)
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReduced) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#14532D', '#C2410C', '#C89B3C'],
          });
        } catch {
          // ignore
        }
      }
    }, 400);
  };

  const handleStartNewOrder = () => {
    setConfirmedOrder(null);
    setSpecialNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="w-screen max-w-md bg-surface-pure border-l border-surface-hairline shadow-2xl flex flex-col text-left animate-slideInRight"
        >
          
          {/* Header */}
          <div className="p-5 border-b border-surface-hairline flex items-center justify-between bg-surface-canvas">
            <div className="flex items-center gap-2">
              <ShoppingBag aria-hidden="true" className="w-5 h-5 text-brand-emerald" />
              <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-ink-primary">
                Your Dining Bag
              </h2>
              {items.length > 0 && !confirmedOrder && (
                <span className="px-2 py-0.5 rounded-full bg-brand-emerald-light text-brand-emerald font-mono text-xs font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close dining bag drawer"
              className="p-2 rounded-xl bg-surface-pure border border-surface-hairline text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
            >
              <X aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {confirmedOrder ? (
              /* Order Confirmation Screen */
              <div className="space-y-6 py-4 animate-fadeIn">
                <div className="p-6 rounded-2xl bg-brand-emerald-light/60 border border-brand-emerald/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-emerald text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 aria-hidden="true" className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-emerald font-bold">
                      Order Placed Successfully
                    </span>
                    <h3 className="font-display text-2xl font-bold text-ink-primary mt-1">
                      #{confirmedOrder.orderNumber}
                    </h3>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Thank you, {confirmedOrder.customerName}! Our hearth chefs have received your order for {confirmedOrder.orderType === 'delivery' ? 'Lagos delivery' : 'kitchen pickup'}.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-canvas border border-surface-hairline space-y-3 text-xs">
                  <div className="flex justify-between text-ink-secondary">
                    <span>Estimated Ready:</span>
                    <span className="font-bold text-ink-primary">{confirmedOrder.estimatedDeliveryTime}</span>
                  </div>
                  <div className="flex justify-between text-ink-secondary">
                    <span>Order Type:</span>
                    <span className="font-bold text-ink-primary capitalize">{confirmedOrder.orderType}</span>
                  </div>
                  {confirmedOrder.deliveryAddress && (
                    <div className="flex justify-between text-ink-secondary">
                      <span>Delivery Address:</span>
                      <span className="font-medium text-ink-primary text-right max-w-[200px] truncate">{confirmedOrder.deliveryAddress}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-surface-hairline flex justify-between font-bold text-sm text-ink-primary">
                    <span>Total Amount:</span>
                    <span className="font-mono text-brand-emerald">{formatNaira(confirmedOrder.total)}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {onTrackOrder && (
                    <button
                      type="button"
                      onClick={() => {
                        const orderId = confirmedOrder.id;
                        handleStartNewOrder();
                        onTrackOrder(orderId);
                      }}
                      className="btn-interactive w-full py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <span>Track Order Progress Live</span>
                      <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStartNewOrder}
                    className="w-full py-2.5 text-ink-secondary hover:text-ink-primary text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    Close Bag
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* Empty Bag State */
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mx-auto text-ink-muted">
                  <ShoppingBag aria-hidden="true" className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-ink-primary">Your bag is empty</p>
                  <p className="text-xs text-ink-secondary mt-1">
                    Explore our woodfire specialties to begin your culinary order.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Browse Culinary Menu</span>
                  <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Order Form and Item List */
              <>
                {/* Order Type Toggle: Delivery vs Pickup */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
                    Fulfilment Type
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-surface-muted rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-surface-pure text-brand-emerald shadow-xs'
                          : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <Bike aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-surface-pure text-brand-emerald shadow-xs'
                          : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <Store aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Selected Dishes ({items.length})
                    </span>
                    <button
                      onClick={onClearCart}
                      aria-label="Remove all dishes from bag"
                      className="text-[11px] text-ink-muted hover:text-brand-terracotta flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 aria-hidden="true" className="w-3 h-3" />
                      <span>Clear all</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 divide-y divide-surface-muted">
                    {items.map((cartItem) => (
                      <div key={cartItem.cartItemId} className="pt-2.5 first:pt-0 flex items-center gap-3">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-surface-muted shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-ink-primary truncate">
                            {cartItem.item.name}
                          </h4>
                          {cartItem.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-ink-muted truncate">
                              {cartItem.selectedOptions.map((o) => o.optionName).join(', ')}
                            </p>
                          )}
                          <p className="font-mono text-xs font-bold text-brand-emerald mt-0.5">
                            {formatNaira(cartItem.totalPrice)}
                          </p>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-surface-canvas border border-surface-hairline rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                            aria-label={`Decrease quantity of ${cartItem.item.name}`}
                            className="w-5 h-5 rounded flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-surface-pure transition-colors cursor-pointer"
                          >
                            <Minus aria-hidden="true" className="w-3 h-3" />
                          </button>
                          <span aria-label={`Quantity: ${cartItem.quantity}`} className="font-mono text-xs font-bold text-ink-primary w-4 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                            aria-label={`Increase quantity of ${cartItem.item.name}`}
                            className="w-5 h-5 rounded flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-surface-pure transition-colors cursor-pointer"
                          >
                            <Plus aria-hidden="true" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Details Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-surface-hairline">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
                    Contact & Address
                  </span>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label htmlFor="cart-customer-name" className="block text-[11px] font-semibold text-ink-primary mb-1">
                        Full Name *
                      </label>
                      <input
                        id="cart-customer-name"
                        type="text"
                        required
                        placeholder="e.g. Babatunde Adeleke"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="cart-customer-phone" className="block text-[11px] font-semibold text-ink-primary mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        id="cart-customer-phone"
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary font-mono focus:outline-none focus:border-brand-emerald shadow-2xs"
                      />
                    </div>

                    {orderType === 'delivery' && (
                      <div>
                        <label htmlFor="cart-delivery-address" className="block text-[11px] font-semibold text-ink-primary mb-1">
                          Delivery Destination Address *
                        </label>
                        <input
                          id="cart-delivery-address"
                          type="text"
                          required
                          placeholder="e.g. 14 Adeola Odeku St, Victoria Island, Lagos"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                        />
                      </div>
                    )}

                    {/* Tip Selection */}
                    <div>
                      <span className="block text-[11px] font-semibold text-ink-primary mb-1">
                        Hearth Crew Hospitality Tip
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            aria-label={`Select ${pct === 0 ? 'no' : pct + '%'} hospitality tip`}
                            onClick={() => setTipPercentage(pct)}
                            className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              tipPercentage === pct
                                ? 'bg-brand-emerald text-white shadow-2xs'
                                : 'bg-surface-canvas hover:bg-surface-muted text-ink-secondary border border-surface-hairline'
                            }`}
                          >
                            {pct === 0 ? 'None' : `${pct}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <label htmlFor="cart-kitchen-notes" className="block text-[11px] font-semibold text-ink-primary mb-1">
                        Kitchen Notes (Optional)
                      </label>
                      <input
                        id="cart-kitchen-notes"
                        type="text"
                        placeholder="e.g. Extra yaji pepper, cutlery included"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs text-xs"
                      />
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 bg-surface-canvas rounded-2xl border border-surface-hairline space-y-2 text-xs">
                    <div className="flex justify-between text-ink-secondary">
                      <span>Subtotal</span>
                      <span className="font-mono text-ink-primary">{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink-secondary">
                      <span>VAT (7.5% Nigerian Sales Tax)</span>
                      <span className="font-mono text-ink-primary">{formatNaira(tax)}</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-ink-secondary">
                        <span>Courier Delivery (Lagos Island / VI)</span>
                        <span className="font-mono text-ink-primary">{formatNaira(deliveryFee)}</span>
                      </div>
                    )}
                    {tip > 0 && (
                      <div className="flex justify-between text-ink-secondary">
                        <span>Hospitality Tip ({tipPercentage}%)</span>
                        <span className="font-mono text-ink-primary">{formatNaira(tip)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-surface-hairline flex justify-between font-bold text-sm text-ink-primary">
                      <span>Estimated Total</span>
                      <span className="font-mono text-brand-emerald font-extrabold">{formatNaira(total)}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="btn-interactive w-full py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Placing Order...' : `Place Order · ${formatNaira(total)}`}</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
};
