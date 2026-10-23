import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
  Star,
  Gift,
  Heart,
  Volume2,
  VolumeX,
  Timer,
  RotateCw,
  Shuffle,
  ShieldCheck,
  Smartphone,
  Download,
  RotateCcw,
  BarChart2,
  Award,
  Mic,
  MicOff,
  Flame,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student } from '../../types';
import { sound } from '../../utils/sound';
import { triggerBigCelebration, triggerStarConfetti } from '../../utils/confetti';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';

type GameMode =
  | 'overview'
  | 'wheel' // 1. Vòng quay
  | 'blindbag' // 2. Túi mù
  | 'love' // 3. Góc yêu thương
  | 'memory' // 4. Lật thẻ
  | 'duckrace' // 5. Đua vịt
  | 'beerace' // 6. Đua ong
  | 'randompicker' // 7. Chọn ngẫu nhiên
  | 'groupsplitter' // 8. Chia nhóm
  | 'xpsystem' // 9. XP
  | 'levelsystem' // 10. Level
  | 'badges' // 11. Huy hiệu
  | 'top10' // 12. TOP 10
  | 'rewards' // 13. Phần thưởng
  | 'stats' // 14. Thống kê
  | 'puzzle' // 15. Mảnh ghép
  | 'lottery' // 16. Xổ số
  | 'backup' // 17. Sao lưu
  | 'restore' // 18. Khôi phục
  | 'offline' // 19. Offline
  | 'pwa' // 20. PWA
  | 'soundmeter' // 21. Đo tiếng ồn
  | 'timer'; // 22. Bấm thời gian

