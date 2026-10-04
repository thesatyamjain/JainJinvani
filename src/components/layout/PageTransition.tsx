import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  pageKey: string;
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  pageKey,
  children,
  className = 'min-h-full overflow-x-hidden',
}) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.16, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);
