import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { AttendanceStatus } from '../../types';
import { GlobalSaveButton } from '../common/GlobalSaveButton';

export const AttendanceView: React.FC = () => {
  const { students, attendances, setAttendance, setAllAttendancePresent, todayDate, settings } = useClass();

  const [currentDate, setCurrentDate] = useState<string>(todayDate);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  const todayRecord = attendances[currentDate] || {};

  // Status mapping
  const STATUSES: { key: AttendanceStatus; label: string; icon: string; bg: string; text: string; border: string }[] = [
    { key: 'present', label: 'Có mặt', icon: '🟢', bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-800 font-bold', border: 'border-emerald-300' },
    { key: 'late', label: 'Đi muộn', icon: '🟡', bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-800 font-bold', border: 'border-amber-300' },
    { key: 'absent', label: 'Nghỉ', icon: '🔴', bg: 'bg-rose-50 hover:bg-rose-100', text: 'text-rose-800 font-bold', border: 'border-rose-300' },
    { key: 'excused', label: 'Có phép', icon: '🔵', bg: 'bg-sky-50 hover:bg-sky-100', text: 'text-sky-800 font-bold', border: 'border-sky-300' },
  ];

  // Counts
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let excusedCount = 0;

  students.forEach((s) => {
    const status = todayRecord[s.id] || 'present';
    if (status === 'present') presentCount++;
    else if (status === 'late') lateCount++;
    else if (status === 'absent') absentCount++;
    else if (status === 'excused') excusedCount++;
  });

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

  const filteredStudents = students.filter(
    (s) => selectedTeam === 'all' || s.team === selectedTeam
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-sky-600" size={24} />
            Điểm Danh Chuyên Cần Lớp Học
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Điểm danh 1 chạm "Có mặt tất cả", sau đó điều chỉnh các trường hợp đi muộn hoặc vắng phép
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700">
            <Calendar size={15} className="text-slate-500" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setAllAttendancePresent(currentDate)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-200 transition cursor-pointer"
          >
            <Sparkles size={15} /> Có mặt tất cả
          </button>

          <GlobalSaveButton
            variant="inline"
            label="💾 Lưu điểm danh"
            customActionNote={`Lưu kết quả điểm danh ngày ${currentDate}`}
          />
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            🟢
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Có mặt</span>
            <span className="text-2xl font-black text-emerald-600">{presentCount}</span>
            <span className="text-[11px] text-slate-400 ml-1">/ {students.length} em</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            🟡
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Đi muộn</span>
            <span className="text-2xl font-black text-amber-600">{lateCount}</span>
            <span className="text-[11px] text-slate-400 ml-1">em</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            🔵
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Có phép</span>
            <span className="text-2xl font-black text-sky-600">{excusedCount}</span>
            <span className="text-[11px] text-slate-400 ml-1">em</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            🔴
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Nghỉ không phép</span>
            <span className="text-2xl font-black text-rose-600">{absentCount}</span>
            <span className="text-[11px] text-slate-400 ml-1">em</span>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        {/* Team filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Lọc theo tổ:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedTeam('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedTeam === 'all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              {availableTeams.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTeam(t)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedTeam === t
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t} ({teamCounts[t] || 0})
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            Tỷ lệ chuyên cần:{' '}
            <strong className="text-emerald-600">
              {students.length > 0
                ? Math.round(((presentCount + lateCount) / students.length) * 100)
                : 100}
              %
            </strong>
          </span>
        </div>

        {/* Student attendance row cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredStudents.map((std, idx) => {
            const currentStatus: AttendanceStatus = todayRecord[std.id] || 'present';

            return (
              <div
                key={std.id}
                className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-10 h-10 rounded-xl object-cover bg-white border p-0.5"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">
                      {std.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {std.team} • {std.group}
                    </span>
                  </div>
                </div>

                {/* 4 Status Toggle Buttons */}
                <div className="grid grid-cols-4 gap-1 sm:w-64">
                  {STATUSES.map((st) => {
                    const isCurrent = currentStatus === st.key;
                    return (
                      <button
                        key={st.key}
                        onClick={() => setAttendance(std.id, st.key, currentDate)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                          isCurrent
                            ? `${st.bg} ${st.text} ${st.border} shadow-xs scale-102`
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span>{st.icon}</span>
                        <span className="hidden sm:inline">{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
          <div className="text-xs text-slate-500">
            💡 <strong>Mẹo:</strong> Hệ thống tự động ghi nhận ngay khi bạn nhấp chọn. Bấm <strong>Lưu điểm danh</strong> để xác nhận an toàn vào bộ nhớ.
          </div>
          <GlobalSaveButton
            variant="inline"
            label="💾 Lưu kết quả điểm danh ngay"
            customActionNote={`Lưu điểm danh ngày ${currentDate}`}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};
