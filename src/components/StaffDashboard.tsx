import React, { useState } from 'react';
import {
  ChefHat,
  Settings,
  X,
  Link,
  Copy,
  Check,
  UserPlus,
  Shield,
  Key,
  Sparkles,
  Users
} from 'lucide-react';
import {
  RestaurantOrder,
  TableReservation,
  StaffRole,
  TableSession,
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
  const [activeRole, setActiveRole] = useState<StaffRole>(
    currentRole === 'customer' ? 'owner' : currentRole
  );

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
    const link = `${window.location.origin}/admin?inviteRole=${invite.role}&token=${invite.token}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(invite.id);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  const deleteInvite = (id: string) => {
    const updated = generatedInvites.filter(inv => inv.id !== id);
    setGeneratedInvites(updated);
    localStorage.setItem('aduke_staff_invites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Clean, Standardized Executive Header */}
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

          {/* Interactive Staff Analytics Widget */}
          <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm">
            <StaffAnalyticsWidget orders={orders} menu={menu} />
          </div>

          {/* Staff Invite Link Generator & Role Provisioning Section */}
          <div className="bg-white border border-[#E8E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
              <div>
                <h3 className="font-display text-lg font-bold text-[#121110] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#14532D]" />
                  Secure Staff Invite Links & Role Provisioning
                </h3>
                <p className="text-xs text-[#666] pt-1">
                  Generate unique role-based registration links for new staff members to join their respective dashboards automatically upon sign up.
                </p>
              </div>
              <span className="text-xs font-mono bg-[#DCFCE7] text-[#14532D] font-bold px-3 py-1.5 rounded-xl border border-emerald-300">
                CEO Direct Control
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form to Generate Invite */}
              <form onSubmit={handleGenerateInvite} className="lg:col-span-5 space-y-4 bg-[#FAFAF7] p-6 rounded-2xl border border-[#E8E6DD]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#121110] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#C89B3C]" />
                  Create New Staff Invite
                </h4>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#666]">Staff Name / Identifier (Optional)</label>
                  <input
                    type="text"
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
                    <option value="chef">Head Chef (Kitchen Embers Queue)</option>
                    <option value="waiter">Floor Waiter (Table Service & Tablet)</option>
                    <option value="cashier">Cashier (Billing & POS Terminal)</option>
                    <option value="manager">General Manager (Ops & Oversight)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Link className="w-4 h-4" />
                  <span>Generate Unique Secure Link</span>
                </button>
              </form>

              {/* List of Active Generated Invites */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#121110] flex items-center justify-between">
                  <span>Active Generated Invite Links ({generatedInvites.length})</span>
                  <span className="text-[11px] text-[#8C8A82] font-normal">Auto-Syncs with Role Permissions</span>
                </h4>

                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {generatedInvites.length === 0 ? (
                    <div className="p-6 text-center bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#8C8A82]">
                      No active invite links generated yet. Use the form on the left to create one.
                    </div>
                  ) : (
                    generatedInvites.map((inv) => (
                      <div key={inv.id} className="p-4 bg-white border border-[#E8E6DD] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#14532D]/30 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#121110]">{inv.roleTitle}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold uppercase">
                              {inv.role}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#8C8A82] truncate max-w-xs sm:max-w-sm">
                            {window.location.origin}/admin?inviteRole={inv.role}&token={inv.token}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => copyInviteLink(inv)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#14532D] bg-[#DCFCE7] hover:bg-emerald-200 rounded-xl transition-all cursor-pointer"
                          >
                            {copiedTokenId === inv.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-800" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => deleteInvite(inv.id)}
                            className="p-2 text-[#8C8A82] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Revoke link"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
