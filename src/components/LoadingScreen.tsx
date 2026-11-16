import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandMark } from './BrandMark';

export function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return false;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    }
    return true;
  });

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-xl"
          >
            <p className="text-xs uppercase tracking-[0.26em] text-[#8A7768] mb-3">
              A Personal Digital Autobiography
            </p>
            <BrandMark size="lg" />
            <div className="mt-5 mx-auto w-24 h-px bg-[#D8CCBC]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
