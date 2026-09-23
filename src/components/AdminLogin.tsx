/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Flame, Tablet, Receipt, TrendingUp, Sparkles, MapPin, Utensils, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const { signInWithEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const inviteRole = searchParams.get('inviteRole');
  const inviteToken = searchParams.get('token');

  const [email, setEmail] = useState(
    inviteRole === 'chef' ? 'chef@aduke.com' :
    inviteRole === 'waiter' ? 'waiter@aduke.com' :
    inviteRole === 'cashier' ? 'cashier@aduke.com' :
    inviteRole === 'manager' ? 'manager@aduke.com' :
    'Odubelatomiwa508@gmail.com'
  );
  const [password, setPassword] = useState('BLAC: Password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inviteRole) {
      const roleEmails: Record<string, string> = {
        chef: 'chef@aduke.com',
        waiter: 'waiter@aduke.com',
        cashier: 'cashier@aduke.com',
        manager: 'manager@aduke.com'
      };
      if (roleEmails[inviteRole]) {
        setEmail(roleEmails[inviteRole]);
        setPassword('password123');
      }
    }
  }, [inviteRole]);

  const fillDemoStaff = (roleEmail: string, pass: string) => {
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
    <div className="min-h-screen text-[#121110] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Image (Static & Immersive, No Animation) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#121110]/90 via-[#121110]/75 to-[#14532D]/40 z-0 backdrop-blur-[2px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Animated Brand Story & Highlights */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-[#DCFCE7] rounded-full text-xs font-bold font-mono backdrop-blur-md animate-bounce duration-1000">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Àdùkẹ́ Gastronomy · Executive Portal</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Where woodfire meets <span className="italic font-light text-amber-300">gastronomy</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#E8E6DD] leading-relaxed max-w-lg font-sans drop-shadow">
            Oversee live kitchen embers, table progression, guest concierge requests, and executive performance metrics in real-time.
          </p>

          {/* Floating Animated Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="px-3.5 py-2 bg-white/15 border border-white/25 rounded-xl text-xs text-white flex items-center gap-2 backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Table Tracking
            </div>
            <div className="px-3.5 py-2 bg-white/15 border border-white/25 rounded-xl text-xs text-white flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Charcoal Grill Queue
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#D4D2C9] pt-4 border-t border-white/15">
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

        {/* Right Column: Clean, Static, Unanimated Luxury Staff Login Card */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6">
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

          {/* Invite Banner if invite token is present */}
          {inviteRole && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 shrink-0 text-emerald-700" />
              <div>
                <span className="font-bold block">CEO Invite Link Detected</span>
                <span>Role: <strong className="uppercase">{inviteRole}</strong>. Sign in below to sync your dashboard.</span>
              </div>
            </div>
          )}

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
                onClick={() => fillDemoStaff('chef@aduke.com', 'password123')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Flame className="w-4 h-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Head Chef</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('waiter@aduke.com', 'password123')}
                className="p-2.5 bg-[#FAFAF7] hover:bg-[#E8E6DD]/60 border border-[#E8E6DD] rounded-2xl text-center transition-all cursor-pointer group"
              >
                <Tablet className="w-4 h-4 text-teal-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#121110] block">Floor Waiter</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoStaff('cashier@aduke.com', 'password123')}
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
