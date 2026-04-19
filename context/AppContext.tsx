'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnalysisResult } from '@/types';

export interface HistoryEntry {
  id: string;
  date: string;
  inputPreview: string;
  results: AnalysisResult;
  source: 'text' | 'csv';
}

interface AppContextType {
  currentResults: AnalysisResult | null;
  setCurrentResults: (r: AnalysisResult | null) => void;
  currentInput: string;
  setCurrentInput: (s: string) => void;
  history: HistoryEntry[];
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (b: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentResults, setCurrentResults] = useState<AnalysisResult | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('copilot_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  function addToHistory(entry: HistoryEntry) {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem('copilot_history', JSON.stringify(updated));
      return updated;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('copilot_history');
  }

  return (
    <AppContext.Provider value={{
      currentResults, setCurrentResults,
      currentInput, setCurrentInput,
      history, addToHistory, clearHistory,
      isAnalyzing, setIsAnalyzing,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
