import React, { useState, useEffect } from 'react';
import { Bell, X, Flame, Bike, PackageCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { InAppNotification, OrderStatus } from '../types/restaurant';
import { notificationService } from '../services/notificationService';

export const NotificationToast: React.FC = () => {
  const [activeToast, setActiveToast] = useState<InAppNotification | null>(null);

  useEffect(() => {
    let lastHandledId: string | null = null;

    const unsubscribe = notificationService.subscribe(() => {
      const history = notificationService.getHistory();
      if (history.length > 0) {
        const latest = history[0];
        if (latest.id !== lastHandledId && !latest.read) {
          lastHandledId = latest.id;
          setActiveToast(latest);

          // Auto dismiss after 6 seconds
          const timer = setTimeout(() => {
            setActiveToast((curr) => (curr?.id === latest.id ? null : curr));
          }, 6000);

          return () => clearTimeout(timer);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!activeToast) return null;

  const getIcon = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return <Sparkles className="w-4 h-4 text-[#14532D]" />;
      case 'cooking':
        return <Flame className="w-4 h-4 text-[#C2410C]" />;
      case 'ready':
        return <Bike className="w-4 h-4 text-[#14532D]" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-[#14532D]" />;
      default:
        return <Bell className="w-4 h-4 text-[#14532D]" />;
    }
  };

  return (
    <div className="fixed top-22 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-4 bg-white/95 backdrop-blur-md border border-[#14532D]/30 rounded-2xl shadow-xl shadow-black/10 flex items-start gap-3 text-left">
        <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#14532D] shrink-0 mt-0.5">
          {getIcon(activeToast.status)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#14532D] font-bold">
              Real-Time Order Alert
            </span>
            <span className="text-[10px] text-[#8C8A82] font-mono">{activeToast.timestamp}</span>
          </div>
          <h4 className="text-xs font-bold text-[#121110] mt-0.5 truncate">{activeToast.title}</h4>
          <p className="text-[11px] text-[#595852] mt-0.5 leading-snug">{activeToast.body}</p>
        </div>

        <button
          onClick={() => setActiveToast(null)}
          aria-label="Dismiss alert"
          className="text-[#8C8A82] hover:text-[#121110] p-1 rounded-lg hover:bg-[#F4F3ED] transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
