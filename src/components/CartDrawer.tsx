import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, Utensils, CheckCircle2 } from 'lucide-react';
import { CartItem, OrderType, RestaurantOrder } from '../types/restaurant';
import { restaurantDB } from '../data/db';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: RestaurantOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const tax = subtotal * 0.08875; // Sales tax
  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? 5.0 : 0.0;
  const tip = (subtotal * tipPercentage) / 100;
  const total = subtotal + tax + deliveryFee + tip;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for order updates.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please provide your delivery destination address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = restaurantDB.createOrder({
        items,
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'guest@example.com',
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        tableNumber: orderType === 'dine-in-ahead' ? tableNumber.trim() : undefined,
        subtotal,
        tax,
        deliveryFee,
        tip,
        total,
        specialNotes: specialNotes.trim() || undefined,
      });

      setIsSubmitting(false);
      onClearCart();
      onClose();

      // Confetti celebration
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

      onOrderPlaced(order);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E6DD] text-[#121110] flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E6DD] flex items-center justify-between bg-[#FAFAF7]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#121110]">Your Culinary Bag</h3>
                <span className="text-[11px] text-[#8C8A82] font-mono tabular-nums">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8C8A82] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAFAF7] border border-[#E8E6DD] text-[#8C8A82] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg text-[#121110] font-semibold">Your bag is empty</p>
                  <p className="text-xs text-[#595852]">
                    Explore our wood-smoked party jollof, tender suya skewers, and fresh palm wine.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#14532D] hover:bg-[#0D3823] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Order Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#121110] uppercase tracking-wider">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-[#14532D] text-white shadow-xs'
                          : 'text-[#595852] hover:text-[#121110]'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-[#14532D] text-white shadow-xs'
                          : 'text-[#595852] hover:text-[#121110]'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Pickup</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in-ahead')}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderType === 'dine-in-ahead'
                          ? 'bg-[#14532D] text-white shadow-xs'
                          : 'text-[#595852] hover:text-[#121110]'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Dine-In</span>
                    </button>
                  </div>
                </div>

                {/* Item List */}
                <div className="space-y-3 divide-y divide-[#F0EFEB]">
                  {items.map((cartItem) => (
                    <div key={cartItem.cartItemId} className="pt-3 first:pt-0 flex gap-3.5">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-[#F4F3ED] shrink-0 border border-[#E8E6DD]"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display text-xs font-bold text-[#121110] truncate">
                            {cartItem.item.name}
                          </h4>
                          <span className="font-mono text-xs font-bold tabular-nums text-[#121110] shrink-0">
                            ${cartItem.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Customizations tags */}
                        {cartItem.selectedOptions.length > 0 && (
                          <div className="text-[11px] text-[#14532D] font-medium leading-tight">
                            {cartItem.selectedOptions.map((opt) => opt.optionName).join(', ')}
                          </div>
                        )}

                        {cartItem.specialInstructions && (
                          <p className="text-[11px] text-[#8C8A82] italic truncate">
                            Note: {cartItem.specialInstructions}
                          </p>
                        )}

                        {/* Quantity Adjuster & Remove */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 bg-[#FAFAF7] border border-[#E8E6DD] rounded-lg px-2 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                              className="p-0.5 hover:text-[#14532D] transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs tabular-nums w-4 text-center font-bold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                              className="p-0.5 hover:text-[#14532D] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(cartItem.cartItemId)}
                            className="text-xs text-[#8C8A82] hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="pt-4 border-t border-[#E8E6DD] space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#121110]">
                    Guest Details
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="Street Address, Apt / Suite *"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                    />
                  )}

                  {orderType === 'dine-in-ahead' && (
                    <input
                      type="text"
                      placeholder="Table / Bar Number (e.g. Table 4 or Veranda #2)"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Culinary notes / dietary restrictions (optional)"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                {/* Gratuity */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#595852]">
                    <span className="font-medium">Kitchen & Service Gratuity</span>
                    <span className="font-mono tabular-nums font-bold text-[#121110]">${tip.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15, 18, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTipPercentage(pct)}
                        className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          tipPercentage === pct
                            ? 'border-[#14532D] bg-[#DCFCE7] text-[#14532D] font-bold shadow-2xs'
                            : 'border-[#E8E6DD] bg-[#FAFAF7] text-[#595852] hover:text-[#121110]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtotal & Breakdown */}
                <div className="pt-4 border-t border-[#E8E6DD] space-y-2 text-xs text-[#595852]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-[#121110] font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated Tax (8.875%)</span>
                    <span className="font-mono tabular-nums text-[#121110] font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex items-center justify-between">
                      <span>Curated Insulated Courier</span>
                      <span className="font-mono tabular-nums text-[#121110] font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Gratuity ({tipPercentage}%)</span>
                    <span className="font-mono tabular-nums text-[#121110] font-medium">${tip.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E6DD] text-sm font-bold text-[#121110]">
                    <span>Total Amount</span>
                    <span className="font-mono text-base text-[#14532D] tabular-nums">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E6DD] bg-[#FAFAF7] space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-950/15 flex items-center justify-between cursor-pointer"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order Online'}</span>
                <span className="font-mono tabular-nums font-bold flex items-center gap-1.5">
                  ${total.toFixed(2)}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
              <p className="text-[11px] text-center text-[#8C8A82]">
                Seamless online ordering with live tracking updates.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
