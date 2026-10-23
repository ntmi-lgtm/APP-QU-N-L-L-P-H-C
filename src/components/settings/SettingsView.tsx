import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    backupDataJson,
    restoreDataJson,
    resetToCleanSlate,
    loadDemoDataAgain,
    isDemoData,
  } = useClass();

  const [className, setClassName] = useState(settings.className);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [teacherName, setTeacherName] = useState(settings.teacherName);
  const [numberOfTeams, setNumberOfTeams] = useState(settings.numberOfTeams);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [slogan, setSlogan] = useState(settings.slogan);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreFileText, setRestoreFileText] = useState<string | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showCleanSlateModal, setShowCleanSlateModal] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      className: className.trim(),
      schoolName: schoolName.trim(),
      teacherName: teacherName.trim(),
      numberOfTeams: Number(numberOfTeams),
      academicYear: academicYear.trim(),
      slogan: slogan.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleBackup = () => {
    const jsonStr = backupDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sao_Luu_Lop_Hoc_Co_Mi_${settings.className}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRestoreFileText(text);
      setShowRestoreModal(true);
      setRestoreError('');
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!restoreFileText) return;
    const ok = restoreDataJson(restoreFileText);
    if (!ok) {
      setRestoreError('File sao lưu không hợp lệ hoặc bị hỏng.');
    } else {
      setShowRestoreModal(false);
      setRestoreFileText(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="text-slate-700" size={24} />
            Cài Đặt Lớp Học & Sao Lưu Dữ Liệu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị trường học, thông tin giáo viên chủ nhiệm, xuất nhập file an toàn
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in zoom-in-95">
            <CheckCircle2 size={15} /> Đã lưu cài đặt thành công!
          </div>
        )}
      </div>

      {/* Class Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
          ✏️ Thông Tin Chung Lớp Học
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường học</label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp học</label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giáo viên chủ nhiệm</label>
            <input
              type="text"
              required
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số tổ trong lớp</label>
            <input
              type="number"
              min={1}
              max={8}
              required
              value={numberOfTeams}
              onChange={(e) => setNumberOfTeams(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Năm học</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Khẩu hiệu lớp học</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            Lưu cài đặt lớp học
          </button>
        </div>
      </form>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Backup Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <Download size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">💾 SAO LƯU DỮ LIỆU</h3>
              <span className="text-[11px] text-slate-400">Xuất file JSON lưu trên máy an toàn</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tải về toàn bộ danh sách học sinh, điểm sao, lịch sử giao dịch, nhiệm vụ và huy hiệu thành một file sao lưu dự phòng.
          </p>
          <button
            onClick={handleBackup}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Tải file sao lưu (.json) ngay
          </button>
        </div>

        {/* Restore Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">♻️ KHÔI PHỤC DỮ LIỆU</h3>
              <span className="text-[11px] text-slate-400">Nhập lại từ file sao lưu JSON</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tải lên file sao lưu đã lưu trước đó để khôi phục toàn bộ tình trạng lớp học.
          </p>
          <label className="block w-full text-center py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer">
            Chọn file sao lưu JSON từ máy
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileRestoreChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Classroom Fresh Start Actions */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          🌱 Khởi Tạo & Làm Mới Lớp Học
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
          <div>
            <h4 className="font-bold text-xs text-slate-800">Bắt đầu năm học mới (Clean Slate)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Đưa toàn bộ sao = 0, XP = 0, Level = 1, xóa lịch sử thi đua cũ để bắt đầu kỳ thi đua mới.
            </p>
          </div>
          <button
            onClick={() => setShowCleanSlateModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
          >
            Bắt đầu lớp học mới
          </button>
        </div>

        {!isDemoData && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-800">Tải lại dữ liệu mẫu minh họa</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Nạp lại dữ liệu 24 học sinh mẫu của Lớp 3A để trải nghiệm giao diện thử nghiệm.
              </p>
            </div>
            <button
              onClick={loadDemoDataAgain}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              Nạp dữ liệu mẫu
            </button>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      <ConfirmModal
        isOpen={showRestoreModal}
        title="Xác nhận khôi phục dữ liệu"
        message="“Dữ liệu hiện tại sẽ được thay thế hoàn toàn bằng dữ liệu trong file sao lưu.” Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Khôi phục ngay"
        cancelLabel="Hủy bỏ"
        isDestructive={true}
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          setShowRestoreModal(false);
          setRestoreFileText(null);
        }}
      />

      {/* Clean Slate Confirmation Modal */}
      <ConfirmModal
        isOpen={showCleanSlateModal}
        title="Bắt đầu lớp học mới"
        message="Hệ thống sẽ đặt lại toàn bộ sao = 0, XP = 0, Level = 1 cho tất cả học sinh và xóa nhật ký thi đua cũ. Bạn có chắc chắn muốn bắt đầu lớp học mới?"
        confirmLabel="Xác nhận làm mới"
        cancelLabel="Hủy"
        isDestructive={true}
        onConfirm={() => {
          resetToCleanSlate();
          setShowCleanSlateModal(false);
        }}
        onCancel={() => setShowCleanSlateModal(false)}
      />
    </div>
  );
};
