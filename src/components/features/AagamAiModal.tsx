import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col"
        >
          <GlassCard variant="gilded" className="p-5 sm:p-6 flex flex-col max-h-[85vh] overflow-hidden border-amber-500/30">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-200 font-notoserif flex items-center gap-2">
                    आगम AI जिज्ञासा
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Cloudflare AI
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 font-gotu">
                    जैन दर्शन, आगम एवं साधना से जुड़े प्रश्न पूछें
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Question Suggestions */}
              {!answer && !isLoading && (
                <div className="space-y-2">
                  <div className="text-xs text-amber-300/80 font-gotu flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    सुझाए गए प्रश्न:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_QUESTIONS.map((sq, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAsk(sq)}
                        className="text-xs font-gotu px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 transition-all text-left"
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 text-amber-300">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-gotu text-slate-300">
                    जिनवाणी आगम से प्रामाणिक उत्तर खोजा जा रहा है…
                  </p>
                </div>
              )}

              {/* Answer Display */}
              {answer && !isLoading && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        आगम उत्तर:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-[11px] font-gotu px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हुआ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>कॉपी करें</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-sm sm:text-base font-mukta text-slate-100 leading-relaxed whitespace-pre-line">
                      {answer}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setAnswer(null);
                        setQuestion('');
                      }}
                      className="text-xs font-gotu text-amber-300 hover:text-amber-200 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      नया प्रश्न पूछें
                    </button>
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
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder:text-slate-500 text-xs sm:text-sm font-gotu focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold font-gotu flex items-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">पूछें</span>
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
