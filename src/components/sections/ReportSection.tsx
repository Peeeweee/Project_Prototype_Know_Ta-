import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertTriangle, CheckCircle, ArrowRight, Shield, Activity } from 'lucide-react';

export const ReportSection: React.FC = () => {
  const { currentReport, setCurrentScene, setCursorText } = useStore();
  const [hoveredClip, setHoveredClip] = useState<number | null>(null);

  const bcsPercent = Math.round(currentReport.calibratedScore * 100);
  const spreadPercent = Math.round(currentReport.uncertaintySpread * 100);
  const audioPercent = Math.round(currentReport.audioScore * 100);
  const vocalPercent = Math.round(currentReport.vocalScore * 100);
  const alphaPercent = Math.round(currentReport.alpha * 100);
  const betaPercent = Math.round(currentReport.beta * 100);

  return (
    <section
      id="report"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Centered Report Header */}
      <div className="mb-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            06 // RESULTS & ANALYSIS
          </span>
          <span className="text-neutral-600">/</span>
          <span className="font-mono text-xs text-neutral-400 uppercase">
            TRACK #{currentReport.id}
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-2">
          Authenticity Report
        </h2>
        <div className="inline-flex items-center space-x-2">
          <span className="font-mono text-[10px] text-neutral-300 uppercase tracking-widest border border-neutral-700 px-3 py-0.5 rounded bg-neutral-900">
            20 Verification Runs
          </span>
          <span className="font-mono text-[10px] text-neutral-300 uppercase tracking-widest border border-neutral-700 px-3 py-0.5 rounded bg-neutral-900">
            Calibrated Scale
          </span>
        </div>
      </div>

      {/* Main Spec Card - Centered & Balanced */}
      <div className="border border-white/20 bg-[#080808]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
        {/* Track Title and Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              ANALYZED TRACK
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
              {currentReport.title}
            </h3>
            <p className="font-mono text-xs text-neutral-400 mt-0.5">
              {currentReport.artistSubtitle} · {currentReport.genre}
            </p>
          </div>

          <div className="sm:text-right max-w-xs">
            <p className="text-xs text-neutral-300 leading-snug font-light">
              {currentReport.description}
            </p>
          </div>
        </div>

        {/* GIANT VERDICT & SCORE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-white/10 mb-6">
          <div className="lg:col-span-7">
            <div className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-1">
              FINAL VERDICT
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tighter text-white leading-none mb-2">
              {currentReport.verdictSimple.toUpperCase()}
            </div>
            <p className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
              {currentReport.verdictSubtitle}
            </p>
          </div>

          <div className="lg:col-span-5 bg-neutral-950 p-4 border border-neutral-800 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                AI LIKELIHOOD CHANCE
              </span>
              <span className="font-mono text-[10px] text-neutral-500">
                Probability
              </span>
            </div>

            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-display font-medium text-white tracking-tight tabular-nums">
                {bcsPercent}%
              </span>
              <span className="text-xs font-mono text-neutral-400">
                (±{spreadPercent}% uncertainty)
              </span>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${bcsPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* SPECIAL CONFLICT CALLOUT (WHEN CONFLICT IS DETECTED) */}
        {currentReport.hasConflict && (
          <div className="p-4 bg-neutral-900/90 border border-white/40 mb-6 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                CONFLICT FLAG TRIGGERED
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              {currentReport.conflictDetails?.simpleExplanation ||
                `The instruments score high likelihood of AI (${audioPercent}%), but the singer's vocal track shows strong authentic human biological cues (only ${vocalPercent}% AI). This gap strongly indicates a hybrid song.`}
            </p>
          </div>
        )}

        {/* DUAL BRANCH BREAKDOWN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Audio Branch */}
          <div className="p-4 border border-white/10 bg-neutral-950/60 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                Instruments Branch
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {audioPercent}% AI
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded overflow-hidden mb-2">
              <div className="bg-white h-full" style={{ width: `${audioPercent}%` }} />
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Attention Weight: {alphaPercent}%
            </div>
          </div>

          {/* Vocal Branch */}
          <div className="p-4 border border-white/10 bg-neutral-950/60 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                Singer's Voice Branch
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {vocalPercent}% AI
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded overflow-hidden mb-2">
              <div className="bg-white h-full" style={{ width: `${vocalPercent}%` }} />
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Attention Weight: {betaPercent}%
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => setCurrentScene('demo')}
            onMouseEnter={() => setCursorText('ANOTHER')}
            onMouseLeave={() => setCursorText('')}
            className="px-4 py-2 border border-white/20 text-neutral-200 hover:border-white font-mono text-xs uppercase tracking-wider transition-colors rounded"
          >
            ← Test Another Song
          </button>

          <button
            onClick={() => setCurrentScene('research')}
            onMouseEnter={() => setCursorText('RESEARCH')}
            onMouseLeave={() => setCursorText('')}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors rounded"
          >
            <span>View Thesis Research Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
