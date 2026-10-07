import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AUTHORS, INSTITUTION } from '../data';
import { ArrowUp, BookOpen, Shield, Sparkles } from 'lucide-react';
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas';

export const Footer: React.FC = () => {
  const { setCurrentScene, triggerTransition, setCursorText, setShowIntro } = useStore();
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

  const wordmark = "KNOW-TA!";

  const scrollToTop = () => {
    triggerTransition('shutter', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentScene('cover');
    });
  };

  return (
    <footer
      id="system-footer"
      className="relative w-full border-t border-white/10 bg-[#050505] overflow-hidden select-none z-10"
      aria-label="Know-Ta! System Footer & Academic Credits"
    >
      {/* Wide & Scattered Neural Network Animation Background for Lower Interface */}
      <NeuralNetworkCanvas
        className="absolute inset-0 z-0"
        intensity="vibrant"
        connectionDistance={170}
        mouseDistance={210}
        scatterStrength={1.6}
        interactive={true}
      />

      {/* Subtle depth gradient overlay to ensure perfect academic text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/75 to-[#030303]/92 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-14 px-6 sm:px-12 md:px-20">
        {/* Academic Section Index Header */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-neutral-400 uppercase border-b border-white/10 pb-1">
            <span>RESEARCH MONOGRAPH</span>
            <span className="text-neutral-600">//</span>
            <span>USeP COLLEGE OF INFORMATION AND COMPUTING</span>
          </div>
        </div>

        {/* Massive Interactive Magnetic Wordmark */}
        <div className="overflow-hidden mb-16 text-center">
          <div className="flex items-center justify-center text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-medium tracking-tighter text-white leading-none">
            {wordmark.split('').map((char, index) => {
              const isHovered = hoveredLetter === index;
              return (
                <span
                  key={index}
                  onMouseEnter={() => {
                    setHoveredLetter(index);
                    setCursorText('KNOW-TA');
                  }}
                  onMouseLeave={() => {
                    setHoveredLetter(null);
                    setCursorText('');
                  }}
                  className={`inline-block transition-transform duration-300 cursor-default ${
                    isHovered ? '-translate-y-4 scale-105 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 'translate-y-0 text-white'
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>
          <div className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400 mt-2">
            DUAL-BRANCH DEEP LEARNING FRAMEWORK FOR AI MUSIC DETECTION
          </div>
        </div>

        {/* Academic Credits & Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10 text-xs font-mono text-neutral-400">
          {/* Col 1: Institutional Affiliation */}
          <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm">
            <div className="text-white uppercase font-bold tracking-wider">
              Academic Affiliation
            </div>
            <div>{INSTITUTION.college}</div>
            <div>{INSTITUTION.university}</div>
            <div className="text-neutral-400">{INSTITUTION.location}</div>
            <div className="text-neutral-400 pt-1">{INSTITUTION.program}</div>
          </div>

          {/* Col 2: Research Authors */}
          <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm">
            <div className="text-white uppercase font-bold tracking-wider">
              Research Authors
            </div>
            {AUTHORS.map((author) => (
              <div key={author.name} className="flex justify-between">
                <span className="text-neutral-200 font-medium">{author.name}</span>
              </div>
            ))}
            <div className="text-neutral-400 pt-1">
              {INSTITUTION.course} · {INSTITUTION.date}
            </div>
          </div>

          {/* Col 3: Thesis Fulfillment */}
          <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm">
            <div className="text-white uppercase font-bold tracking-wider">
              Thesis Project
            </div>
            <p className="leading-relaxed text-neutral-400 text-xs">
              Developed in partial fulfillment of the requirements for the degree of Bachelor of Science in Computer Science.
            </p>
            <div className="text-neutral-500 text-[11px] pt-1">
              College of Information and Computing
            </div>
          </div>
        </div>

        {/* Bottom Bar with Back to Top Button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
          <div>
            © 2026 Know-Ta! Research Project · University of Southeastern Philippines
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowIntro(true);
              }}
              onMouseEnter={() => setCursorText('OPENING')}
              onMouseLeave={() => setCursorText('')}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-all text-xs bg-black/40 backdrop-blur-sm rounded"
            >
              <span>▶ Replay Opening</span>
            </button>

            <button
              onClick={scrollToTop}
              onMouseEnter={() => setCursorText('TOP')}
              onMouseLeave={() => setCursorText('')}
              className="group flex items-center space-x-2 px-4 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-all bg-black/40 backdrop-blur-sm rounded shadow-lg"
            >
              <span>Return to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
