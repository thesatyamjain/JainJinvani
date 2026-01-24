import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ChevronLeft, ChevronRight, Moon, Sun, Calendar as CalendarIcon, Info, Clock } from 'lucide-react';
import { getJainDate, getFestival, MONTH_NAMES_HINDI, WEEK_DAYS_HINDI } from '../utils/panchangUtils';

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
        dateObj: date
      });
    }

    setDaysData(newDaysData);
    
    // Auto-select today if in current month, otherwise select first day
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

  const selectedDayData = selectedDay ? daysData.find(d => d.day === selectedDay) : null;
  const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 pb-32 px-6 flex flex-col h-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4 mb-8"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-rozha text-white">जैन पंचांग</h1>
            <p className="text-blue-100/60 text-xs md:text-sm font-gotu">
               {currentTime.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto md:ml-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
           <GlassCard className="px-4 md:px-5 py-2.5 flex items-center gap-2 border-white/10 !bg-white/5 whitespace-nowrap shrink-0">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium font-gotu tabular-nums">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
           </GlassCard>
           <GlassCard className="px-4 md:px-5 py-2.5 flex items-center gap-2 border-white/10 !bg-white/5 whitespace-nowrap shrink-0">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium font-gotu">07:14</span>
           </GlassCard>
           <GlassCard className="px-4 md:px-5 py-2.5 flex items-center gap-2 border-white/10 !bg-white/5 whitespace-nowrap shrink-0">
              <Moon className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-medium font-gotu">17:48</span>
           </GlassCard>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Calendar Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-gotu text-white">
                {MONTH_NAMES_HINDI[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-7 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 shadow-inner">
              {WEEK_DAYS_HINDI.map(day => (
                <div key={day} className="bg-white/5 p-4 text-center text-sm font-bold text-blue-200/80 uppercase tracking-widest font-gotu">
                  {day}
                </div>
              ))}
              
              {/* Padding for start of month */}
              {[...Array(startDayOfWeek)].map((_, i) => (
                <div key={`pad-${i}`} className="bg-black/20 min-h-[120px]" />
              ))}

              {daysData.map((d) => (
                <div 
                  key={d.day} 
                  className={`bg-black/20 min-h-[120px] p-4 relative group transition-colors hover:bg-white/5 ${d.current ? 'ring-2 ring-inset ring-amber-500 bg-amber-500/10' : ''}`}
                >
                  <span className={`text-xl font-bold font-gotu ${d.current ? 'text-amber-400' : 'text-white'}`}>{d.day}</span>
                  
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {d.paksha === 'शुक्ल' ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-white/40" />
                      )}
                      <span className="text-xs text-blue-100/70 truncate font-gotu tracking-wide">{d.tithi}</span>
                    </div>
                    
                    {d.festival && (
                      <div className={`text-xs leading-tight mt-1.5 font-gotu ${d.highlight ? 'text-amber-300 font-semibold' : 'text-white/60'}`}>
                        {d.festival}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Padding for end of month to fill grid if needed */}
              {[...Array(42 - (startDayOfWeek + daysData.length))].map((_, i) => (
                 (startDayOfWeek + daysData.length + i < 35 || startDayOfWeek + daysData.length + i < 42) ? 
                 <div key={`end-pad-${i}`} className="bg-black/20 min-h-[120px]" /> : null
              ))}
            </div>

            {/* Mobile Compact View */}
            <div className="md:hidden flex flex-col gap-6">
              {/* Compact Grid */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="grid grid-cols-7 mb-2">
                  {WEEK_DAYS_HINDI.map(day => (
                    <div key={day} className="text-center text-[10px] text-blue-200/60 font-bold p-1">
                      {day.charAt(0)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {[...Array(startDayOfWeek)].map((_, i) => (
                     <div key={`m-pad-${i}`} />
                  ))}
                  {daysData.map((d) => (
                    <div key={d.day} className="flex justify-center">
                      <button
                        onClick={() => setSelectedDay(d.day)}
                        className={`w-9 h-9 rounded-full flex flex-col items-center justify-center relative transition-all ${
                          selectedDay === d.day 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110 z-10' 
                            : d.current 
                              ? 'bg-white/10 text-amber-400 border border-amber-500/30' 
                              : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm font-gotu font-bold leading-none">{d.day}</span>
                        {d.festival && (
                          <span className={`w-1 h-1 rounded-full mt-1 ${selectedDay === d.day ? 'bg-white' : 'bg-amber-400'}`} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Day Details */}
              <AnimatePresence mode="wait">
                {selectedDayData && (
                  <motion.div
                    key={selectedDayData.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GlassCard className="p-6 border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-transparent">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm text-amber-200/80 font-gotu mb-1">चयनित तिथि</div>
                          <h3 className="text-3xl font-bold text-white font-rozha">
                             {selectedDayData.day} {MONTH_NAMES_HINDI[currentDate.getMonth()]}
                          </h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedDayData.paksha === 'शुक्ल' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/10 text-gray-300'}`}>
                          {selectedDayData.paksha} पक्ष
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Moon className="w-5 h-5 text-blue-200" />
                          </div>
                          <div>
                            <div className="text-xs text-blue-200/60">तिथि</div>
                            <div className="text-lg text-white font-gotu">{selectedDayData.tithi}</div>
                          </div>
                        </div>

                        {selectedDayData.festival ? (
                          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="text-xs text-amber-200/80 mb-1">विशेष पर्व</div>
                            <div className="text-xl text-white font-gotu font-bold">{selectedDayData.festival}</div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-white/40 text-sm font-gotu text-center">कोई विशेष पर्व नहीं</div>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sidebar Info - Simplified for Realtime Context */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-96 space-y-6"
        >
          {selectedDayData && (
              <GlassCard className="p-6 bg-amber-500/10 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <h3 className="text-amber-200 font-rozha text-xl mb-2 opacity-80">आज की तिथि</h3>
                <div className="text-4xl font-bold text-white mb-2 font-gotu">{selectedDayData.paksha} {selectedDayData.tithi}</div>
                <p className="text-base text-blue-100/60 font-rozha tracking-wide">
                   {MONTH_NAMES_HINDI[currentDate.getMonth()]}
                </p>
                
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm font-gotu">
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">सूर्योदय</span>
                    <span className="text-white font-medium">07:14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">सूर्यास्त</span>
                    <span className="text-white font-medium">17:48</span>
                  </div>
                </div>
              </GlassCard>
          )}

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 text-blue-300 mb-5">
              <Info className="w-5 h-5" />
              <h3 className="font-bold font-gotu">आगामी पर्व</h3>
            </div>
            <ul className="space-y-5">
               {/* Show next upcoming festivals in current list */}
               {daysData.filter(d => d.festival && d.day >= (selectedDay || 1)).slice(0, 3).map(d => (
                  <li key={d.day} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/10 shadow-inner">
                      <span className="text-[10px] text-blue-200 font-bold uppercase">{MONTH_NAMES_HINDI[currentDate.getMonth()].slice(0,3)}</span>
                      <span className="text-2xl font-bold text-white leading-none font-gotu mt-1">{d.day}</span>
                    </div>
                    <div>
                      <div className="text-white font-bold font-gotu text-lg">{d.festival}</div>
                      <div className="text-xs text-blue-100/50 mt-1 font-sans">
                         {d.day - (new Date().getDate()) === 0 ? 'आज' : `${d.day - (new Date().getDate())} दिन शेष` }
                      </div>
                    </div>
                  </li>
               ))}
               {daysData.filter(d => d.festival && d.day >= (selectedDay || 1)).length === 0 && (
                   <li className="text-white/40 text-sm font-gotu">इस माह में अब कोई प्रमुख पर्व नहीं है।</li>
               )}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/20 to-teal-900/20 border-emerald-500/20">
             <h3 className="text-emerald-300 font-rozha mb-3 text-xl">पच्चक्खाण</h3>
             <p className="text-sm text-blue-100/70 mb-5 font-gotu leading-relaxed">
               आत्म-शुद्धि के लिए दैनिक त्याग और नियम।
             </p>
             <button className="w-full py-3 bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-sm font-bold text-emerald-100 hover:bg-emerald-600/40 transition-colors font-gotu shadow-lg">
               आज का पच्चक्खाण देखें
             </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
