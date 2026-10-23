import React, { useState } from 'react';
import {
  Home,
  Users,
  Star,
  CheckSquare,
  Gamepad2,
  BarChart3,
  Award,
  Grid,
  Gift,
  Trophy,
  Heart,
  Palette,
  Settings,
  Volume2,
  VolumeX,
  Menu,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { ClassProvider, useClass } from './context/ClassContext';
import { ActiveTab, Student } from './types';
import { THEMES } from './utils/theme';
import { sound } from './utils/sound';

// Components
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentList } from './components/students/StudentList';
import { StarManagementView } from './components/stars/StarManagementView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ScoringView } from './components/scoring/ScoringView';
import { SeatingChartView } from './components/seating/SeatingChartView';
import { RewardStoreView } from './components/rewards/RewardStoreView';
import { BadgeGalleryView } from './components/badges/BadgeGalleryView';
import { LoveCornerView } from './components/love/LoveCornerView';
import { ThemeCustomizerView } from './components/themes/ThemeCustomizerView';
import { ReportAnalyticsView } from './components/reports/ReportAnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { FunLearningHub } from './components/games/FunLearningHub';

// Common Modals
import { StudentFormModal } from './components/students/StudentFormModal';
import { ImportStudentsModal } from './components/students/ImportStudentsModal';
import { StudentQuickProfileModal } from './components/common/StudentQuickProfileModal';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { GlobalSaveButton } from './components/common/GlobalSaveButton';
import { SaveToast } from './components/common/SaveToast';

const MainAppContent: React.FC = () => {
  const { settings, backupDataJson, students, isDemoData } = useClass();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  // Global modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [quickProfileStudent, setQuickProfileStudent] = useState<Student | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const currentTheme = THEMES[settings.themeColor] || THEMES['gentle-blue'];

  const toggleAppSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'students', label: 'Học sinh & lớp học', icon: Users },
    { id: 'stars', label: 'Cộng/trừ sao', icon: Star },
    { id: 'attendance', label: 'Điểm danh', icon: CheckSquare },
    { id: 'games', label: 'Vui học (22 trò chơi)', icon: Gamepad2 },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'scoring', label: 'Chấm điểm', icon: Award },
    { id: 'seating', label: 'Sơ đồ lớp', icon: Grid },
    { id: 'rewards', label: 'Đổi quà', icon: Gift },
    { id: 'badges', label: 'Huy hiệu', icon: Trophy },
    { id: 'love', label: 'Yêu thương', icon: Heart },
    { id: 'themes', label: 'Màu sắc', icon: Palette },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-['Nunito',sans-serif]"
      style={{
        backgroundColor:
          settings.themeColor === 'custom' && settings.customColors
            ? settings.customColors.background
            : '#f8fafc',
      }}
    >
      {/* Top Main Brand Header */}
      <header
        className={`bg-gradient-to-r ${currentTheme.headerGradient} text-white shadow-md relative z-30 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Title & Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-sm border border-white/30 shrink-0">
                🌷
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none uppercase">
                    LỚP HỌC CÔ MỊ
                  </h1>
                  <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    {settings.className}
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-white/90 tracking-wide mt-0.5">
                  BÌNH DỊ YÊU THƯƠNG
                </h2>
                <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium hidden md:flex mt-0.5">
                  <span>{settings.schoolName}</span>
                  <span>•</span>
                  <span>“{settings.slogan}”</span>
                </div>
              </div>
            </div>

            {/* Right Action Icons & PWA Install & Save Button */}
            <div className="flex items-center gap-2">
              <GlobalSaveButton variant="header" />
              <PWAInstallButton />

              <button
                type="button"
                onClick={toggleAppSound}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition md:hidden cursor-pointer"
                title="Mở menu điều hướng"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block bg-black/10 backdrop-blur-xs border-t border-white/15">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sound.playClick();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-indigo-600' : ''} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden animate-in fade-in">
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌷</span>
                  <span className="font-black text-sm text-slate-800">LỚP HỌC CÔ MỊ</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Direct Save Button */}
              <div className="pb-1">
                <GlobalSaveButton
                  variant="inline"
                  label="💾 Lưu mọi thao tác ngay"
                  className="w-full justify-center"
                />
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                        sound.playClick();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t text-[11px] text-slate-400 text-center">
              Trường Tiểu học Trần Văn Ơn • GVCN Cô Mị
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <TeacherDashboard
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              sound.playClick();
            }}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenQuickProfile={(student) => setQuickProfileStudent(student)}
            onOpenEditStudent={(student) => setStudentToEdit(student)}
            onOpenSendLove={() => setActiveTab('love')}
            onOpenAwardBadge={() => setActiveTab('badges')}
            onOpenImport={() => setIsImportOpen(true)}
            onBackup={() => {
              const jsonStr = backupDataJson();
              const blob = new Blob([jsonStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Sao_Luu_Lop_Hoc_${settings.className}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            onRestore={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenEditStudent={(student) => setStudentToEdit(student)}
            onOpenQuickProfile={(student) => setQuickProfileStudent(student)}
            onOpenImport={() => setIsImportOpen(true)}
          />
        )}

        {activeTab === 'stars' && <StarManagementView />}

        {activeTab === 'attendance' && <AttendanceView />}

        {activeTab === 'games' && <FunLearningHub />}

        {activeTab === 'reports' && <ReportAnalyticsView />}

        {activeTab === 'scoring' && <ScoringView />}

        {activeTab === 'seating' && <SeatingChartView />}

        {activeTab === 'rewards' && <RewardStoreView />}

        {activeTab === 'badges' && <BadgeGalleryView />}

        {activeTab === 'love' && <LoveCornerView />}

        {activeTab === 'themes' && <ThemeCustomizerView />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around z-30 md:hidden shadow-lg">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            sound.playClick();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <Home size={18} />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('students');
            sound.playClick();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'students' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <Users size={18} />
          <span>Học sinh</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('stars');
            sound.playClick();
          }}
          className="flex flex-col items-center -mt-5 bg-amber-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white"
        >
          <Star size={20} className="fill-white" />
        </button>

        <button
          onClick={() => {
            setActiveTab('attendance');
            sound.playClick();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'attendance' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <CheckSquare size={18} />
          <span>Điểm danh</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('games');
            sound.playClick();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'games' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <Gamepad2 size={18} />
          <span>Vui học</span>
        </button>
      </nav>

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />

      {/* Student Add / Edit Modal */}
      <StudentFormModal
        isOpen={isAddStudentOpen || !!studentToEdit}
        student={studentToEdit}
        onClose={() => {
          setIsAddStudentOpen(false);
          setStudentToEdit(null);
        }}
      />

      {/* Quick Profile Modal */}
      <StudentQuickProfileModal
        isOpen={!!quickProfileStudent}
        student={quickProfileStudent}
        onClose={() => setQuickProfileStudent(null)}
        onEditStudent={(s) => {
          setQuickProfileStudent(null);
          setStudentToEdit(s);
        }}
        onSendLove={() => {
          setQuickProfileStudent(null);
          setActiveTab('love');
        }}
        onAwardBadge={() => {
          setQuickProfileStudent(null);
          setActiveTab('badges');
        }}
      />

      {/* Import Students Modal */}
      <ImportStudentsModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Floating Save Button - Always Accessible on Screen */}
      <GlobalSaveButton variant="floating" />

      {/* Global Save Toast Notification */}
      <SaveToast />
    </div>
  );
};

export default function App() {
  return (
    <ClassProvider>
      <MainAppContent />
    </ClassProvider>
  );
}
