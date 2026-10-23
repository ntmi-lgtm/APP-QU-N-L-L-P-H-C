import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  Pencil,
  Trash2,
  Star,
  Download,
  FileSpreadsheet,
  Grid,
  List,
  Sparkles,
  Heart,
  Trophy,
} from 'lucide-react';
import { Student } from '../../types';
import { useClass } from '../../context/ClassContext';
import { EditButton } from '../common/EditButton';
import { ConfirmModal } from '../common/ConfirmModal';
import { StarModal } from '../common/StarModal';

interface StudentListProps {
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onOpenQuickProfile: (student: Student) => void;
  onOpenImport: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenQuickProfile,
  onOpenImport,
}) => {
  const {
    students,
    deleteStudent,
    settings,
    exportStudentsCsv,
    downloadSampleCsv,
  } = useClass();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'level'>('stars');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Deletion state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Star modal state
  const [starTarget, setStarTarget] = useState<Student | null>(null);
  const [starMode, setStarMode] = useState<'add' | 'subtract'>('add');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkStarOpen, setIsBulkStarOpen] = useState(false);

  // Extract all unique teams dynamically from the student list
  const availableTeams = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
    if (list.length > 0) {
      return list.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
    }
    return Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);
  }, [students, settings.numberOfTeams]);

  // Counts for each team
  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      counts[s.team] = (counts[s.team] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Gender counts
  const maleCount = useMemo(() => students.filter((s) => s.gender === 'male').length, [students]);
  const femaleCount = useMemo(() => students.filter((s) => s.gender === 'female').length, [students]);

  // Automatically reset selectedTeam if it's no longer in the uploaded list
  useEffect(() => {
    if (selectedTeam !== 'all' && !availableTeams.includes(selectedTeam)) {
      setSelectedTeam('all');
    }
  }, [availableTeams, selectedTeam]);

  // Filtering & Sorting
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
          s.group.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = selectedTeam === 'all' || s.team === selectedTeam;
        const matchesGender = selectedGender === 'all' || s.gender === selectedGender;
        return matchesSearch && matchesTeam && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stars - a.stars;
        if (sortBy === 'level') return b.level - a.level;
        return a.name.localeCompare(b.name, 'vi');
      });
  }, [students, searchQuery, selectedTeam, selectedGender, sortBy]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedStudentsObjects = students.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={24} />
            Quản Lý Danh Sách Học Sinh ({students.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đã đồng bộ theo danh sách lớp tải lên: {students.length} em • {availableTeams.length} tổ • {maleCount} Nam • {femaleCount} Nữ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <Plus size={16} /> Thêm học sinh
          </button>
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition cursor-pointer"
            title="Nhập danh sách học sinh đơn giản (STT, Tên học sinh, Giới tính, Tổ)"
          >
            <FileSpreadsheet size={16} /> Nhập danh sách (4 cột đơn giản)
          </button>
          <button
            onClick={downloadSampleCsv}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Tải file mẫu CSV chỉ gồm: STT, Tên học sinh, Giới tính, Tổ"
          >
            <Download size={14} /> Mẫu CSV (4 cột)
          </button>
          <button
            onClick={exportStudentsCsv}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Xuất dữ liệu học sinh ra file CSV"
          >
            <Download size={14} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh, mã HS, nhóm..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
            />
          </div>

          {/* Filter Team - Adjusted dynamically to uploaded class list */}
          <div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
            >
              <option value="all">
                Tất cả các tổ ({availableTeams.length} tổ • {students.length} em)
              </option>
              {availableTeams.map((t) => (
                <option key={t} value={t}>
                  {t} ({teamCounts[t] || 0} em)
                </option>
              ))}
            </select>
          </div>

          {/* Filter Gender - Adjusted dynamically to uploaded class list */}
          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
            >
              <option value="all">Tất cả giới tính ({students.length} em)</option>
              <option value="male">🚀 Nam ({maleCount} em)</option>
              <option value="female">🌸 Nữ ({femaleCount} em)</option>
            </select>
          </div>

          {/* Sort By & View toggle */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'stars' | 'name' | 'level')}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="stars">⭐ Sao nhiều nhất</option>
              <option value="name">🔤 Tên (A - Z)</option>
              <option value="level">🆙 Cấp độ (Level)</option>
            </select>

            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
                }`}
                title="Dạng lưới thẻ"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
                }`}
                title="Dạng bảng chi tiết"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Badges & Reset Bar */}
        {(selectedTeam !== 'all' || selectedGender !== 'all' || searchQuery.trim() !== '') && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs animate-in fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-indigo-900">Đang lọc theo danh sách lớp:</span>
              {selectedTeam !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px]">
                  {selectedTeam} ({teamCounts[selectedTeam] || 0} em)
                  <button
                    onClick={() => setSelectedTeam('all')}
                    className="hover:opacity-80 cursor-pointer ml-1 text-xs font-black"
                    title="Bỏ lọc tổ"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGender !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-600 text-white rounded-lg font-bold text-[11px]">
                  {selectedGender === 'male' ? `🚀 Nam (${maleCount} em)` : `🌸 Nữ (${femaleCount} em)`}
                  <button
                    onClick={() => setSelectedGender('all')}
                    className="hover:opacity-80 cursor-pointer ml-1 text-xs font-black"
                    title="Bỏ lọc giới tính"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-700 text-white rounded-lg font-bold text-[11px]">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:opacity-80 cursor-pointer ml-1 text-xs font-black"
                    title="Xóa tìm kiếm"
                  >
                    ×
                  </button>
                </span>
              )}
              <span className="text-slate-500 font-medium ml-1">
                (Hiển thị {filteredStudents.length}/{students.length} học sinh)
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedTeam('all');
                setSelectedGender('all');
                setSearchQuery('');
              }}
              className="text-indigo-700 hover:text-indigo-900 font-bold hover:underline cursor-pointer text-xs"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Bulk Action Bar if students are selected */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles size={16} className="text-amber-600" />
              Đã chọn {selectedIds.length} học sinh
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStarMode('add');
                  setIsBulkStarOpen(true);
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-sm transition cursor-pointer"
              >
                + Thưởng sao đồng loạt
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold border transition cursor-pointer"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students View (Grid or Table) */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-base font-bold text-slate-700">Không tìm thấy học sinh nào phù hợp bộ lọc.</p>
          <p className="text-xs text-slate-400 mt-1">Cô giáo có thể thử từ khóa khác hoặc nhấn "Thêm học sinh" mới.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              onClick={() => onOpenQuickProfile(std)}
              className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Checkbox, Team Badge, Edit & Delete Buttons */}
                <div className="flex items-center justify-between mb-3" onClick={(e) => e.stopPropagation()}>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(std.id)}
                      onChange={() => toggleSelectStudent(std.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-slate-500">{std.code || 'HS'}</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {std.team}
                    </span>
                    <EditButton
                      onClick={() => onOpenEditStudent(std)}
                      title="Sửa học sinh ✏️"
                    />
                    <button
                      onClick={() => setStudentToDelete(std)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      title="Xóa học sinh 🗑️"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200 p-0.5"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-indigo-600 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                      Lv.{std.level}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-sm text-slate-800 truncate group-hover:text-indigo-600 transition">
                      {std.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {std.group} • {std.gender === 'female' ? 'Nữ 🌸' : 'Nam 🚀'}
                    </span>
                    <span className="text-[10px] text-indigo-700 font-bold block truncate mt-0.5">
                      {std.recentAchievement || 'Cố gắng mỗi ngày'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Star Count & Instant +/- Buttons */}
              <div
                className="pt-3 border-t border-slate-100 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-amber-500">⭐ {std.stars}</span>
                  <span className="text-[10px] text-slate-400">({std.xp} XP)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setStarTarget(std);
                      setStarMode('add');
                    }}
                    className="p-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1"
                    title="+ Sao khen thưởng"
                  >
                    <Plus size={14} /> ⭐
                  </button>
                  <button
                    onClick={() => {
                      setStarTarget(std);
                      setStarMode('subtract');
                    }}
                    className="p-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
                    title="- Sao nhắc nhở"
                  >
                    <Minus size={14} /> ⭐
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        filteredStudents.length > 0 &&
                        selectedIds.length === filteredStudents.length
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Học sinh</th>
                  <th className="p-3">Mã HS</th>
                  <th className="p-3">Giới tính</th>
                  <th className="p-3">Tổ</th>
                  <th className="p-3">Nhóm</th>
                  <th className="p-3">Số sao</th>
                  <th className="p-3">Cấp độ (XP)</th>
                  <th className="p-3">Ghi chú</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    onClick={() => onOpenQuickProfile(std)}
                    className="hover:bg-indigo-50/40 transition cursor-pointer"
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(std.id)}
                        onChange={() => toggleSelectStudent(std.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-8 h-8 rounded-xl object-cover bg-slate-100 border p-0.5"
                      />
                      <span>{std.name}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{std.code || 'HS'}</td>
                    <td className="p-3">
                      {std.gender === 'female' ? '🌸 Nữ' : '🚀 Nam'}
                    </td>
                    <td className="p-3 font-bold text-purple-700">{std.team}</td>
                    <td className="p-3 text-slate-600">{std.group}</td>
                    <td className="p-3 font-black text-amber-600 text-sm">⭐ {std.stars}</td>
                    <td className="p-3 text-slate-600 font-bold">
                      Lv.{std.level} ({std.xp} XP)
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{std.notes}</td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setStarTarget(std);
                            setStarMode('add');
                          }}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg font-black text-xs transition cursor-pointer"
                        >
                          +⭐
                        </button>
                        <button
                          onClick={() => {
                            setStarTarget(std);
                            setStarMode('subtract');
                          }}
                          className="px-2 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                        >
                          -⭐
                        </button>
                        <EditButton
                          onClick={() => onOpenEditStudent(std)}
                          title="Sửa thông tin ✏️"
                        />
                        <button
                          onClick={() => setStudentToDelete(std)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Xóa học sinh 🗑️"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!studentToDelete}
        title="Xóa học sinh"
        message={`“Bạn có chắc chắn muốn xóa học sinh ${studentToDelete?.name || ''} không?” Dữ liệu sao và lịch sử của học sinh sẽ không thể hoàn tác.`}
        confirmLabel="Xóa học sinh"
        cancelLabel="Hủy"
        isDestructive={true}
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
      />

      {/* Single Student Star Modal */}
      {starTarget && (
        <StarModal
          isOpen={true}
          student={starTarget}
          mode={starMode}
          onClose={() => setStarTarget(null)}
        />
      )}

      {/* Bulk Star Modal */}
      {isBulkStarOpen && (
        <StarModal
          isOpen={true}
          student={null}
          selectedStudents={selectedStudentsObjects}
          mode={starMode}
          onClose={() => {
            setIsBulkStarOpen(false);
            setSelectedIds([]);
          }}
        />
      )}
    </div>
  );
};
