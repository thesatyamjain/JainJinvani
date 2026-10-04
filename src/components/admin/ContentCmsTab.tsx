import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import { contentManifest } from '../../data/modules/contentManifest';
import { getContentByIdAsync } from '../../lib/bridge';
import {
  Search,
  BookOpen,
  Plus,
  Trash2,
  Copy,
  Download,
  Check,
  Sparkles,
  Eye,
  FileCode,
  Save,
  Tag,
  RefreshCw,
  Info,
} from 'lucide-react';

interface VerseItem {
  id?: string;
  number?: string;
  hindi: string;
  meaning?: string;
  english?: string;
}

interface EditableContent {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  type?: string;
  verses: VerseItem[];
}

interface ContentCmsTabProps {
  showToast: (msg: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'समस्त श्रेणियां' },
  { id: 'arti', label: 'आरती' },
  { id: 'chalisa', label: 'चालीसा' },
  { id: 'stotra', label: 'स्तोत्र' },
  { id: 'ritual', label: 'पूजा व विधान' },
  { id: 'bhajan', label: 'भजन' },
  { id: 'path', label: 'दैनिक पाठ' },
  { id: 'shastra', label: 'शास्त्र' },
];

export const ContentCmsTab: React.FC<ContentCmsTabProps> = ({ showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [activeContent, setActiveContent] = useState<EditableContent | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);

  // All entries from manifest
  const allEntries = useMemo(() => {
    return Object.entries(contentManifest).map(([id, mod]) => ({
      id,
      module: mod,
      displayName: id
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    }));
  }, []);

  // Filtered entries by category and search
  const filteredEntries = useMemo(() => {
    return allEntries.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.module === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allEntries, selectedCategory, searchQuery]);

  // Load content when an ID is picked
  const handleSelectContent = async (id: string) => {
    if (!id) return;
    setIsLoadingContent(true);
    setIsNewMode(false);
    setSelectedId(id);

    try {
      const data = await getContentByIdAsync(id);
      if (data) {
        setActiveContent({
          id: data.id || id,
          category: data.category || contentManifest[id] || 'stotra',
          title: data.title || id,
          subtitle: data.subtitle || '',
          type: data.type || 'structured',
          verses: Array.isArray(data.verses)
            ? data.verses.map((v: any, i: number) => ({
                id: v.id || `v-${i}-${Date.now()}`,
                number: v.number,
                hindi: v.hindi || (typeof v === 'string' ? v : ''),
                meaning: v.meaning,
                english: v.english,
              }))
            : [{ id: `v-0-${Date.now()}`, hindi: typeof data.verses === 'string' ? data.verses : '' }],
        });
      } else {
        showToast('पाठ लोड करने में त्रुटि हुई।');
      }
    } catch {
      showToast('सामग्री लोड नहीं हो सकी।');
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Start new empty content
  const handleStartNew = () => {
    setIsNewMode(true);
    setSelectedId('');
    setActiveContent({
      id: 'navin-path-' + Date.now().toString().slice(-4),
      category: selectedCategory === 'all' ? 'stotra' : selectedCategory,
      title: 'नवीन जिनवाणी पाठ',
      subtitle: 'भक्ति एवं स्तुति',
      type: 'structured',
      verses: [
        { id: `v-0-${Date.now()}`, hindi: 'यहाँ प्रथम छंद या मंगलाचरण लिखें...', meaning: 'सरल भावार्थ...' },
        { id: `v-1-${Date.now()}`, number: '१', hindi: 'यहाँ द्वितीय छंद लिखें...', meaning: '' },
      ],
    });
    showToast('नया पाठ प्रारूप तैयार है! नीचे विवरण भरें।');
  };

  // Verse editing helpers
  const handleUpdateVerse = (index: number, field: keyof VerseItem, value: string) => {
    if (!activeContent) return;
    const updated = [...activeContent.verses];
    updated[index] = { ...updated[index], [field]: value };
    setActiveContent({ ...activeContent, verses: updated });
  };

  const handleAddVerse = () => {
    if (!activeContent) return;
    const nextNum = (activeContent.verses.length + 1).toString();
    setActiveContent({
      ...activeContent,
      verses: [
        ...activeContent.verses,
        { id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, number: nextNum, hindi: '', meaning: '' },
      ],
    });
  };

  const handleDeleteVerse = (index: number) => {
    if (!activeContent || activeContent.verses.length <= 1) return;
    const updated = activeContent.verses.filter((_, i) => i !== index);
    setActiveContent({ ...activeContent, verses: updated });
  };

  // Copy JSON to clipboard
  const handleCopyJSON = () => {
    if (!activeContent) return;
    try {
      const jsonStr = JSON.stringify(activeContent, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setIsCopied(true);
      showToast('अपडेटेड JSON क्लिपबोर्ड में कॉपी कर लिया गया!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('कॉपी करने में त्रुटि हुई।');
    }
  };

  // Download JSON file
  const handleDownloadJSON = () => {
    if (!activeContent) return;
    try {
      const blob = new Blob([JSON.stringify(activeContent, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeContent.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`${activeContent.id}.json फ़ाइल डाउनलोड हो गई!`);
    } catch {
      showToast('फ़ाइल डाउनलोड करने में त्रुटि हुई।');
    }
  };

  // Save to Local Override
  const handleSaveLocalOverride = () => {
    if (!activeContent) return;
    try {
      const existing = localStorage.getItem('jinvani_content_overrides');
      const overrides = existing ? JSON.parse(existing) : {};
      overrides[activeContent.id] = activeContent;
      localStorage.setItem('jinvani_content_overrides', JSON.stringify(overrides));
      showToast('स्थानीय ओवरराइड सहेज दिया गया! तुरंत लाइव पूर्वावलोकन सक्रिय है।');
    } catch {
      showToast('सहेजने में त्रुटि हुई।');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl space-y-6 relative z-10"
    >
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-gotu">धर्मग्रंथ एवं स्तोत्र संपादक • Sacred Content CMS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
          जिनवाणी साहित्य एवं स्तोत्र प्रबंधन
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
          यहाँ से आप 450+ स्तोत्रों, चालीसाओं, आरतियों एवं पूजाओं के छंद, अन्वयार्थ अथवा नवीन रचनाओं को बिना कोडिंग के सरलता से संपादित एवं डाउनलोड कर सकते हैं।
        </p>
      </div>

      {/* Top Filter Bar */}
      <GlassCard variant="sacred" className="p-4 sm:p-5 rounded-3xl border-amber-500/25 bg-[#0b1220]/90 shadow-xl space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम से खोजें..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-amber-500/20 rounded-xl text-xs text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-gotu"
            />
          </div>

          <div className="sm:col-span-6">
            <select
              value={selectedId}
              onChange={(e) => handleSelectContent(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/70 border border-amber-500/20 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-gotu"
            >
              <option value="">
                -- स्तोत्र / पाठ चुनें ({filteredEntries.length} उपलब्ध) --
              </option>
              {filteredEntries.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.module}] {item.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleStartNew}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-gotu font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ नवीन पाठ</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Editor & Preview Area */}
      {isLoadingContent ? (
        <div className="p-12 text-center text-amber-200/70 font-gotu text-sm flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span>पवित्र पाठ लोड हो रहा है...</span>
        </div>
      ) : activeContent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Editor */}
          <div className="lg:col-span-7 space-y-4">
            <GlassCard variant="sacred" className="p-5 sm:p-6 rounded-3xl border-amber-500/30 bg-[#0b1220]/95 shadow-xl space-y-4">
              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-200 font-gotu">पाठ का नाम (Title):</label>
                  <input
                    type="text"
                    value={activeContent.title}
                    onChange={(e) => setActiveContent({ ...activeContent, title: e.target.value })}
                    className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl p-2.5 text-xs sm:text-sm text-amber-100 font-gotu focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-200 font-gotu">उपशीर्षक (Subtitle):</label>
                  <input
                    type="text"
                    value={activeContent.subtitle || ''}
                    onChange={(e) => setActiveContent({ ...activeContent, subtitle: e.target.value })}
                    className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl p-2.5 text-xs sm:text-sm text-amber-100 font-gotu focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Verses Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-gotu">
                    छंद व गाथा सूची ({activeContent.verses.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVerse}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-gotu flex items-center gap-1 hover:bg-amber-500/30 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ छंद जोड़ें</span>
                  </button>
                </div>

                <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
                  {activeContent.verses.map((verse, idx) => (
                    <div
                      key={verse.id || `v-${idx}`}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px] font-mono">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={verse.number || ''}
                            onChange={(e) => handleUpdateVerse(idx, 'number', e.target.value)}
                            placeholder="संख्या (उदा. १ या ध्रुवपद)"
                            className="bg-transparent border border-white/10 rounded px-2 py-0.5 text-[11px] text-amber-200 focus:outline-none focus:border-amber-400 font-gotu w-24"
                          />
                        </div>

                        {activeContent.verses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteVerse(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="छंद हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Hindi Verse Text */}
                      <textarea
                        rows={3}
                        value={verse.hindi}
                        onChange={(e) => handleUpdateVerse(idx, 'hindi', e.target.value)}
                        placeholder="छंद की मूल पंक्तियां..."
                        className="w-full bg-slate-900/80 border border-amber-500/20 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 font-gotu leading-relaxed focus:outline-none focus:border-amber-400"
                      />

                      {/* Meaning Text */}
                      <input
                        type="text"
                        value={verse.meaning || ''}
                        onChange={(e) => handleUpdateVerse(idx, 'meaning', e.target.value)}
                        placeholder="सरल अन्वयार्थ / भावार्थ (ऐच्छिक)..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-amber-200/80 font-gotu focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveLocalOverride}
                  className="flex-1 min-w-[140px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>स्थानीय रूप से सहेजें</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJSON}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-gotu text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'कॉपी हुआ' : 'JSON कॉपी'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-gotu text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड</span>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Live Devotee Replica Preview */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard variant="sacred" className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/80 shadow-xl space-y-3 sticky top-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold text-amber-300 font-gotu">
                <Eye className="w-3.5 h-3.5" />
                <span>श्रद्धालु दृश्य (Live Preview)</span>
              </div>

              {/* Replica Scripture Header */}
              <div className="text-center py-2 border-b border-amber-500/20">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  {activeContent.category}
                </span>
                <h3 className="text-lg sm:text-xl font-notoserif font-bold text-amber-100 mt-1.5">
                  {activeContent.title || 'शीर्षक'}
                </h3>
                {activeContent.subtitle && (
                  <p className="text-xs text-slate-400 font-gotu mt-0.5">{activeContent.subtitle}</p>
                )}
              </div>

              {/* Replica Verses Scroll */}
              <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                {activeContent.verses.map((verse, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
                    {verse.number && (
                      <span className="text-[11px] font-bold text-amber-400/90 block mb-1 font-gotu">
                        ॥ छंद {verse.number} ॥
                      </span>
                    )}
                    <p className="text-xs sm:text-sm font-gotu text-slate-100 leading-relaxed whitespace-pre-line">
                      {verse.hindi || '...'}
                    </p>
                    {verse.meaning && (
                      <p className="text-[11px] font-gotu text-amber-200/80 mt-2 pt-1.5 border-t border-white/5 italic">
                        भावार्थ: {verse.meaning}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2 text-[11px] text-slate-400 font-gotu">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>डाउनलोड की गई JSON फ़ाइल को GitHub Desktop में 'Commit & Push' करके 45 सेकंड में सभी यूज़र्स के लिए लाइव करें।</span>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <GlassCard variant="sacred" className="p-10 rounded-3xl border-dashed border-amber-500/30 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-amber-400/60 mx-auto" />
          <h4 className="text-base font-gotu font-semibold text-amber-200">
            ऊपर दिए गए मेन्यू से कोई स्तोत्र चुनें अथवा नवीन पाठ बनाएं
          </h4>
          <p className="text-xs text-slate-400 font-gotu max-w-md mx-auto">
            आपके चयन के बाद यहाँ उसका पूरा विवरण और संपादन फ़ॉर्म खुल जाएगा, जिसे आप बदलकर 1-क्लिक में डाउनलोड या कॉपी कर सकते हैं।
          </p>
        </GlassCard>
      )}
    </motion.div>
  );
};
