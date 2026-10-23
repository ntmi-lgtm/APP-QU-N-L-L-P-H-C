import React, { useState } from 'react';
import {
  Save,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  ChevronUp,
  RotateCw,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';

interface GlobalSaveButtonProps {
  variant?: 'header' | 'floating' | 'inline' | 'card';
  label?: string;
  className?: string;
  customActionNote?: string;
}

export const GlobalSaveButton: React.FC<GlobalSaveButtonProps> = ({
  variant = 'header',
  label,
  className = '',
  customActionNote,
}) => {
  const {
    saveAllNow,
    isSaving,
    lastSavedTime,
    lastActionDescription,
    backupDataJson,
    settings,
  } = useClass();

  const [justSaved, setJustSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSaveClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveAllNow(customActionNote || 'Lưu mọi thao tác vừa thực hiện');
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
    }, 2000);
  };

  const handleDownloadBackup = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const jsonStr = backupDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sao_Luu_Lop_Hoc_${settings.className}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Header Variant (Sleek, reassuring, in app bar)
  if (variant === 'header') {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => handleSaveClick()}
          disabled={isSaving}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer shadow-xs border ${
            justSaved
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-200 scale-102'
              : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
          } ${className}`}
          title={`Lưu mọi thao tác vừa thực hiện (Đã lưu lúc ${lastSavedTime})`}
        >
          {isSaving ? (
            <RotateCw size={15} className="animate-spin text-white" />
          ) : justSaved ? (
            <Check size={15} className="stroke-[3] text-white" />
          ) : (
            <Save size={15} className="text-white group-hover:scale-110 transition-transform" />
          )}

          <span className="hidden sm:inline">
            {isSaving ? 'Đang lưu...' : justSaved ? 'Đã lưu!' : label || 'Lưu thao tác'}
          </span>

          <span
            className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"
            title={`Đã tự động lưu lúc ${lastSavedTime}`}
          />
        </button>
      </div>
    );
  }

  // Inline Variant (for inside forms, views, bottom of tables)
  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => handleSaveClick()}
        disabled={isSaving}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
          justSaved
            ? 'bg-emerald-600 text-white shadow-emerald-200'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-lg'
        } ${className}`}
        title={`Lưu mọi thao tác vừa thực hiện (Đã lưu lúc ${lastSavedTime})`}
      >
        {isSaving ? (
          <RotateCw size={16} className="animate-spin" />
        ) : justSaved ? (
          <CheckCircle2 size={16} className="stroke-[2.5]" />
        ) : (
          <Save size={16} />
        )}
        <span>
          {isSaving
            ? 'Đang lưu dữ liệu...'
            : justSaved
            ? '✓ Đã lưu thành công!'
            : label || 'Lưu thao tác vừa thực hiện'}
        </span>
      </button>
    );
  }

  // Card Variant (for QuickActionsBar)
  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={() => handleSaveClick()}
        disabled={isSaving}
        className={`flex flex-col items-center justify-center p-3 rounded-2xl shadow-sm transition-all duration-150 transform active:scale-95 cursor-pointer text-center group bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-200 ${className}`}
      >
        <div className="p-2 bg-white/20 rounded-xl mb-1.5 group-hover:scale-110 transition-transform relative">
          {isSaving ? (
            <RotateCw size={20} className="animate-spin stroke-[2.5]" />
          ) : justSaved ? (
            <Check size={20} className="stroke-[3] text-emerald-200" />
          ) : (
            <Save size={20} className="stroke-[2.5]" />
          )}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-700 animate-pulse" />
        </div>
        <span className="text-xs font-black tracking-tight leading-tight line-clamp-1">
          {justSaved ? '✓ Đã lưu xong!' : label || '💾 Lưu thao tác'}
        </span>
        <span className="text-[10px] text-white/90 font-medium mt-0.5">
          {lastSavedTime ? `Lúc ${lastSavedTime}` : 'Lưu tức thì'}
        </span>
      </button>
    );
  }

  // Floating Variant (Floating Dock accessible anywhere on screen)
  return (
    <aside
      aria-label="Thao tác lưu dữ liệu"
      className="fixed bottom-16 md:bottom-5 right-3 sm:right-5 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Expanded Quick Info Card */}
      {isMenuOpen && (
        <div className="mb-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-emerald-500/30 p-4 text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
              <Sparkles size={14} className="text-emerald-600" />
              <span>TRẠNG THÁI LƯU DỮ LIỆU</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Tự động lưu
            </span>
          </div>

          <div className="py-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Clock size={12} /> Lưu lần cuối:
              </span>
              <strong className="text-slate-800 font-bold">{lastSavedTime}</strong>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Thao tác vừa thực hiện:
              </span>
              <p className="text-xs font-extrabold text-slate-800 line-clamp-2 mt-0.5">
                {lastActionDescription || 'Chưa có thao tác mới'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                handleSaveClick(e);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer"
            >
              <Save size={14} />
              {isSaving ? 'Đang lưu...' : 'Lưu lại tất cả ngay'}
            </button>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition cursor-pointer"
            >
              <Download size={13} /> Tải file sao lưu (.json)
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white p-1 rounded-full shadow-2xl border border-emerald-400/60 transition-transform active:scale-95 group">
        <button
          type="button"
          onClick={(e) => handleSaveClick(e)}
          disabled={isSaving}
          className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
            justSaved
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title="Nhấp để lưu mọi thao tác vừa làm"
        >
          {isSaving ? (
            <RotateCw size={14} className="animate-spin text-white" />
          ) : justSaved ? (
            <Check size={14} className="stroke-[3] text-white" />
          ) : (
            <Save size={14} className="text-white" />
          )}
          <span>{justSaved ? 'Đã lưu!' : 'Lưu thao tác'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          title="Chi tiết trạng thái lưu"
        >
          <ChevronUp
            size={16}
            className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
};
