import { Student, Badge, Reward, Task, ClassSettings, ClassCriterion, LoveMessage } from '../types';
import { generateCuteAvatarSvg } from './avatars';

export const INITIAL_SETTINGS: ClassSettings = {
  className: 'Lớp 3A',
  schoolName: 'Trường Tiểu học Trần Văn Ơn',
  teacherName: 'Cô Mị',
  numberOfTeams: 4,
  themeColor: 'gentle-blue',
  academicYear: '2026 - 2027',
  slogan: 'Mỗi ngày đến lớp – Một ngày yêu thương – Một bước tiến bộ.',
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Siêng năng',
    icon: '🏆',
    description: 'Chuyên cần, đi học đúng giờ và nỗ lực bền bỉ',
    condition: 'Tích lũy 20 sao thi đua',
    category: 'chuyen-can',
  },
  {
    id: 'badge-2',
    name: 'Tiến bộ mỗi ngày',
    icon: '🌟',
    description: 'Có sự vượt bậc và cố gắng liên tục trong tuần',
    condition: 'Được giáo viên ghi nhận tiến bộ',
    category: 'hoc-tap',
  },
  {
    id: 'badge-3',
    name: 'Chăm học',
    icon: '📚',
    description: 'Hăng hái phát biểu xây dựng bài, chăm chú lắng nghe',
    condition: 'Phát biểu tốt 5 lần',
    category: 'hoc-tap',
  },
  {
    id: 'badge-4',
    name: 'Hợp tác tốt',
    icon: '🤝',
    description: 'Biết chia sẻ, lắng nghe và phối hợp hiệu quả cùng tổ nhóm',
    condition: 'Hoạt động nhóm xuất sắc',
    category: 'ky-nang',
  },
  {
    id: 'badge-5',
    name: 'Trái tim yêu thương',
    icon: '💗',
    description: 'Quan tâm, giúp đỡ bạn bè gặp khó khăn, lễ phép với thầy cô',
    condition: 'Thực hiện 3 việc tốt',
    category: 'dao-duc',
  },
  {
    id: 'badge-6',
    name: 'Ngôi sao trách nhiệm',
    icon: '🧹',
    description: 'Trực nhật sạch sẽ, bảo vệ của công và giữ gìn trật tự lớp',
    condition: 'Trực nhật đạt điểm 10',
    category: 'ky-luat',
  },
  {
    id: 'badge-7',
    name: 'Nhà sáng tạo',
    icon: '🎨',
    description: 'Có những bài vẽ, sản phẩm thủ công và ý tưởng bất ngờ',
    condition: 'Tác phẩm sáng tạo ấn tượng',
    category: 'nang-khieu',
  },
  {
    id: 'badge-8',
    name: 'Nhà khám phá',
    icon: '🔬',
    description: 'Ham tìm hiểu thế giới xung quanh, đặt câu hỏi hay trong giờ học',
    condition: 'Có câu hỏi hoặc quan sát khoa học hay',
    category: 'kham-pha',
  },
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    name: 'Lời khen đặc biệt & Sticker',
    icon: '🌟',
    requiredStars: 10,
    description: 'Được cô tuyên dương trước lớp và tặng 1 bộ sticker ngộ nghĩnh',
    stock: 50,
  },
  {
    id: 'rew-2',
    name: 'Quyền chọn trò chơi vui học',
    icon: '🎮',
    requiredStars: 20,
    description: 'Được ưu tiên chọn trò chơi cho cả lớp vào tiết sinh hoạt cuối tuần',
    stock: 20,
  },
  {
    id: 'rew-3',
    name: 'Huy hiệu đặc biệt & Làm Trưởng nhóm',
    icon: '🏅',
    requiredStars: 30,
    description: 'Huy hiệu lấp lánh và quyền dẫn dắt đội chơi trong hoạt động tiếp theo',
    stock: 15,
  },
  {
    id: 'rew-4',
    name: 'Phần thưởng lớp (Sổ tay / Bút màu)',
    icon: '🎁',
    requiredStars: 50,
    description: 'Món quà lưu niệm đáng yêu từ cô giáo chủ nhiệm',
    stock: 10,
  },
];

export const INITIAL_CRITERIA: ClassCriterion[] = [
  { id: 'crit-1', name: 'Chăm học', maxScore: 10, icon: '📖' },
  { id: 'crit-2', name: 'Kỷ luật', maxScore: 10, icon: '🔔' },
  { id: 'crit-3', name: 'Hợp tác', maxScore: 10, icon: '🤝' },
  { id: 'crit-4', name: 'Vệ sinh', maxScore: 10, icon: '🧹' },
  { id: 'crit-5', name: 'Trách nhiệm', maxScore: 10, icon: '⭐' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Ôn lại bảng cửu chương 6 và 7',
    assignedTo: 'all',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    category: 'study',
  },
  {
    id: 'task-2',
    title: 'Tổ 1 trực nhật: quét lớp và lau bảng sạch sẽ',
    assignedTo: 'Tổ 1',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    category: 'duty',
  },
  {
    id: 'task-3',
    title: 'Thảo luận nhóm chuẩn bị bài Kể chuyện',
    assignedTo: 'all',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    category: 'group',
  },
  {
    id: 'task-4',
    title: 'Tưới cây ở góc thiên nhiên lớp học',
    assignedTo: 'Tổ 3',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    category: 'experience',
  },
];

