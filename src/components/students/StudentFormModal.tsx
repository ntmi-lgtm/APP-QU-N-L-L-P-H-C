import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload, RefreshCw, Check } from 'lucide-react';
import { Student, Gender } from '../../types';
import { useClass } from '../../context/ClassContext';
import { AVATAR_PRESETS, generateCuteAvatarSvg } from '../../data/avatars';

interface StudentFormModalProps {
  isOpen: boolean;
  student: Student | null; // null means adding a new student
  onClose: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  const { addStudent, updateStudent, settings, students } = useClass();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [dateOfBirth, setDateOfBirth] = useState('2017-05-15');
  const [team, setTeam] = useState('Tổ 1');
  const [group, setGroup] = useState('Nhóm 1');
  const [avatar, setAvatar] = useState('');
  const [notes, setNotes] = useState('');
  const [recentAchievement, setRecentAchievement] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (student) {
      setName(student.name);
      setCode(student.code || '');
      setGender(student.gender);
      setDateOfBirth(student.dateOfBirth);
      setTeam(student.team);
      setGroup(student.group);
      setAvatar(student.avatar);
      setNotes(student.notes || '');
      setRecentAchievement(student.recentAchievement || '');
    } else {
      setName('');
      setCode('');
      setGender('male');
      setDateOfBirth('2017-05-15');
      setTeam('Tổ 1');
      setGroup('Nhóm 1');
      setAvatar(generateCuteAvatarSvg('Học sinh mới', 'male'));
      setNotes('');
      setRecentAchievement('');
    }
  }, [student, isOpen]);

  const teams: string[] = React.useMemo(() => {
    const list: string[] = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
    if (student?.team && !list.includes(student.team)) {
      list.push(student.team);
    }
    if (list.length > 0) {
      return list.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
    }
    return Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);
  }, [students, settings.numberOfTeams, student]);

  if (!isOpen) return null;

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (!student || !avatar || avatar.startsWith('data:image/svg+xml')) {
      setAvatar(generateCuteAvatarSvg(name || 'Học sinh mới', newGender));
    }
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatar(generateCuteAvatarSvg(randomSeed, gender));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (student) {
      updateStudent(student.id, {
        name: name.trim(),
        code: code.trim() || student.code,
        gender,
        dateOfBirth,
        team,
        group,
        avatar,
        notes: notes.trim(),
        recentAchievement: recentAchievement.trim(),
      });
    } else {
      addStudent({
        name: name.trim(),
        code: code.trim(),
        gender,
        dateOfBirth,
        team,
        group,
        avatar: avatar || generateCuteAvatarSvg(name, gender),
        stars: 0,
        xp: 0,
        level: 1,
        badges: [],
        notes: notes.trim(),
        recentAchievement: recentAchievement.trim(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shrink-0">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            {student ? '✏️ Chỉnh Sửa Thông Tin Học Sinh' : '➕ Thêm Học Sinh Mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Avatar Section */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Ảnh đại diện (Avatar)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-200 p-1 shadow-sm object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <RefreshCw size={13} /> Tạo ngẫu nhiên
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                    <Upload size={13} /> Tải ảnh từ máy
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Avatars Selection */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1">Hoặc chọn mẫu dễ thương có sẵn:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.slice(0, 8).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                          avatar === preset.url ? 'border-indigo-600 scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover bg-white" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Họ và tên học sinh *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mã học sinh
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="HS001"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Giới tính
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    gender === 'male'
                      ? 'bg-sky-100 border-sky-400 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🚀 Nam
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    gender === 'female'
                      ? 'bg-pink-100 border-pink-400 text-pink-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🌸 Nữ
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Team and Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tổ sinh hoạt
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tên nhóm học tập
              </label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Ví dụ: Nhóm Chim Non"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Recent Achievement & Notes */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thành tích gần nhất (hiển thị trên thẻ)
              </label>
              <input
                type="text"
                value={recentAchievement}
                onChange={(e) => setRecentAchievement(e.target.value)}
                placeholder="Ví dụ: Phát biểu tốt môn Tiếng Việt"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ghi chú của cô giáo
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhận xét riêng, đặc điểm của học sinh..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer"
            >
              <Check size={16} /> {student ? 'Lưu thay đổi' : 'Thêm học sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
