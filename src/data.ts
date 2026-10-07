export interface PresetScenario {
  id: 'A' | 'B' | 'C';
  title: string;
  genre: string;
  artistSubtitle: string;
  description: string;
  verdict: 'LIKELY HUMAN-MADE' | 'LIKELY AI-GENERATED' | 'MIXED SIGNALS';
  verdictSimple: 'Likely Made by a Human' | 'Likely Made by AI' | 'Mixed: Possible Hybrid Song';
  verdictSubtitle: string;
  calibratedScore: number; // 0 to 1
  uncertaintySpread: number; // ± spread
  audioScore: number; // 0 to 1
  vocalScore: number; // 0 to 1
  alpha: number; // attention audio weight
  beta: number; // attention vocal weight
  hasConflict: boolean;
  conflictDetails?: {
    audioPercent: number;
    vocalPercent: number;
    delta: number;
    explanation: string;
    simpleExplanation: string;
  };
  mcDropoutPasses: number[]; // 20 passes
  clips: {
    clipIndex: number;
    timeRange: string;
    audioScore: number;
    vocalScore: number;
    overallScore: number;
  }[];
}

export const PRESET_SCENARIOS: Record<'A' | 'B' | 'C', PresetScenario> = {
  A: {
    id: 'A',
    title: 'Sample A — Real Human Studio Song',
    genre: 'Acoustic Pop / Indie Song',
    artistSubtitle: 'Live recording with acoustic instruments and real human singing',
    description: 'A genuine studio recording with natural breathing sounds, acoustic guitars, and subtle human pitch imperfections.',
    verdict: 'LIKELY HUMAN-MADE',
    verdictSimple: 'Likely Made by a Human',
    verdictSubtitle: 'Both the singing and the instruments sound authentic and human',
    calibratedScore: 0.07,
    uncertaintySpread: 0.03,
    audioScore: 0.10,
    vocalScore: 0.05,
    alpha: 0.42,
    beta: 0.58,
    hasConflict: false,
    mcDropoutPasses: [
      0.06, 0.08, 0.05, 0.07, 0.09, 0.06, 0.08, 0.07, 0.05, 0.07,
      0.08, 0.06, 0.09, 0.07, 0.06, 0.05, 0.08, 0.07, 0.06, 0.08
    ],
    clips: [
      { clipIndex: 1, timeRange: '0:00 - 0:30', audioScore: 0.09, vocalScore: 0.04, overallScore: 0.06 },
      { clipIndex: 2, timeRange: '0:30 - 1:00', audioScore: 0.11, vocalScore: 0.05, overallScore: 0.07 },
      { clipIndex: 3, timeRange: '1:00 - 1:30', audioScore: 0.10, vocalScore: 0.06, overallScore: 0.08 },
      { clipIndex: 4, timeRange: '1:30 - 2:00', audioScore: 0.08, vocalScore: 0.04, overallScore: 0.06 },
      { clipIndex: 5, timeRange: '2:00 - 2:30', audioScore: 0.12, vocalScore: 0.05, overallScore: 0.08 },
      { clipIndex: 6, timeRange: '2:30 - 3:00', audioScore: 0.10, vocalScore: 0.06, overallScore: 0.07 }
    ]
  },
  B: {
    id: 'B',
    title: 'Sample B — 100% AI-Generated Song',
    genre: 'Electronic Pop generated from a text prompt',
    artistSubtitle: 'Created entirely with Suno AI (v3.5) from text prompt',
    description: 'A computer-generated track where both the vocal and backing track were produced by AI algorithms.',
    verdict: 'LIKELY AI-GENERATED',
    verdictSimple: 'Likely Made by AI',
    verdictSubtitle: 'Both the singing and the music show typical computer-generated traces',
    calibratedScore: 0.94,
    uncertaintySpread: 0.04,
    audioScore: 0.96,
    vocalScore: 0.88,
    alpha: 0.61,
    beta: 0.39,
    hasConflict: false,
    mcDropoutPasses: [
      0.93, 0.95, 0.96, 0.92, 0.94, 0.97, 0.95, 0.93, 0.94, 0.96,
      0.92, 0.95, 0.94, 0.96, 0.93, 0.95, 0.94, 0.92, 0.96, 0.95
    ],
    clips: [
      { clipIndex: 1, timeRange: '0:00 - 0:30', audioScore: 0.95, vocalScore: 0.86, overallScore: 0.92 },
      { clipIndex: 2, timeRange: '0:30 - 1:00', audioScore: 0.97, vocalScore: 0.89, overallScore: 0.95 },
      { clipIndex: 3, timeRange: '1:00 - 1:30', audioScore: 0.96, vocalScore: 0.88, overallScore: 0.94 },
      { clipIndex: 4, timeRange: '1:30 - 2:00', audioScore: 0.94, vocalScore: 0.87, overallScore: 0.93 },
      { clipIndex: 5, timeRange: '2:00 - 2:30', audioScore: 0.98, vocalScore: 0.90, overallScore: 0.96 },
      { clipIndex: 6, timeRange: '2:30 - 3:00', audioScore: 0.96, vocalScore: 0.88, overallScore: 0.94 }
    ]
  },
  C: {
    id: 'C',
    title: 'Sample C — Hybrid Song (Human Vocal + AI Beat)',
    genre: 'R&B / Modern Pop with Mixed Origins',
    artistSubtitle: 'A real human singer recorded their voice over an AI-created instrumental beat',
    description: 'A mixed track where the beat was made by AI, but a real human recorded the singing. Standard detectors get confused, but Know-Ta! spots the difference.',
    verdict: 'MIXED SIGNALS',
    verdictSimple: 'Mixed: Possible Hybrid Song',
    verdictSubtitle: 'The instruments and the voice tell opposite stories!',
    calibratedScore: 0.58,
    uncertaintySpread: 0.19,
    audioScore: 0.90,
    vocalScore: 0.15,
    alpha: 0.55,
    beta: 0.45,
    hasConflict: true,
    conflictDetails: {
      audioPercent: 90,
      vocalPercent: 15,
      delta: 0.75,
      explanation: 'Audio Branch indicates 90% AI probability, while Vocal Branch indicates 15% AI probability (85% Human). Probability gap Δ=0.75 exceeds conflict threshold (0.30).',
      simpleExplanation: 'The background music looks 90% like AI, but the singer\'s voice looks only 15% like AI (85% real human). This strongly suggests someone sang over an AI-generated beat!'
    },
    mcDropoutPasses: [
      0.41, 0.72, 0.53, 0.68, 0.38, 0.62, 0.77, 0.49, 0.56, 0.69,
      0.35, 0.64, 0.71, 0.52, 0.45, 0.67, 0.39, 0.73, 0.58, 0.60
    ],
    clips: [
      { clipIndex: 1, timeRange: '0:00 - 0:30', audioScore: 0.88, vocalScore: 0.14, overallScore: 0.55 },
      { clipIndex: 2, timeRange: '0:30 - 1:00', audioScore: 0.91, vocalScore: 0.16, overallScore: 0.59 },
      { clipIndex: 3, timeRange: '1:00 - 1:30', audioScore: 0.92, vocalScore: 0.13, overallScore: 0.61 },
      { clipIndex: 4, timeRange: '1:30 - 2:00', audioScore: 0.89, vocalScore: 0.18, overallScore: 0.57 },
      { clipIndex: 5, timeRange: '2:00 - 2:30', audioScore: 0.90, vocalScore: 0.15, overallScore: 0.58 },
      { clipIndex: 6, timeRange: '2:30 - 3:00', audioScore: 0.90, vocalScore: 0.14, overallScore: 0.57 }
    ]
  }
};

