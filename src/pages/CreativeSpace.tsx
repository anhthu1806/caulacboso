import React, { useState } from 'react';
import { callGeminiAI } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

export default function CreativeSpace() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'idea' | 'outline' | 'review'>('idea');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung yêu cầu!', 'warning');
      return;
    }

    setIsLoading(true);
    let systemPrompt = '';
    
    switch (mode) {
      case 'idea':
        systemPrompt = 'Bạn là một trợ lý sáng tạo nội dung cho học sinh. Hãy giúp tạo ra các ý tưởng sáng tạo, độc đáo và phù hợp lứa tuổi học sinh dựa trên yêu cầu sau. Đảm bảo nội dung lành mạnh, tích cực.';
        break;
      case 'outline':
        systemPrompt = 'Bạn là một chuyên gia biên tập. Hãy giúp lập dàn ý chi tiết cho nội dung sau. Cấu trúc rõ ràng, logic.';
        break;
      case 'review':
        systemPrompt = 'Bạn là một chuyên gia kiểm duyệt nội dung và bản quyền. Hãy đánh giá nội dung sau về mặt đạo đức, an toàn thông tin và các vấn đề bản quyền tiềm ẩn. Đưa ra lời khuyên cụ thể để cải thiện.';
        break;
    }

    const fullPrompt = `${systemPrompt}\n\nYêu cầu của người dùng: ${prompt}`;
    
    const response = await callGeminiAI(fullPrompt);
    
    if (response) {
      setResult(response);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Không gian Sáng tạo AI</h2>
          <p className="text-slate-500">Sử dụng AI để phát triển ý tưởng và hoàn thiện nội dung của bạn.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => setMode('idea')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'idea' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-lightbulb mr-2"></i>Tìm ý tưởng
          </button>
          <button
            onClick={() => setMode('outline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'outline' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-list-check mr-2"></i>Lập dàn ý
          </button>
          <button
            onClick={() => setMode('review')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'review' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-magnifying-glass mr-2"></i>Đánh giá
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input Area */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Nhập yêu cầu của bạn</span>
            <button 
              onClick={() => setPrompt('')}
              className="text-xs text-slate-500 hover:text-red-500"
            >
              Xóa trắng
            </button>
          </div>
          <textarea
            className="flex-1 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Ví dụ: Hãy gợi ý cho tôi 5 ý tưởng làm video TikTok về chủ đề bảo vệ môi trường trường học..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Đang suy nghĩ...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Tạo nội dung với AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Kết quả từ AI</span>
            {result && (
              <button 
                onClick={() => {navigator.clipboard.writeText(result); Swal.fire('Đã sao chép!', '', 'success')}}
                className="text-xs text-blue-600 hover:underline"
              >
                <i className="fa-regular fa-copy mr-1"></i>Sao chép
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
            {result ? (
              <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <i className="fa-solid fa-robot text-6xl mb-4 opacity-20"></i>
                <p>Kết quả sẽ hiển thị tại đây</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
