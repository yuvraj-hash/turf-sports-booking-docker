
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use correct public path and extension for image
const PROFILE_IMG = '/Profile-pic2.png'; // Ensure file is named Profile-pic2.png in public/

const GlassModal: React.FC = () => {
  const [show, setShow] = useState(() => {
    // Only show if not already shown in this session
    return sessionStorage.getItem('glassModalShown') !== 'true';
  });

  // Show modal immediately on first launch, auto-hide after 5s, only once per session
  useEffect(() => {
    if (show) {
      sessionStorage.setItem('glassModalShown', 'true');
      const hideTimer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [show]);

  // Modal animation variants (no blur)
  const modalVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring' } },
    exit: { opacity: 0, y: 40, transition: { duration: 0.2 } },
  };

  // Image animation (no blur)
  const imgVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, type: 'spring' } },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed z-50 flex items-end justify-start pointer-events-none"
          style={{ left: 0, bottom: 0, width: '100vw', height: '100vh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative m-4 w-[92vw] max-w-[320px] sm:max-w-[340px] bg-white/80 border border-white/60 rounded-2xl shadow-xl p-4 flex flex-col items-center pointer-events-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
          >
            {/* Close icon */}
            <button
              className="absolute top-2 right-3 text-xl text-black/60 hover:text-black/90 focus:outline-none"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              ×
            </button>
            {/* Profile image, loads instantly */}
            <motion.div
              className="mb-2 flex justify-center"
              variants={imgVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative">
                <img
                  src={PROFILE_IMG}
                  alt="Yuvraj Alnitak"
                  className="w-20 h-20 rounded-full border-2 border-white shadow object-cover bg-white"
                  style={{ boxShadow: '0 0 16px 2px #ff5e14, 0 0 0 3px rgba(255,255,255,0.15)' }}
                  onError={e => {
                    // fallback to jpg if png fails
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith('.png')) target.src = '/Profile-pic2.jpg';
                  }}
                />
                <span className="absolute inset-0 rounded-full animate-pulse bg-[#ff5e14]/20 z-[-1]" />
              </div>
            </motion.div>
            {/* Intro text just above name, smaller than title */}
            <div className="text-[11px] md:text-xs text-black/60 mb-0.5">Meet the brains behind this project</div>
            {/* Name and title */}
            <div className="text-base md:text-lg font-bold text-black mb-1">Yuvraj Alnitak</div>
            <div className="text-xs md:text-sm text-[#ff5e14] font-semibold mb-3">Project Lead</div>
            {/* LinkedIn button */}
            <a
              href="https://www.linkedin.com/in/yuvraj-s/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-1.5 rounded-full bg-[#ff5e14] text-white font-semibold shadow hover:bg-[#e54d00] transition mb-2 text-xs md:text-sm"
            >
              View LinkedIn
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
