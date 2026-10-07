import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  SIMPLE_ABLATION_ROWS,
  SIMPLE_ECHOES_PROVIDERS,
  CALIBRATION_METRICS,
  DATASET_PROFILES,
  SIMPLE_LIMITS
} from '../../data';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const { setCursorText } = useStore();
  const [activeTab, setActiveTab] = useState<'ablation' | 'echoes' | 'calibration' | 'datasets' | 'limits'>('ablation');
  const [openLimitIdx, setOpenLimitIdx] = useState<number | null>(0);
  const [hoveredAblationRow, setHoveredAblationRow] = useState<string | null>(null);

  const toggleLimit = (idx: number) => {
    setOpenLimitIdx(openLimitIdx === idx ? null : idx);
  };

  return (
    <section
      id="research"
      className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 select-none text-center relative"
    >
      {/* Section Header */}
      <div className="mb-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
            07 // THESIS RESEARCH & VALIDATION
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-2">
          The Research Behind Know-Ta!
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
          Undergraduate thesis project at the University of Southeastern Philippines, Davao City.
        </p>
      </div>

      {/* Research Navigation Tabs */}
      <div className="flex justify-center items-center overflow-x-auto pb-3 mb-6 space-x-2 border-b border-white/10 w-full max-w-5xl scrollbar-none">
        {[
          { id: 'ablation', label: '1. Does Splitting Help?' },
          { id: 'echoes', label: '2. Tests on Other AI Tools' },
          { id: 'calibration', label: '3. Can You Trust the %?' },
          { id: 'datasets', label: '4. Music Collections Used' },
          { id: 'limits', label: '5. Honest Delimitations' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              onMouseEnter={() => setCursorText('VIEW')}
              onMouseLeave={() => setCursorText('')}
              className={`px-3.5 py-1.5 border font-mono text-xs tracking-wider uppercase transition-all whitespace-nowrap rounded ${
                isActive
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/10 bg-neutral-950/60 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ABLATION TABLE */}
      {activeTab === 'ablation' && (
        <div className="border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
                Does splitting the song actually help?
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-1">
                Comparing 5 different configurations on benchmark test tracks.
              </p>
            </div>
            <div className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest border border-neutral-800 p-2 rounded bg-neutral-900">
              Tested across 3 random seeds
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Method Tested</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Overall F1</th>
                  <th className="py-2.5 px-3">What This Proves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono text-xs">
                {SIMPLE_ABLATION_ROWS.map((row) => (
                  <tr
                    key={row.name}
                    onMouseEnter={() => setHoveredAblationRow(row.name)}
                    onMouseLeave={() => setHoveredAblationRow(null)}
                    className={`transition-colors ${
                      row.isMain
                        ? 'bg-white/10 font-semibold'
                        : hoveredAblationRow === row.name
                        ? 'bg-white/5'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        {row.isMain && <Award className="w-3.5 h-3.5 text-white" />}
                        <span className="text-white font-medium">{row.simpleName}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                        {row.name}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white tabular-nums">{row.accuracy}</td>
                    <td className="py-3 px-3 text-white tabular-nums">{row.macroF1}</td>
                    <td className="py-3 px-3 text-neutral-300 font-sans text-xs">{row.takeaway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded font-mono text-xs text-neutral-300">
            ★ Splitting the song and using intelligent attention achieves the highest accuracy across test trials.
          </div>
        </div>
      )}

      {/* TAB 2: UNSEEN GENERATORS */}
      {activeTab === 'echoes' && (
        <div className="border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
              Does it still work on AI tools it never trained on?
            </h3>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Tested on 10 brand-new AI music generators from the Echoes Benchmark (never seen during training).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {SIMPLE_ECHOES_PROVIDERS.map((p) => (
              <div key={p.name} className="border border-white/10 p-3 bg-neutral-950/80 rounded">
                <div className="text-xs font-mono font-bold text-white mb-1">{p.name}</div>
                <div className="text-[10px] text-neutral-400 font-mono mb-2">{p.category}</div>
                <div className="text-lg font-display font-medium text-white tabular-nums">
                  {p.recall}
                </div>
                <div className="text-[9px] text-neutral-400 uppercase font-mono mt-1">{p.note}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            Because Know-Ta! inspects human biological traits (breathing and natural vocal vibrato), it continues to identify AI songs even when made by new, unfamiliar generators.
          </p>
        </div>
      )}

      {/* TAB 3: CALIBRATION */}
      {activeTab === 'calibration' && (
        <div className="border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
              Can you actually trust the percentage scores?
            </h3>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Using Temperature Scaling to make sure that a 90% AI score truly means 9 out of 10 songs are AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-white/10 bg-neutral-950/70 rounded">
              <div className="text-xs font-mono text-neutral-400 uppercase mb-1">Error Rate (ECE)</div>
              <div className="text-xl font-display font-medium text-white mb-1">
                {CALIBRATION_METRICS.eceBefore} → {CALIBRATION_METRICS.eceAfter}
              </div>
              <p className="text-xs text-neutral-300">Lower is better. Reduced calibration error by 78%.</p>
            </div>

            <div className="p-4 border border-white/10 bg-neutral-950/70 rounded">
              <div className="text-xs font-mono text-neutral-400 uppercase mb-1">Brier Score</div>
              <div className="text-xl font-display font-medium text-white mb-1">
                {CALIBRATION_METRICS.brierBefore} → {CALIBRATION_METRICS.brierAfter}
              </div>
              <p className="text-xs text-neutral-300">Measures accuracy of probabilistic estimates.</p>
            </div>

            <div className="p-4 border border-white/10 bg-neutral-950/70 rounded">
              <div className="text-xs font-mono text-neutral-400 uppercase mb-1">Temperature Scalar (T)</div>
              <div className="text-xl font-display font-medium text-white mb-1">
                {CALIBRATION_METRICS.tempScalarT}
              </div>
              <p className="text-xs text-neutral-300">Softens overconfident probability extremes.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATASETS */}
      {activeTab === 'datasets' && (
        <div className="border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
              Music Collections Used in the Research
            </h3>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Balanced datasets of confirmed human tracks and AI songs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DATASET_PROFILES.map((d) => (
              <div key={d.name} className="p-4 border border-white/10 bg-neutral-950/70 rounded">
                <div className="text-xs font-mono uppercase text-neutral-400 mb-1">{d.badge}</div>
                <h4 className="text-base font-display font-medium text-white mb-2">{d.name}</h4>
                <div className="text-xs font-mono text-white mb-2">{d.stats}</div>
                <p className="text-xs text-neutral-300 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DELIMITATIONS */}
      {activeTab === 'limits' && (
        <div className="border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 rounded max-w-5xl w-full text-left">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white">
              Honest Research Delimitations
            </h3>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Transparent scope and boundaries of the current thesis prototype.
            </p>
          </div>

          <div className="space-y-3">
            {SIMPLE_LIMITS.map((limit, idx) => {
              const isOpen = openLimitIdx === idx;
              return (
                <div key={limit.title} className="border border-white/10 bg-neutral-950/70 rounded overflow-hidden">
                  <button
                    onClick={() => toggleLimit(idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-display text-sm font-medium text-white">{limit.title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-white/5 text-xs text-neutral-300 leading-relaxed font-light">
                      {limit.simple}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
