import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { NeuralNetworkCanvas } from '../NeuralNetworkCanvas';
import { ChevronDown, ArrowDown, Sparkles, Disc } from 'lucide-react';

export const KnowtaTopLayer: React.FC = () => {
  const { setCurrentScene, setCursorText } = useStore();
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);

  const words = ["Know", "Ta!"];

  const handleScrollDown = () => {
    setCurrentScene('hero');
  };

  return (
    <section
      id="cover"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-12 sm:py-16 overflow-hidden select-none z-10"
      aria-label="Know Ta! Neural Title Stage"
    >
      {/* Wide & Scattered Interactive Neural Network Canvas Background */}
      <NeuralNetworkCanvas
        className="absolute inset-0 z-0"
        intensity="dense"
        connectionDistance={175}
        mouseDistance={220}
        scatterStrength={1.8}
        interactive={true}
      />

      {/* Atmospheric depth vignette to emphasize central typography */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-black/25 to-[#050505]/85 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* Minimal Academic Classification Rule - Bespoke & Non-AI */}
      <div className="relative z-10 pt-16 sm:pt-20 text-center">
        <div className="inline-flex items-center space-x-3 text-[11px] font-mono tracking-[0.28em] uppercase text-neutral-400 border-b border-white/10 pb-1.5">
          <span className="text-neutral-500 font-light">[01]</span>
          <span className="text-neutral-200 font-medium tracking-[0.3em]">THESIS SPECIFICATION</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">USeP · CIC 2026</span>
        </div>
      </div>

      {/* Centerpiece: The iconic title "Know Ta!" */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
        {/* Massive Interactive Title "Know Ta!" */}
        <div
          className="flex flex-wrap items-center justify-center text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-display font-bold tracking-tighter text-white leading-none drop-shadow-2xl gap-x-5 sm:gap-x-10 md:gap-x-14"
          aria-label="Know Ta!"
        >
          {words.map((word, wordIdx) => (
            <div key={wordIdx} className="inline-flex items-center">
              {word.split('').map((char, charIdx) => {
                const charKey = `${wordIdx}-${charIdx}`;
                const isHovered = hoveredChar === charKey;
                return (
                  <span
                    key={charIdx}
                    onMouseEnter={() => {
                      setHoveredChar(charKey);
                      setCursorText('KNOW TA!');
                    }}
                    onMouseLeave={() => {
                      setHoveredChar(null);
                      setCursorText('');
                    }}
                    className={`inline-block transition-all duration-300 cursor-default select-none ${
                      isHovered
                        ? '-translate-y-4 scale-110 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                        : 'translate-y-0 text-neutral-100 hover:text-white'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bespoke Research Sub-Identity */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center space-y-2">
          <div className="font-mono text-xs sm:text-[13px] tracking-[0.25em] uppercase text-neutral-300 font-normal">
            Dual-Branch Deep Learning Audio Classifier
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-500 uppercase">
            Separate Stem Forensics · Vocal Pauses vs Synthetic Latents
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue to Enter Framework */}
      <div className="relative z-10 pb-6 sm:pb-8 flex flex-col items-center space-y-3">
        <button
          onClick={handleScrollDown}
          onMouseEnter={() => setCursorText('ENTER')}
          onMouseLeave={() => setCursorText('')}
          className="group flex flex-col items-center space-y-2 text-neutral-400 hover:text-white transition-all focus:outline-none"
          title="Scroll down to explore the system"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-200 transition-colors">
            Explore Framework
          </span>
          <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/60 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 shadow-lg">
            <ArrowDown className="w-3.5 h-3.5 text-white group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};
