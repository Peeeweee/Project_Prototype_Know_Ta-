import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Split, ArrowRight } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const { setCurrentScene, setCursorText } = useStore();
  const [activeBeat, setActiveBeat] = useState<number>(0);

  const beats = [
    {
      num: '01',
      title: 'Our ears get fooled easily',
      subtitle: '97% of listeners cannot tell the difference',
      body: 'AI music tools like Suno and Udio now make full songs with realistic instruments and singing voices. In blind listening tests, 97% of people couldn\'t tell which tracks were made by computers.',
      metric: '97% Fail Rate',
      citation: 'Deezer / Ipsos'
    },
    {
      num: '02',
      title: 'Old detectors break on new AI',
      subtitle: 'Detectors fail when an unfamiliar AI tool is used',
      body: 'Most detection tools only recognize the specific AI model they trained on. As soon as a creator uses a newer or different tool (like ElevenLabs or Stable Audio), old detectors often fail.',
      metric: 'New AI Trap',
      citation: 'Echoes Benchmark'
    },
    {
      num: '03',
      title: 'One mixed song hides the clues',
      subtitle: 'Checking the whole blended song creates confusion',
      body: 'What if a real person sings over an AI-generated beat? Normal detectors listen to the whole song at once and get confused. To uncover the truth, you have to separate them.',
      metric: 'Hybrid Song Dilemma',
      citation: 'USeP CS Thesis'
    }
  ];

  return (
    <section
      id="problem"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Centered Section Header */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            02 // THE PROBLEM
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-3">
          Why spotting AI music is difficult
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Modern AI generators produce complete, studio-quality tracks. To detect them reliably, we have to overcome three core challenges.
        </p>
      </div>

      {/* 3 Beats Grid with Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-5xl">
        {beats.map((beat, index) => {
          const isSelected = activeBeat === index;
          return (
            <div
              key={beat.num}
              onClick={() => setActiveBeat(index)}
              onMouseEnter={() => setCursorText(`BEAT 0${index + 1}`)}
              onMouseLeave={() => setCursorText('')}
              className={`p-5 sm:p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group rounded-2xl text-left ${
                isSelected
                  ? 'border-white bg-white/[0.04]'
                  : 'border-white/10 bg-neutral-950/60 hover:border-white/30'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs tracking-widest text-neutral-400">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {beat.citation}
                  </span>
                </div>

                <h3 className="text-lg font-display font-medium text-white mb-1.5 leading-snug">
                  {beat.title}
                </h3>

                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                  {beat.subtitle}
                </p>

                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {beat.body}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="font-mono text-xs text-white font-medium">
                  {beat.metric}
                </span>
                <span className={`text-xs transition-transform duration-200 ${isSelected ? 'translate-x-1 text-white' : 'text-neutral-500'}`}>
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Solution Callout: "So we split the song in two." */}
      <div className="p-5 sm:p-8 border border-white/20 bg-neutral-950/80 backdrop-blur-md rounded-2xl max-w-5xl w-full text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white text-black font-mono text-[10px] tracking-widest uppercase font-semibold mb-3 rounded-xl">
          <Split className="w-3.5 h-3.5" />
          <span>The Know-Ta! Solution</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight leading-tight mb-2.5">
          "So we split the song in two."
        </h3>

        <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light mb-6 max-w-2xl mx-auto">
          Instead of guessing from a messy blended mix, Know-Ta! separates the track into two clean parts: <strong>the singer's voice</strong> and <strong>the background instruments</strong>. Specialized AI models inspect each part separately for authentic human cues.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setCurrentScene('pipeline')}
            onMouseEnter={() => setCursorText('PIPELINE')}
            onMouseLeave={() => setCursorText('')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-black font-mono text-[11px] tracking-widest uppercase font-semibold hover:bg-neutral-200 transition-colors rounded-xl"
          >
            <span>Explore The 7 Steps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentScene('branches')}
            className="text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors px-3 py-2"
          >
            Compare Voice vs Music Clues →
          </button>
        </div>
      </div>
    </section>
  );
};
