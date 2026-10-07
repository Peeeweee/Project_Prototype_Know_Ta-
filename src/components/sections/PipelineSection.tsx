import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PIPELINE_STEPS } from '../../data';
import { ChevronLeft, ChevronRight, Sliders, Activity } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const {
    activePipelineStep,
    setActivePipelineStep,
    customAlpha,
    setCustomAlpha,
    customBeta,
    setCurrentScene,
    setCursorText
  } = useStore();

  const currentStep = PIPELINE_STEPS[activePipelineStep] || PIPELINE_STEPS[0];

  const handlePrev = () => {
    setActivePipelineStep(Math.max(0, activePipelineStep - 1));
  };

  const handleNext = () => {
    setActivePipelineStep(Math.min(PIPELINE_STEPS.length - 1, activePipelineStep + 1));
  };

  return (
    <section
      id="pipeline"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Centered Section Header */}
      <div className="text-center mb-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            03 // HOW IT WORKS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-2">
          How Know-Ta! Checks a Track
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mb-4">
          A step-by-step pipeline from raw audio ingestion to calibrated authenticity verification.
        </p>

        {/* Step Navigation Controls - Centered */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handlePrev}
            disabled={activePipelineStep === 0}
            className="p-1.5 border border-white/20 text-white disabled:opacity-30 disabled:border-white/10 hover:bg-white/10 transition-colors rounded"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-neutral-300 px-3 tracking-widest uppercase">
            Step {activePipelineStep + 1} of {PIPELINE_STEPS.length}
          </span>
          <button
            onClick={handleNext}
            disabled={activePipelineStep === PIPELINE_STEPS.length - 1}
            className="p-1.5 border border-white/20 text-white disabled:opacity-30 disabled:border-white/10 hover:bg-white/10 transition-colors rounded"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Step Navigation Bar - Centered */}
      <div className="flex justify-center items-center overflow-x-auto pb-3 mb-6 space-x-2 scrollbar-none w-full max-w-5xl mx-auto">
        {PIPELINE_STEPS.map((s, idx) => {
          const isActive = idx === activePipelineStep;
          return (
            <button
              key={s.step}
              onClick={() => setActivePipelineStep(idx)}
              onMouseEnter={() => setCursorText(`STEP 0${idx + 1}`)}
              onMouseLeave={() => setCursorText('')}
              className={`flex-shrink-0 px-3.5 py-2 border text-left transition-all rounded ${
                isActive
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/10 bg-neutral-950/60 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <div className="text-[10px] font-mono tracking-widest">
                STEP {s.step}
              </div>
              <div className="text-xs font-display tracking-tight truncate max-w-[130px]">
                {s.simpleTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card - Centered */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-5xl mx-auto text-left">
        {/* Left Column: Stage Info */}
        <div className="lg:col-span-7 bg-[#0a0a0a]/90 border border-white/20 p-6 sm:p-8 backdrop-blur-md rounded">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
              PHASE 0{currentStep.step} // {currentStep.simpleTitle.toUpperCase()}
            </div>
            <div className="font-mono text-[10px] text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900">
              {currentStep.techChip}
            </div>
          </div>

          <h3 className="text-2xl font-display font-medium text-white mb-2 leading-snug">
            {currentStep.simpleTitle}
          </h3>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
            {currentStep.simpleDescription}
          </p>

          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
              Key Process Details
            </div>
            <div className="space-y-1.5">
              {currentStep.simpleBullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-2 text-xs text-neutral-300">
                  <span className="text-neutral-500 font-mono">→</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Attention Gate / Balance Simulator */}
        <div className="lg:col-span-5 bg-[#0a0a0a]/90 border border-white/20 p-6 backdrop-blur-md rounded space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-white" />
              <span className="font-mono text-xs uppercase tracking-wider text-white font-medium">
                Dual-Branch Weighting Gate
              </span>
            </div>
            <span className="font-mono text-[10px] text-neutral-400">
              α + β = 1.00
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            The neural network dynamically learns how much to trust the <strong>Instruments (α)</strong> versus the <strong>Voice (β)</strong> for each specific song.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">Instruments Weight (α)</span>
                <span className="text-white font-bold">{Math.round(customAlpha * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={customAlpha}
                onChange={(e) => setCustomAlpha(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">Voice Weight (β)</span>
                <span className="text-white font-bold">{Math.round(customBeta * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded overflow-hidden">
                <div
                  className="bg-neutral-400 h-full transition-all"
                  style={{ width: `${Math.round(customBeta * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 border border-neutral-800 rounded text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-neutral-300 font-mono text-[11px]">
                <Activity className="w-3 h-3 text-white" />
                <span>Conflict Sensitivity</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                If the instruments predict AI but the vocal sounds real, a conflict flag triggers to catch hybrid songs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
