import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  BookOpen,
  Star,
  Award,
  Play,
  Users,
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
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

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'णमोकार महामंत्र में कितने मुख्य पद (नमस्कार) होते हैं?',
    options: ['५ पद', '७ पद', '९ पद', '२४ पद'],
    correctIndex: 0,
    explanation: 'णमोकार महामंत्र में पंच परमेष्ठी (अरिहंत, सिद्ध, आचार्य, उपाध्याय, सर्व साधु) को समर्पित ५ पद हैं।'
  },
  {
    id: 2,
    question: 'वर्तमान चौबीसी के प्रथम तीर्थंकर भगवान कौन हैं?',
    options: ['भगवान महावीर स्वामी', 'भगवान ऋषभदेव (आदिनाथ)', 'भगवान पार्श्वनाथ', 'भगवान नेमिनाथ'],
    correctIndex: 1,
    explanation: 'वर्तमान अवसर्पिणी काल के प्रथम तीर्थंकर श्री ऋषभदेव (आदिनाथ) भगवान हैं।'
  },
  {
    id: 3,
    question: 'जैन धर्म का परम मूल सिद्धांत क्या है?',
    options: ['अहिंसा परमो धर्मः', 'कर्म ही पूजा है', 'सत्यमेव जयते', 'सर्वे भवन्तु सुखिनः'],
    correctIndex: 0,
    explanation: 'जैन दर्शन की आधारशिला "अहिंसा परमो धर्मः" है - सभी जीवों के प्रति दया एवं करुणा।'
  },
  {
    id: 4,
    question: 'दिगम्बर जैन मुनिराज कितने मूलगुणों का निरतिचार पालन करते हैं?',
    options: ['१८ मूलगुण', '२४ मूलगुण', '२८ मूलगुण', '३६ मूलगुण'],
    correctIndex: 2,
    explanation: 'मुनिराज २८ मूलगुणों का पालन करते हैं (५ महाव्रत, ५ समिति, ५ इन्द्रिय जय, ६ आवश्यक, ७ शेष गुण)।'
  },
  {
    id: 5,
    question: 'मोक्ष मार्ग के तीन स्तंभ (रत्नत्रय) कौन-से हैं?',
    options: [
      'दान, शील, तप',
      'सम्यग्दर्शन, सम्यग्ज्ञान, सम्यक्चारित्र',
      'मन, वचन, काय शुद्धि',
      'उत्तम क्षमा, मार्दव, आर्जव'
    ],
    correctIndex: 1,
    explanation: 'आचार्य उमास्वामी के तत्त्वार्थसूत्र अनुसार: "सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः"।'
  }
];

