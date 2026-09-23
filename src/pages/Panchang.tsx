import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  Sparkles,
  Award,
  RotateCcw,
  BookOpen,
  Feather,
  ShieldAlert,
  Search,
  X,
  Filter,
} from 'lucide-react';
import {
  getJainDate,
  getFestival,
  getJainTimings,
  PACHCHAKKHAN_LIST,
  MONTH_NAMES_HINDI,
  WEEK_DAYS_SHORT,
  JAIN_MONTHS,
  DIGAMBARA_FESTIVALS,
  type FestivalInfo,
} from '../lib/panchang';

interface PanchangProps {
  onBack: () => void;
}

interface DayData {
  day: number;
  tithi: string;
  tithiIndex: number;
  paksha: string;
  jainMonth: string;
  festival: FestivalInfo | null;
  highlight?: boolean;
  current?: boolean;
  dateObj: Date;
  isParvaTithi: boolean;
}

export const Panchang = ({ onBack }: PanchangProps) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());
  const [filterType, setFilterType] = useState<'all' | 'parva' | 'mahapara' | 'kalyanak' | 'vrata'>('all');
  const [selectedPachchakkhan, setSelectedPachchakkhan] = useState<string>('navkarshi');
  const [showAnnualModal, setShowAnnualModal] = useState(false);
  const [annualSearch, setAnnualSearch] = useState('');
  const [annualMonthFilter, setAnnualMonthFilter] = useState<string>('all');
  const [annualCategoryFilter, setAnnualCategoryFilter] = useState<'all' | 'mahapara' | 'kalyanak' | 'vrata'>('all');

  const filteredAnnualFestivals = useMemo(() => {
    return DIGAMBARA_FESTIVALS.filter((f) => {
      if (annualMonthFilter !== 'all' && f.jainMonth !== annualMonthFilter) return false;
      if (annualCategoryFilter !== 'all' && f.category !== annualCategoryFilter) return false;
      if (annualSearch.trim()) {
        const q = annualSearch.trim().toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchDesc = f.description?.toLowerCase().includes(q) ?? false;
        const matchRules = f.rules?.toLowerCase().includes(q) ?? false;
        const matchMonth = f.jainMonth.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchRules && !matchMonth) return false;
      }
      return true;
    });
  }, [annualMonthFilter, annualCategoryFilter, annualSearch]);

  // Compute all day details for the current month synchronously with useMemo (no empty initial render)
  const daysData = useMemo<DayData[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const result: DayData[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const jainDate = getJainDate(date);
      const festivalInfo = getFestival(
        jainDate.tithiLabel,
        jainDate.paksha,
        month,
        jainDate.tithi,
        jainDate.jainMonth
      );

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      result.push({
        day: d,
        tithi: jainDate.tithiLabel,
        tithiIndex: jainDate.tithi,
        paksha: jainDate.pakshaLabel,
        jainMonth: jainDate.jainMonth,
        festival: festivalInfo,
        highlight: festivalInfo?.highlight || jainDate.isParvaTithi,
        current: isToday,
        dateObj: date,
        isParvaTithi: jainDate.isParvaTithi,
      });
    }

    return result;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(1);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  // Ensure selectedDayData always falls back gracefully
  const selectedDayData: DayData = useMemo(() => {
    return (
      daysData.find((d) => d.day === selectedDay) ||
      daysData.find((d) => d.current) ||
      daysData[0] || {
        day: new Date().getDate(),
        tithi: 'प्रतिपदा',
        tithiIndex: 1,
        paksha: 'शुक्ल',
        jainMonth: 'भाद्रपद',
        festival: null,
        highlight: false,
        current: true,
        dateObj: new Date(),
        isParvaTithi: false,
      }
    );
  }, [daysData, selectedDay]);

  const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Current date Jain info for top banner
  const todayJainInfo = useMemo(() => {
    return getJainDate(selectedDayData?.dateObj || currentDate);
  }, [selectedDayData, currentDate]);

  const selectedDateTimings = useMemo(() => {
    return getJainTimings(selectedDayData?.dateObj || new Date());
  }, [selectedDayData]);

  // Filtered day counts
  const parvaDaysCount = useMemo(() => daysData.filter((d) => d.isParvaTithi).length, [daysData]);
  const mahaparaDaysCount = useMemo(
    () => daysData.filter((d) => d.festival?.category === 'mahapara').length,
    [daysData]
  );
  const kalyanakDaysCount = useMemo(
    () => daysData.filter((d) => d.festival?.category === 'kalyanak').length,
    [daysData]
  );
  const vrataDaysCount = useMemo(
    () => daysData.filter((d) => d.festival?.category === 'vrata').length,
    [daysData]
  );

  const filteredDaysData = useMemo(() => {
    return daysData.filter((d) => {
      if (filterType === 'parva') return d.isParvaTithi;
      if (filterType === 'mahapara') return d.festival?.category === 'mahapara';
      if (filterType === 'kalyanak') return d.festival?.category === 'kalyanak';
      if (filterType === 'vrata') return d.festival?.category === 'vrata';
      return true;
    });
  }, [daysData, filterType]);

  const currentPachchakkhanObj = useMemo(() => {
    return PACHCHAKKHAN_LIST.find((p) => p.id === selectedPachchakkhan) || PACHCHAKKHAN_LIST[0];
  }, [selectedPachchakkhan]);

  return (
    <div className="w-full max-w-7xl mx-auto pt-6 sm:pt-10 md:pt-14 page-bottom-clearance px-3.5 sm:px-6 md:px-8 flex flex-col h-full overflow-x-hidden">
      {/* Top Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-5 mb-6 sm:mb-8 justify-between"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onBack}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-colors backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 group-hover:text-amber-200" />
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-gotu font-bold">
                वीर निर्वाण संवत् {todayJainInfo.vnsYear}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-gotu">
                विक्रम संवत् {todayJainInfo.vikramYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-white pt-1.5 pb-1 leading-snug">
              दिगम्बर जैन पंचांग
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 font-gotu">
              तिथि, नक्षत्र, सूर्योदय-सूर्यास्त, पर्व एवं नवकारशी समय
            </p>
          </div>
        </div>

        {/* Timings summary pill badges & Annual Directory Button */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-1 no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => setShowAnnualModal(true)}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-amber-500/25 to-amber-600/20 hover:from-amber-500/35 hover:to-amber-600/30 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-gotu font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10 shrink-0"
            title="सभी १२ जैन महीनों के पर्व व कल्याणक"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>वार्षिक पर्व निर्देशिका ({DIGAMBARA_FESTIVALS.length})</span>
          </motion.button>

          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }}
            variant="gilded"
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-amber-500/30 whitespace-nowrap shrink-0"
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block font-gotu">सूर्योदय</span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-amber-200">{selectedDateTimings.sunrise}</span>
            </div>
          </GlassCard>

          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.15, glareColor: 'gold' }}
            variant="sacred"
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-amber-500/40 whitespace-nowrap shrink-0 bg-amber-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] text-amber-300 font-gotu font-semibold block">नवकारशी (पारणा)</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-100">{selectedDateTimings.navkarshi}</span>
            </div>
          </GlassCard>

          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }}
            variant="gilded"
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-rose-500/30 whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] text-rose-300 font-gotu block">चौविहार (भोजन त्याग)</span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-rose-200">{selectedDateTimings.chauvihar}</span>
            </div>
          </GlassCard>

          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'white' }}
            variant="gilded"
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-blue-500/30 whitespace-nowrap shrink-0"
          >
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block font-gotu">सूर्यास्त</span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-blue-200">{selectedDateTimings.sunset}</span>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Calendar Card (8 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-8 w-full"
        >
          <GlassCard variant="gilded" className="p-4 sm:p-6 md:p-7">
            {/* Month Header & Controls */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-notoserif font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>
                    {MONTH_NAMES_HINDI[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                </h2>
                <span className="text-xs font-gotu text-amber-300/90 flex items-center gap-1.5 mt-1">
                  <Feather className="w-3.5 h-3.5 text-amber-400" />
                  जैन मास: <strong className="text-amber-200">{todayJainInfo.jainMonth} मास</strong> • वीर संवत् {todayJainInfo.vnsYear}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={handleResetToToday}
                  title="आज का दिन"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-gotu font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>आज</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={handlePrevMonth}
                  aria-label="पिछला माह"
                  className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={handleNextMonth}
                  aria-label="अगला माह"
                  className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Parva Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 pb-3 border-b border-white/5">
              <span className="text-xs text-slate-400 font-gotu mr-1">पर्व फ़िल्टर:</span>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => setFilterType('all')}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border transition-[background-color,border-color,color] ${
                  filterType === 'all'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                सभी दिन ({daysData.length})
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => setFilterType('parva')}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border flex items-center gap-1 transition-[background-color,border-color,color] ${
                  filterType === 'parva'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <span>⭐ अष्टमी/चौदस</span>
                <span className="text-[10px] px-1 rounded-full bg-white/10 font-mono">{parvaDaysCount}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => setFilterType('mahapara')}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border flex items-center gap-1 transition-[background-color,border-color,color] ${
                  filterType === 'mahapara'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <span>🚩 महापर्व</span>
                <span className="text-[10px] px-1 rounded-full bg-white/10 font-mono">{mahaparaDaysCount}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => setFilterType('kalyanak')}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border flex items-center gap-1 transition-[background-color,border-color,color] ${
                  filterType === 'kalyanak'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <span>🙏 कल्याणक</span>
                <span className="text-[10px] px-1 rounded-full bg-white/10 font-mono">{kalyanakDaysCount}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => setFilterType('vrata')}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border flex items-center gap-1 transition-[background-color,border-color,color] ${
                  filterType === 'vrata'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <span>🪷 व्रत व साधना</span>
                <span className="text-[10px] px-1 rounded-full bg-white/10 font-mono">{vrataDaysCount}</span>
              </motion.button>
            </div>

            {/* Desktop / Tablet Calendar Grid */}
            <div className="hidden sm:block">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEK_DAYS_SHORT.map((day) => (
                  <div
                    key={day}
                    className="bg-white/[0.03] border border-white/5 rounded-xl py-1.5 text-center text-xs font-bold text-amber-300/90 uppercase tracking-wider font-gotu"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-2">
                {[...Array(startDayOfWeek)].map((_, i) => (
                  <div
                    key={`pad-${i}`}
                    className="min-h-[85px] md:min-h-[96px] rounded-xl bg-slate-950/20 border border-transparent opacity-20 pointer-events-none"
                  />
                ))}

                {daysData.map((d) => {
                  const isSelected = selectedDay === d.day;
                  const isDimmed = filterType !== 'all' && !filteredDaysData.some((fd) => fd.day === d.day);

                  return (
                    <motion.button
                      key={d.day}
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDay(d.day)}
                      className={`min-h-[85px] md:min-h-[96px] p-2 rounded-xl border transition-colors flex flex-col justify-between text-left relative group cursor-pointer ${
                        isDimmed ? 'opacity-30' : ''
                      } ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_16px_rgba(245,158,11,0.2)] ring-1 ring-amber-400 z-10'
                          : d.current
                          ? 'bg-amber-500/10 border-amber-400/60 text-amber-200 shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_10px_rgba(245,158,11,0.10)]'
                          : d.isParvaTithi
                          ? 'bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-400/50'
                          : 'bg-slate-900/60 border-white/5 hover:bg-white/[0.08] hover:border-white/20 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-sm font-bold font-notoserif ${
                              d.current ? 'text-amber-300 font-extrabold' : ''
                            }`}
                          >
                            {d.day}
                          </span>
                          {d.isParvaTithi && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="पर्व तिथि" />
                          )}
                        </div>

                        {d.paksha === 'शुक्ल' ? (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-white shadow-[0_0_6px_rgba(254,243,199,0.5),0_1px_2px_rgba(0,0,0,0.5)] shrink-0"
                            title="शुक्ल पक्ष (सुद)"
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] shrink-0"
                            title="कृष्ण पक्ष (वद)"
                          />
                        )}
                      </div>

                      <div className="mt-1 w-full space-y-0.5">
                        <span
                          className={`text-[10px] font-gotu block truncate ${
                            d.isParvaTithi ? 'text-amber-200 font-semibold' : 'text-slate-300/80'
                          }`}
                        >
                          {d.tithi}
                        </span>

                        {d.festival && (
                          <span
                            className={`text-[9px] leading-tight block font-gotu truncate px-1 py-0.5 rounded ${
                              d.festival.category === 'mahapara'
                                ? 'bg-amber-500/35 text-amber-100 border border-amber-400/50 font-bold'
                                : d.festival.category === 'kalyanak'
                                ? 'bg-blue-500/25 text-blue-200 border border-blue-400/40 font-semibold'
                                : d.highlight
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {d.festival.name}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Calendar Grid (< 640px) */}
            <div className="sm:hidden flex flex-col gap-3">
              <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-white/10">
                <div className="grid grid-cols-7 mb-1.5">
                  {WEEK_DAYS_SHORT.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] text-amber-300 font-bold p-1 font-gotu"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(startDayOfWeek)].map((_, i) => (
                    <div key={`m-pad-${i}`} className="h-10" />
                  ))}
                  {daysData.map((d) => {
                    const isSelected = selectedDay === d.day;
                    return (
                      <motion.button
                        key={d.day}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedDay(d.day)}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_2px_10px_rgba(245,158,11,0.35),0_1px_2px_rgba(0,0,0,0.4)] scale-105 z-10'
                            : d.current
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                            : d.isParvaTithi
                            ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-notoserif font-bold leading-none">{d.day}</span>
                        <span className="text-[8px] font-gotu opacity-85 mt-0.5 truncate max-w-[36px]">
                          {d.tithi.slice(0, 4)}
                        </span>
                        {d.festival && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1 ${
                              isSelected ? 'bg-slate-950' : 'bg-amber-400'
                            }`}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sidebar Info Panels (4 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 w-full space-y-4 sm:space-y-5"
        >
          {/* Selected Tithi Details Card */}
          <GlassCard
            tilt={{ maxTilt: 7, glareMaxOpacity: 0.15, glareColor: 'gold' }}
            variant="sacred"
            className="p-5 sm:p-6 border-amber-500/35 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-300 font-cinzel text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>जैन तिथि विवरण</span>
              </span>
              {selectedDayData.isParvaTithi && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] sm:text-[10px] font-gotu font-bold">
                  ⭐ पर्व दिवस
                </span>
              )}
            </div>

            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 font-notoserif">
              {selectedDayData.jainMonth} {selectedDayData.paksha} {selectedDayData.tithi}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-gotu">
              {selectedDayData.day} {MONTH_NAMES_HINDI[currentDate.getMonth()]}, वीर निर्वाण संवत् {todayJainInfo.vnsYear} (विक्रम {todayJainInfo.vikramYear})
            </p>

            {/* Festival / Parva Description if any */}
            {selectedDayData.festival && (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-100 text-xs font-gotu">
                <strong className="block text-amber-200 text-sm mb-1 font-notoserif">
                  🚩 {selectedDayData.festival.name}
                </strong>
                {selectedDayData.festival.description && (
                  <p className="text-slate-300 leading-relaxed">{selectedDayData.festival.description}</p>
                )}
                {selectedDayData.festival.rules && (
                  <p className="mt-1.5 text-amber-300/90 font-semibold">
                    नियम: {selectedDayData.festival.rules}
                  </p>
                )}
              </div>
            )}

            {/* Jain Timings Table */}
            <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2 text-xs sm:text-sm font-gotu">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> सूर्योदय
                </span>
                <span className="text-amber-200 font-mono font-medium">{selectedDateTimings.sunrise}</span>
              </div>

              <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> नवकारशी (पारणा)
                </span>
                <span className="text-amber-100 font-mono font-bold">{selectedDateTimings.navkarshi}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">पोरसी (१ प्रहर)</span>
                <span className="text-slate-200 font-mono">{selectedDateTimings.porsi}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">साढ़-पोरसी (१.५ प्रहर)</span>
                <span className="text-slate-200 font-mono">{selectedDateTimings.sadhPorsi}</span>
              </div>

              <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> चौविहार (रात्रि भोजन त्याग)
                </span>
                <span className="text-rose-200 font-mono font-bold">{selectedDateTimings.chauvihar}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-300" /> सूर्यास्त
                </span>
                <span className="text-blue-200 font-mono font-medium">{selectedDateTimings.sunset}</span>
              </div>
            </div>
          </GlassCard>

          {/* Authentic Jain Pachchakkhan / Sankalpa Card */}
          <GlassCard
            tilt={{ maxTilt: 7, glareMaxOpacity: 0.14, glareColor: 'gold' }}
            variant="sacred"
            className="p-5 sm:p-6 bg-gradient-to-br from-[#061814]/90 via-slate-900/80 to-[#030712]/90 border-emerald-500/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-emerald-300 font-notoserif font-bold text-base sm:text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>जैन पच्चक्खाण सूत्र</span>
              </h3>
              <span className="text-[10px] font-gotu text-emerald-400/80 uppercase">आत्म-संयम</span>
            </div>

            {/* Pachchakkhan Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
              {PACHCHAKKHAN_LIST.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={() => setSelectedPachchakkhan(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-gotu whitespace-nowrap cursor-pointer border transition-[background-color,border-color,color] ${
                    selectedPachchakkhan === item.id
                      ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 font-semibold shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {item.title.replace(' पच्चक्खाण', '')}
                </motion.button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
              <div className="flex justify-between items-center text-[11px] text-emerald-300 font-gotu font-semibold">
                <span>{currentPachchakkhanObj.title}</span>
                <span className="font-mono text-emerald-400/80">{currentPachchakkhanObj.tag}</span>
              </div>
              <p className="text-xs sm:text-sm font-gotu text-emerald-100 leading-relaxed font-medium italic">
                "{currentPachchakkhanObj.formula}"
              </p>
            </div>
          </GlassCard>

          {/* Month's Jain Festivals / Parvas Card */}
          <GlassCard
            tilt={{ maxTilt: 7, glareMaxOpacity: 0.12, glareColor: 'amber' }}
            variant="gilded"
            className="p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2 text-amber-300">
                <Award className="w-4 h-4" />
                <h3 className="font-bold font-notoserif text-sm sm:text-base">इस माह के प्रमुख पर्व व कल्याणक</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-gotu">
                {daysData.filter((d) => d.festival).length} पर्व
              </span>
            </div>

            <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {daysData
                .filter((d) => d.festival)
                .map((d) => (
                  <li
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className={`flex gap-3 items-center p-2 rounded-xl border transition-all cursor-pointer ${
                      selectedDay === d.day
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-sm'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold leading-none font-notoserif">{d.day}</span>
                      <span className="text-[8px] font-gotu text-amber-400/70 mt-0.5">{d.paksha.slice(0, 3)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium font-gotu text-xs sm:text-sm truncate">
                        {d.festival?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-gotu">
                        {d.jainMonth} {d.paksha} {d.tithi}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>

            <button
              onClick={() => setShowAnnualModal(true)}
              className="w-full mt-3 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-gotu font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>सम्पूर्ण दिगम्बर जैन वार्षिक पर्व देखें (12 मास)</span>
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Annual Digambara Festivals Directory Modal */}
      <AnimatePresence>
        {showAnnualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 border border-amber-500/30 shadow-2xl shadow-amber-950/40 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-notoserif text-white flex items-center gap-2">
                      <span>सम्पूर्ण दिगम्बर जैन वार्षिक पर्व निर्देशिका</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                        {DIGAMBARA_FESTIVALS.length} पर्व
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-gotu">
                      १२ जैन मास के सभी महापर्व, कल्याणक, अष्टान्हिका, दशलक्षण एवं व्रत
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAnnualModal(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search & Filters */}
              <div className="p-4 sm:p-6 border-b border-white/10 space-y-3 shrink-0 bg-white/[0.01]">
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={annualSearch}
                    onChange={(e) => setAnnualSearch(e.target.value)}
                    placeholder="पर्व, तीर्थंकर, कल्याणक या मास खोजें (जैसे: महावीर, दशलक्षण, पार्श्वनाथ, श्रुतपंचमी)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:bg-amber-500/5 text-sm text-white placeholder-slate-400 font-gotu outline-none transition-all"
                  />
                  {annualSearch && (
                    <button
                      onClick={() => setAnnualSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-slate-400 font-gotu mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-400" /> श्रेणी:
                  </span>
                  {[
                    { id: 'all', label: 'सभी पर्व' },
                    { id: 'mahapara', label: '🚩 महापर्व' },
                    { id: 'kalyanak', label: '🕊️ कल्याणक' },
                    { id: 'vrata', label: '🪷 व्रत व आराधना' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAnnualCategoryFilter(cat.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-gotu cursor-pointer border transition-colors ${
                        annualCategoryFilter === cat.id
                          ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Jain Months Filter Row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-gotu">
                  <button
                    onClick={() => setAnnualMonthFilter('all')}
                    className={`px-2.5 py-1 rounded-lg shrink-0 cursor-pointer border transition-colors ${
                      annualMonthFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-white/5 text-slate-300 border-white/5 hover:text-white'
                    }`}
                  >
                    सभी १२ मास
                  </button>
                  {JAIN_MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setAnnualMonthFilter(m)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 cursor-pointer border transition-colors ${
                        annualMonthFilter === m
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Festivals List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
                {filteredAnnualFestivals.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-gotu">
                    <p className="text-base text-slate-300">कोई पर्व नहीं मिला</p>
                    <p className="text-xs mt-1 text-slate-500">कृपया खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredAnnualFestivals.map((fest) => {
                      const pakshaLabel = fest.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण';
                      return (
                        <div
                          key={fest.id}
                          className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-2 group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-gotu font-bold">
                                {fest.jainMonth} {pakshaLabel} {fest.tithi === 15 ? (fest.paksha === 'Shukla' ? 'पूर्णिमा' : 'अमावस्या') : `${fest.tithi}`}
                              </span>
                              <span
                                className={`text-[10px] font-gotu px-2 py-0.5 rounded-full border ${
                                  fest.category === 'mahapara'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold'
                                    : fest.category === 'kalyanak'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                }`}
                              >
                                {fest.category === 'mahapara'
                                  ? '🚩 महापर्व'
                                  : fest.category === 'kalyanak'
                                  ? '🕊️ कल्याणक'
                                  : '🪷 व्रत/साधना'}
                              </span>
                            </div>

                            <h3 className="text-base font-bold font-notoserif text-white group-hover:text-amber-200 transition-colors leading-snug">
                              {fest.name}
                            </h3>

                            <p className="text-xs text-slate-300 font-gotu mt-1 leading-relaxed">
                              {fest.description}
                            </p>
                          </div>

                          {fest.rules && (
                            <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300/90 font-gotu flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>नियम / अनुष्ठान: {fest.rules}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02] text-xs font-gotu text-slate-400">
                <span>कुल प्रदर्शित पर्व: {filteredAnnualFestivals.length}</span>
                <button
                  onClick={() => setShowAnnualModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