export interface PipelineStepInfo {
  step: string;
  simpleTitle: string;
  techTitle: string;
  simpleSummary: string;
  simpleDescription: string;
  simpleChip: string;
  techChip: string;
  simpleBullets: string[];
}

export const PIPELINE_STEPS: PipelineStepInfo[] = [
  {
    step: '01',
    simpleTitle: 'Prepare & Clean the Song',
    techTitle: 'Input & Preprocessing',
    simpleSummary: 'Makes all audio files equal in volume, format, and sound quality before checking.',
    simpleDescription: 'Different audio files can have hidden differences like volume or file quality that trick simple detectors. Know-Ta! levels the playing field first and checks 30 seconds of the song where the singing happens.',
    simpleChip: 'Audio Cleaning & Leveling',
    techChip: 'MP3 128kbps · 22.05 kHz · -23 LUFS',
    simpleBullets: [
      'Normalizes volume so loud songs don\'t trick the system',
      'Converts to a standard audio format for fair comparison',
      'Filters for English singing to focus on clear vocal clues',
      'Takes a clean 30-second clip from the middle of the song'
    ]
  },
  {
    step: '02',
    simpleTitle: 'Separate the Voice & Music',
    techTitle: 'HTDemucs Stem Separation',
    simpleSummary: 'Splits the song into two tracks: the singer\'s voice on one side, and the instruments on the other.',
    simpleDescription: 'Most detectors listen to the whole song at once. But songs can be tricky—what if an AI beat has a real human singing on it? By splitting them apart first, Know-Ta! can inspect each part with dedicated tools.',
    simpleChip: 'Vocal & Instrument Splitter',
    techChip: 'HTDemucs AI Splitter',
    simpleBullets: [
      'Isolates the singer\'s clean vocal track',
      'Combines drums, bass, and instruments into a separate backing track',
      'Stops the voice and instruments from confusing each other',
      'Allows independent testing of both parts'
    ]
  },
  {
    step: '03',
    simpleTitle: 'Examine the Instruments',
    techTitle: 'Audio Branch (Instrumental)',
    simpleSummary: 'A visual AI inspects the musical backing track like a sound picture to spot computer patterns.',
    simpleDescription: 'Music AI tools leave microscopic blur and unnatural sound patterns in beats and synthesizer chords. This branch turns the music into a frequency picture and checks for synthetic sound signatures.',
    simpleChip: 'Music & Beat Checker',
    techChip: 'EfficientNet-B0 · 128 Mel Bands',
    simpleBullets: [
      'Turns instruments into a visual sound heatmap (spectrogram)',
      'Identifies metallic artifacts and computer sound glitches',
      'Gives a score specifically for the backing track (0% to 100% AI)',
      'Works even if the song has guitar, piano, synth, or drums'
    ]
  },
  {
    step: '04',
    simpleTitle: 'Listen to the Singer\'s Voice',
    techTitle: 'Vocal Branch (Prosodic Cues)',
    simpleSummary: 'Listens for human biological clues: breathing pauses, vocal tremor, and natural pitch wobbles.',
    simpleDescription: 'Real human singers have lungs: they pause to inhale breath, have small natural wavers in their voice, and show organic emotion. AI singers often sing with robotic perfection or unnatural breath gaps.',
    simpleChip: 'Human Voice & Breath Tracker',
    techChip: '2-Layer BiLSTM · Prosody Tracker',
    simpleBullets: [
      'Detects if the singer actually takes natural breaths between lyrics',
      'Measures natural vocal vibrato (waver) vs robotic autotune',
      'Tracks how vocal pitch changes over time',
      'Gives a score specifically for the voice (0% to 100% AI)'
    ]
  },
  {
    step: '05',
    simpleTitle: 'Smart Clue Balancing',
    techTitle: 'Attention-Based Fusion',
    simpleSummary: 'Intelligently decides whether the voice or the instruments provide clearer evidence for this song.',
    simpleDescription: 'Not every song is the same. In a guitar ballad, the voice might give the clearest clue. In dance music, the instruments might tell you more. Know-Ta! automatically shifts its focus to whichever clue is stronger.',
    simpleChip: 'Dynamic Weight Balance',
    techChip: 'Soft Gating Layer · α + β = 1',
    simpleBullets: [
      'Balances the weight of the instruments (α) vs the voice (β)',
      'Adapts automatically for every individual song',
      'You can test adjusting this balance live using the slider below!',
      'Transparently shows which part influenced the final decision'
    ]
  },
  {
    step: '06',
    simpleTitle: 'Test 20 Times for Certainty',
    techTitle: 'Uncertainty & Calibration',
    simpleSummary: 'Instead of guessing once, the model tests the song 20 times to measure how sure it is.',
    simpleDescription: 'If a model only guesses once, it might sound confident even when it\'s unsure. By running 20 slightly randomized checks, Know-Ta! sees if all 20 agree. If they agree, confidence is high; if they disagree, it tells you it is uncertain.',
    simpleChip: '20-Check Certainty Test',
    techChip: 'Monte Carlo Dropout ×20',
    simpleBullets: [
      'Tests the song 20 times in a fraction of a second',
      'Calculates a ± uncertainty range (e.g., 94% ± 4%)',
      'Calibrates probabilities so 90% really means 90% accuracy',
      'Prevents false accusations against real human artists'
    ]
  },
  {
    step: '07',
    simpleTitle: 'Final Verdict & Disagreement Warning',
    techTitle: 'Multi-Faceted Output & Conflict Flag',
    simpleSummary: 'Delivers a clear verdict, separate scores for music vs voice, and warns you if the song is a hybrid.',
    simpleDescription: 'Instead of just saying "Real" or "Fake", you get the whole picture: overall AI chance, music score, voice score, and an automatic warning flag if someone sang over an AI beat.',
    simpleChip: 'Verdict & Hybrid Alert',
    techChip: 'Calibrated AI% + Conflict Flag',
    simpleBullets: [
      'Shows overall AI likelihood with certainty spread',
      'Displays separate gauges for Instruments and Voice',
      'Raises a prominent warning flag if instruments and voice disagree',
      'Provides a 30-second breakdown across the entire song'
    ]
  }
];

