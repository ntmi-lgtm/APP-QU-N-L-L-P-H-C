import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Save,
  Sparkles,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { ClassCriterion } from '../../types';
import { EditButton } from '../common/EditButton';
import { GlobalSaveButton } from '../common/GlobalSaveButton';

export const ScoringView: React.FC = () => {
  const { criteria, students, scores, setStudentScore, updateCriterion, addCriterion, deleteCriterion } = useClass();

  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string>(criteria[0]?.id || '');
  const [isEditingCriteria, setIsEditingCriteria] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritMax, setNewCritMax] = useState(10);
  const [newCritIcon, setNewCritIcon] = useState('⭐');

  // Currently selected criterion
  const currentCriterion = criteria.find((c) => c.id === selectedCriteriaId) || criteria[0];

  const handleScoreChange = (studentId: string, scoreVal: number) => {
    if (!currentCriterion) return;
    const bounded = Math.max(0, Math.min(currentCriterion.maxScore, scoreVal));
    setStudentScore(studentId, currentCriterion.id, bounded);
  };

  const handleAddCriterionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;
    addCriterion({
      name: newCritName.trim(),
      maxScore: Number(newCritMax) || 10,
      icon: newCritIcon,
    });
    setNewCritName('');
    setIsEditingCriteria(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Award className="text-indigo-600" size={24} />
            Bảng Chấm Điểm Tiêu Chí Rèn Luyện
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đánh giá theo 5 tiêu chí: Chăm học, Kỷ luật, Hợp tác, Vệ sinh, Trách nhiệm. Có thể tùy chỉnh bằng ✏️
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlobalSaveButton
            variant="inline"
            label="💾 Lưu bảng điểm"
            customActionNote={`Lưu điểm tiêu chí ${currentCriterion?.name || ''}`}
          />
          <button
            onClick={() => setIsEditingCriteria(!isEditingCriteria)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <Plus size={15} /> Thêm / Sửa tiêu chí
          </button>
        </div>
      </div>

      {/* Criteria Tabs Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {criteria.map((crit) => {
            const isSelected = crit.id === currentCriterion?.id;
            return (
              <button
                key={crit.id}
                onClick={() => setSelectedCriteriaId(crit.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-200 scale-102'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{crit.icon}</span>
                <span>{crit.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  Max {crit.maxScore}đ
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Criteria Form Modal */}
      {isEditingCriteria && (
        <div className="bg-slate-50 border-2 border-indigo-200 rounded-3xl p-5 animate-in fade-in">
          <h3 className="text-sm font-extrabold text-indigo-900 mb-3 flex items-center gap-2">
            ✏️ Quản lý danh mục tiêu chí đánh giá
          </h3>
          <form onSubmit={handleAddCriterionSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên tiêu chí</label>
              <input
                type="text"
                required
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                placeholder="Ví dụ: Tự giác học tập"
                className="w-full px-3 py-2 text-xs bg-white border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm tối đa</label>
              <input
                type="number"
                min={1}
                max={100}
                value={newCritMax}
                onChange={(e) => setNewCritMax(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biểu tượng</label>
              <input
                type="text"
                value={newCritIcon}
                onChange={(e) => setNewCritIcon(e.target.value)}
                placeholder="⭐, 📚, 🤝..."
                className="w-full px-3 py-2 text-xs bg-white border rounded-xl"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Thêm mới
              </button>
              <button
                type="button"
                onClick={() => setIsEditingCriteria(false)}
                className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scoring Grid for Selected Criterion */}
      {currentCriterion && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentCriterion.icon}</span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">
                  Đang chấm tiêu chí: {currentCriterion.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Thang điểm tối đa: {currentCriterion.maxScore} điểm
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                // Set all students to max score for fast bulk grading
                students.forEach((s) => {
                  setStudentScore(s.id, currentCriterion.id, currentCriterion.maxScore);
                });
              }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ✓ Cho cả lớp {currentCriterion.maxScore}đ (Tất cả đạt)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {students.map((std) => {
              const currentScore = scores[std.id]?.[currentCriterion.id] ?? currentCriterion.maxScore;

              return (
                <div
                  key={std.id}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-2 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-9 h-9 rounded-xl object-cover bg-white border p-0.5"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">
                        {std.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {std.team}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={currentCriterion.maxScore}
                      value={currentScore}
                      onChange={(e) => handleScoreChange(std.id, Number(e.target.value))}
                      className="w-14 text-center py-1 bg-white border border-slate-300 rounded-xl text-xs font-black text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-[10px] text-slate-400">/{currentCriterion.maxScore}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Save Action Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
            <div className="text-xs text-slate-500">
              💡 <strong>Mẹo:</strong> Điểm số được tự động ghi nhận khi bạn nhập. Nhấp <strong>Lưu bảng điểm</strong> để lưu kiên cố vào máy.
            </div>
            <GlobalSaveButton
              variant="inline"
              label="💾 Lưu bảng điểm vừa chấm"
              customActionNote={`Lưu điểm tiêu chí ${currentCriterion.name}`}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
