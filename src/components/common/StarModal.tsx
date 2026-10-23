import React, { useState } from 'react';
import { Star, X, Sparkles, AlertCircle } from 'lucide-react';
import { Student } from '../../types';
import { useClass } from '../../context/ClassContext';

interface StarModalProps {
  isOpen: boolean;
  student: Student | null; // null for batch mode or all selected
  selectedStudents?: Student[];
  mode?: 'add' | 'subtract';
  onClose: () => void;
}

const COMMON_ADD_REASONS = [
  'Phát biểu tốt',
  'Giúp đỡ bạn',
  'Hoàn thành nhiệm vụ',
  'Có tiến bộ rõ rệt',
  'Chăm chú lắng nghe',
  'Chữ viết sạch đẹp',
  'Trực nhật sạch sẽ',
  'Làm việc nhóm tốt',
];

const COMMON_SUB_REASONS = [
  'Chưa hoàn thành nhiệm vụ',
  'Nói chuyện riêng trong giờ',
  'Quên đồ dùng học tập',
  'Chưa giữ trật tự',
  'Đi lại trong lớp',
];

export const StarModal: React.FC<StarModalProps> = ({
  isOpen,
  student,
  selectedStudents = [],
  mode: initialMode = 'add',
  onClose,
}) => {
  const { addStars, subtractStars } = useClass();
  const [mode, setMode] = useState<'add' | 'subtract'>(initialMode);
  const [amount, setAmount] = useState<number>(initialMode === 'add' ? 1 : 1);
  const [reason, setReason] = useState<string>('Phát biểu tốt');
  const [customReason, setCustomReason] = useState<string>('');

  if (!isOpen) return null;

  const targetStudents = student ? [student] : selectedStudents;
  if (targetStudents.length === 0) return null;

  const addAmounts = [1, 2, 3, 5, 10];
  const subAmounts = [1, 2, 3, 5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() ? customReason.trim() : reason;
    const studentIds = targetStudents.map((s) => s.id);

    if (mode === 'add') {
      addStars(studentIds, amount, finalReason);
    } else {
      subtractStars(studentIds, amount, finalReason);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 transition-colors ${
            mode === 'add' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Star className="fill-white" size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {mode === 'add' ? '⭐ Tặng Sao Khen Thưởng' : '⭐ Nhắc Nhở – Trừ Sao'}
              </h3>
              <p className="text-xs text-white/90">
                {targetStudents.length === 1
                  ? `${targetStudents[0].name} • Hiện có ${targetStudents[0].stars} sao`
                  : `Đang chọn ${targetStudents.length} học sinh`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('add');
                setAmount(1);
                setReason('Phát biểu tốt');
              }}
              className={`py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
                mode === 'add'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              + Cộng Sao Khen
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('subtract');
                setAmount(1);
                setReason('Chưa hoàn thành nhiệm vụ');
              }}
              className={`py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
                mode === 'subtract'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              – Nhắc Nhở Trừ Sao
            </button>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Số lượng sao
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(mode === 'add' ? addAmounts : subAmounts).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAmount(num)}
                  className={`py-2.5 rounded-xl font-black text-base transition cursor-pointer border ${
                    amount === num
                      ? mode === 'add'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200 scale-105'
                        : 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'add' ? `+${num}` : `-${num}`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reasons */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Lý do nhanh (chọn 1 chạm)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {(mode === 'add' ? COMMON_ADD_REASONS : COMMON_SUB_REASONS).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setReason(item);
                    setCustomReason('');
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                    reason === item && !customReason
                      ? mode === 'add'
                        ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold'
                        : 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Hoặc nhập lý do khác
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Nhập lý do cụ thể..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-extrabold text-sm shadow-md transition cursor-pointer ${
                mode === 'add'
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
              }`}
            >
              {mode === 'add' ? (
                <>
                  <Sparkles size={16} />
                  Xác nhận +{amount} sao
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Xác nhận -{amount} sao
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
