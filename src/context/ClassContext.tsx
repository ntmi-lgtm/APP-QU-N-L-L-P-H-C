import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Student,
  StarTransaction,
  AttendanceStatus,
  Badge,
  Reward,
  Task,
  ClassSettings,
  ClassCriterion,
  StudentScore,
  LoveMessage,
  SeatingDesk,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_BADGES,
  INITIAL_REWARDS,
  INITIAL_CRITERIA,
  INITIAL_TASKS,
  INITIAL_LOVE_MESSAGES,
  INITIAL_STUDENTS,
} from '../data/initialData';
import { sound } from '../utils/sound';
import { triggerStarConfetti, triggerBigCelebration } from '../utils/confetti';

interface ClassContextType {
  students: Student[];
  transactions: StarTransaction[];
  attendances: Record<string, Record<string, AttendanceStatus>>; // date -> { studentId: status }
  todayDate: string;
  badges: Badge[];
  rewards: Reward[];
  tasks: Task[];
  settings: ClassSettings;
  criteria: ClassCriterion[];
  scores: Record<string, Record<string, number>>; // studentId -> { criteriaId: score }
  loveMessages: LoveMessage[];
  seating: SeatingDesk[];
  isDemoData: boolean;
  canUndo: boolean;
  lastUndoActionDescription: string | null;

  // Save tracking state & actions
  lastSavedTime: string;
  lastActionDescription: string;
  isSaving: boolean;
  saveToast: { id: number; message: string; subtext?: string } | null;
  saveAllNow: (customAction?: string, showNotification?: boolean) => void;
  dismissSaveToast: () => void;

