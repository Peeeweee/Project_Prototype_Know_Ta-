import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, ArrowRight } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

interface ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  phaseOffset: number;
  layer: number; // 0: far, 1: mid, 2: foreground
}

interface SynapsePulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  brightness: number;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [isDone, setIsDone] = useState(false);
  const neuralCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  const totalDuration = 7000; // 7 seconds
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  // Skip animation handler
  const handleSkip = () => {
    if (isDone) return;
    setIsDone(true);
    setTimeout(onComplete, 400);
  };

  // Keyboard shortcut: ESC or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main UI Timer & Phase Progression
  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const secs = Math.min(7, elapsed / 1000);
      setSecondsElapsed(secs);

      if (elapsed < 2300) {
        setPhase(1); // Act 1: Signal analysis & Input neurons firing
      } else if (elapsed < 4700) {
        setPhase(2); // Act 2: Dual-branch separation (Audio & Vocal cells activating)
      } else if (elapsed < 6600) {
        setPhase(3); // Act 3: Soft-attention gate synapses linking & calibrating
      } else {
        setPhase(4); // Act 4: All neurons online & ready
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setIsDone(true);
        setTimeout(onComplete, 550);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  // MINIMALIST NEURAL CONSTELLATION CANVAS
  // High-end Swiss / editorial aesthetics: microscopic pinpoints, hairline connections, zero clumping
  useEffect(() => {
    const canvas = neuralCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let nodes: ConstellationNode[] = [];
    let pulses: SynapsePulse[] = [];

    const initNodes = () => {
      nodes = [];
      // Clean, uncluttered density
      const count = Math.max(45, Math.min(70, Math.floor((width * height) / 24000)));

      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.25 ? 2 : Math.random() < 0.65 ? 1 : 0;
        // Tiny pinpoint stars: 0.9px to 1.4px
        const radius = layer === 2 ? 1.4 : layer === 1 ? 1.1 : 0.85;
        const baseOpacity = layer === 2 ? 0.65 : layer === 1 ? 0.38 : 0.18;
        // Ultra-slow zero-g holographic drift
        const speedMultiplier = layer === 2 ? 0.05 : layer === 1 ? 0.03 : 0.018;

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          radius,
          baseOpacity,
          phaseOffset: Math.random() * Math.PI * 2,
          layer
        });
      }
    };

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initNodes();
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 60);
      lastTime = now;
      const t = now * 0.001;

      // Pure deep void background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      // Central negative-space zone around typography (softly attenuates background)
      const clearZoneX = Math.min(380, width * 0.42);
      const clearZoneY = 170;

      // Update positions with ultra-slow zero-g drift
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * (dt / 16);
        n.y += n.vy * (dt / 16);

        // Soft screen wraparound
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Establish clean, sparse connections (max 2 per node, strict distance window)
      // Never connects if dist < 40 (prevents tight tangles) or dist > 140
      const activeConnections: { i: number; j: number; alpha: number }[] = [];
      const connectionCount = new Uint8Array(nodes.length);

      for (let i = 0; i < nodes.length; i++) {
        if (connectionCount[i] >= 2) continue;
        const n1 = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          if (connectionCount[i] >= 2) break;
          if (connectionCount[j] >= 2) continue;

          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;

          // Safe distance window: between 45px and 135px
          if (distSq > 2025 && distSq < 18225) {
            const dist = Math.sqrt(distSq);
            // Attenuation near central typography
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const normDistX = Math.abs(midX - centerX) / clearZoneX;
            const normDistY = Math.abs(midY - centerY) / clearZoneY;
            const centerDist = Math.hypot(normDistX, normDistY);
            const centerFactor = Math.min(1, Math.max(0.12, centerDist));

            const baseAlpha = (1 - dist / 135) * 0.16 * centerFactor;

            activeConnections.push({ i, j, alpha: baseAlpha });
            connectionCount[i]++;
            connectionCount[j]++;
          }
        }
      }

      // Draw Hairline Synapses
      ctx.lineWidth = 0.65;
      for (let k = 0; k < activeConnections.length; k++) {
        const { i, j, alpha } = activeConnections[k];
        const n1 = nodes[i];
        const n2 = nodes[j];

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }

      // Sporadically trigger solitary, elegant data pulses along connections
      if (Math.random() < 0.03 && activeConnections.length > 0 && pulses.length < 5) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        pulses.push({
          fromNode: conn.i,
          toNode: conn.j,
          progress: 0,
          speed: Math.random() * 0.006 + 0.003, // calm travel
          brightness: Math.random() * 0.4 + 0.5
        });
      }

      // Draw Synaptic Impulses (Single pinpoint glints)
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed * (dt / 16);

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const n1 = nodes[pulse.fromNode];
        const n2 = nodes[pulse.toNode];
        if (!n1 || !n2) continue;

        const px = n1.x + (n2.x - n1.x) * pulse.progress;
        const py = n1.y + (n2.y - n1.y) * pulse.progress;

        // Attenuate if directly in center
        const normDistX = Math.abs(px - centerX) / clearZoneX;
        const normDistY = Math.abs(py - centerY) / clearZoneY;
        const centerFactor = Math.min(1, Math.max(0.15, Math.hypot(normDistX, normDistY)));

        // Microscopic glint
        ctx.fillStyle = `rgba(255, 255, 255, ${(pulse.brightness * centerFactor).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Microscopic Constellation Nodes (Pinpoint stars)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Gentle, slow ambient luminescence modulation
        const breathe = Math.sin(t * 0.8 + n.phaseOffset) * 0.15;

        // Attenuate in central typography zone
        const normDistX = Math.abs(n.x - centerX) / clearZoneX;
        const normDistY = Math.abs(n.y - centerY) / clearZoneY;
        const centerDist = Math.hypot(normDistX, normDistY);
        const centerFactor = Math.min(1, Math.max(0.2, centerDist));

        const finalOpacity = Math.max(0.05, (n.baseOpacity + breathe) * centerFactor);

        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // DYNAMIC AUDIO OSCILLOSCOPE (Precision Real-Time Vector Drawing)
  // Fast, responsive acoustic frequency oscillations (independent of slow background)
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderWave = () => {
      // Natural, active audio frequency rate (responsive soundwave vibration)
      t += 0.045;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Subtle horizontal baseline rule
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, centerY);
      ctx.lineTo(width - 10, centerY);
      ctx.stroke();

      if (phase === 1) {
        // ACT I: Entangled Single Composite Audio Wave
        // Vibrant, fluid, multi-harmonic acoustic audio stream
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const normX = (x / width) * 10;
          const envelope = Math.sin((x / width) * Math.PI); // Windowed at sides
          const yOffset =
            (Math.sin(normX * 1.8 + t * 2.6) * 16 +
              Math.sin(normX * 3.6 - t * 4.2) * 9 +
              Math.sin(normX * 7.4 + t * 6.5) * 5 +
              Math.cos(normX * 11.2 - t * 8.0) * 2.5) *
            envelope;
          const y = centerY + yOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary harmonic echo / acoustic reflection
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const normX = (x / width) * 8;
          const envelope = Math.sin((x / width) * Math.PI);
          const y = centerY + (Math.sin(normX * 3.2 - t * 3.2) * 10 + Math.sin(normX * 6.0 + t * 5.0) * 4) * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (phase === 2) {
        // ACT II: Dual-Branch Separation
        // Two distinct, lively parallel streams:
        // Top Stream: Vocal Trajectory (lively singing vibrato & formant shifts)
        const vocalY = centerY - 22;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const envelope = Math.sin((x / width) * Math.PI);
          const vibrato = Math.sin(x * 0.08 + t * 5.5) * 8;
          const formant = Math.sin(x * 0.02 - t * 2.2) * 6;
          const micro = Math.cos(x * 0.16 + t * 7.5) * 2.5;
          const y = vocalY + (vibrato + formant + micro) * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Bottom Stream: Instrumental Stems (dynamic rhythmic beat EQ bars)
        const instY = centerY + 22;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1.1;
        for (let x = 16; x < width - 16; x += 8) {
          const envelope = Math.sin((x / width) * Math.PI);
          const beat = Math.sin(t * 4.2 + x * 0.14);
          const barHeight = (Math.abs(beat * Math.cos(t * 2.8 - x * 0.06)) * 16 + 2.5) * envelope;
          ctx.beginPath();
          ctx.moveTo(x, instY - barHeight);
          ctx.lineTo(x, instY + barHeight);
          ctx.stroke();
        }

        // Center separation axis (delicate dashed line)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(30, centerY);
        ctx.lineTo(width - 30, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // ACT III & IV: Cross-Attention Fusion
        // Resonant standing wave with active phase locking & central reticle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const envelope = Math.sin((x / width) * Math.PI);
          const resonance = (Math.sin((x / width) * Math.PI * 6 + t * 4.5) * 14 + Math.sin((x / width) * Math.PI * 12 - t * 6.0) * 4) * envelope;
          const y = centerY + resonance;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Pulsating reticle focus mark
        const reticleRad = 4.5 + Math.sin(t * 5.0) * 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(width / 2, centerY, reticleRad, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(width / 2, centerY, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderWave);
    };

    animId = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  const progressPercent = Math.min(100, Math.floor((secondsElapsed / 7) * 100));
  const activeNeuronsCount = Math.min(1024, Math.floor((progressPercent / 100) * 1024));

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{
            opacity: 0,
            scale: 1.015,
            filter: 'blur(8px)',
            transition: { duration: 0.6, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[9990] bg-[#050505] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* FULLSCREEN MINIMALIST NEURAL CONSTELLATION CANVAS */}
          <canvas
            ref={neuralCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Smooth vignette & negative-space gradient */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/45 to-[#050505]/90 pointer-events-none z-[1]" />

          {/* Top Bar: Editorial Monospace Identity, Live Telemetry & Skip Button */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2.5 text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <span className="tracking-[0.25em] uppercase text-[10px] sm:text-[11px]">
                [01] THESIS SPECIFICATION / USeP · CIC 2026
              </span>
            </div>

            {/* Clean Monospace Telemetry Readout */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider backdrop-blur-md">
              <span className="text-neutral-500 font-mono">SYS //</span>
              <span className="text-white font-semibold tabular-nums">
                {activeNeuronsCount.toString().padStart(4, '0')} / 1024 NEURONS
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400 uppercase tracking-widest text-[9px]">
                {phase === 1 && 'INPUT CELL ACTIVATION'}
                {phase === 2 && 'DUAL-BRANCH STEM ISOLATION'}
                {phase === 3 && 'ATTENTION SYNAPSE CALIBRATION'}
                {phase === 4 && 'WEIGHTS SYNCHRONIZED'}
              </span>
            </div>

            {/* Sleek Hairline Skip Button */}
            <button
              onClick={handleSkip}
              className="group flex items-center space-x-1.5 px-3.5 py-1 bg-black/50 border border-white/15 hover:border-white/50 text-neutral-400 hover:text-white rounded-full transition-all text-[11px] font-mono tracking-widest uppercase backdrop-blur-md active:scale-95"
            >
              <span>ESC / SKIP</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-neutral-400 group-hover:text-white" />
            </button>
          </div>

          {/* Central Cinema Stage: Generous Negative Space & Editorial Narrative */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl mx-auto text-center px-4">
            {/* Borderless Minimalist Audio Oscilloscope */}
            <div className="relative w-full max-w-md h-20 mb-8 flex items-center justify-center">
              <canvas
                ref={waveformCanvasRef}
                width={500}
                height={80}
                className="w-full h-full block"
              />
            </div>

            {/* Narrative Editorial Typographic Subtitles */}
            <div className="min-h-[110px] flex flex-col items-center justify-center">
              {phase === 1 && (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                    ACT I // ENTANGLED ACOUSTICS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight">
                    "AI music sounds realistic to human ears."
                  </h2>
                  <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto">
                    Over 97% of human listeners fail to distinguish synthetic songs from human performances.
                  </p>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                    ACT II // SPECTRAL SEPARATION
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight">
                    "So we listen to the voice and instruments separately."
                  </h2>
                  <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto">
                    Isolating biological human breathing and vocal vibrato from synthetic instrumental stems.
                  </p>
                </motion.div>
              )}

              {(phase === 3 || phase === 4) && (
                <motion.div
                  key="phase3"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-2.5"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-neutral-500">
                    ACT III // ARCHITECTURE ENGAGED
                  </div>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tighter text-white">
                    Know Ta!
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 font-mono tracking-wider max-w-md mx-auto">
                    Dual-Branch Deep Learning for Cross-Platform AI Music Detection
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom Timeline: Hairline Progress, Act Readout & Subtle Hotkey Hint */}
          <div className="relative z-10 w-full max-w-lg mx-auto space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              <span>0{Math.floor(secondsElapsed)}S / 07S</span>
              <span className="text-neutral-500">
                {phase === 1 && 'SIGNAL INGESTION'}
                {phase === 2 && 'HTDEMUCS STEM EXTRACTION'}
                {phase === 3 && 'CROSS-ATTENTION GATE'}
                {phase === 4 && 'SYSTEM READY'}
              </span>
              <span className="text-neutral-300">{progressPercent}%</span>
            </div>

            {/* Hairline 1px Progress Bar */}
            <div className="w-full h-[1.5px] bg-neutral-900 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white transition-all duration-75 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-center pt-1">
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em]">
                PRESS [ESC] OR [SPACE] TO ENTER IMMEDIATELY
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
