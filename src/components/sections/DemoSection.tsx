import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Upload, Play, FastForward, AlertOctagon, Terminal } from 'lucide-react';

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
      {isAnalyzing && (
        <div className="fixed inset-0 z-[9990] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-14 select-none">
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
            {/* Waveform Bifurcation Graphic */}
            <div className="mb-10 flex items-center justify-center space-x-8">
              <div className="space-y-1">
                <div className="font-mono text-xs text-neutral-300 uppercase tracking-widest font-semibold">
                  1. SINGER'S VOICE
                </div>
                <div className="h-10 w-32 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <div className="w-24 h-1 bg-white/50 animate-pulse" />
                </div>
              </div>

              <div className="font-mono text-sm text-neutral-400">
                ⮜ SPLITTING ⮞
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs text-neutral-300 uppercase tracking-widest font-semibold">
                  2. INSTRUMENTS
                </div>
                <div className="h-10 w-32 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <div className="w-24 h-4 bg-white/30 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Current Step Title */}
            <div className="font-mono text-xs text-neutral-300 uppercase tracking-[0.2em] mb-2">
              {analysisStepText}
            </div>

            <div className="font-display text-5xl sm:text-7xl font-medium tracking-tight text-white mb-6 tabular-nums">
              {analysisProgress}%
            </div>

            {/* High-precision Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-900 relative overflow-hidden mb-8 border border-neutral-800 rounded">
              <div
                className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>

            {/* 20-check indicator */}
            <div className="inline-flex items-center space-x-3 bg-neutral-900/90 border border-neutral-700 px-4 py-2 rounded-full font-mono text-xs text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>
                Certainty Verification: Check {Math.min(20, Math.max(1, Math.floor((analysisProgress / 100) * 20)))} of 20
              </span>
            </div>
          </div>

          {/* Bottom Streaming Terminal Logs */}
          <div className="bg-[#080808] border border-neutral-800 p-4 rounded font-mono text-xs text-neutral-400 max-h-36 overflow-y-auto text-left">
            <div className="flex items-center space-x-2 text-neutral-400 uppercase tracking-wider mb-2 border-b border-neutral-900 pb-1 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-neutral-300" />
              <span>Live Step-by-Step Progress</span>
            </div>
            <div className="space-y-1">
              {analysisLogs.map((log, lIdx) => (
                <div key={lIdx} className="text-neutral-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
