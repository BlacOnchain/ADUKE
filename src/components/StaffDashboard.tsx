import React, { useState } from 'react';
import {
  ChefHat,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  X,
  Users,
  MapPin,
  Phone,
  Flame,
  Settings,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Tablet,
  Receipt,
  Bell,
  Sparkles,
  DollarSign,
  Droplets,
  Check,
  Plus
} from 'lucide-react';
import {
  RestaurantOrder,
  TableReservation,
  OrderStatus,
  StaffRole,
  TableSession,
  PaymentMethod,
  formatNaira,
  MenuItem
} from '../types/restaurant';
import { restaurantDB } from '../data/db';
import confetti from 'canvas-confetti';

interface StaffDashboardProps {
  orders: RestaurantOrder[];
  reservations: TableReservation[];
  menu: MenuItem[];
  onClose: () => void;
  onOpenMenuManager: () => void;
  currentRole?: StaffRole;
  onRoleChange?: (role: StaffRole) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  orders,
  reservations,
  menu,
  onClose,
  onOpenMenuManager,
  currentRole = 'owner',
  onRoleChange,
}) => {
  const [activeRole, setActiveRole] = useState<StaffRole>(
    currentRole === 'customer' ? 'owner' : currentRole
  );
  const [tableSessions, setTableSessions] = useState<TableSession[]>(() =>
    restaurantDB.getTableSessions()
  );

  // Cashier settlement modal state
  const [selectedTableForBilling, setSelectedTableForBilling] = useState<TableSession | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pos_terminal');
  const [settlementSuccess, setSettlementSuccess] = useState<string | null>(null);

  // Waiter tablet fast ordering state
  const [selectedWaiterTable, setSelectedWaiterTable] = useState<string>('Table 4');

  // Sync tables
  const refreshTables = () => {
    setTableSessions([...restaurantDB.getTableSessions()]);
  };

  const handleRoleSwitch = (role: StaffRole) => {
    setActiveRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    restaurantDB.updateOrderStatus(orderId, newStatus);
  };

  const handleUpdateReservationStatus = (resId: string, status: TableReservation['status']) => {
    restaurantDB.updateReservationStatus(resId, status);
  };

  const handleClearBuzzer = (tableNumber: string) => {
    restaurantDB.clearTableService(tableNumber);
    refreshTables();
  };

  const handleUpdateTableStatus = (tableNumber: string, status: TableSession['status']) => {
    restaurantDB.updateTableStatus(tableNumber, status);
    refreshTables();
  };

  const handleSettleBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableForBilling) return;

    restaurantDB.settleTableBill(selectedTableForBilling.tableNumber, paymentMethod);
    refreshTables();
    setSettlementSuccess(
      `Payment of ${formatNaira(selectedTableForBilling.totalSpend)} confirmed via ${paymentMethod.toUpperCase().replace('_', ' ')}! Table marked ready for cleaning.`
    );
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#14532D', '#C89B3C', '#C2410C'],
      });
    } catch {}

    setTimeout(() => {
      setSettlementSuccess(null);
      setSelectedTableForBilling(null);
    }, 2500);
  };

  const handleWaiterAddDish = (tableNumber: string, dish: MenuItem) => {
    restaurantDB.createOrder({
      orderType: 'dine-in-table',
      tableNumber,
      customerName: `Guest at ${tableNumber}`,
      customerPhone: '+234 800 000 0000',
      customerEmail: 'table.order@aduke.lagos.ng',
      items: [
        {
          cartItemId: `waiter-${dish.id}-${Date.now()}`,
          item: dish,
          quantity: 1,
          selectedOptions: [],
          unitPrice: dish.price,
          totalPrice: dish.price,
        },
      ],
      subtotal: dish.price,
      tax: Math.round(dish.price * 0.075),
      deliveryFee: 0,
      tip: 0,
      total: Math.round(dish.price * 1.075),
      paymentStatus: 'unpaid',
      specialNotes: 'Added directly by floor waiter tablet',
    });
    refreshTables();
    alert(`Added "${dish.name}" to ${tableNumber}. Ticket dispatched to Kitchen fire embers!`);
  };

  const handleResetData = () => {
    if (confirm('Reset database to curated demonstration state with Nigerian Naira values?')) {
      restaurantDB.resetAll();
      refreshTables();
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  // Hierarchy role definitions
  const rolesList: { id: StaffRole; label: string; badge: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'owner',
      label: 'CEO & Founder',
      badge: 'EXECUTIVE',
      icon: <TrendingUp className="w-4 h-4 text-emerald-700" />,
      desc: 'High-level P&L revenue in Naira, margin analysis, multi-branch overview & system override.',
    },
    {
      id: 'manager',
      label: 'General Manager',
      badge: 'MANAGEMENT',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-700" />,
      desc: 'Floor matrix, staff shift roster, guest reservations approval & 86 menu pricing controls.',
    },
    {
      id: 'chef',
      label: 'Head Chef (KDS)',
      badge: 'KITCHEN FIRE',
      icon: <Flame className="w-4 h-4 text-[#C2410C]" />,
      desc: 'Live woodfire hearth tickets, seasoning timing, protein customizations & dish preparation.',
    },
    {
      id: 'cashier',
      label: 'Cashier (POS)',
      badge: 'BILLING & POS',
      icon: <Receipt className="w-4 h-4 text-[#C89B3C]" />,
      desc: 'Table check settlements, POS terminal / bank transfers, Nigerian VAT receipts & closing.',
    },
    {
      id: 'waiter',
      label: 'Floor Staff Tablet',
      badge: 'SERVICE TABLET',
      icon: <Tablet className="w-4 h-4 text-teal-700" />,
      desc: 'Handheld table buzzer alerts (water/napkins/bills), instant table-side re-ordering & turnover.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8E6DD]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md shadow-emerald-950/15">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
                  Àdùkẹ́ Operations Console
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold">
                  FIRESTORE RBAC LIVE
                </span>
              </div>
              <p className="text-xs text-[#595852] mt-0.5">
                Multi-Tier Hierarchy: CEO · General Manager · Head Chef · Cashier POS · Floor Staff Tablet
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenMenuManager}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#121110] bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Edit Menu & ₦ Prices</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset orders and reservations to demo state"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8C8A82] hover:text-[#121110] bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ₦ Data</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#121110] hover:bg-[#282725] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <span>Guest Portal</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Role Switcher Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#595852]">
            <span className="font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#14532D]" />
              <span>Select Active Restaurant Hierarchy Level:</span>
            </span>
            <span className="font-mono text-[11px] text-[#8C8A82]">
              Switch roles to evaluate customized tools
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {rolesList.map((r) => {
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSwitch(r.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#14532D] bg-[#DCFCE7]/60 ring-1 ring-[#14532D] shadow-xs'
                      : 'border-[#E8E6DD] bg-white hover:bg-[#FAFAF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {r.icon}
                      <span className="font-display text-xs font-bold text-[#121110]">
                        {r.label}
                      </span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#14532D] stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#8C8A82]">
                    {r.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROLE 1: CEO / OWNER VIEW */}
        {/* ========================================================================= */}
        {activeRole === 'owner' && (
          <div className="space-y-6 text-left animate-fadeIn">
            {/* Executive KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Today's Gross Sales (₦)
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#14532D]">
                  {formatNaira(3485000)}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ↑ +18.4% vs last Saturday (Lagos Flagship)
                </p>
              </div>

              <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Average Table Check
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
                  {formatNaira(82400)}
                </div>
                <p className="text-[11px] text-[#595852]">
                  Across 12 dining pavilion tables
                </p>
              </div>

              <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Labor & Food Margin
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
                  68.2%
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Optimal woodfire cost efficiency
                </p>
              </div>

              <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Active Shifts On Duty
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#C2410C]">
                  14 Staff
                </div>
                <p className="text-[11px] text-[#595852]">
                  1 GM · 1 Chef · 3 Line · 2 Cashiers · 7 Floor
                </p>
              </div>
            </div>

            {/* Branch Performance & Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E8E6DD] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                  <h3 className="font-display text-sm font-bold text-[#121110]">
                    Top Revenue Dishes This Week
                  </h3>
                  <span className="text-[11px] font-mono text-[#8C8A82]">Ranked by Net ₦</span>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Smoked Firewood Jollof Rice Royale', orders: 142, revenue: 3976000 },
                    { name: 'Whole Wood-Fired Grilled Croaker', orders: 88, revenue: 3388000 },
                    { name: 'Slow-Braised Oxtail & Rich Efo Riro', orders: 94, revenue: 3196000 },
                    { name: 'Tiger Prawn & Beef Suya Platter', orders: 112, revenue: 2520000 },
                    { name: 'Fresh Palm Wine Sangria', orders: 165, revenue: 2062500 },
                  ].map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6DD]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-[#14532D]">#{i + 1}</span>
                        <span className="font-semibold text-[#121110]">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#121110]">{formatNaira(d.revenue)}</div>
                        <span className="text-[11px] text-[#8C8A82]">{d.orders} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E8E6DD] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                  <h3 className="font-display text-sm font-bold text-[#121110]">
                    Executive Branch Oversight
                  </h3>
                  <span className="text-[11px] font-mono text-[#14532D] font-bold">2 Branches</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl border border-emerald-300 bg-[#DCFCE7]/30 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#121110]">
                      <span>1. Lagos Flagship (Victoria Island)</span>
                      <span className="font-mono text-[#14532D]">● Active</span>
                    </div>
                    <p className="text-[#595852]">14 Adeola Odeku St, Victoria Island, Lagos</p>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-200">
                      <span>12 Pavilion Tables · 4 Seating Zones</span>
                      <span className="font-mono font-bold text-[#14532D]">{formatNaira(3485000)} today</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#E8E6DD] bg-[#FAFAF7] space-y-2 opacity-80">
                    <div className="flex items-center justify-between font-bold text-[#121110]">
                      <span>2. Abuja Maitama Lounge (Opening Nov)</span>
                      <span className="font-mono text-[#C89B3C]">Pre-Launch</span>
                    </div>
                    <p className="text-[#595852]">Plot 1044 Aguiyi Ironsi Way, Maitama, Abuja</p>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E8E6DD]">
                      <span>18 Tables · Hearth Charcoal Pits</span>
                      <span className="font-mono font-bold text-[#8C8A82]">Target: Dec 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: GENERAL MANAGER VIEW */}
        {/* ========================================================================= */}
        {activeRole === 'manager' && (
          <div className="space-y-6 text-left animate-fadeIn">
            {/* Floor Matrix & Table Turnaround */}
            <div className="bg-white border border-[#E8E6DD] rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEB]">
                <div>
                  <h3 className="font-display text-base font-bold text-[#121110]">
                    Pavilion Table Status & Turnover Control (12 Tables)
                  </h3>
                  <p className="text-xs text-[#595852]">
                    Click any table to alter occupancy, reset dirty tables, or inspect service alerts.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#14532D]" /> Occupied</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C2410C]" /> Alert</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C89B3C]" /> Bill</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8C8A82]" /> Vacant</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tableSessions.map((t) => (
                  <div
                    key={t.tableNumber}
                    className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
                      t.status === 'occupied'
                        ? 'border-emerald-300 bg-[#DCFCE7]/30'
                        : t.status === 'service_needed'
                        ? 'border-rose-300 bg-rose-50/60'
                        : t.status === 'billing'
                        ? 'border-amber-300 bg-amber-50/60'
                        : t.status === 'dirty'
                        ? 'border-orange-300 bg-orange-50/60'
                        : 'border-[#E8E6DD] bg-[#FAFAF7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-bold text-[#121110]">
                        <span className="font-mono text-sm">{t.tableNumber}</span>
                        <span className="uppercase text-[10px] font-mono tracking-wider text-[#14532D]">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#595852] mt-0.5 truncate">{t.areaName}</p>
                      {t.guestName && (
                        <p className="text-[11px] font-semibold text-[#121110] mt-1">
                          Guest: {t.guestName} ({t.guestCount || 2}p)
                        </p>
                      )}
                      {t.totalSpend > 0 && (
                        <p className="font-mono text-xs font-bold text-[#14532D] mt-1">
                          Bill: {formatNaira(t.totalSpend)}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#E8E6DD] flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateTableStatus(t.tableNumber, 'vacant')}
                        className="px-2 py-1 bg-white border border-[#E8E6DD] hover:bg-[#F4F3ED] rounded-lg text-[10px] font-semibold text-[#595852] cursor-pointer"
                      >
                        Reset Vacant
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateTableStatus(t.tableNumber, 'occupied')}
                        className="px-2 py-1 bg-[#14532D] hover:bg-[#0D3823] text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                      >
                        Seat Guest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Stand Bookings */}
            <div className="bg-white border border-[#E8E6DD] rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-[#121110]">
                Tonight's Guest Reservations Manifest ({reservations.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAF7] text-[#595852] uppercase font-mono tracking-wider border-b border-[#E8E6DD]">
                    <tr>
                      <th className="p-3">Pass Code</th>
                      <th className="p-3">Guest & Contact</th>
                      <th className="p-3">Party</th>
                      <th className="p-3">Sitting Slot</th>
                      <th className="p-3">Pavilion Area</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EFEB]">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-[#FAFAF7]">
                        <td className="p-3 font-mono font-bold text-[#14532D]">{res.bookingCode}</td>
                        <td className="p-3">
                          <div className="font-bold text-[#121110]">{res.guestName}</div>
                          <div className="text-[11px] text-[#8C8A82]">{res.guestPhone}</div>
                        </td>
                        <td className="p-3 font-mono">{res.partySize} Guests</td>
                        <td className="p-3 font-mono text-[#14532D] font-semibold">{res.timeSlot}</td>
                        <td className="p-3">{res.seatingAreaName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono text-[10px] font-bold uppercase">
                            {res.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, 'seated')}
                              className="px-3 py-1 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Seat Guest
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: HEAD CHEF / KDS (KITCHEN DISPLAY SYSTEM) */}
        {/* ========================================================================= */}
        {activeRole === 'chef' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E6DD]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#C2410C]" />
                  <span>Woodfire Embers Kitchen Display (Active Orders: {activeOrders.length})</span>
                </h2>
                <p className="text-xs text-[#595852]">
                  Live ticketing for Applewood jollof, charcoal suya grill, and traditional soup cauldrons.
                </p>
              </div>

              <div className="text-right text-xs font-mono text-[#14532D]">
                <span>Station: Victoria Island Main Hearth</span>
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="py-20 text-center bg-white border border-dashed border-[#D8D6CC] rounded-3xl p-8">
                <p className="font-display text-xl text-[#121110] font-semibold">Fire queue is currently clear</p>
                <p className="text-xs text-[#595852] mt-1">
                  New orders from tables, delivery, or waiter tablets will chime here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-[#E8E6DD] rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-bold text-[#14532D]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] uppercase font-bold">
                            {ord.tableNumber || ord.orderType}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#C2410C] capitalize">
                          ● {ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#595852]">
                        <span className="font-semibold text-[#121110]">{ord.customerName}</span>
                        {ord.tableNumber && (
                          <span className="ml-2 font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                            {ord.tableNumber}
                          </span>
                        )}
                      </div>

                      {/* Items */}
                      <div className="bg-[#FAFAF7] p-3.5 rounded-2xl space-y-2 border border-[#E8E6DD]">
                        {ord.items.map((i) => (
                          <div key={i.cartItemId} className="text-xs">
                            <div className="flex items-center justify-between text-[#121110] font-semibold">
                              <span>{i.quantity}x {i.item.name}</span>
                              <span className="font-mono text-[11px] text-[#8C8A82]">
                                {formatNaira(i.totalPrice)}
                              </span>
                            </div>
                            {i.selectedOptions.length > 0 && (
                              <p className="text-[11px] text-[#14532D] font-medium">
                                {i.selectedOptions.map((o) => o.optionName).join(', ')}
                              </p>
                            )}
                            {i.specialInstructions && (
                              <p className="text-[11px] text-[#8C8A82] italic">
                                Note: {i.specialInstructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {ord.specialNotes && (
                        <p className="text-[11px] text-[#9A3412] italic bg-orange-50 p-2 rounded-xl border border-orange-200">
                          Chef Directive: {ord.specialNotes}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#F0EFEB] flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#121110]">
                        {formatNaira(ord.total)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {ord.status === 'placed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'cooking')}
                            className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Fire on Embers →
                          </button>
                        )}
                        {ord.status === 'cooking' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                            className="px-3 py-1.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Plated & Ready →
                          </button>
                        )}
                        {ord.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                            className="px-3 py-1.5 bg-[#121110] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Served ✓
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 4: CASHIER / POS TERMINAL */}
        {/* ========================================================================= */}
        {activeRole === 'cashier' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E6DD]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#C89B3C]" />
                  <span>Cashier Billing & POS Terminal (Nigerian Naira ₦)</span>
                </h2>
                <p className="text-xs text-[#595852]">
                  Settle table bills, confirm Nigerian debit card POS slips, cash, or instant bank transfer.
                </p>
              </div>
            </div>

            {settlementSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0" />
                <span>{settlementSuccess}</span>
              </div>
            )}

            {/* Tables Awaiting Settlement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableSessions.map((tbl) => {
                const hasSpend = tbl.totalSpend > 0;
                return (
                  <div
                    key={tbl.tableNumber}
                    className={`p-5 rounded-3xl border bg-white flex flex-col justify-between space-y-4 shadow-2xs ${
                      tbl.status === 'billing'
                        ? 'border-amber-400 ring-2 ring-amber-300'
                        : 'border-[#E8E6DD]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-bold text-[#121110]">
                        <span className="font-mono text-base">{tbl.tableNumber}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                          tbl.status === 'billing' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-[#FAFAF7] text-[#8C8A82]'
                        }`}>
                          {tbl.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#595852]">{tbl.areaName}</p>
                      {tbl.guestName && (
                        <p className="text-xs font-medium text-[#121110]">Guest: {tbl.guestName}</p>
                      )}
                      <div className="pt-2 border-t border-[#F0EFEB]">
                        <span className="text-[11px] text-[#8C8A82] block">Total Accrued Check:</span>
                        <span className="font-mono text-xl font-bold text-[#14532D]">
                          {hasSpend ? formatNaira(tbl.totalSpend) : '₦0 (No active bill)'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!hasSpend}
                      onClick={() => setSelectedTableForBilling(tbl)}
                      className="w-full py-2.5 px-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-35 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Settle Check →</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bill Settlement Modal */}
            {selectedTableForBilling && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div
                  className="relative w-full max-w-md bg-white border border-[#E8E6DD] rounded-3xl p-7 shadow-2xl space-y-5 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DD]">
                    <div className="space-y-0.5">
                      <h3 className="font-display text-base font-bold text-[#121110]">
                        Settle {selectedTableForBilling.tableNumber} Bill
                      </h3>
                      <p className="text-xs text-[#595852]">
                        {selectedTableForBilling.areaName} · Guest: {selectedTableForBilling.guestName || 'Walk-in'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedTableForBilling(null)}
                      className="p-1.5 rounded-lg text-[#8C8A82] hover:text-[#121110]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#595852]">
                      <span>Subtotal & Gratuity</span>
                      <span className="font-mono text-[#121110] font-semibold">
                        {formatNaira(Math.round(selectedTableForBilling.totalSpend / 1.075))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#595852]">
                      <span>Nigerian VAT (7.5%)</span>
                      <span className="font-mono text-[#121110] font-semibold">
                        {formatNaira(Math.round(selectedTableForBilling.totalSpend - (selectedTableForBilling.totalSpend / 1.075)))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-[#121110] pt-2 border-t border-[#E8E6DD]">
                      <span>Total Amount Payable</span>
                      <span className="font-mono text-lg text-[#14532D]">
                        {formatNaira(selectedTableForBilling.totalSpend)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <form onSubmit={handleSettleBill} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">
                        Select Payment Tender
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'pos_terminal', label: '💳 POS Card Terminal', sub: 'Visa, Master, Verve' },
                          { id: 'bank_transfer', label: '🏦 Instant Bank Transfer', sub: 'GTBank / Zenith / Moniepoint' },
                          { id: 'cash', label: '💵 Nigerian Cash (₦)', sub: '₦1000 / ₦500 Notes' },
                          { id: 'ussd', label: '📱 USSD Code (*737#)', sub: 'Instant dial confirmation' },
                        ].map((pm) => (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentMethod === pm.id
                                ? 'border-[#14532D] bg-[#DCFCE7] text-[#121110] font-bold shadow-2xs'
                                : 'border-[#E8E6DD] bg-white text-[#595852] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            <div className="font-semibold">{pm.label}</div>
                            <div className="text-[10px] text-[#8C8A82]">{pm.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Payment & Issue Receipt</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 5: FLOOR STAFF / WAITER TABLET VIEW */}
        {/* ========================================================================= */}
        {activeRole === 'waiter' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E6DD]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
                  <Tablet className="w-4 h-4 text-teal-700" />
                  <span>Handheld Floor Waiter Tablet</span>
                </h2>
                <p className="text-xs text-[#595852]">
                  Real-time buzzer alerts, 1-tap table dish ordering, and fast dining room turnaround.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                  Waiter Tablet #04 Active
                </span>
              </div>
            </div>

            {/* Active Buzzer Service Alerts */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121110]">
                Active Table Buzzers & Guest Requests
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tableSessions
                  .filter((t) => t.currentServiceCall !== 'none')
                  .map((alertTbl) => (
                    <div
                      key={alertTbl.tableNumber}
                      className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-5 h-5 text-amber-700 animate-bounce" />
                        <div>
                          <span className="font-mono font-bold text-[#121110] text-sm">
                            {alertTbl.tableNumber}
                          </span>
                          <p className="text-xs text-amber-900 font-semibold uppercase">
                            Needs: {alertTbl.currentServiceCall}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearBuzzer(alertTbl.tableNumber)}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Attended ✓
                      </button>
                    </div>
                  ))}

                {tableSessions.filter((t) => t.currentServiceCall !== 'none').length === 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-dashed border-[#D8D6CC] text-xs text-[#8C8A82] text-center col-span-3">
                    No active table buzzers right now. All dining guests are well attended.
                  </div>
                )}
              </div>
            </div>

            {/* Fast Dish Re-Ordering for Table */}
            <div className="bg-white border border-[#E8E6DD] rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EFEB]">
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-bold text-[#121110]">
                    Fast Table-Side Re-Order Terminal
                  </h3>
                  <p className="text-xs text-[#595852]">
                    Select a table and tap any popular dish to dispatch an extra ticket straight to the woodfire hearth.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#121110]">Target Table:</span>
                  <select
                    value={selectedWaiterTable}
                    onChange={(e) => setSelectedWaiterTable(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono font-bold bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110]"
                  >
                    {tableSessions.map((t) => (
                      <option key={t.tableNumber} value={t.tableNumber}>
                        {t.tableNumber} ({t.areaName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fast items strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {menu.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleWaiterAddDish(selectedWaiterTable, item)}
                    className="p-3 rounded-2xl border border-[#E8E6DD] bg-[#FAFAF7] hover:bg-[#DCFCE7]/40 hover:border-[#14532D] text-left transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-[#121110] line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#595852] font-mono">
                        {formatNaira(item.price)}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[#E8E6DD] flex items-center justify-between text-[11px] text-[#14532D] font-bold">
                      <span>Add to {selectedWaiterTable}</span>
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
