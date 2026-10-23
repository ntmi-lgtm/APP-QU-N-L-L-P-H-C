import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student } from '../../types';
import { StarModal } from '../common/StarModal';
import { EditButton } from '../common/EditButton';
import { GlobalSaveButton } from '../common/GlobalSaveButton';

export const StarManagementView: React.FC = () => {
  const {
    students,
    transactions,
    addStars,
    subtractStars,
    undoLastTransaction,
    canUndo,
    lastUndoActionDescription,
    settings,
  } = useClass();

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fast star buttons state
  const [quickAmount, setQuickAmount] = useState<number>(1);
  const [quickReason, setQuickReason] = useState<string>('Phát biểu tốt');
  const [customReason, setCustomReason] = useState<string>('');

  // Modal target
  const [modalTarget, setModalTarget] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'subtract'>('add');

  const availableTeams = React.useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
    if (list.length > 0) {
      return list.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
    }
    return Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);
  }, [students, settings.numberOfTeams]);

  const teamCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      counts[s.team] = (counts[s.team] || 0) + 1;
    });
    return counts;
  }, [students]);

  const filteredStudents = students.filter((s) => {
    const matchesTeam = selectedTeamFilter === 'all' || s.team === selectedTeamFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const handleSelectTeamAll = (teamName: string) => {
    const teamStudents = students.filter((s) => s.team === teamName).map((s) => s.id);
    setSelectedStudentIds(teamStudents);
  };

  const handleSelectAllClass = () => {
    setSelectedStudentIds(students.map((s) => s.id));
  };

  const handleClearSelection = () => {
    setSelectedStudentIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyQuickAdd = () => {
    if (selectedStudentIds.length === 0) return;
    const finalReason = customReason.trim() || quickReason;
    addStars(selectedStudentIds, quickAmount, finalReason);
    setSelectedStudentIds([]);
  };

  const handleApplyQuickSubtract = () => {
    if (selectedStudentIds.length === 0) return;
    const finalReason = customReason.trim() || quickReason;
    subtractStars(selectedStudentIds, quickAmount, finalReason);
    setSelectedStudentIds([]);
  };

  const commonReasons = [
    'Phát biểu tốt',
    'Giúp đỡ bạn',
    'Hoàn thành nhiệm vụ',
    'Có tiến bộ rõ rệt',
    'Chăm chú nghe giảng',
    'Chữ viết sạch đẹp',
    'Trực nhật gương mẫu',
    'Chưa tập trung làm bài',
    'Chưa hoàn thành nhiệm vụ',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-400" size={24} />
            Khen Thưởng & Nhắc Nhở: Cộng – Trừ Sao
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cộng sao cá nhân hoặc theo tổ, ghi nhận thành tích, lưu lịch sử và hoàn tác tức thì
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canUndo && (
            <button
              onClick={undoLastTransaction}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw size={14} /> Hoàn tác: {lastUndoActionDescription}
            </button>
          )}

          <GlobalSaveButton
            variant="inline"
            label="💾 Lưu kết quả sao"
            customActionNote="Lưu danh sách sao khen thưởng"
          />
        </div>
      </div>

      {/* Fast Batch Action Box */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-orange-400 rounded-3xl p-5 text-slate-900 shadow-md shadow-amber-200/50">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800/80 flex items-center gap-1.5">
              <Sparkles size={16} /> Bảng Điều Khiển Nhanh Toàn Lớp
            </span>
            <p className="text-sm font-extrabold text-slate-950 mt-1">
              {selectedStudentIds.length === 0
                ? 'Hãy chọn 1 hoặc nhiều học sinh bên dưới để tặng sao'
                : `Đang chọn ${selectedStudentIds.length} học sinh để khen thưởng!`}
            </p>
          </div>

          {/* Quick Select Shortcut Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleSelectAllClass}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-xs font-black transition cursor-pointer shadow-xs"
            >
              Chọn cả lớp ({students.length})
            </button>
            {availableTeams.map((t) => (
              <button
                key={t}
                onClick={() => handleSelectTeamAll(t)}
                className="px-2.5 py-1.5 bg-white/80 hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Chọn {t} ({teamCounts[t] || 0})
              </button>
            ))}
            {selectedStudentIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-2.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}
          </div>
        </div>

        {/* Amount & Reason Selector */}
        <div className="mt-4 pt-4 border-t border-amber-600/20 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Amount buttons */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              1. Chọn số sao
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuickAmount(num)}
                  className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                    quickAmount === num
                      ? 'bg-slate-900 text-white shadow-sm scale-105'
                      : 'bg-white/80 hover:bg-white text-slate-800'
                  }`}
                >
                  {num} ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Reason picker */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                2. Chọn lý do hoặc nhập lý do mới
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {commonReasons.slice(0, 5).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setQuickReason(r);
                      setCustomReason('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      quickReason === r && !customReason
                        ? 'bg-slate-900 text-white'
                        : 'bg-white/80 hover:bg-white text-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Hoặc nhập lý do khác..."
                className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Execute Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={handleApplyQuickSubtract}
            disabled={selectedStudentIds.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
          >
            <Minus size={14} /> – Trừ {quickAmount} sao
          </button>
          <button
            onClick={handleApplyQuickAdd}
            disabled={selectedStudentIds.length === 0}
            className="flex items-center gap-1.5 px-6 py-2 bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus size={14} /> + Thưởng {quickAmount} sao ({selectedStudentIds.length} bạn)
          </button>
        </div>
      </div>

      {/* Filter and Student Grid */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none"
              />
            </div>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border rounded-xl font-bold cursor-pointer"
            >
              <option value="all">Tất cả các tổ ({students.length} em)</option>
              {availableTeams.map((t) => (
                <option key={t} value={t}>
                  {t} ({teamCounts[t] || 0} em)
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 font-bold">
            Hiển thị {filteredStudents.length} học sinh
          </span>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredStudents.map((std) => {
            const isSelected = selectedStudentIds.includes(std.id);
            return (
              <div
                key={std.id}
                onClick={() => toggleSelect(std.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-center relative ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Selection Checkmark */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'bg-amber-500 border-amber-600 text-white font-bold'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </div>

                <div>
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-12 h-12 rounded-xl mx-auto object-cover border p-0.5 bg-slate-50 mb-1.5"
                  />
                  <h4 className="font-black text-xs text-slate-800 line-clamp-1">
                    {std.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {std.team}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-black text-amber-500">
                    ⭐ {std.stars}
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        setModalTarget(std);
                        setModalMode('add');
                      }}
                      className="flex-1 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-xs font-black transition cursor-pointer"
                      title="+ Sao"
                    >
                      +⭐
                    </button>
                    <button
                      onClick={() => {
                        setModalTarget(std);
                        setModalMode('subtract');
                      }}
                      className="flex-1 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      title="- Sao"
                    >
                      -⭐
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Table with Edit ✏️ */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-slate-500" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Nhật Ký Giao Dịch Sao Gần Nhất ({transactions.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Có thể hoàn tác hành động nhập sai bằng nút ✏️ hoặc nút Hoàn tác
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="p-3">Thời gian</th>
                <th className="p-3">Học sinh</th>
                <th className="p-3">Số sao</th>
                <th className="p-3">Lý do</th>
                <th className="p-3">Giáo viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 15).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-400 font-mono">
                    {new Date(tx.date).toLocaleDateString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </td>
                  <td className="p-3 font-bold text-slate-800">{tx.studentName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-black text-xs ${
                        tx.type === 'add'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.type === 'add' ? `+${tx.amount} ⭐` : `-${tx.amount} ⭐`}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{tx.reason}</td>
                  <td className="p-3 text-slate-500">{tx.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Star Modal */}
      {modalTarget && (
        <StarModal
          isOpen={true}
          student={modalTarget}
          mode={modalMode}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  );
};
