/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore, SceneId } from './context/StoreContext';
import { Scene3D } from './components/Scene3D';
import { Cursor } from './components/Cursor';
import { Loader } from './components/Loader';
import { TopBar } from './components/TopBar';
import { FloatingNav } from './components/FloatingNav';
import { CinematicTransition } from './components/CinematicTransition';
import { KnowtaTopLayer } from './components/sections/KnowtaTopLayer';
import { HeroSection } from './components/sections/HeroSection';
import { ProblemSection } from './components/sections/ProblemSection';
import { PipelineSection } from './components/sections/PipelineSection';
import { BranchesSection } from './components/sections/BranchesSection';
import { DemoSection } from './components/sections/DemoSection';
import { ReportSection } from './components/sections/ReportSection';
import { ResearchSection } from './components/sections/ResearchSection';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { setActiveSceneSilently, setCurrentScene, showIntro, setShowIntro } = useStore();

  // Active section scroll spy to update top rail, side indicator, and 3D scene on scroll
  useEffect(() => {
    const sectionIds: SceneId[] = ['cover', 'hero', 'problem', 'pipeline', 'branches', 'demo', 'report', 'research'];

    let ticking = false;

    const checkActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Top of page: Cover Title Section
      if (scrollY < 120) {
        setActiveSceneSilently('cover');
        return;
      }

      // Bottom of page
      if (scrollY + windowHeight >= documentHeight - 120) {
        setActiveSceneSilently('research');
        return;
      }

      const focalPoint = windowHeight * 0.4;
      let matchedSection: SceneId | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalPoint && rect.bottom >= focalPoint) {
            matchedSection = id;
            break;
          }
        }
      }

      if (matchedSection) {
        setActiveSceneSilently(matchedSection);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    checkActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [setActiveSceneSilently]);

  // Keyboard navigation support: Arrow Left/Right, Up/Down, PageUp/PageDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const scenes: SceneId[] = ['cover', 'hero', 'problem', 'pipeline', 'branches', 'demo', 'report', 'research'];
      const getCurrentIndex = () => {
        const scrollPos = window.scrollY + window.innerHeight * 0.4;
        for (let i = scenes.length - 1; i >= 0; i--) {
          const el = document.getElementById(scenes[i]);
          if (el && scrollPos >= el.offsetTop - 100) return i;
        }
        return 0;
      };

      // NEXT: ArrowDown, ArrowRight, PageDown
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        const cur = getCurrentIndex();
        if (cur < scenes.length - 1) {
          e.preventDefault();
          setCurrentScene(scenes[cur + 1]);
        }
      }
      // BACK: ArrowUp, ArrowLeft, PageUp
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const cur = getCurrentIndex();
        if (cur > 0) {
          e.preventDefault();
          setCurrentScene(scenes[cur - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentScene]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-white selection:text-black">
      {/* Film Grain Texture Overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Persistent 3D WebGL Canvas */}
      <Scene3D />

      {/* Trailing Cursor */}
      <Cursor />

      {/* Navigation TopBar */}
      <TopBar />

      {/* Floating Reactive Move Up/Down Controller */}
      <FloatingNav />

      {/* Scene Transitions */}
      <CinematicTransition />

      {/* Editorial Sections */}
      <main className="relative z-10">
        <KnowtaTopLayer />
        <HeroSection />
        <ProblemSection />
        <PipelineSection />
        <BranchesSection />
        <DemoSection />
        <ReportSection />
        <ResearchSection />
      </main>

      {/* Opening 5-10 second cinematic animation */}
      {showIntro && <Loader onComplete={() => setShowIntro(false)} />}

      {/* Footer with Academic Credits & Back to Top */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
