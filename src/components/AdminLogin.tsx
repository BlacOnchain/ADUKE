import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const { signInWithEmail, logout } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Success, just navigate or let the wrapper detect user state
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
    <div className="min-h-screen bg-[#121110] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center pb-4 border-b border-[#E8E6DD]">
          <div className="mx-auto w-16 h-16 bg-[#121110] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-black/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#121110]">
            Staff Operations
          </h1>
          <p className="text-sm text-[#595852]">
            Restricted System Access. Authorized Personnel Only.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStaffSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[#121110] font-bold text-sm">Employee Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="chef@aduke.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[#121110] font-bold text-sm">Security PIN / Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#8C8A82] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Verifying...' : 'Access Staff Terminal'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="pt-4 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-[#8C8A82] hover:text-[#121110] transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
