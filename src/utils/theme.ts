import { ThemeName, CustomThemeColors } from '../types';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  previewColor: string;
  accentColor: string;
  badgeBg: string;
  cardBorder: string;
  headerGradient: string;
  navActive: string;
  buttonBg: string;
  buttonHover: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  'gentle-blue': {
    id: 'gentle-blue',
    name: 'Xanh dịu dàng',
    previewColor: '#6366f1',
    accentColor: '#4f46e5',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cardBorder: 'border-indigo-100',
    headerGradient: 'from-indigo-600 via-indigo-700 to-sky-600',
    navActive: 'bg-indigo-600 text-white shadow-md shadow-indigo-200',
    buttonBg: 'bg-indigo-600 text-white hover:bg-indigo-700',
    buttonHover: 'hover:bg-indigo-50',
  },
  'pastel-pink': {
    id: 'pastel-pink',
    name: 'Hồng pastel',
    previewColor: '#ec4899',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    cardBorder: 'border-pink-100',
    headerGradient: 'from-pink-500 via-rose-500 to-amber-400',
    navActive: 'bg-pink-600 text-white shadow-md shadow-pink-200',
    buttonBg: 'bg-pink-600 text-white hover:bg-pink-700',
    buttonHover: 'hover:bg-pink-50',
  },
  'pastel-purple': {
    id: 'pastel-purple',
    name: 'Tím pastel',
    previewColor: '#a855f7',
    accentColor: '#9333ea',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    cardBorder: 'border-purple-100',
    headerGradient: 'from-purple-600 via-violet-600 to-indigo-500',
    navActive: 'bg-purple-600 text-white shadow-md shadow-purple-200',
    buttonBg: 'bg-purple-600 text-white hover:bg-purple-700',
    buttonHover: 'hover:bg-purple-50',
  },
  'leaf-green': {
    id: 'leaf-green',
    name: 'Xanh lá tươi mát',
    previewColor: '#10b981',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cardBorder: 'border-emerald-100',
    headerGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    navActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-200',
    buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-700',
    buttonHover: 'hover:bg-emerald-50',
  },
  'warm-yellow': {
    id: 'warm-yellow',
    name: 'Vàng ấm áp',
    previewColor: '#f59e0b',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    cardBorder: 'border-amber-100',
    headerGradient: 'from-amber-500 via-yellow-500 to-orange-400',
    navActive: 'bg-amber-500 text-white shadow-md shadow-amber-200',
    buttonBg: 'bg-amber-500 text-white hover:bg-amber-600',
    buttonHover: 'hover:bg-amber-50',
  },
  'warm-orange': {
    id: 'warm-orange',
    name: 'Cam năng động',
    previewColor: '#f97316',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    cardBorder: 'border-orange-100',
    headerGradient: 'from-orange-500 via-red-500 to-rose-400',
    navActive: 'bg-orange-500 text-white shadow-md shadow-orange-200',
    buttonBg: 'bg-orange-500 text-white hover:bg-orange-600',
    buttonHover: 'hover:bg-orange-50',
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Xanh biển hiền hòa',
    previewColor: '#0284c7',
    accentColor: '#0369a1',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    cardBorder: 'border-sky-100',
    headerGradient: 'from-sky-600 via-blue-600 to-indigo-500',
    navActive: 'bg-sky-600 text-white shadow-md shadow-sky-200',
    buttonBg: 'bg-sky-600 text-white hover:bg-sky-700',
    buttonHover: 'hover:bg-sky-50',
  },
  'custom': {
    id: 'custom',
    name: 'Màu sắc tự chọn',
    previewColor: '#64748b',
    accentColor: '#475569',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    cardBorder: 'border-slate-200',
    headerGradient: 'from-slate-700 via-slate-800 to-indigo-900',
    navActive: 'bg-slate-800 text-white shadow-md',
    buttonBg: 'bg-slate-800 text-white hover:bg-slate-900',
    buttonHover: 'hover:bg-slate-100',
  },
};

export const DEFAULT_CUSTOM_COLORS: CustomThemeColors = {
  primary: '#6366f1',
  secondary: '#f43f5e',
  background: '#f8fafc',
  button: '#4f46e5',
  text: '#1e293b',
};
