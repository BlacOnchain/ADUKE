import React, { useState } from 'react';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  ChevronRight,
  Receipt,
  ShoppingBag,
  ExternalLink,
  Calendar,
  AlertCircle,
  LogIn,
  ArrowRight,
} from 'lucide-react';
import { RestaurantOrder, OrderStatus, formatNaira, CartItem } from '../types/restaurant';
import { useAuth } from '../context/AuthContext';

interface OrderHistoryDashboardProps {
  orders: RestaurantOrder[];
  onReorder: (order: RestaurantOrder) => void;
  onTrackOrder: (order: RestaurantOrder) => void;
  onOpenAuth: () => void;
  onNavigateToMenu: () => void;
}

export const OrderHistoryDashboard: React.FC<OrderHistoryDashboardProps> = ({
  orders,
  onReorder,
  onTrackOrder,
  onOpenAuth,
  onNavigateToMenu,
}) => {
  const { currentUser, profile } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<RestaurantOrder | null>(null);

  // Filter orders for current user if logged in, or show recent guest session orders
  const userOrders = orders.filter((order) => {
    if (currentUser?.email) {
      return (
        order.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
        order.customerName?.toLowerCase() === currentUser.displayName?.toLowerCase() ||
        order.userId === currentUser.uid
      );
    }
    // If guest, show recent orders in current session
    return true;
  });

  const filteredOrders = userOrders.filter((order) => {
    if (filter === 'active') return ['placed', 'confirmed', 'cooking', 'ready'].includes(order.status);
    if (filter === 'completed') return order.status === 'completed' || order.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#FAFAF7] border border-[#E8E6DD] text-[#595852] font-mono text-[11px] font-bold">
            RECEIVED
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#14532D] font-mono text-[11px] font-bold">
            CONFIRMED
          </span>
        );
      case 'cooking':
        return (
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-[#C2410C] border border-amber-200 font-mono text-[11px] font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#C2410C]" /> ON WOODFIRE
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#14532D] font-mono text-[11px] font-bold flex items-center gap-1">
            <Bike className="w-3 h-3" /> DISPATCHED
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#F4F3ED] text-[#121110] font-mono text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#14532D]" /> DELIVERED
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-mono text-[11px] font-bold">
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E6DD]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#14532D] font-bold block">
            Guest Dining Ledger
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#121110] mt-0.5">
            Order History & Reorder
          </h1>
          <p className="text-xs text-[#595852] mt-1">
            Track past meals, view itemized Nigerian VAT receipts, and reorder favorites in 1 click.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-[#FAFAF7] p-1 border border-[#E8E6DD] rounded-xl text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-[#14532D] shadow-2xs' : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              All ({userOrders.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'active' ? 'bg-white text-[#14532D] shadow-2xs' : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'completed' ? 'bg-white text-[#14532D] shadow-2xs' : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Guest Notice if not logged in */}
      {!currentUser && (
        <div className="mt-6 p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#595852]">
            <LogIn className="w-4 h-4 text-[#14532D] shrink-0" />
            <span>
              Dining as a guest. <strong className="text-[#121110]">Sign in</strong> to sync your orders across phone and desktop.
            </span>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] text-[#121110] font-semibold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Timeline List of Orders */}
      <div className="mt-8 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-[#E8E6DD] rounded-3xl">
            <ShoppingBag className="w-10 h-10 text-[#8C8A82] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#121110]">No orders found</h3>
            <p className="text-xs text-[#595852] mt-1 max-w-sm mx-auto">
              You haven't placed any orders in this category yet. Explore our woodfire specialties to begin.
            </p>
            <button
              onClick={onNavigateToMenu}
              className="mt-5 px-5 py-2.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Culinary Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          filteredOrders.map((order, idx) => {
            const isActive = ['placed', 'confirmed', 'cooking', 'ready'].includes(order.status);
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = new Date(order.createdAt).toLocaleTimeString('en-NG', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-white border border-[#E8E6DD] rounded-3xl p-6 sm:p-7 shadow-2xs hover:border-[#14532D]/40 transition-all space-y-5"
              >
                {/* Timeline Card Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EFEB]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#121110]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[#8C8A82]">·</span>
                    <span className="text-xs text-[#595852] flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#8C8A82]" />
                      {dateStr} at {timeStr}
                    </span>
                    <span className="text-[#8C8A82]">·</span>
                    <span className="text-xs uppercase font-medium text-[#595852]">
                      {order.orderType === 'dine-in-table' ? `Table ${order.tableNumber || '1'}` : order.orderType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="font-mono text-base font-bold text-[#121110]">
                      {formatNaira(order.total)}
                    </span>
                  </div>
                </div>

                {/* Timeline Visual Status Track (Clean & Unboxed) */}
                <div className="relative py-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className={`space-y-1 ${order.status !== 'cancelled' ? 'text-[#14532D] font-bold' : 'text-[#8C8A82]'}`}>
                      <div className="h-1.5 rounded-full bg-[#14532D]" />
                      <span>Received</span>
                    </div>
                    <div
                      className={`space-y-1 ${
                        ['confirmed', 'cooking', 'ready', 'completed'].includes(order.status)
                          ? 'text-[#14532D] font-bold'
                          : 'text-[#8C8A82]'
                      }`}
                    >
                      <div
                        className={`h-1.5 rounded-full ${
                          ['confirmed', 'cooking', 'ready', 'completed'].includes(order.status)
                            ? 'bg-[#14532D]'
                            : 'bg-[#E8E6DD]'
                        }`}
                      />
                      <span>Confirmed</span>
                    </div>
                    <div
                      className={`space-y-1 ${
                        ['cooking', 'ready', 'completed'].includes(order.status)
                          ? 'text-[#C2410C] font-bold'
                          : 'text-[#8C8A82]'
                      }`}
                    >
                      <div
                        className={`h-1.5 rounded-full ${
                          ['cooking', 'ready', 'completed'].includes(order.status)
                            ? 'bg-[#C2410C]'
                            : 'bg-[#E8E6DD]'
                        }`}
                      />
                      <span>Cooking</span>
                    </div>
                    <div
                      className={`space-y-1 ${
                        ['ready', 'completed'].includes(order.status)
                          ? 'text-[#14532D] font-bold'
                          : 'text-[#8C8A82]'
                      }`}
                    >
                      <div
                        className={`h-1.5 rounded-full ${
                          ['ready', 'completed'].includes(order.status)
                            ? 'bg-[#14532D]'
                            : 'bg-[#E8E6DD]'
                        }`}
                      />
                      <span>{order.orderType === 'delivery' ? 'Dispatched' : 'Plated'}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Order Content */}
                <div className="bg-[#FAFAF7] rounded-2xl p-4 border border-[#E8E6DD] space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8C8A82] font-semibold">
                    Order Items ({order.items.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items.map((cartItem) => (
                      <div
                        key={cartItem.cartItemId}
                        className="flex items-center justify-between text-[#121110] bg-white p-2.5 rounded-xl border border-[#E8E6DD]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-bold text-[#14532D] w-5 text-center">
                            {cartItem.quantity}x
                          </span>
                          <span className="font-medium truncate">{cartItem.item.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-[#595852] shrink-0 ml-2">
                          {formatNaira(cartItem.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.deliveryAddress && (
                    <div className="pt-2 text-xs text-[#595852] border-t border-[#E8E6DD] flex items-center justify-between">
                      <span>Delivery: {order.deliveryAddress}</span>
                      <span className="font-mono">Est: {order.estimatedDeliveryTime}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions: Reorder & Live Tracking */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => onTrackOrder(order)}
                        className="px-4 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track Live Status</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3.5 py-2 bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] text-[#121110] text-xs font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-[#595852]" />
                        <span>View ₦ Receipt</span>
                      </button>
                    )}
                  </div>

                  {/* 1-Click Reorder Button */}
                  <button
                    onClick={() => onReorder(order)}
                    className="px-4 py-2 bg-white hover:bg-[#DCFCE7]/50 border border-[#14532D]/40 text-[#14532D] hover:text-[#0D3823] text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder This Meal</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Itemized ₦ Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-white border border-[#E8E6DD] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DD]">
              <div>
                <h3 className="font-display text-lg font-bold text-[#121110]">
                  Àdùkẹ́ Gastronomy Lagos
                </h3>
                <p className="text-[11px] text-[#595852] font-mono">
                  Receipt #{selectedReceiptOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="text-xs text-[#8C8A82] hover:text-[#121110] px-2 py-1 rounded-lg hover:bg-[#F4F3ED]"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs py-2">
              {selectedReceiptOrder.items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.item.name}
                  </span>
                  <span className="font-mono">{formatNaira(i.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E6DD] space-y-1.5 text-xs text-[#595852]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">{formatNaira(selectedReceiptOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nigerian VAT (7.5%):</span>
                <span className="font-mono">{formatNaira(selectedReceiptOrder.tax)}</span>
              </div>
              {selectedReceiptOrder.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Island Courier Dispatch:</span>
                  <span className="font-mono">{formatNaira(selectedReceiptOrder.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#121110] pt-2 border-t border-[#E8E6DD]">
                <span>Total Paid:</span>
                <span className="font-mono">{formatNaira(selectedReceiptOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-xl hover:bg-[#0D3823] transition-colors cursor-pointer"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