export const FunLearningHub: React.FC = () => {
  const {
    students,
    addStars,
    backupDataJson,
    restoreDataJson,
    badges,
    rewards,
    settings,
  } = useClass();

  const [activeMode, setActiveMode] = useState<GameMode>('overview');

  // PWA & Online
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // ----------------------------------------------------------------------
  // 1. VÒNG QUAY MAY MẮN (Canvas Interactive Spin Wheel)
  // ----------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = Math.min(12, Math.max(4, students.length));
    const items = students.slice(0, count);
    const radius = canvas.width / 2;
    const arc = (2 * Math.PI) / count;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = [
      '#f43f5e', '#ec4899', '#a855f7', '#6366f1',
      '#3b82f6', '#06b6d4', '#10b981', '#84cc16',
      '#eab308', '#f97316', '#f43f5e', '#8b5cf6'
    ];

    items.forEach((std, i) => {
      const sliceAngle = angle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 8, sliceAngle, sliceAngle + arc);
      ctx.lineTo(radius, radius);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(sliceAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Nunito, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.fillText(std.name.split(' ').slice(-2).join(' '), radius - 20, 5);
      ctx.restore();
    });

    // Center hub
    ctx.beginPath();
    ctx.arc(radius, radius, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', radius, radius);
  };

  useEffect(() => {
    if (activeMode === 'wheel') {
      drawWheel(rotationAngle);
    }
  }, [activeMode, rotationAngle, students]);

  const spinWheel = () => {
    if (isSpinning || students.length === 0) return;
    setIsSpinning(true);
    setWheelWinner(null);
    sound.playClick();

    const count = Math.min(12, Math.max(4, students.length));
    const randomRounds = 5 + Math.random() * 5;
    const randomExtra = Math.random() * 2 * Math.PI;
    const targetAngle = rotationAngle + randomRounds * 2 * Math.PI + randomExtra;

    const start = performance.now();
    const duration = 4000;
    const initialAngle = rotationAngle;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const cur = initialAngle + (targetAngle - initialAngle) * ease;
      setRotationAngle(cur);
      drawWheel(cur);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate winner
        const arc = (2 * Math.PI) / count;
        // Pointer is at right 0 rad (or top 3*PI/2)
        const normalized = (2 * Math.PI - (cur % (2 * Math.PI))) % (2 * Math.PI);
        const index = Math.floor(normalized / arc) % count;
        const winner = students[index];
        if (winner) {
          setWheelWinner(winner.name);
          addStars([winner.id], 2, 'May mắn trúng thưởng Vòng Quay');
          triggerBigCelebration();
          sound.playFanfare();
        }
      }
    };
    requestAnimationFrame(animate);
  };

  // ----------------------------------------------------------------------
  // 2. TÚI MÙ (Blind Bag Unpacker)
  // ----------------------------------------------------------------------
  const [openedBags, setOpenedBags] = useState<number[]>([]);
  const [bagGifts] = useState([
    { id: 1, name: 'Bộ Sticker Bé Ngoan', stars: 2, icon: '🌸' },
    { id: 2, name: 'Quyền Chọn Bài Hát', stars: 1, icon: '🎵' },
    { id: 3, name: 'Huy Hiệu Ngôi Sao', stars: 3, icon: '🌟' },
    { id: 4, name: 'Kẹo Ngọt Tình Bạn', stars: 1, icon: '🍬' },
    { id: 5, name: 'Bút Chì Bảy Màu', stars: 2, icon: '✏️' },
    { id: 6, name: 'Lời Khen Đặc Biệt', stars: 2, icon: '💌' },
  ]);

  const handleOpenBag = (idx: number) => {
    if (openedBags.includes(idx)) return;
    setOpenedBags([...openedBags, idx]);
    sound.playStarDing();
    triggerStarConfetti();
  };

  // ----------------------------------------------------------------------
  // 4. LẬT THẺ VUI HỌC (Memory Cards)
  // ----------------------------------------------------------------------
  const [cards, setCards] = useState<{ id: number; symbol: string; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);

  const initMemoryGame = () => {
    const symbols = ['⭐', '📚', '✏️', '🎨', '🏆', '💗'];
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((sym, id) => ({ id, symbol: sym, matched: false }));
    setCards(deck);
    setFlipped([]);
    sound.playClick();
  };

  const handleFlipCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || cards[index].matched) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    sound.playClick();

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        sound.playStarDing();
        setCards((prev) =>
          prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c))
        );
        setFlipped([]);
        triggerStarConfetti();
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // ----------------------------------------------------------------------
  // 5. ĐUA VỊT (Duck Race)
  // ----------------------------------------------------------------------
  const [duckPositions, setDuckPositions] = useState<number[]>([0, 0, 0, 0]);
  const [isDuckRacing, setIsDuckRacing] = useState(false);
  const [duckWinner, setDuckWinner] = useState<number | null>(null);

  const startDuckRace = () => {
    if (isDuckRacing) return;
    setIsDuckRacing(true);
    setDuckPositions([0, 0, 0, 0]);
    setDuckWinner(null);
    sound.playFunBoing();

    const interval = setInterval(() => {
      setDuckPositions((prev) => {
        const next = prev.map((pos) => pos + Math.random() * 14 + 2);
        const winIdx = next.findIndex((p) => p >= 100);
        if (winIdx !== -1) {
          clearInterval(interval);
          setIsDuckRacing(false);
          setDuckWinner(winIdx + 1);
          sound.playFanfare();
          triggerBigCelebration();
          return next;
        }
        return next;
      });
    }, 150);
  };

  // ----------------------------------------------------------------------
  // 6. ĐUA ONG CHĂM CHỈ (Bee Race)
  // ----------------------------------------------------------------------
  const [beePositions, setBeePositions] = useState<number[]>([0, 0, 0, 0]);
  const [isBeeRacing, setIsBeeRacing] = useState(false);
  const [beeWinner, setBeeWinner] = useState<number | null>(null);

  const startBeeRace = () => {
    if (isBeeRacing) return;
    setIsBeeRacing(true);
    setBeePositions([0, 0, 0, 0]);
    setBeeWinner(null);
    sound.playFunBoing();

    const interval = setInterval(() => {
      setBeePositions((prev) => {
        const next = prev.map((pos) => pos + Math.random() * 12 + 3);
        const winIdx = next.findIndex((p) => p >= 100);
        if (winIdx !== -1) {
          clearInterval(interval);
          setIsBeeRacing(false);
          setBeeWinner(winIdx + 1);
          sound.playFanfare();
          triggerBigCelebration();
          return next;
        }
        return next;
      });
    }, 150);
  };

  // ----------------------------------------------------------------------
  // 7. CHỌN NGẪU NHIÊN (Random Spotlight)
  // ----------------------------------------------------------------------
  const [spotlightStudent, setSpotlightStudent] = useState<Student | null>(null);
  const [isPickingRandom, setIsPickingRandom] = useState(false);

  const pickRandomStudent = () => {
    if (students.length === 0 || isPickingRandom) return;
    setIsPickingRandom(true);
    sound.playClick();

    let counter = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * students.length);
      setSpotlightStudent(students[randIdx]);
      sound.playClick();
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        setIsPickingRandom(false);
        sound.playFanfare();
        triggerStarConfetti();
      }
    }, 100);
  };

  // ----------------------------------------------------------------------
  // 8. CHIA NHÓM TỰ ĐỘNG (Group Splitter)
  // ----------------------------------------------------------------------
  const [groupCount, setGroupCount] = useState<number>(4);
  const [generatedGroups, setGeneratedGroups] = useState<Student[][]>([]);

  const handleSplitGroups = () => {
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const result: Student[][] = Array.from({ length: groupCount }, () => []);
    shuffled.forEach((std, i) => {
      result[i % groupCount].push(std);
    });
    setGeneratedGroups(result);
    sound.playFanfare();
  };

  // ----------------------------------------------------------------------
  // 15. MẢNH GHÉP KỲ DIỆU (Class Puzzle)
  // ----------------------------------------------------------------------
  const [unlockedPieces, setUnlockedPieces] = useState<number>(6); // Out of 9 pieces

  const handleUnlockPiece = () => {
    if (unlockedPieces < 9) {
      setUnlockedPieces((prev) => prev + 1);
      sound.playStarDing();
      triggerStarConfetti();
    }
  };

  // ----------------------------------------------------------------------
  // 16. XỔ SỐ VUI NHỘN (Lucky Draw / Lottery)
  // ----------------------------------------------------------------------
  const [lotteryNumber, setLotteryNumber] = useState<number | null>(null);
  const [isDrawingLottery, setIsDrawingLottery] = useState(false);

  const drawLottery = () => {
    if (isDrawingLottery) return;
    setIsDrawingLottery(true);
    let count = 0;
    const interval = setInterval(() => {
      setLotteryNumber(Math.floor(Math.random() * students.length) + 1);
      sound.playClick();
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsDrawingLottery(false);
        sound.playFanfare();
        triggerBigCelebration();
      }
    }, 80);
  };

  // ----------------------------------------------------------------------
  // 21. ĐO TIẾNG ỒN LỚP HỌC (Noise Meter)
  // ----------------------------------------------------------------------
  const [noiseLevel, setNoiseLevel] = useState<number>(35);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const micIntervalRef = useRef<number | null>(null);

  const toggleSoundMeter = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
    } else {
      setIsListeningMic(true);
      // Realistic simulated audio monitoring with decibel spikes
      micIntervalRef.current = window.setInterval(() => {
        const delta = (Math.random() - 0.48) * 12;
        setNoiseLevel((prev) => {
          const next = Math.max(20, Math.min(95, Math.round(prev + delta)));
          if (next > 75) {
            sound.playGentleDeduct(); // alert beep if too noisy
          }
          return next;
        });
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
    };
  }, []);

  // ----------------------------------------------------------------------
  // 22. BẤM GIỜ ĐỒNG HỒ CÁT (Timer)
  // ----------------------------------------------------------------------
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 mins
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            sound.playTimerBell();
            triggerBigCelebration();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  // ----------------------------------------------------------------------
  // 22 Fun Learning Games Directory
  // ----------------------------------------------------------------------
  const gamesList: { id: GameMode; num: number; icon: string; name: string; desc: string; color: string }[] = [
    { id: 'wheel', num: 1, icon: '🎡', name: 'Vòng quay may mắn', desc: 'Quay chọn bạn phát biểu hoặc nhận quà', color: 'from-pink-500 to-rose-500' },
    { id: 'blindbag', num: 2, icon: '🎁', name: 'Túi mù bí ẩn', desc: 'Bốc quà bất ngờ khi đạt thành tích tốt', color: 'from-amber-500 to-orange-500' },
    { id: 'love', num: 3, icon: '💗', name: 'Góc yêu thương', desc: 'Tường trái tim gửi gắm tình cảm', color: 'from-pink-500 to-purple-500' },
    { id: 'memory', num: 4, icon: '🃏', name: 'Lật thẻ vui học', desc: 'Trò chơi rèn luyện trí nhớ nhanh nhẹn', color: 'from-purple-500 to-indigo-500' },
    { id: 'duckrace', num: 5, icon: '🦆', name: 'Đua vịt về đích', desc: 'Đua vịt hồi hộp chọn tổ dẫn đầu', color: 'from-yellow-400 to-amber-500' },
    { id: 'beerace', num: 6, icon: '🐝', name: 'Đua ong chăm chỉ', desc: 'Thi đua làm bài tập và nhiệm vụ', color: 'from-amber-500 to-yellow-600' },
    { id: 'randompicker', num: 7, icon: '🎯', name: 'Chọn ngẫu nhiên', desc: 'Sân khấu chọn bạn bất ngờ', color: 'from-red-500 to-pink-600' },
    { id: 'groupsplitter', num: 8, icon: '👥', name: 'Chia nhóm tự động', desc: 'Tự động tạo 2, 3, 4, 5 nhóm công bằng', color: 'from-teal-500 to-emerald-600' },
    { id: 'xpsystem', num: 9, icon: '⭐', name: 'Hệ thống XP', desc: 'Tích lũy điểm kinh nghiệm học tập', color: 'from-yellow-500 to-amber-600' },
    { id: 'levelsystem', num: 10, icon: '🆙', name: 'Cấp độ Level', desc: 'Nâng cấp hiệp sĩ tri thức tiểu học', color: 'from-blue-500 to-indigo-600' },
    { id: 'badges', num: 11, icon: '🏅', name: 'Huy hiệu danh dự', desc: 'Kho huy hiệu vinh danh phong phú', color: 'from-purple-600 to-pink-500' },
    { id: 'top10', num: 12, icon: '🏆', name: 'TOP 10 tuần', desc: 'Bảng vàng vinh danh xuất sắc', color: 'from-amber-400 to-yellow-500' },
    { id: 'rewards', num: 13, icon: '🎁', name: 'Cửa hàng quà', desc: 'Đổi sao lấy sticker, bút chì', color: 'from-emerald-500 to-teal-600' },
    { id: 'stats', num: 14, icon: '📊', name: 'Thống kê vui học', desc: 'Biểu đồ hoạt động và chuyên cần', color: 'from-sky-500 to-blue-600' },
    { id: 'puzzle', num: 15, icon: '🧩', name: 'Mảnh ghép kỳ diệu', desc: 'Cả lớp chung sức mở khóa tranh', color: 'from-indigo-500 to-purple-600' },
    { id: 'lottery', num: 16, icon: '🎰', name: 'Xổ số vui nhộn', desc: 'Vòng quay số ngẫu nhiên may mắn', color: 'from-rose-500 to-pink-500' },
    { id: 'backup', num: 17, icon: '💾', name: 'Sao lưu dữ liệu', desc: 'Xuất file JSON an toàn trên máy', color: 'from-slate-700 to-slate-900' },
    { id: 'restore', num: 18, icon: '♻️', name: 'Khôi phục dữ liệu', desc: 'Nhập lại dữ liệu lớp khi cần', color: 'from-slate-600 to-slate-800' },
    { id: 'offline', num: 19, icon: '📴', name: 'Offline hoàn toàn', desc: 'Kiểm tra hoạt động khi mất mạng', color: 'from-emerald-600 to-teal-700' },
    { id: 'pwa', num: 20, icon: '📱', name: 'Cài đặt PWA', desc: 'Hướng dẫn cài app lên thiết bị', color: 'from-blue-600 to-indigo-700' },
    { id: 'soundmeter', num: 21, icon: '🔊', name: 'Đo tiếng ồn lớp', desc: 'Giữ trật tự giờ học tự giác', color: 'from-purple-500 to-violet-600' },
    { id: 'timer', num: 22, icon: '⏱️', name: 'Đồng hồ bấm giờ', desc: 'Đếm ngược thi làm bài, thảo luận', color: 'from-teal-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 className="text-purple-600" size={24} />
            Khu Vực Trò Chơi Vui Học & Tiện Ích Lớp Học
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trọn bộ 22 công cụ & trò chơi giúp tiết học sinh động, hào hứng, kết nối yêu thương
          </p>
        </div>

        {activeMode !== 'overview' && (
          <button
            onClick={() => setActiveMode('overview')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer self-start"
          >
            ← Quay lại danh sách 22 trò chơi
          </button>
        )}
      </div>

      {/* Overview Grid with 22 games */}
      {activeMode === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gamesList.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setActiveMode(g.id);
                sound.playClick();
                if (g.id === 'memory') initMemoryGame();
              }}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-purple-300 rounded-3xl shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl p-2 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                    {g.icon}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    #{g.num}
                  </span>
                </div>
                <h3 className="font-black text-xs text-slate-800 group-hover:text-purple-600 transition mb-1">
                  {g.name}
                </h3>
                <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{g.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
                <span>Khám phá</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. VÒNG QUAY MAY MẮN */}
      {/* ========================================================= */}
      {activeMode === 'wheel' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🎡 VÒNG QUAY MAY MẮN
          </h3>
          <p className="text-xs text-slate-500">
            Quay số ngẫu nhiên gọi học sinh lên bảng phát biểu hoặc trao phần quà bất ngờ
          </p>

          <div className="relative inline-block my-4">
            {/* Top Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 drop-shadow-md" />
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="rounded-full shadow-2xl mx-auto"
            />
          </div>

          <div>
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-200 transition cursor-pointer"
            >
              {isSpinning ? 'Đang quay...' : 'BẮT ĐẦU QUAY 🎡'}
            </button>
          </div>

          {wheelWinner && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl max-w-sm mx-auto animate-in zoom-in-95">
              <span className="text-xs font-bold text-amber-700 block uppercase">
                🎉 Chúc mừng bạn may mắn
              </span>
              <h4 className="text-xl font-black text-amber-900 mt-1">{wheelWinner}</h4>
              <span className="text-xs font-extrabold text-amber-600 block mt-1">
                +2 ⭐ sao thi đua được cộng vào tài khoản!
              </span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TÚI MÙ (Blind Bags) */}
      {/* ========================================================= */}
      {activeMode === 'blindbag' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🎁 TÚI MÙ BÍ ẨN CỦA CÔ MỊ
          </h3>
          <p className="text-xs text-slate-500">
            Hãy nhấp vào từng túi mù để bốc phần quà bí mật cho học sinh có sự tiến bộ hôm nay
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4">
            {bagGifts.map((bag, i) => {
              const isOpened = openedBags.includes(i);
              return (
                <div
                  key={bag.id}
                  onClick={() => handleOpenBag(i)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                    isOpened
                      ? 'bg-amber-50 border-amber-300 shadow-sm animate-in zoom-in-95'
                      : 'bg-gradient-to-br from-pink-500 to-rose-500 border-white text-white shadow-md hover:scale-105'
                  }`}
                >
                  {isOpened ? (
                    <>
                      <span className="text-4xl mb-2">{bag.icon}</span>
                      <span className="font-black text-xs text-slate-800">{bag.name}</span>
                      <span className="text-[11px] font-bold text-amber-600 mt-1">
                        + {bag.stars} ⭐ sao
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl mb-2 animate-bounce">🎁</span>
                      <span className="font-black text-xs">Túi số {i + 1}</span>
                      <span className="text-[10px] text-white/80 mt-1">Chạm để mở</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setOpenedBags([])}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Đóng lại toàn bộ túi mù
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. LẬT THẺ VUI HỌC (Memory Cards) */}
      {/* ========================================================= */}
      {activeMode === 'memory' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🃏 LẬT THẺ TÌM CẶP HÌNH ĐÔI
          </h3>
          <p className="text-xs text-slate-500">
            Rèn luyện khả năng quan sát và ghi nhớ của các bé tiểu học
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto pt-2">
            {cards.map((c, i) => {
              const isOpen = flipped.includes(i) || c.matched;
              return (
                <div
                  key={c.id}
                  onClick={() => handleFlipCard(i)}
                  className={`w-20 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all border-2 ${
                    isOpen
                      ? 'bg-amber-100 border-amber-400 rotate-0 scale-102'
                      : 'bg-indigo-600 border-indigo-700 text-white shadow-sm hover:bg-indigo-700'
                  }`}
                >
                  {isOpen ? c.symbol : '❓'}
                </div>
              );
            })}
          </div>

          <div>
            <button
              onClick={initMemoryGame}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Chơi ván mới 🔄
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. ĐUA VỊT VỀ ĐÍCH */}
      {/* ========================================================= */}
      {activeMode === 'duckrace' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
              🦆 ĐUA VỊT VỀ ĐÍCH THI ĐUA
            </h3>
            <p className="text-xs text-slate-500">
              Mỗi chú vịt đại diện cho 1 tổ thi đua. Xem chú vịt nào bơi về đích nhanh nhất!
            </p>
          </div>

          <div className="space-y-3 max-w-xl mx-auto bg-sky-50 border-2 border-sky-200 p-4 rounded-3xl">
            {[1, 2, 3, 4].map((teamNum, idx) => (
              <div key={teamNum} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Tổ {teamNum}</span>
                  <span>{Math.round(Math.min(100, duckPositions[idx]))}%</span>
                </div>
                <div className="w-full bg-white h-9 rounded-2xl border border-sky-200 relative overflow-hidden flex items-center">
                  <div
                    className="absolute transition-all duration-150 text-2xl"
                    style={{ left: `calc(${Math.min(90, duckPositions[idx])}% )` }}
                  >
                    🦆
                  </div>
                  <div className="absolute right-3 text-xs font-bold text-rose-500">
                    🏁 ĐÍCH
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={startDuckRace}
              disabled={isDuckRacing}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isDuckRacing ? 'Đang bơi...' : 'BẮT ĐẦU ĐUA VỊT 🦆'}
            </button>
          </div>

          {duckWinner && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl max-w-xs mx-auto text-center animate-in zoom-in-95">
              <span className="text-xs font-bold text-emerald-700 uppercase">🏆 VÔ ĐỊCH</span>
              <h4 className="text-lg font-black text-emerald-900 mt-1">
                Chúc mừng Tổ {duckWinner} đã về đích đầu tiên!
              </h4>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ĐUA ONG CHĂM CHỈ */}
      {/* ========================================================= */}
      {activeMode === 'beerace' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
              🐝 ĐUA ONG CHĂM CHỈ TÌM HOA
            </h3>
            <p className="text-xs text-slate-500">
              Đàn ong chăm chỉ đua nhau bay về vườn hoa tri thức
            </p>
          </div>

          <div className="space-y-3 max-w-xl mx-auto bg-amber-50 border-2 border-amber-200 p-4 rounded-3xl">
            {[1, 2, 3, 4].map((teamNum, idx) => (
              <div key={teamNum} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Ong Tổ {teamNum}</span>
                  <span>{Math.round(Math.min(100, beePositions[idx]))}%</span>
                </div>
                <div className="w-full bg-white h-9 rounded-2xl border border-amber-200 relative overflow-hidden flex items-center">
                  <div
                    className="absolute transition-all duration-150 text-2xl"
                    style={{ left: `calc(${Math.min(90, beePositions[idx])}% )` }}
                  >
                    🐝
                  </div>
                  <div className="absolute right-3 text-xs font-bold text-pink-500">
                    🌸 HOA
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={startBeeRace}
              disabled={isBeeRacing}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isBeeRacing ? 'Đang bay...' : 'BẮT ĐẦU ĐUA ONG 🐝'}
            </button>
          </div>

          {beeWinner && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl max-w-xs mx-auto text-center animate-in zoom-in-95">
              <span className="text-xs font-bold text-emerald-700 uppercase">🏆 ONG CHĂM CHỈ NHẤT</span>
              <h4 className="text-lg font-black text-emerald-900 mt-1">
                Chúc mừng Ong Tổ {beeWinner}!
              </h4>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. CHỌN NGẪU NHIÊN (Random Spotlight) */}
      {/* ========================================================= */}
      {activeMode === 'randompicker' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🎯 SÂN KHẤU CHỌN HỌC SINH NGẪU NHIÊN
          </h3>
          <p className="text-xs text-slate-500">
            Hồi hộp chọn ngẫu nhiên 1 bạn may mắn lên bảng hoặc làm đội trưởng
          </p>

          <div className="w-48 h-56 mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-4 flex flex-col items-center justify-center shadow-inner">
            {spotlightStudent ? (
              <>
                <img
                  src={spotlightStudent.avatar}
                  alt={spotlightStudent.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-white border-2 border-indigo-300 p-1 mb-2 shadow-sm"
                />
                <h4 className="font-black text-sm text-slate-800 line-clamp-1">
                  {spotlightStudent.name}
                </h4>
                <span className="text-xs font-bold text-indigo-600 mt-0.5">
                  {spotlightStudent.team} • ⭐ {spotlightStudent.stars}
                </span>
              </>
            ) : (
              <span className="text-4xl text-slate-300">❓</span>
            )}
          </div>

          <div>
            <button
              onClick={pickRandomStudent}
              disabled={isPickingRandom}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isPickingRandom ? 'Đang chọn...' : 'BẤM CHỌN NGAY 🎯'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. CHIA NHÓM TỰ ĐỘNG (Group Splitter) */}
      {/* ========================================================= */}
      {activeMode === 'groupsplitter' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
              👥 CHIA NHÓM HỌC TẬP TỰ ĐỘNG
            </h3>
            <p className="text-xs text-slate-500">
              Chia đều sĩ số lớp vào các nhóm ngẫu nhiên, công bằng và nhanh chóng
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-700">Số lượng nhóm cần chia:</span>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setGroupCount(num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    groupCount === num
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num} nhóm
                </button>
              ))}
            </div>
            <button
              onClick={handleSplitGroups}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition cursor-pointer"
            >
              Chia nhóm ngay 🎲
            </button>
          </div>

          {generatedGroups.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {generatedGroups.map((grp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-indigo-700 border-b pb-1">
                    Nhóm {idx + 1} ({grp.length} bạn)
                  </h4>
                  <ul className="text-xs space-y-1">
                    {grp.map((s) => (
                      <li key={s.id} className="text-slate-700 font-medium truncate">
                        • {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 15. MẢNH GHÉP KỲ DIỆU (Puzzle) */}
      {/* ========================================================= */}
      {activeMode === 'puzzle' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🧩 MẢNH GHÉP KỲ DIỆU CẢ LỚP
          </h3>
          <p className="text-xs text-slate-500">
            Mỗi khi cả lớp làm việc tốt hoặc đạt mục tiêu, cô mở khóa 1 mảnh ghép để lộ bức tranh hoàn chỉnh!
          </p>

          <div className="grid grid-cols-3 gap-2 w-64 h-64 mx-auto p-2 bg-slate-100 rounded-3xl border-2 border-indigo-200 shadow-inner">
            {Array.from({ length: 9 }).map((_, i) => {
              const isUnlocked = i < unlockedPieces;
              return (
                <div
                  key={i}
                  className={`rounded-2xl flex items-center justify-center text-2xl font-bold transition-all border ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-pink-500 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 border-dashed'
                  }`}
                >
                  {isUnlocked ? '🌟' : '🔒'}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleUnlockPiece}
              disabled={unlockedPieces >= 9}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-xl transition cursor-pointer"
            >
              + Mở khóa thêm 1 mảnh ghép ({unlockedPieces}/9)
            </button>
            <button
              onClick={() => setUnlockedPieces(0)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 16. XỔ SỐ VUI NHỘN (Lottery) */}
      {/* ========================================================= */}
      {activeMode === 'lottery' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🎰 XỔ SỐ HỌC TẬP MAY MẮN
          </h3>
          <p className="text-xs text-slate-500">
            Quay số trúng thưởng ngẫu nhiên theo số thứ tự của học sinh trong sổ điểm
          </p>

          <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg">
            <span className="text-5xl font-black font-mono tracking-wider">
              {lotteryNumber !== null ? String(lotteryNumber).padStart(2, '0') : '00'}
            </span>
          </div>

          <div>
            <button
              onClick={drawLottery}
              disabled={isDrawingLottery}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isDrawingLottery ? 'Đang quay...' : 'QUAY XỔ SỐ 🎰'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 21. ĐO TIẾNG ỒN LỚP HỌC (Sound Meter) */}
      {/* ========================================================= */}
      {activeMode === 'soundmeter' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            🔊 MÁY ĐO TIẾNG ỒN LỚP HỌC THÔNG MINH
          </h3>
          <p className="text-xs text-slate-500">
            Giúp các bé nhận thức âm lượng trong lớp: Giờ tự học &lt; 45dB, Giờ thảo luận &lt; 65dB
          </p>

          <div className="max-w-md mx-auto p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Mức ồn hiện tại</span>
              <span
                className={`text-2xl font-black ${
                  noiseLevel > 70
                    ? 'text-rose-600 animate-pulse'
                    : noiseLevel > 50
                    ? 'text-amber-500'
                    : 'text-emerald-600'
                }`}
              >
                {noiseLevel} dB
              </span>
            </div>

            {/* Noise Gauge Bar */}
            <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden p-1 flex items-center">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  noiseLevel > 70
                    ? 'bg-rose-500'
                    : noiseLevel > 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, noiseLevel)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Yên tĩnh (0-40dB)</span>
              <span>Thảo luận (40-65dB)</span>
              <span>Quá ồn (&gt;70dB)</span>
            </div>

            <p className="text-xs font-bold text-slate-700">
              {noiseLevel > 70
                ? '⚠️ Lớp học hơi ồn rồi, các con giữ trật tự nhé!'
                : noiseLevel > 50
                ? '💬 Giọng thảo luận vừa phải, rất tốt!'
                : '🌿 Lớp học rất yên tĩnh và tập trung!'}
            </p>
          </div>

          <div>
            <button
              onClick={toggleSoundMeter}
              className={`flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-md ${
                isListeningMic ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isListeningMic ? (
                <>
                  <MicOff size={15} /> Dừng theo dõi tiếng ồn
                </>
              ) : (
                <>
                  <Mic size={15} /> Bật máy theo dõi tiếng ồn 🔊
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 22. ĐỒNG HỒ BẤM GIỜ (Timer) */}
      {/* ========================================================= */}
      {activeMode === 'timer' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
            ⏱️ ĐỒNG HỒ ĐẾM NGƯỢC THI ĐUA
          </h3>
          <p className="text-xs text-slate-500">
            Dành cho các hoạt động thi làm bài tập nhanh, trò chơi nhóm, trả lời câu hỏi
          </p>

          {/* Big Digital Clock */}
          <div className="w-56 h-36 mx-auto bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-xl border-4 border-teal-500">
            <span className="text-5xl font-mono font-black tracking-widest text-teal-300">
              {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
              {String(timerSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Preset Interval Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[60, 180, 300, 600, 900].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setTimerSeconds(sec);
                  setTimerActive(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  timerSeconds === sec
                    ? 'bg-teal-600 text-white border-teal-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sec / 60} phút
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-md transition cursor-pointer ${
                timerActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {timerActive ? 'Tạm dừng ⏸️' : 'Bắt đầu đếm ngược ▶️'}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setTimerSeconds(300);
              }}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9, 10, 11, 12, 13, 14, 17, 18, 19, 20 Fallback Views */}
      {/* ========================================================= */}
      {activeMode === 'top10' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h3 className="text-lg font-black text-slate-800 text-center flex items-center justify-center gap-2">
            🏆 BẢNG VÀNG TOP 10 HỌC SINH XUẤT SẮC
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto">
            {[...students].sort((a, b) => b.stars - a.stars).slice(0, 10).map((std, idx) => (
              <div key={std.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-xl object-cover bg-white" />
                  <span className="font-extrabold text-xs text-slate-800">{std.name}</span>
                </div>
                <span className="font-black text-amber-600 text-xs">⭐ {std.stars}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMode === 'xpsystem' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800">⭐ HỆ THỐNG ĐIỂM KINH NGHIỆM XP</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Mỗi 1 sao = 10 điểm XP. Học sinh tích lũy XP qua việc phát biểu, trực nhật, hoàn thành bài tập để nâng cấp Level Hiệp Sĩ Tri Thức!
          </p>
        </div>
      )}

      {activeMode === 'offline' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800">📴 TRẠNG THÁI OFFLINE HOÀN TOÀN</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Ứng dụng được thiết kế theo kiến trúc Offline-first. Mọi dữ liệu về sao, điểm danh, hồ sơ học sinh đều được lưu trực tiếp trên thiết bị của cô giáo an toàn và không lo mất kết nối Internet!
          </p>
          <div className="inline-block p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold text-xs">
            ✓ Trạng thái kết nối hiện tại: {isOnline ? 'Đang trực tuyến' : 'Đang Offline (Hoạt động hoàn hảo)'}
          </div>
        </div>
      )}

      {activeMode === 'pwa' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4">
          <h3 className="text-lg font-black text-slate-800">📱 CÀI ĐẶT ỨNG DỤNG LÊN MÁY TÍNH & ĐIỆN THOẠI</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Cô giáo có thể cài đặt Lớp Học Cô Mị như một ứng dụng native độc lập, mở toàn màn hình nhanh chóng không cần gõ địa chỉ web!
          </p>
          {isInstallable && (
            <button
              onClick={install}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Cài đặt ngay bây giờ
            </button>
          )}
        </div>
      )}
    </div>
  );
};
