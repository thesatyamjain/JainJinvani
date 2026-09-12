import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, BookOpen, Star, Award, Play, Users, X } from 'lucide-react';
import { useModalBackHandler } from '../lib';


interface PathshalaPageProps {
  onBack: () => void;
}

const pathshalaContent = [
  {
    id: 'basics',
    icon: '📚',
    level: 'शुरुआती',
    levelEn: 'Beginner',
    title: 'जैन धर्म की मूल बातें',
    titleEn: 'Jain Dharma Basics',
    age: '5-8 वर्ष',
    lessons: [
      { id: 1, name: 'णमोकार मंत्र', duration: '5 मिनट', completed: true },
      { id: 2, name: '24 तीर्थंकर के नाम', duration: '10 मिनट', completed: true },
      { id: 3, name: 'पंच परमेष्ठी', duration: '8 मिनट', completed: false },
      { id: 4, name: 'अहिंसा क्या है?', duration: '12 मिनट', completed: false }
    ],
    description: 'बच्चों के लिए सरल भाषा में जैन धर्म के मूल सिद्धांत'
  },
  {
    id: 'intermediate',
    icon: '📖',
    level: 'मध्यम',
    levelEn: 'Intermediate',
    title: 'जैन सिद्धांत और व्रत',
    titleEn: 'Jain Principles & Vows',
    age: '9-12 वर्ष',
    lessons: [
      { id: 1, name: 'पंच महाव्रत', duration: '15 मिनट', completed: false },
      { id: 2, name: 'रत्नत्रय', duration: '12 मिनट', completed: false },
      { id: 3, name: 'नव तत्व', duration: '18 मिनट', completed: false },
      { id: 4, name: 'अणुव्रत', duration: '10 मिनट', completed: false }
    ],
    description: 'जैन धर्म के प्रमुख सिद्धांतों की गहन जानकारी'
  },
  {
    id: 'stories',
    icon: '📜',
    level: 'कहानियां',
    levelEn: 'Stories',
    title: 'प्रेरक जैन कथाएं',
    titleEn: 'Inspirational Jain Stories',
    age: 'सभी आयु',
    lessons: [
      { id: 1, name: 'भगवान महावीर की कथा', duration: '20 मिनट', completed: false },
      { id: 2, name: 'मेरुदेवी माता की कथा', duration: '15 मिनट', completed: false },
      { id: 3, name: 'श्रेयांसनाथ की कथा', duration: '18 मिनट', completed: false },
      { id: 4, name: 'राजा श्रेणिक की कथा', duration: '12 मिनट', completed: false }
    ],
    description: 'बच्चों के लिए रोचक और शिक्षाप्रद जैन कथाएं'
  },
  {
    id: 'festivals',
    icon: '🎊',
    level: 'पर्व',
    levelEn: 'Festivals',
    title: 'जैन पर्व और उत्सव',
    titleEn: 'Jain Festivals & Celebrations',
    age: 'सभी आयु',
    lessons: [
      { id: 1, name: 'महावीर जयंती', duration: '10 मिनट', completed: false },
      { id: 2, name: 'पर्युषण पर्व', duration: '15 मिनट', completed: false },
      { id: 3, name: 'दीपावली (मोक्ष दिवस)', duration: '12 मिनट', completed: false },
      { id: 4, name: 'ज्ञान पंचमी', duration: '8 मिनट', completed: false }
    ],
    description: 'जैन त्योहारों का महत्व और मनाने की विधि'
  },
  {
    id: 'prayers',
    icon: '🙏',
    level: 'प्रार्थना',
    levelEn: 'Prayers',
    title: 'दैनिक प्रार्थना और स्तोत्र',
    titleEn: 'Daily Prayers & Stotras',
    age: 'सभी आयु',
    lessons: [
      { id: 1, name: 'णमोकार मंत्र अर्थ सहित', duration: '10 मिनट', completed: false },
      { id: 2, name: 'भक्तामर स्तोत्र', duration: '20 मिनट', completed: false },
      { id: 3, name: 'लोगस्स उज्जोयगरे', duration: '8 मिनट', completed: false },
      { id: 4, name: 'सामायिक पाठ', duration: '15 मिनट', completed: false }
    ],
    description: 'रोज की पूजा में उपयोगी प्रार्थनाएं और उनके अर्थ'
  },
  {
    id: 'activities',
    icon: '🎨',
    level: 'गतिविधियां',
    levelEn: 'Activities',
    title: 'मजेदार गतिविधियां',
    titleEn: 'Fun Activities',
    age: '5-12 वर्ष',
    lessons: [
      { id: 1, name: 'तीर्थंकर चिन्ह पहचानें', duration: '10 मिनट', completed: false },
      { id: 2, name: 'जैन शब्द पहेली', duration: '15 मिनट', completed: false },
      { id: 3, name: 'रंग भरें - स्वस्तिक', duration: '20 मिनट', completed: false },
      { id: 4, name: 'मंत्र याद करें', duration: '12 मिनट', completed: false }
    ],
    description: 'खेल-खेल में जैन धर्म सीखें'
  }
];

