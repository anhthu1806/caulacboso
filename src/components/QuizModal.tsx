import React, { useState, useEffect } from 'react';
import { X, Trophy, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { callGeminiAI, generateQuizPrompt } from '../services/gemini';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithmName: string;
  apiKey: string;
  model: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, algorithmName, apiKey, model }) => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !question) {
      fetchQuestion();
    }
  }, [isOpen]);

  const fetchQuestion = async () => {
    if (!apiKey) {
      setError('Vui lòng nhập API Key trong cài đặt để tạo câu hỏi.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestion(null);
    setSelectedOption(null);

    try {
      const prompt = generateQuizPrompt(algorithmName);
      const response = await callGeminiAI(prompt, apiKey, model);
      
      if (!response) throw new Error('Không nhận được phản hồi từ AI.');

      // Parse JSON from response (handle potential markdown code blocks)
      const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonString);
      
      setQuestion({
        id: Date.now(),
        algorithm: 'linear', // Placeholder, doesn't matter for display
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation
      });

    } catch (err: any) {
      console.error(err);
      setError('Lỗi khi tạo câu hỏi: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);

    if (question && index === question.correctAnswer) {
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Thử thách kiến thức
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p>AI đang soạn câu hỏi cho bạn...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-600 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : question ? (
          <div className="space-y-6">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
              {question.question}
            </p>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                let optionClass = "w-full p-4 rounded-xl border-2 text-left transition-all relative ";
                
                if (selectedOption === null) {
                  optionClass += "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer";
                } else {
                  if (index === question.correctAnswer) {
                    optionClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                  } else if (index === selectedOption) {
                    optionClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                  } else {
                    optionClass += "border-slate-200 dark:border-slate-700 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={optionClass}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    
                    {selectedOption !== null && index === question.correctAnswer && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className={`p-4 rounded-xl ${selectedOption === question.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-50 dark:bg-blue-900/20'} animate-in fade-in slide-in-from-bottom-4`}>
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  {selectedOption === question.correctAnswer ? (
                    <span className="text-green-700 dark:text-green-400">Chính xác! 🎉</span>
                  ) : (
                    <span className="text-slate-700 dark:text-slate-300">Giải thích:</span>
                  )}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {question.explanation}
                </p>
                
                <button 
                  onClick={fetchQuestion}
                  className="mt-4 px-4 py-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Câu hỏi tiếp theo
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
