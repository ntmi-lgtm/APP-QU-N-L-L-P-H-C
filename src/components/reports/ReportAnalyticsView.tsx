import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Users,
  Star,
  Award,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';

export const ReportAnalyticsView: React.FC = () => {
  const { students, transactions, tasks, settings, exportStudentsCsv } = useClass();

  const [period, setPeriod] = useState<'week' | 'month' | 'term'>('week');

  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const totalStars = students.reduce((acc, s) => acc + s.stars, 0);
  const avgStars = students.length > 0 ? (totalStars / students.length).toFixed(1) : '0';

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100;

  // Top outstanding
  const topStudents = [...students].sort((a, b) => b.stars - a.stars).slice(0, 5);

  // Progressive students
  const progressiveStudents = [...students]
    .filter((s) => s.recentAchievement?.includes('tiến bộ') || s.stars > 15)
    .slice(0, 5);

  // Encouragement needed
  const encouragementStudents = [...students].sort((a, b) => a.stars - b.stars).slice(0, 5);

  // Dynamic teams from uploaded student list
  const availableTeams = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
  const sortedTeams =
    availableTeams.length > 0
      ? availableTeams.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
      : Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);

  // Team breakdown
  const teamData = sortedTeams.map((teamName) => {
    const list = students.filter((s) => s.team === teamName);
    const stars = list.reduce((a, s) => a + s.stars, 0);
    return {
      name: teamName,
      count: list.length,
      stars,
      avg: list.length > 0 ? (stars / list.length).toFixed(1) : 0,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            Báo Cáo Toàn Diện & Phân Tích Thi Đua
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng kết học sinh nổi bật, tiến bộ, cần động viên, chuyên cần và biểu đồ tổ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Printer size={15} /> In / Xuất PDF
          </button>
          <button
            onClick={exportStudentsCsv}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition cursor-pointer"
          >
            <FileSpreadsheet size={15} /> Xuất Excel / CSV
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
        <div className="text-center pb-4 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            {settings.schoolName}
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-0.5">
            BÁO CÁO THI ĐUA & RÈN LUYỆN {settings.className.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            GVCN: <strong>{settings.teacherName}</strong> • Năm học: <strong>{settings.academicYear}</strong> • Ngày lập: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center">
            <span className="text-xs font-bold text-indigo-700 block">Sĩ số lớp</span>
            <span className="text-2xl font-black text-indigo-900">{students.length}</span>
            <span className="text-[11px] text-indigo-600 block mt-0.5">
              {maleCount} Nam • {femaleCount} Nữ
            </span>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl text-center">
            <span className="text-xs font-bold text-amber-700 block">Tổng sao thi đua</span>
            <span className="text-2xl font-black text-amber-900">⭐ {totalStars}</span>
            <span className="text-[11px] text-amber-600 block mt-0.5">
              Trung bình: {avgStars} sao/em
            </span>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
            <span className="text-xs font-bold text-emerald-700 block">Hoàn thành nhiệm vụ</span>
            <span className="text-2xl font-black text-emerald-900">{taskCompletionRate}%</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">
              {completedTasks}/{tasks.length} nhiệm vụ
            </span>
          </div>

          <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl text-center">
            <span className="text-xs font-bold text-purple-700 block">Tổng số tổ</span>
            <span className="text-2xl font-black text-purple-900">{settings.numberOfTeams}</span>
            <span className="text-[11px] text-purple-600 block mt-0.5">Tổ thi đua</span>
          </div>
        </div>

        {/* Team Performance Table & Bar Chart */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-2">
            <Users size={16} className="text-indigo-600" /> Kết Quả Thi Đua Theo Tổ
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-600 font-bold uppercase">
                  <th className="p-3">Tổ</th>
                  <th className="p-3">Số thành viên</th>
                  <th className="p-3">Tổng sao</th>
                  <th className="p-3">Trung bình/em</th>
                  <th className="p-3">Tiến độ thi đua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamData.map((t) => {
                  const maxStars = Math.max(1, ...teamData.map((x) => x.stars));
                  const pct = Math.round((t.stars / maxStars) * 100);
                  return (
                    <tr key={t.name}>
                      <td className="p-3 font-bold text-slate-800">{t.name}</td>
                      <td className="p-3 text-slate-600">{t.count} bạn</td>
                      <td className="p-3 font-black text-amber-600">⭐ {t.stars}</td>
                      <td className="p-3 font-bold text-slate-700">{t.avg}</td>
                      <td className="p-3 w-48">
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Categories: Nổi Bật, Tiến Bộ, Cần Động Viên */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Nổi bật */}
          <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <h4 className="font-black text-xs text-amber-900 mb-2 flex items-center gap-1.5 uppercase">
              <Award size={14} className="text-amber-600" /> Học Sinh Nổi Bật
            </h4>
            <div className="space-y-1.5">
              {topStudents.map((std, idx) => (
                <div key={std.id} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-amber-100">
                  <span className="font-bold text-slate-800">
                    #{idx + 1} {std.name}
                  </span>
                  <span className="font-black text-amber-600">⭐ {std.stars}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tiến bộ */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <h4 className="font-black text-xs text-emerald-900 mb-2 flex items-center gap-1.5 uppercase">
              <TrendingUp size={14} className="text-emerald-600" /> Học Sinh Tiến Bộ
            </h4>
            <div className="space-y-1.5">
              {progressiveStudents.map((std) => (
                <div key={std.id} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-emerald-100">
                  <span className="font-bold text-slate-800">{std.name}</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    Tiến bộ rõ rệt
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Cần động viên */}
          <div className="p-4 bg-pink-50/60 border border-pink-100 rounded-2xl">
            <h4 className="font-black text-xs text-pink-900 mb-2 flex items-center gap-1.5 uppercase">
              <CheckCircle2 size={14} className="text-pink-600" /> Cần Đồng Hành & Động Viên
            </h4>
            <div className="space-y-1.5">
              {encouragementStudents.map((std) => (
                <div key={std.id} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-pink-100">
                  <span className="font-bold text-slate-800">{std.name}</span>
                  <span className="text-[10px] text-pink-700 font-bold bg-pink-50 px-1.5 py-0.5 rounded-md">
                    Cố gắng thêm nhé!
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
