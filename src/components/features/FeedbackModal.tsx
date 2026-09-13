import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import {
  X,
  FileEdit,
  Mail,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  PenTool,
  BookPlus,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';
import { useModalBackHandler } from '../../lib';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScriptureName?: string;
}

export const GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzuu8oiNAXX6NFrzeIxk32g2FWrJQOBdIID2uUezafAFz9lnMZQJ0yMH1Kbg6zuCJ6lHQ/exec';

export const GOOGLE_FORM_VIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdLPc-5LVA1zwqDrw32K4D-fgDGAtGoDG1NAn2vbJhf9ot4FA/viewform';

const FEEDBACK_TYPES = [
  {
    id: 'अशुद्धि / वर्तनी सुधार',
    label: 'अशुद्धि / वर्तनी सुधार',
    mobileLabel: 'अशुद्धि सुधार',
    shortDesc: 'टंकण या पद्य में अशुद्धि सुधार',
    icon: PenTool,
  },
  {
    id: 'नया पाठ / ग्रंथ जोड़ने की प्रार्थना',
    label: 'नया पाठ / ग्रंथ सुझाव',
    mobileLabel: 'नया पाठ/ग्रंथ',
    shortDesc: 'नया स्तोत्र, पूजा या शास्त्र जोड़ें',
    icon: BookPlus,
  },
  {
    id: 'सामान्य सुझाव / प्रतिक्रिया',
    label: 'सामान्य सुझाव',
    mobileLabel: 'सामान्य सुझाव',
    shortDesc: 'डिजाइन या फीचर संबंधित प्रतिक्रिया',
    icon: Lightbulb,
  },
];

