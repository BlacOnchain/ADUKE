import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  MapPin,
  Phone,
  Flame,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { RestaurantOrder, OrderStatus, formatNaira } from '../types/restaurant';

interface OrderTrackingSectionProps {
  orders: RestaurantOrder[];
  activeOrderId?: string | null;
  onSelectOrder?: (orderId: string) => void;
  onExploreMenu?: () => void;
}

type TrackingStepKey = 'placed' | 'cooking' | 'ready' | 'completed';

interface TrackingStep {
  key: TrackingStepKey;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  estimatedDuration: string;
}

const STEPS: TrackingStep[] = [
  {
    key: 'placed',
    label: 'Order Confirmed',
    subLabel: 'Transmitted to Victoria Island Hearth',
    icon: Clock,
    estimatedDuration: '0-5 mins',
  },
  {
    key: 'cooking',
    label: 'Preparing & Woodfire Smoking',
    subLabel: 'Smoky firewood sear & artisanal garnishing',
    icon: ChefHat,
    estimatedDuration: '15-25 mins',
  },
  {
    key: 'ready',
    label: 'Ready for Dispatch / Pickup',
    subLabel: 'Insulated packaging & temperature verified',
    icon: PackageCheck,
    estimatedDuration: '5 mins',
  },
  {
    key: 'completed',
    label: 'Out for Delivery / Enjoyed',
    subLabel: 'Courier en route or safely handed over',
    icon: Bike,
    estimatedDuration: 'Final Step',
  },
];

