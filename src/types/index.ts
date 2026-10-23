export type Gender = 'male' | 'female';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export interface Student {
  id: string;
  code?: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  avatar: string;
  team: string; // e.g. "Tổ 1", "Tổ 2"
  group: string; // e.g. "Nhóm Chim Non", "Nhóm Ong Vàng"
  stars: number;
  xp: number;
  level: number;
  badges: string[]; // Badge IDs
  notes: string;
  recentAchievement?: string;
}

export interface StarTransaction {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  type: 'add' | 'subtract';
  reason: string;
  date: string; // ISO string
  teacher: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
  category?: string;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  requiredStars: number;
  description: string;
  stock?: number;
}

export type TaskCategory = 'study' | 'duty' | 'group' | 'individual' | 'experience';

export interface Task {
  id: string;
  title: string;
  assignedTo: string; // 'all' or student ID or team name
  date: string; // YYYY-MM-DD
  status: 'pending' | 'completed';
  category: TaskCategory;
}

export interface ClassCriterion {
  id: string;
  name: string;
  maxScore: number;
  icon: string;
}

export interface StudentScore {
  id: string;
  studentId: string;
  criteriaId: string;
  score: number;
  date: string;
  note?: string;
}

export interface LoveMessage {
  id: string;
  recipientType: 'student' | 'group' | 'team' | 'all';
  recipientId?: string;
  recipientName: string;
  message: string;
  emoji: string;
  sender: string;
  date: string;
}

export interface SeatingDesk {
  id: number;
  row: number;
  col: number;
  studentId1: string | null;
  studentId2: string | null;
}

export type ThemeName =
  | 'gentle-blue'
  | 'pastel-pink'
  | 'pastel-purple'
  | 'leaf-green'
  | 'warm-yellow'
  | 'warm-orange'
  | 'ocean-blue'
  | 'custom';

export interface CustomThemeColors {
  primary: string;
  secondary: string;
  background: string;
  button: string;
  text: string;
}

export interface ClassSettings {
  className: string;
  schoolName: string;
  teacherName: string;
  numberOfTeams: number;
  themeColor: ThemeName;
  customColors?: CustomThemeColors;
  academicYear: string;
  slogan: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'students'
  | 'stars'
  | 'attendance'
  | 'games'
  | 'reports'
  | 'scoring'
  | 'seating'
  | 'rewards'
  | 'badges'
  | 'love'
  | 'themes'
  | 'settings';
