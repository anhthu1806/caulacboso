import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Step } from '../types';
import { callGeminiAI, generateExplanationPrompt } from '../services/gemini';

interface ExplanationPanelProps {
  step: Step | null;
  algorithmName: string;
  apiKey: string;
  model: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step, algorithmName, apiKey, model }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!step) {
      setExplanation('Hãy bắt đầu mô phỏng để xem giải thích.');
      return;
    }

    // If we have a pre-defined description in the step, use it first
    setExplanation(step.description);

    // If API key is present, we can fetch AI explanation
    // But to save tokens/quota, maybe we only fetch if user asks?
    // Or we can fetch automatically for "key steps"?
    // For this demo, let's just use the static description and add a button "Ask AI for more details"
    // OR we can fetch a short summary if it's a new step type.
    
    // Let's implement the "Ask AI" feature instead of auto-fetching every step to be safe with quota.
    setLoading(false);
    setError(null);

  }, [step]);

  const handleAskAI = async () => {
    if (!step || !apiKey) return;

    setLoading(true);
    setError(null);
    try {
      const prompt = generateExplanationPrompt(algorithmName, step.array, step.target, step.description);
      const aiResponse = await callGeminiAI(prompt, apiKey, model);
      if (aiResponse) {
        setExplanation(aiResponse);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          Giải thích & AI Tutor
        </h3>
        {apiKey && !loading && (
          <button
            onClick={handleAskAI}
            className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3 h-3" />
            Hỏi AI chi tiết
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto prose dark:prose-invert prose-sm max-w-none">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang suy nghĩ...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        ) : (
          <ReactMarkdown>{explanation}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