export const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orders,
  activeOrderId,
  onSelectOrder,
  onExploreMenu,
}) => {
  // Select which order to track: either explicitly selected, the most recent, or null
  const selectedOrder =
    (activeOrderId ? orders.find((o) => o.id === activeOrderId) : null) ||
    orders[0] ||
    null;

  // Simulated progression state (0 = Placed, 1 = Preparing/Cooking, 2 = Ready, 3 = Out for Delivery / Completed)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (!selectedOrder) return 1;
    switch (selectedOrder.status) {
      case 'placed':
      case 'confirmed':
        return 0;
      case 'cooking':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 1;
    }
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Reset or initialize step index when the tracked order changes
  useEffect(() => {
    if (selectedOrder) {
      const initialStep =
        selectedOrder.status === 'placed' || selectedOrder.status === 'confirmed'
          ? 0
          : selectedOrder.status === 'cooking'
          ? 1
          : selectedOrder.status === 'ready'
          ? 2
          : 3;
      setCurrentStepIndex(initialStep);
      setIsSimulating(true);
      setLastUpdated(new Date());
    }
  }, [selectedOrder?.id]);

  // Simulated real-time status progression ticker (advances every 14 seconds when simulating)
  useEffect(() => {
    if (!selectedOrder || !isSimulating) return;

    if (currentStepIndex >= STEPS.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        setLastUpdated(new Date());
        return next;
      });
    }, 14000);

    return () => clearTimeout(timer);
  }, [selectedOrder, currentStepIndex, isSimulating]);

  // Demo fallback if no orders exist yet
  const sampleOrder: RestaurantOrder = {
    id: 'demo-order-aduke-001',
    orderNumber: 'ADK-7842',
    items: [
      {
        cartItemId: 'demo-item-1',
        item: {
          id: 'dish-jollof-smoked-goat',
          name: 'Smoked Goat Meat Asun Jollof',
          yorubaName: 'Iresi Jọlọf pẹlu Asun Ewúrẹ́',
          description: 'Long-grain rice steeped in wood-smoked tomato-habanero reduction with slow-braised peppered goat.',
          price: 18500,
          category: 'mains',
          calories: 720,
          prepTimeMinutes: 25,
          tags: ['chef-signature', 'suya-spiced', 'hot-spice'],
          allergens: [],
          pairing: 'Woodfire Palm Wine Sangria',
          available: true,
          image: 'https://blaconchain.github.io/ADUKE/og-image.jpg',
        },
        quantity: 1,
        selectedOptions: [],
        unitPrice: 18500,
        totalPrice: 18500,
      },
      {
        cartItemId: 'demo-item-2',
        item: {
          id: 'drink-palm-wine-sangria',
          name: 'Woodfire Palm Wine Sangria',
          yorubaName: 'Ẹmu Aladun pẹlu Èso',
          description: 'Fresh tapping from Ogun state infused with charred citrus, star anise, and hibiscus reduction.',
          price: 7500,
          category: 'drinks',
          calories: 210,
          prepTimeMinutes: 10,
          tags: ['chef-signature'],
          allergens: [],
          available: true,
          image: 'https://blaconchain.github.io/ADUKE/og-image.jpg',
        },
        quantity: 2,
        selectedOptions: [],
        unitPrice: 7500,
        totalPrice: 15000,
      },
    ],
    orderType: 'delivery',
    customerName: 'Toluwanimi Adeleke',
    customerPhone: '+234 803 456 7890',
    customerEmail: 'toluwanimi@example.com',
    deliveryAddress: '14A Walter Carrington Crescent, Victoria Island, Lagos',
    subtotal: 33500,
    tax: 2512,
    deliveryFee: 3500,
    tip: 1000,
    total: 40512,
    status: 'cooking',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: '30-40 mins',
  };

  const activeOrder = selectedOrder || sampleOrder;
  const isDemo = !selectedOrder;

  return (
    <section
      id="tracking-section"
      aria-labelledby="tracking-heading"
      className="py-20 bg-surface-muted/40 border-t border-b border-surface-hairline relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald-light border border-brand-emerald/20 text-brand-emerald text-xs font-semibold tracking-wide uppercase">
            <Flame aria-hidden="true" className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Live Kitchen Dispatch & Order Tracking</span>
          </div>

          <h2
            id="tracking-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-primary"
          >
            Track Your Culinary Order
          </h2>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Monitor our Victoria Island woodfire hearth in real time — from initial flame sear to insulated doorstep dispatch.
          </p>

          {isDemo && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-canvas border border-surface-hairline text-xs text-ink-muted mt-2">
              <Sparkles aria-hidden="true" className="w-3 h-3 text-brand-brass-dark" />
              <span>Displaying interactive preview simulation. Place an order in your bag to track live!</span>
            </div>
          )}
        </div>

        {/* Multiple Orders Selector Tabs (if customer has placed multiple orders) */}
        {orders.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Select order to track">
            {orders.map((ord) => {
              const isCurrent = ord.id === activeOrder.id;
              return (
                <button
                  key={ord.id}
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => onSelectOrder?.(ord.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                    isCurrent
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-sm'
                      : 'bg-surface-canvas text-ink-secondary border-surface-hairline hover:border-brand-emerald/30'
                  }`}
                >
                  <span className="font-mono">#{ord.orderNumber}</span>
                  <span className="capitalize text-[10px] opacity-80">({ord.orderType})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-surface-canvas rounded-3xl border border-surface-hairline shadow-sm overflow-hidden">
          {/* Card Top Banner: Order Info & Quick Controls */}
          <div className="p-6 sm:p-8 bg-surface-muted/30 border-b border-surface-hairline flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                  ORDER #{activeOrder.orderNumber}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-canvas text-ink-secondary border border-surface-hairline capitalize font-medium">
                  {activeOrder.orderType === 'delivery' ? 'Lagos Courier Delivery' : 'Kitchen Pickup'}
                </span>
                <span className="text-[11px] text-ink-muted flex items-center gap-1">
                  <Clock aria-hidden="true" className="w-3 h-3" />
                  <span>Est. {activeOrder.estimatedDeliveryTime}</span>
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                {activeOrder.customerName}’s Woodfire Feast
              </h3>
              <p className="text-xs text-ink-secondary flex items-center gap-2">
                <span>Ordered: {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>•</span>
                <span className="text-brand-emerald font-medium">
                  Status updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </p>
            </div>

            {/* Simulation Controls for testing interactive timeline */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Simulate:</span>
              {STEPS.map((step, idx) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsSimulating(false);
                    setLastUpdated(new Date());
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                    currentStepIndex === idx
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-xs'
                      : 'bg-surface-canvas text-ink-secondary border-surface-hairline hover:bg-surface-muted'
                  }`}
                  title={`Jump timeline to ${step.label}`}
                >
                  {step.label.split(' ')[0]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsSimulating(true);
                  setLastUpdated(new Date());
                }}
                className="p-1.5 rounded-lg border border-surface-hairline bg-surface-canvas text-ink-secondary hover:text-brand-emerald transition-colors cursor-pointer"
                title="Restart simulated progression"
                aria-label="Restart simulated progression"
              >
                <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline Visualization Section */}
          <div className="p-6 sm:p-10">
            {/* Visual Step Bar (Progress Track) */}
            <div className="relative mb-12">
              {/* Background Connecting Line */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-surface-hairline z-0"
              />
              {/* Active Connecting Fill Line */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-brand-emerald transition-all duration-700 ease-out z-0"
                style={{
                  width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                }}
              />

              {/* Step Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-4 relative z-10">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isUpcoming = index > currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 p-3 rounded-2xl transition-all ${
                        isCurrent
                          ? 'bg-brand-emerald-light/40 border border-brand-emerald/30 shadow-xs'
                          : 'bg-transparent border border-transparent'
                      }`}
                    >
                      {/* Node Icon Circle */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-brand-emerald text-white shadow-md'
                            : isCurrent
                            ? 'bg-brand-emerald text-white ring-4 ring-brand-emerald/20 shadow-md scale-105'
                            : 'bg-surface-muted text-ink-muted border border-surface-hairline'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 aria-hidden="true" className="w-6 h-6" />
                        ) : (
                          <Icon aria-hidden="true" className="w-5 h-5" />
                        )}
                      </div>

                      {/* Node Label & Description */}
                      <div className="space-y-1">
                        <div className="flex items-center md:justify-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold tracking-wider uppercase ${
                              isCurrent
                                ? 'text-brand-emerald'
                                : isCompleted
                                ? 'text-ink-primary'
                                : 'text-ink-muted'
                            }`}
                          >
                            Step 0{index + 1}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-terracotta text-white animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <h4
                          className={`font-display text-sm font-bold ${
                            isCurrent
                              ? 'text-brand-emerald-dark'
                              : isCompleted
                              ? 'text-ink-primary'
                              : 'text-ink-secondary'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-ink-secondary leading-snug">
                          {step.subLabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Status Live Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-emerald/10 via-surface-muted to-brand-terracotta/10 border border-brand-emerald/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-brand-emerald animate-ping" />
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-brand-emerald">
                    Current Milestone: {STEPS[currentStepIndex].label}
                  </h5>
                  <p className="text-xs text-ink-secondary">
                    {currentStepIndex === 0 && 'Order has been acknowledged by Chef Aduke and queue assigned.'}
                    {currentStepIndex === 1 && 'Hearth smoking and reduction simmering are actively underway in Victoria Island.'}
                    {currentStepIndex === 2 && 'Plating is finalized, packed in heat-retaining containers, awaiting dispatch.'}
                    {currentStepIndex === 3 && 'Order is out for courier transit. Enjoy the flavors of Lagos!'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-brand-emerald bg-white px-3.5 py-2 rounded-xl shadow-xs border border-brand-emerald/10">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-brand-emerald" />
                <span>Woodfire Temperature Monitored</span>
              </div>
            </div>

            {/* Order Summary & Destination Details */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-surface-hairline">
              {/* Delivery / Destination Details */}
              <div className="space-y-4">
                <h5 className="font-display text-sm font-bold text-ink-primary flex items-center gap-2">
                  <MapPin aria-hidden="true" className="w-4 h-4 text-brand-terracotta" />
                  <span>Destination & Contact</span>
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-hairline space-y-1">
                    <span className="text-ink-muted text-[11px] block font-mono">Recipient</span>
                    <p className="font-semibold text-ink-primary">{activeOrder.customerName}</p>
                    <p className="text-ink-secondary flex items-center gap-1.5">
                      <Phone aria-hidden="true" className="w-3 h-3" />
                      <span>{activeOrder.customerPhone}</span>
                    </p>
                  </div>
                  {activeOrder.deliveryAddress && (
                    <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-hairline space-y-1">
                      <span className="text-ink-muted text-[11px] block font-mono">Delivery Address</span>
                      <p className="text-ink-secondary font-medium leading-relaxed">
                        {activeOrder.deliveryAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="lg:col-span-2 space-y-4">
                <h5 className="font-display text-sm font-bold text-ink-primary flex items-center justify-between">
                  <span>Selected Dishes ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="font-mono text-brand-emerald text-xs">{formatNaira(activeOrder.total)}</span>
                </h5>

                <div className="divide-y divide-surface-hairline/60 rounded-2xl bg-surface-muted/40 border border-surface-hairline overflow-hidden">
                  {activeOrder.items.map((cartItem) => (
                    <div key={cartItem.cartItemId} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-surface-canvas border border-surface-hairline flex items-center justify-center font-mono font-bold text-[11px] text-ink-primary shrink-0">
                          {cartItem.quantity}×
                        </span>
                        <div className="min-w-0 truncate">
                          <p className="font-semibold text-ink-primary truncate">{cartItem.item.name}</p>
                          {cartItem.item.yorubaName && (
                            <p className="text-[11px] text-ink-muted truncate italic font-serif">
                              {cartItem.item.yorubaName}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-medium text-ink-primary shrink-0">
                        {formatNaira(cartItem.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-ink-muted">
                    Questions about your preparation? Call Victoria Island concierge at{' '}
                    <a href="tel:+23412345678" className="text-brand-emerald font-semibold underline underline-offset-2">
                      +234 1 234 5678
                    </a>
                  </p>
                  {onExploreMenu && (
                    <button
                      type="button"
                      onClick={onExploreMenu}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald hover:text-brand-emerald-dark transition-colors cursor-pointer"
                    >
                      <span>Explore more dishes</span>
                      <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
