import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Settings,
  X,
  Link,
  Copy,
  Check,
  UserPlus,
  Key,
  Flame,
  Tablet,
  Receipt,
  TrendingUp,
  ShieldCheck,
  Bell,
  Droplets,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
  Users,
  LogOut
} from 'lucide-react';
import {
  RestaurantOrder,
  TableReservation,
  StaffRole,
  TableSession,
  formatNaira,
  MenuItem,
  PaymentMethod
} from '../types/restaurant';
import { restaurantDB } from '../data/db';
import { StaffAnalyticsWidget } from './StaffAnalyticsWidget';

interface StaffDashboardProps {
  orders: RestaurantOrder[];
  reservations: TableReservation[];
  menu: MenuItem[];
  onClose: () => void;
  onOpenMenuManager: () => void;
  currentRole?: StaffRole;
  onRoleChange?: (role: StaffRole) => void;
}

interface StaffInvite {
  id: string;
  role: StaffRole;
  roleTitle: string;
  token: string;
  createdAt: string;
  used: boolean;
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<StaffRole>(
    currentRole === 'customer' ? 'owner' : currentRole
  );

  // Cashier Payment Settlement Modal State
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<RestaurantOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pos_terminal');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Staff Invite Link Generator State
  const [selectedInviteRole, setSelectedInviteRole] = useState<StaffRole>('chef');
  const [inviteName, setInviteName] = useState('');
  const [generatedInvites, setGeneratedInvites] = useState<StaffInvite[]>(() => {
    try {
      const saved = localStorage.getItem('aduke_staff_invites');
      return saved ? JSON.parse(saved) : [
        { id: 'inv-1', role: 'chef', roleTitle: 'Head Chef', token: 'chef-woodfire-9921', createdAt: '2026-09-23', used: false },
        { id: 'inv-2', role: 'waiter', roleTitle: 'Floor Waiter', token: 'waiter-pavilion-4410', createdAt: '2026-09-23', used: false },
      ];
    } catch {
      return [];
    }
  });
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const registeredStaffList = restaurantDB.getRegisteredStaff();
  const tableSessions = restaurantDB.getTableSessions();

  const handleRoleSwitch = (role: StaffRole) => {
    setActiveRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const roleLabels: Record<StaffRole, string> = {
      owner: 'Executive CEO',
      manager: 'General Manager',
      chef: 'Head Chef',
      cashier: 'Cashier / Accountant',
      waiter: 'Floor Waiter',
      customer: 'Customer'
    };

    const newInvite: StaffInvite = {
      id: 'inv-' + Date.now(),
      role: selectedInviteRole,
      roleTitle: `${inviteName ? inviteName + ' - ' : ''}${roleLabels[selectedInviteRole]}`,
      token: `${selectedInviteRole}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleDateString(),
      used: false
    };

    const updated = [newInvite, ...generatedInvites];
    setGeneratedInvites(updated);
    localStorage.setItem('aduke_staff_invites', JSON.stringify(updated));
    setInviteName('');
  };

  const copyInviteLink = (invite: StaffInvite) => {
    const link = `${window.location.origin}/staff-onboard?role=${invite.role}&token=${invite.token}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(invite.id);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  const deleteInvite = (id: string) => {
    const updated = generatedInvites.filter(inv => inv.id !== id);
    setGeneratedInvites(updated);
    localStorage.setItem('aduke_staff_invites', JSON.stringify(updated));
  };

  const handleCookOrder = (orderId: string, nextStatus: 'cooking' | 'ready') => {
    restaurantDB.updateOrderStatus(orderId, nextStatus);
  };

  const handleSettlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPayment) return;
    restaurantDB.settleOrderPayment(selectedOrderForPayment.id, paymentMethod);
    setPaymentSuccessMsg(`Payment of ${formatNaira(selectedOrderForPayment.total)} settled via ${paymentMethod.replace('_', ' ').toUpperCase()} for ${selectedOrderForPayment.orderNumber}`);
    setSelectedOrderForPayment(null);
    setTimeout(() => setPaymentSuccessMsg(null), 4000);
  };

