import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import { TiltCard } from '../layout/TiltCard';
import {
  X,
  Send,
  Sparkles,
  Bot,
  Copy,
  Check,
  HelpCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Share2,
} from 'lucide-react';
import { useModalBackHandler } from '../../lib';

interface AagamAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUESTIONS = [
  'अष्टमूल गुण क्या हैं?',
  'सामायिक की विधि क्या है?',
  'णमोकार महामंत्र का अर्थ',
  'सात तत्त्व कौन-से हैं?',
];

export const AagamAiModal = ({ isOpen, onClose }: AagamAiModalProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close modal when hardware back button is pressed on mobile
  useModalBackHandler(isOpen, onClose, 'aagam-ai-modal');

  const handleAsk = async (queryToAsk?: string) => {
    const q = (queryToAsk || question).trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    if (queryToAsk) setQuestion(queryToAsk);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'उत्तर प्राप्त करने में असमर्थ। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      setError('सर्वर से संपर्क नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!answer) return;
    const shareText = `जिज्ञासा: ${question}\n\nआगम उत्तर: ${answer}\n\n— जैन जिनवाणी (Jain Jinvani)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'आगम AI जिज्ञासा',
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (e) {
        // Fallback to clipboard if share cancelled
      }
    }
    navigator.clipboard.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="relative w-full max-w-xl max-h-[90vh] flex flex-col"
          >
            <GlassCard variant="gilded" className="p-5 sm:p-6 flex flex-col max-h-[85vh] overflow-hidden border border-amber-500/35 bg-slate-900/95 shadow-2xl rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-amber-200 font-notoserif flex items-center gap-2">
                      आगम AI जिज्ञासा
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                        Cloudflare AI
                      </span>
                    </h3>
                    <p className="text-xs text-slate-200 font-gotu font-medium">
                      जैन दर्शन, आगम एवं साधना से जुड़े प्रश्न पूछें
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Close"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
                {/* Question Suggestions */}
                {!answer && !isLoading && (
                  <div className="space-y-2.5">
                    <div className="text-xs text-amber-300 font-gotu font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>सुझाए गए प्रश्न (Prompt Bubbles):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_QUESTIONS.map((sq, i) => (
                        <motion.button
                          key={i}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                          onClick={() => handleAsk(sq)}
                          className="text-xs font-gotu font-medium px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 text-amber-100 hover:text-amber-200 border border-amber-400/40 hover:border-amber-300 transition-colors text-left cursor-pointer select-none shadow-sm"
                        >
                          {sq}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-100 text-xs sm:text-sm font-gotu font-medium">
                    {error}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3 text-amber-300">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    <p className="text-xs sm:text-sm font-gotu text-slate-200 font-medium">
                      जिनवाणी आगम से प्रामाणिक उत्तर खोजा जा रहा है…
                    </p>
                  </div>
                )}

                {/* Answer Display */}
                {answer && !isLoading && (
                  <div className="space-y-4">
                    <TiltCard
                      maxTilt={4}
                      glareMaxOpacity={0.12}
                      glareColor="gold"
                      className="rounded-2xl"
                    >
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-3 h-full shadow-inner">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-gotu">
                            <BookOpen className="w-4 h-4 text-amber-400" />
                            <span>आगम उत्तर:</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Copy Button */}
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCopy}
                              className={`flex items-center gap-1 text-[11px] font-gotu font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                copied
                                  ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300'
                                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200 hover:text-white'
                              }`}
                              title="उत्तर कॉपी करें"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>कॉपी हुआ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>कॉपी</span>
                                </>
                              )}
                            </motion.button>

                            {/* Share Button */}
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleShare}
                              className={`flex items-center gap-1 text-[11px] font-gotu font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                shared
                                  ? 'bg-amber-500/30 border-amber-400/60 text-amber-200'
                                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200 hover:text-white'
                              }`}
                              title="उत्तर साझा करें"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{shared ? 'साझा हुआ' : 'साझा करें'}</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Answer Text */}
                        <div className="text-sm sm:text-base font-mukta text-slate-100 leading-relaxed whitespace-pre-line font-medium">
                          {answer}
                        </div>
                      </div>
                    </TiltCard>

                    {/* Scripture Citations Section */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-2.5 shadow-sm">
                      <BookOpen className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-amber-200 font-gotu mb-0.5">
                          प्रामाणिक आगम संदर्भ:
                        </div>
                        <div className="text-[11px] text-slate-200 font-gotu leading-relaxed">
                          यह उत्तर दिगम्बर जैन आगम परंपरा (षट्खण्डागम, तत्त्वार्थसूत्र, मूलाचार, द्रव्यसंग्रह एवं प्रवचनसार) के सिद्धांतों के अनुकूल प्रस्तुत किया गया है।
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        onClick={() => {
                          setAnswer(null);
                          setQuestion('');
                        }}
                        className="text-xs font-gotu font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer select-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>नया प्रश्न पूछें</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="pt-3 border-t border-white/10 flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="उदा. सामायिक में क्या पाठ पढ़ना चाहिए?"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm font-gotu focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold font-gotu flex items-center gap-1.5 transition-colors cursor-pointer select-none shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">पूछें</span>
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
