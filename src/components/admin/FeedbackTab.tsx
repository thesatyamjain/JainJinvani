import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  Tag,
  Sparkles,
  RefreshCw,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { GOOGLE_SHEET_WEBHOOK_URL } from '../features/FeedbackModal';

export interface AdminContributionItem {
  id: number | string;
  timestamp: string;
  type: string;
  scriptureName: string;
  details: string;
  status: string;
}

interface FeedbackTabProps {
  showToast: (msg: string) => void;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ showToast }) => {
  const [items, setItems] = useState<AdminContributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const [columns] = useState<1 | 2 | 3>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jinvani_admin_columns');
      if (saved === '1' || saved === '2' || saved === '3') {
        return Number(saved) as 1 | 2 | 3;
      }
    }
    return 2;
  });

  const getWebhookUrl = () => {
    const custom = localStorage.getItem('jinvani_webhook_url') || '';
    return custom.trim() || GOOGLE_SHEET_WEBHOOK_URL;
  };

  const fetchData = async (isManualRefresh = false) => {
    const activeWebhookUrl = getWebhookUrl();
    if (!activeWebhookUrl) {
      setFetchError('गूगल शीट वेबहुक URL कॉन्फ़िगर नहीं है।');
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(activeWebhookUrl);
      if (!res.ok) {
        throw new Error(`सर्वर से उत्तर नहीं मिला (${res.status})`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        const validData = data.filter(
          (item) => item && ((item.details && item.details.trim() !== '') || (item.scriptureName && item.scriptureName.trim() !== ''))
        );

        try {
          const deletedStr = localStorage.getItem('jinvani_deleted_items');
          const deletedIds: Record<string, boolean> = deletedStr ? JSON.parse(deletedStr) : {};
          const activeData = validData.filter((item) => !deletedIds[String(item.id)]);

          const overridesStr = localStorage.getItem('jinvani_status_overrides');
          const overrides: Record<string, string> = overridesStr ? JSON.parse(overridesStr) : {};
          const merged = activeData.map((item) => {
            const overrideStatus = overrides[String(item.id)];
            return overrideStatus ? { ...item, status: overrideStatus } : item;
          });
          setItems(merged);
        } catch {
          setItems(validData);
        }
      } else {
        setItems([]);
      }
      if (isManualRefresh) showToast('गूगल शीट से ताज़ा डेटा लोड हुआ!');
    } catch (err: any) {
      console.error('Admin dashboard failed to fetch from Google Sheet:', err);
      setFetchError('डेटा लोड करने में असमर्थ। कृपया इंटरनेट या वेबहुक URL जाँचें।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (item: AdminContributionItem, newStatus: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
    );

    try {
      const overridesStr = localStorage.getItem('jinvani_status_overrides');
      const overrides: Record<string, string> = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[String(item.id)] = newStatus;
      localStorage.setItem('jinvani_status_overrides', JSON.stringify(overrides));
    } catch {}

    showToast(`पंक्ति #${item.id} की स्थिति "${newStatus}" कर दी गई!`);

    try {
      await fetch(getWebhookUrl(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          rowId: item.id,
          timestamp: item.timestamp,
          scriptureName: item.scriptureName,
          newStatus: newStatus,
        }),
      });
    } catch (err) {
      console.warn('Background sync to sheet failed, stored locally:', err);
    }
  };

  const handleDeleteItem = async (item: AdminContributionItem) => {
    const confirmDelete = window.confirm(
      `क्या आप प्रविष्टि #${item.id} (${item.scriptureName || 'सुझाव'}) को हटाना चाहते हैं?\n\nयह प्रविष्टि डैशबोर्ड और गूगल शीट से हटा दी जाएगी।`
    );
    if (!confirmDelete) return;

    setItems((prev) => prev.filter((it) => it.id !== item.id));

    try {
      const deletedStr = localStorage.getItem('jinvani_deleted_items');
      const deletedIds: Record<string, boolean> = deletedStr ? JSON.parse(deletedStr) : {};
      deletedIds[String(item.id)] = true;
      localStorage.setItem('jinvani_deleted_items', JSON.stringify(deletedIds));

      const overridesStr = localStorage.getItem('jinvani_status_overrides');
      if (overridesStr) {
        const overrides: Record<string, string> = JSON.parse(overridesStr);
        delete overrides[String(item.id)];
        localStorage.setItem('jinvani_status_overrides', JSON.stringify(overrides));
      }
    } catch (err) {
      console.error('Failed to save deleted item to localStorage:', err);
    }

    showToast(`प्रविष्टि #${item.id} सफलतापूर्वक हटा दी गई!`);

    try {
      await fetch(getWebhookUrl(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          rowId: item.id,
          timestamp: item.timestamp,
          scriptureName: item.scriptureName,
        }),
      });
    } catch (err) {
      console.warn('Background sync delete to sheet failed, stored locally:', err);
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const resolved = items.filter(
      (item) =>
        item.status?.includes('सुधारा') ||
        item.status?.includes('स्वीकृत') ||
        item.status?.toLowerCase().includes('resolved') ||
        item.status?.toLowerCase().includes('done')
    ).length;
    const inReview = items.filter(
      (item) =>
        item.status?.includes('समीक्षा') ||
        item.status?.includes('प्रगति') ||
        item.status?.toLowerCase().includes('review')
    ).length;
    const pending = total - resolved - inReview;
    return { total, resolved, inReview, pending };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTypeFilter !== 'all') {
        if (activeTypeFilter === 'correction' && !item.type?.includes('अशुद्धि')) return false;
        if (activeTypeFilter === 'new_text' && !item.type?.includes('नया पाठ')) return false;
        if (activeTypeFilter === 'general' && !item.type?.includes('सामान्य')) return false;
      }

      if (activeStatusFilter !== 'all') {
        const isItemResolved =
          item.status?.includes('सुधारा') ||
          item.status?.includes('स्वीकृत') ||
          item.status?.toLowerCase().includes('resolved');
        const isItemReview =
          item.status?.includes('समीक्षा') ||
          item.status?.includes('प्रगति') ||
          item.status?.toLowerCase().includes('review');

        if (activeStatusFilter === 'resolved' && !isItemResolved) return false;
        if (activeStatusFilter === 'in_review' && !isItemReview) return false;
        if (activeStatusFilter === 'pending' && (isItemResolved || isItemReview)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesScripture = item.scriptureName?.toLowerCase().includes(q);
        const matchesDetails = item.details?.toLowerCase().includes(q);
        const matchesType = item.type?.toLowerCase().includes(q);
        if (!matchesScripture && !matchesDetails && !matchesType) return false;
      }

      return true;
    });
  }, [items, activeTypeFilter, activeStatusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const isResolved =
      status?.includes('सुधारा') ||
      status?.includes('स्वीकृत') ||
      status?.toLowerCase().includes('resolved');
    const isReview =
      status?.includes('समीक्षा') ||
      status?.includes('प्रगति') ||
      status?.toLowerCase().includes('review');

    if (isResolved) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{status || 'सुधारा गया'}</span>
        </span>
      );
    }

    if (isReview) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{status || 'समीक्षा में'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-blue-500/15 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
        <Clock className="w-3 h-3 text-blue-400 shrink-0" />
        <span>{status || 'प्राप्त हुआ'}</span>
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    if (type?.includes('अशुद्धि')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 whitespace-nowrap">
          ✍️ अशुद्धि
        </span>
      );
    }
    if (type?.includes('नया पाठ') || type?.includes('addition')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30 text-blue-300 whitespace-nowrap">
          📖 नया पाठ
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-400/30 text-purple-300 whitespace-nowrap">
        💡 सुझाव
      </span>
    );
  };

  return (
    <>
      {/* Page Title & Clean Header Layout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center text-center mb-6 relative z-10 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-gotu">प्रशासक नियंत्रण कक्ष • Admin Panel</span>
        </div>

        <h1 className="w-full text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 leading-tight mb-2.5">
          जिनवाणी संवर्धन एवं अशुद्धि प्रबंधन
        </h1>
        <p className="text-xs sm:text-sm text-slate-200/85 font-gotu leading-relaxed max-w-[65ch] mx-auto px-2">
          उपयोगकर्ताओं द्वारा भेजे गए समस्त सुझाव व अशुद्धि रिपोर्ट सीधे आपकी Google Sheet से सुरक्षित रूप से लोड हो रहे हैं। आप यहीं से स्थिति बदल सकते हैं।
        </p>
      </motion.div>

      {/* Live Stats Bento Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 relative z-10">
        <GlassCard
          variant="sacred"
          className="p-3.5 sm:p-4 rounded-2xl border-white/10 bg-[#0c1222]/80 flex flex-col justify-between hover:border-amber-400/40 transition-colors"
        >
          <div className="text-[11px] sm:text-xs text-slate-400 font-gotu">कुल सुझाव</div>
          <div className="text-xl sm:text-3xl font-notoserif font-bold text-white mt-1">
            {isLoading ? '...' : stats.total}
          </div>
          <div className="text-[10px] text-amber-400/80 font-gotu mt-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>गूगल शीट से लाइव</span>
          </div>
        </GlassCard>

        <GlassCard
          variant="sacred"
          className="p-3.5 sm:p-4 rounded-2xl border-emerald-500/25 bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
        >
          <div className="text-[11px] sm:text-xs text-emerald-300 font-gotu">सुधारा गया / पूर्ण</div>
          <div className="text-xl sm:text-3xl font-notoserif font-bold text-emerald-200 mt-1">
            {isLoading ? '...' : stats.resolved}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-gotu mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>स्थिति: पूर्ण</span>
          </div>
        </GlassCard>

        <GlassCard
          variant="sacred"
          className="p-3.5 sm:p-4 rounded-2xl border-amber-500/25 bg-amber-950/20 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
        >
          <div className="text-[11px] sm:text-xs text-amber-300 font-gotu">समीक्षाधीन</div>
          <div className="text-xl sm:text-3xl font-notoserif font-bold text-amber-200 mt-1">
            {isLoading ? '...' : stats.inReview}
          </div>
          <div className="text-[10px] text-amber-400/80 font-gotu mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>जांच प्रक्रिया जारी</span>
          </div>
        </GlassCard>

        <GlassCard
          variant="sacred"
          className="p-3.5 sm:p-4 rounded-2xl border-blue-500/25 bg-blue-950/20 flex flex-col justify-between hover:border-blue-500/50 transition-colors"
        >
          <div className="text-[11px] sm:text-xs text-blue-300 font-gotu">नवीन प्राप्त</div>
          <div className="text-xl sm:text-3xl font-notoserif font-bold text-blue-200 mt-1">
            {isLoading ? '...' : stats.pending}
          </div>
          <div className="text-[10px] text-blue-400/80 font-gotu mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>समीक्षा प्रतीक्षित</span>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="w-full space-y-3 mb-6 relative z-10">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ग्रंथ का नाम, अशुद्धि या विवरण खोजें..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-amber-500/25 text-amber-100 placeholder:text-slate-500 text-xs sm:text-sm font-gotu focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-gotu"
            >
              ✕ साफ़ करें
            </button>
          )}
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1222]/80 border border-white/10 space-y-3">
          {/* Row 1: Type Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] sm:text-xs text-amber-300 font-semibold font-gotu min-w-[50px]">
              प्रकार:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'सभी प्रकार' },
                { id: 'correction', label: '✍️ अशुद्धि सुधार' },
                { id: 'new_text', label: '📖 नया पाठ' },
                { id: 'general', label: '💡 सामान्य' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveTypeFilter(filter.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-gotu transition-all cursor-pointer ${
                    activeTypeFilter === filter.id
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Status Filters */}
          <div className="flex items-center gap-3 pt-2.5 border-t border-white/5 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs text-amber-300 font-semibold font-gotu min-w-[50px]">
                स्थिति:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'सभी स्थिति' },
                  { id: 'resolved', label: '🟢 पूर्ण (Resolved)' },
                  { id: 'in_review', label: '🟡 समीक्षा में' },
                  { id: 'pending', label: '⚪ नवीन' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveStatusFilter(filter.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-gotu transition-all cursor-pointer ${
                      activeStatusFilter === filter.id
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="w-full relative z-10">
        {isLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm font-gotu text-amber-200/80">गूगल शीट से सुझाव लोड हो रहे हैं...</p>
          </div>
        ) : fetchError && items.length === 0 ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-200 text-sm font-gotu">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p>{fetchError}</p>
            <button
              onClick={() => fetchData(true)}
              className="mt-3 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-gotu transition-colors cursor-pointer"
            >
              पुनः प्रयास करें
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0c1222]/50 border border-white/5 text-center text-slate-400 text-sm font-gotu">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-300 font-medium">कोई सुझाव या रिपोर्ट नहीं मिली।</p>
            <p className="text-xs text-slate-500 mt-1">फ़िल्टर बदलकर देखें या सर्च रीसेट करें।</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-gotu px-1">
              <div className="flex items-center gap-2">
                <span>कुल {filteredItems.length} प्रविष्टियाँ प्रदर्शित</span>
                {(activeTypeFilter !== 'all' || activeStatusFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveTypeFilter('all');
                      setActiveStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-amber-400 hover:underline cursor-pointer text-xs"
                  >
                    (रीसेट)
                  </button>
                )}
              </div>
            </div>

            <div
              className={`grid gap-2.5 sm:gap-4 ${
                columns === 1
                  ? 'grid-cols-1'
                  : columns === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  className="h-full"
                >
                  <GlassCard
                    variant="sacred"
                    className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-white/10 bg-[#0c1222]/85 hover:border-amber-500/40 transition-all flex flex-col justify-between h-full shadow-lg"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getTypeBadge(item.type)}
                          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded-md">
                            #{item.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(item.status)}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item);
                            }}
                            title="प्रविष्टि हटाएं (Delete)"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Scripture / Text Name */}
                      <h3 className="text-sm sm:text-base lg:text-lg font-notoserif font-bold text-amber-100 mb-1 leading-snug line-clamp-2" title={item.scriptureName}>
                        {item.scriptureName || 'अनाम शास्त्र / सामान्य सुझाव'}
                      </h3>

                      {/* Timestamp */}
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-gotu mb-2.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{item.timestamp || 'दिनांक अनुपलब्ध'}</span>
                      </div>

                      {/* User Suggestion Content */}
                      <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200 text-[11px] sm:text-xs md:text-sm font-gotu leading-relaxed break-words line-clamp-4 hover:line-clamp-none transition-all">
                        {item.details}
                      </div>
                    </div>

                    {/* Admin Direct Status Action Toolbar */}
                    <div className="pt-2 sm:pt-2.5 border-t border-white/5 mt-3 sm:mt-4">
                      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-gotu">
                        <button
                          onClick={() => handleUpdateStatus(item, 'सुधारा गया')}
                          title="स्थिति को 'सुधारा गया' चिह्नित करें"
                          className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                            item.status?.includes('सुधारा') || item.status?.includes('स्वीकृत')
                              ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">सुधारा</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(item, 'समीक्षा में')}
                          title="स्थिति को 'समीक्षा में' चिह्नित करें"
                          className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                            item.status?.includes('समीक्षा')
                              ? 'bg-amber-500/25 border-amber-500/60 text-amber-200 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300'
                          }`}
                        >
                          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">समीक्षा</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(item, 'प्राप्त हुआ')}
                          title="स्थिति को 'नवीन प्राप्त' चिह्नित करें"
                          className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                            !item.status?.includes('सुधारा') && !item.status?.includes('समीक्षा')
                              ? 'bg-blue-500/25 border-blue-500/60 text-blue-200 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-blue-500/20 hover:text-blue-300'
                          }`}
                        >
                          <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">नवीन</span>
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Quick Guide Banner */}
      <div className="w-full mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xl text-center space-y-1.5 text-xs font-gotu text-amber-200/90">
        <div className="font-bold text-amber-300 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>प्रशासक नियंत्रण (Admin Control Info)</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-300">
          आप सीधे ऊपर दिए गए <strong>"Quick Status"</strong> बटनों पर क्लिक करके स्थिति को "सुधारा गया" या "समीक्षा में" सेट कर सकते हैं। यह परिवर्तन आपके डैशबोर्ड में तुरंत दिखेगा और आपकी Google Sheet से भी सिंक रहेगा।
        </p>
      </div>
    </>
  );
};
