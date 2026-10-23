import React, { useState } from 'react';
import {
  Users,
  Star,
  Award,
  Heart,
  Trophy,
  Clock,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plus,
  Minus,
  Pencil,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student, ActiveTab, TaskCategory, Task } from '../../types';
import { EditButton } from '../common/EditButton';
import { QuickActionsBar } from '../common/QuickActionsBar';
import { StarModal } from '../common/StarModal';

interface TeacherDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenQuickProfile: (student: Student) => void;
  onOpenEditStudent: (student: Student) => void;
  onOpenSendLove: (student: Student) => void;
  onOpenAwardBadge: (student: Student) => void;
  onOpenImport: () => void;
  onBackup: () => void;
  onRestore: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateTab,
  onOpenAddStudent,
  onOpenQuickProfile,
  onOpenEditStudent,
  onOpenSendLove,
  onOpenAwardBadge,
  onOpenImport,
  onBackup,
  onRestore,
}) => {
  const {
    students,
    transactions,
    tasks,
    badges,
    settings,
    updateSettings,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    getTodayStats,
    isDemoData,
    resetToCleanSlate,
    loadDemoDataAgain,
    undoLastTransaction,
    canUndo,
    lastUndoActionDescription,
  } = useClass();

  // Active state for Star Modal
  const [starModalTarget, setStarModalTarget] = useState<Student | null>(null);
  const [starModalMode, setStarModalMode] = useState<'add' | 'subtract'>('add');

  // Ranking view filter states
  const [rankingPeriod, setRankingPeriod] = useState<'today' | 'week' | 'month' | 'term'>('week');
  const [rankingType, setRankingType] = useState<'individual' | 'team'>('individual');
  const [rankingLimit, setRankingLimit] = useState<'top3' | 'top10' | 'all'>('top10');

  // Chart type switcher for card 9
  const [chartMetric, setChartMetric] = useState<'add' | 'sub' | 'score' | 'tasks'>('add');
  const [chartTimeframe, setChartTimeframe] = useState<'day' | 'week' | 'month'>('week');

  // Inline Quick Task creation
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('study');
  const [newTaskAssigned, setNewTaskAssigned] = useState('all');

  // Inline edit state for Team Count or Class info
  const [isEditingClassInfo, setIsEditingClassInfo] = useState(false);
  const [tempClassName, setTempClassName] = useState(settings.className);
  const [tempTeacherName, setTempTeacherName] = useState(settings.teacherName);
  const [tempTeamsCount, setTempTeamsCount] = useState(settings.numberOfTeams);

  // Edit task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayStats = getTodayStats();

  // Calculations
  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const uniqueGroups = Array.from(new Set(students.map((s) => s.group))).filter(Boolean);

  // Top outstanding students (top 4 by stars)
  const outstandingStudents = [...students].sort((a, b) => b.stars - a.stars).slice(0, 4);

  // Encouragement needed students (lowest stars or needing support, without negative phrasing!)
  const encouragementMessages = [
    'Cô sẽ đồng hành cùng em',
    'Em cố gắng thêm một chút nhé!',
    'Mỗi ngày một tiến bộ',
    'Cô tin em sẽ làm được!',
  ];
  const needEncouragementStudents = [...students]
    .sort((a, b) => a.stars - b.stars)
    .slice(0, 4);

  // Dynamic Teams extracted directly from uploaded student list
  const activeTeamsList = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
  const sortedTeams =
    activeTeamsList.length > 0
      ? activeTeamsList.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
      : Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);

  // Team rankings - adjusted dynamically to uploaded class list
  const teamStats: Record<string, { name: string; stars: number; count: number }> = {};
  sortedTeams.forEach((tName) => {
    teamStats[tName] = { name: tName, stars: 0, count: 0 };
  });
  students.forEach((s) => {
    if (!teamStats[s.team]) {
      teamStats[s.team] = { name: s.team, stars: 0, count: 0 };
    }
    teamStats[s.team].stars += s.stars;
    teamStats[s.team].count += 1;
  });
  const rankedTeams = Object.values(teamStats).sort((a, b) => b.stars - a.stars);

  // Filtered student rankings
  const rankedStudents = [...students].sort((a, b) => b.stars - a.stars);
  const displayedStudents =
    rankingLimit === 'top3'
      ? rankedStudents.slice(0, 3)
      : rankingLimit === 'top10'
      ? rankedStudents.slice(0, 10)
      : rankedStudents;

  // Handle add task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      assignedTo: newTaskAssigned,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleSaveClassInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      className: tempClassName,
      teacherName: tempTeacherName,
      numberOfTeams: Number(tempTeamsCount),
    });
    setIsEditingClassInfo(false);
  };

  return (
    <div className="space-y-6">
      {/* Demo Data Banner if in demo mode */}
      {isDemoData && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-orange-400/10 border-2 border-amber-300 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-xs">
              DỮ LIỆU MINH HỌA
            </span>
            <p className="text-xs sm:text-sm text-amber-900 font-semibold">
              Hệ thống đang hiển thị dữ liệu mẫu để cô giáo kiểm tra tính năng. Cô có thể bắt đầu lớp học mới bất kỳ lúc nào!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToCleanSlate}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer shrink-0"
            >
              🌱 Bắt đầu lớp học mới (Xóa mẫu)
            </button>
          </div>
        </div>
      )}

      {/* Undo Notification Bar */}
      {canUndo && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
            <span className="p-1 bg-indigo-200 text-indigo-800 rounded-lg">↺</span>
            <span>Vừa thực hiện: <strong>{lastUndoActionDescription}</strong></span>
          </div>
          <button
            onClick={undoLastTransaction}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Hoàn tác ngay
          </button>
        </div>
      )}

      {/* XXV. THAO TÁC NHANH - Directly at the top of Dashboard */}
      <QuickActionsBar
        onAddStudent={onOpenAddStudent}
        onOpenAddStar={() => {
          if (students.length > 0) {
            setStarModalTarget(students[0]);
            setStarModalMode('add');
          }
        }}
        onOpenSubtractStar={() => {
          if (students.length > 0) {
            setStarModalTarget(students[0]);
            setStarModalMode('subtract');
          }
        }}
        onNavigateTab={onNavigateTab}
        onOpenImport={onOpenImport}
        onBackup={onBackup}
        onRestore={onRestore}
      />

      {/* 9 MAIN CARDS OF TEACHER'S DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ======================================================== */}
        {/* CARD 1: TỔNG SỐ HỌC SINH */}
        {/* ======================================================== */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800 group-hover:text-indigo-600 transition">
                    1. TỔNG SỐ HỌC SINH
                  </h3>
                  <span className="text-[11px] text-slate-400">Trường TH Trần Văn Ơn</span>
                </div>
              </div>
              <EditButton
                onClick={() => {
                  setTempClassName(settings.className);
                  setTempTeacherName(settings.teacherName);
                  setTempTeamsCount(settings.numberOfTeams);
                  setIsEditingClassInfo(true);
                }}
                title="Sửa thông tin lớp & số tổ ✏️"
              />
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-indigo-600 tracking-tight">
                {students.length}
              </span>
              <span className="text-xs text-slate-500 font-bold">học sinh cả lớp</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-sky-50 text-sky-800 rounded-xl font-bold">
                <span className="block text-[10px] text-sky-600">Nam 🚀</span>
                {maleCount} em
              </div>
              <div className="p-2 bg-pink-50 text-pink-800 rounded-xl font-bold">
                <span className="block text-[10px] text-pink-600">Nữ 🌸</span>
                {femaleCount} em
              </div>
              <div className="p-2 bg-purple-50 text-purple-800 rounded-xl font-bold">
                <span className="block text-[10px] text-purple-600">Số tổ</span>
                {sortedTeams.length} tổ
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
                <span className="block text-[10px] text-emerald-600">Số nhóm</span>
                {uniqueGroups.length || 4} nhóm
              </div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Xem & Quản lý danh sách học sinh</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: ĐIỂM THI ĐUA HÔM NAY */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-2xl">
                  <Star size={20} className="fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">2. THI ĐUA HÔM NAY</h3>
                  <span className="text-[11px] text-slate-400">
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('stars')}
                title="Điều chỉnh điểm thi đua ✏️"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-4xl font-black text-amber-500 tracking-tight">
                  {todayStats.totalStarsToday > 0 ? `+${todayStats.totalStarsToday}` : todayStats.totalStarsToday}
                </span>
                <span className="text-xs text-slate-500 font-bold ml-1.5">sao ròng</span>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    todayStats.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-700'
                      : todayStats.trend === 'down'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {todayStats.trend === 'up' ? (
                    <>
                      <TrendingUp size={14} /> Tăng trưởng
                    </>
                  ) : todayStats.trend === 'down' ? (
                    <>
                      <TrendingDown size={14} /> Cần nỗ lực
                    </>
                  ) : (
                    'Ổn định'
                  )}
                </div>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Điểm thi đua: {todayStats.competitionScore}đ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl font-bold text-amber-800">
                <span className="block text-[10px] text-amber-600">Sao đã cộng</span>
                +{todayStats.starsAddedToday} ⭐
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl font-bold text-rose-800">
                <span className="block text-[10px] text-rose-600">Sao đã trừ</span>
                -{todayStats.starsSubtractedToday} ⭐
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('stars')}
              className="text-amber-600 font-bold hover:underline cursor-pointer"
            >
              Vào bảng cộng/trừ sao toàn lớp →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 3: HỌC SINH NỔI BẬT */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-2xl">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">3. HỌC SINH NỔI BẬT</h3>
                  <span className="text-[11px] text-slate-400">Gương sáng thi đua tuần này</span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('reports')}
                title="Xem bảng xếp hạng đầy đủ ✏️"
              />
            </div>

            <div className="space-y-2.5">
              {outstandingStudents.slice(0, 3).map((std, idx) => (
                <div
                  key={std.id}
                  onClick={() => onOpenQuickProfile(std)}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center font-black text-xs text-amber-500">
                      #{idx + 1}
                    </span>
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-100 border"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-800 block line-clamp-1">
                        {std.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {std.team} • {std.recentAchievement || 'Cố gắng xuất sắc'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                      ⭐ {std.stars}
                    </span>
                    <button
                      onClick={() => {
                        setStarModalTarget(std);
                        setStarModalMode('add');
                      }}
                      className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold transition cursor-pointer"
                      title="+ Sao"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setStarModalTarget(std);
                        setStarModalMode('subtract');
                      }}
                      className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition cursor-pointer"
                      title="- Sao"
                    >
                      <Minus size={13} />
                    </button>
                    <EditButton
                      onClick={() => onOpenEditStudent(std)}
                      title="Sửa học sinh ✏️"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-yellow-600 font-bold hover:underline cursor-pointer"
            >
              Vinh danh bảng vàng đầy đủ →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 4: HỌC SINH CẦN ĐỘNG VIÊN */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-2xl">
                  <Heart size={20} className="fill-pink-400 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">4. CẦN ĐỘNG VIÊN</h3>
                  <span className="text-[11px] text-pink-500 font-semibold">
                    Yêu thương & Nâng đỡ từng bước
                  </span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('love')}
                title="Góc yêu thương ✏️"
              />
            </div>

            <div className="space-y-2.5">
              {needEncouragementStudents.slice(0, 3).map((std, idx) => (
                <div
                  key={std.id}
                  onClick={() => onOpenQuickProfile(std)}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-pink-50/50 transition cursor-pointer border border-transparent hover:border-pink-100"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-100 border"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-800 block line-clamp-1">
                        {std.name}
                      </span>
                      <span className="text-[10px] text-pink-700 font-bold bg-pink-50 px-1.5 py-0.5 rounded-md inline-block">
                        {encouragementMessages[idx % encouragementMessages.length]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenSendLove(std)}
                      className="flex items-center gap-1 px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-[11px] font-bold shadow-xs transition cursor-pointer"
                      title="Gửi lời động viên"
                    >
                      <Heart size={12} /> Động viên
                    </button>
                    <button
                      onClick={() => {
                        setStarModalTarget(std);
                        setStarModalMode('add');
                      }}
                      className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold transition cursor-pointer"
                      title="+ Sao khích lệ"
                    >
                      <Plus size={13} />
                    </button>
                    <EditButton
                      onClick={() => onOpenEditStudent(std)}
                      title="Sửa học sinh ✏️"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('love')}
              className="text-xs text-pink-600 font-bold hover:underline cursor-pointer"
            >
              Mở bức tường yêu thương →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 5: BẢNG XẾP HẠNG */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-2xl">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">5. BẢNG XẾP HẠNG</h3>
                  <span className="text-[11px] text-slate-400">Thi đua tích cực, đoàn kết</span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('reports')}
                title="Báo cáo xếp hạng ✏️"
              />
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center justify-between gap-1 mb-3 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <div className="flex gap-1">
                <button
                  onClick={() => setRankingType('individual')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    rankingType === 'individual' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Cá nhân
                </button>
                <button
                  onClick={() => setRankingType('team')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    rankingType === 'team' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tổ nhóm
                </button>
              </div>

              <div className="flex gap-1">
                {(['top3', 'top10', 'all'] as const).map((lim) => (
                  <button
                    key={lim}
                    onClick={() => setRankingLimit(lim)}
                    className={`px-2 py-1 rounded-lg uppercase text-[10px] transition cursor-pointer ${
                      rankingLimit === lim ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {lim === 'top3' ? 'Top 3' : lim === 'top10' ? 'Top 10' : 'Tất cả'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {rankingType === 'individual' ? (
                displayedStudents.map((std, idx) => (
                  <div
                    key={std.id}
                    onClick={() => onOpenQuickProfile(std)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                          idx === 0
                            ? 'bg-amber-400 text-white'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 line-clamp-1">{std.name}</span>
                      <span className="text-[10px] text-slate-400">{std.team}</span>
                    </div>
                    <span className="font-extrabold text-amber-600">⭐ {std.stars}</span>
                  </div>
                ))
              ) : (
                rankedTeams.map((t, idx) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-purple-700">#{idx + 1}</span>
                      <span className="font-bold text-slate-800">{t.name}</span>
                      <span className="text-[10px] text-slate-500">({t.count} bạn)</span>
                    </div>
                    <span className="font-black text-purple-700">⭐ {t.stars}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-purple-600 font-bold hover:underline cursor-pointer"
            >
              Xem chi tiết báo cáo & xuất Excel →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 6: HOẠT ĐỘNG GẦN ĐÂY */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-2xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">6. HOẠT ĐỘNG GẦN ĐÂY</h3>
                  <span className="text-[11px] text-slate-400">Nhật ký trực tiếp theo thời gian</span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('stars')}
                title="Chỉnh sửa nhật ký nếu nhập sai ✏️"
              />
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 line-clamp-1">
                    <span
                      className={`px-1.5 py-0.5 rounded-md font-black text-[10px] shrink-0 ${
                        tx.type === 'add' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.type === 'add' ? `+${tx.amount} ⭐` : `-${tx.amount} ⭐`}
                    </span>
                    <span className="font-bold text-slate-800">{tx.studentName}:</span>
                    <span className="text-slate-600 truncate">{tx.reason}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(tx.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            {canUndo && (
              <button
                onClick={undoLastTransaction}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Hoàn tác hành động gần nhất ↺
              </button>
            )}
            <button
              onClick={() => onNavigateTab('stars')}
              className="text-xs text-slate-600 font-bold hover:underline cursor-pointer ml-auto"
            >
              Xem toàn bộ nhật ký →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 7: NHIỆM VỤ HÔM NAY */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <ListTodo size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">7. NHIỆM VỤ HÔM NAY</h3>
                  <span className="text-[11px] text-slate-400">
                    Đã xong: {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={13} /> Thêm
                </button>
                <EditButton
                  onClick={() => setIsAddingTask(true)}
                  title="Sửa nhiệm vụ ✏️"
                />
              </div>
            </div>

            {/* Quick Add Form */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Nội dung nhiệm vụ mới..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-lg"
                  >
                    <option value="study">📖 Học tập</option>
                    <option value="duty">🧹 Trực nhật</option>
                    <option value="group">👥 Nhóm</option>
                    <option value="individual">👤 Cá nhân</option>
                    <option value="experience">🌱 Trải nghiệm</option>
                  </select>
                  <select
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-lg"
                  >
                    <option value="all">Cả lớp</option>
                    {sortedTeams.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="ml-auto px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            )}

            {/* Task list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition ${
                    task.status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 select-none">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={task.status === 'completed' ? 'line-through text-slate-400 font-medium' : 'font-bold'}>
                      {task.title}
                    </span>
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600">
                    {task.assignedTo === 'all' ? 'Cả lớp' : task.assignedTo}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                    title="Xóa"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <span className="text-xs text-slate-500">
              {tasks.filter((t) => t.status === 'pending').length} việc đang đợi hoàn thành
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 8: HUY HIỆU MỚI NHẬN */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-2xl">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">8. HUY HIỆU DANH DỰ</h3>
                  <span className="text-[11px] text-slate-400">Bộ huy hiệu khen thưởng tiểu học</span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('badges')}
                title="Quản lý & Thêm huy hiệu ✏️"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => onNavigateTab('badges')}
                  className="p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 rounded-2xl transition cursor-pointer flex items-center gap-2.5"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-800 block truncate">
                      {badge.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {badge.condition}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('badges')}
              className="text-xs text-teal-600 font-bold hover:underline cursor-pointer"
            >
              Mở kho huy hiệu & Trao huy hiệu →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 9: THỐNG KÊ ĐIỂM & TIẾN ĐỘ */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-2xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">9. THỐNG KÊ ĐIỂM</h3>
                  <span className="text-[11px] text-slate-400">Biểu đồ tiến độ thi đua lớp</span>
                </div>
              </div>
              <EditButton
                onClick={() => onNavigateTab('reports')}
                title="Chỉnh sửa dữ liệu thống kê ✏️"
              />
            </div>

            {/* Metric Switcher */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3 text-[10px] font-bold text-center">
              <button
                onClick={() => setChartMetric('add')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  chartMetric === 'add' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                + Sao cộng
              </button>
              <button
                onClick={() => setChartMetric('sub')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  chartMetric === 'sub' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                – Sao trừ
              </button>
              <button
                onClick={() => setChartMetric('score')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  chartMetric === 'score' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Thi đua
              </button>
              <button
                onClick={() => setChartMetric('tasks')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  chartMetric === 'tasks' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Nhiệm vụ
              </button>
            </div>

            {/* Visual Bar Chart representation */}
            <div className="space-y-2 pt-1">
              {sortedTeams.map((teamName) => {
                const teamStudents = students.filter((s) => s.team === teamName);
                const teamStars = teamStudents.reduce((acc, s) => acc + s.stars, 0);
                const maxPossible = Math.max(1, ...Object.values(teamStats).map((t) => t.stars));
                const pct = Math.min(100, Math.round((teamStars / maxPossible) * 100));

                return (
                  <div key={teamName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{teamName}</span>
                      <span className="font-extrabold text-blue-600">⭐ {teamStars}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Báo cáo phân tích chuyên sâu →
            </button>
          </div>
        </div>
      </div>

      {/* Edit Class Info Modal */}
      {isEditingClassInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              ✏️ Cập nhật thông tin Lớp học & Số tổ
            </h3>
            <form onSubmit={handleSaveClassInfo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp học</label>
                <input
                  type="text"
                  value={tempClassName}
                  onChange={(e) => setTempClassName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={tempTeacherName}
                  onChange={(e) => setTempTeacherName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số tổ trong lớp (1 - 8 tổ)</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tempTeamsCount}
                  onChange={(e) => setTempTeamsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingClassInfo(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Star Modal for cards */}
      {starModalTarget && (
        <StarModal
          isOpen={true}
          student={starModalTarget}
          mode={starModalMode}
          onClose={() => setStarModalTarget(null)}
        />
      )}
    </div>
  );
};
