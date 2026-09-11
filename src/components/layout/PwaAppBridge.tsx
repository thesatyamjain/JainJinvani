import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  WifiOff,
  Wifi,
  RefreshCw,
  X,
  Share,
  PlusSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  canInstallPwa,
  promptPwaInstall,
  subscribeToInstallPrompt,
  subscribeToNetworkStatus,
  subscribeToAppUpdates,
  applyAppUpdate,
  isStandaloneMode,
  isIOSDevice,
  triggerHaptic,
} from '../../utils/pwaManager';

export const PwaAppBridge = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());

    // 1. Network status subscription
    const unsubscribeNetwork = subscribeToNetworkStatus((online) => {
      setIsOnline((prev) => {
        if (!prev && online) {
          // Came back online
          setShowOnlineToast(true);
          setTimeout(() => setShowOnlineToast(false), 2800);
        }
        return online;
      });
    });

    // 2. Install prompt subscription
    const unsubscribeInstall = subscribeToInstallPrompt((available) => {
      setInstallAvailable(available);
    });

    // 3. App update subscription
    const unsubscribeUpdate = subscribeToAppUpdates(() => {
      setUpdateAvailable(true);
    });

    // 4. Listen for manual trigger from menus/buttons
    const handleManualInstallTrigger = () => {
      if (isStandaloneMode()) return;
      if (isIOSDevice()) {
        setShowIOSGuide(true);
      } else {
        setShowInstallModal(true);
      }
    };

    window.addEventListener('jinvani:open-install-prompt', handleManualInstallTrigger);

    return () => {
      unsubscribeNetwork();
      unsubscribeInstall();
      unsubscribeUpdate();
      window.removeEventListener('jinvani:open-install-prompt', handleManualInstallTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (isIOSDevice()) {
      setShowInstallModal(false);
      setShowIOSGuide(true);
      return;
    }
    const success = await promptPwaInstall();
    if (success) {
      triggerHaptic('success');
      setShowInstallModal(false);
    }
  };

  const handleUpdateClick = () => {
    triggerHaptic('medium');
    applyAppUpdate();
  };

  return (
    <>
      {/* 1. Network Offline / Online Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.aside
            key="pwa-offline-banner"
            aria-label="ऑफ़लाइन स्थिति"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-2 sm:top-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none select-none safe-pt"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-xl pointer-events-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-gotu text-[11px] sm:text-xs tracking-wide">
                ऑफ़लाइन मोड • मंदिर स्वाध्याय उपलब्ध है
              </span>
            </div>
          </motion.aside>
        )}

        {showOnlineToast && isOnline && (
          <motion.aside
            key="pwa-online-banner"
            aria-label="ऑनलाइन स्थिति"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-2 sm:top-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none select-none safe-pt"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 text-xs shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.25)] backdrop-blur-xl pointer-events-auto">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-gotu text-[11px] sm:text-xs font-medium tracking-wide">
                इंटरनेट कनेक्टेड • सभी सेवाएं सक्रिय
              </span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. Zero-Downtime App Update Toast */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.aside
            key="pwa-update-toast"
            aria-label="ऐप अपडेट सूचना"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm pointer-events-auto select-none safe-pb"
          >
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-amber-950/90 to-slate-900/95 border border-amber-400/50 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.25)] backdrop-blur-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold font-gotu text-amber-100 truncate">नया संस्करण तैयार है</p>
                  <p className="text-[11px] text-slate-300 font-gotu">नवीनतम सामग्री हेतु रीलोड करें</p>
                </div>
              </div>
              <button
                onClick={handleUpdateClick}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-gotu font-bold text-xs shrink-0 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                अपडेट करें
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3. In-App Install Sheet (Android / Chromium WebAPK) */}
      <AnimatePresence>
        {showInstallModal && !isStandalone && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#050811] border border-amber-500/30 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.18)] relative safe-pb"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src="/icons/pwa-192x192.png"
                  alt="जैन जिनवाणी"
                  className="w-14 h-14 rounded-2xl border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] object-cover bg-[#05060a]"
                />
                <div>
                  <h2 className="text-base font-bold font-notoserif text-amber-200">
                    जैन जिनवाणी ऐप
                  </h2>
                  <p className="text-xs text-amber-400/80 font-gotu flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    100% ऑफ़लाइन स्वाध्याय संग्रह
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 my-4 text-xs font-gotu text-slate-300 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>बिना इंटरनेट मंदिर में भी सभी पूजा व स्तोत्र चलें</span>
                </div>
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>पूर्ण स्क्रीन अनुभव • कोई ब्राउज़र बार नहीं</span>
                </div>
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>होम स्क्रीन पर पवित्र जिनवाणी का सुंदर आइकॉन</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-gotu text-xs font-medium transition-colors cursor-pointer"
                >
                  अभी नहीं
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black font-gotu text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  ऐप इंस्टॉल करें
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. iOS Safari Guided "Add to Home Screen" Modal */}
      <AnimatePresence>
        {showIOSGuide && !isStandalone && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#050811] border border-amber-500/30 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.18)] relative safe-pb"
            >
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <img
                  src="/icons/apple-touch-icon.png"
                  alt="जैन जिनवाणी"
                  className="w-14 h-14 rounded-2xl border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] object-cover bg-[#05060a]"
                />
                <div>
                  <h2 className="text-base font-bold font-notoserif text-amber-200">
                    iPhone पर ऐप जोड़ें
                  </h2>
                  <p className="text-xs text-amber-400/80 font-gotu">
                    Safari ब्राउज़र से होम स्क्रीन पर स्थापित करें
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 my-4 text-xs font-gotu text-slate-200">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Safari में नीचे 'Share' बटन दबाएं</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      नीचे बार में <Share className="w-3 h-3 text-amber-300 inline" /> आइकॉन पर टैप करें।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">'Add to Home Screen' चुनें</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      मेनू में नीचे स्क्रॉल करके <PlusSquare className="w-3 h-3 text-amber-300 inline" /> "Add to Home Screen" चुनें।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">ऊपर 'Add' पर टैप करें</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      पवित्र जिनवाणी ऐप आपके iPhone की स्क्रीन पर सुरक्षित हो जाएगा।
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-gotu text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                समझ गया
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
