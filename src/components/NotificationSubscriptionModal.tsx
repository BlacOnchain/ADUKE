import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  Flame,
  Bike,
  Clock,
  Trash2,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { InAppNotification, NotificationPreferences } from '../types/restaurant';

interface NotificationSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeOrderNumber?: string;
}

export const NotificationSubscriptionModal: React.FC<NotificationSubscriptionModalProps> = ({
  isOpen,
  onClose,
  activeOrderNumber,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(() =>
    notificationService.getPreferences()
  );
  const [history, setHistory] = useState<InAppNotification[]>(() =>
    notificationService.getHistory()
  );
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(notificationService.getPermission());
    }

    const unsubscribe = notificationService.subscribe(() => {
      setPreferences(notificationService.getPreferences());
      setHistory(notificationService.getHistory());
      if (notificationService.isSupported()) {
        setPermission(notificationService.getPermission());
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setRequesting(true);
    const res = await notificationService.requestPermission();
    setPermission(res);
    setRequesting(false);
  };

  const handleToggleSound = () => {
    notificationService.toggleSound();
  };

  const handleTogglePush = () => {
    if (permission !== 'granted') {
      handleRequestPermission();
      return;
    }
    notificationService.toggleBrowserPush();
  };

  const handleClearHistory = () => {
    notificationService.clearHistory();
  };

  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white border border-[#E8E6DD] rounded-3xl overflow-hidden shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAFAF7] border-b border-[#E8E6DD] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#DCFCE7] text-[#14532D]">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#121110]">
                Real-Time Order Notifications
              </h3>
            </div>
            <p className="text-xs text-[#595852]">
              Instant browser alerts for woodfire cooking & courier delivery
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-[#E8E6DD] text-[#8C8A82] hover:text-[#121110] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Permission Status Hero Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isGranted
                ? 'bg-[#DCFCE7]/40 border-[#DCFCE7]'
                : isDenied
                ? 'bg-rose-50 border-rose-200'
                : 'bg-[#FAFAF7] border-[#E8E6DD]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#121110]">
                    Browser Push Service
                  </span>
                  {isGranted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#14532D] text-white text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  ) : isDenied ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-bold">
                      <AlertCircle className="w-3 h-3" /> BLOCKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C89B3C] text-white text-[10px] font-mono font-bold">
                      ACTION NEEDED
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#595852] max-w-sm">
                  {isGranted
                    ? 'Your browser will alert you automatically as your order moves through kitchen hearths and dispatch.'
                    : isDenied
                    ? 'Notifications are blocked in your browser site permissions. Please allow notifications in your address bar icon.'
                    : 'Subscribe to receive immediate push alerts when your suya is grilling and courier departs.'}
                </p>
              </div>

              {!isGranted && !isDenied && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  disabled={requesting}
                  className="px-4 py-2.5 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  {requesting ? 'Requesting...' : 'Allow Browser Alerts'}
                </button>
              )}
            </div>
          </div>

          {/* Preferences Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121110]">
              Alert Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Push Toggle */}
              <div className="p-3.5 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#121110] block">System Notifications</span>
                  <span className="text-[11px] text-[#8C8A82]">Desktop / mobile banners</span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePush}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    preferences.browserNotificationsEnabled && isGranted
                      ? 'bg-[#14532D]'
                      : 'bg-[#D1D0C9]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                      preferences.browserNotificationsEnabled && isGranted ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Sound Toggle */}
              <div className="p-3.5 rounded-2xl bg-[#FAFAF7] border border-[#E8E6DD] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#121110] block">Chime Audio</span>
                  <span className="text-[11px] text-[#8C8A82]">Soft harmonic alert tone</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    preferences.soundEnabled
                      ? 'bg-[#DCFCE7] text-[#14532D] border-[#14532D]/30'
                      : 'bg-white text-[#8C8A82] border-[#E8E6DD]'
                  }`}
                >
                  {preferences.soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>


          </div>

          {/* Activity Stream / History */}
          <div className="space-y-3 pt-4 border-t border-[#E8E6DD]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Recent Status Feed ({history.length})</span>
              </h4>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[11px] text-[#8C8A82] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear feed</span>
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8C8A82] border border-dashed border-[#E8E6DD] rounded-2xl">
                  No notifications yet. Status updates will appear here in real-time as your meal cooks.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FAFAF7] hover:bg-white border border-[#E8E6DD] rounded-2xl text-xs space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#121110] truncate">{item.title}</span>
                      <span className="text-[10px] font-mono text-[#8C8A82] shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#595852]">{item.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAF7] border-t border-[#E8E6DD] flex items-center justify-between text-xs text-[#8C8A82]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Encrypted Web Push Client</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E8E6DD] hover:bg-[#F4F3ED] text-[#121110] font-medium rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
