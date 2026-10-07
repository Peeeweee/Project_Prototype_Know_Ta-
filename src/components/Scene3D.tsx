import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore, SceneId } from '../context/StoreContext';

export const Scene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentScene,
    activePipelineStep,
    customAlpha,
    customBeta,
    isAnalyzing,
    currentReport,
    reducedMotion
  } = useStore();

  const sceneStateRef = useRef({
    currentScene,
    activePipelineStep,
    customAlpha,
    customBeta,
    isAnalyzing,
    currentReport,
    reducedMotion
  });

  useEffect(() => {
    sceneStateRef.current = {
      currentScene,
      activePipelineStep,
      customAlpha,
      customBeta,
      isAnalyzing,
      currentReport,
      reducedMotion
    };
  }, [currentScene, activePipelineStep, customAlpha, customBeta, isAnalyzing, currentReport, reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle Count
    const PARTICLE_COUNT = 4200;

    // Buffer Geometries for Morphing
    const geo = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);

    // Shapes Generator Functions
    const generateShapes = () => {
      const hero = new Float32Array(PARTICLE_COUNT * 3);
      const separation = new Float32Array(PARTICLE_COUNT * 3);
      const audioMel = new Float32Array(PARTICLE_COUNT * 3);
      const vocal = new Float32Array(PARTICLE_COUNT * 3);
      const fusion = new Float32Array(PARTICLE_COUNT * 3);
      const verdict = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const u = i / PARTICLE_COUNT;

        // 1. HERO: Displaced Icosphere
        const phi = Math.acos(1 - 2 * (i / PARTICLE_COUNT));
        const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
        const radius = 2.2 + 0.15 * Math.sin(phi * 8) * Math.cos(theta * 6);
        hero[i3] = radius * Math.sin(phi) * Math.cos(theta);
        hero[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        hero[i3 + 2] = radius * Math.cos(phi);

        // 2. STEM SEPARATION: Split into Vocal Helix (left, X < 0) & Instrument Grid (right, X > 0)
        if (i < PARTICLE_COUNT / 2) {
          // Vocal Ribbon / Helix (Left side)
          const t = (i / (PARTICLE_COUNT / 2)) * Math.PI * 8;
          const rH = 0.85 + 0.2 * Math.sin(t * 3);
          separation[i3] = -2.6 + rH * Math.cos(t) * 0.9;
          separation[i3 + 1] = ((i / (PARTICLE_COUNT / 2)) - 0.5) * 4.2;
          separation[i3 + 2] = rH * Math.sin(t) * 0.9;
        } else {
          // Instrumental Lattice / Cube Grid (Right side)
          const idx = i - PARTICLE_COUNT / 2;
          const gridSize = 14;
          const gx = (idx % gridSize) - gridSize / 2;
          const gy = (Math.floor(idx / gridSize) % gridSize) - gridSize / 2;
          const gz = (Math.floor(idx / (gridSize * gridSize))) - 3;
          separation[i3] = 2.5 + (gx / gridSize) * 2.8;
          separation[i3 + 1] = (gy / gridSize) * 2.8;
          separation[i3 + 2] = (gz / 5) * 2.2;
        }

        // 3. AUDIO MEL TERRAIN: 3D Heightfield Spectrogram
        const gridX = (i % 65) - 32;
        const gridZ = Math.floor(i / 65) - 32;
        const dist = Math.sqrt(gridX * gridX + gridZ * gridZ);
        const melHeight = Math.sin(gridX * 0.35) * Math.cos(gridZ * 0.3) * 0.8 + Math.exp(-dist * 0.1) * 1.2;
        audioMel[i3] = gridX * 0.15;
        audioMel[i3 + 1] = melHeight - 0.5;
        audioMel[i3 + 2] = gridZ * 0.15;

        // 4. VOCAL BRANCH: Continuous Wave with Vibrato & Breath Gaps
        const vocalT = (i / PARTICLE_COUNT) * 20 - 10;
        // Pause breaks simulation: if vocalT in certain gaps, flatten or drop amplitude
        const isPause = (Math.abs(vocalT + 4) < 0.6) || (Math.abs(vocalT - 3) < 0.7);
        const vibrato = isPause ? 0.05 : 0.4 * Math.sin(vocalT * 18);
        const vocalY = isPause ? 0.0 : Math.sin(vocalT * 1.8) * 1.2 + vibrato;
        vocal[i3] = vocalT * 0.48;
        vocal[i3 + 1] = vocalY;
        vocal[i3 + 2] = isPause ? 0 : Math.cos(vocalT * 2.5) * 0.4;

        // 5. FUSION: Torus Knot (p=2, q=3)
        const knotT = u * Math.PI * 4;
        const p = 2;
        const q = 3;
        const rK = 1.6 + 0.5 * Math.cos(q * knotT);
        fusion[i3] = rK * Math.cos(p * knotT);
        fusion[i3 + 1] = rK * Math.sin(p * knotT);
        fusion[i3 + 2] = -Math.sin(q * knotT) * 1.4;

        // 6. VERDICT: High-density core with stochastic aura
        const vPhi = Math.acos(1 - 2 * u);
        const vTheta = Math.sqrt(PARTICLE_COUNT * Math.PI) * vPhi;
        const vRad = 2.0;
        verdict[i3] = vRad * Math.sin(vPhi) * Math.cos(vTheta);
        verdict[i3 + 1] = vRad * Math.sin(vPhi) * Math.sin(vTheta);
        verdict[i3 + 2] = vRad * Math.cos(vPhi);
      }

      return { hero, separation, audioMel, vocal, fusion, verdict };
    };

    const shapes = generateShapes();

    // Initialize current positions to hero
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      currentPositions[i] = shapes.hero[i];
      targetPositions[i] = shapes.hero[i];
      particleColors[i] = 0.95; // Crisp monochrome white
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleSizes[i] = Math.random() * 2.2 + 1.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    // Particle Shader Material for ultra-crisp monochrome agency aesthetic
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0.85 },
        uAlphaWeight: { value: 0.55 },
        uBetaWeight: { value: 0.45 },
        uJitter: { value: 0.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uJitter;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDist;

        void main() {
          vec3 pos = position;

          // Subtle noise jitter if conflict/uncertainty
          if (uJitter > 0.01) {
            float noise = sin(pos.x * 12.0 + uTime * 4.0) * cos(pos.y * 12.0 + uTime * 3.0);
            pos += normalize(pos) * noise * uJitter;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float d = length(mvPosition.xyz);
          vDist = d;
          gl_PointSize = size * uPixelRatio * (6.5 / max(d, 0.1));
          vColor = color;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vDist;

        void main() {
          // Circular smooth particle
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.05, dist) * uOpacity;
          // Monochrome luminance with delicate edge fade
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geo, material);
    scene.add(particles);

    // Subtle connecting wireframe lines for technical aesthetic
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(400 * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Mouse coordinates tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const state = sceneStateRef.current;
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!state.reducedMotion) {
        particles.rotation.y = elapsedTime * 0.08 + mouse.x * 0.25;
        particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05 + mouse.y * 0.2;
      }

      // Determine active target buffer based on scene/pipeline step
      let targetSource: Float32Array = shapes.hero;
      let targetJitter = 0.0;
      let targetOpacity = 0.85;

      if (state.currentScene === 'cover') {
        targetSource = shapes.hero;
        targetOpacity = 0.0;
      } else if (state.currentScene === 'hero') {
        targetSource = shapes.hero;
        targetOpacity = 0.85;
      } else if (state.currentScene === 'problem') {
        targetSource = shapes.separation;
      } else if (state.currentScene === 'pipeline') {
        const step = state.activePipelineStep;
        if (step <= 1) targetSource = shapes.separation;
        else if (step === 2) targetSource = shapes.audioMel;
        else if (step === 3) targetSource = shapes.vocal;
        else if (step === 4) targetSource = shapes.fusion;
        else targetSource = shapes.verdict;
      } else if (state.currentScene === 'branches') {
        targetSource = shapes.audioMel;
      } else if (state.currentScene === 'demo') {
        targetSource = state.isAnalyzing ? shapes.fusion : shapes.hero;
        if (state.isAnalyzing) targetJitter = 0.25;
      } else if (state.currentScene === 'report') {
        targetSource = shapes.verdict;
        if (state.currentReport.hasConflict) {
          targetJitter = 0.65; // High fracture for hybrid conflict!
        } else if (state.currentReport.uncertaintySpread > 0.10) {
          targetJitter = 0.35;
        }
      } else if (state.currentScene === 'research') {
        targetSource = shapes.hero;
      }

      // Interpolate currentPositions toward targetSource
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const lerpSpeed = state.isAnalyzing ? 0.14 : 0.06;

      // Update alpha/beta influence in fusion state
      material.uniforms.uAlphaWeight.value = state.customAlpha;
      material.uniforms.uBetaWeight.value = state.customBeta;
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uJitter.value = targetJitter;
      material.uniforms.uOpacity.value += (targetOpacity - material.uniforms.uOpacity.value) * 0.08;

      // Dynamic vertex deformation with breathing wave
      const breathe = Math.sin(elapsedTime * 1.5) * 0.06;

      for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
        let tx = targetSource[i];
        let ty = targetSource[i + 1];
        let tz = targetSource[i + 2];

        // If in fusion scene, shift according to alpha vs beta weights
        if (targetSource === shapes.fusion) {
          const shift = (state.customAlpha - 0.5) * 1.2;
          tx += shift * 0.4;
        }

        // Breathing modulation
        tx += tx * breathe;
        ty += ty * breathe;
        tz += tz * breathe;

        posArr[i] += (tx - posArr[i]) * lerpSpeed;
        posArr[i + 1] += (ty - posArr[i + 1]) * lerpSpeed;
        posArr[i + 2] += (tz - posArr[i + 2]) * lerpSpeed;
      }
      posAttr.needsUpdate = true;

      // Update lines between occasional neighboring points
      const lineArr = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;
      for (let i = 0; i < 400 && i * 10 + 3 < PARTICLE_COUNT * 3; i++) {
        const p1 = i * 10;
        const p2 = p1 + 3;
        lineArr[lineIdx++] = posArr[p1];
        lineArr[lineIdx++] = posArr[p1 + 1];
        lineArr[lineIdx++] = posArr[p1 + 2];
        lineArr[lineIdx++] = posArr[p2];
        lineArr[lineIdx++] = posArr[p2 + 1];
        lineArr[lineIdx++] = posArr[p2 + 2];
      }
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      lineMat.opacity = material.uniforms.uOpacity.value * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      lineGeo.dispose();
      material.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
