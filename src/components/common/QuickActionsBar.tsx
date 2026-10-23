import React from 'react';
import {
  UserPlus,
  Star,
  CheckSquare,
  Award,
  Gamepad2,
  Trophy,
  Heart,
  Gift,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Sparkles,
  Save,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { useClass } from '../../context/ClassContext';

interface QuickActionsBarProps {
  onAddStudent: () => void;
  onOpenAddStar: () => void;
  onOpenSubtractStar: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenImport: () => void;
  onBackup: () => void;
  onRestore: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAddStudent,
  onOpenAddStar,
  onOpenSubtractStar,
  onNavigateTab,
  onOpenImport,
  onBackup,
  onRestore,
}) => {
  const { saveAllNow, lastSavedTime, isSaving } = useClass();

  const actions = [
    {
      id: 'save-now',
      label: isSaving ? 'Đang lưu...' : '💾 Lưu mọi thao tác',
      desc: lastSavedTime ? `Lúc ${lastSavedTime}` : 'Lưu ngay',
      icon: Save,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 font-black ring-2 ring-emerald-300',
      onClick: () => saveAllNow('Lưu thao tác từ Bàn làm việc nhanh'),
    },
    {
      id: 'add-student',
      label: '➕ Thêm học sinh',
      desc: 'Hồ sơ mới',
      icon: UserPlus,
      color: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200',
      onClick: onAddStudent,
    },
    {
      id: 'add-star',
      label: '⭐ Cộng sao',
      desc: 'Khen thưởng',
      icon: Star,
      color: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200',
      onClick: onOpenAddStar,
    },
    {
      id: 'sub-star',
      label: '⭐ Trừ sao',
      desc: 'Nhắc nhở nhẹ',
      icon: Star,
      color: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200',
      onClick: onOpenSubtractStar,
    },
    {
      id: 'attendance',
      label: '📋 Điểm danh',
      desc: 'Chuyên cần',
      icon: CheckSquare,
      color: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200',
      onClick: () => onNavigateTab('attendance'),
    },
    {
      id: 'scoring',
      label: '📝 Chấm điểm',
      desc: '5 Tiêu chí',
      icon: Award,
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
      onClick: () => onNavigateTab('scoring'),
    },
    {
      id: 'games',
      label: '🎮 Trò chơi',
      desc: '22 Vui học',
      icon: Gamepad2,
      color: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200',
      onClick: () => onNavigateTab('games'),
    },
    {
      id: 'ranking',
      label: '🏆 Xếp hạng',
      desc: 'TOP thi đua',
      icon: Trophy,
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200',
      onClick: () => onNavigateTab('reports'),
    },
    {
      id: 'love',
      label: '💗 Yêu thương',
      desc: 'Gửi lời khen',
      icon: Heart,
      color: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200',
      onClick: () => onNavigateTab('love'),
    },
    {
      id: 'rewards',
      label: '🎁 Đổi quà',
      desc: 'Cửa hàng sao',
      icon: Gift,
      color: 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-200',
      onClick: () => onNavigateTab('rewards'),
    },
    {
      id: 'import',
      label: '🗂️ Nhập danh sách',
      desc: 'Từ file CSV',
      icon: FileSpreadsheet,
      color: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
      onClick: onOpenImport,
    },
    {
      id: 'backup',
      label: '💾 Sao lưu',
      desc: 'Lưu file JSON',
      icon: Download,
      color: 'bg-slate-700 hover:bg-slate-800 text-white shadow-slate-200',
      onClick: onBackup,
    },
    {
      id: 'restore',
      label: '♻️ Khôi phục',
      desc: 'Tải file JSON',
      icon: RotateCcw,
      color: 'bg-slate-600 hover:bg-slate-700 text-white shadow-slate-200',
      onClick: onRestore,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              ⚡ THAO TÁC NHANH
            </h2>
            <span className="text-xs text-slate-500">
              Thực hiện mọi công việc thường xuyên ngay trên bàn làm việc của cô giáo
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl shadow-sm transition-all duration-150 transform active:scale-95 cursor-pointer text-center group ${act.color}`}
            >
              <div className="p-2 bg-white/20 rounded-xl mb-1.5 group-hover:scale-110 transition-transform">
                <Icon size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xs font-black tracking-tight leading-tight line-clamp-1">
                {act.label}
              </span>
              <span className="text-[10px] text-white/80 font-medium mt-0.5">
                {act.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