export const PathshalaPage = ({ onBack }: PathshalaPageProps) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Close course detail modal on mobile back navigation
  useModalBackHandler(!!selectedCourse, () => setSelectedCourse(null), 'pathshala-detail');

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    if (idx === quizQuestions[currentQuestionIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-16 md:pt-20 page-bottom-clearance px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 hover:bg-amber-500/25 border border-white/15 hover:border-amber-400/50 transition-colors flex items-center justify-center group mb-6 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-amber-200" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs mb-3 font-semibold shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span className="uppercase tracking-widest font-bold font-cinzel">Pathshala & Quiz</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-rozha text-white mb-2 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
            बाल पाठशाला
          </h1>
          <p className="text-slate-200 font-gotu text-base sm:text-lg font-medium">
            बच्चों व स्वाध्यायियों के लिए सरल जैन संस्कार एवं प्रश्नोत्तरी
          </p>
        </motion.div>

        {/* Tab Switcher: Courses vs Quiz */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-gotu font-bold transition-all cursor-pointer border ${
              activeTab === 'courses'
                ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 shadow-md'
                : 'bg-slate-900/70 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            📚 पाठ्यक्रम (Courses)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-gotu font-bold transition-all cursor-pointer border ${
              activeTab === 'quiz'
                ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 shadow-md'
                : 'bg-slate-900/70 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✨ जैन प्रश्नोत्तरी (Quiz)
          </motion.button>
        </div>

        {/* Quick Stats Banner (shown for courses) */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }} className="p-4 text-center bg-slate-900/80 border border-white/15 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-notoserif">६</div>
              <div className="text-xs sm:text-sm text-slate-200 font-gotu font-medium mt-1">कोर्स</div>
            </GlassCard>
            <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'subtle' }} className="p-4 text-center bg-slate-900/80 border border-white/15 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-notoserif">२४</div>
              <div className="text-xs sm:text-sm text-slate-200 font-gotu font-medium mt-1">पाठ</div>
            </GlassCard>
            <GlassCard tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'white' }} className="p-4 text-center bg-slate-900/80 border border-white/15 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-notoserif">२</div>
              <div className="text-xs sm:text-sm text-slate-200 font-gotu font-medium mt-1">पूर्ण किए</div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'courses' ? (
        /* Courses Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                  className="p-6 bg-slate-900/85 hover:bg-slate-800/90 border border-white/15 hover:border-amber-400/40 cursor-pointer transition-all group h-full flex flex-col rounded-2xl shadow-lg"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="text-4xl sm:text-5xl mb-4">{course.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-200 border border-white/15">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-rozha text-white mb-1 group-hover:text-amber-200 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-300/90 font-cinzel font-semibold mb-2">{course.titleEn}</p>

                    <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed mb-4">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs text-amber-300 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-gotu">आयु: {course.age}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-2 border border-white/10">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-300 font-gotu font-medium flex items-center justify-between">
                      <span>{completedLessons}/{course.lessons.length} पाठ पूर्ण</span>
                      <span className="font-mono text-amber-300 font-bold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Quiz Section */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {!quizCompleted ? (
            <GlassCard variant="gilded" className="p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl shadow-xl">
              {/* Question Progress Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-mono font-bold border border-amber-400/30">
                    प्रश्न {currentQuestionIndex + 1} / {quizQuestions.length}
                  </span>
                </div>
                <div className="text-xs font-gotu text-slate-200">
                  अंक: <span className="font-mono font-bold text-amber-300 text-sm">{score}</span>
                </div>
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Prompt */}
              <h2 className="text-xl sm:text-2xl font-rozha text-white mb-6 leading-relaxed">
                {quizQuestions[currentQuestionIndex].question}
              </h2>

              {/* Options List */}
              <div className="space-y-3 mb-6">
                {quizQuestions[currentQuestionIndex].options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === quizQuestions[currentQuestionIndex].correctIndex;

                  let optionStyle = 'bg-slate-900/70 border-white/15 text-slate-100 hover:bg-slate-800/80 hover:border-amber-400/40';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-500/25 border-rose-400 text-rose-100 font-bold shadow-[0_0_15px_rgba(244,63,94,0.25)]';
                    } else {
                      optionStyle = 'bg-slate-900/40 border-white/10 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <motion.button
                      key={optIdx}
                      whileHover={!isAnswerSubmitted ? { scale: 1.01 } : {}}
                      whileTap={!isAnswerSubmitted ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-amber-300 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-gotu text-sm sm:text-base font-medium">{option}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation Note after Selection */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 mb-6"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200 mb-1 font-gotu">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>स्पष्टीकरण:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-gotu leading-relaxed">
                    {quizQuestions[currentQuestionIndex].explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Button: Next Question */}
              {isAnswerSubmitted && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-gotu font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(245,158,11,0.35)] cursor-pointer"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'अगला प्रश्न →' : 'परिणाम देखें'}
                </motion.button>
              )}
            </GlassCard>
          ) : (
            /* Quiz Completed Score Summary */
            <GlassCard variant="sacred" className="p-8 sm:p-10 text-center bg-slate-900/95 border border-amber-500/40 rounded-3xl shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-inner">
                <Award className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h2 className="text-2xl sm:text-4xl font-rozha text-white mb-2">
                प्रश्नोत्तरी संपन्न!
              </h2>
              <p className="text-slate-200 font-gotu text-sm mb-6">
                आपने जैन पाठशाला प्रश्नोत्तरी सफलतापूर्वक पूर्ण की है।
              </p>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 max-w-sm mx-auto mb-6">
                <div className="text-4xl sm:text-5xl font-bold font-mono text-amber-300 mb-1">
                  {score} / {quizQuestions.length}
                </div>
                <div className="text-xs sm:text-sm font-gotu text-emerald-300 font-semibold">
                  सफलता दर: {Math.round((score / quizQuestions.length) * 100)}%
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-gotu font-bold text-sm transition-colors cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुनः खेलें (Restart Quiz)</span>
              </motion.button>
            </GlassCard>
          )}
        </motion.div>
      )}

      {/* Course Detail Modal */}
      <AnimatePresence>
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
              className="relative w-full max-w-xl max-h-[min(90vh,700px)] flex flex-col z-10 bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Pinned Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 flex items-start justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-gotu font-semibold border border-amber-400/40">
                      {selectedCourse.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-gotu font-semibold border border-cyan-400/40">
                      आयु: {selectedCourse.age}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-gotu font-semibold border border-emerald-400/40">
                      {selectedCourse.lessons.length} पाठ
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-notoserif font-bold text-white leading-snug break-words">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-xs text-amber-300 font-cinzel font-semibold mt-0.5">{selectedCourse.titleEn}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCourse(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 min-h-0">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
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
                            ? 'bg-emerald-500/15 border-emerald-400/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                lesson.completed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                  : 'bg-white/10 text-cyan-300'
                              }`}
                            >
                              {lesson.completed ? (
                                <Award className="w-4 h-4" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm text-white font-gotu font-semibold break-words">
                                {lesson.name}
                              </div>
                              <div className="text-[11px] text-slate-300 font-gotu font-medium">
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-gotu font-bold text-sm hover:brightness-110 transition-colors shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  कोर्स शुरू करें
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
