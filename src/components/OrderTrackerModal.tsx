import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  Clock,
  MapPin,
  ChefHat,
  Sparkles,
  Bell,
  BellRing,
  Volume2,
  Send,
  AlertCircle
} from 'lucide-react';
import { RestaurantOrder, OrderStatus, formatNaira } from '../types/restaurant';
import { restaurantDB } from '../data/db';
import { notificationService } from '../services/notificationService';

interface OrderTrackerModalProps {
  order: RestaurantOrder | null;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const [permission, setPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() =>
    notificationService.isSubscribedToOrder(order.id)
  );
  const [subscribing, setSubscribing] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setIsSubscribed(notificationService.isSubscribedToOrder(order.id));
    if (notificationService.isSupported()) {
      setPermission(notificationService.getPermission());
    }

    const unsub = notificationService.subscribe(() => {
      setIsSubscribed(notificationService.isSubscribedToOrder(order.id));
      if (notificationService.isSupported()) {
        setPermission(notificationService.getPermission());
      }
    });

    return () => unsub();
  }, [order.id]);

  const handleToggleSubscription = async () => {
    if (permission !== 'granted') {
      setSubscribing(true);
      const res = await notificationService.requestPermission();
      setPermission(res);
      setSubscribing(false);
      if (res === 'granted') {
        notificationService.subscribeToOrder(order.id);
        setIsSubscribed(true);
      }
      return;
    }

    if (isSubscribed) {
      notificationService.unsubscribeFromOrder(order.id);
      setIsSubscribed(false);
    } else {
      notificationService.subscribeToOrder(order.id);
      setIsSubscribed(true);
      notificationService.playChime();
    }
  };

  const handleSendTestNotification = () => {
    notificationService.sendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  const stages: { status: OrderStatus; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      status: 'placed',
      title: 'Order Placed',
      subtitle: 'Received by the kitchen host station in Victoria Island.',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      status: 'confirmed',
      title: 'Confirmed by Grill Master & Head Chef',
      subtitle: 'Prime cuts seasoned with northern yaji and organic spices.',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      status: 'cooking',
      title: 'Over Firewood & Charcoal Embers',
      subtitle: 'Smoky jollof simmering and suya skewers searing over white oak.',
      icon: <Flame className="w-4 h-4 text-[#C2410C]" />,
    },
    {
      status: 'ready',
      title: order.orderType === 'delivery' ? 'Dispatched with Insulated Courier' : 'Plated & Ready at Host Stand',
      subtitle: order.orderType === 'delivery' ? 'Temperature-controlled courier en route.' : 'Awaiting guest at host counter.',
      icon: order.orderType === 'delivery' ? <Bike className="w-4 h-4 text-[#14532D]" /> : <PackageCheck className="w-4 h-4 text-[#14532D]" />,
    },
    {
      status: 'completed',
      title: 'Delivered & Enjoyed',
      subtitle: 'Ẹ gbádùn oúnjẹ yín! Enjoy your meal from team Àdùkẹ́.',
      icon: <CheckCircle2 className="w-4 h-4 text-[#14532D]" />,
    },
  ];

  const stageOrder: OrderStatus[] = ['placed', 'confirmed', 'cooking', 'ready', 'completed'];
  const currentStageIndex = stageOrder.indexOf(order.status);

  const handleAdvance = () => {
    if (currentStageIndex < stageOrder.length - 1) {
      const nextStatus = stageOrder[currentStageIndex + 1];
      restaurantDB.updateOrderStatus(order.id, nextStatus);
      if (onStatusChange) onStatusChange(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-[#E8E6DD] rounded-3xl overflow-hidden shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#FAFAF7] border-b border-[#E8E6DD] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-[#121110]">
                Live Order Tracking
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#14532D] animate-pulse" />
            </div>
            <p className="text-xs text-[#8C8A82] font-mono">
              Order #{order.orderNumber} · {order.orderType.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close tracker"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-[#E8E6DD] text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Highlights Banner */}
        <div className="p-6 bg-[#DCFCE7]/60 border-b border-[#DCFCE7] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#14532D] uppercase font-bold tracking-wider block">
              Estimated Arrival / Ready
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
              {order.status === 'completed' ? 'Delivered' : order.estimatedDeliveryTime}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#8C8A82] uppercase tracking-wider block">Total Paid</span>
            <span className="font-mono text-xl font-bold text-[#121110] tabular-nums">
              {formatNaira(order.total)}
            </span>
          </div>
        </div>

        {/* Notification Subscription Banner */}
        <div className="p-4 bg-[#FAFAF7] border-b border-[#E8E6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${isSubscribed && permission === 'granted' ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-white border border-[#E8E6DD] text-[#8C8A82]'}`}>
              {isSubscribed && permission === 'granted' ? <BellRing className="w-4 h-4 text-[#14532D]" /> : <Bell className="w-4 h-4 text-[#595852]" />}
            </div>
            <div>
              <div className="font-bold text-[#121110] flex items-center gap-1.5">
                <span>Real-Time Browser Notifications</span>
                {isSubscribed && permission === 'granted' && (
                  <span className="px-1.5 py-0.2 rounded bg-[#14532D] text-white text-[9px] font-mono">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-[#595852]">
                {permission === 'granted' && isSubscribed
                  ? 'Alerts active. You will receive push notifications as each dish cooks & delivers.'
                  : permission === 'denied'
                  ? 'Notifications are blocked in your browser settings. You can still see in-app updates.'
                  : 'Receive push alerts on this device as your order progresses through each kitchen stage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {permission === 'granted' && (
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="px-2.5 py-1.5 bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] text-[#121110] font-semibold text-[11px] rounded-lg transition-all cursor-pointer"
              >
                {testSent ? '✓ Alert Sent' : 'Test Alert'}
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleSubscription}
              disabled={subscribing}
              className={`px-3 py-1.5 font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer ${
                isSubscribed && permission === 'granted'
                  ? 'bg-white border border-[#E8E6DD] text-[#595852] hover:text-rose-600'
                  : 'bg-[#14532D] hover:bg-[#0D3823] text-white'
              }`}
            >
              {subscribing
                ? 'Requesting...'
                : isSubscribed && permission === 'granted'
                ? 'Unsubscribe'
                : 'Turn On Alerts'}
            </button>
          </div>
        </div>

        {/* Timeline Progression */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E6DD]">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.status} className="relative group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#14532D] text-white shadow-[0_0_12px_rgba(20,83,45,0.4)]'
                        : isPast
                        ? 'bg-[#121110] text-white'
                        : 'bg-white border-2 border-[#E8E6DD] text-[#AAA]'
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <div>
                    <h4
                      className={`text-sm font-bold transition-colors ${
                        isCurrent
                          ? 'text-[#14532D]'
                          : isPast
                          ? 'text-[#121110]'
                          : 'text-[#8C8A82]'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCurrent ? 'text-[#121110]' : 'text-[#8C8A82]'
                      }`}
                    >
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Simulation Controls */}
          {order.status !== 'completed' && (
            <div className="p-3.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#595852]">
                <ChefHat className="w-4 h-4 text-[#14532D]" />
                <span>Simulate kitchen status transition & test notification:</span>
              </div>
              <button
                type="button"
                onClick={handleAdvance}
                className="px-3.5 py-1.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Advance Status →
              </button>
            </div>
          )}

          {/* Itemized Order Details */}
          <div className="pt-4 border-t border-[#E8E6DD] space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#121110]">
              Items in Order ({order.items.length})
            </h5>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {order.items.map((i) => (
                <div key={i.cartItemId} className="flex items-center justify-between text-xs text-[#595852]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[#121110] font-bold">{i.quantity}x</span>
                    <span className="truncate">{i.item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#121110] font-semibold shrink-0">
                    {formatNaira(i.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {order.deliveryAddress && (
              <div className="pt-2 text-xs flex items-start gap-2 text-[#595852]">
                <MapPin className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
                <span>Delivery address: {order.deliveryAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAF7] border-t border-[#E8E6DD] flex items-center justify-between text-xs text-[#8C8A82]">
          <span>Need assistance? Concierge desk: +234 1 460 8910</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E8E6DD] hover:bg-[#F4F3ED] text-[#121110] font-medium rounded-xl transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
