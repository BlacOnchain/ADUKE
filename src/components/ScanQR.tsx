import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Camera,
  X,
  CheckCircle2,
  Bell,
  Receipt,
  Droplets,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  Users,
  Utensils,
  MapPin,
  Volume2
} from 'lucide-react';
import { TableSession, TableServiceCall, formatNaira } from '../types/restaurant';
import { restaurantDB } from '../data/db';
import confetti from 'canvas-confetti';

interface ScanQRProps {
  isOpen: boolean;
  onClose: () => void;
  activeTableSession: TableSession | null;
  onSelectTableSession: (session: TableSession) => void;
  onOrderForTable: (tableNumber: string) => void;
}

export const ScanQR: React.FC<ScanQRProps> = ({
  isOpen,
  onClose,
  activeTableSession,
  onSelectTableSession,
  onOrderForTable,
}) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [manualTableInput, setManualTableInput] = useState('');
  const [selectedTableNum, setSelectedTableNum] = useState<string>(
    activeTableSession ? activeTableSession.tableNumber : 'Table 4'
  );
  const [activeServiceCall, setActiveServiceCall] = useState<TableServiceCall>(
    activeTableSession?.currentServiceCall || 'none'
  );
  const [callNotification, setCallNotification] = useState<string | null>(null);

  // Sync state if active session exists
  useEffect(() => {
    if (activeTableSession) {
      setSelectedTableNum(activeTableSession.tableNumber);
      setActiveServiceCall(activeTableSession.currentServiceCall);
    }
  }, [activeTableSession]);

  if (!isOpen) return null;

  const tables = restaurantDB.getTableSessions();
  const currentSession = restaurantDB.getTableSession(selectedTableNum) || activeTableSession;

  const handleSimulateScan = (tableNum: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const session = restaurantDB.startTableSession(tableNum, 'Table Guest', 2);
      setSelectedTableNum(tableNum);
      onSelectTableSession(session);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#14532D', '#C2410C', '#C89B3C'],
        });
      } catch {}
    }, 600);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTableInput.trim()) return;
    const cleanNum = manualTableInput.trim().toLowerCase().startsWith('table')
      ? manualTableInput.trim()
      : `Table ${manualTableInput.trim()}`;
    handleSimulateScan(cleanNum);
    setManualTableInput('');
  };

  const handleCallService = (callType: TableServiceCall, label: string) => {
    restaurantDB.callTableService(selectedTableNum, callType);
    setActiveServiceCall(callType);
    setCallNotification(`Waiter notified: "${label}" for ${selectedTableNum}. Server en route!`);
    setTimeout(() => setCallNotification(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#E8E6DD] rounded-3xl overflow-hidden shadow-2xl my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAFAF7] border-b border-[#E8E6DD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md shadow-emerald-950/15">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-[#121110]">
                  Table QR Scanner & Direct Dining Session
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold">
                  LIVE POS
                </span>
              </div>
              <p className="text-xs text-[#595852]">
                Scan your brass tabletop QR code for contactless ordering, waiter call, and digital bill review.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8C8A82] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* If a table session is already active */}
          {activeTableSession && (
            <div className="p-5 rounded-2xl bg-[#DCFCE7]/40 border border-[#DCFCE7] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-mono font-bold text-xs">
                    {activeTableSession.tableNumber.replace(/[^0-9]/g, '') || '●'}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-[#121110]">
                      Active Session: {activeTableSession.tableNumber}
                    </h4>
                    <span className="text-xs text-[#14532D] font-medium">
                      {activeTableSession.areaName} · Seated at {activeTableSession.openedAt || '19:30'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOrderForTable(activeTableSession.tableNumber);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Order for This Table</span>
                  </button>
                </div>
              </div>

              {/* Quick Waiter Call Buttons */}
              <div className="pt-2 border-t border-emerald-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#14532D] mb-2">
                  Contactless Table-Side Buzzer
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCallService('water', 'Chilled Water & Goblets')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-semibold text-[#121110] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Droplets className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Bring Water</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCallService('waiter', 'Server Assistance Requested')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-semibold text-[#121110] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>Call Waiter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCallService('bill', 'Final Bill & POS Terminal')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-semibold text-[#121110] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-[#14532D] shrink-0" />
                    <span>Request Bill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCallService('clearing', 'Clear Used Plates')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-semibold text-[#121110] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Clear Plates</span>
                  </button>
                </div>
              </div>

              {callNotification && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <Volume2 className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>{callNotification}</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive QR Camera Viewfinder Simulator */}
          <div className="relative rounded-3xl bg-[#121110] text-white p-6 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Viewfinder corner brackets */}
            <div className="relative w-44 h-44 rounded-2xl border-2 border-white/20 flex items-center justify-center overflow-hidden">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C2410C]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C2410C]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C2410C]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C2410C]" />

              {/* Scanning laser line animation */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C2410C] to-transparent shadow-[0_0_12px_#C2410C] animate-pulse -translate-y-8" />

              <div className="text-center space-y-1 z-10 px-2">
                <Camera className="w-8 h-8 text-white/70 mx-auto animate-bounce" />
                <span className="text-[11px] font-mono text-white/80 block">
                  {scanning ? 'Decoding Table QR...' : 'Point camera at table QR'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8C8A82] text-center mt-4">
              Tap any table below to test QR code scanning instantly on your device:
            </p>
          </div>

          {/* Live Table Selection Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121110]">
                Select Table QR to Emulate (12 Pavilion Tables)
              </span>
              <span className="text-[11px] font-mono text-[#8C8A82]">
                Lagos Victoria Island Branch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {tables.map((tbl) => {
                const isSelected = selectedTableNum.toLowerCase() === tbl.tableNumber.toLowerCase();
                return (
                  <button
                    key={tbl.tableNumber}
                    type="button"
                    onClick={() => handleSimulateScan(tbl.tableNumber)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#14532D] bg-[#DCFCE7]/50 shadow-xs'
                        : 'border-[#E8E6DD] bg-white hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-[#121110]">
                          {tbl.tableNumber}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tbl.status === 'occupied'
                              ? 'bg-[#14532D]'
                              : tbl.status === 'service_needed'
                              ? 'bg-[#C2410C] animate-ping'
                              : tbl.status === 'billing'
                              ? 'bg-[#C89B3C]'
                              : 'bg-[#8C8A82]'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-[#595852] truncate">{tbl.areaName}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#E8E6DD] text-[10px] flex items-center justify-between">
                      <span className="capitalize font-mono text-[#8C8A82]">{tbl.status}</span>
                      <span className="font-bold text-[#14532D]">Scan →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Input Alternative */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[#E8E6DD] flex items-center gap-2">
            <input
              type="text"
              placeholder="Or enter table number manually (e.g. 4 or Veranda 2)"
              value={manualTableInput}
              onChange={(e) => setManualTableInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Start Session
            </button>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAFAF7] border-t border-[#E8E6DD] flex items-center justify-between text-xs text-[#8C8A82]">
          <span>Brass Tabletop QR compatible with all modern smartphones</span>
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
