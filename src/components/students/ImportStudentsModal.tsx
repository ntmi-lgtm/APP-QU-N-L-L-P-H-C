import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ClipboardPaste,
  Sparkles,
} from 'lucide-react';
import { useClass } from '../../context/ClassContext';
import { Student } from '../../types';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ isOpen, onClose }) => {
  const { downloadSampleCsv, importStudents, students } = useClass();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [parsedList, setParsedList] = useState<Partial<Student>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [pasteText, setPasteText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showConfirmReplace, setShowConfirmReplace] = useState<boolean>(false);

  if (!isOpen) return null;

  // Unified parser for text content (from CSV file or direct Excel paste)
  const parseStudentText = (rawContent: string) => {
    setErrorMsg('');
    try {
      const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setErrorMsg('Nội dung rỗng, vui lòng chọn file hoặc dán danh sách học sinh.');
        setParsedList([]);
        return;
      }

      // Detect delimiter: tab (\t) for Excel paste, comma (,) or semicolon (;) for CSV
      const firstLine = lines[0];
      let delimiter = ',';
      if (firstLine.includes('\t')) {
        delimiter = '\t';
      } else if (firstLine.includes(';')) {
        delimiter = ';';
      }

      // Helper to split row respecting quotes
      const splitRow = (row: string): string[] => {
        if (delimiter === '\t') {
          return row.split('\t').map((c) => c.replace(/^["']|["']$/g, '').trim());
        }
        const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*)"|([^"${delimiter}]*))`, 'g');
        const cells: string[] = [];
        let match;
        while ((match = regex.exec(row)) !== null) {
          cells.push((match[1] || match[2] || '').trim());
        }
        return cells;
      };

      const headerCells = splitRow(firstLine).map((c) => c.toLowerCase());

      // Check if first line is a header
      const hasHeader =
        headerCells.some((c) => c.includes('stt') || c.includes('thứ tự')) ||
        headerCells.some((c) => c.includes('tên') || c.includes('họ')) ||
        headerCells.some((c) => c.includes('giới tính') || c.includes('nam') || c.includes('nữ')) ||
        headerCells.some((c) => c.includes('tổ'));

      // Column mapping indices
      let sttIndex = 0;
      let nameIndex = 1;
      let genderIndex = 2;
      let teamIndex = 3;

      if (hasHeader) {
        headerCells.forEach((c, idx) => {
          if (c.includes('stt') || c.includes('thứ tự')) sttIndex = idx;
          else if (c.includes('tên') || c.includes('họ')) nameIndex = idx;
          else if (c.includes('giới tính') || c.includes('nam/nữ') || c.includes('phái')) genderIndex = idx;
          else if (c.includes('tổ')) teamIndex = idx;
        });
      }

      const dataLines = hasHeader ? lines.slice(1) : lines;
      const imported: Partial<Student>[] = [];

      dataLines.forEach((line, rowIdx) => {
        const cells = splitRow(line);
        if (cells.length < 2) return;

        // Extract Name
        const rawName = (cells[nameIndex] !== undefined ? cells[nameIndex] : cells[1]) || '';
        if (!rawName.trim()) return;

        // Extract STT / Code
        const rawStt = (cells[sttIndex] !== undefined ? cells[sttIndex] : cells[0]) || String(rowIdx + 1);
        const codeNum = parseInt(rawStt.replace(/\D/g, ''), 10) || rowIdx + 1;
        const code = `HS${String(codeNum).padStart(3, '0')}`;

        // Extract Gender
        const rawGender = (cells[genderIndex] !== undefined ? cells[genderIndex] : cells[2]) || '';
        const isFemale = rawGender.toLowerCase().includes('nữ') || rawGender.toLowerCase() === 'f' || rawGender.toLowerCase() === 'nu';
        const gender = isFemale ? 'female' : 'male';

        // Extract Team
        let rawTeam = (cells[teamIndex] !== undefined ? cells[teamIndex] : cells[3]) || `Tổ ${(rowIdx % 4) + 1}`;
        rawTeam = rawTeam.trim();
        // If teacher enters only a number like "1", "2", convert to "Tổ 1", "Tổ 2"
        if (/^\d+$/.test(rawTeam)) {
          rawTeam = `Tổ ${rawTeam}`;
        } else if (!rawTeam.toLowerCase().startsWith('tổ')) {
          rawTeam = `Tổ ${rawTeam}`;
        }

        imported.push({
          code,
          name: rawName.trim(),
          gender,
          dateOfBirth: '2017-05-15',
          team: rawTeam,
          group: `Nhóm ${rawTeam}`,
          notes: '',
        });
      });

      if (imported.length === 0) {
        setErrorMsg('Không tìm thấy dòng học sinh hợp lệ nào. Vui lòng kiểm tra định dạng: STT, Tên học sinh, Giới tính, Tổ.');
        setParsedList([]);
        return;
      }

      setParsedList(imported);
    } catch {
      setErrorMsg('Lỗi định dạng dữ liệu. Vui lòng kiểm tra lại file hoặc tải file mẫu chuẩn.');
      setParsedList([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseStudentText(text);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handlePasteChange = (text: string) => {
    setPasteText(text);
    if (text.trim()) {
      parseStudentText(text);
    } else {
      setParsedList([]);
      setErrorMsg('');
    }
  };

  const handleExecuteImport = () => {
    if (parsedList.length === 0) return;
    importStudents(parsedList, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Nhập Danh Sách Học Sinh (4 Cột Đơn Giản)
              </h3>
              <p className="text-xs text-white/90">
                Chỉ gồm: <strong>STT • Tên học sinh • Giới tính • Tổ</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700">
          {/* Format Specification Banner */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                📋 Định dạng file nhập 4 cột đơn giản:
              </span>
              <p className="text-xs text-emerald-950 font-bold mt-0.5">
                1. Số thứ tự (STT) • 2. Tên học sinh • 3. Giới tính (Nam/Nữ) • 4. Tổ (Tổ 1..4)
              </p>
            </div>
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-xl shadow-xs transition cursor-pointer shrink-0"
              title="Tải file mẫu đơn giản 4 cột"
            >
              <Download size={14} /> Tải file mẫu CSV
            </button>
          </div>

          {/* Mode Tabs: File Upload vs Direct Paste */}
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload size={14} /> 1. Tải file CSV từ máy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardPaste size={14} /> 2. Hoặc Dán trực tiếp từ Excel
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'upload' ? (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-white cursor-pointer transition group">
                <Upload size={32} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black text-slate-700">
                  {fileName ? fileName : 'Nhấp để chọn file CSV (STT, Tên học sinh, Giới tính, Tổ)'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Hỗ trợ định dạng .csv chuẩn tiếng Việt Excel UTF-8
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            /* Tab 2: Direct Paste from Excel */
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Sao chép 4 cột trong Excel (STT, Tên, Giới tính, Tổ) rồi dán vào đây:
              </label>
              <textarea
                rows={5}
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder={`1\tNguyễn Văn An\tNam\tTổ 1\n2\tTrần Thị Mai\tNữ\tTổ 1\n3\tLê Hoàng Long\tNam\tTổ 2...`}
                className="w-full p-3 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-[11px] text-slate-400 block">
                Mẹo: Trong Excel, chọn 4 cột chứa STT, Tên, Giới tính, Tổ rồi nhấn Ctrl+C, sau đó dán vào khung trên.
              </span>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">
              {errorMsg}
            </p>
          )}

          {/* Parsed Students Live Preview Table */}
          {parsedList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-600 stroke-[3]" />
                  Đã nhận diện thành công: {parsedList.length} học sinh
                </span>
                <span className="text-[11px] text-slate-400">Xem trước 4 cột:</span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl bg-white shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 border-b text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 w-12 text-center">STT</th>
                      <th className="p-2">Tên học sinh</th>
                      <th className="p-2 w-24">Giới tính</th>
                      <th className="p-2 w-24">Tổ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedList.map((std, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-black text-slate-800">{std.name}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              std.gender === 'female'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            {std.gender === 'female' ? '🌸 Nữ' : '🚀 Nam'}
                          </span>
                        </td>
                        <td className="p-2 font-bold text-purple-700">{std.team}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Confirmation Warning Box */}
          {showConfirmReplace && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-900">
                    Xác nhận thay thế danh sách học sinh
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    “Danh sách mới gồm <strong>{parsedList.length} học sinh</strong> sẽ <strong>thay thế toàn bộ danh sách hiện tại</strong> ({students.length} học sinh). Toàn bộ sao cũ sẽ được đặt lại = 0, XP = 0, Level = 1 để đón năm học mới. Bạn có chắc chắn muốn tiếp tục?”
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            Hủy
          </button>

          {!showConfirmReplace ? (
            <button
              type="button"
              disabled={parsedList.length === 0}
              onClick={() => setShowConfirmReplace(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-200 transition cursor-pointer"
            >
              Tiếp tục với {parsedList.length} học sinh
            </button>
          ) : (
            <button
              type="button"
              onClick={handleExecuteImport}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-200 transition cursor-pointer"
            >
              Xác nhận thay thế danh sách
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