export interface SimpleAblationRow {
  name: string;
  simpleName: string;
  simpleDescription: string;
  accuracy: string;
  macroF1: string;
  isMain: boolean;
  takeaway: string;
}

export const SIMPLE_ABLATION_ROWS: SimpleAblationRow[] = [
  {
    name: 'Full Mix (Standard)',
    simpleName: 'Without Splitting (Standard Way)',
    simpleDescription: 'Checks the whole song mixed together without separating voice and instruments.',
    accuracy: '84.2%',
    macroF1: '83.5%',
    isMain: false,
    takeaway: 'Often gets confused when a song mixes real singing with an AI beat.'
  },
  {
    name: 'Instruments Only',
    simpleName: 'Instruments Only',
    simpleDescription: 'Only looks at the background music; ignores the singer entirely.',
    accuracy: '88.5%',
    macroF1: '87.9%',
    isMain: false,
    takeaway: 'Great at finding AI beats, but completely blind to human vocals.'
  },
  {
    name: 'Voice Only',
    simpleName: 'Voice Only',
    simpleDescription: 'Only listens to the singer\'s voice, pitch, and breathing.',
    accuracy: '76.4%',
    macroF1: '75.2%',
    isMain: false,
    takeaway: 'Catches human breathing, but misses clues in songs with heavy instruments.'
  },
  {
    name: 'Split Without Smart Balance',
    simpleName: 'Split, but Equal Weighting',
    simpleDescription: 'Separates the song, but treats voice and instruments equally 50/50 every time.',
    accuracy: '91.1%',
    macroF1: '90.5%',
    isMain: false,
    takeaway: 'Good improvement, but can\'t adjust when one part is much clearer than the other.'
  },
  {
    name: 'Know-Ta! (Full System)',
    simpleName: 'Know-Ta! (Full Dual-Branch)',
    simpleDescription: 'Separates voice & instruments, checks both, and dynamically balances the clues.',
    accuracy: '93.7%',
    macroF1: '93.3%',
    isMain: true,
    takeaway: 'Highest accuracy and the only system that spots hybrid human/AI tracks!'
  }
];

