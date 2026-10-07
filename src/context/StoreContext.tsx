import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRESET_SCENARIOS, PresetScenario } from '../data';

export type SceneId = 'cover' | 'hero' | 'problem' | 'pipeline' | 'branches' | 'demo' | 'report' | 'research';

interface StoreContextType {
  currentScene: SceneId;
  setCurrentScene: (scene: SceneId) => void;
  setActiveSceneSilently: (scene: SceneId) => void;
  activePipelineStep: number;
  setActivePipelineStep: (step: number) => void;
  customAlpha: number;
  setCustomAlpha: (val: number) => void;
  customBeta: number;
  selectedPreset: 'A' | 'B' | 'C';
  setSelectedPreset: (p: 'A' | 'B' | 'C') => void;
  currentReport: PresetScenario;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisStepText: string;
  analysisLogs: string[];
  startAnalysis: (presetId?: 'A' | 'B' | 'C', customFile?: File) => void;
  skipAnalysis: () => void;
  branchVisualSample: 'human' | 'ai';
  setBranchVisualSample: (val: 'human' | 'ai') => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  cursorText: string;
  setCursorText: (text: string) => void;
  uploadedFileName: string | null;
  transitionType: 'iris' | 'shutter' | 'glitch' | null;
  triggerTransition: (type: 'iris' | 'shutter' | 'glitch', onMidpoint?: () => void) => void;
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;
  showIntro: boolean;
  setShowIntro: (val: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScene, setCurrentSceneState] = useState<SceneId>('hero');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [customAlpha, setCustomAlphaState] = useState<number>(0.55);
  const [selectedPreset, setSelectedPreset] = useState<'A' | 'B' | 'C'>('C'); // Default to C to show the remarkable Conflict Flag capability!
  const [currentReport, setCurrentReport] = useState<PresetScenario>(PRESET_SCENARIOS.C);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStepText, setAnalysisStepText] = useState<string>('');
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [branchVisualSample, setBranchVisualSample] = useState<'human' | 'ai'>('ai');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [transitionType, setTransitionType] = useState<'iris' | 'shutter' | 'glitch' | null>(null);
  const [simpleMode, setSimpleMode] = useState<boolean>(true); // Beginners first!
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Check user system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) setReducedMotion(true);
    }
  }, []);

  const customBeta = Math.round((1 - customAlpha) * 100) / 100;

  const setCustomAlpha = (val: number) => {
    setCustomAlphaState(Math.min(0.95, Math.max(0.05, Math.round(val * 100) / 100)));
  };

  const triggerTransition = (type: 'iris' | 'shutter' | 'glitch', onMidpoint?: () => void) => {
    if (reducedMotion) {
      if (onMidpoint) onMidpoint();
      return;
    }
    setTransitionType(type);
    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 450);
    setTimeout(() => {
      setTransitionType(null);
    }, 900);
  };

  const setActiveSceneSilently = (scene: SceneId) => {
    setCurrentSceneState(scene);
  };

  const setCurrentScene = (scene: SceneId) => {
    setCurrentSceneState(scene);
    const targetElement = document.getElementById(scene);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 9-second friendly pipeline simulation
  const startAnalysis = (presetId?: 'A' | 'B' | 'C', customFile?: File) => {
    const targetPresetId = presetId || selectedPreset;
    setSelectedPreset(targetPresetId);
    let chosenReport = { ...PRESET_SCENARIOS[targetPresetId] };

    if (customFile) {
      setUploadedFileName(customFile.name);
      chosenReport.title = `Your Upload: ${customFile.name}`;
      chosenReport.artistSubtitle = `Uploaded Audio File · ${Math.round(customFile.size / 1024)} KB`;
    } else {
      setUploadedFileName(null);
    }

    setCurrentReport(chosenReport);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisLogs([
      `[00:00] Ingesting song: "${customFile ? customFile.name : chosenReport.title}"`,
      `[00:01] Cleaning audio: Leveling volume and preparing 30-second center clip`,
      `[00:01] Voice check: English lyrics verified`
    ]);

    const steps = [
      { progress: 15, text: 'Step 1 of 7 · Preparing song & leveling volume', log: '[00:01] Volume normalized so loudness doesn\'t bias detection.' },
      { progress: 32, text: 'Step 2 of 7 · Splitting singer\'s voice from background music', log: '[00:02] Audio successfully divided into Vocal Stem & Instrumental Stem.' },
      { progress: 48, text: 'Step 3 of 7 · Checking instruments for AI computer patterns', log: '[00:04] Analyzing backing instruments (drums, guitars, synths).' },
      { progress: 62, text: 'Step 4 of 7 · Listening to the voice for natural breaths & pitch', log: '[00:05] Checking human physiological markers: breathing pauses and natural vibrato.' },
      { progress: 75, text: 'Step 5 of 7 · Balancing clues: deciding which part is clearer', log: `[00:06] Smart weighting: Instruments ${(chosenReport.alpha * 100).toFixed(0)}%, Voice ${(chosenReport.beta * 100).toFixed(0)}%.` },
      { progress: 88, text: 'Step 6 of 7 · Testing 20 times to measure certainty', log: '[00:07] Running 20 randomized tests to calculate confidence range.' },
      { progress: 100, text: 'Step 7 of 7 · Preparing your simple results report', log: `[00:09] Ready: Verdict is ${chosenReport.verdictSimple}!` }
    ];

    let currentStepIdx = 0;
    const intervalTime = 1250; // ~9 seconds total

    const timer = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setAnalysisProgress(step.progress);
        setAnalysisStepText(step.text);
        setAnalysisLogs(prev => [...prev, step.log]);
        currentStepIdx++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIsAnalyzing(false);
          setCurrentSceneState('report');
          const reportEl = document.getElementById('report');
          if (reportEl) reportEl.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }, intervalTime);
  };

  const skipAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisProgress(100);
    setCurrentSceneState('report');
    const reportEl = document.getElementById('report');
    if (reportEl) reportEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        currentScene,
        setCurrentScene,
        setActiveSceneSilently,
        activePipelineStep,
        setActivePipelineStep,
        customAlpha,
        setCustomAlpha,
        customBeta,
        selectedPreset,
        setSelectedPreset,
        currentReport,
        isAnalyzing,
        analysisProgress,
        analysisStepText,
        analysisLogs,
        startAnalysis,
        skipAnalysis,
        branchVisualSample,
        setBranchVisualSample,
        reducedMotion,
        setReducedMotion,
        cursorText,
        setCursorText,
        uploadedFileName,
        transitionType,
        triggerTransition,
        simpleMode,
        setSimpleMode,
        showIntro,
        setShowIntro
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
