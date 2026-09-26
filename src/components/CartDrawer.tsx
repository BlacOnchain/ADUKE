import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, Utensils, QrCode, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CartItem, OrderType, RestaurantOrder, TableSession, formatNaira } from '../types/restaurant';
import { restaurantDB } from '../data/db';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: RestaurantOrder) => void;
  activeTableSession?: TableSession | null;
  onOpenAuth?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  activeTableSession,
  onOpenAuth,
}) => {
  const { currentUser } = useAuth();
  const [orderType, setOrderType] = useState<OrderType>(
    activeTableSession ? 'dine-in-table' : 'delivery'
  );
  const [customerName, setCustomerName] = useState(activeTableSession?.guestName || '');
  const [customerPhone, setCustomerPhone] = useState('+234 803 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState(activeTableSession?.tableNumber || 'Table 4');
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTableSession) {
      setOrderType('dine-in-table');
      setTableNumber(activeTableSession.tableNumber);
      if (activeTableSession.guestName) {
        setCustomerName(activeTableSession.guestName);
      }
    }
  }, [activeTableSession]);

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
      setCheckoutError('Please provide your name and contact phone number for order updates.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setCheckoutError('Please provide your Lagos delivery destination address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = restaurantDB.createOrder({
        items,
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'guest@aduke.lagos.ng',
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        tableNumber: (orderType === 'dine-in-table' || orderType === 'dine-in-ahead') ? tableNumber.trim() : undefined,
        subtotal,
        tax,
        deliveryFee,
        tip,
        total,
        specialNotes: specialNotes.trim() || undefined,
      });

      // Auto-subscribe order to real-time status notifications
      try {
        notificationService.subscribeToOrder(order.id);
        if (notificationService.isSupported() && notificationService.getPermission() === 'default') {
          notificationService.requestPermission().catch(() => {});
        }
      } catch {}

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
                  {items.length} {items.length === 1 ? 'item' : 'items'} · Curated in Lagos
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAFAF7] border border-[#E8E6DD] text-[#8C8A82] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg text-[#121110] font-semibold">Your bag is empty</p>
                  <p className="text-xs text-[#595852]">
                    Explore our woodfire smoked jollof, tiger prawns, and traditional swallows to start your order.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-xl hover:bg-[#0D3823] transition-colors cursor-pointer shadow-2xs"
                >
                  Explore Offerings
                </button>
              </div>
            ) : !currentUser ? (
              <div className="p-8 text-center space-y-5 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center mx-auto shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display text-lg font-bold text-[#121110]">Account Required to Order</h4>
                  <p className="text-xs text-[#595852] max-w-xs mx-auto">
                    Please sign in or create a guest account to dispatch your order and track live kitchen preparation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In or Sign Up Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Active Table Notification if ordering directly to a table */}
                {activeTableSession && (
                  <div className="p-3 bg-[#DCFCE7] border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-[#14532D]">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      <span className="font-bold">Ordering direct to {activeTableSession.tableNumber}</span>
                    </div>
                    <span className="font-mono text-[11px]">Table Locked</span>
                  </div>
                )}

                {/* Fulfillment Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C8A82]">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in-table')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        orderType === 'dine-in-table'
                          ? 'border-[#14532D] bg-[#DCFCE7]/50 text-[#121110] font-bold shadow-2xs'
                          : 'border-[#E8E6DD] text-[#595852] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      <Utensils className="w-4 h-4 text-[#14532D]" />
                      <span className="text-[11px]">Dine-In Table</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        orderType === 'delivery'
                          ? 'border-[#14532D] bg-[#DCFCE7]/50 text-[#121110] font-bold shadow-2xs'
                          : 'border-[#E8E6DD] text-[#595852] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-[#14532D]" />
                      <span className="text-[11px]">Lagos Dispatch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        orderType === 'pickup'
                          ? 'border-[#14532D] bg-[#DCFCE7]/50 text-[#121110] font-bold shadow-2xs'
                          : 'border-[#E8E6DD] text-[#595852] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#14532D]" />
                      <span className="text-[11px]">Self Pick-Up</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#E8E6DD]">
                    <span className="font-semibold text-[#121110]">Selected Dishes</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[#8C8A82] hover:text-rose-600 transition-colors"
                    >
                      Clear Bag
                    </button>
                  </div>

                  <div className="divide-y divide-[#F0EFEB]">
                    {items.map((cartItem) => (
                      <div key={cartItem.cartItemId} className="py-3 flex gap-3">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-[#FAFAF7] border border-[#E8E6DD] shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-xs font-bold text-[#121110] leading-snug">
                              {cartItem.item.name}
                            </h4>
                            <span className="font-mono text-xs font-bold text-[#121110] shrink-0">
                              {formatNaira(cartItem.totalPrice)}
                            </span>
                          </div>

                          {cartItem.selectedOptions.length > 0 && (
                            <p className="text-[11px] text-[#14532D] font-medium leading-tight">
                              {cartItem.selectedOptions.map((o) => o.optionName).join(', ')}
                            </p>
                          )}

                          {cartItem.specialInstructions && (
                            <p className="text-[10px] text-[#8C8A82] italic">
                              "{cartItem.specialInstructions}"
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                                className="p-1 hover:bg-white rounded text-[#595852] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold px-1.5 text-[#121110]">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                                className="p-1 hover:bg-white rounded text-[#595852] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(cartItem.cartItemId)}
                              className="text-[11px] text-[#8C8A82] hover:text-rose-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Guest Info Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#E8E6DD]">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#121110]">Guest Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Folashade Adeleke"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#121110]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  {orderType === 'dine-in-table' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#121110]">Dining Table Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Table 4"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#DCFCE7]/30 border border-emerald-300 rounded-xl text-[#14532D] focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#121110]">Lagos Delivery Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 18 Bourdillon Road, Ikoyi, Lagos"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#121110]">Chef Notes / Spice Preference</label>
                    <input
                      type="text"
                      placeholder="e.g. Extra yaji pepper, extra dodo, sauce on the side"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  {/* Gratuity */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#595852]">
                      <span className="font-semibold text-[#121110]">Kitchen & Floor Gratuity</span>
                      <span className="font-mono text-[#14532D] font-bold">{formatNaira(tip)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 10, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTipPercentage(pct)}
                          className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                            tipPercentage === pct
                              ? 'bg-[#14532D] text-white border-[#14532D] font-bold'
                              : 'bg-white border-[#E8E6DD] text-[#595852] hover:bg-[#FAFAF7]'
                          }`}
                        >
                          {pct === 0 ? 'None' : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#595852]">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#121110] font-semibold">{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#595852]">
                      <span>Nigerian VAT (7.5%)</span>
                      <span className="font-mono text-[#121110] font-semibold">{formatNaira(tax)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex items-center justify-between text-[#595852]">
                        <span>Island Express Courier</span>
                        <span className="font-mono text-[#121110] font-semibold">{formatNaira(deliveryFee)}</span>
                      </div>
                    )}
                    {tip > 0 && (
                      <div className="flex items-center justify-between text-[#595852]">
                        <span>Staff Gratuity ({tipPercentage}%)</span>
                        <span className="font-mono text-[#121110] font-semibold">{formatNaira(tip)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-[#E8E6DD] flex items-center justify-between font-bold text-sm text-[#121110]">
                      <span>Grand Total</span>
                      <span className="font-mono text-base text-[#14532D]">{formatNaira(total)}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Transmitting Ticket to Kitchen...' : `Dispatch Order · ${formatNaira(total)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