export const SIMPLE_ECHOES_PROVIDERS = [
  { name: 'Suno (v5)', category: 'Popular AI Tool', recall: '95.8%', note: 'Very high detection on modern AI tracks' },
  { name: 'Udio', category: 'Popular AI Tool', recall: '94.2%', note: 'Consistently catches synthetic instruments' },
  { name: 'ElevenLabs', category: 'Voice Generator', recall: '91.2%', note: 'Catches AI singing via lack of natural breaths' },
  { name: 'Stable Audio', category: 'New AI Generator', recall: '89.4%', note: 'Detected without prior training' },
  { name: 'AudioLDM', category: 'Research Generator', recall: '88.1%', note: 'Caught by instrument branch' },
  { name: 'MusicGen', category: 'Meta AI Generator', recall: '86.3%', note: 'Synthetic sound patterns identified' },
  { name: 'Mubert', category: 'Loop Generator', recall: '87.5%', note: 'Periodicity patterns detected' },
  { name: 'Riffusion', category: 'Visual Sound AI', recall: '80.9%', note: 'Diffusion noise spotted' }
];

export interface CalibrationPoint {
  bin: string;
  ideal: number;
  beforeScaling: number;
  afterScaling: number;
}

export const CALIBRATION_DATA: CalibrationPoint[] = [
  { bin: '0.0 - 0.1', ideal: 0.05, beforeScaling: 0.12, afterScaling: 0.06 },
  { bin: '0.1 - 0.2', ideal: 0.15, beforeScaling: 0.24, afterScaling: 0.16 },
  { bin: '0.2 - 0.3', ideal: 0.25, beforeScaling: 0.37, afterScaling: 0.26 },
  { bin: '0.3 - 0.4', ideal: 0.35, beforeScaling: 0.46, afterScaling: 0.36 },
  { bin: '0.4 - 0.5', ideal: 0.45, beforeScaling: 0.54, afterScaling: 0.46 },
  { bin: '0.5 - 0.6', ideal: 0.55, beforeScaling: 0.62, afterScaling: 0.54 },
  { bin: '0.6 - 0.7', ideal: 0.65, beforeScaling: 0.73, afterScaling: 0.66 },
  { bin: '0.7 - 0.8', ideal: 0.75, beforeScaling: 0.85, afterScaling: 0.76 },
  { bin: '0.8 - 0.9', ideal: 0.85, beforeScaling: 0.94, afterScaling: 0.86 },
  { bin: '0.9 - 1.0', ideal: 0.95, beforeScaling: 0.99, afterScaling: 0.95 }
];

