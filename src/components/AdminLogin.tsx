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
      const isStaff = ['admin', 'staff', 'owner', 'chef', 'waiter', 'cashier', 'manager', 'odubelatomiwa'].some(role => emailLower.includes(role));
      
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
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Ambience: Soft warm cream and subtle emerald glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14532D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Brand Story & Gorgeous Image Panel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#DCFCE7] border border-[#14532D]/20 text-[#14532D] rounded-full text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Àdùkẹ́ Gastronomy · Staff Operations</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#121110] leading-tight">
            Where woodfire meets <span className="italic font-normal text-[#14532D]">gastronomy</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#595852] leading-relaxed max-w-lg font-sans">
            Welcome to the internal hospitality command center. Sign in to oversee live kitchen embers, table progression, guest concierge requests, and daily performance metrics.
          </p>

          {/* Gorgeous Embedded Image Showcase */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8E6DD] h-64 sm:h-72 group">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80" 
              alt="Àdùkẹ́ Grill Master" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-300">Victoria Island, Lagos</span>
              <span className="font-display text-xl font-bold">Prime Cuts & Open Embers</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#8C8A82]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#14532D]" />
              <span>Victoria Island, Lagos</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#14532D]" />
              <span>Open Daily 12:00 PM – 11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Luxury Staff Login Card */}
        <div className="lg:col-span-6 bg-white border border-[#E8E6DD] rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center pb-2">
            <div className="mx-auto w-14 h-14 bg-[#14532D] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/20 mb-3">
              <ShieldCheck className="w-7 h-7 text-[#DCFCE7]" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#121110]">
              Staff Portal Access
            </h2>
            <p className="text-xs text-[#8C8A82]">
              Authorized team members and management only
            </p>
          </div>

          {/* Quick Hospitality Role Presets */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8A82] block text-center">
              Tap a Role for Instant Demo Login
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fillDemoStaff('Odubelatomiwa508@gmail.com', 'BLAC: Password')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <TrendingUp className="w-4 h-4 text-[#14532D] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Management</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('chef@aduke.com')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Flame className="w-4 h-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Head Chef</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('waiter@aduke.com')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Tablet className="w-4 h-4 text-teal-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Floor Waiter</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('cashier@aduke.com')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Receipt className="w-4 h-4 text-amber-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Cashier</span>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="chef@aduke.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Staff...' : 'Enter Staff Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#E8E6DD]">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer"
            >
              ← Return to Àdùkẹ́ Public Dining Experience
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
