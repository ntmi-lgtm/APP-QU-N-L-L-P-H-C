import React from 'react';
import { CheckCircle2, Download, X, Sparkles, Clock } from 'lucide-react';
import { useClass } from '../../context/ClassContext';

export const SaveToast: React.FC = () => {
  const { saveToast, dismissSaveToast, backupDataJson, settings } = useClass();

  if (!saveToast) return null;

  const handleDownloadBackup = () => {
    try {
      const jsonStr = backupDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sao_Luu_Lop_Hoc_${settings.className}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
    >
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-emerald-400/80 backdrop-blur-md flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/30">
          <CheckCircle2 size={22} className="stroke-[2.5]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-black text-sm text-emerald-300 tracking-tight flex items-center gap-1">
              <Sparkles size={14} className="text-emerald-400" />
              {saveToast.message}
            </h4>
          </div>

          {saveToast.subtext && (
            <p className="text-xs text-slate-300 mt-1 leading-snug break-words">
              {saveToast.subtext}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-800 text-[11px]">
            <span className="text-emerald-400/90 font-bold flex items-center gap-1">
              ● Dữ liệu an toàn trên thiết bị
            </span>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="text-indigo-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer hover:underline"
              title="Tải file JSON sao lưu dự phòng"
            >
              <Download size={12} /> Tải file dự phòng
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissSaveToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0 cursor-pointer"
          title="Đóng thông báo"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