export const CALIBRATION_METRICS = {
  eceBefore: '0.084',
  eceAfter: '0.018',
  brierBefore: '0.098',
  brierAfter: '0.034',
  tempScalarT: '1.42'
};

export const DATASET_PROFILES = [
  {
    name: 'SONICS (AI Music)',
    badge: 'AI Training Songs',
    license: 'CC BY-NC 4.0',
    description: 'A large collection of synthetic songs made with Suno and Udio. Used to train the neural network to spot computer patterns.',
    stats: '34,000 train / 2,300 val / 12,800 test songs',
    usage: 'AI training set'
  },
  {
    name: 'Free Music Archive (FMA)',
    badge: 'Real Human Songs',
    license: 'Creative Commons (CC-BY)',
    description: 'An open collection of real human independent music. Grouped strictly by artist so the model never sees the same singer in training and testing.',
    stats: 'Acoustic & Studio tracks · 30-sec clips',
    usage: 'Real human reference data'
  },
  {
    name: 'Echoes Benchmark',
    badge: 'Zero-Shot Cross-Platform',
    license: 'CC-BY-SA',
    description: '4,468 songs from 12 brand-new AI tools, kept completely hidden from the detector until the final exam to test generalization.',
    stats: '10 unseen + 2 seen generators · 4,468 tracks',
    usage: 'Examining unfamiliar AI tools'
  },
  {
    name: 'AIME Instrumental Set',
    badge: 'Instrumental Only',
    license: 'Research Open Access',
    description: '6,000 instrumental AI tracks used to test the instrument branch on tracks with no vocals.',
    stats: '6,000 AI tracks / 500 Real tracks',
    usage: 'Instrument-only evaluation'
  }
];

export const SIMPLE_LIMITS = [
  {
    title: '1. English Singing Only For Now',
    simple: 'This study currently tests English songs with singing. Filipino, OPM, and local languages have unique vocal styles and are planned for future updates.'
  },
  {
    title: '2. Sound Quality Limit (Standard Bandwidth)',
    simple: 'To keep the system fast on everyday computers, audio is processed up to 11 kHz. Very high ultrasound frequencies aren\'t checked.'
  },
  {
    title: '3. What if a Song is Instrumental Only?',
    simple: 'If a song has no singing at all, Know-Ta! focuses 100% on the instrument branch and lets you know that no vocals were found.'
  },
  {
    title: '4. An Estimation, Not Legal Proof',
    simple: 'Know-Ta! provides a percentage likelihood and uncertainty spread. It is an educational and forensic helper, not a courtroom fact, and should never be used to falsely accuse artists.'
  }
];

export const AUTHORS = [
  { name: 'Kent Paulo R. Delgado', role: 'Lead Researcher & Architecture Design' },
  { name: 'Earl Josh B. Delgado', role: 'Co-Researcher & Audio Forensics' },
  { name: 'John Renan N. Labay', role: 'Co-Researcher & Model Evaluation' }
];

export const INSTITUTION = {
  college: 'College of Information and Computing',
  university: 'University of Southeastern Philippines',
  location: 'Davao City, Philippines',
  program: 'Bachelor of Science in Computer Science',
  course: 'Undergraduate Thesis',
  date: '2026'
};
