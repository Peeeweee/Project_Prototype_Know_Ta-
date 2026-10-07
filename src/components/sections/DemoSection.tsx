import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Upload, Play, FastForward, AlertOctagon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DemoSection: React.FC = () => {
  const {
    startAnalysis,
    skipAnalysis,
    isAnalyzing,
    analysisProgress,
    analysisStepText,
    analysisLogs,
    selectedPreset,
    setSelectedPreset,
    setCursorText
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const randomPreset = (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)];
      startAnalysis(randomPreset, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const randomPreset = (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)];
      startAnalysis(randomPreset, file);
    }
  };

  return (
    <section
      id="demo"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Centered Section Header */}
      <div className="mb-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            05 // EVALUATION BENCHMARK
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-2">
          Test Any Song Track
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto">
          Drop your own song or choose one of the three test songs below to inspect the dual-branch analysis in action.
        </p>
      </div>

      {/* Main Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setCursorText('DROP')}
        onMouseLeave={() => setCursorText('')}
        className={`w-full max-w-lg mx-auto border-2 border-dashed p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden group bg-neutral-950/80 backdrop-blur-md rounded-2xl mb-6 ${
          isDragging
            ? 'border-white bg-white/10 scale-[1.01]'
            : 'border-white/20 hover:border-white/50 hover:bg-white/[0.03]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/wav,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-105 group-hover:border-white transition-all bg-black/40 flex-shrink-0">
            <Upload className="w-5 h-5 text-white" />
          </div>

          <div className="text-left">
            <h3 className="text-base font-display font-medium text-white tracking-tight">
              Drop your MP3 or WAV file here
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Click to browse or drop file (analyzes 30-sec clip with vocals)
            </p>
          </div>
        </div>
      </div>

      {/* Presets Selection Cards */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase font-semibold">
            OR TEST A BENCHMARK PRESET:
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            Click any card to start analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset A */}
          <button
            onClick={() => {
              setSelectedPreset('A');
              startAnalysis('A');
            }}
            onMouseEnter={() => setCursorText('SAMPLE A')}
            onMouseLeave={() => setCursorText('')}
            className={`p-5 border text-left transition-all relative group bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl ${
              selectedPreset === 'A'
                ? 'border-white ring-1 ring-white/20'
                : 'border-white/10 hover:border-white/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                SAMPLE A · HUMAN
              </span>
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
            </div>

            <h4 className="font-display text-base font-medium text-white mb-1.5">
              Real Studio Acoustic Song
            </h4>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Real singer with natural breathing sounds, acoustic guitars, and organic pitch waver.
            </p>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-300">
              <span>Expected: Human</span>
              <Play className="w-3 h-3 fill-white" />
            </div>
          </button>

          {/* Preset B */}
          <button
            onClick={() => {
              setSelectedPreset('B');
              startAnalysis('B');
            }}
            onMouseEnter={() => setCursorText('SAMPLE B')}
            onMouseLeave={() => setCursorText('')}
            className={`p-5 border text-left transition-all relative group bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl ${
              selectedPreset === 'B'
                ? 'border-white ring-1 ring-white/20'
                : 'border-white/10 hover:border-white/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                SAMPLE B · 100% AI
              </span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>

            <h4 className="font-display text-base font-medium text-white mb-1.5">
              Fully Generated Song
            </h4>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Vocals and backing beat made by computer algorithms. Shows synthetic harmonics.
            </p>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-300">
              <span>Expected: AI</span>
              <Play className="w-3 h-3 fill-white" />
            </div>
          </button>

          {/* Preset C (CONFLICT DEMO) */}
          <button
            onClick={() => {
              setSelectedPreset('C');
              startAnalysis('C');
            }}
            onMouseEnter={() => setCursorText('TRY THIS')}
            onMouseLeave={() => setCursorText('')}
            className={`p-5 border text-left transition-all relative group bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl ${
              selectedPreset === 'C'
                ? 'border-white ring-1 ring-white/20 bg-white/[0.04]'
                : 'border-white/20 hover:border-white/50'
            }`}
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-mono text-[10px] tracking-widest text-white uppercase font-bold bg-neutral-800 px-2 py-0.5 rounded">
                SAMPLE C · HYBRID ★
              </span>
              <AlertOctagon className="w-3.5 h-3.5 text-white animate-bounce" />
            </div>

            <h4 className="font-display text-base font-medium text-white mb-1.5">
              Human Vocal on AI Beat
            </h4>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Human singer on an AI beat. Triggers the dual-branch conflict alert flag!
            </p>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white font-semibold">
              <span>Conflict Alert</span>
              <Play className="w-3 h-3 fill-white" />
            </div>
          </button>
        </div>
      </div>

      {/* FULLSCREEN CINEMATIC ANALYSIS OVERLAY */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9990] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-14 select-none overflow-hidden"
          >
            {/* Ambient Background Glow matching phase */}
            <motion.div
              animate={{
                opacity: analysisProgress > 80 ? 0.3 : 0.1,
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white rounded-full blur-[120px] pointer-events-none opacity-10"
            />
          {/* Header */}
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span className="font-mono text-xs tracking-widest uppercase text-white font-semibold">
                KNOW-TA! IS CHECKING YOUR TRACK
              </span>
            </div>

            <button
              onClick={skipAnalysis}
              className="flex items-center space-x-1.5 px-3 py-1 bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors rounded"
            >
              <FastForward className="w-3 h-3" />
              <span>Skip Directly to Results</span>
            </button>
          </div>

          {/* Center Visual Sequence */}
          <div className="max-w-3xl w-full mx-auto my-auto py-8 text-center">
            {/* Dynamic Morphing Analysis Visualizer */}
            <div className="h-40 w-full flex items-center justify-center relative mb-8">
              <AnimatePresence mode="popLayout">
                {/* Phase 1: Ingestion - Glowing Waveform Pill */}
                {analysisProgress < 32 && (
                  <motion.div
                    key="phase1"
                    layoutId="morphing-core"
                    className="w-48 h-16 border border-white/20 bg-white/5 rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-24 h-1 bg-white rounded-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-[spin_2s_linear_infinite] origin-center opacity-50" />
                  </motion.div>
                )}

                {/* Phase 2/3/4: Splitting - Dual Orbs */}
                {analysisProgress >= 32 && analysisProgress < 75 && (
                  <motion.div key="phase234" className="flex items-center space-x-8 sm:space-x-12 relative">
                    <motion.div
                      layoutId="morphing-core"
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
                        analysisProgress >= 62 ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'border-white/30 bg-black'
                      }`}
                    >
                      <span className="absolute top-2 font-mono text-[9px] text-white/50 uppercase tracking-widest">Vocals</span>
                      {analysisProgress >= 62 ? (
                        <div className="flex space-x-1.5 items-end h-8">
                          {[1, 2, 3, 4, 5].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: ['4px', '24px', '4px'] }}
                              transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1 bg-white rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-10 h-px bg-white/20" />
                      )}
                    </motion.div>

                    {/* Connecting Energy Beam */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="h-px bg-white/30 relative"
                    >
                      <motion.div
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-1/2 h-full bg-white shadow-[0_0_10px_white]"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
                        analysisProgress >= 48 && analysisProgress < 62 ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'border-white/30 bg-black'
                      }`}
                    >
                      <span className="absolute top-2 font-mono text-[9px] text-white/50 uppercase tracking-widest">Inst</span>
                      {analysisProgress >= 48 && analysisProgress < 62 ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-px bg-white/20" />
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Phase 5: Balancing - Scale Track */}
                {analysisProgress >= 75 && analysisProgress < 88 && (
                  <motion.div
                    key="phase5"
                    layoutId="morphing-core"
                    className="w-64 sm:w-80 h-10 border border-white/30 bg-white/5 rounded-full flex items-center relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    <motion.div
                      animate={{ left: ['10%', '80%', '40%'] }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                      className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,1)] flex items-center justify-center z-10"
                      style={{ top: '-4px', marginLeft: '-24px' }}
                    >
                      <div className="w-4 h-4 border-2 border-black rounded-full" />
                    </motion.div>
                    <div className="w-full h-px bg-white/20 absolute top-1/2 -translate-y-1/2" />
                  </motion.div>
                )}

                {/* Phase 6: Monte Carlo - Particle Swarm */}
                {analysisProgress >= 88 && analysisProgress < 100 && (
                  <motion.div
                    key="phase6"
                    layoutId="morphing-core"
                    className="w-48 h-48 rounded-full border border-white/10 bg-black flex flex-wrap items-center justify-center p-6 gap-2 relative shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0, x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3], x: 0, y: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: Math.random() * 0.5,
                          ease: 'circOut'
                        }}
                        className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      />
                    ))}
                  </motion.div>
                )}

                {/* Phase 7: Verdict - Checkmark */}
                {analysisProgress === 100 && (
                  <motion.div
                    key="phase7"
                    layoutId="morphing-core"
                    className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.6)]"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                      viewBox="0 0 24 24"
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Current Step Title with smooth text transition */}
            <div className="h-6 flex items-center justify-center mb-2 overflow-hidden relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={analysisStepText}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-[10px] sm:text-xs text-neutral-300 uppercase tracking-[0.2em]"
                >
                  {analysisStepText}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div 
              key={analysisProgress}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-display text-5xl sm:text-7xl font-medium tracking-tight text-white mb-6 tabular-nums relative z-10 drop-shadow-lg"
            >
              {analysisProgress}%
            </motion.div>

            {/* High-precision Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-900/50 relative overflow-hidden mb-8 border border-neutral-800 rounded-full z-10">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* 20-check indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-3 bg-neutral-900/90 border border-neutral-700 px-5 py-2.5 rounded-full font-mono text-[10px] sm:text-xs text-neutral-200 relative z-10"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>
                Certainty Verification: Check {Math.min(20, Math.max(1, Math.floor((analysisProgress / 100) * 20)))} of 20
              </span>
            </motion.div>
          </div>

          {/* Bottom Streaming Terminal Logs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 border border-neutral-800 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-neutral-400 max-h-36 overflow-y-auto text-left relative z-10 backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-neutral-400 uppercase tracking-wider mb-2 border-b border-neutral-900 pb-2 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-neutral-300" />
              <span>Live Step-by-Step Progress</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {analysisLogs.map((log, lIdx) => (
                <motion.div 
                  key={lIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-neutral-300"
                >
                  {log}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
