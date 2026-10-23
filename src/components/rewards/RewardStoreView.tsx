import React, { useState } from 'react';
import { Gift, Star, Plus, Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Reward, Student } from '../../types';
import { EditButton } from '../common/EditButton';

export const RewardStoreView: React.FC = () => {
  const { rewards, students, redeemReward, addReward, updateReward, deleteReward } = useClass();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [isEditingReward, setIsEditingReward] = useState<Reward | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [requiredStars, setRequiredStars] = useState(10);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(20);

  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleOpenEdit = (rew: Reward) => {
    setIsEditingReward(rew);
    setName(rew.name);
    setIcon(rew.icon);
    setRequiredStars(rew.requiredStars);
    setDescription(rew.description);
    setStock(rew.stock || 20);
    setIsAddingNew(false);
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setIsEditingReward(null);
    setName('');
    setIcon('🎁');
    setRequiredStars(15);
    setDescription('');
    setStock(20);
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditingReward) {
      updateReward(isEditingReward.id, {
        name: name.trim(),
        icon,
        requiredStars: Number(requiredStars),
        description: description.trim(),
        stock: Number(stock),
      });
      setIsEditingReward(null);
    } else {
      addReward({
        name: name.trim(),
        icon,
        requiredStars: Number(requiredStars),
        description: description.trim(),
        stock: Number(stock),
      });
      setIsAddingNew(false);
    }
  };

  const handleRedeem = (rewardId: string) => {
    if (!selectedStudent) return;
    const ok = redeemReward(selectedStudent.id, rewardId);
    if (ok) {
      const rew = rewards.find((r) => r.id === rewardId);
      setRedeemSuccessMsg(`Chúc mừng bé ${selectedStudent.name} đã đổi thành công "${rew?.name}"!`);
      setTimeout(() => setRedeemSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Gift className="text-teal-600" size={24} />
            Cửa Hàng Quà Tặng Đổi Sao
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đổi số sao tích lũy lấy các phần thưởng khích lệ tinh thần và quà tặng ý nghĩa
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-200 transition cursor-pointer"
        >
          <Plus size={15} /> Thêm quà mới ✏️
        </button>
      </div>

      {/* Select Student to Redeem */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-5 text-white shadow-md shadow-teal-200/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white/80 block uppercase tracking-wider">
            Chọn học sinh đổi quà
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            {selectedStudent && (
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-12 h-12 rounded-2xl bg-white/20 p-1 object-cover border border-white/40"
              />
            )}
            <div>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-white text-slate-800 px-3 py-1.5 rounded-xl text-sm font-black focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.team} • ⭐ {s.stars} sao)
                  </option>
                ))}
              </select>
              {selectedStudent && (
                <span className="block text-xs font-bold text-teal-100 mt-1">
                  Đang có sẵn: <strong className="text-yellow-300">⭐ {selectedStudent.stars} sao</strong> để đổi quà
                </span>
              )}
            </div>
          </div>
        </div>

        {redeemSuccessMsg && (
          <div className="p-3 bg-white/90 text-teal-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="text-teal-600" size={18} />
            {redeemSuccessMsg}
          </div>
        )}
      </div>

      {/* Add / Edit Reward Form */}
      {(isAddingNew || isEditingReward) && (
        <form onSubmit={handleSaveReward} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            ✏️ {isEditingReward ? 'Chỉnh sửa phần thưởng' : 'Tạo phần thưởng mới'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên phần thưởng</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Lời khen đặc biệt & Sticker"
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số sao yêu cầu</label>
              <input
                type="number"
                min={1}
                required
                value={requiredStars}
                onChange={(e) => setRequiredStars(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biểu tượng</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả quà tặng</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ý nghĩa phần thưởng..."
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng còn</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setIsEditingReward(null);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
            >
              Lưu phần thưởng
            </button>
          </div>
        </form>
      )}

      {/* Rewards Catalog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {rewards.map((rew) => {
          const canAfford = selectedStudent && selectedStudent.stars >= rew.requiredStars;
          return (
            <div
              key={rew.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-teal-50 rounded-2xl">{rew.icon}</span>
                  <div className="flex items-center gap-1">
                    <EditButton onClick={() => handleOpenEdit(rew)} title="Sửa quà ✏️" />
                    <button
                      onClick={() => deleteReward(rew.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      title="Xóa quà"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="font-black text-sm text-slate-800 mb-1">{rew.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{rew.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-amber-500">⭐ {rew.requiredStars} sao</span>
                <button
                  onClick={() => handleRedeem(rew.id)}
                  disabled={!canAfford}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    canAfford
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? '🎁 Đổi ngay' : 'Chưa đủ sao'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
