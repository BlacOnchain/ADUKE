/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Flame, Tablet, Receipt, TrendingUp, UtensilsCrossed, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const { signInWithEmail, logout } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillDemoStaff = (roleEmail: string, pass: string = 'password123') => {
    setEmail(roleEmail);
    setPassword(pass);
    setError(null);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const emailLower = email.trim().toLowerCase();
      const isStaff = ['admin', 'staff', 'owner', 'chef', 'waiter', 'cashier', 'manager'].some(role => emailLower.includes(role));
      
      if (!isStaff) {
        throw new Error('Access Denied: You are not a registered staff member.');
      }

      await signInWithEmail(emailLower, password);

      // Verify again
      if (!isStaff) {
        await logout();
        throw new Error('Access Denied: You are not a registered staff member.');
      }

      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication error';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid staff email or password combination.';
      }
      setError(msg);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F4EA] via-[#FAFAF7] to-[#F1F8F5] text-[#121110] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
      
      {/* Background ambient glowing gradient spheres */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14532D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Floating Login Card */}
        <div className="lg:col-span-5 bg-white border border-[#E8E6DD] rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCFCE7] text-[#14532D] rounded-full text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#14532D] animate-pulse" />
              Staff Operations Portal
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121110]">
              Welcome back
            </h2>
            <p className="text-xs text-[#595852]">
              Sign in to manage live tables, kitchen orders, and service alerts.
            </p>
          </div>

          {/* Quick Demo Presets */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8A82] block">
              Instant Demo Credentials
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemoStaff('owner@aduke.com')}
                className="p-2 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-xl text-center transition-all cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#14532D] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#121110] block">CEO</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('chef@aduke.com')}
                className="p-2 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-xl text-center transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#121110] block">Chef</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('waiter@aduke.com')}
                className="p-2 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-xl text-center transition-all cursor-pointer"
              >
                <Tablet className="w-3.5 h-3.5 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#121110] block">Waiter</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('cashier@aduke.com')}
                className="p-2 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-xl text-center transition-all cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#121110] block">Cashier</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#121110]">Staff Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="chef@aduke.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#121110]">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Sign In as Staff'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>

        {/* Right Column: Hero Showcase & Features */}
        <div className="lg:col-span-7 space-y-6 lg:pl-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E8E6DD] rounded-full text-xs font-medium text-[#14532D] shadow-2xs">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#14532D]" />
              Àdùkẹ́ Experience Management
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#121110] leading-tight">
              One QR code, one table session, zero wait times.
            </h1>

            <p className="text-sm sm:text-base text-[#595852] max-w-xl">
              Manage live table orders, kitchen fire-grill queues, guest service buzzer requests, and revenue analytics in one unified realtime dashboard.
            </p>

            {/* Steps indicator */}
            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#595852]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E6DD] rounded-lg">
                <span className="w-4 h-4 rounded-full bg-[#14532D] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Scan
              </span>
              <span>→</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E6DD] rounded-lg">
                <span className="w-4 h-4 rounded-full bg-[#14532D] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Verify
              </span>
              <span>→</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E6DD] rounded-lg">
                <span className="w-4 h-4 rounded-full bg-[#14532D] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                Serve
              </span>
            </div>
          </div>

          {/* Live Session Code pill */}
          <div className="p-4 bg-white border border-[#E8E6DD] rounded-2xl shadow-sm flex items-center justify-between max-w-md">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#14532D] animate-ping" />
              <span className="text-xs font-bold text-[#121110] uppercase tracking-wider">Active Table Terminal Code</span>
            </div>
            <span className="font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-xl text-sm">
              ADUKE-VI-01
            </span>
          </div>

          {/* Feature Grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-white border border-[#E8E6DD] rounded-2xl shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center font-bold">
                <Tablet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#121110]">Floor Staff</h3>
              <p className="text-xs text-[#8C8A82]">Table status tracking & buzzer dispatch.</p>
            </div>

            <div className="p-5 bg-white border border-[#E8E6DD] rounded-2xl shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#121110]">Kitchen Grill</h3>
              <p className="text-xs text-[#8C8A82]">Charcoal & firewood order queue staging.</p>
            </div>

            <div className="p-5 bg-white border border-[#E8E6DD] rounded-2xl shadow-2xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#121110]">Executive Suite</h3>
              <p className="text-xs text-[#8C8A82]">Revenue analytics & menu management.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
