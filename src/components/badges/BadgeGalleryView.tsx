import React, { useState } from 'react';
import { Trophy, Award, Plus, Pencil, Trash2, Check, Sparkles, UserCheck } from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Badge, Student } from '../../types';
import { EditButton } from '../common/EditButton';

export const BadgeGalleryView: React.FC = () => {
  const { badges, students, awardBadge, removeBadge, addBadge, updateBadge, deleteBadge } = useClass();

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isEditingBadge, setIsEditingBadge] = useState<Badge | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');

  // Selected student to award
  const [studentIdToAward, setStudentIdToAward] = useState<string>(students[0]?.id || '');
  const [awardSuccessMsg, setAwardSuccessMsg] = useState('');

  const handleOpenEdit = (badge: Badge) => {
    setIsEditingBadge(badge);
    setName(badge.name);
    setIcon(badge.icon);
    setDescription(badge.description);
    setCondition(badge.condition);
    setIsAddingNew(false);
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setIsEditingBadge(null);
    setName('');
    setIcon('🌟');
    setDescription('');
    setCondition('');
  };

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditingBadge) {
      updateBadge(isEditingBadge.id, {
        name: name.trim(),
        icon,
        description: description.trim(),
        condition: condition.trim(),
      });
      setIsEditingBadge(null);
    } else {
      addBadge({
        name: name.trim(),
        icon,
        description: description.trim(),
        condition: condition.trim(),
      });
      setIsAddingNew(false);
    }
  };

  const handleAward = (badgeId: string) => {
    if (!studentIdToAward) return;
    awardBadge(studentIdToAward, badgeId);
    const std = students.find((s) => s.id === studentIdToAward);
    const b = badges.find((x) => x.id === badgeId);
    setAwardSuccessMsg(`Đã trao huy hiệu "${b?.name}" cho bé ${std?.name}!`);
    setTimeout(() => setAwardSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="text-purple-600" size={24} />
            Thư Viện Huy Hiệu & Vinh Danh
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo huy hiệu mới, chỉnh sửa tiêu chí và trao tặng học sinh có thành tích xuất sắc
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition cursor-pointer"
        >
          <Plus size={15} /> Thêm huy hiệu mới ✏️
        </button>
      </div>

      {/* Award Selector Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-5 text-white shadow-md shadow-purple-200/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white/80 block uppercase tracking-wider">
            Trao huy hiệu cho học sinh
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            <select
              value={studentIdToAward}
              onChange={(e) => setStudentIdToAward(e.target.value)}
              className="bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-black focus:outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.team} • {s.badges.length} huy hiệu)
                </option>
              ))}
            </select>
            <span className="text-xs text-purple-100">
              Nhấn nút <strong>"Trao huy hiệu"</strong> ở thẻ bên dưới để vinh danh em!
            </span>
          </div>
        </div>

        {awardSuccessMsg && (
          <div className="p-3 bg-white/90 text-purple-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <Sparkles className="text-purple-600" size={18} />
            {awardSuccessMsg}
          </div>
        )}
      </div>

      {/* Add / Edit Badge Form */}
      {(isAddingNew || isEditingBadge) && (
        <form onSubmit={handleSaveBadge} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            ✏️ {isEditingBadge ? 'Chỉnh sửa huy hiệu' : 'Tạo huy hiệu mới'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên huy hiệu</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Ngôi sao sáng tạo"
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biểu tượng (Emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điều kiện nhận</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Ví dụ: Đạt 20 sao thi đua"
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ý nghĩa</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ý nghĩa của huy hiệu..."
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setIsEditingBadge(null);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Lưu huy hiệu
            </button>
          </div>
        </form>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const awardedCount = students.filter((s) => s.badges.includes(badge.id)).length;
          return (
            <div
              key={badge.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-purple-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-purple-50 rounded-2xl">{badge.icon}</span>
                  <div className="flex items-center gap-1">
                    <EditButton onClick={() => handleOpenEdit(badge)} title="Sửa huy hiệu ✏️" />
                    <button
                      onClick={() => deleteBadge(badge.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      title="Xóa huy hiệu"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="font-black text-sm text-slate-800 mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">{badge.description}</p>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold block mb-3">
                  Điều kiện: {badge.condition}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold">
                  {awardedCount} em đã nhận
                </span>
                <button
                  onClick={() => handleAward(badge.id)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  🏆 Trao huy hiệu
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
