import React, { useState } from 'react';
import { Heart, Sparkles, Send, MessageCircle, Users } from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student } from '../../types';

export const LoveCornerView: React.FC = () => {
  const { students, loveMessages, sendLoveMessage, settings } = useClass();

  const [recipientType, setRecipientType] = useState<'student' | 'team' | 'group' | 'all'>('student');
  const [recipientId, setRecipientId] = useState<string>(students[0]?.id || '');
  const [message, setMessage] = useState<string>('Cô rất tự hào về sự nỗ lực của em hôm nay!');
  const [emoji, setEmoji] = useState<string>('💗');

  const positivePresets = [
    { text: 'Cô tin em! Em nhất định sẽ làm được.', emoji: '💗' },
    { text: 'Em đang tiến bộ mỗi ngày một rõ rệt!', emoji: '🌈' },
    { text: 'Cô rất tự hào về con hôm nay!', emoji: '🌟' },
    { text: 'Cảm ơn em vì đã biết quan tâm và giúp đỡ bạn bè!', emoji: '🤝' },
    { text: 'Mỗi ngày đến trường là một niềm vui cùng con!', emoji: '🌱' },
    { text: 'Nụ cười và sự chăm chỉ của em làm bừng sáng cả lớp học!', emoji: '☀️' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let targetName = 'Cả lớp';
    if (recipientType === 'student') {
      const s = students.find((std) => std.id === recipientId);
      targetName = s ? s.name : 'Học sinh';
    } else if (recipientType === 'team') {
      targetName = recipientId;
    } else if (recipientType === 'group') {
      targetName = recipientId;
    }

    sendLoveMessage({
      recipientType,
      recipientId,
      recipientName: targetName,
      message: message.trim(),
      emoji,
      sender: settings.teacherName,
    });
  };

  const groups = Array.from(new Set(students.map((s) => s.group))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Heart className="text-pink-500 fill-pink-400" size={24} />
            Góc Yêu Thương & Giáo Dục Cảm Xúc
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gửi những lời nhắn ấm áp, tích cực và truyền cảm hứng tới từng học sinh, tổ nhóm hoặc cả lớp
          </p>
        </div>

        <span className="px-3 py-1.5 bg-pink-50 text-pink-700 text-xs font-bold rounded-xl border border-pink-200 self-start md:self-auto">
          “Mỗi ngày đến lớp – Một ngày yêu thương”
        </span>
      </div>

      {/* Love Message Composer Box */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 rounded-3xl p-6 text-white shadow-lg shadow-pink-200/50">
        <form onSubmit={handleSend} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-black text-base flex items-center gap-2">
              <Sparkles size={18} /> Gửi Lời Yêu Thương Mới
            </h3>

            {/* Recipient Type Selector */}
            <div className="flex p-1 bg-black/20 rounded-2xl gap-1 text-xs font-bold self-start">
              <button
                type="button"
                onClick={() => {
                  setRecipientType('student');
                  setRecipientId(students[0]?.id || '');
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  recipientType === 'student' ? 'bg-white text-pink-800 shadow-xs' : 'text-white/80'
                }`}
              >
                Cá nhân
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecipientType('team');
                  setRecipientId('Tổ 1');
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  recipientType === 'team' ? 'bg-white text-pink-800 shadow-xs' : 'text-white/80'
                }`}
              >
                Theo tổ
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecipientType('group');
                  setRecipientId(groups[0] || 'Nhóm 1');
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  recipientType === 'group' ? 'bg-white text-pink-800 shadow-xs' : 'text-white/80'
                }`}
              >
                Theo nhóm
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecipientType('all');
                  setRecipientId('all');
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  recipientType === 'all' ? 'bg-white text-pink-800 shadow-xs' : 'text-white/80'
                }`}
              >
                Cả lớp
              </button>
            </div>
          </div>

          {/* Specific Recipient Picker */}
          {recipientType !== 'all' && (
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1">
                Người nhận:
              </label>
              {recipientType === 'student' ? (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-black focus:outline-none cursor-pointer max-w-sm w-full"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.team})
                    </option>
                  ))}
                </select>
              ) : recipientType === 'team' ? (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-black focus:outline-none cursor-pointer max-w-xs w-full"
                >
                  {Array.from({ length: settings.numberOfTeams }, (_, i) => `Tổ ${i + 1}`).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-black focus:outline-none cursor-pointer max-w-xs w-full"
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Preset Positive Quotes */}
          <div>
            <label className="block text-xs font-bold text-white/90 mb-1.5">
              Chọn thông điệp yêu thương mẫu (1 chạm):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {positivePresets.map((quote, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMessage(quote.text);
                    setEmoji(quote.emoji);
                  }}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white text-white hover:text-pink-900 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {quote.emoji} {quote.text}
                </button>
              ))}
            </div>
          </div>

          {/* Message Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời nhắn gửi gắm yêu thương..."
              className="flex-1 px-4 py-2.5 bg-white text-slate-800 text-sm font-semibold rounded-2xl focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-2xl shadow-md transition cursor-pointer shrink-0"
            >
              <Send size={15} /> Gửi ngay
            </button>
          </div>
        </form>
      </div>

      {/* Love Wall - Sent Messages */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-sm text-slate-800 mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-pink-500" />
          Bức Tường Lời Yêu Thương Đã Gửi ({loveMessages.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {loveMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-amber-50/50 border border-pink-100 rounded-3xl space-y-2 relative shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{msg.emoji}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(msg.date).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>

              <div className="font-bold text-xs text-pink-900">
                Gửi đến: <span className="text-pink-700 font-black">{msg.recipientName}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-pink-100/60">
                "{msg.message}"
              </p>

              <div className="text-right text-[11px] font-bold text-slate-500">
                — {msg.sender || 'Cô Mị'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
