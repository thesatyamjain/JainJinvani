import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ArrowLeft, BookOpen, Star, Award, Play, Users } from 'lucide-react';

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

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-gotu">वापस जाएं</span>
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
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">6</div>
            <div className="text-xs text-blue-100/60 font-gotu mt-1">कोर्स</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">24</div>
            <div className="text-xs text-blue-100/60 font-gotu mt-1">पाठ</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedCourse(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl z-10 my-8"
          >
            <GlassCard className="p-8 border-white/20 bg-[#0b162c] shadow-2xl">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="text-6xl mb-4">{selectedCourse.icon}</div>

              <h2 className="text-3xl font-rozha text-white mb-2">
                {selectedCourse.title}
              </h2>
              <p className="text-blue-100/60 font-gotu mb-6">{selectedCourse.titleEn}</p>

              <div className="flex gap-3 mb-6 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm">
                  {selectedCourse.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                  {selectedCourse.age}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                  {selectedCourse.lessons.length} पाठ
                </span>
              </div>

              <p className="text-blue-100/80 font-gotu mb-6">
                {selectedCourse.description}
              </p>

              <div className="space-y-3">
                <div className="text-sm text-amber-300 uppercase mb-3 font-gotu">पाठ सूची</div>
                {selectedCourse.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border transition-all ${lesson.completed
                        ? 'bg-green-500/10 border-green-400/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-full ${lesson.completed ? 'bg-green-500/20' : 'bg-white/10'
                          }`}>
                          {lesson.completed ? (
                            <Award className="w-4 h-4 text-green-400" />
                          ) : (
                            <Play className="w-4 h-4 text-blue-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-gotu font-medium break-words">
                            {lesson.name}
                          </div>
                          <div className="text-xs text-blue-100/50 font-gotu">
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                      {lesson.completed && (
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-gotu font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all">
                कोर्स शुरू करें
              </button>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};
