import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Cursor: React.FC = () => {
  const { cursorText, reducedMotion } = useStore();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);

  useEffect(() => {
    // Only enable custom cursor on fine pointer devices (desktops/laptops)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsPointerDevice(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('button, a, input, [role="button"], .cursor-interactive');
        setIsHovering(!!isInteractive);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isPointerDevice || reducedMotion) return;

    let animId: number;
    const follow = () => {
      setTrailingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2
      }));
      animId = requestAnimationFrame(follow);
    };
    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [pos, isPointerDevice, reducedMotion]);

  if (!isPointerDevice || reducedMotion) return null;

  return (
    <>
      {/* Tiny sharp center point */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          mixBlendMode: 'difference'
        }}
      />

      {/* Trailing ring with difference blend mode and context tag */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-white pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-[width,height,background-color] duration-200 ease-out ${
          isHovering || cursorText
            ? 'w-14 h-14 bg-white/10 backdrop-blur-[1px]'
            : 'w-8 h-8 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
          mixBlendMode: 'difference'
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono tracking-widest text-white uppercase select-none font-semibold">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
