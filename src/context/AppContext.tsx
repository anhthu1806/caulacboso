import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, INITIAL_PROGRESS } from '../data/mock';

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  progress: UserProgress;
  updateProgress: (newProgress: Partial<UserProgress>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('app_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
    else localStorage.removeItem('gemini_api_key');
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('app_progress', JSON.stringify(progress));
  }, [progress]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
  };

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // Implement actual theme switching logic (e.g., adding class to body)
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, progress, updateProgress, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
