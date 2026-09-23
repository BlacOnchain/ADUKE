/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Flame, Tablet, Receipt, TrendingUp, Utensils, Sparkles, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-[#121110] text-[#FAFAF7] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Ambience: Warm Firewood Glow & Atmospheric Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/85 to-transparent z-0 pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Brand Story & Hospitality Atmosphere */}
        <div className="lg:col-span-6 space-y-6 lg:pr-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#14532D]/40 border border-[#14532D] text-[#DCFCE7] rounded-full text-xs font-medium tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Àdùkẹ́ Gastronomy · Staff Sanctuary</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-none">
            Where woodfire meets <span className="italic font-light text-amber-200">heritage</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#D4D2C9] leading-relaxed max-w-md font-sans">
            Welcome to the internal hospitality portal. Sign in to oversee live kitchen embers, table progression, guest concierge requests, and daily performance metrics.
          </p>

          <div className="pt-4 flex items-center gap-6 text-xs text-[#A3A199] border-t border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Victoria Island, Lagos</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Open Daily 12:00 PM – 11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury Staff Login Card */}
        <div className="lg:col-span-6 bg-[#1A1817] border border-[#332F2D] rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-black/80 space-y-6">
          <div className="space-y-2 text-center pb-2">
            <div className="mx-auto w-14 h-14 bg-[#14532D] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950 mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-7 h-7 text-[#DCFCE7]" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Staff Portal Access
            </h2>
            <p className="text-xs text-[#A3A199]">
              Authorized team members and management only
            </p>
          </div>

          {/* Quick Hospitality Role Presets */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3A199] block text-center">
              Tap a Role for Instant Demo Login
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fillDemoStaff('owner@aduke.com')}
                className="p-2.5 bg-[#252220] hover:bg-[#332F2D] border border-[#332F2D] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white block">Management</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('chef@aduke.com')}
                className="p-2.5 bg-[#252220] hover:bg-[#332F2D] border border-[#332F2D] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white block">Head Chef</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('waiter@aduke.com')}
                className="p-2.5 bg-[#252220] hover:bg-[#332F2D] border border-[#332F2D] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Tablet className="w-4 h-4 text-teal-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white block">Floor Waiter</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('cashier@aduke.com')}
                className="p-2.5 bg-[#252220] hover:bg-[#332F2D] border border-[#332F2D] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Receipt className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white block">Cashier</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4D2C9]">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="chef@aduke.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#121110] border border-[#332F2D] rounded-2xl text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4D2C9]">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#121110] border border-[#332F2D] rounded-2xl text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Staff...' : 'Enter Staff Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#332F2D]">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-medium text-[#A3A199] hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Àdùkẹ́ Public Dining Experience
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
