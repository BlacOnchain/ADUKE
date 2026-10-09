import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ShoppingBag,
  History,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { RestaurantOrder, OrderStatus, formatNaira, CartItem } from '../types/restaurant';

interface OrderTrackingSectionProps {
  orders: RestaurantOrder[];
  activeOrderId?: string | null;
  onSelectOrder?: (orderId: string) => void;
  onExploreMenu?: () => void;
  onReorder?: (items: CartItem[]) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
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
    subLabel: 'Smoky firewood sear & artisanal seasoning',
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
    subLabel: 'Courier dispatched or safely handed over',
    icon: Bike,
    estimatedDuration: 'Final Step',
  },
];

/**
 * Calculates current real progression step (0 to 3) from the order's creation timestamp.
 * - 0 - 45s: 'placed' (Step 0)
 * - 45s - 120s: 'cooking' (Step 1)
 * - 120s - 240s: 'ready' (Step 2)
 * - >= 240s: 'completed' (Step 3)
 */
function computeStepFromTimestamp(createdAtIso: string, manualStatus?: OrderStatus): { step: number; status: OrderStatus } {
  // If explicitly marked as completed or ready in stored status, don't regress
  if (manualStatus === 'completed') return { step: 3, status: 'completed' };
  if (manualStatus === 'ready') return { step: 2, status: 'ready' };

  const createdTime = new Date(createdAtIso).getTime();
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));

  if (elapsedSeconds < 45) {
    return { step: 0, status: 'placed' };
  }
  if (elapsedSeconds < 120) {
    return { step: 1, status: 'cooking' };
  }
  if (elapsedSeconds < 240) {
    return { step: 2, status: 'ready' };
  }
  return { step: 3, status: 'completed' };
}

