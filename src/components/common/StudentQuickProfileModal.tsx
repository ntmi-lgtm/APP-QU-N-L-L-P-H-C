import React, { useState } from 'react';
import {
  X,
  Star,
  Trophy,
  Heart,
  Pencil,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { Student, AttendanceStatus } from '../../types';
import { useClass } from '../../context/ClassContext';
import { StarModal } from './StarModal';

interface StudentQuickProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEditStudent: (student: Student) => void;
  onSendLove: (student: Student) => void;
  onAwardBadge: (student: Student) => void;
}

export const StudentQuickProfileModal: React.FC<StudentQuickProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onEditStudent,
  onSendLove,
  onAwardBadge,
}) => {
  const { transactions, attendances, todayDate, badges, tasks } = useClass();
  const [starModalMode, setStarModalMode] = useState<'add' | 'subtract' | null>(null);

  if (!isOpen || !student) return null;

  // Student specific transactions
  const studentTxs = transactions.filter((t) => t.studentId === student.id).slice(0, 10);

  // Today attendance status
  const todayStatus: AttendanceStatus = attendances[todayDate]?.[student.id] || 'present';

  // Badges detail
  const studentBadges = badges.filter((b) => student.badges.includes(b.id));

  // Assigned tasks
  const studentTasks = tasks.filter(
    (t) => t.assignedTo === 'all' || t.assignedTo === student.id || t.assignedTo === student.team
  );

  const statusBadges: Record<AttendanceStatus, { label: string; color: string }> = {
    present: { label: '🟢 Có mặt hôm nay', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    late: { label: '🟡 Đi muộn', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    absent: { label: '🔴 Nghỉ không phép', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    excused: { label: '🔵 Nghỉ có phép', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
          {/* Top Banner & Avatar Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl bg-white shadow-lg p-1 object-cover border-2 border-white/80"
                />
                <span className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  ⭐ {student.stars}
                </span>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black">{student.name}</h2>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-bold">
                    {student.code || 'HS'}
                  </span>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    {student.team}
                  </span>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    {student.group}
                  </span>
                </div>
                <p className="text-xs text-white/90 mt-1">
                  Giới tính: {student.gender === 'female' ? 'Nữ 🌸' : 'Nam 🚀'} • Cấp độ: Level {student.level} ({student.xp} XP)
                </p>

                {/* Quick Action Buttons on Profile Header */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 pt-1">
                  <button
                    onClick={() => setStarModalMode('add')}
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Plus size={14} /> ⭐ Cộng sao
                  </button>
                  <button
                    onClick={() => setStarModalMode('subtract')}
                    className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Minus size={14} /> ⭐ Trừ sao
                  </button>
                  <button
                    onClick={() => onSendLove(student)}
                    className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Heart size={14} /> 💗 Gửi yêu thương
                  </button>
                  <button
                    onClick={() => onAwardBadge(student)}
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Trophy size={14} /> 🏆 Trao huy hiệu
                  </button>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Pencil size={14} /> ✏️ Sửa hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
            {/* Quick Status Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                <span className="text-xs text-amber-700 font-bold block">Tổng Sao</span>
                <span className="text-2xl font-black text-amber-600">⭐ {student.stars}</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                <span className="text-xs text-indigo-700 font-bold block">Điểm XP</span>
                <span className="text-2xl font-black text-indigo-600">⚡ {student.xp}</span>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl text-center">
                <span className="text-xs text-purple-700 font-bold block">Huy hiệu</span>
                <span className="text-2xl font-black text-purple-600">🏅 {student.badges.length}</span>
              </div>
              <div className={`p-3 border rounded-2xl text-center flex flex-col justify-center ${statusBadges[todayStatus].color}`}>
                <span className="text-xs font-bold">Chuyên cần</span>
                <span className="text-xs font-extrabold mt-1">{statusBadges[todayStatus].label}</span>
              </div>
            </div>

            {/* Teacher Notes & Recent Achievement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={15} className="text-indigo-600" /> Thành tích gần nhất
                  </h4>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {student.recentAchievement || 'Đang tích cực thi đua trong tuần'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Pencil size={15} className="text-amber-600" /> Nhận xét của cô giáo
                  </h4>
                </div>
                <p className="text-sm text-slate-700 italic">
                  "{student.notes || 'Học sinh ngoan, chăm chỉ và biết lắng nghe thầy cô.'}"
                </p>
              </div>
            </div>

            {/* Badges Collection */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Trophy size={15} className="text-purple-600" /> Huy hiệu đã đạt được ({studentBadges.length})
              </h4>
              {studentBadges.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
                  Bé chưa có huy hiệu nào. Hãy trao huy hiệu đầu tiên để động viên con nhé!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {studentBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900"
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <span className="text-xs font-bold block">{badge.name}</span>
                        <span className="text-[10px] text-purple-600 line-clamp-1">{badge.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Tasks */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" /> Nhiệm vụ liên quan ({studentTasks.length})
              </h4>
              <div className="space-y-1.5">
                {studentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs"
                  >
                    <span className="font-medium text-slate-700">{task.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        task.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status === 'completed' ? '✓ Đã hoàn thành' : '⏳ Đang làm'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Star History Transactions */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock size={15} className="text-slate-500" /> Lịch sử cộng / trừ sao gần nhất
              </h4>
              {studentTxs.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
                  Chưa có lịch sử sao cho học sinh này.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  {studentTxs.map((tx) => (
                    <div key={tx.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black px-2 py-0.5 rounded-md ${
                            tx.type === 'add'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type === 'add' ? `+${tx.amount} ⭐` : `-${tx.amount} ⭐`}
                        </span>
                        <span className="font-medium text-slate-700">{tx.reason}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500">
              Trường Tiểu học Trần Văn Ơn • GVCN: Cô Mị
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Quick Star Modal */}
      {starModalMode && (
        <StarModal
          isOpen={true}
          student={student}
          mode={starModalMode}
          onClose={() => setStarModalMode(null)}
        />
      )}
    </>
  );
};
