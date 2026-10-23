import React, { useState } from 'react';
import {
  Grid,
  Shuffle,
  Users,
  Star,
  Layers,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student, SeatingDesk } from '../../types';
import { sound } from '../../utils/sound';
import { GlobalSaveButton } from '../common/GlobalSaveButton';

export const SeatingChartView: React.FC = () => {
  const { students, seating, updateSeating, settings } = useClass();

  const [seatingMode, setSeatingMode] = useState<'desks' | 'teams' | 'groups'>('desks');
  const [selectedSeat, setSelectedSeat] = useState<{ deskId: number; slot: 1 | 2; studentId: string | null } | null>(null);

  const studentMap = new Map<string, Student>();
  students.forEach((s) => studentMap.set(s.id, s));

  // Swap seats when clicking 2 desks
  const handleSeatClick = (deskId: number, slot: 1 | 2) => {
    const targetDesk = seating.find((d) => d.id === deskId);
    if (!targetDesk) return;

    const currentStudentId = slot === 1 ? targetDesk.studentId1 : targetDesk.studentId2;

    if (!selectedSeat) {
      // Pick first seat
      setSelectedSeat({ deskId, slot, studentId: currentStudentId });
      sound.playClick();
    } else {
      // Swap with second seat
      const newSeating = seating.map((d) => {
        let n1 = d.studentId1;
        let n2 = d.studentId2;

        if (d.id === selectedSeat.deskId) {
          if (selectedSeat.slot === 1) n1 = currentStudentId;
          else n2 = currentStudentId;
        }

        if (d.id === deskId) {
          if (slot === 1) n1 = selectedSeat.studentId;
          else n2 = selectedSeat.studentId;
        }

        return { ...d, studentId1: n1, studentId2: n2 };
      });

      updateSeating(newSeating);
      setSelectedSeat(null);
      sound.playStarDing();
    }
  };

  const availableTeams = React.useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.team).filter(Boolean)));
    if (list.length > 0) {
      return list.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
    }
    return Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`);
  }, [students, settings.numberOfTeams]);

  // Auto shuffle seating randomly
  const handleAutoShuffle = () => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const newSeating: SeatingDesk[] = [];
    const totalDesks = Math.max(16, Math.ceil(students.length / 2));
    const cols = 4;
    const rows = Math.ceil(totalDesks / cols);
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const deskNumber = r * cols + c + 1;
        if (deskNumber <= totalDesks) {
          newSeating.push({
            id: deskNumber,
            row: r,
            col: c,
            studentId1: shuffledStudents[idx]?.id || null,
            studentId2: shuffledStudents[idx + 1]?.id || null,
          });
          idx += 2;
        }
      }
    }
    updateSeating(newSeating);
    sound.playFanfare();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Grid className="text-indigo-600" size={24} />
            Sơ Đồ Lớp Học Thông Minh
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhấp 2 vị trí bất kỳ để đổi chỗ ngồi trực quan, hoặc bấm Đổi chỗ ngẫu nhiên
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 text-xs font-bold">
            <button
              onClick={() => setSeatingMode('desks')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                seatingMode === 'desks' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🪑 Sơ đồ bàn học
            </button>
            <button
              onClick={() => setSeatingMode('teams')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                seatingMode === 'teams' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              👥 Theo tổ
            </button>
            <button
              onClick={() => setSeatingMode('groups')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                seatingMode === 'groups' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🌟 Theo nhóm
            </button>
          </div>

          <button
            onClick={handleAutoShuffle}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <Shuffle size={14} /> Xáo trộn chỗ ngồi
          </button>

          <GlobalSaveButton
            variant="inline"
            label="💾 Lưu sơ đồ bàn học"
            customActionNote="Lưu vị trí chỗ ngồi sơ đồ lớp học"
          />
        </div>
      </div>

      {/* Podium / Black Board Indicator */}
      {seatingMode === 'desks' && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl p-3 text-white text-center shadow-inner max-w-lg mx-auto border-2 border-emerald-950">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200 block">
            BẢNG LỚP & BÀN GIÁO VIÊN (CÔ MỊ)
          </span>
          <span className="text-[10px] text-emerald-300">
            Hướng nhìn từ bục giảng xuống lớp học
          </span>
        </div>
      )}

      {/* Selected Seat Swapping Hint */}
      {selectedSeat && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-center text-xs font-bold text-amber-900 animate-pulse">
          Đang chọn chỗ: <strong>{studentMap.get(selectedSeat.studentId || '')?.name || 'Ghế trống'}</strong> (Bàn {selectedSeat.deskId}). Hãy nhấp vào vị trí thứ 2 để đổi chỗ!
          <button
            onClick={() => setSelectedSeat(null)}
            className="ml-3 px-2 py-0.5 bg-amber-200 rounded-lg text-amber-950 hover:bg-amber-300"
          >
            Hủy chọn
          </button>
        </div>
      )}

      {/* Main Desks Layout */}
      {seatingMode === 'desks' ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seating.map((desk) => {
              const s1 = desk.studentId1 ? studentMap.get(desk.studentId1) : null;
              const s2 = desk.studentId2 ? studentMap.get(desk.studentId2) : null;

              const isDeskSelected1 = selectedSeat?.deskId === desk.id && selectedSeat.slot === 1;
              const isDeskSelected2 = selectedSeat?.deskId === desk.id && selectedSeat.slot === 2;

              return (
                <div
                  key={desk.id}
                  className="bg-slate-50 border border-slate-200/90 rounded-3xl p-3 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200/60">
                    <span>Bàn {desk.id}</span>
                    <span className="text-[10px] text-slate-400">Dãy {desk.col + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Student 1 Slot */}
                    <div
                      onClick={() => handleSeatClick(desk.id, 1)}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center justify-between min-h-[96px] ${
                        isDeskSelected1
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                          : s1
                          ? 'bg-white border-slate-200 hover:border-indigo-400 shadow-2xs'
                          : 'bg-dashed border-slate-300 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {s1 ? (
                        <>
                          <img
                            src={s1.avatar}
                            alt={s1.name}
                            className="w-8 h-8 rounded-xl object-cover bg-slate-50 border"
                          />
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-1">
                            {s1.name}
                          </span>
                          <span className="text-[10px] text-amber-600 font-black">
                            ⭐ {s1.stars}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] my-auto text-slate-400 font-semibold">
                          + Chỗ trống
                        </span>
                      )}
                    </div>

                    {/* Student 2 Slot */}
                    <div
                      onClick={() => handleSeatClick(desk.id, 2)}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center justify-between min-h-[96px] ${
                        isDeskSelected2
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                          : s2
                          ? 'bg-white border-slate-200 hover:border-indigo-400 shadow-2xs'
                          : 'bg-dashed border-slate-300 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {s2 ? (
                        <>
                          <img
                            src={s2.avatar}
                            alt={s2.name}
                            className="w-8 h-8 rounded-xl object-cover bg-slate-50 border"
                          />
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-1">
                            {s2.name}
                          </span>
                          <span className="text-[10px] text-amber-600 font-black">
                            ⭐ {s2.stars}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] my-auto text-slate-400 font-semibold">
                          + Chỗ trống
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : seatingMode === 'teams' ? (
        /* Team view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableTeams.map((teamName) => {
            const teamMembers = students.filter((s) => s.team === teamName);
            const totalStars = teamMembers.reduce((a, s) => a + s.stars, 0);

            return (
              <div
                key={teamName}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-indigo-700">{teamName}</h3>
                  <span className="text-xs font-black text-amber-500">⭐ {totalStars} sao</span>
                </div>
                <div className="space-y-1.5">
                  {teamMembers.map((std) => (
                    <div
                      key={std.id}
                      className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-6 h-6 rounded-lg object-cover"
                        />
                        <span className="font-bold text-slate-800">{std.name}</span>
                      </div>
                      <span className="font-black text-amber-600 text-[11px]">⭐ {std.stars}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Groups view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from(new Set(students.map((s) => s.group))).filter(Boolean).map((grpName) => {
            const groupMembers = students.filter((s) => s.group === grpName);
            return (
              <div
                key={grpName}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-purple-700">{grpName}</h3>
                  <span className="text-xs text-slate-400 font-bold">{groupMembers.length} bạn</span>
                </div>
                <div className="space-y-1.5">
                  {groupMembers.map((std) => (
                    <div
                      key={std.id}
                      className="p-2 bg-purple-50/50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800">{std.name}</span>
                      <span className="font-bold text-purple-600 text-[10px]">{std.team}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
