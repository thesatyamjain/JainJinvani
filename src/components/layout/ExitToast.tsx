import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';

interface ExitToastProps {
  isVisible: boolean;
}

export const ExitToast = ({ isVisible }: ExitToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-[999] px-4 w-full max-w-sm pointer-events-none"
        >
          <div className="bg-[#0b162c]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-3.5 text-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-gotu font-medium text-white leading-tight">
                ऐप से बाहर निकलने के लिए दोबारा वापस दबाएं
              </p>
              <p className="text-[11px] font-gotu text-amber-200/70 mt-0.5">
                Press back again to exit
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
