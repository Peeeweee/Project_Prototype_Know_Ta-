import React, { useState } from 'react';
import { useStore, SceneId } from '../context/StoreContext';
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SCENES: { id: SceneId; num: string; label: string }[] = [
  { id: 'cover', num: '00', label: 'KNOW TA!' },
  { id: 'hero', num: '01', label: 'INTRO' },
  { id: 'problem', num: '02', label: 'THE PROBLEM' },
  { id: 'pipeline', num: '03', label: 'HOW IT WORKS' },
  { id: 'branches', num: '04', label: 'VOICE VS MUSIC' },
  { id: 'demo', num: '05', label: 'TEST A SONG' },
  { id: 'report', num: '06', label: 'RESULTS' },
  { id: 'research', num: '07', label: 'THESIS RESEARCH' }
];

export const FloatingNav: React.FC = () => {
  const { currentScene, setCurrentScene, setCursorText } = useStore();
  const [hoveredDir, setHoveredDir] = useState<'up' | 'down' | null>(null);

  const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
  const activeScene = SCENES[currentIndex] || SCENES[0];

  const prevScene = currentIndex > 0 ? SCENES[currentIndex - 1] : null;
  const nextScene = currentIndex < SCENES.length - 1 ? SCENES[currentIndex + 1] : null;

  const handleMoveUp = () => {
    if (prevScene) {
      setCurrentScene(prevScene.id);
    }
  };

  const handleMoveDown = () => {
    if (nextScene) {
      setCurrentScene(nextScene.id);
    }
  };

  return (
    <nav
      aria-label="Reactive section navigator"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto"
    >
      <div className="flex items-center space-x-1.5 p-1.5 bg-[#0a0a0a]/90 border border-white/20 backdrop-blur-xl rounded-full shadow-2xl transition-all duration-300 hover:border-white/40">
        {/* Back / Up Button */}
        <button
          onClick={handleMoveUp}
          disabled={!prevScene}
          onMouseEnter={() => {
            setHoveredDir('up');
            if (prevScene) setCursorText(`BACK: ${prevScene.label}`);
          }}
          onMouseLeave={() => {
            setHoveredDir(null);
            setCursorText('');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 focus:outline-none ${
            prevScene
              ? 'text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95'
              : 'text-neutral-600 opacity-40 cursor-not-allowed'
          }`}
          title={prevScene ? `Back to ${prevScene.label} (Press ← or ↑)` : 'At beginning'}
        >
          <div className="flex items-center space-x-0.5">
            <ArrowLeft className="w-3 h-3 hidden sm:inline" />
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">
            {hoveredDir === 'up' && prevScene ? prevScene.label : 'Back'}
          </span>
          <kbd className="hidden md:inline-block px-1 py-0.2 bg-white/10 border border-white/20 rounded text-[9px] text-neutral-300">
            ←
          </kbd>
        </button>

        {/* Center Current Section Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-xs">
          <span className="text-white font-bold">{activeScene.num}</span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">07</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-200 uppercase tracking-widest hidden sm:inline text-[11px] font-medium">
            {activeScene.label}
          </span>
        </div>

        {/* Next / Down Button */}
        <button
          onClick={handleMoveDown}
          disabled={!nextScene}
          onMouseEnter={() => {
            setHoveredDir('down');
            if (nextScene) setCursorText(`NEXT: ${nextScene.label}`);
          }}
          onMouseLeave={() => {
            setHoveredDir(null);
            setCursorText('');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 focus:outline-none ${
            nextScene
              ? 'text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95'
              : 'text-neutral-600 opacity-40 cursor-not-allowed'
          }`}
          title={nextScene ? `Next to ${nextScene.label} (Press → or ↓)` : 'At end'}
        >
          <kbd className="hidden md:inline-block px-1 py-0.2 bg-white/10 border border-white/20 rounded text-[9px] text-neutral-300">
            →
          </kbd>
          <span className="hidden sm:inline">
            {hoveredDir === 'down' && nextScene ? nextScene.label : 'Next'}
          </span>
          <div className="flex items-center space-x-0.5">
            <ChevronDown className="w-3.5 h-3.5" />
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </div>
        </button>
      </div>
    </nav>
  );
};
