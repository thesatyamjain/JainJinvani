import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  Sparkles,
  Bell,
  Volume2,
  SmartphoneNfc,
  SunMedium,
  Clock,
  WifiOff,
  FileJson,
  Download,
  Upload,
  CheckCircle2,
  ChevronLeft,
  Info,
  HardDrive,
  MessageSquare,
  Bot,
  Check,
  RotateCcw,
  Sliders,
  Trash2,
} from 'lucide-react';
import {
  getSettings,
  updateSettings,
  exportBackupData,
  importBackupData,
  clearRecentReads,
  MANUSCRIPT_SHADES,
  type UserSettings,
  useModalBackHandler,
} from '../lib';
import {
  triggerHaptic,
  checkStorageEstimate,
  requestPersistentStorage,
} from '../utils/pwaManager';
import {
  downloadTempleMode,
  isTempleModeCachedLocally,
  checkTempleModeStatus,
} from '../utils/templeMode';
import { FeedbackModal } from '../components/features/FeedbackModal';
import { AagamAiModal } from '../components/features/AagamAiModal';

interface SettingsPageProps {
  onNavigate?: (page: string, params?: any) => void;
  onBack?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onBack }) => {
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAagamAiModal, setShowAagamAiModal] = useState(false);

  // Storage and Offline Mode states
  const [isTempleModeDownloading, setIsTempleModeDownloading] = useState(false);
  const [templeModeProgress, setTempleModeProgress] = useState(0);
  const [isTempleModeReady, setIsTempleModeReady] = useState(isTempleModeCachedLocally());
  const [storageInfo, setStorageInfo] = useState<{
    usageMB: number;
    quotaMB: number;
    percent: number;
    isPersisted: boolean;
  } | null>(null);
  const [isRequestingPersist, setIsRequestingPersist] = useState(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

  // Close modals on mobile back navigation
  useModalBackHandler(showFeedbackModal, () => setShowFeedbackModal(false), 'settings-feedback');
  useModalBackHandler(showAagamAiModal, () => setShowAagamAiModal(false), 'settings-aagam-ai');

  useEffect(() => {
    checkTempleModeStatus().then((ready) => setIsTempleModeReady(ready));
    checkStorageEstimate().then((info) => setStorageInfo(info));

    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserSettings>;
      if (customEvent.detail) {
        setSettings((prev) => ({ ...prev, ...customEvent.detail }));
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'jain_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    };
    window.addEventListener('jain_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('jain_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    triggerHaptic('light');
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const handleDownloadTempleMode = async () => {
    setIsTempleModeDownloading(true);
    setTempleModeProgress(0);
    triggerHaptic('medium');
    await downloadTempleMode((pct) => setTempleModeProgress(pct));
    setIsTempleModeDownloading(false);
    setIsTempleModeReady(true);
    triggerHaptic('success');
    checkStorageEstimate().then((info) => setStorageInfo(info));
  };

  const handleRequestPersist = async () => {
    setIsRequestingPersist(true);
    triggerHaptic('medium');
    await requestPersistentStorage();
    const info = await checkStorageEstimate();
    setStorageInfo(info);
    setIsRequestingPersist(false);
    triggerHaptic('success');
  };

  const handleResetDefaults = () => {
    if (window.confirm('क्या आप सभी प्राथमिकताओं को डिफ़ॉल्ट (मूल) सेटिंग्स पर रीसेट करना चाहते हैं?')) {
      triggerHaptic('medium');
      const defaultSettings: UserSettings = {
        fontSize: 'medium',
        fontFamily: 'serif',
        notifications: true,
        autoPlay: false,
        backgroundTheme: 'manuscript',
        manuscriptShade: 'tadpatra',
        dockTheme: 'frosted',
        hapticFeedback: true,
        showTithiTimings: true,
        sunsetReminder: true,
      };
      setSettings(defaultSettings);
      updateSettings(defaultSettings);
      setBackupSuccessMessage('✅ सभी सेटिंग्स मूल रूप में पुनर्स्थापित हो गईं!');
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('क्या आप हाल ही में पढ़े गए शास्त्रों व रचनाओं का इतिहास साफ़ करना चाहते हैं?')) {
      triggerHaptic('medium');
      clearRecentReads();
      setBackupSuccessMessage('✅ हालिया स्वाध्याय इतिहास साफ़ कर दिया गया!');
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    }
  };

  const handleBack = () => {
    triggerHaptic('light');
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('more');
    } else {
      window.history.back();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 sm:pt-10 page-bottom-clearance px-4 sm:px-6 select-none font-gotu">
      {/* =================================================================== */}
      {/* 1. Header Bar and Back Button */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={handleBack}
          className="settings-back-btn w-11 h-11 rounded-2xl bg-[#ECE5D5]/80 dark:bg-white/10 border border-[#B8860B]/30 dark:border-white/15 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 dark:hover:bg-white/20 transition-all backdrop-blur-xl shrink-0 cursor-pointer shadow-sm group"
          title="वापस जाएं"
          aria-label="वापस जाएं"
        >
          <ChevronLeft className="w-5 h-5 text-stone-900 dark:text-slate-200 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors" />
        </motion.button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-[11px] font-gotu font-bold mb-1">
            <Sliders className="w-3 h-3 text-amber-800 dark:text-amber-300" />
            <span>अनुकूलन एवं विन्यास</span>
          </div>
          <h1 className="settings-main-title text-2xl sm:text-3xl font-notoserif font-bold text-stone-900 dark:text-white truncate">
            सेटिंग्स (Settings)
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleResetDefaults}
          className="settings-reset-all-btn px-3 py-2 rounded-xl bg-[#ECE5D5]/80 dark:bg-white/10 border border-[#B8860B]/30 dark:border-white/15 hover:bg-amber-500/20 dark:hover:bg-white/20 text-stone-900 dark:text-slate-200 text-xs font-gotu font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
          title="डिफ़ॉल्ट सेटिंग्स पुनः स्थापित करें"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-800 dark:text-slate-300" />
          <span className="hidden sm:inline">डिफ़ॉल्ट</span>
        </motion.button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* =================================================================== */}
        {/* SECTION 1: दृश्य एवं फ़ॉन्ट (Appearance & Typography) */}
        {/* =================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="settings-section-title text-sm sm:text-base font-notoserif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              दृश्य एवं अनुभव (Appearance & Theme)
            </h2>
          </div>

          <GlassCard className="settings-group-card p-4 sm:p-6 space-y-6 rounded-2xl sm:rounded-3xl border-stone-200 dark:border-white/10">
            {/* 1.1 Atmosphere Theme (Manuscript vs Cosmic vs Sanctum) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="settings-item-label text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>पृष्ठभूमि परिवेश (Atmosphere Theme)</span>
                </label>
                <span className="text-[11px] font-gotu text-stone-700 dark:text-slate-300 font-bold">
                  {settings.backgroundTheme === 'manuscript'
                    ? 'प्राचीन पांडुलिपि'
                    : settings.backgroundTheme === 'cosmic'
                    ? 'अंतरिक्ष (Cosmic)'
                    : 'जिनालय गर्भगृह'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Theme Option 1: Ancient Manuscript (Default) */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('backgroundTheme', 'manuscript')}
                  className={`settings-theme-option relative p-3.5 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                    settings.backgroundTheme === 'manuscript'
                      ? 'settings-theme-active ring-2 ring-amber-600 border-amber-600 bg-amber-500/10 dark:bg-amber-500/20 shadow-md'
                      : 'bg-stone-100/80 dark:bg-slate-900/60 border-stone-300 dark:border-white/10 hover:border-amber-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#991B1B] border border-amber-600/40 shadow-xs shrink-0" />
                      <span className="settings-theme-title text-xs font-bold font-notoserif text-stone-900 dark:text-white">प्राचीन पांडुलिपि</span>
                    </div>
                    {settings.backgroundTheme === 'manuscript' && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                  <p className="settings-theme-desc text-[11px] font-gotu text-stone-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                    पुरातन ताड़पत्र, कुंकुम, स्वर्ण मुहर व उभरे स्पर्श पृष्ठ (दिन के लिए श्रेष्ठ)।
                  </p>
                </motion.button>

                {/* Theme Option 2: Cosmic Night */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('backgroundTheme', 'cosmic')}
                  className={`settings-theme-option relative p-3.5 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                    settings.backgroundTheme === 'cosmic'
                      ? 'settings-theme-active ring-2 ring-blue-500 border-blue-500 bg-blue-500/15 dark:bg-blue-900/30 shadow-md'
                      : 'bg-stone-100/80 dark:bg-slate-900/60 border-stone-300 dark:border-white/10 hover:border-blue-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#1D4ED8] border border-blue-300/40 shadow-xs shrink-0" />
                      <span className="settings-theme-title text-xs font-bold font-notoserif text-stone-900 dark:text-slate-100">अंतरिक्ष (Cosmic)</span>
                    </div>
                    {settings.backgroundTheme === 'cosmic' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                  <p className="settings-theme-desc text-[11px] font-gotu text-stone-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                    गहन अंतरिक्ष, टिमटिमाते तारे व नेबुला (रात्रि स्वाध्याय हेतु सौम्य)।
                  </p>
                </motion.button>

                {/* Theme Option 3: Sanctum Garbhagriha */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('backgroundTheme', 'sanctum')}
                  className={`settings-theme-option relative p-3.5 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                    settings.backgroundTheme === 'sanctum'
                      ? 'settings-theme-active ring-2 ring-amber-500 border-amber-500 bg-amber-500/15 dark:bg-amber-950/40 shadow-md'
                      : 'bg-stone-100/80 dark:bg-slate-900/60 border-stone-300 dark:border-white/10 hover:border-amber-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] border border-amber-300/40 shadow-xs shrink-0" />
                      <span className="settings-theme-title text-xs font-bold font-notoserif text-stone-900 dark:text-amber-100">जिनालय गर्भगृह</span>
                    </div>
                    {settings.backgroundTheme === 'sanctum' && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                  <p className="settings-theme-desc text-[11px] font-gotu text-stone-700 dark:text-amber-200/90 leading-relaxed line-clamp-2">
                    अखंड दीप ज्योति, धूप सुवास व पवित्र पाषाण मंदिर आभा।
                  </p>
                </motion.button>
              </div>

              {/* 1.1b Manuscript Paper Shades (पांडुलिपि पृष्ठ रंग) */}
              {settings.backgroundTheme === 'manuscript' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="settings-item-label text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <span>पांडुलिपि पृष्ठ रंग (Shades of Old Pages)</span>
                    </label>
                    <span className="text-[11px] font-gotu text-amber-900 dark:text-amber-300 font-bold">
                      {MANUSCRIPT_SHADES.find((s) => s.id === (settings.manuscriptShade || 'tadpatra'))?.nameHi} • {MANUSCRIPT_SHADES.find((s) => s.id === (settings.manuscriptShade || 'tadpatra'))?.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {MANUSCRIPT_SHADES.map((shade) => {
                      const isActive = (settings.manuscriptShade || 'tadpatra') === shade.id;
                      return (
                        <motion.button
                          key={shade.id}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleSettingChange('manuscriptShade', shade.id)}
                          className={`relative p-3 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                            isActive
                              ? 'ring-2 ring-amber-600 border-amber-600 shadow-md'
                              : 'border-stone-300 dark:border-white/10 hover:border-amber-500/50'
                          }`}
                          style={{
                            backgroundColor: shade.cardHex,
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="w-3.5 h-3.5 rounded-full border shadow-2xs shrink-0"
                                style={{
                                  backgroundColor: shade.bgHex,
                                  borderColor: shade.borderRgba,
                                }}
                              />
                              <span
                                className="text-xs font-bold font-notoserif truncate leading-tight"
                                style={{ color: shade.ink }}
                              >
                                {shade.nameHi}
                              </span>
                            </div>
                            {isActive && (
                              <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[10.5px] font-gotu leading-snug line-clamp-2"
                            style={{ color: shade.ink, opacity: 0.85 }}
                          >
                            {shade.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 1.2 Devanagari Typography Style */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10">
              <label className="settings-item-label text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white block mb-2.5">
                देवनागरी फ़ॉन्ट शैली (Devanagari Typeface)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('fontFamily', 'serif')}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    settings.fontFamily !== 'sans'
                      ? 'settings-font-tile-active bg-amber-500/15 border-amber-600 dark:bg-amber-500/20 dark:border-amber-400 text-stone-950 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-sm'
                      : 'bg-[#ECE5D5]/60 dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-800 dark:text-slate-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-notoserif font-bold text-base text-stone-900 dark:text-white">
                        पारंपरिक सेरिफ़ (Noto Serif)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-600/15 border border-amber-600/30 text-amber-900 dark:text-amber-300">
                        शास्त्रीय
                      </span>
                    </div>
                    {settings.fontFamily !== 'sans' && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                  <div className="font-notoserif text-base font-bold text-amber-900 dark:text-amber-300 my-1">
                    « ॐ नमः सिद्धेभ्यः »
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-slate-300 leading-relaxed">
                    आगम, प्राचीन शास्त्र व स्तोत्र पाठन हेतु शास्त्रीय एवं प्रामाणिक।
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('fontFamily', 'sans')}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    settings.fontFamily === 'sans'
                      ? 'settings-font-tile-active bg-amber-500/15 border-amber-600 dark:bg-amber-500/20 dark:border-amber-400 text-stone-950 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-sm'
                      : 'bg-[#ECE5D5]/60 dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-800 dark:text-slate-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-gotu font-bold text-base text-stone-900 dark:text-white">
                        आधुनिक सांस (Mukta / Gotu)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-600/15 border border-sky-600/30 text-sky-900 dark:text-sky-300">
                        आधुनिक
                      </span>
                    </div>
                    {settings.fontFamily === 'sans' && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                  <div className="font-gotu text-base font-bold text-amber-900 dark:text-amber-300 my-1">
                    « ॐ नमः सिद्धेभ्यः »
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-slate-300 leading-relaxed">
                    आधुनिक मोबाइल स्क्रीनों पर तीव्र, स्पष्ट एवं सुपाठ्य।
                  </p>
                </motion.button>
              </div>
            </div>

            {/* 1.3 Font Size with Live Preview */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <label className="settings-item-label text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white">
                  फ़ॉन्ट आकार (Text Size)
                </label>
                <span className="text-[11px] font-gotu text-amber-900 dark:text-amber-300 font-bold">
                  {settings.fontSize === 'small'
                    ? 'छोटा (14px)'
                    : settings.fontSize === 'medium'
                    ? 'मध्यम (16px • मानक)'
                    : settings.fontSize === 'large'
                    ? 'बड़ा (18px)'
                    : 'बहुत बड़ा (20px)'}
                </span>
              </div>

              {/* Segmented Control */}
              <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#ECE5D5] dark:bg-slate-950/70 border border-[#B8860B]/30 dark:border-white/10 mb-3.5">
                {[
                  { id: 'small', label: 'अ', tag: 'छोटा' },
                  { id: 'medium', label: 'अ+', tag: 'मध्यम' },
                  { id: 'large', label: 'अ++', tag: 'बड़ा' },
                  { id: 'xl', label: 'अ+++', tag: 'अति बड़ा' },
                ].map((item) => {
                  const isActive = settings.fontSize === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleSettingChange('fontSize', item.id as any)}
                      className={`settings-size-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer border ${
                        isActive
                          ? 'settings-size-btn-active bg-gradient-to-r from-red-700 to-red-800 text-white border-red-600/40 shadow-sm font-bold'
                          : 'bg-transparent border-transparent text-stone-800 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white font-medium'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-bold font-notoserif leading-tight">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-gotu leading-none mt-0.5">
                        {item.tag}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Dynamic Live Preview Box */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  settings.backgroundTheme === 'manuscript'
                    ? 'bg-[#ECE5D5] border-amber-600/35 text-[#1C1917]'
                    : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-gotu text-stone-700 dark:text-slate-300 mb-1.5 border-b border-black/10 dark:border-white/10 pb-1.5">
                  <span className="font-bold">सजीव पूर्वावलोकन (Live Text Preview):</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 font-mono text-[10px] text-amber-900 dark:text-amber-300 font-bold">
                    {settings.fontFamily === 'sans' ? 'Mukta' : 'Noto Serif'} • {settings.fontSize}
                  </span>
                </div>
                <div
                  className={`leading-relaxed transition-all ${
                    settings.fontFamily === 'sans' ? 'font-gotu' : 'font-notoserif'
                  } ${
                    settings.fontSize === 'small'
                      ? 'text-xs sm:text-sm'
                      : settings.fontSize === 'medium'
                      ? 'text-sm sm:text-base'
                      : settings.fontSize === 'large'
                      ? 'text-base sm:text-lg'
                      : 'text-lg sm:text-xl'
                  }`}
                >
                  <p className="font-bold text-amber-950 dark:text-amber-200 leading-snug">
                    « णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं »
                  </p>
                  <p className="mt-1.5 text-xs text-stone-800 dark:text-slate-300 font-medium leading-relaxed">
                    सम्यग्दर्शन-ज्ञान-चारित्राणि मोक्षमार्गः। (तत्त्वार्थ सूत्र १/१)
                  </p>
                </div>
              </div>
            </div>

            {/* 1.4 Dock Visual Theme */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10">
              <label className="settings-item-label text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white block mb-2.5">
                निचला नेविगेशन बार (Dock Visual Style)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'frosted',
                    label: 'फ़्रॉस्टेड',
                    desc: 'पारदर्शी काँच',
                    dotColor: 'bg-sky-400',
                  },
                  {
                    id: 'crystal',
                    label: 'क्रिस्टल',
                    desc: 'श्वेत ल्युमिनस',
                    dotColor: 'bg-white border border-stone-400',
                  },
                  {
                    id: 'gilded',
                    label: 'स्वर्णिम',
                    desc: 'गोल्डन किनारा',
                    dotColor: 'bg-amber-400',
                  },
                  {
                    id: 'classic',
                    label: 'क्लासिक',
                    desc: 'गहरा नेवी',
                    dotColor: 'bg-indigo-400',
                  },
                ].map((d) => {
                  const isActive = (settings.dockTheme || 'frosted') === d.id;
                  return (
                    <motion.button
                      key={d.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleSettingChange('dockTheme', d.id as any)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? 'settings-dock-tile-active bg-amber-500/15 border-amber-600 dark:bg-amber-500/20 dark:border-amber-400 ring-2 ring-amber-500/30 text-stone-950 dark:text-amber-200 shadow-sm font-bold'
                          : 'settings-dock-tile-inactive bg-[#ECE5D5]/60 dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-800 dark:text-slate-300 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${d.dotColor} shadow-xs`} />
                          <span className="text-xs font-bold font-notoserif text-stone-900 dark:text-white">
                            {d.label}
                          </span>
                        </div>
                        {isActive && (
                          <span className="settings-dock-check w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span
                        className={`dock-tile-desc text-[10px] block truncate ${
                          isActive
                            ? 'text-amber-950 dark:text-amber-200/90 font-bold'
                            : 'text-stone-600 dark:text-slate-400 font-medium'
                        }`}
                      >
                        {d.desc}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* =================================================================== */}
        {/* SECTION 2: स्वाध्याय एवं साधना (Worship & Audio Preferences) */}
        {/* =================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="settings-section-title text-sm sm:text-base font-notoserif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              स्वाध्याय एवं साधना (Worship & Audio)
            </h2>
          </div>

          <GlassCard className="settings-group-card divide-y divide-stone-200 dark:divide-white/10 rounded-2xl sm:rounded-3xl border-stone-200 dark:border-white/10 overflow-hidden">
            {/* 2.1 Haptic Touch Vibration */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 mt-0.5">
                  <SmartphoneNfc className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="settings-row-title text-sm font-gotu font-bold text-stone-900 dark:text-white">
                    स्वाध्याय स्पर्श कम्पन (Haptics)
                  </h3>
                  <p className="settings-row-desc text-xs text-stone-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                    जाप माला के प्रत्येक मनके, पृष्ठ पलटने व बटनों पर हल्का सात्विक कम्पन।
                  </p>
                </div>
              </div>

              {/* Native Switch 1: Haptics */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.hapticFeedback !== false}
                onClick={() => handleSettingChange('hapticFeedback', settings.hapticFeedback === false ? true : false)}
                className={`settings-switch flex items-center w-12 h-7 rounded-full p-[3px] transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border ${
                  settings.hapticFeedback !== false
                    ? 'settings-switch-on bg-emerald-700 dark:bg-emerald-600 border-emerald-800 dark:border-emerald-500 justify-end shadow-sm'
                    : 'settings-switch-off bg-[#ECE5D5] dark:bg-slate-700/80 border-[#B8860B]/40 dark:border-slate-600/80 justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md border border-black/10 pointer-events-none"
                />
              </button>
            </div>

            {/* 2.2 Auto-play Audio */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                  <Volume2 className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="settings-row-title text-sm font-gotu font-bold text-stone-900 dark:text-white">
                    ऑडियो स्वतः प्रारंभ (Auto-play Audio)
                  </h3>
                  <p className="settings-row-desc text-xs text-stone-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                    स्तोत्र अथवा आरती पृष्ठ खोलते ही उपलब्ध मंगलाचरण ऑडियो स्वतः प्रारंभ हो।
                  </p>
                </div>
              </div>

              {/* Native Switch 2: AutoPlay */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.autoPlay}
                onClick={() => handleSettingChange('autoPlay', !settings.autoPlay)}
                className={`settings-switch flex items-center w-12 h-7 rounded-full p-[3px] transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border ${
                  settings.autoPlay
                    ? 'settings-switch-on bg-emerald-700 dark:bg-emerald-600 border-emerald-800 dark:border-emerald-500 justify-end shadow-sm'
                    : 'settings-switch-off bg-[#ECE5D5] dark:bg-slate-700/80 border-[#B8860B]/40 dark:border-slate-600/80 justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md border border-black/10 pointer-events-none"
                />
              </button>
            </div>

            {/* 2.3 Detailed Tithi Timings */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0 mt-0.5">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="settings-row-title text-sm font-gotu font-bold text-stone-900 dark:text-white">
                    विस्तृत पंचांग समय (Detailed Tithi Timings)
                  </h3>
                  <p className="settings-row-desc text-xs text-stone-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                    पंचांग में तिथि एवं नक्षत्र के सटीक आरंभ व समाप्ति समय का विस्तार दिखाएं।
                  </p>
                </div>
              </div>

              {/* Native Switch 3: Tithi Timings */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.showTithiTimings !== false}
                onClick={() =>
                  handleSettingChange('showTithiTimings', settings.showTithiTimings === false ? true : false)
                }
                className={`settings-switch flex items-center w-12 h-7 rounded-full p-[3px] transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border ${
                  settings.showTithiTimings !== false
                    ? 'settings-switch-on bg-emerald-700 dark:bg-emerald-600 border-emerald-800 dark:border-emerald-500 justify-end shadow-sm'
                    : 'settings-switch-off bg-[#ECE5D5] dark:bg-slate-700/80 border-[#B8860B]/40 dark:border-slate-600/80 justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md border border-black/10 pointer-events-none"
                />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* =================================================================== */}
        {/* SECTION 3: स्मरण एवं सूचनाएं (Reminders & Notifications) */}
        {/* =================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="settings-section-title text-sm sm:text-base font-notoserif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              स्मरण एवं सूचनाएँ (Alarms & Reminders)
            </h2>
          </div>

          <GlassCard className="settings-group-card divide-y divide-stone-200 dark:divide-white/10 rounded-2xl sm:rounded-3xl border-stone-200 dark:border-white/10 overflow-hidden">
            {/* 3.1 Sunset Chauvihar Alarm */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  <SunMedium className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="settings-row-title text-sm font-gotu font-bold text-stone-900 dark:text-white">
                      सूर्यास्त पूर्व चौविहार स्मरण
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/35 text-amber-900 dark:text-amber-300 text-[10px] font-bold">
                      सूर्यास्त से ४८ मिनट पूर्व
                    </span>
                  </div>
                  <p className="settings-row-desc text-xs text-stone-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                    सूर्यास्त से पूर्व रात्रि भोजन त्याग (चौविहार/तिविहार) का समय पर पावन स्मरण।
                  </p>
                </div>
              </div>

              {/* Native Switch 4: Sunset Chauvihar */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.sunsetReminder}
                onClick={() => handleSettingChange('sunsetReminder', !settings.sunsetReminder)}
                className={`settings-switch flex items-center w-12 h-7 rounded-full p-[3px] transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border ${
                  settings.sunsetReminder
                    ? 'settings-switch-on bg-emerald-700 dark:bg-emerald-600 border-emerald-800 dark:border-emerald-500 justify-end shadow-sm'
                    : 'settings-switch-off bg-[#ECE5D5] dark:bg-slate-700/80 border-[#B8860B]/40 dark:border-slate-600/80 justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md border border-black/10 pointer-events-none"
                />
              </button>
            </div>

            {/* 3.2 Parva & Daily Festival Alerts */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0 mt-0.5">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="settings-row-title text-sm font-gotu font-bold text-stone-900 dark:text-white">
                    पर्व एवं दैनिक धार्मिक सूचनाएँ
                  </h3>
                  <p className="settings-row-desc text-xs text-stone-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                    अष्टमी, चौदस, महापर्व, कल्याणक दिवस एवं प्रातः अमृत वचन की दैनिक सूचना।
                  </p>
                </div>
              </div>

              {/* Native Switch 5: Notifications */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.notifications}
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`settings-switch flex items-center w-12 h-7 rounded-full p-[3px] transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border ${
                  settings.notifications
                    ? 'settings-switch-on bg-emerald-700 dark:bg-emerald-600 border-emerald-800 dark:border-emerald-500 justify-end shadow-sm'
                    : 'settings-switch-off bg-[#ECE5D5] dark:bg-slate-700/80 border-[#B8860B]/40 dark:border-slate-600/80 justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md border border-black/10 pointer-events-none"
                />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* =================================================================== */}
        {/* SECTION 4: डेटा, ऑफ़लाइन एवं भण्डारण (Data, Offline & Storage) */}
        {/* =================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="settings-section-title text-sm sm:text-base font-notoserif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              डेटा एवं ऑफ़लाइन भण्डारण (Data & Offline Storage)
            </h2>
          </div>

          <GlassCard className="settings-group-card p-4 sm:p-6 space-y-6 rounded-2xl sm:rounded-3xl border-stone-200 dark:border-white/10">
            {/* 4.1 Temple Mode (100% Offline Cache) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/35">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-gotu font-bold text-stone-900 dark:text-white">
                        🛕 मंदिर मोड (100% ऑफ़लाइन जिनवाणी)
                      </h3>
                      {isTempleModeReady ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          सक्रिय एवं सुरक्षित
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          डाउनलोड उपलब्ध (~15 MB)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 dark:text-slate-300 mt-1 leading-relaxed">
                      सभी ४५०+ प्राचीन शास्त्र ग्रंथ, पूजा, स्तोत्र व नवकार मंत्र ऑडियो को फ़ोन में स्थानीय रूप से सहेजें ताकि जिनालय में बिना इंटरनेट भी ऐप तेज चले।
                    </p>
                  </div>
                </div>
              </div>

              {isTempleModeDownloading ? (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-amber-800 dark:text-amber-300 font-mono font-bold">
                    <span>डाउनलोड हो रहा है…</span>
                    <span>{templeModeProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-300 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${templeModeProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-stone-600 dark:text-slate-400 font-medium">
                    {isTempleModeReady
                      ? 'नवीनतम सामग्री डिवाइस मेमोरी में सुरक्षित है।'
                      : 'एक बार डाउनलोड करने पर डेटा हमेशा ऑफलाइन उपलब्ध रहेगा।'}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadTempleMode}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer hover:from-red-800 hover:to-red-900 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isTempleModeReady ? 'पुनः सिंक करें' : 'ऑफ़लाइन सहेजें'}</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* 4.2 Data Backup & Restore */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs sm:text-sm font-gotu font-bold text-stone-900 dark:text-white">
                  डेटा बैकअप एवं रीस्टोर (JSON Export / Import)
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-400 mb-3 leading-relaxed">
                अपने पसंदीदा स्तोत्र, नित्य नियम व व्यक्तिगत सेटिंग्स का बैकअप डाउनलोड करें या नए फ़ोन में पुनर्स्थापित करें।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    triggerHaptic('medium');
                    const jsonStr = exportBackupData();
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const dateStr = new Date().toISOString().split('T')[0];
                    a.download = `jain_jinvani_backup_${dateStr}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setBackupSuccessMessage('✅ बैकअप फ़ाइल सफलतापूर्वक डाउनलोड हो गई!');
                    setTimeout(() => setBackupSuccessMessage(null), 4000);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-gotu text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>बैकअप फ़ाइल डाउनलोड करें</span>
                </motion.button>

                <label className="py-2.5 px-4 rounded-xl bg-[#ECE5D5]/80 dark:bg-white/10 hover:bg-stone-300 dark:hover:bg-white/15 border border-[#B8860B]/30 dark:border-white/10 text-stone-900 dark:text-white font-bold font-gotu text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-center shadow-xs">
                  <Upload className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>फ़ाइल से रीस्टोर करें</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const fileText = event.target?.result as string;
                        if (fileText) {
                          const result = importBackupData(fileText);
                          if (result.success) {
                            setSettings(getSettings());
                            triggerHaptic('success');
                            setBackupSuccessMessage(`🎉 ${result.message} (${result.count || 0} पसंदीदा रचनाएँ)`);
                            setTimeout(() => setBackupSuccessMessage(null), 5000);
                          } else {
                            window.alert(`⚠️ ${result.message}`);
                          }
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {backupSuccessMessage && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs font-gotu font-bold text-center">
                  {backupSuccessMessage}
                </div>
              )}
            </div>

            {/* 4.3 Storage Estimates & Persistence */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-stone-800 dark:text-slate-200 font-bold block">
                  डिवाइस स्टोरेज स्थिति:{' '}
                  {storageInfo ? `${storageInfo.usageMB.toFixed(1)} MB इस्तेमाल` : 'उपलब्धता जाँची जा रही है...'}
                </span>
                <span className="text-[11px] text-stone-600 dark:text-slate-400 block mt-0.5">
                  {storageInfo?.isPersisted
                    ? '✅ स्थायी स्टोरेज सक्रिय है (ब्राउज़र कैशे अपने आप साफ़ नहीं करेगा)'
                    : '⚠️ अस्थायी स्टोरेज (मेमोरी भर जाने पर ब्राउज़र कैशे हटा सकता है)'}
                </span>
              </div>

              {storageInfo && !storageInfo.isPersisted && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={handleRequestPersist}
                  disabled={isRequestingPersist}
                  className="px-3 py-1.5 rounded-xl bg-[#ECE5D5] dark:bg-white/10 border border-[#B8860B]/30 dark:border-white/15 text-stone-900 dark:text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-stone-300 transition-colors"
                >
                  {isRequestingPersist ? 'अनुरोध जारी...' : 'स्थायी स्टोरेज सुरक्षित करें'}
                </motion.button>
              )}
            </div>

            {/* 4.4 Data & History Reset Actions */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10">
              <label className="text-xs font-gotu font-bold text-stone-900 dark:text-white block mb-2">
                डेटा एवं इतिहास प्रबंधन (Data & History Management)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleClearHistory}
                  className="px-3.5 py-2 rounded-xl bg-[#ECE5D5]/80 dark:bg-white/10 border border-stone-300 dark:border-white/15 hover:bg-stone-300/80 dark:hover:bg-white/15 text-stone-800 dark:text-slate-300 text-xs font-gotu font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="हालिया स्वाध्याय इतिहास साफ़ करें"
                >
                  <Trash2 className="w-3.5 h-3.5 text-stone-700 dark:text-slate-400" />
                  <span>हालिया स्वाध्याय इतिहास साफ़ करें</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleResetDefaults}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/25 hover:bg-red-500/20 text-red-900 dark:text-red-300 text-xs font-gotu font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="सभी प्राथमिकताएं रीसेट करें"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
                  <span>सभी प्राथमिकताएं रीसेट करें</span>
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* =================================================================== */}
        {/* SECTION 5: ऐप परिचय एवं सहायता (About & Help) */}
        {/* =================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Info className="w-4 h-4 text-stone-700 dark:text-slate-300" />
            <h2 className="settings-section-title text-sm sm:text-base font-notoserif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              ऐप परिचय एवं सहायता (About & Support)
            </h2>
          </div>

          <GlassCard className="settings-group-card p-4 sm:p-6 space-y-4 rounded-2xl sm:rounded-3xl border-stone-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-notoserif font-bold text-base text-stone-900 dark:text-white">
                  जैन जिनवाणी महाकोश
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                  संस्करण v0.1.0 • PWA • सर्वाधिकार सुरक्षित
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                १००% निःशुल्क व विज्ञापन-रहित
              </div>
            </div>

            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed font-gotu">
              चारों अनुयोग, प्राचीन जैन आगम ग्रंथ, पूजा, स्तोत्र, आरती, चालीसा, २४ तीर्थंकर परिचय एवं पंचांग का प्रामाणिक व निःशुल्क डिजिटल महा-संग्रह।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-white/10">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  triggerHaptic('light');
                  setShowFeedbackModal(true);
                }}
                className="p-3 rounded-2xl bg-[#ECE5D5]/80 dark:bg-white/5 border border-[#B8860B]/30 dark:border-white/10 hover:border-amber-500/50 flex items-center gap-2.5 text-stone-900 dark:text-white text-xs font-bold transition-all cursor-pointer text-left shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div>सुझाव या त्रुटि बताएं</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 font-normal">सुधार व नई रचनाओं का प्रस्ताव</div>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  triggerHaptic('light');
                  setShowAagamAiModal(true);
                }}
                className="p-3 rounded-2xl bg-[#ECE5D5]/80 dark:bg-white/5 border border-[#B8860B]/30 dark:border-white/10 hover:border-purple-500/50 flex items-center gap-2.5 text-stone-900 dark:text-white text-xs font-bold transition-all cursor-pointer text-left shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div>आगम AI जिज्ञासा</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 font-normal">आगम आधारित तत्त्वार्थ प्रश्नोत्तरी</div>
                </div>
              </motion.button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Google Form Community Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Cloudflare Workers AI - Aagam AI Q&A Modal */}
      <AagamAiModal
        isOpen={showAagamAiModal}
        onClose={() => setShowAagamAiModal(false)}
      />
    </div>
  );
};

export default SettingsPage;
