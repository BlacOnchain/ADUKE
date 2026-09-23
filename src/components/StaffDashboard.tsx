import React, { useState } from 'react';
import {
  ChefHat,
  Settings,
  X,
  RotateCcw
} from 'lucide-react';
import {
  RestaurantOrder,
  TableReservation,
  StaffRole,
  TableSession,
  PaymentMethod,
  formatNaira,
  MenuItem
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

  const refreshTables = () => {
    setTableSessions([...restaurantDB.getTableSessions()]);
  };

  const handleRoleSwitch = (role: StaffRole) => {
    setActiveRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Standardized Header & Clean Controls */}
        <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md">
              <ChefHat className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121110] tracking-tight">
                  Àdùkẹ́ Executive Portal
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold tracking-wide">
                  CEO / FOUNDER VIEW
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#666] font-sans">
                Victoria Island Flagship & Multi-Branch Hospitality Command Center
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
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#121110] hover:bg-black rounded-xl transition-colors shadow-md cursor-pointer"
            >
              <span>Guest Experience</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CEO / OWNER STANDARD DASHBOARD */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          
          {/* Executive KPI Cards with Ample Breathing Room */}
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
                Active Shifts On Duty
              </span>
              <div className="font-display text-3xl font-extrabold text-[#C2410C]">
                14 Staff
              </div>
              <p className="text-xs text-[#666] pt-1">
                1 GM · 1 Chef · 3 Line · 2 Cashiers · 7 Floor
              </p>
            </div>
          </div>

          {/* Interactive Staff Analytics Widget with Recharts */}
          <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm">
            <StaffAnalyticsWidget orders={orders} menu={menu} />
          </div>

          {/* Two-Column Structured Section: Top Dishes & Branch Oversight */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Revenue Dishes */}
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
                <h3 className="font-display text-base font-bold text-[#121110]">
                  Top Revenue Dishes This Week
                </h3>
                <span className="text-xs font-mono text-[#8C8A82] bg-[#FAFAF7] px-3 py-1 rounded-lg border border-[#E8E6DD]">Ranked by Net ₦</span>
              </div>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'Smoked Firewood Jollof Rice Royale', orders: 142, revenue: 3976000 },
                  { name: 'Whole Wood-Fired Grilled Croaker', orders: 88, revenue: 3388000 },
                  { name: 'Slow-Braised Oxtail & Rich Efo Riro', orders: 94, revenue: 3196000 },
                  { name: 'Tiger Prawn & Beef Suya Platter', orders: 112, revenue: 2520000 },
                  { name: 'Fresh Palm Wine Sangria', orders: 165, revenue: 2062500 },
                ].map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] hover:border-[#14532D]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-[#DCFCE7] text-[#14532D] font-mono font-bold flex items-center justify-center text-xs">
                        #{i + 1}
                      </span>
                      <span className="font-bold text-[#121110] text-sm">{d.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-[#14532D] text-sm">{formatNaira(d.revenue)}</div>
                      <span className="text-[11px] text-[#8C8A82]">{d.orders} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Branch Oversight */}
            <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
                <h3 className="font-display text-base font-bold text-[#121110]">
                  Executive Branch Oversight
                </h3>
                <span className="text-xs font-mono text-[#14532D] font-bold bg-[#DCFCE7] px-3 py-1 rounded-lg">2 Branches</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl border border-emerald-300 bg-[#DCFCE7]/20 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-sm text-[#121110]">
                    <span>1. Lagos Flagship (Victoria Island)</span>
                    <span className="font-mono text-xs text-[#14532D] bg-white px-2.5 py-1 rounded-full border border-emerald-300">● Active Flagship</span>
                  </div>
                  <p className="text-[#595852] text-xs">14 Adeola Odeku St, Victoria Island, Lagos</p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-emerald-200 font-medium">
                    <span className="text-[#666]">12 Pavilion Tables · 4 Seating Zones</span>
                    <span className="font-mono font-bold text-[#14532D] text-sm">{formatNaira(3485000)} today</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[#E8E6DD] bg-[#FAFAF7] space-y-3 opacity-90 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-sm text-[#121110]">
                    <span>2. Abuja Maitama Lounge (Opening Nov)</span>
                    <span className="font-mono text-xs text-[#C89B3C] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Pre-Launch</span>
                  </div>
                  <p className="text-[#595852] text-xs">Plot 1044 Aguiyi Ironsi Way, Maitama, Abuja</p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E8E6DD] font-medium">
                    <span className="text-[#666]">18 Tables · Hearth Charcoal Pits</span>
                    <span className="font-mono font-bold text-[#8C8A82]">Target: Dec 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
