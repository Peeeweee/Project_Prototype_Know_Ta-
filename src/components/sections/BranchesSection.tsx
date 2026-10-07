import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Radio, Mic, Volume2 } from 'lucide-react';

export const BranchesSection: React.FC = () => {
  const { branchVisualSample, setBranchVisualSample, setCursorText } = useStore();
  const [hoveredBranch, setHoveredBranch] = useState<'audio' | 'vocal' | null>(null);

  const melCanvasRef = useRef<HTMLCanvasElement>(null);
  const vocalCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Mel Spectrogram Canvas
  useEffect(() => {
    const canvas = melCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;
    const width = canvas.width;
    const height = canvas.height;

    const renderMel = () => {
      offset += branchVisualSample === 'ai' ? 1.5 : 1.0;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // 128 Mel bands simulated
      const bands = 48;
      const bandHeight = height / bands;

      for (let y = 0; y < bands; y++) {
        for (let x = 0; x < width; x += 6) {
          const normY = y / bands;
          const time = (x + offset) * 0.04;

          let intensity = 0;
          if (branchVisualSample === 'ai') {
            intensity = Math.sin(time * 2.0 + normY * 10) * Math.cos(time * 0.5) * 0.5 + 0.5;
            if (normY < 0.25) intensity += 0.3;
          } else {
            const strike = Math.sin((x + offset * 0.8) * 0.02) > 0.8 ? 0.6 : 0;
            intensity = Math.sin(time * 1.5 + normY * 8) * Math.sin(time * 3.2) * 0.5 + 0.4 + strike;
          }

          intensity = Math.max(0, Math.min(1, intensity));
          const grey = Math.floor(intensity * 240);

          ctx.fillStyle = `rgb(${grey}, ${grey}, ${grey})`;
          ctx.fillRect(x, height - (y + 1) * bandHeight, 5, bandHeight - 0.5);
        }
      }

      animId = requestAnimationFrame(renderMel);
    };

    renderMel();
    return () => cancelAnimationFrame(animId);
  }, [branchVisualSample]);

  // Animated Vocal Prosody & Pitch Contour Canvas
  useEffect(() => {
    const canvas = vocalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const width = canvas.width;
    const height = canvas.height;

    const renderVocal = () => {
      t += 0.035;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Pitch lines
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Breath Pause Zones
      const pauseZones = branchVisualSample === 'ai'
        ? []
        : [{ start: 120, end: 170 }, { start: 310, end: 360 }];

      pauseZones.forEach(pz => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(pz.start, 0, pz.end - pz.start, height);
        ctx.fillStyle = '#cccccc';
        ctx.font = '10px monospace';
        ctx.fillText('BREATH PAUSE', pz.start + 5, 20);
      });

      // Draw Pitch Contour Line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';

      for (let x = 0; x < width; x += 3) {
        const inPause = pauseZones.some(pz => x >= pz.start && x <= pz.end);
        if (inPause && branchVisualSample === 'human') {
          // Zero pitch during physiological inhalation
          continue;
        }

        let y = height * 0.5;
        if (branchVisualSample === 'ai') {
          y += Math.sin((x * 0.03) + t * 2) * 22;
        } else {
          const vibrato = Math.sin(t * 8 + x * 0.05) * 5;
          const slowSlide = Math.cos(x * 0.015 + t) * 35;
          y += slowSlide + vibrato;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(renderVocal);
    };

    renderVocal();
    return () => cancelAnimationFrame(animId);
  }, [branchVisualSample]);

  return (
    <section
      id="branches"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Centered Section Header */}
      <div className="text-center mb-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            04 // VOICE VS INSTRUMENTS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-2">
          Comparing Music vs Voice Clues
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto mb-4">
          Hover over either branch to inspect its clues. Real human vocalists naturally pause to take breaths and have organic pitch wavers, while AI tools often show rigid synthetic contours.
        </p>

        {/* Human vs AI Sample Toggle */}
        <div className="inline-flex items-center space-x-2 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-700">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 pl-3">
            Audio Demo Mode:
          </span>
          <button
            onClick={() => setBranchVisualSample('human')}
            className={`px-3.5 py-1 font-mono text-xs rounded-full transition-all ${
              branchVisualSample === 'human'
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Real Human Sample
          </button>
          <button
            onClick={() => setBranchVisualSample('ai')}
            className={`px-3.5 py-1 font-mono text-xs rounded-full transition-all ${
              branchVisualSample === 'ai'
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AI-Made Sample
          </button>
        </div>
      </div>

      {/* Two-Column Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto text-left">
        {/* Left Column: INSTRUMENTS */}
        <div
          onMouseEnter={() => {
            setHoveredBranch('audio');
            setCursorText('MUSIC');
          }}
          onMouseLeave={() => {
            setHoveredBranch(null);
            setCursorText('');
          }}
          className={`border p-5 sm:p-6 transition-all duration-300 relative bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl ${
            hoveredBranch === 'vocal'
              ? 'opacity-40 border-white/5'
              : hoveredBranch === 'audio'
              ? 'border-white ring-1 ring-white/20'
              : 'border-white/20'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <Volume2 className="w-4 h-4 text-white" />
              <h3 className="font-display text-lg font-medium text-white tracking-tight">
                Branch 1: Instruments & Beat
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              EfficientNet-B0
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed mb-4">
            Analyzes frequency energy across 128 musical pitch bands. Real drums have dynamic strikes and natural reverb tails, while AI instruments often show synthetic harmonic repetition.
          </p>

          <div className="relative border border-white/15 bg-black rounded overflow-hidden mb-4">
            <canvas ref={melCanvasRef} width={420} height={140} className="w-full h-28 block" />
            <div className="absolute top-2 left-2 font-mono text-[9px] text-neutral-400 bg-black/70 px-1.5 py-0.5 rounded">
              Mel Frequency Spectrogram
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-neutral-950 p-2 border border-neutral-800 rounded">
              <span className="text-neutral-500 block text-[9px]">Human Clue</span>
              <span className="text-neutral-200">Dynamic drum strikes</span>
            </div>
            <div className="bg-neutral-950 p-2 border border-neutral-800 rounded">
              <span className="text-neutral-500 block text-[9px]">AI Artifact</span>
              <span className="text-neutral-200">Repetitive harmonics</span>
            </div>
          </div>
        </div>

        {/* Right Column: VOCALS */}
        <div
          onMouseEnter={() => {
            setHoveredBranch('vocal');
            setCursorText('VOICE');
          }}
          onMouseLeave={() => {
            setHoveredBranch(null);
            setCursorText('');
          }}
          className={`border p-5 sm:p-6 transition-all duration-300 relative bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl ${
            hoveredBranch === 'audio'
              ? 'opacity-40 border-white/5'
              : hoveredBranch === 'vocal'
              ? 'border-white ring-1 ring-white/20'
              : 'border-white/20'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <Mic className="w-4 h-4 text-white" />
              <h3 className="font-display text-lg font-medium text-white tracking-tight">
                Branch 2: Singer's Voice
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Bidirectional LSTM
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed mb-4">
            Checks natural human biology: breathing pauses, vocal pitch waver (vibrato), and chest resonance. AI voices often miss authentic breathing intervals.
          </p>

          <div className="relative border border-white/15 bg-black rounded overflow-hidden mb-4">
            <canvas ref={vocalCanvasRef} width={420} height={140} className="w-full h-28 block" />
            <div className="absolute top-2 left-2 font-mono text-[9px] text-neutral-400 bg-black/70 px-1.5 py-0.5 rounded">
              Vocal Pitch & Breathing Contour
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-neutral-950 p-2 border border-neutral-800 rounded">
              <span className="text-neutral-500 block text-[9px]">Human Clue</span>
              <span className="text-neutral-200">Real breathing pauses</span>
            </div>
            <div className="bg-neutral-950 p-2 border border-neutral-800 rounded">
              <span className="text-neutral-500 block text-[9px]">AI Artifact</span>
              <span className="text-neutral-200">Continuous robotic breath</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
