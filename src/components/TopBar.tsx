import React from 'react';
import { useStore, SceneId } from '../context/StoreContext';
import { Play } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    currentScene,
    setCurrentScene,
    setCursorText
  } = useStore();

  const steps: { id: SceneId; num: string; label: string }[] = [
    { id: 'cover', num: '00', label: 'KNOW TA!' },
    { id: 'hero', num: '01', label: 'INTRO' },
    { id: 'problem', num: '02', label: 'THE PROBLEM' },
    { id: 'pipeline', num: '03', label: 'HOW IT WORKS' },
    { id: 'branches', num: '04', label: 'VOICE VS MUSIC' },
    { id: 'demo', num: '05', label: 'TEST A SONG' },
    { id: 'report', num: '06', label: 'RESULTS' },
    { id: 'research', num: '07', label: 'RESEARCH' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
        {/* Left: Minimal Wordmark */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentScene('cover')}
            onMouseEnter={() => setCursorText('TITLE')}
            onMouseLeave={() => setCursorText('')}
            className="group flex items-center space-x-2 text-left focus:outline-none"
          >
            <span className={`font-display text-lg sm:text-xl font-bold tracking-tighter text-white transition-opacity ${
              currentScene === 'cover' ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'group-hover:opacity-80'
            }`}>
              Know-Ta!
            </span>
          </button>
        </div>

        {/* Center: Numbered Progress Rail */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Pipeline navigation">
          {steps.map((s) => {
            const isActive = currentScene === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentScene(s.id)}
                onMouseEnter={() => setCursorText(s.label)}
                onMouseLeave={() => setCursorText('')}
                className={`relative px-3 py-1.5 text-[11px] font-mono tracking-wider transition-all rounded focus:outline-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span className={`text-[9px] mr-1.5 transition-opacity ${isActive ? 'opacity-90 font-bold' : 'opacity-50'}`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Sleek Action */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setCurrentScene('demo')}
            onMouseEnter={() => setCursorText('RUN')}
            onMouseLeave={() => setCursorText('')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-[11px] tracking-wider font-semibold uppercase hover:bg-neutral-200 transition-all active:scale-95 shadow-sm"
          >
            <Play className="w-2.5 h-2.5 fill-black" />
            <span>Try Demo</span>
          </button>
        </div>
      </header>

      {/* Left-side Vertical Step Indicator (01 - 07) */}
      <aside
        className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-2 pointer-events-auto select-none"
        aria-label="Vertical section indicator"
      >
        {steps.map((s) => {
          const isActive = currentScene === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentScene(s.id)}
              onMouseEnter={() => setCursorText(s.label)}
              onMouseLeave={() => setCursorText('')}
              className="group flex items-center space-x-2 text-left focus:outline-none py-1"
              title={`Go to ${s.label}`}
            >
              <span
                className={`h-[1px] transition-all duration-300 ${
                  isActive ? 'w-8 bg-white' : 'w-3 bg-neutral-700 group-hover:w-5 group-hover:bg-neutral-400'
                }`}
              />
              <span
                className={`font-mono text-[10px] tracking-widest transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {s.num}
              </span>
              <span
                className={`text-[9px] font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-200 pointer-events-none ${
                  isActive
                    ? 'opacity-100 text-white font-medium pl-1'
                    : 'opacity-0 group-hover:opacity-100 text-neutral-400 pl-1'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </aside>
    </>
  );
};
