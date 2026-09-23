/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Key, ArrowRight, Sparkles, ShieldCheck, Flame, Tablet, Receipt, TrendingUp, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StaffRole } from '../types/restaurant';

export const StaffOnboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();

  const roleParam = (searchParams.get('role') || searchParams.get('inviteRole') || 'chef') as StaffRole;
  const tokenParam = searchParams.get('token') || 'invite-default';

  const roleTitles: Record<StaffRole, { title: string; desc: string; icon: any }> = {
    owner: { title: 'Executive CEO / Founder', desc: 'Full multi-branch oversight, finance KPIs, and staff invite provisioning', icon: TrendingUp },
    manager: { title: 'General Manager', desc: 'Daily pavilion floor operations, staff shifts, and guest relations', icon: ShieldCheck },
    chef: { title: 'Head Chef', desc: 'Charcoal grill queue, woodfire embers timing, and recipe management', icon: Flame },
    waiter: { title: 'Floor Waiter', desc: 'Table service buzzer tracking, fast ordering tablet, and guest concierge', icon: Tablet },
    cashier: { title: 'Cashier / Accountant', desc: 'POS terminal bill settlement, Naira payments, and daily audit', icon: Receipt },
    customer: { title: 'Dine-In Guest', desc: 'Public dining experience', icon: User }
  };

  const currentRoleInfo = roleTitles[roleParam] || roleTitles.chef;
  const RoleIcon = currentRoleInfo.icon;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(
    roleParam === 'chef' ? 'chef@aduke.com' :
    roleParam === 'waiter' ? 'waiter@aduke.com' :
    roleParam === 'cashier' ? 'cashier@aduke.com' :
    roleParam === 'manager' ? 'manager@aduke.com' :
    'Odubelatomiwa508@gmail.com'
  );
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+234 803 000 0000');
  const [staffPin, setStaffPin] = useState('4422');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate account registration & auth sync
      localStorage.setItem('aduke_staff_session', JSON.stringify({
        uid: 'staff-' + Date.now(),
        email: email.trim().toLowerCase(),
        displayName: fullName.trim() || currentRoleInfo.title,
        role: roleParam
      }));

      await signInWithEmail(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      // Fallback auth
      localStorage.setItem('aduke_staff_session', JSON.stringify({
        uid: 'staff-' + Date.now(),
        email: email.trim().toLowerCase(),
        displayName: fullName.trim() || currentRoleInfo.title,
        role: roleParam
      }));
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#121110] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden bg-[#121110]">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#121110] via-[#121110]/80 to-[#14532D]/40 z-0 backdrop-blur-[3px]" />

      <div className="w-full max-w-xl relative z-10 bg-white/95 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-[#14532D] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/20 mb-3">
            <RoleIcon className="w-7 h-7 text-[#DCFCE7]" />
          </div>
          <span className="text-[11px] font-mono px-3 py-1 bg-[#DCFCE7] text-[#14532D] font-bold rounded-full uppercase tracking-wider">
            Secure Staff Onboarding Link
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#121110]">
            Join as {currentRoleInfo.title}
          </h2>
          <p className="text-xs text-[#8C8A82] max-w-md mx-auto">
            {currentRoleInfo.desc}. Please complete your account setup below to synchronize your role dashboard.
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <ShieldCheck className="w-10 h-10 text-[#14532D] mx-auto animate-bounce" />
            <h3 className="font-display text-lg font-bold text-[#14532D]">Account Created & Synced!</h3>
            <p className="text-xs text-emerald-800">Redirecting to your role-specific dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Tunde Adebayo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Staff Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">4-Digit Staff PIN</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Creating Dashboard Account...' : `Complete Setup & Open ${currentRoleInfo.title} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#E8E6DD]">
          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            className="text-xs font-semibold text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer"
          >
            Already have a staff account? Sign In Here
          </button>
        </div>

      </div>
    </div>
  );
};
