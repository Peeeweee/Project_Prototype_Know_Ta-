import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const CinematicTransition: React.FC = () => {
  const { transitionType, currentScene } = useStore();

  if (!transitionType) return null;

  const sceneTitles: Record<string, string> = {
    hero: '01 · IS THIS SONG HUMAN?',
    problem: '02 · THE TRIPLE FAILURE',
    pipeline: '03 · DUAL-BRANCH PIPELINE',
    branches: '04 · INSIDE THE BRANCHES',
    demo: '05 · INTERACTIVE FORENSIC DEMO',
    report: '06 · AUTHENTICITY SPEC SHEET',
    research: '07 · SCIENTIFIC METHODOLOGY'
  };

  return (
    <AnimatePresence>
      {/* SHUTTER TRANSITION: 6 vertical staggered strips */}
      {transitionType === 'shutter' && (
        <div className="fixed inset-0 z-[9995] pointer-events-none flex flex-row overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <motion.div
              key={index}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: [0.77, 0, 0.175, 1]
              }}
              style={{ originY: index % 2 === 0 ? 'top' : 'bottom' }}
              className="flex-1 bg-neutral-950 border-r border-neutral-900 last:border-none"
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="font-mono text-sm tracking-[0.3em] uppercase text-white bg-black/80 px-6 py-2 border border-neutral-800">
              {sceneTitles[currentScene] || 'KNOW-TA! TRANSITION'}
            </span>
          </motion.div>
        </div>
      )}

      {/* IRIS CIRCLE WIPE */}
      {transitionType === 'iris' && (
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[9995] bg-black pointer-events-none flex items-center justify-center"
        >
          <div className="text-center font-display tracking-wider text-xl uppercase text-white">
            <span className="font-mono text-xs block text-neutral-500 mb-1 tracking-widest">
              DISPATCHING VECTOR BRANCH
            </span>
            {sceneTitles[currentScene] || 'INITIALIZING'}
          </div>
        </motion.div>
      )}

      {/* GLITCH WIPE */}
      {transitionType === 'glitch' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: [0, 1, 0.8, 1, 0], scale: 1 }}
          transition={{ duration: 0.55, times: [0, 0.2, 0.4, 0.7, 1] }}
          className="fixed inset-0 z-[9995] bg-black pointer-events-none flex flex-col items-center justify-center border-y-4 border-white"
        >
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-300">
            // TENSOR PROJECTION INTERLACE //
          </div>
          <div className="font-display text-2xl tracking-tighter text-white mt-2">
            {sceneTitles[currentScene] || 'KNOW-TA! CORE'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