  const handleClearBuzzer = (tableNumber: string) => {
    restaurantDB.callTableService(tableNumber, 'none');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Executive / Staff Header */}
        <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md">
              <ChefHat className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121110] tracking-tight">
                  Àdùkẹ́ Staff Hospitality Command
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold tracking-wide uppercase">
                  {activeRole} TERMINAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#666] font-sans">
                Victoria Island Flagship & Multi-Branch Hospitality System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenMenuManager}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#121110] bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Settings className="w-4 h-4 text-[#14532D]" />
              <span>Edit Menu & ₦ Prices</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#121110] bg-white border border-[#E8E6DD] hover:bg-[#FAFAF7] rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>View Guest Site</span>
            </button>

            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout & Exit Terminal</span>
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs for Seamless Role Testing */}
        <div className="p-2 bg-white border border-[#E8E6DD] rounded-2xl flex flex-wrap items-center gap-2 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C8A82] px-3 font-mono">
            Switch Role View:
          </span>
          {[
            { role: 'owner', label: 'Executive CEO', icon: TrendingUp },
            { role: 'chef', label: 'Head Chef', icon: Flame },
            { role: 'waiter', label: 'Floor Waiter', icon: Tablet },
            { role: 'cashier', label: 'Cashier POS', icon: Receipt },
            { role: 'manager', label: 'General Manager', icon: ShieldCheck },
          ].map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleRoleSwitch(r.role as StaffRole)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-white shadow-sm'
                    : 'bg-[#FAFAF7] text-[#121110] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DCFCE7]' : 'text-[#14532D]'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {paymentSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 1: HEAD CHEF DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'chef' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#121110]">
                      Kitchen Embers Order Queue
                    </h2>
                    <p className="text-xs text-[#666]">
                      Live order preparation queue, charcoal woodfire timers, and dish readiness flags.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200">
                  {orders.filter(o => o.status === 'placed' || o.status === 'cooking').length} Dishes Pending
                </span>
              </div>

              {/* Kitchen Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#8C8A82]">
                    All kitchen orders are currently fulfilled and served! Embers burning steady.
                  </div>
                ) : (
                  orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map((ord) => (
                    <div
                      key={ord.id}
                      className={`p-6 rounded-2xl border space-y-4 shadow-sm transition-all ${
                        ord.status === 'cooking'
                          ? 'border-orange-300 bg-orange-50/30'
                          : ord.status === 'ready'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-[#E8E6DD] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DD]">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#121110]">{ord.orderNumber}</span>
                          <span className="text-xs text-[#666] block">{ord.tableNumber || ord.orderType}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
                          ord.status === 'cooking' ? 'bg-orange-100 text-orange-800' :
                          ord.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <span className="font-bold text-[#121110]">
                              {it.quantity}x {it.item.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#8C8A82] shrink-0 ml-2">
                              {it.item.prepTimeMinutes}m prep
                            </span>
                          </div>
                        ))}
                      </div>

                      {ord.specialNotes && (
                        <p className="text-[11px] bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 italic">
                          "{ord.specialNotes}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2">
                        {ord.status === 'placed' && (
                          <button
                            onClick={() => handleCookOrder(ord.id, 'cooking')}
                            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Flame className="w-4 h-4" />
                            <span>Start Embers Cooking</span>
                          </button>
                        )}
                        {ord.status === 'cooking' && (
                          <button
                            onClick={() => handleCookOrder(ord.id, 'ready')}
                            className="w-full py-2.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Dish Ready</span>
                          </button>
                        )}
                        {ord.status === 'ready' && (
                          <span className="w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-xl">
                            Ready for Floor Waiter Pickup
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: FLOOR WAITER DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'waiter' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Tablet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#121110]">
                      Floor Waiter Service Terminal
                    </h2>
                    <p className="text-xs text-[#666]">
                      Table buzzer alerts, guest water requests, bill requests, and live table occupancy.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                  12 Pavilion Tables
                </span>
              </div>

              {/* Active Service Call Buzzers */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#121110]">
                  Live Table Buzzers & Guest Requests
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tableSessions.filter(t => t.currentServiceCall && t.currentServiceCall !== 'none').length === 0 ? (
                    <div className="col-span-full p-6 text-center bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#8C8A82]">
                      No pending table buzzers at the moment. All guests attended!
                    </div>
                  ) : (
                    tableSessions.filter(t => t.currentServiceCall && t.currentServiceCall !== 'none').map((t) => (
                      <div key={t.tableNumber} className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                        <div className="space-y-1">
                          <span className="font-bold text-sm text-[#121110] block">{t.tableNumber}</span>
                          <span className="text-xs font-semibold text-amber-900 uppercase font-mono">
                            Request: {t.currentServiceCall}
                          </span>
                        </div>
                        <button
                          onClick={() => handleClearBuzzer(t.tableNumber)}
                          className="px-3 py-1.5 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-[#0D3823] transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Tables Matrix */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#121110]">
                  Pavilion Table Occupancy Matrix
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tableSessions.map((t) => (
                    <div key={t.tableNumber} className="p-4 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-[#121110]">{t.tableNumber}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          t.status === 'occupied' ? 'bg-[#14532D]' :
                          t.status === 'service_needed' ? 'bg-amber-500 animate-ping' :
                          'bg-[#8C8A82]'
                        }`} />
                      </div>
                      <p className="text-[11px] text-[#666] truncate">{t.areaName}</p>
                      <div className="text-xs font-mono font-bold text-[#14532D]">
                        Spend: {formatNaira(t.totalSpend || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: CASHIER POS DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'cashier' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#121110]">
                      Cashier POS Billing Terminal
                    </h2>
                    <p className="text-xs text-[#666]">
                      Settle table bills via POS Terminal, Naira Bank Transfer, USSD, or Cash.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  {orders.filter(o => o.paymentStatus !== 'paid').length} Bills Outstanding
                </span>
              </div>

              {/* Outstanding Orders List */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#121110]">
                  Unsettled Table & Delivery Orders
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#121110]">{ord.orderNumber}</span>
                          <span className="text-xs text-[#666] block">{ord.customerName} · {ord.tableNumber || ord.orderType}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ord.paymentStatus || 'unpaid'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E8E6DD]">
                        <span className="font-mono font-extrabold text-[#14532D] text-base">
                          {formatNaira(ord.total)}
                        </span>
                        {ord.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => setSelectedOrderForPayment(ord)}
                            className="px-3.5 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Settle Bill →
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 font-mono">
                            Paid via {ord.paymentMethod?.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cashier Settlement Modal */}
            {selectedOrderForPayment && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white border border-[#E8E6DD] rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                    <h3 className="font-display text-lg font-bold text-[#121110]">
                      Settle Bill: {selectedOrderForPayment.orderNumber}
                    </h3>
                    <button onClick={() => setSelectedOrderForPayment(null)} className="p-2 text-[#8C8A82] hover:text-[#121110]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E6DD] space-y-1 text-center">
                    <span className="text-xs text-[#8C8A82] font-mono uppercase">Total Bill Amount</span>
                    <div className="font-display text-3xl font-extrabold text-[#14532D]">
                      {formatNaira(selectedOrderForPayment.total)}
                    </div>
                    <span className="text-xs text-[#666]">{selectedOrderForPayment.customerName} ({selectedOrderForPayment.tableNumber || 'Dine-In'})</span>
                  </div>

                  <form onSubmit={handleSettlePayment} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Select Payment Channel</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full px-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs font-bold text-[#121110] focus:outline-none focus:border-[#14532D]"
                      >
                        <option value="pos_terminal">POS Card Terminal (Moniepoint / OPay)</option>
                        <option value="bank_transfer">Instant Naira Bank Transfer</option>
                        <option value="ussd">USSD Mobile Code</option>
                        <option value="cash">Naira Cash Payment</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                    >
                      Confirm Payment & Print Receipt
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 4 & 5: CEO & GENERAL MANAGER DASHBOARD */}
        {/* ========================================================================= */}
        {(activeRole === 'owner' || activeRole === 'manager') && (
          <div className="space-y-8">
            
            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#E8E6DD] rounded-[24px] p-6 shadow-sm space-y-2 hover:border-[#14532D]/40 transition-colors">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Today's Gross Sales (₦)
                </span>
                <div className="font-display text-3xl font-extrabold text-[#14532D]">
                  {formatNaira(3485000)}
                </div>
                <p className="text-xs text-emerald-700 font-semibold pt-1">
                  ↑ +18.4% vs last Saturday (Lagos Flagship)
                </p>
              </div>

              <div className="bg-white border border-[#E8E6DD] rounded-[24px] p-6 shadow-sm space-y-2 hover:border-[#14532D]/40 transition-colors">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Average Table Check
                </span>
                <div className="font-display text-3xl font-extrabold text-[#121110]">
                  {formatNaira(82400)}
                </div>
                <p className="text-xs text-[#666] pt-1">
                  Across 12 dining pavilion tables
                </p>
              </div>

              <div className="bg-white border border-[#E8E6DD] rounded-[24px] p-6 shadow-sm space-y-2 hover:border-[#14532D]/40 transition-colors">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Labor & Food Margin
                </span>
                <div className="font-display text-3xl font-extrabold text-[#121110]">
                  68.2%
                </div>
                <p className="text-xs text-emerald-700 font-semibold pt-1">
                  Optimal woodfire cost efficiency
                </p>
              </div>

              <div className="bg-white border border-[#E8E6DD] rounded-[24px] p-6 shadow-sm space-y-2 hover:border-[#14532D]/40 transition-colors">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A82]">
                  Registered Staff On Duty
                </span>
                <div className="font-display text-3xl font-extrabold text-[#C2410C]">
                  {registeredStaffList.length} Staff
                </div>
                <p className="text-xs text-[#666] pt-1">
                  Active role sync across branch
                </p>
              </div>
            </div>

            {/* Interactive Staff Analytics Widget */}
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm">
              <StaffAnalyticsWidget orders={orders} menu={menu} />
            </div>

            {/* Direct Staff Onboarding & Account Provisioning Section */}
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#121110] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#14532D]" />
                    Direct Staff Account Creation & Role Provisioning
                  </h3>
                  <p className="text-xs text-[#666] pt-1">
                    Add new staff members directly to the branch database. They can immediately log in on the Staff Access page using their assigned email and 4-digit PIN.
                  </p>
                </div>
                <span className="text-xs font-mono bg-[#DCFCE7] text-[#14532D] font-bold px-3 py-1.5 rounded-xl border border-emerald-300">
                  CEO Direct Control
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form to Directly Provision Staff */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!inviteName.trim()) return;
                  restaurantDB.registerStaffMember({
                    fullName: inviteName.trim(),
                    email: `${selectedInviteRole}-${Math.floor(100 + Math.random() * 900)}@aduke.com`,
                    role: selectedInviteRole,
                    phone: '+234 803 000 0000',
                    staffPin: Math.floor(1000 + Math.random() * 9000).toString()
                  });
                  setInviteName('');
                }} className="lg:col-span-5 space-y-4 bg-[#FAFAF7] p-6 rounded-2xl border border-[#E8E6DD]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#121110] flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#14532D]" />
                    Add New Staff Member
                  </h4>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#666]">Staff Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef Ibrahim or Waiter Sarah"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DD] rounded-xl text-xs text-[#121110] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#666]">Target Role & Dashboard Permission</label>
                    <select
                      value={selectedInviteRole}
                      onChange={(e) => setSelectedInviteRole(e.target.value as StaffRole)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DD] rounded-xl text-xs text-[#121110] focus:outline-none focus:border-[#14532D] font-medium"
                    >
                      <option value="chef">Head Chef (Kitchen Queue & Embers)</option>
                      <option value="waiter">Floor Waiter (Table Buzzers & Ordering)</option>
                      <option value="cashier">Cashier (Billing & POS Terminal)</option>
                      <option value="manager">General Manager (Ops & Shift Audit)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Register Staff Account</span>
                  </button>
                </form>

                {/* Live Registered Staff Database List */}
                <div className="lg:col-span-7 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#121110] flex items-center justify-between">
                    <span>Registered Staff Accounts ({registeredStaffList.length})</span>
                    <span className="text-[11px] text-[#8C8A82] font-normal">Auto-Synced Database</span>
                  </h4>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {registeredStaffList.map((stf: any) => (
                      <div key={stf.id} className="p-4 bg-white border border-[#E8E6DD] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#121110]">{stf.fullName}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold uppercase">
                              {stf.role}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#8C8A82]">
                            Email: {stf.email} · PIN: <span className="font-bold text-[#14532D]">{stf.staffPin || '1122'}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#14532D] font-bold bg-[#DCFCE7] px-2.5 py-1 rounded-lg shrink-0">
                          Active & Ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MySQL & Laravel PHP Database Export Utility */}
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
                <div>
                  <h3 className="font-display text-base font-bold text-[#121110] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#14532D]" />
                    MySQL & Laravel PHP Database Schema Bundle
                  </h3>
                  <p className="text-xs text-[#666] pt-1">
                    Ready-to-run MySQL DDL (`database/schema.sql`) and Laravel 10/11 Eloquent Migrations (`database/laravel/migrations/`).
                  </p>
                </div>
                <span className="text-xs font-mono text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-lg font-bold border border-emerald-300">
                  PHP / MySQL / Laravel Ready
                </span>
              </div>

              <div className="p-4 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#121110] font-bold">
                  <span>📄 MySQL Schema File: /database/schema.sql</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`CREATE DATABASE IF NOT EXISTS aduke_restaurant; USE aduke_restaurant; ...`);
                      alert('MySQL DDL Script copied to clipboard!');
                    }}
                    className="px-3 py-1 bg-[#14532D] text-white text-[11px] rounded-lg hover:bg-[#0D3823] cursor-pointer"
                  >
                    Copy SQL DDL
                  </button>
                </div>
                <div className="flex items-center justify-between text-[#121110] font-bold">
                  <span>🐘 Laravel Migration: /database/laravel/migrations/2026_09_23_000001_create_restaurant_tables.php</span>
                  <button
                    onClick={() => {
                      alert('Laravel PHP Migrations & Models generated in /database/laravel/');
                    }}
                    className="px-3 py-1 bg-[#14532D] text-white text-[11px] rounded-lg hover:bg-[#0D3823] cursor-pointer"
                  >
                    View Laravel Migration
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
                <h3 className="font-display text-base font-bold text-[#121110] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#14532D]" />
                  Active Registered Staff Roster ({registeredStaffList.length})
                </h3>
                <span className="text-xs font-mono text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-lg font-bold">
                  Synced Database
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {registeredStaffList.map((stf: any) => (
                  <div key={stf.id} className="p-4 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#121110]">{stf.fullName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold uppercase">
                        {stf.role}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#666] truncate">{stf.email}</p>
                    <div className="text-[10px] text-[#8C8A82] pt-2 border-t border-[#E8E6DD] flex items-center justify-between font-mono">
                      <span>PIN: {stf.staffPin || '****'}</span>
                      <span>Joined: {stf.registeredAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
