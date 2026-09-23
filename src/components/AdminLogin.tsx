/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Flame, Tablet, Receipt, TrendingUp, Sparkles, MapPin, Utensils, UserCheck, Key, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StaffRole } from '../types/restaurant';
import { restaurantDB } from '../data/db';

export const AdminLogin: React.FC = () => {
  const { signInWithEmail, logout } = useAuth();
  const navigate = useNavigate();

  // Active tab mode: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('Odubelatomiwa508@gmail.com');
  const [password, setPassword] = useState('BLAC: Password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Registration form state
  const [regRole, setRegRole] = useState<StaffRole>('chef');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('chef@aduke.com');
  const [regPin, setRegPin] = useState('4410');
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register in DB
      restaurantDB.registerStaffMember({
        fullName: regName.trim() || `${regRole.toUpperCase()} Staff`,
        email: regEmail.trim().toLowerCase(),
        role: regRole,
        phone: '+234 800 000 0000',
        staffPin: regPin
      });

      // Sign in & open dashboard
      await signInWithEmail(regEmail.trim().toLowerCase(), 'password123');
      setRegSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      // Fallback: direct session entry
      localStorage.setItem('aduke_staff_session', JSON.stringify({
        uid: 'staff-' + Date.now(),
        email: regEmail.trim().toLowerCase(),
        displayName: regName.trim() || regRole.toUpperCase(),
        role: regRole
      }));
      setRegSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
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
      <div className="absolute inset-0 bg-gradient-to-tr from-[#121110]/95 via-[#121110]/80 to-[#14532D]/40 z-0 backdrop-blur-[3px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Hospitality Brand Overview */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-[#DCFCE7] rounded-full text-xs font-bold font-mono backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Àdùkẹ́ Gastronomy · Staff Access Portal</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Where woodfire meets <span className="italic font-light text-amber-300">gastronomy</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#E8E6DD] leading-relaxed max-w-lg font-sans drop-shadow">
            Oversee live kitchen embers, table progression, guest concierge requests, and executive performance metrics in real-time.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="px-3.5 py-2 bg-white/15 border border-white/25 rounded-xl text-xs text-white flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Table Tracking
            </div>
            <div className="px-3.5 py-2 bg-white/15 border border-white/25 rounded-xl text-xs text-white flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
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

        {/* Right Column: Clean Dual-Tab Staff Portal Card */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Top Switcher Tabs: Sign In vs Staff Registration */}
          <div className="p-1.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'text-[#8C8A82] hover:text-[#121110]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'text-[#8C8A82] hover:text-[#121110]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>New Staff Onboarding</span>
            </button>
          </div>

          {/* MODE 1: STAFF SIGN IN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <div className="space-y-1 text-center">
                <h2 className="font-display text-xl font-bold tracking-tight text-[#121110]">
                  Staff Portal Access
                </h2>
                <p className="text-xs text-[#8C8A82]">
                  Tap a role for instant demo login or enter your staff credentials
                </p>
              </div>

              {/* Quick Hospitality Role Presets */}
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

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStaffSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Staff Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="chef@aduke.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating Staff...' : 'Enter Staff Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* MODE 2: NEW STAFF REGISTRATION */}
          {activeTab === 'register' && (
            <div className="space-y-5">
              <div className="space-y-1 text-center">
                <h2 className="font-display text-xl font-bold tracking-tight text-[#121110]">
                  Create Staff Account
                </h2>
                <p className="text-xs text-[#8C8A82]">
                  Select your assigned role and set your account PIN to access your dashboard
                </p>
              </div>

              {regSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                  <UserCheck className="w-8 h-8 text-[#14532D] mx-auto animate-bounce" />
                  <h3 className="font-bold text-sm text-[#14532D]">Staff Account Registered!</h3>
                  <p className="text-xs text-emerald-800">Opening your role-specific dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterStaff} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Select Assigned Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => {
                        const r = e.target.value as StaffRole;
                        setRegRole(r);
                        setRegEmail(`${r}@aduke.com`);
                      }}
                      className="w-full px-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs font-bold text-[#121110] focus:outline-none focus:border-[#14532D]"
                    >
                      <option value="chef">Head Chef (Kitchen Queue & Embers)</option>
                      <option value="waiter">Floor Waiter (Table Buzzers & Ordering)</option>
                      <option value="cashier">Cashier (POS Billing & Settlements)</option>
                      <option value="manager">General Manager (Ops & Shift Audit)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Staff Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef Tunde Adebayo"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">Staff Email</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">4-Digit Staff PIN</label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value)}
                        className="w-full px-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Creating Account...' : `Register & Enter ${regRole.toUpperCase()} Dashboard`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center border-t border-[#E8E6DD]">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer block mx-auto"
            >
              ← Return to Àdùkẹ́ Public Dining Experience
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
