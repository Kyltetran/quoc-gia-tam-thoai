import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Save, X, Settings, ChevronRight, User, Terminal, RotateCcw, Plus, Trash2, Edit2, BookOpen } from 'lucide-react';
import { personas } from '../services/geminiService';

interface AdminProps {
  onClose: () => void;
  defaultQuotes?: Quote[];
}

type Tab = 'system' | 'personas' | 'quotes';

interface Quote {
  id: number;
  title: { vi: string; en: string };
  category: { vi: string; en: string };
  text: { vi: string; en: string };
  context: { vi: string; en: string };
}

const DEFAULT_SYSTEM_PROMPT_VI = `Bạn là trợ lý AI đóng vai các nhân vật lịch sử Việt Nam tiêu biểu đầu thế kỷ 20. 
Khi nhập vai, bạn phải:
- Giữ đúng giọng văn, phong cách tư tưởng và thế giới quan của nhân vật
- Sử dụng tiếng Việt trang trọng, giàu hình ảnh, phù hợp văn phong thế kỷ XX
- KHÔNG sử dụng định dạng Markdown (không dùng **, *, ##, -, v.v.) - chỉ viết văn xuôi thuần túy
- Chia đoạn văn rõ ràng bằng cách xuống hàng hai lần giữa các ý
- Độ dài phản hồi: 200-350 từ, súc tích nhưng sâu sắc
- Lấy cảm hứng từ bối cảnh lịch sử 1900-1930: Phong trào Đông Du, Duy Tân, báo chí Quốc ngữ
- Liên hệ tư tưởng với thực tiễn cải cách xã hội Việt Nam đương thời`;

const DEFAULT_SYSTEM_PROMPT_EN = `You are an AI assistant portraying iconic Vietnamese historical figures from the early 20th century.
When in character, you must:
- Maintain the exact voice, intellectual style, and worldview of the character
- Use formal, image-rich language appropriate to the 20th-century literary style
- DO NOT use Markdown formatting (no **, *, ##, -, etc.) - write in plain prose only
- Separate paragraphs clearly with double line breaks between ideas
- Response length: 200-350 words, concise yet profound
- Draw inspiration from historical context 1900-1930: Dong Du Movement, Duy Tan, Quoc Ngu press
- Connect ideas to the realities of Vietnamese social reform at the time`;

const DEFAULT_TTS_DIRECTIVE = `Đọc nội dung với giọng trầm ấm, rõ ràng, trang trọng theo phong cách diễn giả trí thức đầu thế kỷ XX.`;