export const PathshalaPage = ({ onBack }: PathshalaPageProps) => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Close course detail modal on mobile back navigation
  useModalBackHandler(!!selectedCourse, () => setSelectedCourse(null), 'pathshala-detail');


  return (
    <div className="w-full max-w-6xl mx-auto pt-20 page-bottom-clearance px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group mb-6 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-200 text-xs mb-3">
            <BookOpen className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Pathshala</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            बाल पाठशाला
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            बच्चों के लिए जैन शिक्षा
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }} className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">6</div>
            <div className="text-xs text-blue-100/60 font-gotu mt-1">कोर्स</div>
          </GlassCard>
          <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'subtle' }} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">24</div>
            <div className="text-xs text-blue-100/60 font-gotu mt-1">पाठ</div>
          </GlassCard>
          <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'white' }} className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">2</div>
            <div className="text-xs text-blue-100/60 font-gotu mt-1">पूर्ण किए</div>
          </GlassCard>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pathshalaContent.map((course, idx) => {
          const completedLessons = course.lessons.filter(l => l.completed).length;
          const progress = (completedLessons / course.lessons.length) * 100;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard
                tilt={{ maxTilt: 9, glareMaxOpacity: 0.15, glareColor: 'amber' }}
                className="p-6 hover:bg-white/10 cursor-pointer transition-all group h-full flex flex-col"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="text-5xl mb-4">{course.icon}</div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-blue-200">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-rozha text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-blue-100/60 font-gotu mb-3">{course.titleEn}</p>

                  <p className="text-xs text-blue-100/70 font-gotu mb-4">
                    {course.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-amber-300">
                    <Users className="w-3 h-3" />
                    <span className="font-gotu">आयु: {course.age}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-blue-100/50 font-gotu">
                    {completedLessons}/{course.lessons.length} पाठ पूर्ण
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl max-h-[min(90vh,700px)] flex flex-col z-10 bg-slate-900/95 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Pinned Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-gotu border border-amber-400/30">
                    {selectedCourse.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-gotu border border-blue-400/30">
                    आयु: {selectedCourse.age}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-gotu border border-emerald-400/30">
                    {selectedCourse.lessons.length} पाठ
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-notoserif font-bold text-white leading-snug break-words">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-blue-100/60 font-gotu mt-0.5">{selectedCourse.titleEn}</p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 min-h-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-blue-100/90 font-gotu leading-relaxed">
                {selectedCourse.description}
              </div>

              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 font-gotu flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>पाठ्यक्रम सूची ({selectedCourse.lessons.length} पाठ)</span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.lessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-xl border transition-all ${
                        lesson.completed
                          ? 'bg-emerald-500/10 border-emerald-400/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              lesson.completed
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-blue-300'
                            }`}
                          >
                            {lesson.completed ? (
                              <Award className="w-4 h-4" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm text-white font-gotu font-medium break-words">
                              {lesson.name}
                            </div>
                            <div className="text-[11px] text-blue-100/50 font-gotu">
                              अवधि: {lesson.duration}
                            </div>
                          </div>
                        </div>
                        {lesson.completed && (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Action Footer */}
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-gotu font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                कोर्स शुरू करें
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
