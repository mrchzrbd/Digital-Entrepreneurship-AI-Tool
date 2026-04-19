export interface Insight {
  title: string;
  detail: string;
  frequency: string;
}

export interface Priority {
  rank: number;
  item: string;
  urgency: 'high' | 'medium' | 'low';
  impact: string;
}

export interface Action {
  action: string;
  why: string;
  timeframe: string;
  completed?: boolean;
}

export interface AnalysisResult {
  summary: string;
  topSignal: string;
  insights: Insight[];
  priorities: Priority[];
  actions: Action[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  urgencyScore?: number;
  topThemes?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