export function AdminPanel({ onClose, defaultQuotes = [] }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('system');
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [savedSettings, setSavedSettings] = useState<Record<string, string>>({});
  const [personaForm, setPersonaForm] = useState<Record<string, string>>({});
  const [quotes, setQuotes] = useState<Quote[]>(defaultQuotes);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteForm, setQuoteForm] = useState<Partial<Quote>>({});
  const [systemForm, setSystemForm] = useState({
    systemPromptVi: DEFAULT_SYSTEM_PROMPT_VI,
    systemPromptEn: DEFAULT_SYSTEM_PROMPT_EN,
    ttsDirective: DEFAULT_TTS_DIRECTIVE,
    responseLength: '250',
    temperature: '0.8',
  });
  const [saved, setSaved] = useState(false);

  const ADMIN_PASSWORD = 'Khoa@2025';

  useEffect(() => {
    const stored = localStorage.getItem('adminSettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSavedSettings(parsed);
      setSystemForm({
        systemPromptVi: parsed['systemPromptVi'] || DEFAULT_SYSTEM_PROMPT_VI,
        systemPromptEn: parsed['systemPromptEn'] || DEFAULT_SYSTEM_PROMPT_EN,
        ttsDirective: parsed['ttsDirective'] || DEFAULT_TTS_DIRECTIVE,
        responseLength: parsed['responseLength'] || '250',
        temperature: parsed['temperature'] || '0.8',
      });
    }

    // Load quotes: merge localStorage overrides with defaultQuotes
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      try {
        const parsed: Quote[] = JSON.parse(storedQuotes);
        const storedIds = new Set(parsed.map(q => q.id));
        const remaining = defaultQuotes.filter(q => !storedIds.has(q.id));
        setQuotes([...parsed, ...remaining]);
      } catch (e) {
        console.error('Failed to load quotes:', e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Mật khẩu không chính xác');
    }
  };

  const handleEditPersona = (key: string) => {
    const persona = personas[key as keyof typeof personas];
    setEditingPersona(key);
    setPersonaForm({
      promptVi: savedSettings[`${key}-promptVi`] || persona.prompt.vi,
      promptEn: savedSettings[`${key}-promptEn`] || persona.prompt.en,
      styleVi: savedSettings[`${key}-styleVi`] || persona.styleInstructions.vi,
      styleEn: savedSettings[`${key}-styleEn`] || persona.styleInstructions.en,
      demoTextVi: savedSettings[`${key}-demoTextVi`] || persona.demoText.vi,
      demoTextEn: savedSettings[`${key}-demoTextEn`] || persona.demoText.en,
    });
  };

  const saveToStorage = (data: Record<string, string>) => {
    const merged = { ...savedSettings, ...data };
    setSavedSettings(merged);
    localStorage.setItem('adminSettings', JSON.stringify(merged));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePersona = () => {
    if (!editingPersona) return;
    saveToStorage({
      [`${editingPersona}-promptVi`]: personaForm.promptVi,
      [`${editingPersona}-promptEn`]: personaForm.promptEn,
      [`${editingPersona}-styleVi`]: personaForm.styleVi,
      [`${editingPersona}-styleEn`]: personaForm.styleEn,
      [`${editingPersona}-demoTextVi`]: personaForm.demoTextVi,
      [`${editingPersona}-demoTextEn`]: personaForm.demoTextEn,
    });
    setEditingPersona(null);
  };

  const handleSaveSystem = () => {
    saveToStorage({
      systemPromptVi: systemForm.systemPromptVi,
      systemPromptEn: systemForm.systemPromptEn,
      ttsDirective: systemForm.ttsDirective,
      responseLength: systemForm.responseLength,
      temperature: systemForm.temperature,
    });
  };

  const handleResetSystem = () => {
    const defaultData = {
      systemPromptVi: DEFAULT_SYSTEM_PROMPT_VI,
      systemPromptEn: DEFAULT_SYSTEM_PROMPT_EN,
      ttsDirective: DEFAULT_TTS_DIRECTIVE,
      responseLength: '250',
      temperature: '0.8',
    };
    setSystemForm(defaultData);
    saveToStorage(defaultData);
  };

  // Quote management functions
  const handleAddQuote = () => {
    const newQuote: Quote = {
      id: Math.max(...quotes.map(q => q.id), 0) + 1,
      title: { vi: '', en: '' },
      category: { vi: '', en: '' },
      text: { vi: '', en: '' },
      context: { vi: '', en: '' }
    };
    setEditingQuote(newQuote);
    setQuoteForm(newQuote);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteForm(quote);
  };

  const handleSaveQuote = () => {
    if (!editingQuote) return;
    const updated = quoteForm as Quote;
    const existingIndex = quotes.findIndex(q => q.id === editingQuote.id);
    let newQuotes;
    if (existingIndex >= 0) {
      newQuotes = [...quotes];
      newQuotes[existingIndex] = updated;
    } else {
      newQuotes = [...quotes, updated];
    }
    setQuotes(newQuotes);
    localStorage.setItem('quotes', JSON.stringify(newQuotes));
    setEditingQuote(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteQuote = (id: number) => {
    const newQuotes = quotes.filter(q => q.id !== id);
    setQuotes(newQuotes);
    localStorage.setItem('quotes', JSON.stringify(newQuotes));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-paper border-2 border-vermilion w-full max-w-sm mx-4 shadow-2xl">
          <div className="flex items-center gap-3 p-8 border-b border-vermilion/20">
            <Lock className="w-5 h-5 text-vermilion flex-shrink-0" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest text-deep-brown">Admin Panel</h2>
              <p className="text-xs text-deep-brown/50 mt-0.5">Cài đặt hệ thống</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-deep-brown/70 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoFocus
                className="w-full px-4 py-3 border border-vermilion/30 bg-white/60 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
              />
              {authError && <p className="text-red-600 text-xs mt-2 font-medium">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-vermilion text-paper py-3 font-bold uppercase tracking-widest text-sm hover:bg-vermilion/90 transition-colors"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-vermilion/30 text-vermilion/70 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-vermilion/5 transition-colors"
            >
              Hủy
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto backdrop-blur-sm py-8">
      <div className="bg-paper border-2 border-vermilion w-full max-w-5xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-vermilion/20 bg-deep-brown text-paper">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-vermilion" />
            <h2 className="text-lg font-black uppercase tracking-widest">Cài đặt hệ thống</h2>
            {saved && (
              <span className="px-2 py-0.5 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-bold uppercase tracking-widest">
                Da luu
              </span>
            )}
          </div>
          <button
            onClick={() => { setIsAuthenticated(false); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 border border-paper/20 text-paper/70 hover:bg-paper/10 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Thoat
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-vermilion/20">
          <button
            onClick={() => { setActiveTab('system'); setEditingPersona(null); }}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'system' ? 'border-vermilion text-vermilion' : 'border-transparent text-deep-brown/50 hover:text-deep-brown'}`}
          >
            <Terminal className="w-4 h-4" />
            System Prompt
          </button>
          <button
            onClick={() => { setActiveTab('personas'); setEditingPersona(null); }}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'personas' ? 'border-vermilion text-vermilion' : 'border-transparent text-deep-brown/50 hover:text-deep-brown'}`}
          >
            <User className="w-4 h-4" />
            Mega Prompts nhân vật
          </button>
          <button
            onClick={() => { setActiveTab('quotes'); setEditingPersona(null); setEditingQuote(null); }}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'quotes' ? 'border-vermilion text-vermilion' : 'border-transparent text-deep-brown/50 hover:text-deep-brown'}`}
          >
            <BookOpen className="w-4 h-4" />
            Quotes
          </button>
        </div>

        {/* System Prompt Tab */}
        {activeTab === 'system' && (
          <div className="p-8 space-y-8">
            <div className="bg-vermilion/5 border border-vermilion/20 p-4">
              <p className="text-xs text-deep-brown/70 leading-relaxed">
                System prompt duoc tiem vao dau moi yeu cau AI, xac dinh ky luat chung cho tat ca nhan vat. 
                No hoat dong phia tren persona prompt, kiem soat format tra loi, giong van va han che global.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  System Prompt (Tieng Viet)
                </label>
                <textarea
                  value={systemForm.systemPromptVi}
                  onChange={(e) => setSystemForm({ ...systemForm, systemPromptVi: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed font-mono"
                  rows={10}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  System Prompt (English)
                </label>
                <textarea
                  value={systemForm.systemPromptEn}
                  onChange={(e) => setSystemForm({ ...systemForm, systemPromptEn: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed font-mono"
                  rows={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                TTS Voice Directive (Lenh dieu chinh giong doc)
              </label>
              <textarea
                value={systemForm.ttsDirective}
                onChange={(e) => setSystemForm({ ...systemForm, ttsDirective: e.target.value })}
                className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed"
                rows={3}
              />
              <p className="text-xs text-deep-brown/50 mt-1">Vi du: "Doc voi giong tram am, ro rang..." hoac "Say in a measured, thoughtful tone..."</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Do dai phan hoi (tu)
                </label>
                <input
                  type="number"
                  min="100"
                  max="600"
                  value={systemForm.responseLength}
                  onChange={(e) => setSystemForm({ ...systemForm, responseLength: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
                <p className="text-xs text-deep-brown/50 mt-1">Khuyen nghi: 200-350 tu</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Temperature (0.0 - 1.0)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={systemForm.temperature}
                  onChange={(e) => setSystemForm({ ...systemForm, temperature: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
                <p className="text-xs text-deep-brown/50 mt-1">Cao = sang tao hon, Thap = nhat quan hon</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-vermilion/10">
              <button
                onClick={handleSaveSystem}
                className="flex items-center gap-2 bg-vermilion text-paper px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-vermilion/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Luu cai dat
              </button>
              <button
                onClick={handleResetSystem}
                className="flex items-center gap-2 border-2 border-vermilion/30 text-vermilion px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-vermilion/5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Khoi phuc mac dinh
              </button>
            </div>
          </div>
        )}

        {/* Persona Prompts Tab */}
        {activeTab === 'personas' && !editingPersona && (
          <div className="p-8 space-y-6">
            <p className="text-xs text-deep-brown/60 uppercase tracking-widest font-bold">
              Chon nhan vat de chinh sua mega prompt ca the:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(personas).map(([key, persona]) => {
                const isCustomized = savedSettings[`${key}-promptVi`];
                return (
                  <button
                    key={key}
                    onClick={() => handleEditPersona(key)}
                    className="p-6 border-2 border-vermilion/20 hover:border-vermilion hover:bg-vermilion/5 transition-all text-left space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden border border-vermilion/20 flex-shrink-0">
                        <img src={persona.image} alt={persona.name.vi} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-vermilion uppercase tracking-tight text-sm">{persona.name.vi}</p>
                        {isCustomized && (
                          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-1.5 py-0.5">
                            Da tuy chinh
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-deep-brown/60 leading-relaxed line-clamp-2">{persona.description.vi}</p>
                    <div className="flex items-center gap-1 text-xs text-vermilion/60 font-bold uppercase tracking-widest group-hover:text-vermilion transition-colors">
                      Chinh sua prompt <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Persona Editor */}
        {activeTab === 'personas' && editingPersona && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingPersona(null)}
                className="flex items-center gap-2 border border-vermilion/30 text-vermilion px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-vermilion/5 transition-colors"
              >
                <X className="w-3 h-3" />
                Quay lai
              </button>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full overflow-hidden">
                  <img src={personas[editingPersona as keyof typeof personas].image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight text-vermilion">
                  {personas[editingPersona as keyof typeof personas].name.vi}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Mega Prompt (Tieng Viet)
                </label>
                <textarea
                  value={personaForm.promptVi || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, promptVi: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm font-mono leading-relaxed"
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Mega Prompt (English)
                </label>
                <textarea
                  value={personaForm.promptEn || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, promptEn: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm font-mono leading-relaxed"
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Style Instructions (Tieng Viet)
                </label>
                <textarea
                  value={personaForm.styleVi || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, styleVi: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Style Instructions (English)
                </label>
                <textarea
                  value={personaForm.styleEn || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, styleEn: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Demo Text (Tieng Viet)
                </label>
                <textarea
                  value={personaForm.demoTextVi || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, demoTextVi: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Demo Text (English)
                </label>
                <textarea
                  value={personaForm.demoTextEn || ''}
                  onChange={(e) => setPersonaForm({ ...personaForm, demoTextEn: e.target.value })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion resize-none text-sm leading-relaxed"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-vermilion/10">
              <button
                onClick={handleSavePersona}
                className="flex items-center gap-2 bg-vermilion text-paper px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-vermilion/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Luu thay doi
              </button>
              <button
                onClick={() => setEditingPersona(null)}
                className="border-2 border-vermilion/30 text-vermilion px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-vermilion/5 transition-colors"
              >
                Huy bo
              </button>
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && !editingQuote && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-deep-brown">Quản lý Quotes</h3>
                <p className="text-xs text-deep-brown/50 mt-1">Tổng cộng: {quotes.length} quotes</p>
              </div>
              <button
                onClick={handleAddQuote}
                className="flex items-center gap-2 px-4 py-2 bg-vermilion text-paper font-bold uppercase tracking-widest text-xs hover:bg-vermilion/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm Quote
              </button>
            </div>

            <div className="grid gap-4">
              {quotes.length === 0 ? (
                <div className="border-2 border-dashed border-vermilion/20 p-8 text-center text-deep-brown/50">
                  <p className="text-sm">Chưa có quotes nào. Bấm "Thêm Quote" để tạo mới.</p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div key={quote.id} className="border border-vermilion/20 p-4 hover:bg-deep-brown/5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-deep-brown uppercase tracking-widest text-sm mb-1">
                          {quote.title.vi}
                        </h4>
                        <p className="text-xs text-deep-brown/60 mb-2">{quote.category.vi}</p>
                        <p className="text-sm text-deep-brown/80 line-clamp-2">{quote.text.vi}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditQuote(quote)}
                          className="p-2 text-vermilion hover:bg-vermilion/10 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quotes Edit Tab */}
        {activeTab === 'quotes' && editingQuote && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase tracking-widest text-deep-brown">
                {editingQuote.id && quotes.some(q => q.id === editingQuote.id) ? 'Chỉnh sửa' : 'Thêm mới'} Quote
              </h3>
              <button
                onClick={() => setEditingQuote(null)}
                className="p-2 text-deep-brown/50 hover:bg-deep-brown/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Tiêu đề (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={quoteForm.title?.vi || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    title: { ...quoteForm.title || {}, vi: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Tiêu đề (English)
                </label>
                <input
                  type="text"
                  value={quoteForm.title?.en || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    title: { ...quoteForm.title || {}, en: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Danh mục (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={quoteForm.category?.vi || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    category: { ...quoteForm.category || {}, vi: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Danh mục (English)
                </label>
                <input
                  type="text"
                  value={quoteForm.category?.en || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    category: { ...quoteForm.category || {}, en: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Nội dung (Tiếng Việt)
                </label>
                <textarea
                  value={quoteForm.text?.vi || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    text: { ...quoteForm.text || {}, vi: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm font-mono leading-relaxed resize-none"
                  rows={6}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Nội dung (English)
                </label>
                <textarea
                  value={quoteForm.text?.en || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    text: { ...quoteForm.text || {}, en: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm font-mono leading-relaxed resize-none"
                  rows={6}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Bối cảnh (Tiếng Việt)
                </label>
                <textarea
                  value={quoteForm.context?.vi || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    context: { ...quoteForm.context || {}, vi: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm leading-relaxed resize-none"
                  rows={3}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
                  Bối cảnh (English)
                </label>
                <textarea
                  value={quoteForm.context?.en || ''}
                  onChange={(e) => setQuoteForm({
                    ...quoteForm,
                    context: { ...quoteForm.context || {}, en: e.target.value } as any
                  })}
                  className="w-full px-4 py-3 border border-vermilion/30 bg-white/50 text-deep-brown focus:outline-none focus:border-vermilion text-sm leading-relaxed resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingQuote(null)}
                className="px-6 py-2 border border-vermilion/30 text-deep-brown/70 font-bold uppercase tracking-widest text-xs hover:bg-deep-brown/5 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveQuote}
                className="flex items-center gap-2 px-6 py-2 bg-vermilion text-paper font-bold uppercase tracking-widest text-xs hover:bg-vermilion/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
