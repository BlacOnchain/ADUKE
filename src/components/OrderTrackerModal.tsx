/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { RestaurantOrder, OrderStatus, formatNaira } from '../types/restaurant';

interface OrderTrackerModalProps {
  order: RestaurantOrder | null;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  if (!order) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-[#E8E6DD] rounded-3xl overflow-hidden shadow-2xl my-8 text-left animate-pop-in"
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
