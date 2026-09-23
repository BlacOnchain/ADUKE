import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Camera,
  X,
  Bell,
  Receipt,
  Droplets,
  Sparkles,
  Utensils,
  Volume2,
  Video,
  VideoOff
} from 'lucide-react';
import { TableSession, TableServiceCall } from '../types/restaurant';
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
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [manualTableInput, setManualTableInput] = useState('');
  const [selectedTableNum, setSelectedTableNum] = useState<string>(
    activeTableSession ? activeTableSession.tableNumber : 'Table 4'
  );
  const [activeServiceCall, setActiveServiceCall] = useState<TableServiceCall>(
    activeTableSession?.currentServiceCall || 'none'
  );
  const [callNotification, setCallNotification] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sync state if active session exists
  useEffect(() => {
    if (activeTableSession) {
      setSelectedTableNum(activeTableSession.tableNumber);
      setActiveServiceCall(activeTableSession.currentServiceCall);
    }
  }, [activeTableSession]);

  // Clean up camera stream when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error(err);
      setCameraError('Unable to access device camera. Please allow camera permissions or select table below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

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
                  Table QR Scanner & Device Camera Access
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold">
                  LIVE POS
                </span>
              </div>
              <p className="text-xs text-[#595852]">
                Scan your brass tabletop QR code with your device camera or select a table instantly.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
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
                      stopCamera();
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

          {/* Interactive QR Camera Viewfinder with Device Camera Access */}
          <div className="relative rounded-3xl bg-[#121110] text-white p-6 overflow-hidden flex flex-col items-center justify-center min-h-[240px]">
            {cameraActive ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-emerald-500/60 pointer-events-none rounded-2xl flex items-center justify-center">
                  <div className="w-40 h-40 border border-white/40 rounded-xl" />
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md cursor-pointer border border-white/20"
                >
                  <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Turn Off Camera</span>
                </button>
              </div>
            ) : (
              <div className="relative w-full h-56 rounded-2xl border-2 border-white/20 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1C1A18] to-[#121110] p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Camera className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Live Device Camera Scanner</h4>
                  <p className="text-xs text-[#8C8A82] max-w-xs mt-1">
                    Grant camera permission to scan physical brass tabletop QR codes directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-[#14532D] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Enable Device Camera</span>
                </button>
              </div>
            )}

            {cameraError && (
              <p className="text-xs text-rose-400 text-center mt-3 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                {cameraError}
              </p>
            )}

            <p className="text-xs text-[#8C8A82] text-center mt-4">
              Or tap any table below to test QR code session instantly:
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
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-white border border-[#E8E6DD] hover:bg-[#F4F3ED] text-[#121110] font-medium rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