export const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orders,
  activeOrderId,
  onSelectOrder,
  onExploreMenu,
  onReorder,
  onUpdateOrderStatus,
}) => {
  // Tab switcher: Active live tracker vs Past Order history
  const [activeTab, setActiveTab] = useState<'tracker' | 'history'>('tracker');

  // Select order to track: either explicitly chosen or the most recent order
  const selectedOrder = useMemo(() => {
    if (activeOrderId) {
      const found = orders.find((o) => o.id === activeOrderId);
      if (found) return found;
    }
    return orders.length > 0 ? orders[0] : null;
  }, [orders, activeOrderId]);

  // Compute current step based on real elapsed time from order creation
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (!selectedOrder) return 0;
    return computeStepFromTimestamp(selectedOrder.createdAt, selectedOrder.status).step;
  });

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const prevStepRef = useRef<number>(currentStepIndex);
  const activeOrderRef = useRef<string | null>(selectedOrder?.id || null);

  // Sync when selected order switches
  useEffect(() => {
    if (selectedOrder) {
      const { step } = computeStepFromTimestamp(selectedOrder.createdAt, selectedOrder.status);
      setCurrentStepIndex(step);
      prevStepRef.current = step;
      activeOrderRef.current = selectedOrder.id;
      setLastSyncTime(new Date());
    } else {
      activeOrderRef.current = null;
    }
  }, [selectedOrder?.id]);

  // Real-time automatic progress tick based on order createdAt
  useEffect(() => {
    if (!selectedOrder) return;

    const checkProgression = () => {
      const { step: nextStep, status: nextStatus } = computeStepFromTimestamp(
        selectedOrder.createdAt,
        selectedOrder.status
      );

      setLastSyncTime(new Date());

      setCurrentStepIndex((prevStep) => {
        if (prevStep !== nextStep) {
          // Trigger toast notifications when entering Ready or Out for Delivery
          if (nextStep === 2 && prevStep < 2) {
            toast.success(`Order #${selectedOrder.orderNumber} is Ready!`, {
              description: 'Insulated packaging verified at our Victoria Island hearth.',
              duration: 4500,
            });
          } else if (nextStep === 3 && prevStep < 3) {
            toast.info(`Order #${selectedOrder.orderNumber} Out for Delivery`, {
              description: 'Our executive courier is en route to your destination.',
              duration: 5000,
            });
          }

          // Persist status update to parent state and localStorage
          if (onUpdateOrderStatus && selectedOrder.status !== nextStatus) {
            onUpdateOrderStatus(selectedOrder.id, nextStatus);
          }

          return nextStep;
        }
        return prevStep;
      });
    };

    // Run immediate check and then every 4 seconds
    checkProgression();
    const interval = setInterval(checkProgression, 4000);

    return () => clearInterval(interval);
  }, [selectedOrder?.id, selectedOrder?.createdAt, selectedOrder?.status, selectedOrder?.orderNumber, onUpdateOrderStatus]);

  const handleReorderClick = (order: RestaurantOrder) => {
    if (onReorder) {
      onReorder(order.items);
      toast.success('Dishes added to your dining bag', {
        description: `${order.items.length} dish(es) from Order #${order.orderNumber} added.`,
      });
    }
  };

  const handleManualRefresh = () => {
    if (selectedOrder) {
      const { step, status } = computeStepFromTimestamp(selectedOrder.createdAt, selectedOrder.status);
      setCurrentStepIndex(step);
      setLastSyncTime(new Date());
      if (onUpdateOrderStatus && selectedOrder.status !== status) {
        onUpdateOrderStatus(selectedOrder.id, status);
      }
      toast.info('Order status refreshed', {
        description: `Order #${selectedOrder.orderNumber} status checked with hearth dispatch.`,
        duration: 2000,
      });
    }
  };

  return (
    <section
      id="tracking-section"
      aria-labelledby="tracking-heading"
      className="py-20 bg-surface-muted/40 border-t border-b border-surface-hairline relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald-light border border-brand-emerald/20 text-brand-emerald text-xs font-semibold tracking-wide uppercase">
            <Flame aria-hidden="true" className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Kitchen Dispatch & Guest Order Hub</span>
          </div>

          <h2
            id="tracking-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-primary"
          >
            Track & Re-order Dining
          </h2>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Follow our Victoria Island woodfire hearth in real time or re-order your favorite culinary curations with one click.
          </p>

          {/* Navigation view toggle: Live Tracking vs Past Orders */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                activeTab === 'tracker'
                  ? 'bg-brand-emerald text-white border-brand-emerald shadow-xs'
                  : 'bg-surface-canvas text-ink-secondary border-surface-hairline hover:bg-surface-muted'
              }`}
            >
              Live Order Tracker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'history'
                  ? 'bg-brand-emerald text-white border-brand-emerald shadow-xs'
                  : 'bg-surface-canvas text-ink-secondary border-surface-hairline hover:bg-surface-muted'
              }`}
            >
              <History aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Past Orders ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE ORDER TRACKER */}
        {activeTab === 'tracker' && (
          <div>
            {/* If NO orders have been placed yet (fresh state) */}
            {!selectedOrder ? (
              <div className="max-w-2xl mx-auto bg-surface-canvas rounded-2xl border border-surface-hairline p-8 sm:p-12 text-center shadow-xs space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald-light/60 border border-brand-emerald/20 flex items-center justify-center mx-auto text-brand-emerald">
                  <PackageCheck aria-hidden="true" className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-ink-primary">
                    No Active Orders in Progress
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed max-w-lg mx-auto">
                    You haven’t placed an order yet. Select signature dishes from our woodfire culinary menu and place an order to track live preparation, hearth searing, and courier dispatch right here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2 pb-2">
                  <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-hairline text-xs space-y-1">
                    <span className="font-semibold text-ink-primary block">1. Hearth Fire</span>
                    <span className="text-ink-secondary text-[11px] leading-tight">Live tracking as your jollof & suya are smoked.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-hairline text-xs space-y-1">
                    <span className="font-semibold text-ink-primary block">2. Chef Plating</span>
                    <span className="text-ink-secondary text-[11px] leading-tight">Insulated temperature-verified packaging.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-hairline text-xs space-y-1">
                    <span className="font-semibold text-ink-primary block">3. Fast Dispatch</span>
                    <span className="text-ink-secondary text-[11px] leading-tight">Direct Lagos courier or kitchen pickup.</span>
                  </div>
                </div>

                {onExploreMenu && (
                  <button
                    type="button"
                    onClick={onExploreMenu}
                    className="btn-interactive px-6 py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
                  >
                    <ShoppingBag aria-hidden="true" className="w-4 h-4" />
                    <span>Explore Culinary Menu & Order Now</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            ) : (
              /* ACTIVE REAL ORDER VIEW */
              <div>
                {/* Multiple Orders Selector Tabs */}
                {orders.length > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6" role="tablist" aria-label="Select order to track">
                    {orders.map((ord) => {
                      const isCurrent = ord.id === selectedOrder.id;
                      return (
                        <button
                          key={ord.id}
                          role="tab"
                          aria-selected={isCurrent}
                          onClick={() => onSelectOrder?.(ord.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                            isCurrent
                              ? 'bg-brand-emerald text-white border-brand-emerald shadow-xs'
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
                <div className="bg-surface-canvas rounded-2xl border border-surface-hairline shadow-sm overflow-hidden text-left">
                  {/* Card Top Banner with Live Status */}
                  <div className="p-6 sm:p-8 bg-surface-muted/30 border-b border-surface-hairline flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                          ORDER #{selectedOrder.orderNumber}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-canvas text-ink-secondary border border-surface-hairline capitalize font-medium">
                          {selectedOrder.orderType === 'delivery' ? 'Lagos Courier Delivery' : 'Kitchen Pickup'}
                        </span>
                        <span className="text-[11px] text-ink-muted flex items-center gap-1">
                          <Clock aria-hidden="true" className="w-3 h-3" />
                          <span>Est. {selectedOrder.estimatedDeliveryTime}</span>
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                        {selectedOrder.customerName}’s Woodfire Order
                      </h3>
                      <p className="text-xs text-ink-secondary flex items-center gap-2">
                        <span>Ordered: {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="text-brand-emerald font-medium">
                          Status: {STEPS[currentStepIndex]?.label || selectedOrder.status}
                        </span>
                      </p>
                    </div>

                    {/* Live Status and Refresh Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald-light border border-brand-emerald/20 text-brand-emerald text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-brand-emerald" />
                        <span>Live Hearth Dispatch</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleManualRefresh}
                        className="p-2 rounded-xl border border-surface-hairline bg-surface-canvas text-ink-secondary hover:text-brand-emerald hover:border-brand-emerald/30 transition-colors cursor-pointer"
                        title="Refresh live status from kitchen"
                        aria-label="Refresh live status from kitchen"
                      >
                        <RefreshCw aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Timeline Visualization Section */}
                  <div className="p-6 sm:p-10">
                    {/* Visual Step Bar */}
                    <div className="relative mb-12">
                      <div
                        aria-hidden="true"
                        className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-surface-hairline z-0"
                      />
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

                          return (
                            <div
                              key={step.key}
                              className={`flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 p-3 rounded-xl transition-all ${
                                isCurrent
                                  ? 'bg-brand-emerald-light/30 border border-brand-emerald/30'
                                  : 'bg-transparent border border-transparent'
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                  isCompleted
                                    ? 'bg-brand-emerald text-white'
                                    : isCurrent
                                    ? 'bg-brand-emerald text-white ring-2 ring-brand-emerald/20 shadow-xs'
                                    : 'bg-surface-muted text-ink-muted border border-surface-hairline'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 aria-hidden="true" className="w-6 h-6" />
                                ) : (
                                  <Icon aria-hidden="true" className="w-5 h-5" />
                                )}
                              </div>

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
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-terracotta text-white">
                                      Current
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

                    {/* Milestone Detail Callout */}
                    <div className="p-4 sm:p-5 rounded-xl bg-surface-muted/60 border border-surface-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald shrink-0" />
                        <div>
                          <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-brand-emerald">
                            Milestone: {STEPS[currentStepIndex]?.label || selectedOrder.status}
                          </h5>
                          <p className="text-xs text-ink-secondary">
                            {currentStepIndex === 0 && 'Order has been acknowledged by Chef Aduke and hearth queue assigned.'}
                            {currentStepIndex === 1 && 'Hearth smoking and reduction simmering are actively underway in Victoria Island.'}
                            {currentStepIndex === 2 && 'Plating is finalized, packed in heat-retaining containers, awaiting courier dispatch.'}
                            {currentStepIndex === 3 && 'Order is out for courier transit. Enjoy the rich flavors of Lagos!'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-brand-emerald bg-surface-canvas px-3.5 py-2 rounded-xl border border-surface-hairline">
                        <ShieldCheck aria-hidden="true" className="w-4 h-4 text-brand-emerald" />
                        <span>Hearth Temperature Monitored</span>
                      </div>
                    </div>

                    {/* Order Summary & Destination Details */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-surface-hairline">
                      <div className="space-y-4">
                        <h5 className="font-display text-sm font-bold text-ink-primary flex items-center gap-2">
                          <MapPin aria-hidden="true" className="w-4 h-4 text-brand-terracotta" />
                          <span>Destination & Contact</span>
                        </h5>
                        <div className="space-y-2 text-xs">
                          <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-hairline space-y-1">
                            <span className="text-ink-muted text-[11px] block font-mono">Recipient</span>
                            <p className="font-semibold text-ink-primary">{selectedOrder.customerName}</p>
                            <p className="text-ink-secondary flex items-center gap-1.5">
                              <Phone aria-hidden="true" className="w-3 h-3" />
                              <span>{selectedOrder.customerPhone}</span>
                            </p>
                          </div>
                          {selectedOrder.deliveryAddress && (
                            <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-hairline space-y-1">
                              <span className="text-ink-muted text-[11px] block font-mono">Delivery Address</span>
                              <p className="text-ink-secondary font-medium leading-relaxed">
                                {selectedOrder.deliveryAddress}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Quick Re-order of this active order */}
                        <button
                          type="button"
                          onClick={() => handleReorderClick(selectedOrder)}
                          className="btn-interactive w-full py-2.5 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-dark transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag aria-hidden="true" className="w-3.5 h-3.5" />
                          <span>Re-order These Items</span>
                        </button>
                      </div>

                      <div className="lg:col-span-2 space-y-4">
                        <h5 className="font-display text-sm font-bold text-ink-primary flex items-center justify-between">
                          <span>Selected Dishes ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)})</span>
                          <span className="font-mono text-brand-emerald text-xs font-bold">{formatNaira(selectedOrder.total)}</span>
                        </h5>

                        <div className="divide-y divide-surface-hairline/60 rounded-xl bg-surface-muted/30 border border-surface-hairline overflow-hidden">
                          {selectedOrder.items.map((cartItem) => (
                            <div key={cartItem.cartItemId} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-md bg-surface-canvas border border-surface-hairline flex items-center justify-center font-mono font-bold text-[11px] text-ink-primary shrink-0">
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
                            Need order assistance? Call concierge at{' '}
                            <a href="tel:+23412345678" className="text-brand-emerald font-semibold hover:underline">
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
            )}
          </div>
        )}

        {/* TAB 2: PAST ORDERS HISTORY VIEW */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl mx-auto text-left">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-surface-canvas rounded-2xl border border-surface-hairline space-y-4">
                <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center mx-auto text-ink-muted">
                  <History aria-hidden="true" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-ink-primary">No Past Orders Found</h4>
                  <p className="text-xs text-ink-secondary mt-1">
                    When you order from Àdùkẹ́, your past feasts will appear here for fast 1-click re-ordering.
                  </p>
                </div>
                {onExploreMenu && (
                  <button
                    type="button"
                    onClick={onExploreMenu}
                    className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>Browse Culinary Menu</span>
                    <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              orders.map((ord) => {
                const totalItemCount = ord.items.reduce((sum, item) => sum + item.quantity, 0);
                const orderDate = new Date(ord.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={ord.id}
                    className="p-5 sm:p-6 bg-surface-canvas rounded-2xl border border-surface-hairline shadow-xs hover:border-brand-emerald/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-muted text-ink-primary border border-surface-hairline">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-ink-muted flex items-center gap-1">
                          <Calendar aria-hidden="true" className="w-3 h-3" />
                          <span>{orderDate}</span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-brand-emerald-light text-brand-emerald font-semibold capitalize">
                          {ord.status}
                        </span>
                        <span className="text-[11px] text-ink-muted capitalize">
                          ({ord.orderType})
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="text-xs text-ink-secondary space-y-1">
                        <p className="font-medium text-ink-primary">
                          {ord.items.map((it) => `${it.quantity}× ${it.item.name}`).join(', ')}
                        </p>
                        <p className="text-[11px] text-ink-muted">
                          {totalItemCount} item(s) · {ord.customerName}
                          {ord.deliveryAddress && ` · ${ord.deliveryAddress}`}
                        </p>
                      </div>

                      <div className="font-mono font-bold text-sm text-brand-emerald">
                        {formatNaira(ord.total)}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectOrder?.(ord.id);
                          setActiveTab('tracker');
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 border border-surface-hairline hover:bg-surface-muted text-ink-secondary rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                      >
                        View in Tracker
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorderClick(ord)}
                        className="btn-interactive flex-1 sm:flex-none px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>Re-order</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </section>
  );
};
