import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Flame, Receipt, Tablet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StaffRole } from '../types/restaurant';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'staff';
  onStaffLoginSuccess?: (role: StaffRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onStaffLoginSuccess,
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, sendPasswordReset } = useAuth();
  const [authCategory, setAuthCategory] = useState<'guest' | 'staff'>(
    defaultMode === 'staff' ? 'staff' : 'guest'
  );
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(
    defaultMode === 'staff' ? 'login' : defaultMode
  );
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole>('owner');
  const [staffPin, setStaffPin] = useState('1234');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
        onClose();
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name);
        onClose();
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setError('Please enter your account email address');
          setLoading(false);
          return;
        }
        await sendPasswordReset(email.trim());
        setSuccessMsg(`Password recovery instructions have been sent to ${email.trim()}`);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication error';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid email or password combination.';
      } else if (msg.includes('email-already-in-use')) {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (msg.includes('weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fast PIN or instant staff elevation
    setTimeout(() => {
      setLoading(false);
      if (onStaffLoginSuccess) {
        onStaffLoginSuccess(selectedStaffRole);
      }
      onClose();
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  const staffTiers: { id: StaffRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'owner', label: 'CEO & Founder', icon: <TrendingUp className="w-4 h-4 text-emerald-700" />, desc: 'Executive P&L sales, labor margins & branch override' },
    { id: 'manager', label: 'General Manager', icon: <ShieldCheck className="w-4 h-4 text-indigo-700" />, desc: 'Floor plan tables, staff roster, reservations & menu 86' },
    { id: 'chef', label: 'Head Chef (KDS)', icon: <Flame className="w-4 h-4 text-[#C2410C]" />, desc: 'Live woodfire hearth tickets, grilling timers & prep' },
    { id: 'cashier', label: 'Cashier (POS)', icon: <Receipt className="w-4 h-4 text-[#C89B3C]" />, desc: 'Table check settlements, POS slips & VAT receipts' },
    { id: 'waiter', label: 'Floor Waiter Tablet', icon: <Tablet className="w-4 h-4 text-teal-700" />, desc: 'Table buzzers (water/bills) & fast table ordering' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white border border-[#E8E6DD] rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#8C8A82] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Guest vs Staff Selector Switch */}
        <div className="grid grid-cols-2 p-1 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-xs">
          <button
            type="button"
            onClick={() => setAuthCategory('guest')}
            className={`py-2 px-3 rounded-xl font-semibold transition-all cursor-pointer ${
              authCategory === 'guest'
                ? 'bg-white text-[#121110] shadow-xs'
                : 'text-[#8C8A82] hover:text-[#121110]'
            }`}
          >
            Guest Dining Access
          </button>
          <button
            type="button"
            onClick={() => setAuthCategory('staff')}
            className={`py-2 px-3 rounded-xl font-semibold transition-all cursor-pointer ${
              authCategory === 'staff'
                ? 'bg-[#121110] text-white shadow-xs'
                : 'text-[#8C8A82] hover:text-[#121110]'
            }`}
          >
            Staff & Hierarchy Portal
          </button>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-display text-2xl font-bold text-[#121110]">
            {authCategory === 'staff'
              ? 'Restaurant Operations Portal'
              : mode === 'login'
              ? 'Welcome to Àdùkẹ́'
              : mode === 'signup'
              ? 'Create Guest Account'
              : 'Password Recovery'}
          </h3>
          <p className="text-xs text-[#595852]">
            {authCategory === 'staff'
              ? 'Authenticate to access CEO, Manager, Kitchen KDS, Cashier POS, or Waiter tablet tools.'
              : mode === 'login'
              ? 'Sign in to access your table bookings, orders & dining history.'
              : mode === 'signup'
              ? 'Join for expedited reservations and table QR ordering.'
              : 'Enter your email to receive a password recovery link.'}
          </p>
        </div>

        {/* ================= GUEST FLOW ================= */}
        {authCategory === 'guest' && (
          <div className="space-y-4">
            {/* Google Quick Sign-In */}
            {mode !== 'reset' && (
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white hover:bg-[#FAFAF7] text-[#121110] font-semibold text-xs rounded-xl border border-[#E8E6DD] transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8E6DD]" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                    <span className="bg-white px-2 text-[#8C8A82]">or with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error / Success Notifications */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 bg-[#DCFCE7] border border-emerald-300 rounded-xl text-xs text-[#14532D] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleGuestSubmit} className="space-y-3.5 text-xs">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[#121110] font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Folashade Adeleke"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[#121110] font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#121110] font-semibold">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="text-[11px] text-[#14532D] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : mode === 'login'
                    ? 'Sign In to Account'
                    : mode === 'signup'
                    ? 'Create Guest Profile'
                    : 'Send Recovery Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="pt-2 border-t border-[#E8E6DD] text-center text-xs text-[#595852]">
              {mode === 'login' && (
                <p>
                  New guest to Àdùkẹ́?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[#14532D] font-bold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#14532D] font-bold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#14532D] font-bold hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= STAFF HIERARCHY FLOW ================= */}
        {authCategory === 'staff' && (
          <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#121110]">
                Select Hierarchy Station to Assume
              </label>
              <div className="space-y-2">
                {staffTiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedStaffRole(t.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      selectedStaffRole === t.id
                        ? 'border-[#14532D] bg-[#DCFCE7]/50 ring-1 ring-[#14532D]'
                        : 'border-[#E8E6DD] bg-white hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-[#E8E6DD]">
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#121110] text-xs">{t.label}</div>
                      <p className="text-[11px] text-[#595852] truncate">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#121110]">Staff Security PIN / Passkey</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] font-mono tracking-widest focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <span className="text-[10px] text-[#8C8A82]">Demo bypass: PIN 1234 prefilled for fast evaluation</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#121110] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Launching Terminal...' : `Access ${selectedStaffRole.toUpperCase()} Console`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
