import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Award,
  RotateCcw,
} from 'lucide-react';
import { getJainDate, getFestival, MONTH_NAMES_HINDI, WEEK_DAYS_HINDI } from '../lib';

interface PanchangProps {
  onBack: () => void;
}

interface DayData {
  day: number;
  tithi: string;
  paksha: string;
  festival: string;
  highlight?: boolean;
  current?: boolean;
  dateObj: Date;
}

export const Panchang = ({ onBack }: PanchangProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate calendar data for the displayed month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const newDaysData: DayData[] = [];

    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const jainDate = getJainDate(date);
      const festivalInfo = getFestival(jainDate.tithiLabel, jainDate.paksha, month);

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      newDaysData.push({
        day: d,
        tithi: jainDate.tithiLabel,
        paksha: jainDate.pakshaLabel,
        festival: festivalInfo?.name || '',
        highlight: festivalInfo?.highlight || false,
        current: isToday,
        dateObj: date,
      });
    }

    setDaysData(newDaysData);

    if (month === today.getMonth() && year === today.getFullYear()) {
      setSelectedDay(today.getDate());
    } else {
      setSelectedDay(1);
    }
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleResetToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  const selectedDayData = selectedDay ? daysData.find((d) => d.day === selectedDay) : null;
  const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="w-full max-w-7xl mx-auto pt-12 md:pt-16 pb-36 px-4 sm:px-6 md:px-8 flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-4 mb-8 justify-between"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-notoserif font-bold text-white tracking-wide">
              जैन पंचांग
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-gotu mt-0.5">
              {currentTime.toLocaleDateString('hi-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Live Astronomy Strip */}
        <div className="flex gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <GlassCard
            variant="gilded"
            className="px-4 py-2 flex items-center gap-2 border-amber-500/30 whitespace-nowrap shrink-0"
          >
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs md:text-sm font-mono font-medium text-white tabular-nums">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </span>
          </GlassCard>
          <GlassCard
            variant="gilded"
            className="px-4 py-2 flex items-center gap-2 border-amber-500/30 whitespace-nowrap shrink-0"
          >
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs md:text-sm font-gotu text-slate-200">सूर्योदय ०६:०५ AM</span>
          </GlassCard>
          <GlassCard
            variant="gilded"
            className="px-4 py-2 flex items-center gap-2 border-amber-500/30 whitespace-nowrap shrink-0"
          >
            <Moon className="w-4 h-4 text-blue-300 shrink-0" />
            <span className="text-xs md:text-sm font-gotu text-slate-200">सूर्यास्त ०६:४५ PM</span>
          </GlassCard>
        </div>
      </motion.div>

      {/* Main Grid Layout (Calendar 8 cols, Sidebar 4 cols on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Calendar Card (8 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 w-full"
        >
          <GlassCard variant="gilded" className="p-5 sm:p-7 md:p-8">
            {/* Month & Year Navigation Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white flex items-center gap-2.5">
                <CalendarIcon className="w-6 h-6 text-amber-400 shrink-0" />
                <span>
                  {MONTH_NAMES_HINDI[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToToday}
                  title="आज का दिन"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-gotu font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>आज</span>
                </button>
                <button
                  onClick={handlePrevMonth}
                  aria-label="पिछला माह"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  aria-label="अगला माह"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop / Tablet Calendar Grid */}
            <div className="hidden sm:block">
              {/* Weekday Names */}
              <div className="grid grid-cols-7 gap-2 mb-2.5">
                {WEEK_DAYS_HINDI.map((day) => (
                  <div
                    key={day}
                    className="bg-white/[0.03] border border-white/5 rounded-xl py-2 text-center text-xs font-bold text-amber-300/90 uppercase tracking-wider font-gotu"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty padding slots before 1st of month */}
                {[...Array(startDayOfWeek)].map((_, i) => (
                  <div
                    key={`pad-${i}`}
                    className="min-h-[85px] md:min-h-[96px] rounded-xl bg-slate-950/20 border border-transparent opacity-20 pointer-events-none"
                  />
                ))}

                {/* Day Buttons */}
                {daysData.map((d) => {
                  const isSelected = selectedDay === d.day;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setSelectedDay(d.day)}
                      className={`min-h-[85px] md:min-h-[96px] p-2.5 rounded-xl border transition-all flex flex-col justify-between text-left relative group ${
                        isSelected
                          ? 'bg-amber-500/25 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                          : d.current
                          ? 'bg-amber-500/10 border-amber-400/60 text-amber-200'
                          : 'bg-slate-900/60 border-white/5 hover:bg-white/[0.08] hover:border-white/20 text-slate-200'
                      }`}
                    >
                      {/* Top row: Day Number + Moon Paksha Indicator */}
                      <div className="flex justify-between items-start w-full">
                        <span
                          className={`text-base font-bold font-notoserif ${
                            isSelected || d.current ? 'text-amber-300' : 'text-white'
                          }`}
                        >
                          {d.day}
                        </span>

                        {d.paksha === 'शुक्ल' ? (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-amber-100 shadow-[0_0_6px_rgba(251,191,36,0.9)] shrink-0"
                            title="शुक्ल पक्ष"
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-800 shrink-0"
                            title="कृष्ण पक्ष"
                          />
                        )}
                      </div>

                      {/* Bottom area: Tithi label and optional festival badge */}
                      <div className="mt-1 w-full space-y-1">
                        <span className="text-[11px] font-gotu text-slate-300/80 block truncate">
                          {d.tithi}
                        </span>

                        {d.festival && (
                          <span
                            className={`text-[10px] leading-tight block font-gotu truncate px-1.5 py-0.5 rounded ${
                              d.highlight
                                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40 font-semibold'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {d.festival}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Calendar View (< 640px) */}
            <div className="sm:hidden flex flex-col gap-4">
              <div className="bg-slate-950/60 rounded-2xl p-3 border border-white/10">
                <div className="grid grid-cols-7 mb-2">
                  {WEEK_DAYS_HINDI.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[11px] text-amber-300 font-bold p-1 font-gotu"
                    >
                      {day.charAt(0)}
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
                      <button
                        key={d.day}
                        onClick={() => setSelectedDay(d.day)}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105 z-10'
                            : d.current
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-notoserif font-bold leading-none">{d.day}</span>
                        <span className="text-[9px] font-gotu opacity-80 mt-0.5 truncate max-w-[38px]">
                          {d.tithi.slice(0, 3)}
                        </span>
                        {d.festival && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1 ${
                              isSelected ? 'bg-slate-950' : 'bg-amber-400'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sidebar Info Panels (4 cols on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 w-full space-y-5"
        >
          {/* Selected Tithi Details Card */}
          {selectedDayData && (
            <GlassCard variant="gilded" className="p-6">
              <h3 className="text-amber-300 font-cinzel text-xs uppercase tracking-[0.2em] mb-2 font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>चयनित तिथि विवरण</span>
              </h3>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 font-notoserif">
                {selectedDayData.paksha} {selectedDayData.tithi}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-gotu">
                {selectedDayData.day} {MONTH_NAMES_HINDI[currentDate.getMonth()]}, विक्रम संवत् २०८१
              </p>

              <div className="mt-5 pt-4 border-t border-white/10 space-y-3 text-xs sm:text-sm font-gotu">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">सूर्योदय काल</span>
                  <span className="text-amber-200 font-mono font-medium">०६:०५ AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">सूर्यास्त काल</span>
                  <span className="text-amber-200 font-mono font-medium">०६:४५ PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">चौघड़िया</span>
                  <span className="text-emerald-300 font-semibold">शुभ / अमृत / लाभ</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Upcoming Festivals Card */}
          <GlassCard variant="gilded" className="p-6">
            <div className="flex items-center gap-2 text-amber-300 mb-4">
              <Award className="w-4 h-4" />
              <h3 className="font-bold font-notoserif text-base">इस माह के प्रमुख पर्व</h3>
            </div>
            <ul className="space-y-2.5">
              {daysData
                .filter((d) => d.festival)
                .slice(0, 5)
                .map((d) => (
                  <li
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className={`flex gap-3 items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedDay === d.day
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold leading-none font-notoserif">{d.day}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium font-gotu text-xs sm:text-sm truncate">
                        {d.festival}
                      </div>
                      <div className="text-[11px] text-slate-400 font-gotu">
                        {d.paksha} {d.tithi}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </GlassCard>

          {/* Daily Pachchakkhan / Niyam Card */}
          <GlassCard
            variant="sacred"
            className="p-6 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-[#030712]/90 border-emerald-500/30"
          >
            <h3 className="text-emerald-300 font-notoserif font-bold text-lg mb-2">दैनिक पच्चक्खाण</h3>
            <p className="text-xs text-slate-300 font-gotu leading-relaxed mb-4">
              आत्म-शुद्धि के लिए नवकारसी, पोरसी, एकासन, उपवास आदि का संकल्प।
            </p>
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs sm:text-sm font-gotu text-emerald-200 text-center font-semibold tracking-wide">
              "सूर्योदये चउव्विहारं पच्चक्खामि"
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
