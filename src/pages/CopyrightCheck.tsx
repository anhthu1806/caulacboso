import React, { useState } from 'react';
import { callGeminiAI } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

export default function CopyrightCheck() {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!content.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung cần kiểm tra!', 'warning');
      return;
    }

    setIsLoading(true);
    const prompt = `
      Bạn là một chuyên gia về bản quyền và sở hữu trí tuệ. Hãy phân tích đoạn văn bản sau đây và:
      1. Xác định các rủi ro bản quyền tiềm ẩn (nếu có).
      2. Đưa ra lời khuyên về cách trích dẫn nguồn hợp lệ.
      3. Gợi ý cách viết lại để tránh đạo văn nếu cần thiết.
      4. Đánh giá mức độ an toàn để đăng tải công khai (Thang điểm 1-10).
      
      Nội dung cần kiểm tra:
      "${content}"
    `;
    
    const response = await callGeminiAI(prompt);
    if (response) {
      setAnalysis(response);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Kiểm tra Bản quyền & Đạo văn</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Công cụ hỗ trợ phát hiện các vấn đề bản quyền tiềm ẩn và hướng dẫn trích dẫn nguồn đúng quy định trước khi bạn đăng tải nội dung.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nội dung văn bản cần kiểm tra
          </label>
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            placeholder="Dán nội dung bài viết, kịch bản hoặc đoạn văn của bạn vào đây..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCheck}
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-halved"></i>
                  Kiểm tra ngay
                </>
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-contract text-blue-600"></i>
              Kết quả phân tích
            </h3>
            <div className="prose prose-slate max-w-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-copyright"></i>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">Hiểu về Bản quyền</h4>
          <p className="text-sm text-slate-600">Luôn xin phép tác giả hoặc sử dụng tài nguyên miễn phí bản quyền (CC0).</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-quote-right"></i>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">Trích dẫn nguồn</h4>
          <p className="text-sm text-slate-600">Ghi rõ tên tác giả, nguồn gốc và liên kết gốc khi sử dụng nội dung của người khác.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">Trách nhiệm số</h4>
          <p className="text-sm text-slate-600">Không lan truyền tin giả, nội dung độc hại hoặc vi phạm pháp luật.</p>
        </div>
      </div>
    </div>
  );
}
