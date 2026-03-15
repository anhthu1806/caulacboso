export type AlgorithmType = 'linear' | 'binary';

export interface Step {
  id: number;
  array: number[];
  target: number;
  currentIndex: number;
  low?: number;
  high?: number;
  mid?: number;
  found: boolean;
  description: string;
  codeLine?: number;
}

export interface Algorithm {
  id: AlgorithmType;
  name: string;
  description: string;
  icon: string;
  complexity: {
    time: string;
    space: string;
  };
}

export interface QuizQuestion {
  id: number;
  algorithm: AlgorithmType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  speed: number;
}

export interface UserProgress {
  completedAlgorithms: AlgorithmType[];
  quizScores: Record<AlgorithmType, number>;
}
