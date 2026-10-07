import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

interface NeuralNetworkCanvasProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  mouseDistance?: number;
  scatterStrength?: number;
  interactive?: boolean;
  intensity?: 'subtle' | 'vibrant' | 'dense';
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  pulsePhase: number;
  layer: number; // 0 (far), 1 (mid), 2 (near)
}

interface SynapsePulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  brightness: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const NeuralNetworkCanvas: React.FC<NeuralNetworkCanvasProps> = ({
  className = '',
  nodeCount,
  connectionDistance = 165,
  mouseDistance = 190,
  scatterStrength = 1.4,
  interactive = true,
  intensity = 'vibrant'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let nodes: Node[] = [];
    let pulses: SynapsePulse[] = [];
    let shockwaves: Shockwave[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false,
      lastMoveTime: 0
    };

    const determineNodeCount = (w: number, h: number) => {
      if (nodeCount) return nodeCount;
      const area = w * h;
      if (intensity === 'dense') return Math.max(90, Math.min(180, Math.floor(area / 11000)));
      if (intensity === 'subtle') return Math.max(50, Math.min(95, Math.floor(area / 20000)));
      // default 'vibrant'
      return Math.max(70, Math.min(135, Math.floor(area / 14000)));
    };

    const initNodes = () => {
      nodes = [];
      const count = determineNodeCount(width, height);

      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.25 ? 2 : Math.random() < 0.65 ? 1 : 0;
        const baseRadius = layer === 2 ? Math.random() * 1.5 + 2.2 : layer === 1 ? Math.random() * 1.2 + 1.4 : Math.random() * 0.8 + 0.8;
        const opacity = layer === 2 ? 0.85 : layer === 1 ? 0.55 : 0.28;
        // Ultra-slow Iron Man holographic floating drift
        const speedMultiplier = layer === 2 ? 0.08 : layer === 1 ? 0.05 : 0.025;

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          radius: baseRadius,
          baseRadius,
          opacity,
          pulsePhase: Math.random() * Math.PI * 2,
          layer
        });
      }
    };

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
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

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Mouse & Pointer handlers
    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
      mouse.lastMoveTime = performance.now();

      // Trigger interactive impulse chance on movement
      if (interactive && Math.random() < 0.2 && nodes.length > 0) {
        // Find nearest node to cursor
        let nearestIdx = -1;
        let nearestDist = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          const d = Math.hypot(nodes[i].x - mouse.targetX, nodes[i].y - mouse.targetY);
          if (d < mouseDistance && d < nearestDist) {
            nearestDist = d;
            nearestIdx = i;
          }
        }

        if (nearestIdx !== -1) {
          // Send pulse to random neighbor
          for (let j = 0; j < nodes.length; j++) {
            if (j === nearestIdx) continue;
            const dist = Math.hypot(nodes[nearestIdx].x - nodes[j].x, nodes[nearestIdx].y - nodes[j].y);
            if (dist < connectionDistance) {
              pulses.push({
                fromNode: nearestIdx,
                toNode: j,
                progress: 0,
                speed: Math.random() * 0.006 + 0.003,
                brightness: 1
              });
              break;
            }
          }
        }
      }
    };

    const handlePointerLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      if (!container || !interactive) return;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.45,
        opacity: 0.8
      });

      // Scatter nearby nodes with smooth gentle holographic wave
      for (const node of nodes) {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 1) {
          const impulse = ((260 - dist) / 260) * 0.8;
          node.vx += (dx / dist) * impulse;
          node.vy += (dy / dist) * impulse;
        }
      }
    };

    if (interactive) {
      container.addEventListener('pointermove', handlePointerMove, { passive: true });
      container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
      container.addEventListener('click', handleClick);
    }

    let clock = 0;

    const render = () => {
      // Ultra-slow Iron Man holographic floating clock
      clock += 0.003;

      // Clear canvas with ultra-clean transparent backdrop
      ctx.clearRect(0, 0, width, height);

      // Smooth fluid mouse coordinate interpolation
      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Draw subtle cursor illumination aura
      if (interactive && mouse.isHovered && mouse.x > 0 && mouse.y > 0) {
        const auraGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseDistance * 1.1
        );
        auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
        auraGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.035)');
        auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseDistance * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Subtle center pinpoint for cursor neuron
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Process Shockwaves (Click ripples - smooth slow expansion)
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += (sw.maxRadius - sw.radius) * 0.02 + 0.6;
        sw.opacity *= 0.98;

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.opacity * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update Node Positions & Cursor Interactions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!reducedMotion) {
          // Dynamic organic wandering - ultra-slow holographic floating drift
          node.x += node.vx;
          node.y += node.vy;

          // Viscous air resistance to maintain slow floating speed
          node.vx *= 0.993;
          node.vy *= 0.993;

          // Tiny persistent thermal drift (slow motion harmonic oscillation)
          const naturalDrift = node.layer === 2 ? 0.003 : 0.0015;
          node.vx += Math.sin(clock * 0.8 + node.pulsePhase) * naturalDrift;
          node.vy += Math.cos(clock * 0.7 + node.pulsePhase) * naturalDrift;

          // Cursor Adjustive Physics (Gentle holographic dispersion)
          if (interactive && mouse.isHovered) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseDistance && dist > 1) {
              const normalX = dx / dist;
              const normalY = dy / dist;
              // Smooth, gentle deflection force like moving hand through holographic dust
              const factor = (1 - dist / mouseDistance);
              const push = factor * scatterStrength * (node.layer === 2 ? 1.0 : 0.7);

              node.vx += normalX * push * 0.05;
              node.vy += normalY * push * 0.05;

              // Expand node softly when excited by cursor proximity
              node.radius = node.baseRadius + factor * 1.5;
            } else {
              node.radius += (node.baseRadius - node.radius) * 0.03;
            }
          } else {
            node.radius += (node.baseRadius - node.radius) * 0.03;
          }

          // Soft boundary wrap or rebound
          const margin = 20;
          if (node.x < -margin) node.x = width + margin;
          if (node.x > width + margin) node.x = -margin;
          if (node.y < -margin) node.y = height + margin;
          if (node.y > height + margin) node.y = -margin;
        }
      }

      // Draw Synaptic Connections (Lines between nodes)
      const maxDistSq = connectionDistance * connectionDistance;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / connectionDistance;
            // Connection opacity modulated by distance and depth
            const depthWeight = (n1.opacity + n2.opacity) * 0.5;
            const alpha = normDist * normDist * 0.28 * depthWeight;

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = normDist > 0.6 ? 1.0 : 0.65;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw Interactive Synapse from Cursor to Nearby Nodes
        if (interactive && mouse.isHovered) {
          const cdx = n1.x - mouse.x;
          const cdy = n1.y - mouse.y;
          const cDist = Math.hypot(cdx, cdy);

          if (cDist < mouseDistance) {
            const cNorm = 1 - cDist / mouseDistance;
            const cursorAlpha = cNorm * 0.45;

            // Gradient line from cursor to node
            const lineGrad = ctx.createLinearGradient(mouse.x, mouse.y, n1.x, n1.y);
            lineGrad.addColorStop(0, `rgba(255, 255, 255, ${cursorAlpha * 1.2})`);
            lineGrad.addColorStop(1, `rgba(255, 255, 255, ${cursorAlpha * 0.3})`);

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.stroke();
          }
        }
      }

      // Periodically spawn spontaneous synaptic impulses between connected nodes (slow floating light packets)
      if (Math.random() < 0.05 && nodes.length > 2) {
        const i1 = Math.floor(Math.random() * nodes.length);
        // Find a nearby node
        for (let k = 0; k < 6; k++) {
          const i2 = Math.floor(Math.random() * nodes.length);
          if (i1 === i2) continue;
          const dist = Math.hypot(nodes[i1].x - nodes[i2].x, nodes[i1].y - nodes[i2].y);
          if (dist < connectionDistance) {
            pulses.push({
              fromNode: i1,
              toNode: i2,
              progress: 0,
              speed: Math.random() * 0.005 + 0.0025,
              brightness: 0.85
            });
            break;
          }
        }
      }

      // Render Synaptic Pulses (Action potential packets)
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const nFrom = nodes[pulse.fromNode];
        const nTo = nodes[pulse.toNode];
        if (!nFrom || !nTo) continue;

        const px = nFrom.x + (nTo.x - nFrom.x) * pulse.progress;
        const py = nFrom.y + (nTo.y - nFrom.y) * pulse.progress;

        // Bright white/cyan core
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse.brightness})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Delicate outer glow halo
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse.brightness * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Neurons (Nodes)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulseSin = Math.sin(clock * 0.8 + node.pulsePhase) * 0.5 + 0.5;

        // Bright node center
        ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Foreground nodes get an outer aura ring
        if (node.layer === 2) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + pulseSin * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3.5 + pulseSin * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        container.removeEventListener('click', handleClick);
      }
    };
  }, [nodeCount, connectionDistance, mouseDistance, scatterStrength, interactive, intensity, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
