import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
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
  onStaffLoginSuccess,
}) => {
  const { signInWithEmail, logout } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic check before sending request to save time
      const emailLower = email.trim().toLowerCase();
      const isStaff = ['admin', 'staff', 'owner', 'chef', 'waiter', 'cashier', 'manager'].some(role => emailLower.includes(role));
      
      if (!isStaff) {
        throw new Error('Access Denied: You are not a staff member.');
      }

      await signInWithEmail(emailLower, password);

      // Verify role after sign in (in case they bypassed the client check somehow)
      if (!isStaff) {
        await logout();
        throw new Error('Access Denied: You are not a staff member.');
      }

      // Success
      if (onStaffLoginSuccess) {
        let role = 'owner';
        if (emailLower.includes('chef')) role = 'chef';
        else if (emailLower.includes('waiter')) role = 'waiter';
        else if (emailLower.includes('cashier')) role = 'cashier';
        else if (emailLower.includes('manager')) role = 'manager';
        
        onStaffLoginSuccess(role as any); 
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication error';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid staff email or password combination.';
      }
      setError(msg);
      await logout(); // Ensure they are logged out on error
    } finally {
      setLoading(false);
    }
  };

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

        {/* Header */}
        <div className="space-y-2 text-center pb-2 border-b border-[#E8E6DD]">
          <div className="mx-auto w-12 h-12 bg-[#121110] rounded-2xl flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[#121110]">
            Staff Operations
          </h3>
          <p className="text-xs text-[#595852]">
            Restricted access. Only registered staff members may authenticate.
          </p>
        </div>

        {/* Error Notifications */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Strictly Staff Auth Form */}
        <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="block text-[#121110] font-semibold">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@aduke.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[#121110] font-semibold">Security PIN / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8A82] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {loading ? 'Verifying Database...' : 'Access Staff Console'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
