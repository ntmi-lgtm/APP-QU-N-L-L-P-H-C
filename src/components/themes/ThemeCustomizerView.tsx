import React, { useState } from 'react';
import { Palette, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { THEMES, DEFAULT_CUSTOM_COLORS } from '../../utils/theme';
import { ThemeName, CustomThemeColors } from '../../types';

export const ThemeCustomizerView: React.FC = () => {
  const { settings, updateSettings } = useClass();

  const [customColors, setCustomColors] = useState<CustomThemeColors>(
    settings.customColors || DEFAULT_CUSTOM_COLORS
  );
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(
    settings.themeColor === 'custom'
  );

  const handleSelectTheme = (themeId: ThemeName) => {
    updateSettings({ themeColor: themeId });
    if (themeId === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  const handleCustomColorChange = (key: keyof CustomThemeColors, value: string) => {
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);
    updateSettings({
      themeColor: 'custom',
      customColors: updated,
    });
  };

  const handleResetDefault = () => {
    setCustomColors(DEFAULT_CUSTOM_COLORS);
    updateSettings({
      themeColor: 'gentle-blue',
      customColors: DEFAULT_CUSTOM_COLORS,
    });
    setShowCustomPicker(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Palette className="text-pink-500" size={24} />
            Bộ Sưu Tập Màu Sắc Giao Diện
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tùy biến phong cách màu sắc thân thiện, nhẹ nhàng, ấm áp phù hợp môi trường tiểu học
          </p>
        </div>

        <button
          onClick={handleResetDefault}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <RotateCcw size={14} /> Khôi phục màu mặc định
        </button>
      </div>

      {/* Preset Theme Choices */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-sm text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" /> Bảng Màu Mẫu Nhẹ Nhàng & Đáng Yêu
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeName[]).map((key) => {
            const th = THEMES[key];
            const isSelected = settings.themeColor === key;

            return (
              <div
                key={key}
                onClick={() => handleSelectTheme(key)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-md scale-102 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl shadow-inner border border-white flex items-center justify-center text-white"
                    style={{ backgroundColor: th.previewColor }}
                  >
                    {isSelected && <Check size={18} className="stroke-[3]" />}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Đang dùng
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-xs text-slate-800">{th.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: th.previewColor }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: th.accentColor }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Color Palette Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            🎨 Tùy Chỉnh Màu Sắc Riêng
          </h3>
          <button
            onClick={() => handleSelectTheme('custom')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Kích hoạt bảng màu tự chọn
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Cô giáo có thể tự tay chọn màu chính, màu phụ, màu nền, màu nút và màu chữ theo ý thích:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">1. Màu chính (Primary)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-slate-600">
                {customColors.primary}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">2. Màu phụ (Secondary)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-slate-600">
                {customColors.secondary}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">3. Màu nền (Background)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.background}
                onChange={(e) => handleCustomColorChange('background', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-slate-600">
                {customColors.background}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">4. Màu nút bấm (Button)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.button}
                onChange={(e) => handleCustomColorChange('button', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-slate-600">
                {customColors.button}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">5. Màu chữ (Text)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.text}
                onChange={(e) => handleCustomColorChange('text', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-slate-600">
                {customColors.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