export const INITIAL_LOVE_MESSAGES: LoveMessage[] = [
  {
    id: 'love-1',
    recipientType: 'all',
    recipientName: 'Cả lớp 3A thân yêu',
    message: 'Hôm nay cả lớp ta học rất hăng say và đoàn kết. Cô rất tự hào về các con!',
    emoji: '💗',
    sender: 'Cô Mị',
    date: new Date().toISOString(),
  },
  {
    id: 'love-2',
    recipientType: 'student',
    recipientName: 'Nguyễn Văn An',
    message: 'Cô thấy con hôm nay đã mạnh dạn giơ tay phát biểu bài toán khó. Cố gắng tiếp tục nhé!',
    emoji: '🌟',
    sender: 'Cô Mị',
    date: new Date().toISOString(),
  },
];

// 24 realistic Vietnamese student samples for primary class demo
const DEMO_STUDENT_NAMES: { name: string; gender: 'male' | 'female'; team: string; group: string; stars: number; xp: number; badges: string[]; notes: string; recent: string }[] = [
  { name: 'Nguyễn Văn An', gender: 'male', team: 'Tổ 1', group: 'Nhóm Chim Non', stars: 24, xp: 240, badges: ['badge-1', 'badge-3'], notes: 'Hăng hái phát biểu, chữ viết đẹp', recent: 'Giải đúng bài toán khó' },
  { name: 'Trần Thị Mai', gender: 'female', team: 'Tổ 1', group: 'Nhóm Chim Non', stars: 28, xp: 280, badges: ['badge-1', 'badge-5'], notes: 'Tổ trưởng gương mẫu, hay giúp bạn', recent: 'Giúp bạn ôn bài chính tả' },
  { name: 'Lê Hoàng Long', gender: 'male', team: 'Tổ 1', group: 'Nhóm Chim Non', stars: 15, xp: 150, badges: ['badge-2'], notes: 'Có nhiều tiến bộ trong môn Toán', recent: 'Nộp bài tập đầy đủ' },
  { name: 'Phạm Bảo Ngọc', gender: 'female', team: 'Tổ 1', group: 'Nhóm Chim Non', stars: 19, xp: 190, badges: ['badge-7'], notes: 'Vẽ tranh minh họa rất đẹp', recent: 'Đóng góp tranh trang trí lớp' },
  { name: 'Vũ Đức Minh', gender: 'male', team: 'Tổ 1', group: 'Nhóm Mầm Xanh', stars: 9, xp: 90, badges: [], notes: 'Còn hơi nhút nhát khi nói trước lớp', recent: 'Cố gắng phát biểu 1 lần' },
  { name: 'Đỗ Thảo Linh', gender: 'female', team: 'Tổ 1', group: 'Nhóm Mầm Xanh', stars: 22, xp: 220, badges: ['badge-3'], notes: 'Đọc diễn cảm tốt, giọng trong trẻo', recent: 'Đọc thơ trước lớp' },

  { name: 'Bùi Gia Huy', gender: 'male', team: 'Tổ 2', group: 'Nhóm Ong Vàng', stars: 26, xp: 260, badges: ['badge-4', 'badge-6'], notes: 'Trực nhật trách nhiệm, năng động', recent: 'Trực nhật lớp sạch tinh tươm' },
  { name: 'Hoàng Kim Ngân', gender: 'female', team: 'Tổ 2', group: 'Nhóm Ong Vàng', stars: 31, xp: 310, badges: ['badge-1', 'badge-3', 'badge-5'], notes: 'Chăm ngoan, điểm thi đua cao nhất tuần', recent: 'Đạt điểm 10 môn Toán' },
  { name: 'Đinh Quốc Bảo', gender: 'male', team: 'Tổ 2', group: 'Nhóm Ong Vàng', stars: 12, xp: 120, badges: ['badge-2'], notes: 'Đôi khi quên dụng cụ học tập', recent: 'Hôm nay chuẩn bị bài chu đáo' },
  { name: 'Ngô Phương Thảo', gender: 'female', team: 'Tổ 2', group: 'Nhóm Ong Vàng', stars: 18, xp: 180, badges: ['badge-5'], notes: 'Hòa đồng, luôn mỉm cười với bạn bè', recent: 'Nhường đồ chơi cho bạn' },
  { name: 'Dương Tuấn Kiệt', gender: 'male', team: 'Tổ 2', group: 'Nhóm Cầu Vồng', stars: 8, xp: 80, badges: [], notes: 'Cần rèn thêm chữ viết và độ tập trung', recent: 'Viết nắn nót hơn hôm qua' },
  { name: 'Lý Quỳnh Chi', gender: 'female', team: 'Tổ 2', group: 'Nhóm Cầu Vồng', stars: 21, xp: 210, badges: ['badge-7'], notes: 'Có năng khiếu âm nhạc, hát hay', recent: 'Bắt nhịp bài hát đầu giờ' },

  { name: 'Trịnh Hữu Phúc', gender: 'male', team: 'Tổ 3', group: 'Nhóm Khăn Quàng Đỏ', stars: 23, xp: 230, badges: ['badge-4'], notes: 'Tổ trưởng chu đáo, nhắc nhở bạn tốt', recent: 'Quản lý tổ trật tự trong giờ tự học' },
  { name: 'Phan Như Ý', gender: 'female', team: 'Tổ 3', group: 'Nhóm Khăn Quàng Đỏ', stars: 27, xp: 270, badges: ['badge-3', 'badge-8'], notes: 'Rất thích đọc sách khoa học', recent: 'Chia sẻ kiến thức về hành tinh' },
  { name: 'Võ Minh Quân', gender: 'male', team: 'Tổ 3', group: 'Nhóm Khăn Quàng Đỏ', stars: 7, xp: 70, badges: [], notes: 'Hay quên làm bài tập về nhà', recent: 'Có cố gắng giải bài' },
  { name: 'Lâm Khánh Vy', gender: 'female', team: 'Tổ 3', group: 'Nhóm Khăn Quàng Đỏ', stars: 20, xp: 200, badges: ['badge-6'], notes: 'Tự giác xếp gọn bàn ghế', recent: 'Kê ngay ngắn bàn học' },
  { name: 'Tạ Minh Khôi', gender: 'male', team: 'Tổ 3', group: 'Nhóm Ngôi Sao', stars: 16, xp: 160, badges: ['badge-2'], notes: 'Đã bớt nói chuyện riêng trong lớp', recent: 'Giữ trật tự trọn vẹn tiết học' },
  { name: 'Huỳnh Tú Anh', gender: 'female', team: 'Tổ 3', group: 'Nhóm Ngôi Sao', stars: 25, xp: 250, badges: ['badge-1'], notes: 'Đi học đều đặn, luôn chuẩn giờ', recent: 'Đến lớp sớm 15 phút ôn bài' },

  { name: 'Đoàn Quang Khải', gender: 'male', team: 'Tổ 4', group: 'Nhóm Thỏ Trắng', stars: 22, xp: 220, badges: ['badge-6'], notes: 'Nhanh nhẹn, nhiệt tình với hoạt động chung', recent: 'Xóa bảng và chuẩn bị phấn cho cô' },
  { name: 'Mai Thục Quyên', gender: 'female', team: 'Tổ 4', group: 'Nhóm Thỏ Trắng', stars: 29, xp: 290, badges: ['badge-3', 'badge-5'], notes: 'Vừa học giỏi vừa lễ phép', recent: 'Chào hỏi thầy cô rất ngoan' },
  { name: 'Chu Đình Trọng', gender: 'male', team: 'Tổ 4', group: 'Nhóm Thỏ Trắng', stars: 10, xp: 100, badges: [], notes: 'Viết còn chậm, cần động viên nhiều', recent: 'Hoàn thành bài viết kịp giờ' },
  { name: 'Hồ Ánh Tuyết', gender: 'female', team: 'Tổ 4', group: 'Nhóm Thỏ Trắng', stars: 17, xp: 170, badges: ['badge-7'], notes: 'Khéo tay, cắt dán giấy rất tỉ mỉ', recent: 'Làm hoa giấy tặng mẹ 20/10' },
  { name: 'Lương Chí Thiện', gender: 'male', team: 'Tổ 4', group: 'Nhóm Họa Mi', stars: 14, xp: 140, badges: ['badge-2'], notes: 'Tiến bộ từng ngày, tính toán nhanh hơn', recent: 'Làm đúng phép cộng có nhớ' },
  { name: 'Nguyễn Bích Diệp', gender: 'female', team: 'Tổ 4', group: 'Nhóm Họa Mi', stars: 24, xp: 240, badges: ['badge-4'], notes: 'Biết chia sẻ bút thước cho bạn mượn', recent: 'Cho bạn mượn thước kẻ' },
];

export const INITIAL_STUDENTS: Student[] = DEMO_STUDENT_NAMES.map((item, index) => {
  const id = `std-${index + 1}`;
  const code = `HS${(index + 1).toString().padStart(3, '0')}`;
  const level = Math.max(1, Math.floor(item.stars / 8) + 1);
  return {
    id,
    code,
    name: item.name,
    gender: item.gender,
    dateOfBirth: '2017-05-15',
    avatar: generateCuteAvatarSvg(item.name, item.gender),
    team: item.team,
    group: item.group,
    stars: item.stars,
    xp: item.xp,
    level,
    badges: item.badges,
    notes: item.notes,
    recentAchievement: item.recent,
  };
});
