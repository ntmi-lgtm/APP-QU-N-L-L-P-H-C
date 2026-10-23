export interface AvatarPreset {
  id: string;
  name: string;
  gender: 'male' | 'female';
  url: string;
}

// Collection of 24 cheerful 3D/2D cute chibi primary school avatars
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'boy-1',
    name: 'Bé Minh Triết (Khăn quàng đỏ)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=BaoMinh&backgroundColor=b6e3f4',
  },
  {
    id: 'girl-1',
    name: 'Bé Mai Anh (Kẹp tóc nơ hồng)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=MaiAnh&backgroundColor=ffdfba',
  },
  {
    id: 'boy-2',
    name: 'Bé Tuấn Kiệt (Kính cận thông thái)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=TuanKiet&backgroundColor=c0aede',
  },
  {
    id: 'girl-2',
    name: 'Bé Bảo Châu (Bím tóc tinh nghịch)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=BaoChau&backgroundColor=d1d4f9',
  },
  {
    id: 'boy-3',
    name: 'Bé Hoàng Nam (Mũ phi hành gia)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=HoangNam&backgroundColor=ffd5dc',
  },
  {
    id: 'girl-3',
    name: 'Bé Ngọc Hân (Nụ cười rạng rỡ)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=NgocHan&backgroundColor=ffdfba',
  },
  {
    id: 'boy-4',
    name: 'Bé Đức Trí (Mũ beret xanh)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=DucTri&backgroundColor=b6e3f4',
  },
  {
    id: 'girl-4',
    name: 'Bé Khánh Vy (Băng đô hoa cúc)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=KhanhVy&backgroundColor=c0aede',
  },
  {
    id: 'boy-5',
    name: 'Bé Quang Khải (Mắt sáng thông minh)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=QuangKhai&backgroundColor=ffd5dc',
  },
  {
    id: 'girl-5',
    name: 'Bé Thảo My (Hát hay múa dẻo)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=ThaoMy&backgroundColor=d1d4f9',
  },
  {
    id: 'boy-6',
    name: 'Bé Gia Huy (Năng động thể thao)',
    gender: 'male',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=GiaHuy&backgroundColor=b6e3f4',
  },
  {
    id: 'girl-6',
    name: 'Bé Linh Chi (Chăm ngoan hiền dịu)',
    gender: 'female',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=LinhChi&backgroundColor=ffdfba',
  },
];

// Fallback generator for instant local avatars without relying on network
export const generateCuteAvatarSvg = (name: string, gender: 'male' | 'female'): string => {
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColors = gender === 'female' 
    ? ['#fce7f3', '#ffe4e6', '#ede9fe', '#fef3c7'] 
    : ['#e0f2fe', '#dbeafe', '#dcfce7', '#ffedd5'];
  const bg = bgColors[seed % bgColors.length];
  const eyeVariants = ['^^', '●●', '◕◕', '✧✧', '•‿•'];
  const eyes = eyeVariants[seed % eyeVariants.length];
  const hats = gender === 'female' ? ['🌸', '🎀', '⭐', '🍓', '👑'] : ['🧢', '🚀', '⭐', '🎈', '⚡'];
  const hat = hats[seed % hats.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="30" fill="${bg}" />
    <circle cx="50" cy="54" r="32" fill="#fff" opacity="0.9" />
    <circle cx="36" cy="58" r="4" fill="#fda4af" opacity="0.6" />
    <circle cx="64" cy="58" r="4" fill="#fda4af" opacity="0.6" />
    <text x="50" y="32" font-size="20" text-anchor="middle">${hat}</text>
    <text x="50" y="58" font-size="16" font-weight="bold" fill="#334155" text-anchor="middle">${eyes}</text>
    <path d="M 44 64 Q 50 70 56 64" stroke="#e11d48" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