export const FeedbackModal = ({
  isOpen,
  onClose,
  defaultScriptureName = '',
}: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] = useState('अशुद्धि / वर्तनी सुधार');
  const [scriptureName, setScriptureName] = useState(defaultScriptureName);
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('thesoftwarecompany@zohomail.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update scripture name if passed dynamically when opening
  useEffect(() => {
    if (isOpen && defaultScriptureName) {
      setScriptureName(defaultScriptureName);
    }
  }, [isOpen, defaultScriptureName]);

  // Close modal when mobile back button is pressed
  useModalBackHandler(isOpen, onClose, 'feedback-modal');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!details.trim()) {
      setErrorMessage('कृपया अशुद्धि या सुझाव का विवरण अवश्य लिखें।');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('कृपया वैध ईमेल पता दर्ज करें।');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      type: feedbackType,
      scriptureName: scriptureName.trim(),
      details: details.trim(),
      email: email.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      let submissionSuccess = false;

      // 1. Try Cloudflare Pages Serverless Function endpoint
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          submissionSuccess = true;
        }
      } catch {
        // Fallback if running on local dev without pages functions
      }

      // 2. Fallback to direct Google Sheets Webhook if edge endpoint was not reached
      if (!submissionSuccess) {
        const activeUrl =
          (typeof window !== 'undefined' && localStorage.getItem('jinvani_custom_webhook_url')?.trim()) ||
          GOOGLE_SHEET_WEBHOOK_URL;
        await fetch(activeUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });
      }

      // Save locally as backup
      try {
        const stored = localStorage.getItem('jain_user_feedback');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({
          ...payload,
          timestamp: Date.now(),
        });
        localStorage.setItem('jain_user_feedback', JSON.stringify(list.slice(0, 30)));
      } catch {}

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('फॉर्म सबमिट करने में समस्या आई, कृपया पुनः प्रयास करें।');
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDetails('');
    setScriptureName('');
    setErrorMessage('');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl z-10 my-auto"
          >
            <GlassCard
              variant="sacred"
              sheen
              className="p-3.5 sm:p-6 border-amber-500/35 bg-[#0b1220]/95 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.15)] rounded-2xl sm:rounded-3xl relative overflow-hidden max-h-[min(92vh,720px)] flex flex-col"
            >
              {/* Sacred Corner Traditional Markers */}
              <div className="absolute top-2.5 left-3 text-[10px] text-amber-400/40 pointer-events-none select-none">
                ❖
              </div>
              <div className="absolute top-2.5 right-3 text-[10px] text-amber-400/40 pointer-events-none select-none">
                ❖
              </div>
              <div className="absolute bottom-2.5 left-3 text-[10px] text-amber-400/40 pointer-events-none select-none">
                ❖
              </div>
              <div className="absolute bottom-2.5 right-3 text-[10px] text-amber-400/40 pointer-events-none select-none">
                ❖
              </div>

              {/* Ambient Radiant Glow */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/15 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-600/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base md:text-lg font-notoserif font-bold text-white leading-snug">
                      जिनवाणी संवर्धन एवं शुद्धि पत्र
                    </h2>
                    <p className="text-[10px] sm:text-xs text-amber-200/80 font-gotu leading-snug mt-0.5">
                      त्रुटि सुधार व नए पाठ जोड़ने हेतु सहभागिता
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={GOOGLE_FORM_VIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-200 border border-white/10 transition-colors cursor-pointer"
                    title="गूगल फॉर्म में देखें"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-200 border border-white/10 transition-colors cursor-pointer"
                    title="बंद करें"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Success View */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 sm:py-8 text-center space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar min-h-0"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                    <CheckCircle2 className="w-8 h-8 sm:w-11 sm:h-11 text-amber-300" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-base sm:text-xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300">
                       सादर जय जिनेन्द्र! बहुत-बहुत धन्यवाद
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200/90 font-gotu leading-relaxed px-2">
                      आपका सुझाव सफलतापूर्वक दर्ज हो गया है। जिनवाणी की प्रामाणिकता एवं अखंडता बनाए रखने हेतु हमारी टीम प्रामाणिक दिगम्बर आगम अनुसार इसकी समीक्षा कर आवश्यक सुधार करेगी।
                    </p>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-gotu text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      एक और सुझाव दें
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      पूर्ण (बंद करें)
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Native Custom Form matching Portal Sanctum UI */
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10 space-y-3 sm:space-y-4 min-h-0"
                >
                  {/* Direct Contact Email Banner */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-amber-500/10 border border-amber-400/35 flex items-center justify-between gap-2.5 shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-200/80 font-gotu block leading-tight">सीधे ईमेल द्वारा संपर्क करें:</span>
                        <a
                          href="mailto:thesoftwarecompany@zohomail.in"
                          className="text-xs sm:text-sm font-mono font-bold text-amber-300 hover:text-amber-100 hover:underline truncate block"
                          title="thesoftwarecompany@zohomail.in पर ईमेल भेजें"
                        >
                          thesoftwarecompany@zohomail.in
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 text-[11px] font-gotu transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      title="ईमेल कॉपी करें"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">कॉपी हुआ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400/80" />
                          <span>कॉपी</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1. Category / Type Selection */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      सुझाव का प्रकार <span className="text-amber-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {FEEDBACK_TYPES.map((type) => {
                        const isSelected = feedbackType === type.id;
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-2 sm:p-2.5 rounded-xl text-left font-gotu transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/50'
                                : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/80 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                              <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                              <span className={`text-[11px] sm:text-xs font-bold font-notoserif leading-tight ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                                <span className="sm:hidden">{type.mobileLabel}</span>
                                <span className="hidden sm:inline">{type.label}</span>
                              </span>
                            </div>
                            <span className="hidden sm:block text-[10px] text-slate-400 leading-tight">
                              {type.shortDesc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Scripture / Path Name */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      पाठ या ग्रंथ का नाम{' '}
                      <span className="text-[10px] text-slate-400 font-normal">(वैकल्पिक)</span>
                    </label>
                    <input
                      type="text"
                      name="scriptureName"
                      value={scriptureName}
                      onChange={(e) => setScriptureName(e.target.value)}
                      placeholder="उदा. भक्तामर स्तोत्र, तत्त्वार्थ सूत्र, अभिषेक पाठ..."
                      className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-gotu"
                    />
                  </div>

                  {/* 3. Detailed Message / Correction */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-amber-200 font-gotu flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                        अशुद्धि या सुझाव का पूरा विवरण <span className="text-amber-400">*</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {details.length > 0 ? `${details.length} अक्षर` : ''}
                      </span>
                    </label>
                    <textarea
                      name="details"
                      required
                      rows={2}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="कहाँ क्या अशुद्धि है, शुद्ध पाठ क्या होना चाहिए, अथवा क्या नया जुड़वाना चाहते हैं..."
                      className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-gotu resize-none leading-relaxed min-h-[64px] sm:min-h-[80px]"
                    />
                  </div>

                  {/* 4. Email */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      आपका ईमेल (Email) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="उदा. yourname@gmail.com"
                      className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-mono"
                    />
                  </div>

                  {/* Error Notice */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Action */}
                  <div className="pt-2 pb-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
                    <p className="text-[10px] text-slate-400 font-gotu text-center sm:text-left">
                      ❖ डेटा सुरक्षित रूप से गूगल स्प्रेडशीट में दर्ज होगा।
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_22px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          <span>भेजा जा रहा है...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span>सुझाव प्रेषित करें</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
