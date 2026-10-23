import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return (
      <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
        <ShieldCheck size={13} className="text-emerald-600" />
        Offline-Ready (Dữ liệu an toàn trên thiết bị)
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 text-white px-4 py-2 text-xs font-bold shadow-xl border border-amber-400 animate-pulse">
      <WifiOff size={16} />
      <span>Chế độ Offline — Dữ liệu đã lưu cục bộ an toàn.</span>
    </div>
  );
};