  // Actions
  addStars: (studentIds: string[], amount: number, reason: string) => void;
  subtractStars: (studentIds: string[], amount: number, reason: string) => void;
  undoLastTransaction: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Partial<Student>[], resetStats?: boolean) => void;
  resetToCleanSlate: () => void;
  loadDemoDataAgain: () => void;
  setAttendance: (studentId: string, status: AttendanceStatus, date?: string) => void;
  setAllAttendancePresent: (date?: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateSettings: (updates: Partial<ClassSettings>) => void;
  addBadge: (badge: Omit<Badge, 'id'>) => void;
  updateBadge: (id: string, badge: Partial<Badge>) => void;
  deleteBadge: (id: string) => void;
  awardBadge: (studentId: string, badgeId: string) => void;
  removeBadge: (studentId: string, badgeId: string) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, reward: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (studentId: string, rewardId: string) => boolean;
  updateCriterion: (id: string, updates: Partial<ClassCriterion>) => void;
  addCriterion: (criterion: Omit<ClassCriterion, 'id'>) => void;
  deleteCriterion: (id: string) => void;
  setStudentScore: (studentId: string, criteriaId: string, score: number) => void;
  sendLoveMessage: (msg: Omit<LoveMessage, 'id' | 'date'>) => void;
  updateSeating: (newSeating: SeatingDesk[]) => void;
  backupDataJson: () => string;
  restoreDataJson: (jsonStr: string) => boolean;
  downloadSampleCsv: () => void;
  exportStudentsCsv: () => void;
  getTodayStats: () => {
    totalStarsToday: number;
    starsAddedToday: number;
    starsSubtractedToday: number;
    competitionScore: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

const STORAGE_KEYS = {
  STUDENTS: 'lophoc_comi_students_v2',
  TRANSACTIONS: 'lophoc_comi_transactions_v2',
  ATTENDANCE: 'lophoc_comi_attendance_v2',
  BADGES: 'lophoc_comi_badges_v2',
  REWARDS: 'lophoc_comi_rewards_v2',
  TASKS: 'lophoc_comi_tasks_v2',
  SETTINGS: 'lophoc_comi_settings_v2',
  CRITERIA: 'lophoc_comi_criteria_v2',
  SCORES: 'lophoc_comi_scores_v2',
  LOVE: 'lophoc_comi_love_v2',
  SEATING: 'lophoc_comi_seating_v2',
  IS_DEMO: 'lophoc_comi_is_demo_v2',
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Generate dynamic classroom desks according to student count (2 seats per desk, 4 columns)
function createDefaultSeating(studentsList: Student[]): SeatingDesk[] {
  const desks: SeatingDesk[] = [];
  const totalDesks = Math.max(16, Math.ceil(studentsList.length / 2));
  const cols = 4;
  const rows = Math.ceil(totalDesks / cols);
  let sIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const deskId = r * cols + c + 1;
      desks.push({
        id: deskId,
        row: r,
        col: c,
        studentId1: studentsList[sIndex]?.id || null,
        studentId2: studentsList[sIndex + 1]?.id || null,
      });
      sIndex += 2;
    }
  }
  return desks;
}

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayDate = new Date().toISOString().split('T')[0];

  // Helper to load localStorage with fallback
  const loadLocal = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [students, setStudents] = useState<Student[]>(() =>
    loadLocal(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );

  const [transactions, setTransactions] = useState<StarTransaction[]>(() => {
    const saved = loadLocal<StarTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    if (saved.length > 0) return saved;
    // Initial demo transactions
    return [
      {
        id: 'tx-1',
        studentId: 'std-2',
        studentName: 'Trần Thị Mai',
        amount: 2,
        type: 'add',
        reason: 'Phát biểu tốt môn Tiếng Việt',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        teacher: 'Cô Mị',
      },
      {
        id: 'tx-2',
        studentId: 'std-7',
        studentName: 'Bùi Gia Huy',
        amount: 3,
        type: 'add',
        reason: 'Trực nhật lớp sạch sẽ',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        teacher: 'Cô Mị',
      },
      {
        id: 'tx-3',
        studentId: 'std-8',
        studentName: 'Hoàng Kim Ngân',
        amount: 5,
        type: 'add',
        reason: 'Đạt điểm 10 môn Toán',
        date: new Date(Date.now() - 3600000 * 6).toISOString(),
        teacher: 'Cô Mị',
      },
      {
        id: 'tx-4',
        studentId: 'std-5',
        studentName: 'Vũ Đức Minh',
        amount: 1,
        type: 'add',
        reason: 'Có tiến bộ vượt bậc hôm nay',
        date: new Date(Date.now() - 3600000 * 8).toISOString(),
        teacher: 'Cô Mị',
      },
    ];
  });

  const [attendances, setAttendances] = useState<Record<string, Record<string, AttendanceStatus>>>(() => {
    const saved = loadLocal<Record<string, Record<string, AttendanceStatus>>>(STORAGE_KEYS.ATTENDANCE, {});
    if (!saved[todayDate]) {
      // Default initial today attendance: all present, 1 late, 1 excused
      const initialToday: Record<string, AttendanceStatus> = {};
      INITIAL_STUDENTS.forEach((s, idx) => {
        if (idx === 8) initialToday[s.id] = 'late';
        else if (idx === 14) initialToday[s.id] = 'excused';
        else initialToday[s.id] = 'present';
      });
      return { ...saved, [todayDate]: initialToday };
    }
    return saved;
  });

  const [badges, setBadges] = useState<Badge[]>(() =>
    loadLocal(STORAGE_KEYS.BADGES, INITIAL_BADGES)
  );

  const [rewards, setRewards] = useState<Reward[]>(() =>
    loadLocal(STORAGE_KEYS.REWARDS, INITIAL_REWARDS)
  );

  const [tasks, setTasks] = useState<Task[]>(() =>
    loadLocal(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );

  const [settings, setSettings] = useState<ClassSettings>(() =>
    loadLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  const [criteria, setCriteria] = useState<ClassCriterion[]>(() =>
    loadLocal(STORAGE_KEYS.CRITERIA, INITIAL_CRITERIA)
  );

  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    return loadLocal(STORAGE_KEYS.SCORES, {
      'std-1': { 'crit-1': 10, 'crit-2': 9, 'crit-3': 10, 'crit-4': 9, 'crit-5': 9 },
      'std-2': { 'crit-1': 10, 'crit-2': 10, 'crit-3': 10, 'crit-4': 10, 'crit-5': 10 },
      'std-8': { 'crit-1': 10, 'crit-2': 10, 'crit-3': 10, 'crit-4': 10, 'crit-5': 10 },
    });
  });

  const [loveMessages, setLoveMessages] = useState<LoveMessage[]>(() =>
    loadLocal(STORAGE_KEYS.LOVE, INITIAL_LOVE_MESSAGES)
  );

  const [seating, setSeating] = useState<SeatingDesk[]>(() => {
    const saved = loadLocal<SeatingDesk[]>(STORAGE_KEYS.SEATING, []);
    return saved.length > 0 ? saved : createDefaultSeating(INITIAL_STUDENTS);
  });

  const [isDemoData, setIsDemoData] = useState<boolean>(() =>
    loadLocal(STORAGE_KEYS.IS_DEMO, true)
  );

  // Undo stack
  const [undoStack, setUndoStack] = useState<{
    txId: string;
    studentId: string;
    amount: number;
    type: 'add' | 'subtract';
    description: string;
  }[]>([]);

  // Save tracking state & notification
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return (
      localStorage.getItem('lophoc_comi_last_saved') ||
      new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  });
  const [lastActionDescription, setLastActionDescription] = useState<string>('Khởi động ứng dụng');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ id: number; message: string; subtext?: string } | null>(null);

  const dismissSaveToast = useCallback(() => {
    setSaveToast(null);
  }, []);

  // Auto-dismiss save toast after 4s
  useEffect(() => {
    if (!saveToast) return;
    const timer = setTimeout(() => {
      setSaveToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [saveToast]);

  const triggerSaveNotification = useCallback((actionNote: string) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setLastActionDescription(actionNote);
    localStorage.setItem('lophoc_comi_last_saved', timeStr);
  }, []);

  // Explicit Save All Now action
  const saveAllNow = useCallback(
    (customAction?: string, showNotification = true) => {
      setIsSaving(true);
      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const actionText = customAction || lastActionDescription || 'Đã lưu toàn bộ dữ liệu lớp học';

      try {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendances));
        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
        localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
        localStorage.setItem(STORAGE_KEYS.LOVE, JSON.stringify(loveMessages));
        localStorage.setItem(STORAGE_KEYS.SEATING, JSON.stringify(seating));
        localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemoData));
        localStorage.setItem('lophoc_comi_last_saved', timeStr);

        setLastSavedTime(timeStr);
        if (customAction) {
          setLastActionDescription(customAction);
        }

        if (showNotification) {
          sound.playStarDing();
          setSaveToast({
            id: Date.now(),
            message: 'Đã lưu mọi thao tác vừa thực hiện!',
            subtext: `${actionText} • Lúc ${timeStr}`,
          });
        }
      } catch (err) {
        console.error('Lỗi khi lưu dữ liệu:', err);
      } finally {
        setTimeout(() => {
          setIsSaving(false);
        }, 300);
      }
    },
    [
      students,
      transactions,
      attendances,
      badges,
      rewards,
      tasks,
      settings,
      criteria,
      scores,
      loveMessages,
      seating,
      isDemoData,
      lastActionDescription,
    ]
  );

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOVE, JSON.stringify(loveMessages));
  }, [loveMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEATING, JSON.stringify(seating));
  }, [seating]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemoData));
  }, [isDemoData]);

  // Star Operations
  const addStars = useCallback((studentIds: string[], amount: number, reason: string) => {
    if (studentIds.length === 0 || amount <= 0) return;

    sound.playStarDing();
    triggerStarConfetti();

    const newTxs: StarTransaction[] = [];
    const timestamp = new Date().toISOString();

    setStudents((prev) =>
      prev.map((student) => {
        if (!studentIds.includes(student.id)) return student;
        const newStars = student.stars + amount;
        const newXp = student.xp + amount * 10;
        const newLevel = Math.max(1, Math.floor(newStars / 8) + 1);

        newTxs.push({
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          studentId: student.id,
          studentName: student.name,
          amount,
          type: 'add',
          reason: reason || 'Phát biểu tốt & cố gắng',
          date: timestamp,
          teacher: settings.teacherName,
        });

        return {
          ...student,
          stars: newStars,
          xp: newXp,
          level: newLevel,
          recentAchievement: reason || student.recentAchievement,
        };
      })
    );

    setTransactions((prev) => [...newTxs, ...prev]);

    // Push to undo stack
    if (newTxs.length === 1) {
      setUndoStack((prev) => [
        {
          txId: newTxs[0].id,
          studentId: newTxs[0].studentId,
          amount: newTxs[0].amount,
          type: 'add',
          description: `+${amount} sao cho ${newTxs[0].studentName}`,
        },
        ...prev.slice(0, 9),
      ]);
    }
    triggerSaveNotification(`Cộng ${amount} sao cho ${studentIds.length} học sinh`);
  }, [settings.teacherName, triggerSaveNotification]);

  const subtractStars = useCallback((studentIds: string[], amount: number, reason: string) => {
    if (studentIds.length === 0 || amount <= 0) return;

    sound.playGentleDeduct();

    const newTxs: StarTransaction[] = [];
    const timestamp = new Date().toISOString();

    setStudents((prev) =>
      prev.map((student) => {
        if (!studentIds.includes(student.id)) return student;
        const newStars = Math.max(0, student.stars - amount);
        const newLevel = Math.max(1, Math.floor(newStars / 8) + 1);

        newTxs.push({
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          studentId: student.id,
          studentName: student.name,
          amount,
          type: 'subtract',
          reason: reason || 'Chưa hoàn thành nhiệm vụ',
          date: timestamp,
          teacher: settings.teacherName,
        });

        return {
          ...student,
          stars: newStars,
          level: newLevel,
        };
      })
    );

    setTransactions((prev) => [...newTxs, ...prev]);

    if (newTxs.length === 1) {
      setUndoStack((prev) => [
        {
          txId: newTxs[0].id,
          studentId: newTxs[0].studentId,
          amount: newTxs[0].amount,
          type: 'subtract',
          description: `-${amount} sao của ${newTxs[0].studentName}`,
        },
        ...prev.slice(0, 9),
      ]);
    }
    triggerSaveNotification(`Trừ ${amount} sao của học sinh`);
  }, [settings.teacherName, triggerSaveNotification]);

  const undoLastTransaction = useCallback(() => {
    if (undoStack.length === 0) return;
    const [actionToUndo, ...remainingUndo] = undoStack;

    // Reverse the star action
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== actionToUndo.studentId) return student;
        const starDelta = actionToUndo.type === 'add' ? -actionToUndo.amount : actionToUndo.amount;
        const newStars = Math.max(0, student.stars + starDelta);
        const newXp = Math.max(0, student.xp + starDelta * 10);
        const newLevel = Math.max(1, Math.floor(newStars / 8) + 1);
        return {
          ...student,
          stars: newStars,
          xp: newXp,
          level: newLevel,
        };
      })
    );

    // Remove the transaction from log
    setTransactions((prev) => prev.filter((t) => t.id !== actionToUndo.txId));
    setUndoStack(remainingUndo);
    sound.playClick();
    triggerSaveNotification(`Hoàn tác: ${actionToUndo.description}`);
  }, [undoStack, triggerSaveNotification]);

  // Student CRUD
  const addStudent = useCallback((newStd: Omit<Student, 'id'>) => {
    const id = `std-${Date.now()}`;
    const code = newStd.code || `HS${String(students.length + 1).padStart(3, '0')}`;
    const created: Student = {
      ...newStd,
      id,
      code,
      stars: newStd.stars || 0,
      xp: newStd.xp || 0,
      level: 1,
      badges: newStd.badges || [],
      notes: newStd.notes || '',
    };
    setStudents((prev) => [...prev, created]);
    sound.playClick();
    triggerSaveNotification(`Thêm học sinh mới: ${created.name}`);
  }, [students.length, triggerSaveNotification]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    sound.playClick();
    triggerSaveNotification('Cập nhật thông tin học sinh');
  }, [triggerSaveNotification]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also remove from seating
    setSeating((prev) =>
      prev.map((desk) => ({
        ...desk,
        studentId1: desk.studentId1 === id ? null : desk.studentId1,
        studentId2: desk.studentId2 === id ? null : desk.studentId2,
      }))
    );
    sound.playClick();
    triggerSaveNotification('Xóa học sinh');
  }, [triggerSaveNotification]);

  // Import students: completely replaces current list, resets stars, updates teams and dashboard
  const importStudents = useCallback((imported: Partial<Student>[], resetStats = true) => {
    const processed: Student[] = imported.map((item, idx) => {
      const id = `std-${Date.now()}-${idx + 1}`;
      const code = item.code || `HS${String(idx + 1).padStart(3, '0')}`;
      const name = item.name || `Học sinh ${idx + 1}`;
      const gender = item.gender === 'female' ? 'female' : 'male';
      const team = item.team || `Tổ ${Math.floor(idx / 8) + 1}`;
      const group = item.group || `Nhóm ${(idx % 4) + 1}`;

      return {
        id,
        code,
        name,
        gender,
        dateOfBirth: item.dateOfBirth || '2017-01-01',
        avatar: item.avatar || (gender === 'female' ? '🌸' : '🚀'),
        team,
        group,
        stars: resetStats ? 0 : item.stars || 0,
        xp: resetStats ? 0 : item.xp || 0,
        level: 1,
        badges: resetStats ? [] : item.badges || [],
        notes: item.notes || '',
        recentAchievement: '',
      };
    });

    setStudents(processed);
    if (resetStats) {
      setTransactions([]);
      setScores({});
      setUndoStack([]);
    }

    // Auto-update number of teams based on uploaded class list
    const uploadedTeams = Array.from(new Set(processed.map((s) => s.team).filter(Boolean)));
    if (uploadedTeams.length > 0) {
      setSettings((prev) => ({
        ...prev,
        numberOfTeams: uploadedTeams.length,
      }));
    }

    setSeating(createDefaultSeating(processed));
    setIsDemoData(false);
    triggerBigCelebration();
    sound.playFanfare();
  }, []);

  // Reset to clean slate (Bắt đầu lớp học mới)
  const resetToCleanSlate = useCallback(() => {
    const cleanStudents = students.map((s) => ({
      ...s,
      stars: 0,
      xp: 0,
      level: 1,
      badges: [],
      recentAchievement: '',
    }));
    setStudents(cleanStudents);
    setTransactions([]);
    setScores({});
    setUndoStack([]);
    setIsDemoData(false);
    sound.playFanfare();
  }, [students]);

  // Load demo data again for testing
  const loadDemoDataAgain = useCallback(() => {
    setStudents(INITIAL_STUDENTS);
    setBadges(INITIAL_BADGES);
    setRewards(INITIAL_REWARDS);
    setTasks(INITIAL_TASKS);
    setSettings(INITIAL_SETTINGS);
    setCriteria(INITIAL_CRITERIA);
    setLoveMessages(INITIAL_LOVE_MESSAGES);
    setSeating(createDefaultSeating(INITIAL_STUDENTS));
    setIsDemoData(true);
    sound.playFanfare();
  }, []);

  // Attendance
  const setAttendance = useCallback((studentId: string, status: AttendanceStatus, date = todayDate) => {
    setAttendances((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [studentId]: status,
      },
    }));
    sound.playClick();
    triggerSaveNotification(`Cập nhật điểm danh ngày ${date}`);
  }, [todayDate, triggerSaveNotification]);

  const setAllAttendancePresent = useCallback((date = todayDate) => {
    const allPresent: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      allPresent[s.id] = 'present';
    });
    setAttendances((prev) => ({
      ...prev,
      [date]: allPresent,
    }));
    sound.playStarDing();
    triggerSaveNotification('Điểm danh có mặt toàn bộ lớp');
  }, [students, todayDate, triggerSaveNotification]);

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    sound.playClick();
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          sound.playStarDing();
        } else {
          sound.playClick();
        }
        return { ...t, status: nextStatus };
      })
    );
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    sound.playClick();
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sound.playClick();
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<ClassSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    sound.playClick();
    triggerSaveNotification('Lưu cài đặt lớp học');
  }, [triggerSaveNotification]);

  // Badges
  const addBadge = useCallback((badge: Omit<Badge, 'id'>) => {
    const newBadge: Badge = { ...badge, id: `badge-${Date.now()}` };
    setBadges((prev) => [...prev, newBadge]);
    sound.playClick();
  }, []);

  const updateBadge = useCallback((id: string, updates: Partial<Badge>) => {
    setBadges((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    sound.playClick();
  }, []);

  const deleteBadge = useCallback((id: string) => {
    setBadges((prev) => prev.filter((b) => b.id !== id));
    // Also remove from students
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        badges: s.badges.filter((bId) => bId !== id),
      }))
    );
    sound.playClick();
  }, []);

  const awardBadge = useCallback((studentId: string, badgeId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        if (s.badges.includes(badgeId)) return s;
        return {
          ...s,
          badges: [...s.badges, badgeId],
          recentAchievement: `Được trao huy hiệu ${badges.find((b) => b.id === badgeId)?.name || ''}`,
        };
      })
    );
    sound.playFanfare();
    triggerStarConfetti();
    triggerSaveNotification('Trao tặng huy hiệu');
  }, [badges, triggerSaveNotification]);

  const removeBadge = useCallback((studentId: string, badgeId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return { ...s, badges: s.badges.filter((b) => b !== badgeId) };
      })
    );
    sound.playClick();
  }, []);

  // Rewards
  const addReward = useCallback((reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = { ...reward, id: `rew-${Date.now()}` };
    setRewards((prev) => [...prev, newReward]);
    sound.playClick();
  }, []);

  const updateReward = useCallback((id: string, updates: Partial<Reward>) => {
    setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    sound.playClick();
  }, []);

  const deleteReward = useCallback((id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    sound.playClick();
  }, []);

  const redeemReward = useCallback((studentId: string, rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    const student = students.find((s) => s.id === studentId);
    if (!reward || !student || student.stars < reward.requiredStars) {
      sound.playGentleDeduct();
      return false;
    }

    // Deduct required stars
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          stars: s.stars - reward.requiredStars,
          recentAchievement: `Đổi phần thưởng: ${reward.name}`,
        };
      })
    );

    // Record transaction
    const newTx: StarTransaction = {
      id: `tx-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      amount: reward.requiredStars,
      type: 'subtract',
      reason: `Đổi quà: ${reward.name}`,
      date: new Date().toISOString(),
      teacher: settings.teacherName,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Decrease stock if limited
    if (reward.stock !== undefined && reward.stock > 0) {
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? { ...r, stock: (r.stock || 1) - 1 } : r))
      );
    }

    sound.playFanfare();
    triggerBigCelebration();
    triggerSaveNotification(`Đổi quà: ${reward.name}`);
    return true;
  }, [rewards, students, settings.teacherName, triggerSaveNotification]);

  // Scoring Criteria
  const updateCriterion = useCallback((id: string, updates: Partial<ClassCriterion>) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    sound.playClick();
  }, []);

  const addCriterion = useCallback((crit: Omit<ClassCriterion, 'id'>) => {
    const newCrit: ClassCriterion = { ...crit, id: `crit-${Date.now()}` };
    setCriteria((prev) => [...prev, newCrit]);
    sound.playClick();
  }, []);

  const deleteCriterion = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    sound.playClick();
  }, []);

  const setStudentScore = useCallback((studentId: string, criteriaId: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [criteriaId]: score,
      },
    }));
    sound.playClick();
    triggerSaveNotification('Chấm điểm tiêu chí rèn luyện');
  }, [triggerSaveNotification]);

  // Love messages
  const sendLoveMessage = useCallback((msg: Omit<LoveMessage, 'id' | 'date'>) => {
    const newMsg: LoveMessage = {
      ...msg,
      id: `love-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setLoveMessages((prev) => [newMsg, ...prev]);
    sound.playStarDing();
    triggerStarConfetti();
    triggerSaveNotification(`Gửi thư yêu thương đến ${msg.recipientName}`);
  }, [triggerSaveNotification]);

  // Seating
  const updateSeating = useCallback((newSeating: SeatingDesk[]) => {
    setSeating(newSeating);
    sound.playClick();
    triggerSaveNotification('Cập nhật sơ đồ chỗ ngồi');
  }, [triggerSaveNotification]);

  // Backup & Restore
  const backupDataJson = useCallback((): string => {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      students,
      transactions,
      attendances,
      badges,
      rewards,
      tasks,
      settings,
      criteria,
      scores,
      loveMessages,
      seating,
    };
    return JSON.stringify(payload, null, 2);
  }, [students, transactions, attendances, badges, rewards, tasks, settings, criteria, scores, loveMessages, seating]);

  const restoreDataJson = useCallback((jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.students || !Array.isArray(data.students)) {
        return false;
      }
      setStudents(data.students);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (data.attendances) setAttendances(data.attendances);
      if (Array.isArray(data.badges)) setBadges(data.badges);
      if (Array.isArray(data.rewards)) setRewards(data.rewards);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.criteria)) setCriteria(data.criteria);
      if (data.scores) setScores(data.scores);
      if (Array.isArray(data.loveMessages)) setLoveMessages(data.loveMessages);
      if (Array.isArray(data.seating)) setSeating(data.seating);
      setIsDemoData(false);
      sound.playFanfare();
      triggerBigCelebration();
      return true;
    } catch {
      return false;
    }
  }, []);

  // Download Sample CSV template (Đơn giản: STT, Tên học sinh, Giới tính, Tổ)
  const downloadSampleCsv = useCallback(() => {
    const headers = ['STT', 'Tên học sinh', 'Giới tính', 'Tổ'];
    const rows = [
      ['1', 'Nguyễn Văn An', 'Nam', 'Tổ 1'],
      ['2', 'Trần Thị Mai', 'Nữ', 'Tổ 1'],
      ['3', 'Lê Hoàng Long', 'Nam', 'Tổ 2'],
      ['4', 'Phạm Bảo Ngọc', 'Nữ', 'Tổ 2'],
      ['5', 'Bùi Gia Huy', 'Nam', 'Tổ 3'],
      ['6', 'Hoàng Kim Ngân', 'Nữ', 'Tổ 3'],
      ['7', 'Đoàn Quang Khải', 'Nam', 'Tổ 4'],
      ['8', 'Mai Thục Quyên', 'Nữ', 'Tổ 4'],
    ];

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mau_Nhap_Hoc_Sinh_Don_Gian_STT_Ten_GioiTinh_To_${settings.className}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings.className]);

  // Export current students to CSV
  const exportStudentsCsv = useCallback(() => {
    const headers = ['STT', 'Mã HS', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Tổ', 'Nhóm', 'Số sao', 'Cấp độ (Level)', 'Điểm kinh nghiệm (XP)', 'Ghi chú'];
    const rows = students.map((s, idx) => [
      String(idx + 1),
      s.code || `HS${String(idx + 1).padStart(3, '0')}`,
      s.name,
      s.gender === 'female' ? 'Nữ' : 'Nam',
      s.dateOfBirth,
      s.team,
      s.group,
      String(s.stars),
      String(s.level),
      String(s.xp),
      s.notes,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_Sach_${settings.className}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [students, settings.className]);

  // Today stats calculation
  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTxs = transactions.filter((t) => t.date.startsWith(today));
    const added = todayTxs.filter((t) => t.type === 'add').reduce((acc, t) => acc + t.amount, 0);
    const subbed = todayTxs.filter((t) => t.type === 'subtract').reduce((acc, t) => acc + t.amount, 0);
    const totalToday = added - subbed;
    const competitionScore = Math.max(0, 100 + totalToday * 2);
    const trend: 'up' | 'down' | 'neutral' = totalToday > 0 ? 'up' : totalToday < 0 ? 'down' : 'neutral';

    return {
      totalStarsToday: totalToday,
      starsAddedToday: added,
      starsSubtractedToday: subbed,
      competitionScore,
      trend,
    };
  }, [transactions]);

  return (
    <ClassContext.Provider
      value={{
        students,
        transactions,
        attendances,
        todayDate,
        badges,
        rewards,
        tasks,
        settings,
        criteria,
        scores,
        loveMessages,
        seating,
        isDemoData,
        canUndo: undoStack.length > 0,
        lastUndoActionDescription: undoStack[0]?.description || null,
        lastSavedTime,
        lastActionDescription,
        isSaving,
        saveToast,
        saveAllNow,
        dismissSaveToast,
        addStars,
        subtractStars,
        undoLastTransaction,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        resetToCleanSlate,
        loadDemoDataAgain,
        setAttendance,
        setAllAttendancePresent,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        updateSettings,
        addBadge,
        updateBadge,
        deleteBadge,
        awardBadge,
        removeBadge,
        addReward,
        updateReward,
        deleteReward,
        redeemReward,
        updateCriterion,
        addCriterion,
        deleteCriterion,
        setStudentScore,
        sendLoveMessage,
        updateSeating,
        backupDataJson,
        restoreDataJson,
        downloadSampleCsv,
        exportStudentsCsv,
        getTodayStats,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClass must be used within a ClassProvider');
  return context;
};
